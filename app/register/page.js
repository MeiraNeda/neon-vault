'use client';

import { useState } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Zap } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { supabase } = useSupabase();
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      alert("Compte créé avec succès ! Vérifie ton email pour confirmer l'inscription.");
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div className="aurora-bg min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-neon rounded-3xl p-12 relative overflow-hidden">
        {/* Effet décoratif néon */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl" />

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6">
            <UserPlus size={32} className="text-black" />
          </div>
          <h1 className="text-4xl font-bold tracking-[-2px] neon-text">Rejoindre le Vault</h1>
          <p className="text-zinc-400 mt-3">Crée ton compte pour accéder au contenu exclusif</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-8">
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
            <label className="block text-sm font-medium mb-2 text-cyan-300">Mot de passe (min. 6 caractères)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
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
            {loading ? 'Création du compte...' : 'Créer mon compte'}
            <Zap size={24} />
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-zinc-400 text-sm">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-cyan-300 hover:text-cyan-400 font-medium transition">
              Se connecter
            </Link>
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
      </div>
    </div>
  );
}