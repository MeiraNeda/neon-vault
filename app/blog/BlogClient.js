'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Clock, ArrowRight, Filter, Sparkles } from 'lucide-react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

function estimateReadingTime(excerpt) {
  if (!excerpt) return 3;
  const words = excerpt.split(' ').length;
  return Math.max(2, Math.ceil(words / 180));
}

/* 💎 CLEAN MEDIA CATEGORIES */
const categories = [
  "TOUT",
  "ARGENT & INVESTISSEMENT",
  "BUSINESS EN LIGNE",
  "FREELANCE & TRAVAIL EN LIGNE",
  "E-COMMERCE & DROPSHIPPING",
  "RÉSEAUX SOCIAUX",
  "TIKTOK",
  "INSTAGRAM",
  "CONTENU VIRAL",
  "COMPÉTENCES & PRODUCTIVITÉ",
  "DÉVELOPPEMENT PERSONNEL",
  "FITNESS & SANTÉ",
  "ANIMAUX",
  "GAMING & STREAMING"
];

export default function BlogClient({ initialPosts }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('TOUT');

  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 21;

  const filteredPosts = useMemo(() => {
    return initialPosts.filter(post => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        activeCategory === 'TOUT' || post.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [initialPosts, searchTerm, activeCategory]);

  // ✅ RESET PAGE WHEN FILTER CHANGES
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

  // ✅ PAGINATION LOGIC
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const resultCount = filteredPosts.length;

  return (
    <div className="aurora-bg min-h-screen relative overflow-hidden">
  
        {/* 🌌 BACKGROUND FX LAYERS */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.15),transparent_40%),radial-gradient(circle_at_bottom,rgba(236,72,153,0.12),transparent_40%)] pointer-events-none" />

        <div className="absolute inset-0 opacity-30 animate-pulse bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)]" />

        <div className="relative z-10">

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* 💎 HERO EDITORIAL */}
        <div className="text-center mb-16 relative">

            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-400/10 blur-[120px] rounded-full animate-pulse" />

          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-cyan-400/30 backdrop-blur-2xl mb-10">
            <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="uppercase tracking-[6px] text-xs text-cyan-300">
              CYBER VAULT • DIGITAL MAGAZINE
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-[-3px] leading-tight mb-6">
            <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Le Blog des
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                Stratégies Modernes
            </span>
            </h1>

          <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Analyse, systèmes et stratégies concrètes pour
            <span className="text-cyan-300 font-medium"> gagner en ligne</span>,
            développer tes compétences et comprendre les nouveaux modèles digitaux.
          </p>

          {/* proof bar */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-xs text-zinc-400">
            <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10">
              📚 Contenu actionnable
            </div>
            <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10">
              ⚡ Mise à jour régulière
            </div>
            <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10">
              🎯 Focus résultats
            </div>
          </div>

        </div>

        {/* 🔥 SEARCH + STATS */}
        <div className="mb-10 relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-r from-cyan-400/20 via-purple-500/10 to-pink-400/20">
  
            <div className="bg-zinc-950/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                
                {/* glow scan line */}
                <div className="absolute inset-0 animate-pulse opacity-20 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.05),transparent)]" />

          <div className="flex flex-col lg:flex-row gap-5 items-center">

            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-4 text-zinc-500" size={20} />
              <input
                type="text"
                placeholder="Rechercher une stratégie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 pl-14 py-4 rounded-2xl outline-none focus:border-cyan-400 text-lg"
              />
            </div>

            <div className="text-sm text-zinc-400">
              <span className="text-cyan-300 font-medium">{resultCount}</span> articles
            </div>

          </div>
        </div>
        </div>

        {/* 💎 CATEGORY BAR */}
        <div className="sticky top-4 z-50 mb-12 bg-zinc-950/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-4 shadow-[0_0_40px_-10px_rgba(34,211,238,0.3)]">

          <div className="flex items-center gap-3 mb-3 text-xs text-zinc-500 uppercase tracking-widest">
            <Filter size={14} />
            Catégories
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scroll-smooth">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium
                  border transition-all duration-300 shrink-0
                  ${activeCategory === cat
                    ? 'bg-gradient-to-r from-cyan-400 to-pink-400 text-black border-transparent scale-105 shadow-lg'
                    : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:border-cyan-400/40'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* 🧠 ARTICLES GRID */}
        {filteredPosts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {paginatedPosts.map((post) => {
                const readingTime = estimateReadingTime(post.excerpt);
                const isNew =
                  (new Date() - new Date(post.created_at)) /
                  (1000 * 60 * 60 * 24) < 15;

                return (
                  <Link
                    key={post.id}
                    href={`/article/${post.slug}`}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 
                    bg-gradient-to-br from-zinc-950 via-zinc-900 to-black
                    transition-all duration-700 transform-gpu
                    hover:-translate-y-4 hover:rotate-[0.3deg] hover:scale-[1.01]
                    hover:shadow-[0_30px_120px_-20px_rgba(34,211,238,0.35)]
                    hover:border-cyan-400/60"
                  >

                    {/* glow animé interne */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_50%)]" />

                    {/* bordure animée */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 blur-md bg-gradient-to-r from-cyan-400/20 via-transparent to-pink-400/20 transition" />

                    <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-cyan-400/5 via-transparent to-pink-400/5" />

                    <div className="relative p-8 flex flex-col h-full">

                      <div className="flex flex-wrap gap-2 mb-5">

                        {isNew && (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-pink-500/10 border border-pink-400/30 text-pink-300 flex items-center gap-1">
                            <Sparkles size={12} />
                            NEW
                          </span>
                        )}

                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 border border-white/10 text-zinc-400 flex items-center gap-1">
                          <Clock size={12} />
                          {readingTime} min
                        </span>

                        {post.category && (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300">
                            {post.category}
                          </span>
                        )}

                      </div>

                      <h3 className="text-2xl font-bold leading-snug mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-pink-400 group-hover:bg-clip-text transition-colors line-clamp-3">
                        {post.title}
                      </h3>

                      <p className="text-zinc-400 text-[15.5px] leading-relaxed line-clamp-4 mb-8 group-hover:text-zinc-300 transition">
                        {post.excerpt || "Découvrez des stratégies exclusives et des insights puissants du vault cybernétique..."}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-5 border-t border-white/10">

                        <div className="text-xs text-zinc-500">
                          {new Date(post.created_at).toLocaleDateString('fr-FR')}
                        </div>

                        <div className="flex items-center gap-2 text-cyan-400 font-medium group-hover:tracking-wide group-hover:text-cyan-300 transition-all">
                          Lire l’article
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>

                      </div>

                    </div>

                    <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-cyan-400/20 via-transparent to-pink-400/20 opacity-0 group-hover:opacity-100 blur-sm transition" />

                  </Link>
                );
              })}

            </div>

            {/* 📄 PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-16 gap-2 flex-wrap">

                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
                >
                  ←
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-xl text-sm border transition ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-cyan-400 to-pink-400 text-black border-transparent'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
                >
                  →
                </button>

              </div>
            )}

          </>
        ) : (
          <div className="text-center py-32 text-zinc-500">
            Aucun article trouvé
          </div>
        )}

      </div>
    </div>
    </div>
  );
}