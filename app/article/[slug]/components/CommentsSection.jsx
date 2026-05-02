'use client';

import { useState, useEffect } from 'react';
import { createClient } from ".././../../../lib/supabase/client";
import { Heart } from 'lucide-react';

export default function CommentsSection({ postId }) {
  const supabase = createClient();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [articleLikes, setArticleLikes] = useState(0);
  const [hasLikedArticle, setHasLikedArticle] = useState(false);

  // Récupérer l'utilisateur
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();
  }, []);

  // Charger les commentaires + likes article
  const fetchData = async () => {
    // Commentaires avec détails
    const { data: commentsData } = await supabase
      .from('comments_with_details')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    setComments(commentsData || []);

    // Compteur de likes sur l'article
    const { count: likesCount } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    setArticleLikes(likesCount || 0);

    // Vérifier si l'utilisateur a déjà liké l'article
    if (user) {
      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
       .maybeSingle();

      setHasLikedArticle(!!data);
    }
  };

  useEffect(() => {
    fetchData();
  }, [postId, user]);

  // Like / Unlike l'article entier
  const toggleArticleLike = async () => {
    if (!user) return;

    if (hasLikedArticle) {
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

    fetchData(); // Rafraîchir
  };

  // Ajouter un commentaire
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setLoading(true);
    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content: newComment.trim(),
        parent_id: null
      });

    if (!error) {
      setNewComment('');
      fetchData();
    }
    setLoading(false);
  };

  // Répondre à un commentaire
  const handleSubmitReply = async (parentId) => {
    if (!replyContent.trim() || !user) return;

    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content: replyContent.trim(),
        parent_id: parentId
      });

    if (!error) {
      setReplyContent('');
      setReplyingTo(null);
      fetchData();
    }
  };

  // Liker un commentaire
  const toggleCommentLike = async (commentId) => {
    if (!user) return;

    const { data: existing } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (existing) {
      await supabase.from('comment_likes').delete().eq('id', existing.id);
    } else {
      await supabase.from('comment_likes').insert({
        comment_id: commentId,
        user_id: user.id
      });
    }
    fetchData();
  };

  const mainComments = comments.filter(c => !c.parent_id);
  const getReplies = (parentId) => comments.filter(c => c.parent_id === parentId);

  return (
    <div className="mt-20">
      {/* Like sur l'article */}
      <div className="flex items-center justify-between mb-10 border-b border-zinc-700 pb-8">
        <h2 className="text-3xl font-bold text-white">Commentaires ({comments.length})</h2>
        
        <button
          onClick={toggleArticleLike}
          className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all ${
            hasLikedArticle 
              ? 'bg-rose-500/10 text-rose-400' 
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white'
          }`}
        >
          <Heart className={`w-6 h-6 ${hasLikedArticle ? 'fill-current' : ''}`} />
          <span className="font-medium">{articleLikes}</span>
        </button>
      </div>

      {/* Formulaire principal */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-12">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Écris un commentaire public..."
            className="w-full bg-zinc-900 border border-cyan-400/30 rounded-2xl p-5 text-zinc-200 focus:outline-none focus:border-cyan-400 min-h-[130px]"
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="mt-4 px-8 py-3 bg-gradient-to-r from-cyan-500 to-rose-500 rounded-2xl font-semibold disabled:opacity-50"
          >
            {loading ? 'Publication en cours...' : 'Publier le commentaire'}
          </button>
        </form>
      ) : (
        <p className="text-zinc-400 mb-12 text-center">Connecte-toi pour laisser un commentaire.</p>
      )}

      {/* Liste des commentaires */}
      <div className="space-y-10">
        {mainComments.length === 0 && (
          <p className="text-zinc-400 text-center py-16">
            Aucun commentaire pour le moment. Sois le premier !
          </p>
        )}

        {mainComments.map((comment) => {
          const replies = getReplies(comment.id);

          return (
            <div key={comment.id} className="bg-zinc-900/80 border border-zinc-700 rounded-3xl p-7">
              <div className="flex items-start gap-4">
                <img
                  src={comment.avatar_url || '/default-avatar.png'}
                  alt={comment.full_name}
                  className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-white">{comment.full_name}</p>
                    <p className="text-xs text-zinc-500">
                      {new Date(comment.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  <p className="text-zinc-300 leading-relaxed mb-5">{comment.content}</p>

                  <div className="flex items-center gap-6 text-sm">
                    <button
                      onClick={() => toggleCommentLike(comment.id)}
                      className="flex items-center gap-1.5 hover:text-rose-400 transition-colors"
                    >
                      ❤️ <span>{comment.likes_count || 0}</span>
                    </button>

                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="text-cyan-400 hover:text-cyan-300 transition"
                    >
                      Répondre
                    </button>
                  </div>

                  {/* Zone de réponse */}
                  {replyingTo === comment.id && (
                    <div className="mt-6 pl-4 border-l-2 border-cyan-400">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Écrire une réponse..."
                        className="w-full bg-zinc-800 border border-cyan-400/30 rounded-2xl p-4 text-sm min-h-[80px]"
                      />
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => handleSubmitReply(comment.id)}
                          className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-black rounded-xl text-sm font-medium"
                        >
                          Répondre
                        </button>
                        <button
                          onClick={() => { setReplyingTo(null); setReplyContent(''); }}
                          className="px-6 py-2 text-zinc-400 hover:text-white"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Affichage des réponses */}
                  {replies.length > 0 && (
                    <div className="mt-8 pl-12 space-y-6">
                      {replies.map((reply) => (
                        <div key={reply.id} className="bg-zinc-800/60 border-l-4 border-cyan-500 pl-5 py-4 rounded-r-2xl">
                          <div className="flex items-center gap-3 mb-2">
                            <img
                              src={reply.avatar_url || '/default-avatar.png'}
                              alt={reply.full_name}
                              className="w-8 h-8 rounded-full"
                            />
                            <p className="font-medium text-sm text-white">{reply.full_name}</p>
                          </div>
                          <p className="text-zinc-300 text-[15px]">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}