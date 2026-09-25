'use client';

import Link from 'next/link';
import { projects, type Project } from '@/lib/content';
import { useTheme } from '@/lib/theme';
import { Section } from '../ui/Section';
import { EditorialCard } from '../ui/EditorialCard';
import { BulletList, StackRow } from '../ui/StackRow';
import { SecondaryLink } from '../ui/Links';
import { DetailsChevronIcon } from '../ui/icons';

function FeaturedCard({ project, index }: { project: Project; index: number }) {
  const { muted } = useTheme();

  return (
    <EditorialCard>
      <p className={`font-mono text-xs ${muted}`}>
        0{index + 1} / {project.eyebrow}
      </p>
      <h3 className="mt-2 text-lg font-semibold tracking-tight sm:text-xl">{project.title}</h3>
      <p className={`mt-3 leading-7 ${muted}`}>{project.body}</p>

      {project.highlights && (
        <details className="group mt-5">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-signal-cyan [&::-webkit-details-marker]:hidden [&::marker]:hidden">
            Key details
            <DetailsChevronIcon />
          </summary>
          <BulletList items={project.highlights} />
        </details>
      )}

      <div className="mt-6 flex flex-wrap items-baseline gap-3 border-t border-slate-500/10 pt-4">
        <p className={`shrink-0 font-mono text-xs uppercase tracking-widest ${muted}`}>stack</p>
        <StackRow items={project.stack} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SecondaryLink href={project.href}>Code</SecondaryLink>
        {project.demo && <SecondaryLink href={project.demo}>Live Demo</SecondaryLink>}
        {project.caseStudySlug && (
          <Link
            href={`/projects/${project.caseStudySlug}/`}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-sm font-medium text-signal-cyan transition hover:gap-2.5"
          >
            Read the case study
            <span aria-hidden="true">&rarr;</span>
          </Link>
        )}
      </div>
    </EditorialCard>
  );
}

function EarlierProjectCard({ project }: { project: Project }) {
  const { muted } = useTheme();

  return (
    <div className="rounded-2xl border border-slate-500/15 p-4">
      <h4 className="text-sm font-semibold tracking-tight">{project.title}</h4>
      <p className={`mt-1 font-mono text-xs uppercase tracking-widest ${muted}`}>{project.eyebrow}</p>
      <p className={`mt-2 line-clamp-4 text-xs leading-5 ${muted}`}>{project.body}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <a href={project.href} target="_blank" rel="noreferrer" className="text-signal-cyan hover:underline">
          Code
        </a>
        {project.demo && (
          <>
            <span className={muted}>&middot;</span>
            <a href={project.demo} target="_blank" rel="noreferrer" className="text-signal-cyan hover:underline">
              Details
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const { muted } = useTheme();
  const featuredProjects = projects.filter((p) => p.featured);
  const earlierProjects = projects.filter((p) => !p.featured);

  return (
    <Section id="projects" eyebrow="01" title="Featured Work">
      <p className={`mb-6 text-sm ${muted}`}>The projects I&rsquo;d point a hiring manager to first.</p>

      <div className="grid gap-4">
        <FeaturedCard project={featuredProjects[0]} index={0} />
        <div className="grid gap-4 sm:grid-cols-2">
          <FeaturedCard project={featuredProjects[1]} index={1} />
          <FeaturedCard project={featuredProjects[2]} index={2} />
        </div>
      </div>

      <div className="mt-10 border-t border-slate-500/10 pt-8">
        <p className={`font-mono text-xs uppercase tracking-widest ${muted}`}>Earlier projects</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {earlierProjects.map((project) => (
            <EarlierProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </Section>
  );
}
