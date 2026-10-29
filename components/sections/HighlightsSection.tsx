'use client';

import Link from 'next/link';
import {
  highlights,
  highlightProjects,
  highlightWork,
  type HighlightAccent,
  type HighlightItem,
} from '@/lib/content';
import { useTheme } from '@/lib/theme';

const accents: Record<HighlightAccent, { top: string; left: string; label: string; chip: string; tag: string }> = {
  cyan: {
    top: 'border-t-signal-cyan',
    left: 'border-l-signal-cyan',
    label: 'text-signal-cyan',
    chip: 'border-signal-cyan/30 bg-signal-cyan/10 text-signal-cyan',
    tag: 'bg-signal-cyan/10 text-signal-cyan',
  },
  green: {
    top: 'border-t-signal-green',
    left: 'border-l-signal-green',
    label: 'text-signal-green',
    chip: 'border-signal-green/30 bg-signal-green/10 text-signal-green',
    tag: 'bg-signal-green/10 text-signal-green',
  },
  amber: {
    top: 'border-t-signal-amber',
    left: 'border-l-signal-amber',
    label: 'text-signal-amber',
    chip: 'border-signal-amber/30 bg-signal-amber/10 text-signal-amber',
    tag: 'bg-signal-amber/10 text-signal-amber',
  },
  blue: {
    top: 'border-t-signal-blue',
    left: 'border-l-signal-blue',
    label: 'text-signal-blue',
    chip: 'border-signal-blue/30 bg-signal-blue/10 text-signal-blue',
    tag: 'bg-signal-blue/10 text-signal-blue',
  },
};

function GroupLabel({ children, count }: { children: React.ReactNode; count?: string }) {
  const { muted } = useTheme();
  return (
    <div className="mb-3 flex items-center gap-3">
      <p className={`font-mono text-xs uppercase tracking-widest ${muted}`}>
        {children}
        {count && <span className="ml-2 opacity-70">{count}</span>}
      </p>
      <span aria-hidden="true" className="h-px flex-1 bg-slate-500/20" />
    </div>
  );
}

function Tags({ items, className }: { items: string[]; className: string }) {
  return (
    <ul className="flex flex-wrap gap-1">
      {items.map((item) => (
        <li key={item} className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] ${className}`}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function Facts({ item, learnedBeforeHelps = true }: { item: HighlightItem; learnedBeforeHelps?: boolean }) {
  const accent = accents[item.accent];
  const rows = learnedBeforeHelps
    ? [
        ['Learned', item.learned],
        ['Helps you', item.helps],
      ]
    : [];
  return (
    <>
      {rows.map(([label, text]) => (
        <p key={label} className="text-sm leading-5">
          <span className={`mr-1.5 font-mono text-[11px] uppercase tracking-wider ${accent.label}`}>{label}</span>
          {text}
        </p>
      ))}
    </>
  );
}

export function HighlightsSection() {
  const { muted, surface } = useTheme();

  return (
    <section id="highlights" className="pb-10 pt-2 lg:pb-14">
      <div className={`relative overflow-hidden rounded-[2rem] border p-6 shadow-hero sm:p-10 ${surface}`}>
        <div
          aria-hidden="true"
          className="hero-grid pointer-events-none absolute inset-0 -z-10"
          style={{ WebkitMaskImage: 'none', maskImage: 'none' }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-signal-cyan via-signal-green to-signal-amber"
        />

        <p className="font-mono text-xs uppercase tracking-widest text-signal-cyan">{highlights.kicker}</p>
        <h2 className="mt-2 max-w-3xl text-balance text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{highlights.title}</h2>
        <p className={`mt-2 text-sm ${muted}`}>{highlights.sub}</p>

        <div className="mt-7">
          <GroupLabel count={String(highlightProjects.length)}>Projects</GroupLabel>
          <ul className="grid gap-4 md:grid-cols-3">
            {highlightProjects.map((item) => {
              const accent = accents[item.accent];
              return (
                <li key={item.title} className={`rounded-2xl border border-t-2 border-slate-500/15 bg-slate-500/[0.04] p-4 ${accent.top}`}>
                  <h3 className="font-semibold tracking-tight">
                    {item.href ? (
                      <Link href={item.href} className="transition hover:text-nu-red-text">
                        {item.title}
                      </Link>
                    ) : (
                      item.title
                    )}
                  </h3>
                  <p className={`mt-1.5 inline-block rounded-lg border px-2 py-0.5 font-mono text-[11px] leading-4 ${accent.chip}`}>{item.fact}</p>
                  <p className="mt-3 text-sm leading-5">{item.built}</p>
                  <div className="mt-2">
                    <Tags items={item.used} className={accent.tag} />
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <Facts item={item} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-6">
          <GroupLabel>Work experience</GroupLabel>
          <div
            className={`grid gap-x-6 gap-y-3 rounded-2xl border border-l-4 border-slate-500/15 bg-slate-500/[0.04] p-4 lg:grid-cols-[13rem_1fr_1fr] ${accents[highlightWork.accent].left}`}
          >
            <div>
              <h3 className="font-semibold tracking-tight">{highlightWork.title}</h3>
              <p className={`mt-0.5 text-sm ${muted}`}>{highlightWork.dates}</p>
              <p className={`mt-1.5 inline-block rounded-lg border px-2 py-0.5 font-mono text-[11px] leading-4 ${accents[highlightWork.accent].chip}`}>
                {highlightWork.fact}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm leading-5">{highlightWork.built}</p>
              <Tags items={highlightWork.used} className={accents[highlightWork.accent].tag} />
            </div>
            <div className="space-y-1.5">
              <Facts item={highlightWork} />
            </div>
          </div>
        </div>

        <p className={`mt-6 flex flex-wrap items-center gap-2 text-sm ${muted}`}>
          <span className="rounded-full bg-nu-red/10 px-2 py-px font-mono text-[11px] text-nu-red-text">Now</span>
          {highlights.now}
        </p>
      </div>
    </section>
  );
}
