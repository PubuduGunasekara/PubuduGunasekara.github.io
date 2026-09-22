'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { projects } from '@/lib/content';
import { useTheme } from '@/lib/theme';
import { Section } from '../ui/Section';
import { ChevronIcon } from '../ui/icons';
import { EditorialCard } from '../ui/EditorialCard';
import { BulletList, StackRow } from '../ui/StackRow';
import { SecondaryLink } from '../ui/Links';
import { SchedulerDiagram } from './SchedulerDiagram';

function StatusDot({ color }: { color?: string }) {
  const dotColor = color?.includes('green') ? 'bg-signal-green' : color?.includes('amber') ? 'bg-signal-amber' : 'bg-signal-cyan';
  return <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`} />;
}

export function ProjectsSection() {
  const { muted } = useTheme();
  const [openSet, setOpenSet] = useState<Set<number>>(new Set([0]));

  const toggle = (index: number) =>
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <Section id="projects" eyebrow="04" title="Featured Projects">
      <p className={`mb-6 text-sm ${muted}`}>
        {projects.length} projects &middot; click any card to expand
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project, index) => {
          const isOpen = openSet.has(index);
          return (
            <EditorialCard key={project.title} className={isOpen ? 'sm:col-span-2' : ''}>
              <button type="button" onClick={() => toggle(index)} aria-expanded={isOpen} className="group flex w-full items-start justify-between gap-4 text-left">
                <div>
                  <p className="font-mono text-xs text-signal-cyan">
                    0{index + 1} / {project.eyebrow}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight transition group-hover:opacity-80 sm:text-xl">{project.title}</h3>
                  <p className={`mt-2 flex items-center gap-2 text-xs leading-5 ${muted}`}>
                    <StatusDot color={project.statusColor} />
                    {project.status}
                  </p>
                </div>
                <span className="mt-1 shrink-0">
                  <ChevronIcon open={isOpen} />
                </span>
              </button>

              {!isOpen && <p className={`mt-3 line-clamp-2 text-sm leading-6 ${muted}`}>{project.body}</p>}

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className={project.hasDiagram ? 'mt-4 grid grid-cols-1 gap-8 xl:grid-cols-[1.05fr_1fr] xl:items-start' : 'mt-4'}>
                      <div>
                        <p className={`leading-7 ${muted}`}>{project.body}</p>
                        {project.highlights && <BulletList items={project.highlights} />}

                        <div className="mt-6 flex flex-wrap items-baseline gap-3 border-t border-slate-500/10 pt-4">
                          <p className="shrink-0 font-mono text-[10px] uppercase tracking-widest opacity-40">stack</p>
                          <StackRow items={project.stack} />
                        </div>

                        <div className="mt-7 flex flex-wrap gap-3">
                          <SecondaryLink href={project.href}>GitHub</SecondaryLink>
                          {project.demo && <SecondaryLink href={project.demo}>Demo</SecondaryLink>}
                        </div>
                      </div>

                      {project.hasDiagram && <SchedulerDiagram />}
                    </div>

                    {project.embed && (
                      <div className="mt-7 overflow-hidden rounded-3xl border border-slate-500/15 bg-slate-500/10">
                        <iframe src={project.embed} title={`${project.title} LinkedIn demo`} className="h-[399px] w-full" allowFullScreen />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </EditorialCard>
          );
        })}
      </div>
    </Section>
  );
}
