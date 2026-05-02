import { createClientServer } from '../../../lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ProductDetailPage({ params }) {
  const supabase = await createClientServer();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single();

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Produit non trouvé</h1>
        <Link href="/shop" className="text-zinc-600 hover:underline">
          ← Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 mb-8"
      >
        <ArrowLeft size={20} /> Retour à la boutique
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div>
          {product.cover_image && (
            <img
              src={product.cover_image}
              alt={product.name}
              className="w-full rounded-3xl shadow-lg"
            />
          )}
        </div>

        {/* Informations */}
        <div>
          <h1 className="text-4xl font-bold mb-6">{product.name}</h1>

          <div className="text-4xl font-bold text-emerald-600 mb-8">
            {product.price} €
          </div>

          <div className="prose prose-zinc max-w-none mb-10">
            <p className="text-lg leading-relaxed">{product.description}</p>
          </div>

          <a
            href={product.gumroad_link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white text-center text-xl font-semibold rounded-3xl transition mb-6"
          >
            Acheter maintenant sur Gumroad
          </a>

          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 text-sm text-zinc-600">
            <p className="font-medium mb-2">Ce que tu obtiens :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Le PDF complet en haute qualité</li>
              <li>Accès immédiat après paiement</li>
              <li>Support par email si besoin</li>
              <li>Mises à jour futures gratuites (si applicable)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}