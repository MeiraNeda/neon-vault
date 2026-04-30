'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useRouter, useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Upload, X, Image as ImageIcon, Zap } from 'lucide-react';

const categories = [
  "ARGENT EN LIGNE", "TIKTOK / RÉSEAUX SOCIAUX", "INSTAGRAM / CONTENU",
  "BUSINESS EN LIGNE", "COMPÉTENCES / PRODUCTIVITÉ", "FITNESS / PERTE DE POIDS",
  "GAMING / STREAMING", "DÉVELOPPEMENT PERSONNEL", "ANIMAUX",
  "ARGENT / INVESTISSEMENT", "RÉSEAUX SOCIAUX / CONTENU VIRAL",
  "FREELANCE / TRAVAIL EN LIGNE", "E-COMMERCE / DROPSHIPPING"
];

const BUCKET_NAME = 'post-covers';

export default function EditPostPage() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: '',
    published: true,
  });

  const [currentImage, setCurrentImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        alert('Article non trouvé');
        router.push('/admin');
      } else {
        setForm(data);
        if (data.image_url) {
          setCurrentImage(data.image_url);
        }
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, supabase, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ✅ MODIFIÉ : upload + insertion dans contenu possible
  const handleImageUpload = async (file, insertInContent = false) => {
    if (!file) return;

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop().toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${id}/${fileName}`;

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      // 👉 Image de couverture
      if (!insertInContent) {
        setForm(prev => ({ ...prev, image_url: publicUrl }));
        setCurrentImage(publicUrl);
      }

      // 👉 Insertion dans le Markdown
      if (insertInContent) {
        setForm(prev => ({
          ...prev,
          content: prev.content + `\n\n![image](${publicUrl})\n\n`
        }));
      }

    } catch (error) {
      console.error(error);
      alert('Erreur lors de l’upload : ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const removeImage = () => {
    setForm(prev => ({ ...prev, image_url: '' }));
    setCurrentImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('posts')
      .update(form)
      .eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      alert('Article mis à jour avec succès !');
      router.push('/admin');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="aurora-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-zinc-400">Chargement depuis le vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aurora-bg min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-5xl font-bold tracking-[-2px] neon-text mb-3">Modifier l’article</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-8 glass-neon p-10 rounded-3xl">

            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Titre</label>
              <input type="text" name="title" value={form.title} onChange={handleChange}
                className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Slug</label>
              <input type="text" name="slug" value={form.slug} onChange={handleChange}
                className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl font-mono text-white" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Extrait</label>
              <textarea name="excerpt" value={form.excerpt} onChange={handleChange}
                className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white" />
            </div>

            {/* IMAGE UPLOAD */}
            <div>
              <label className="block text-sm font-medium mb-3 text-cyan-300">Image de couverture</label>

              {(currentImage || form.image_url) && (
                <div className="relative mb-6 rounded-2xl overflow-hidden border border-white/10">
                  <img src={form.image_url || currentImage} className="w-full h-64 object-cover" />
                  <button type="button" onClick={removeImage}
                    className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-red-600 rounded-full">
                    <X size={20} />
                  </button>
                </div>
              )}

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-3xl p-10 text-center ${dragActive ? 'border-cyan-400' : 'border-white/20'}`}
              >
                <Upload size={48} className="mx-auto mb-4 text-cyan-400" />

                <label className="cursor-pointer px-6 py-3 bg-white/10 rounded-2xl">
                  Choisir une image
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                  />
                </label>

                {/* 🔥 NOUVEAU : insertion dans contenu */}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  id="insertImg"
                  onChange={(e) => handleImageUpload(e.target.files[0], true)}
                />

                <label htmlFor="insertImg"
                  className="block mt-4 text-sm text-cyan-300 cursor-pointer">
                  ➕ Insérer directement dans l’article
                </label>

              </div>

              {uploading && <p className="text-cyan-400 mt-3">Upload...</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Catégorie</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white">
                <option value="">Choisir</option>
                {categories.map(cat => <option key={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Contenu</label>
              <textarea name="content" value={form.content} onChange={handleChange}
                rows={18}
                className="w-full px-6 py-5 bg-black/40 border border-white/10 rounded-3xl font-mono text-white" />
            </div>

            <button type="submit"
              className="btn-cyber w-full py-5 rounded-2xl flex justify-center gap-3">
              {saving ? 'Sauvegarde...' : 'Enregistrer'} <Zap />
            </button>

          </form>

          {/* PREVIEW */}
          <div className="glass-neon p-10 rounded-3xl">
            <h2 className="text-2xl mb-8">Prévisualisation</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {form.content || 'Rien à afficher'}
            </ReactMarkdown>
          </div>

        </div>
      </div>
    </div>
  );
}