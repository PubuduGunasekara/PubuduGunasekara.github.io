'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { links, nav } from '@/lib/content';
import { useTheme } from '@/lib/theme';
import { useActiveSection } from '@/lib/useActiveSection';
import { MenuIcon } from './ui/icons';
import { ThemeToggle } from './ui/ThemeToggle';
import { PrimaryLink } from './ui/Links';

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { surface, mobileMenuSurface, mobileMenuItem, muted, navSurface } = useTheme();
  const navIds = useMemo(() => nav.map((item) => item.id), []);
  const activeId = useActiveSection(navIds);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const anchor = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-xl ${navSurface}`}>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <a href={anchor('top')} className="flex shrink-0 items-center gap-3 font-mono text-sm tracking-tight">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/pg-mark.svg" alt="" className="h-8 w-8" />
          <span className="hidden sm:inline">Pubudu Gunasekara</span>
        </a>

        <div className={`hidden items-center gap-1 rounded-full border px-2 py-1.5 text-xs xl:flex ${surface}`}>
          {nav.map((item) => (
            <a
              key={item.id}
              href={anchor(item.id)}
              className={`rounded-full px-2.5 py-1 transition ${
                isHome && activeId === item.id ? 'text-signal-cyan' : `${muted} hover:text-current`
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <PrimaryLink href={links.resume}>Resume</PrimaryLink>
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition hover:border-signal-cyan xl:hidden ${surface}`}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className={`absolute left-5 right-5 top-[4.5rem] rounded-3xl border p-2 backdrop-blur-xl xl:hidden ${mobileMenuSurface}`}
        >
          <div className="grid grid-cols-2 gap-1">
            {nav.map((item) => (
              <a
                key={item.id}
                href={anchor(item.id)}
                onClick={() => setMenuOpen(false)}
                className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isHome && activeId === item.id ? 'text-signal-cyan' : mobileMenuItem
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
