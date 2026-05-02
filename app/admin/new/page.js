'use client';

import { useState } from 'react';
import { useSupabase } from '../../../components/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Zap, Eye } from 'lucide-react';   // ← Import corrigé + Eye pour cohérence

const categories = [
  "ARGENT EN LIGNE", "TIKTOK / RÉSEAUX SOCIAUX", "INSTAGRAM / CONTENU",
  "BUSINESS EN LIGNE", "COMPÉTENCES / PRODUCTIVITÉ", "FITNESS / PERTE DE POIDS",
  "GAMING / STREAMING", "DÉVELOPPEMENT PERSONNEL", "ANIMAUX",
  "ARGENT / INVESTISSEMENT", "RÉSEAUX SOCIAUX / CONTENU VIRAL",
  "FREELANCE / TRAVAIL EN LIGNE", "E-COMMERCE / DROPSHIPPING"
];

export default function NewPostPage() {
  const { supabase } = useSupabase();
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: '',
    published: true,
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file, insertInContent = false) => {
    if (!file) return;

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop().toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `new/${fileName}`;

      const { error } = await supabase.storage
        .from('post-covers')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('post-covers')
        .getPublicUrl(filePath);

      // 👉 Image de couverture
      if (!insertInContent) {
        setForm(prev => ({ ...prev, image_url: publicUrl }));
      }

      // 👉 insertion dans Markdown
      if (insertInContent) {
        setForm(prev => ({
          ...prev,
          content: prev.content + `\n\n![image](${publicUrl})\n\n`
        }));
      }

    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from('posts').insert([form]);

    if (error) {
      alert('Erreur : ' + error.message);
    } else {
      alert('Article publié avec succès dans le vault !');
      router.push('/admin');
      router.refresh();
    }
    setSaving(false);
  };

  return (
    <div className="aurora-bg min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-5xl font-bold tracking-[-2px] neon-text">Créer un nouvel article</h1>
          <p className="text-zinc-400 mt-3 text-xl">Ajoute du contenu exclusif au réseau cyber</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-8 glass-neon p-10 rounded-3xl">
            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Titre</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:border-cyan-400 focus:outline-none text-white placeholder-zinc-500"
                placeholder="Titre de l'article"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Slug (URL)</label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:border-cyan-400 focus:outline-none font-mono text-white placeholder-zinc-500"
                placeholder="mon-article-futuriste"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Extrait (excerpt)</label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:border-cyan-400 focus:outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Image de couverture (URL)</label>
              <div>
                <label className="block text-sm font-medium mb-2 text-cyan-300">
                  Image de couverture
                </label>

                <div className="border-2 border-dashed border-white/20 rounded-3xl p-8 text-center">

                  <p className="text-white mb-4">Uploader une image (PNG / JPG / WebP)</p>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                    className="text-white"
                  />

                  <button
                    type="button"
                    onClick={() => document.getElementById('insertImgNew').click()}
                    className="mt-4 text-cyan-300"
                  >
                    ➕ Insérer dans l’article
                  </button>

                  <input
                    id="insertImgNew"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files[0], true)}
                  />
                </div>

                {uploading && (
                  <p className="text-cyan-400 mt-2">Upload en cours...</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Catégorie</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:border-cyan-400 focus:outline-none text-white"
              >
                <option value="">Choisir une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="Autres">Autres</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Contenu complet (Markdown)</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={18}
                className="w-full px-6 py-5 bg-black/40 border border-white/10 rounded-3xl focus:border-cyan-400 focus:outline-none font-mono text-white text-sm"
                placeholder="Écris ton article en markdown ici..."
              />
            </div>

            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={handleChange}
                className="w-6 h-6 accent-cyan-400"
              />
              <label className="text-white cursor-pointer">Publier immédiatement</label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-cyber w-full py-5 rounded-2xl font-semibold text-xl shadow-2xl flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {saving ? 'Publication en cours...' : 'Publier l’article'}
              <Zap size={24} />
            </button>
          </form>

          {/* Prévisualisation */}
          <div className="glass-neon p-10 rounded-3xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Eye size={24} /> Prévisualisation en direct
              </h2>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="text-cyan-300 hover:text-cyan-400 transition font-medium"
              >
                {previewMode ? 'Masquer' : 'Afficher'} aperçu
              </button>
            </div>

            {previewMode && (
              <div className="prose prose-invert bg-zinc-950/70 p-10 rounded-2xl min-h-[700px] border border-white/10 overflow-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {form.content || 'Le contenu de l’article apparaîtra ici en temps réel...'}
                </ReactMarkdown>
              </div>
            )}

            {!previewMode && (
              <div className="h-[700px] flex items-center justify-center text-zinc-500 border border-dashed border-white/20 rounded-2xl">
                Clique sur Afficher aperçu pour voir le rendu Markdown
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}