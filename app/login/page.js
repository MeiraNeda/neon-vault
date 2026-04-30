'use client';

import { useState } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Zap } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { supabase } = useSupabase();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="aurora-bg min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-neon rounded-3xl p-12 relative overflow-hidden">
        {/* Effet décoratif néon */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl" />

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl mb-6">
            <LogIn size={32} className="text-black" />
          </div>
          <h1 className="text-4xl font-bold tracking-[-2px] neon-text">Accès Vault</h1>
          <p className="text-zinc-400 mt-3">Connecte-toi pour accéder au contenu premium</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div>
            <label className="block text-sm font-medium mb-2 text-cyan-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:border-cyan-400 focus:outline-none text-white placeholder-zinc-500"
              placeholder="ton@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-cyan-300">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:border-cyan-400 focus:outline-none text-white placeholder-zinc-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 p-3 rounded-2xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-cyber w-full py-5 rounded-2xl font-semibold text-xl flex items-center justify-center gap-3 shadow-2xl disabled:opacity-70"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
            <Zap size={24} />
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-zinc-400 text-sm">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-cyan-300 hover:text-cyan-400 font-medium transition">
              Créer un compte
            </Link>
          </p>
        </div>

        {/* Scan line décorative */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      </div>
    </div>
  );
}