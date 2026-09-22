'use client';

import { useTheme } from '@/lib/theme';
import { education } from '@/lib/content';
import { Section } from '../ui/Section';
import { RevealGroup, RevealItem } from '../ui/Reveal';
import { EditorialCard } from '../ui/EditorialCard';
import { BrandLogo } from '../ui/BrandLogo';

export function EducationSection() {
  const { muted } = useTheme();

  return (
    <Section id="education" eyebrow="06" title="Education">
      <RevealGroup className="flex flex-col gap-5">
        {education.map((item) => (
          <RevealItem key={item.school}>
            <EditorialCard>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <BrandLogo src={item.logo} alt={`${item.school} logo`} mark={item.mark} />
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{item.school}</h3>
                    <p className="text-signal-blue">{item.program}</p>
                  </div>
                </div>
                <p className="shrink-0 font-mono text-xs text-signal-cyan">{item.meta}</p>
              </div>
              <p className={`mt-5 border-t border-slate-500/10 pt-4 leading-7 ${muted}`}>{item.detail}</p>
            </EditorialCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
