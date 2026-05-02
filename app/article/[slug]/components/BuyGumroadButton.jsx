'use client';

import { Zap } from 'lucide-react';

export default function BuyGumroadButton({ gumroadLink }) {
  const handleClick = () => {
    if (!gumroadLink) {
      console.error("❌ Aucun lien Gumroad configuré");
      alert("Le lien d'achat n'est pas configuré pour cet article.");
      return;
    }

    console.log("✅ Ouverture du lien :", gumroadLink);
    window.open(gumroadLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className="group inline-flex items-center gap-3 px-10 py-4.5 
                 bg-gradient-to-r from-cyan-400 to-pink-500 
                 text-black font-semibold text-lg rounded-2xl
                 hover:scale-105 active:scale-95 transition-all duration-200
                 shadow-lg shadow-pink-500/40 hover:shadow-2xl hover:shadow-pink-500/60
                 focus:outline-none focus:ring-4 focus:ring-cyan-400/30"
    >
      Acheter sur Gumroad ⚡
      <Zap className="w-5 h-5 group-active:rotate-12 transition-transform" />
    </button>
  );
}