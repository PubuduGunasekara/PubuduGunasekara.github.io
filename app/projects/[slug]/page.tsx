import type { Metadata } from 'next';
import { caseStudies } from '@/lib/caseStudies';
import { CaseStudyView } from '@/components/CaseStudyView';

export function generateStaticParams() {
  return Object.keys(caseStudies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = caseStudies[slug];
  if (!caseStudy) return {};

  return {
    title: `${caseStudy.title} · Case Study · Pubudu Gunasekara`,
    description: caseStudy.tagline,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseStudy = caseStudies[slug];
  if (!caseStudy) return null;

  return <CaseStudyView caseStudy={caseStudy} />;
}
