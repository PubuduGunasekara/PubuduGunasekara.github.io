'use client';

import Link from 'next/link';
import { whyMeHeading, whyMeNow, whyMeRows, type WhyMeAccent } from '@/lib/content';
import { useTheme } from '@/lib/theme';
import { Section } from '../ui/Section';
import { EditorialCard } from '../ui/EditorialCard';

const accents: Record<WhyMeAccent, { bar: string; label: string; chip: string }> = {
  cyan: {
    bar: 'border-l-signal-cyan',
    label: 'text-signal-cyan',
    chip: 'border-signal-cyan/30 bg-signal-cyan/10 text-signal-cyan',
  },
  green: {
    bar: 'border-l-signal-green',
    label: 'text-signal-green',
    chip: 'border-signal-green/30 bg-signal-green/10 text-signal-green',
  },
  amber: {
    bar: 'border-l-signal-amber',
    label: 'text-signal-amber',
    chip: 'border-signal-amber/30 bg-signal-amber/10 text-signal-amber',
  },
  blue: {
    bar: 'border-l-signal-blue',
    label: 'text-signal-blue',
    chip: 'border-signal-blue/30 bg-signal-blue/10 text-signal-blue',
  },
};

export function WhyMeSection() {
  const { muted } = useTheme();

  return (
    <Section id="why-me" title={whyMeHeading}>
      <EditorialCard>
        <ul className="space-y-7">
          {whyMeRows.map((row) => {
            const accent = accents[row.accent];
            const cells = [
              ['Built', row.built],
              ['Used', row.used],
              ['Learned', row.learned],
              ['Helps you', row.helps],
            ];
            return (
              <li key={row.title} className={`border-l-2 pl-4 ${accent.bar}`}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <h3 className="font-semibold tracking-tight">
                    {row.href ? (
                      <Link href={row.href} className="transition hover:text-nu-red-text">
                        {row.title}
                      </Link>
                    ) : (
                      row.title
                    )}
                  </h3>
                  <span className={`rounded-full border px-2.5 py-0.5 font-mono text-xs ${accent.chip}`}>{row.fact}</span>
                </div>
                <dl className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {cells.map(([label, text]) => (
                    <div key={label}>
                      <dt className={`font-mono text-xs uppercase tracking-widest ${accent.label}`}>{label}</dt>
                      <dd className="mt-0.5 text-sm leading-6">{text}</dd>
                    </div>
                  ))}
                </dl>
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
