'use client';

import { useTheme } from '@/lib/theme';
import { certifications } from '@/lib/content';
import { Section } from '../ui/Section';
import { RevealGroup, RevealItem } from '../ui/Reveal';
import { EditorialCard } from '../ui/EditorialCard';

export function CertificationsSection() {
  const { muted } = useTheme();

  return (
    <Section id="certifications" eyebrow="05" title="Certifications">
      <RevealGroup className="grid gap-3 md:grid-cols-2">
        {certifications.map(([name, issuer, href], index) => (
          <RevealItem key={name}>
            <a href={href} target="_blank" rel="noreferrer">
              <EditorialCard className={index < 5 ? 'border-signal-cyan/30' : ''}>
                <p className="text-lg font-semibold tracking-tight">{name}</p>
                <p className={`mt-2 text-sm ${muted}`}>{issuer}</p>
              </EditorialCard>
            </a>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
