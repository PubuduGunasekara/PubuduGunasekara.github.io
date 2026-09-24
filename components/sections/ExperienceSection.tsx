'use client';

import Link from 'next/link';
import { experience } from '@/lib/content';
import { useTheme } from '@/lib/theme';
import { Section } from '../ui/Section';
import { RevealGroup, RevealItem } from '../ui/Reveal';
import { EditorialCard } from '../ui/EditorialCard';
import { BrandLogo } from '../ui/BrandLogo';
import { BulletList, StackRow } from '../ui/StackRow';

const accentBorder = ['border-l-signal-cyan', 'border-l-signal-green'];

export function ExperienceSection() {
  const { muted } = useTheme();

  return (
    <Section id="experience" eyebrow="02" title="Experience">
      <RevealGroup className="flex flex-col gap-5">
        {experience.map((item, index) => (
          <RevealItem key={item.role}>
            <EditorialCard className={`border-l-2 ${accentBorder[index % accentBorder.length]}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <BrandLogo src={item.logo} alt={`${item.company} logo`} mark={item.mark} />
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{item.role}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <p className="text-signal-blue">{item.company}</p>
                      {item.highlights?.map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full border border-signal-green/30 bg-signal-green/10 px-2.5 py-0.5 font-mono text-xs text-signal-green"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className={`shrink-0 font-mono text-xs ${muted}`}>{item.period}</p>
              </div>

              <BulletList items={item.bullets} />

              {item.reflection && <p className={`mt-4 text-sm italic leading-6 ${muted}`}>{item.reflection}</p>}
              {item.reflectionLink && (
                <Link
                  href={item.reflectionLink.href}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-signal-cyan transition hover:gap-2.5"
                >
                  {item.reflectionLink.label}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              )}

              <div className="mt-6 flex flex-wrap items-baseline gap-3 border-t border-slate-500/10 pt-4">
                <p className={`shrink-0 font-mono text-xs uppercase tracking-widest ${muted}`}>stack</p>
                <StackRow items={item.focus} />
              </div>
            </EditorialCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
