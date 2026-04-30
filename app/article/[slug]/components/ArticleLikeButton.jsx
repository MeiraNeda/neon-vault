'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Heart } from 'lucide-react';

export default function ArticleLikeButton({ postId }) {
  const supabase = createClient();
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      // Nombre total de likes
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      setLikesCount(count || 0);

      // Vérifier si l'utilisateur a déjà liké
      if (session?.user) {
        const { data } = await supabase
          .from('likes')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', session.user.id)
          .single();

        setHasLiked(!!data);
      }
    };

    init();
  }, [postId]);

  const toggleLike = async () => {
    if (!user) return;

    if (hasLiked) {
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('likes')
        .insert({ post_id: postId, user_id: user.id });
    }

    // Rafraîchir
    const { count } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    setLikesCount(count || 0);
    setHasLiked(!hasLiked);
  };

  return (
    <button
      onClick={toggleLike}
      className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-medium text-sm border ${
        hasLiked 
          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
          : 'bg-zinc-900 border-zinc-700 hover:border-zinc-600 text-zinc-400 hover:text-white'
      }`}
    >
      <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
      <span>{likesCount}</span>
    </button>
  );
}