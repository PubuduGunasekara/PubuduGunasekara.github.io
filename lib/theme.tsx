'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'dark' | 'light';

type ThemeStyles = {
  theme: Theme;
  toggle: () => void;
  pageTone: string;
  navSurface: string;
  surface: string;
  surfaceHover: string;
  mobileMenuSurface: string;
  mobileMenuItem: string;
  muted: string;
};

const ThemeContext = createContext<ThemeStyles | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always start at the static export's default (light) so the first client
  // render matches the pre-rendered HTML exactly, then correct from
  // localStorage right after mount. This trades a one-frame flash for zero
  // hydration mismatches (the previous synchronous-read approach caused a
  // real mismatch on every themed element, since the static HTML has no way
  // to know a given visitor's saved preference).
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const saved = window.localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') setTheme(saved);
  }, []);

  const value = useMemo<ThemeStyles>(() => {
    const isDark = theme === 'dark';
    return {
      theme,
      toggle: () =>
        setTheme((current) => {
          const next = current === 'dark' ? 'light' : 'dark';
          window.localStorage.setItem('theme', next);
          return next;
        }),
      pageTone: isDark ? 'bg-ink-950 text-ink-100' : 'light bg-[#f8f6f2] text-ink-950',
      navSurface: isDark ? 'bg-ink-950/90 border-b border-white/10' : 'bg-[#f8f6f2]/90 border-b border-black/[0.06]',
      surface: isDark
        ? 'border-white/10 bg-white/[0.06] backdrop-blur-xl'
        : 'border-black/[0.06] bg-white/65 backdrop-blur-xl',
      surfaceHover: isDark ? 'hover:border-signal-cyan/40' : 'hover:border-signal-cyan/50',
      mobileMenuSurface: isDark
        ? 'border-white/15 bg-ink-950/95 text-ink-100 shadow-2xl shadow-black/40'
        : 'border-black/10 bg-white/95 text-ink-950 shadow-2xl shadow-slate-200/70',
      mobileMenuItem: isDark
        ? 'text-ink-300 hover:bg-white/10 hover:text-signal-cyan'
        : 'text-ink-700 hover:bg-signal-cyan/10 hover:text-ink-950',
      muted: isDark ? 'text-ink-300' : 'text-ink-700',
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
