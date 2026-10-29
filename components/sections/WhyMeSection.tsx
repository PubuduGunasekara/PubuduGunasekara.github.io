'use client';

import Link from 'next/link';
import { whyMeHeading, whyMeNow, whyMeRows, type WhyMeAccent } from '@/lib/content';
import { useTheme } from '@/lib/theme';
import { Section } from '../ui/Section';
import { EditorialCard } from '../ui/EditorialCard';

const accents: Record<WhyMeAccent, { bar: string; tag: string; chip: string }> = {
  cyan: {
    bar: 'border-l-signal-cyan',
    tag: 'text-signal-cyan',
    chip: 'border-signal-cyan/30 bg-signal-cyan/10 text-signal-cyan',
  },
  green: {
    bar: 'border-l-signal-green',
    tag: 'text-signal-green',
    chip: 'border-signal-green/30 bg-signal-green/10 text-signal-green',
  },
  amber: {
    bar: 'border-l-signal-amber',
    tag: 'text-signal-amber',
    chip: 'border-signal-amber/30 bg-signal-amber/10 text-signal-amber',
  },
  blue: {
    bar: 'border-l-signal-blue',
    tag: 'text-signal-blue',
    chip: 'border-signal-blue/30 bg-signal-blue/10 text-signal-blue',
  },
};

export function WhyMeSection() {
  const { muted } = useTheme();

  return (
    <Section id="why-me" title={whyMeHeading}>
      <EditorialCard>
        <ul className="space-y-6">
          {whyMeRows.map((row) => {
            const accent = accents[row.accent];
            return (
              <li key={row.title} className={`grid gap-2 border-l-2 pl-4 sm:grid-cols-[14rem_1fr] sm:gap-6 ${accent.bar}`}>
                <div>
                  <h3 className="font-semibold tracking-tight">
                    {row.href ? (
                      <Link href={row.href} className="transition hover:text-nu-red-text">
                        {row.title}
                      </Link>
                    ) : (
                      row.title
                    )}
                  </h3>
                  <p className={`mt-0.5 font-mono text-xs ${accent.tag}`}>{row.tag}</p>
                </div>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm leading-6">
                  <span>{row.text}</span>
                  {row.facts.map((fact) => (
                    <span key={fact} className={`rounded-full border px-2.5 py-0.5 font-mono text-xs ${accent.chip}`}>
                      {fact}
                    </span>
                  ))}
                </p>
              </li>
            );
          })}
        </ul>

        <p className={`mt-6 flex flex-wrap items-center gap-2 border-t border-slate-500/10 pt-4 text-sm ${muted}`}>
          <span className="rounded-full bg-nu-red/10 px-2.5 py-0.5 font-mono text-xs text-nu-red-text">Now</span>
          Currently building: {whyMeNow}
        </p>
      </EditorialCard>
    </Section>
  );
}
