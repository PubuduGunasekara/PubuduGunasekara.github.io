'use client';

import Link from 'next/link';
import { ThemeProvider, useTheme } from '@/lib/theme';
import { ScrollProgress } from './ScrollProgress';
import { BackgroundGrid } from './BackgroundGrid';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { EditorialCard } from './ui/EditorialCard';
import { StackRow } from './ui/StackRow';
import { SecondaryLink, PrimaryLink } from './ui/Links';
import { SchedulerDiagram } from './sections/SchedulerDiagram';
import { ReviewerDiagram } from './sections/ReviewerDiagram';
import type { CaseStudy } from '@/lib/caseStudies';

function Prose({ title, children }: { title: string; children: React.ReactNode }) {
  const { muted } = useTheme();
  return (
    <section className="border-t border-slate-500/15 py-12">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className={`mt-4 space-y-4 leading-7 ${muted}`}>{children}</div>
    </section>
  );
}

function DecisionList({ items }: { items: { title: string; body: string }[] }) {
  const { muted } = useTheme();
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div key={item.title}>
          <h3 className="font-semibold tracking-tight">{item.title}</h3>
          <p className={`mt-1.5 leading-7 ${muted}`}>{item.body}</p>
        </div>
      ))}
    </div>
  );
}

export function CaseStudyView({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <ThemeProvider>
      <CaseStudyBody caseStudy={caseStudy} />
    </ThemeProvider>
  );
}

function CaseStudyBody({ caseStudy }: { caseStudy: CaseStudy }) {
  const { pageTone, muted } = useTheme();

  return (
    <main className={`${pageTone} min-h-screen transition-colors duration-500`}>
      <ScrollProgress />
      <BackgroundGrid />
      <Nav />
      <div id="top" className="relative mx-auto max-w-4xl px-5 pb-20 sm:px-8">
        <div className="pt-10 lg:pt-16">
          <Link href="/#projects" className={`text-sm ${muted} hover:text-signal-cyan`}>
            &larr; Back to projects
          </Link>

          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{caseStudy.title}</h1>
          <p className={`mt-3 max-w-2xl text-balance leading-7 ${muted}`}>{caseStudy.tagline}</p>

          <div className="mt-5">
            <StackRow items={caseStudy.stack} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryLink href={caseStudy.repo}>Code</PrimaryLink>
            {caseStudy.demo && <SecondaryLink href={caseStudy.demo}>Live Demo</SecondaryLink>}
          </div>
        </div>

        <Prose title="Problem">
          {caseStudy.problem.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Prose>

        <Prose title="Architecture">
          {caseStudy.architectureNote.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <div className="not-prose pt-2">
            {caseStudy.diagram === 'task-scheduler' ? <SchedulerDiagram /> : <ReviewerDiagram />}
          </div>
        </Prose>

        <section className="border-t border-slate-500/15 py-12">
          <h2 className="text-xl font-semibold tracking-tight">Key engineering decisions</h2>
          <div className="mt-4">
            <DecisionList items={caseStudy.keyDecisions} />
          </div>
        </section>

        <section className="border-t border-slate-500/15 py-12">
          <h2 className="text-xl font-semibold tracking-tight">Failure scenarios and trade-offs</h2>
          <div className="mt-4">
            <DecisionList items={caseStudy.failureScenarios} />
          </div>
        </section>

        <Prose title="Testing">
          {caseStudy.testing.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Prose>

        <Prose title="Observability">
          {caseStudy.observability.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Prose>

        <Prose title="Deployment and CI">
          {caseStudy.deployment.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Prose>

        <section className="border-t border-slate-500/15 py-12">
          <h2 className="text-xl font-semibold tracking-tight">Known limitations and next steps</h2>
          <EditorialCard className="mt-4">
            <ul className={`space-y-3 leading-7 ${muted}`}>
              {caseStudy.limitations.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-[0.7rem] h-1 w-1 shrink-0 rounded-full bg-current opacity-50" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </EditorialCard>
        </section>

        <section className="border-t border-slate-500/15 py-12">
          <h2 className="text-xl font-semibold tracking-tight">Links</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <SecondaryLink href={caseStudy.repo}>GitHub Repository</SecondaryLink>
            {caseStudy.demo && <SecondaryLink href={caseStudy.demo}>Live Demo</SecondaryLink>}
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
