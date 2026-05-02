import { createClientServer } from '../../../lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { redirect } from 'next/navigation';
import { Download, Lock, Zap, Heart } from 'lucide-react';
import CommentsSection from './components/CommentsSection';
import ArticleLikeButton from './components/ArticleLikeButton';   // ← Nouveau
import BuyGumroadButton from './components/BuyGumroadButton';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

function getPublicUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/post-covers/${path}`;
}

// SEO
export async function generateMetadata({ params: paramsPromise }) {
  const params = await paramsPromise;
  const supabase = await createClientServer();

  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, image_url")
    .eq("slug", params.slug)
    .maybeSingle()

  if (!post) return { title: "Article introuvable" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [getPublicUrl(post.image_url)]
    }
  };
}

export default async function ArticlePage({ params: paramsPromise }) {
  const params = await paramsPromise;
  const supabase = await createClientServer();

  // 🔐 Vérification authentification
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect(`/login?redirect=/article/${params.slug}`);
  }

  // 📄 Récupération de l'article
  const { data: post, error: postError  } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .maybeSingle()

  if (postError || !post) {
    console.error('Article non trouvé:', postError);
    return (
      <div className="aurora-bg min-h-screen py-20 text-center">
        <p className="text-3xl text-zinc-400">Article non trouvé</p>
      </div>
    );
  }

  // 💳 Vérification achat (SaaS lock)
  const { data: purchase } = await supabase
    .from('purchases')
    .select('*')
    .eq('user_email', session.user.email)
    .eq('product_id', post.product_id)
    .maybeSingle()

  // 🔐 Génération du signed URL pour le PDF (si acheté)
  let signedUrl = null;

  if (purchase && post.pdf_url) {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    try {
      const { data, error } = await supabaseAdmin.storage
        .from('pdfs')
        .createSignedUrl(post.pdf_url, 3600);

      if (error) {
        console.error('Erreur signed URL:', error);
      } else {
        signedUrl = data?.signedUrl || null;
      }
    } catch (err) {
      console.error('Erreur lors de la création du signed URL:', err);
    }
  }

  return (
    <div className="aurora-bg min-h-screen relative overflow-hidden">
  
      {/* 🌌 FX BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.15),transparent_45%),radial-gradient(circle_at_bottom,rgba(236,72,153,0.12),transparent_45%)] pointer-events-none" />
      
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.04),transparent)] animate-pulse pointer-events-none" />

      <div className="relative z-10">
        {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black/30 z-50">
        <div id="progress-bar" className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 w-0 transition-all" />
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* IMAGE HEADER */}
        {/* Image de couverture */}
        {post.image_url && (
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-12 group bg-zinc-900 
          hover:scale-[1.01] transition duration-700">

            {/* glow dynamique */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-t from-cyan-500/10 via-transparent to-pink-500/10 pointer-events-none" />

            <img
              src={getPublicUrl(post.image_url)}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-cyan-400/20 pointer-events-none" />

            <div className="absolute top-6 right-6 px-5 py-2 text-xs tracking-wider bg-black/60 backdrop-blur-md border border-cyan-400/30 text-cyan-300 rounded-full pointer-events-none">
              CONTENU EXCLUSIF
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="flex gap-3 mb-10">
          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 
          hover:border-cyan-400/40 hover:text-white transition">
            ⚡ Lecture immersive
          </div>

          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300">
            🧠 Analyse avancée
          </div>

          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300">
            🚀 Stratégies actionnables
          </div>
        </div>

        {/* TITRE + LIKE COUNTER */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
          <h1 className="text-6xl md:text-7xl font-bold tracking-[-3px] leading-none flex-1
            bg-gradient-to-r from-white via-cyan-200 to-pink-300 bg-clip-text text-transparent
            drop-shadow-[0_0_30px_rgba(34,211,238,0.15)]">
            {post.title}
          </h1>

          {/* Compteur de likes près du titre */}
          <ArticleLikeButton 
            postId={post.id} 
            className="hover:scale-110 transition-all duration-300 
            shadow-[0_0_25px_rgba(34,211,238,0.25)]"
          />
        </div>

        {/* META */}
        <div className="flex items-center gap-4 text-zinc-400 mb-12 border-b border-white/10 pb-8">
          <span>
            Publié le {new Date(post.created_at).toLocaleDateString('fr-FR')}
          </span>

          {post.category && (
            <span className="px-4 py-1 bg-white/5 border border-cyan-400/30 text-cyan-400 text-sm rounded-full">
              {post.category}
            </span>
          )}
        </div>

        {/* CONTENU DE L'ARTICLE */}
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 via-violet-500/10 to-pink-500/20 blur-3xl opacity-50 pointer-events-none" />

          <div className="relative bg-zinc-950/80 border border-cyan-400/20 rounded-3xl p-10 md:p-16 
            backdrop-blur-2xl shadow-2xl 
            animate-[fadeUp_0.6s_ease-out]
            hover:shadow-[0_0_120px_-30px_rgba(34,211,238,0.25)] transition">
            <div className="cyber-prose">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-5xl font-bold mt-16 mb-10 tracking-[-2px] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white/90 to-pink-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                      {children}
                    </h1>
                  ),

                  h2: ({ children }) => (
                    <h2 className="text-4xl font-bold mt-16 mb-8 tracking-tight text-cyan-200 border-b border-cyan-400/20 pb-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                      {children}
                    </h2>
                  ),

                  h3: ({ children }) => (
                    <h3 className="text-3xl font-semibold mt-14 mb-6 text-pink-200 drop-shadow-[0_0_12px_rgba(236,72,153,0.15)]">
                      {children}
                    </h3>
                  ),

                  h4: ({ children }) => (
                    <h4 className="text-lg font-medium mt-8 mb-4 text-zinc-400/80 bg-white/5 border border-white/10 px-4 py-3 rounded-xl">
                      {children}
                    </h4>
                  ),

                  p: ({ children }) => {
                    const text = children?.toString() || '';
                    if (text.startsWith('->')) {
                      return (
                        <div className="my-10 p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border border-cyan-400/30 text-cyan-200 text-lg font-medium shadow-lg shadow-cyan-500/10">
                          ⚡ {text.replace('->', '').trim()}
                        </div>
                      );
                    }
                    if (text.startsWith('💡')) {
                      return (
                        <div className="my-10 p-6 rounded-2xl bg-blue-500/10 border border-blue-400 text-blue-200">
                          💡 {text.replace('💡', '').trim()}
                        </div>
                      );
                    }
                    if (text.startsWith('🔥')) {
                      return (
                        <div className="my-10 p-6 rounded-2xl bg-yellow-500/10 border border-yellow-400 text-yellow-200">
                          🔥 {text.replace('🔥', '').trim()}
                        </div>
                      );
                    }
                    if (text.includes('⚠️')) {
                      return (
                        <div className="my-10 p-6 rounded-2xl bg-pink-500/10 border border-pink-400 text-pink-200 font-medium shadow-lg shadow-pink-500/10">
                          {children}
                        </div>
                      );
                    }
                    return (
                      <p className="text-[17.5px] leading-relaxed text-zinc-200 mb-8
                        hover:text-zinc-100 transition">
                        {children}
                      </p>
                    );
                  },

                  ul: ({ children }) => <ul className="my-10 space-y-4 pl-6">{children}</ul>,

                  li: ({ children }) => (
                    <li className="relative pl-4 text-zinc-300 before:content-['⚡'] before:absolute before:left-0 before:text-cyan-400">
                      {children}
                    </li>
                  ),

                  strong: ({ children }) => (
                    <strong className="text-cyan-300 font-semibold">{children}</strong>
                  ),

                  blockquote: ({ children }) => (
                    <blockquote className="my-12 border-l-4 border-pink-500 pl-8 py-4 text-zinc-300 italic bg-zinc-900/50 rounded-r-2xl shadow-inner">
                      {children}
                    </blockquote>
                  ),

                  code: ({ inline, children }) =>
                    inline ? (
                      <code className="bg-zinc-900 px-2 py-1 rounded text-pink-300 text-sm font-mono">
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-black border border-cyan-400/30 rounded-2xl p-6 overflow-x-auto my-10 text-sm
                        shadow-[0_0_40px_-15px_rgba(34,211,238,0.25)] hover:border-pink-400/30 transition">
                        <code className="text-cyan-200 font-mono">{children}</code>
                      </pre>
                    ),

                  hr: () => (
                    <div className="my-16 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                  ),

                  a: ({ href }) => {
                    if (href.includes('youtube.com')) {
                      const videoId = href.split('v=')[1];
                      return (
                        <iframe
                          className="w-full aspect-video rounded-2xl my-10"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          allowFullScreen
                        />
                      );
                    }

                    return <a className="text-cyan-400 underline" href={href}>{href}</a>;
                  }
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* SECTION COMMENTAIRES */}
        <CommentsSection postId={post.id} />

        {/* 💳 BOUTON ACHAT GUMROAD */}
        {post.pdf_url && !purchase && (
          <div className="mt-20 text-center relative z-30">
            <div className="border border-pink-400/30 rounded-3xl p-10 bg-zinc-950/80 backdrop-blur-xl relative overflow-hidden">

              <Lock className="w-11 h-11 mx-auto text-pink-400 mb-5" />

              <h3 className="text-2xl font-bold text-white mb-3">
                Contenu verrouillé
              </h3>

              <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                Débloquer le PDF complet
              </p>

              {/* Bouton Gumroad */}
              <BuyGumroadButton gumroadLink={post.pdf_url} />

            </div>
          </div>
        )}

        {/* 📄 PDF SI ACHAT OK */}
        {post.pdf_url && purchase && (
          <div className="mt-20 text-center">

            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
              <Download className="w-10 h-10 text-black" />
            </div>

            <h3 className="text-3xl font-bold text-white mb-3">
              PDF débloqué
            </h3>

            <p className="text-zinc-400 mb-6">
              Accès sécurisé instantané
            </p>

            {/* 🔐 Sécurité : signed URL obligatoire */}
            {signedUrl ? (
              <a
                href={signedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 bg-gradient-to-r from-cyan-400 to-pink-500 text-black rounded-2xl font-bold hover:scale-105 transition inline-block"
              >
                Télécharger PDF ⚡
              </a>
            ) : (
              <div className="text-red-400 font-medium">
                ⚠️ Impossible de générer le lien sécurisé
              </div>
            )}

          </div>
        )}

      </div>
    </div>
    </div>
  );
}