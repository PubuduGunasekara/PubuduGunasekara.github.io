'use client';

import { useTheme } from '@/lib/theme';

const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE ? new Date(process.env.NEXT_PUBLIC_BUILD_DATE) : new Date();
const buildLabel = buildDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
const copyrightYear = buildDate.getFullYear();

export function Footer() {
  const { muted } = useTheme();

  return (
    <footer className={`border-t border-slate-500/15 py-10 text-sm ${muted}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>© {copyrightYear} Pubudu Gunasekara. All rights reserved.</p>
        <p className="font-mono text-xs">Built {buildLabel} · Next.js · TypeScript · GitHub Pages</p>
      </div>
    </footer>
  );
}
