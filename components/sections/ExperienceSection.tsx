'use client';

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
                      {item.highlight && (
                        <span className="rounded-full border border-signal-green/30 bg-signal-green/10 px-2.5 py-0.5 font-mono text-xs text-signal-green">
                          {item.highlight}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className={`shrink-0 font-mono text-xs ${muted}`}>{item.period}</p>
              </div>

              <BulletList items={item.bullets} />

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
