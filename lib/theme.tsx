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
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const saved = window.localStorage.getItem('theme') as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const value = useMemo<ThemeStyles>(() => {
    const isDark = theme === 'dark';
    return {
      theme,
      toggle: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
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
