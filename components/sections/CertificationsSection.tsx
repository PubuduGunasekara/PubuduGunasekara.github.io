'use client';

import { useTheme } from '@/lib/theme';
import { certifications } from '@/lib/content';
import { Section } from '../ui/Section';
import { RevealGroup, RevealItem } from '../ui/Reveal';

export function CertificationsSection() {
  const { muted } = useTheme();

  return (
    <Section id="certifications" eyebrow="05" title="Certifications">
      <RevealGroup className="flex flex-col">
        {certifications.map(([name, issuer, href], index) => (
          <RevealItem key={name}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-slate-500/15 py-3 text-sm transition first:border-t-0 hover:text-signal-cyan"
            >
              <span className="font-medium">{name}</span>
              <span className={`shrink-0 text-xs ${muted}`}>{issuer}</span>
            </a>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
