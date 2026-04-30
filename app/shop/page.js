import Link from 'next/link';
import { createClientServer } from '@/lib/supabase/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

function getPublicUrl(path) {
  if (!path) return '';
  
  // Si c'est déjà une URL complète (https://...), on la retourne telle quelle
  if (path.startsWith('http')) {
    return path;
  }
  
  // Sinon, on construit l'URL publique à partir du chemin dans le bucket
  return `${SUPABASE_URL}/storage/v1/object/public/post-covers/${path}`;
}

export default async function ShopPage() {
  const supabase = await createClientServer();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  return (
    <div className="aurora-bg min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* En-tête de la boutique */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-cyan-400/30 backdrop-blur-xl mb-6">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="uppercase tracking-[4px] text-sm font-medium text-cyan-300">
              NEON MARKET • PREMIUM VAULT
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-[-2px] mb-6 neon-text">
            Boutique <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent">PDF</span>
          </h1>

          <p className="text-2xl text-zinc-300 max-w-2xl mx-auto">
            Des ressources exclusives aux couleurs du futur.<br />
            Paiement sécurisé • Livraison instantanée • Accès protégé
          </p>
        </div>

        {products && products.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product) => (
              <div
                key={product.id}
                className="glass-neon card-cyber rounded-3xl overflow-hidden group relative"
              >
                {/* Badge Premium Neon */}
                <div className="absolute top-5 right-5 z-20 px-5 py-1.5 text-xs font-semibold tracking-[2px] bg-black/80 border border-pink-400 text-pink-300 rounded-full backdrop-blur-sm">
                  PREMIUM NEON
                </div>

                {/* Image du produit avec getPublicUrl */}
                {product.cover_image && (
                  <div className="relative overflow-hidden h-80">
                    <img
                      src={getPublicUrl(product.cover_image)}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Overlay gradient néon subtil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  </div>
                )}

                {/* Contenu de la carte */}
                <div className="p-8 pb-10">
                  <h3 className="text-3xl font-semibold tracking-tight mb-4 text-white group-hover:text-cyan-300 transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-zinc-400 line-clamp-3 mb-10 text-[17px] leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <span className="text-4xl font-bold text-white tracking-tighter">
                        {product.price} €
                      </span>
                      <span className="text-zinc-500 text-sm block">TTC • Instantané</span>
                    </div>

                    <a
                      href={product.gumroad_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cyber px-9 py-4 rounded-2xl font-semibold text-lg flex items-center gap-3 shadow-xl"
                    >
                      Acheter sur Gumroad
                      <span className="text-2xl group-hover:rotate-45 transition-transform">⚡</span>
                    </a>
                  </div>

                  <p className="text-center text-[13px] text-zinc-500 mt-8 tracking-wide">
                    Paiement sécurisé • PDF livré immédiatement
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="text-8xl mb-8 opacity-30">⚡</div>
            <p className="text-3xl text-zinc-400">Aucun produit disponible pour le moment</p>
            <p className="text-zinc-500 mt-4">Le vault se recharge bientôt...</p>
          </div>
        )}
      </div>
    </div>
  );
}