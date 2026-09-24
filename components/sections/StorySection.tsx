'use client';

import { useTheme } from '@/lib/theme';
import { journeyClosing, journeySteps } from '@/lib/content';
import { Section } from '../ui/Section';

const accentDot = ['bg-signal-cyan', 'bg-signal-green', 'bg-signal-blue', 'bg-signal-amber'];

export function StorySection() {
  const { muted } = useTheme();

  return (
    <Section id="story" eyebrow="07" title="How I got here">
      <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-start sm:gap-x-8 sm:gap-y-6">
        {journeySteps.map((step, index) => (
          <div key={step.place} className="flex items-start gap-3 sm:w-[calc(50%-1rem)] lg:w-auto lg:flex-1">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${accentDot[index]}`} aria-hidden="true" />
            <div>
              <p className="font-semibold tracking-tight">{step.place}</p>
              <p className={`mt-1 text-sm leading-6 ${muted}`}>{step.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-10 max-w-2xl text-balance border-t border-slate-500/15 pt-6 leading-7">{journeyClosing}</p>
    </Section>
  );
}
