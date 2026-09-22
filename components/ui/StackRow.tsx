'use client';

import { useTheme } from '@/lib/theme';

export function StackRow({ items }: { items: string[] }) {
  const { muted } = useTheme();

  return (
    <p className={`font-mono text-xs leading-6 ${muted}`}>
      {items.map((item, index) => (
        <span key={item}>
          <span className="transition hover:text-signal-cyan">{item}</span>
          {index < items.length - 1 && <span className="opacity-30"> &middot; </span>}
        </span>
      ))}
    </p>
  );
}

export function BulletList({ items }: { items: string[] }) {
  const { muted } = useTheme();

  return (
    <ul className={`mt-5 space-y-2.5 leading-7 ${muted}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-[0.7rem] h-1 w-1 shrink-0 rounded-full bg-current opacity-40" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
