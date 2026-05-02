'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useSupabase } from './providers/SupabaseProvider';
import { LogOut, User, LogIn, Sparkles, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, signOut, loading } = useSupabase();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  const lastScroll = useRef(0);

  // scroll behavior (hide on down, show on up)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      setScrolled(y > 10);

      if (y > lastScroll.current && y > 120) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScroll.current = y;
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const linkClass = (path) =>
    `relative transition-all duration-300 ease-out
    ${pathname === path ? 'text-cyan-300' : 'text-zinc-300'}
    hover:text-cyan-300
    after:absolute after:left-0 after:-bottom-1 after:h-[2px]
    after:w-0 after:bg-gradient-to-r after:from-cyan-400 after:to-pink-500
    hover:after:w-full after:transition-all after:duration-300`;

  return (
    <>
      {/* BACKDROP MOBILE */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"   // ← z-30 au lieu de z-40
        />
      )}

      <nav
        className={`
          fixed top-0 z-40 w-full transition-all duration-500 ease-out   // ← changé de z-50 à z-40
          ${scrolled ? 'bg-zinc-950/70 backdrop-blur-2xl border-b border-white/10' : 'bg-transparent'}
          ${hidden ? '-translate-y-full' : 'translate-y-0'}
        `}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-4 transition-all">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(34,211,238,0.25)] group-hover:shadow-[0_0_35px_rgba(168,85,247,0.4)] transition">
              <span className="flex items-center justify-center h-full text-black font-black text-xl">
                V
              </span>
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold neon-text tracking-[-1px]">
                PDF Vault
              </span>
              <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Sparkles size={11} className="text-cyan-300" />
                cyber document system
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8 text-sm">

            <Link href="/blog" className={linkClass('/blog')}>
              Blog
            </Link>

            <Link href="/shop" className={linkClass('/shop')}>
              Boutique
            </Link>

            {loading ? (
              <div className="w-9 h-9 rounded-xl bg-white/10 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-5">

                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-zinc-300 hover:text-cyan-300 transition"
                >
                  <User size={18} />
                  Admin
                </Link>

                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition active:scale-95"
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>

              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-2xl font-semibold text-black
                bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400
                hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]
                active:scale-95 transition"
              >
                <span className="flex items-center gap-2">
                  <LogIn size={18} />
                  Connexion
                </span>
              </Link>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-zinc-200"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* MOBILE MENU (FULL EXPERIENCE) */}
        <div
          className={`
            md:hidden fixed top-0 right-0 h-full w-[80%] max-w-sm
            bg-zinc-950/95 backdrop-blur-2xl border-l border-white/10
            transform transition-transform duration-500 ease-out z-50
            ${open ? 'translate-x-0' : 'translate-x-full'}
            flex flex-col p-6 gap-6
          `}
        >
          <div className="flex justify-between items-center">
            <span className="text-cyan-300 font-semibold">Menu</span>
            <button onClick={() => setOpen(false)}>
              <X />
            </button>
          </div>

          <Link href="/blog" className={linkClass('/blog')}>
            Blog
          </Link>

          <Link href="/shop" className={linkClass('/shop')}>
            Boutique
          </Link>

          <div className="border-t border-white/10 pt-4 mt-auto space-y-4">

            {user ? (
              <>
                <Link href="/admin" className="text-zinc-300 hover:text-cyan-300">
                  Admin
                </Link>

                <button
                  onClick={signOut}
                  className="text-red-400 hover:text-red-300"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-5 py-3 rounded-2xl text-center font-semibold text-black
                bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400"
              >
                Connexion
              </Link>
            )}

          </div>
        </div>
      </nav>
    </>
  );
}