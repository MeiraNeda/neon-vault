import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <>
      {/* Hero Cyber-Neon Aurora */}
      <div className="aurora-bg min-h-screen flex items-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#00000088_40%,transparent)] z-0"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-cyan-400/30 backdrop-blur-xl mb-10">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="uppercase tracking-[4px] text-sm font-medium text-cyan-300">NEON VAULT ACCESS • 2026</span>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold tracking-[-3px] leading-none mb-8 neon-text">
            PDFs <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent">PREMIUM</span><br />
            dans un vault cybernétique
          </h1>

          <p className="text-2xl text-zinc-300 max-w-3xl mx-auto mb-14">
            Contenu exclusif protégé. Articles libres. PDFs débloqués en un flash via Gumroad.<br />
            L’expérience futuriste que tu attends.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/shop"
              className="btn-cyber px-12 py-6 rounded-3xl font-semibold text-2xl flex items-center justify-center gap-4 shadow-2xl"
            >
              Accéder à la boutique
              <span className="text-3xl">⚡</span>
            </Link>
            
            <Link 
              href="/blog"
              className="glass-neon px-12 py-6 rounded-3xl font-semibold text-2xl border border-white/20 hover:border-purple-400"
            >
              Explorer le réseau (Blog)
            </Link>
          </div>
        </div>

        {/* Scan line décorative subtile */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 h-px w-96 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse"></div>
      </div>

      {/* Section Pourquoi – Cards plus cyber */}
      <div className="max-w-6xl mx-auto px-6 py-28">
        <h2 className="text-6xl font-bold text-center mb-20 tracking-tight neon-text">
          Pourquoi entrer dans le <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Vault</span> ?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { icon: "📚", title: "Contenu Exclusif", desc: "Des ressources que personne d’autre ne possède. Vault fermé au monde extérieur." },
            { icon: "🔐", title: "Accès Sécurisé", desc: "Authentification biométrique simulée. Seul l’utilisateur connecté peut lire." },
            { icon: "⚡", title: "Transaction Instantanée", desc: "Paiement Gumroad en un éclair. PDF livré directement dans ton espace." }
          ].map((item, i) => (
            <div key={i} className="glass-neon rounded-3xl p-12 card-cyber text-center">
              <div className="text-6xl mb-8">{item.icon}</div>
              <h3 className="text-3xl font-semibold mb-5 tracking-tight">{item.title}</h3>
              <p className="text-zinc-400 text-lg">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}