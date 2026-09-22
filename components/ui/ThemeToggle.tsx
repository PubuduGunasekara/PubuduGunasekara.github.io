'use client';

import { useTheme } from '@/lib/theme';
import { MoonIcon, SunIcon } from './icons';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle, surface } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition hover:border-signal-cyan hover:text-signal-cyan ${surface} ${className}`}
    >
      {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
