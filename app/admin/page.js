'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from "../../components/providers/SupabaseProvider";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function AdminDashboard() {
  const { supabase } = useSupabase();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Récupérer tous les articles
  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur chargement posts:', error);
      alert('Erreur lors du chargement des articles');
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [supabase]);

  // Supprimer un article
  const handleDelete = async (id, imageUrl) => {
    if (!confirm('❌ Es-tu sûr de vouloir supprimer cet article ? Cette action est irréversible.')) {
      return;
    }

    setDeletingId(id);

    try {
      // Supprimer l'article de la base
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Supprimer l'image du storage si elle existe
      if (imageUrl) {
        try {
          const urlParts = imageUrl.split('/storage/v1/object/public/');
          if (urlParts.length > 1) {
            const filePath = urlParts[1].split('?')[0];
            await supabase.storage.from('post-covers').remove([filePath]);
          }
        } catch (storageError) {
          console.warn("Impossible de supprimer l'image du storage :", storageError);
        }
      }

      alert('Article supprimé avec succès !');
      fetchPosts(); // Rafraîchir la liste
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la suppression : ' + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="aurora-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-zinc-400">Chargement du vault administratif...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aurora-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold tracking-[-2px] neon-text">Administration du Vault</h1>
            <p className="text-zinc-400 mt-3 text-xl">Gère tes articles exclusifs</p>
          </div>
          <Link
            href="/admin/new"
            className="btn-cyber flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold"
          >
            <Plus size={24} />
            Nouvel article
          </Link>
        </div>

        <div className="glass-neon rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-white/10 bg-black/40">
                <tr>
                  <th className="px-8 py-5 text-cyan-300 font-medium">Titre</th>
                  <th className="px-8 py-5 text-cyan-300 font-medium">Catégorie</th>
                  <th className="px-8 py-5 text-cyan-300 font-medium">Statut</th>
                  <th className="px-8 py-5 text-cyan-300 font-medium">Date</th>
                  <th className="px-8 py-5 text-cyan-300 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-zinc-500">
                      Aucun article pour le moment. Crée en un !
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-white/5 transition">
                      <td className="px-8 py-6 font-medium text-white">{post.title}</td>
                      <td className="px-8 py-6 text-zinc-400">{post.category || '—'}</td>
                      <td className="px-8 py-6">
                        <span className={`inline-block px-4 py-1 rounded-full text-xs font-medium ${
                          post.published 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {post.published ? 'Publié' : 'Brouillon'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-zinc-400 text-sm">
                        {new Date(post.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/edit/${post.id}`}
                            className="p-3 text-cyan-400 hover:text-cyan-300 hover:bg-white/10 rounded-xl transition flex items-center gap-2"
                          >
                            <Edit size={20} />
                            Modifier
                          </Link>

                          <button
                            onClick={() => handleDelete(post.id, post.image_url)}
                            disabled={deletingId === post.id}
                            className="p-3 text-red-400 hover:text-red-500 hover:bg-white/10 rounded-xl transition flex items-center gap-2 disabled:opacity-50"
                          >
                            <Trash2 size={20} />
                            {deletingId === post.id ? 'Suppression...' : 'Supprimer'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-8">
          Clique sur « Modifier » pour éditer • « Supprimer » pour retirer définitivement
        </p>
      </div>
    </div>
  );
}