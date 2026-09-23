'use client';

import { useTheme } from '@/lib/theme';
import { leadership } from '@/lib/content';
import { Section } from '../ui/Section';
import { RevealGroup, RevealItem } from '../ui/Reveal';

const accentDot = ['bg-signal-cyan', 'bg-signal-green', 'bg-signal-blue', 'bg-signal-amber'];

export function LeadershipSection() {
  const { muted, surface } = useTheme();

  return (
    <Section id="leadership" eyebrow="06" title="Leadership & Growth">
      <RevealGroup className="grid gap-3 sm:grid-cols-2">
        {leadership.map((item, index) => (
          <RevealItem key={item.title}>
            <div className={`h-full rounded-2xl border px-4 py-3 ${surface}`}>
              <div className="flex items-start gap-2.5">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${accentDot[index % accentDot.length]}`} aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold leading-snug">{item.title}</p>
                  <p className={`mt-1 text-xs leading-snug ${muted}`}>{item.meta}</p>
                </div>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
