'use client';

import Link from 'next/link';
import { whyMeBuilding, whyMeExperience, whyMeHeading, whyMeProjects } from '@/lib/content';
import { useTheme } from '@/lib/theme';
import { Section } from '../ui/Section';
import { EditorialCard } from '../ui/EditorialCard';

export function WhyMeSection() {
  const { muted } = useTheme();
  const label = `font-mono text-xs uppercase tracking-widest ${muted}`;

  return (
    <Section id="why-me" title={whyMeHeading}>
      <div className="grid gap-4">
        {whyMeProjects.map((project) => (
          <EditorialCard key={project.title}>
            <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
              {project.href ? (
                <Link href={project.href} className="transition hover:text-nu-red-text">
                  {project.title}
                </Link>
              ) : (
                project.title
              )}
            </h3>
            <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-[10.5rem_1fr]">
              <dt className={`${label} sm:pt-1`}>Built</dt>
              <dd className="leading-7">{project.built}</dd>
              <dt className={`${label} sm:pt-1`}>With</dt>
              <dd className={`font-mono text-sm leading-7 ${muted}`}>{project.with}</dd>
              <dt className="font-mono text-xs uppercase tracking-widest text-nu-red-text sm:pt-1">What it means for your team</dt>
              <dd className="leading-7">{project.means}</dd>
            </dl>
          </EditorialCard>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-500/15 px-5 py-4">
        <p className={label}>Experience</p>
        <p className="mt-2 text-sm leading-7">{whyMeExperience}</p>
      </div>

      <p className={`mt-4 text-sm leading-6 ${muted}`}>{whyMeBuilding}</p>
    </Section>
  );
}
