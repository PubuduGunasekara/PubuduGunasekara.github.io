'use client';

import { learnMore } from '@/lib/content';
import { useTheme } from '@/lib/theme';

export function LearnMore() {
  const { muted } = useTheme();

  return (
    <div className="flex flex-col items-center gap-2 pb-4 pt-6 text-center">
      <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{learnMore.title}</h2>
      <p className={`text-sm ${muted}`}>{learnMore.sub}</p>
      <span aria-hidden="true" className="mt-1 text-xl text-signal-cyan">
        &darr;
      </span>
    </div>
  );
}
