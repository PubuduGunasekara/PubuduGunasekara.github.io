'use client';

import { ThemeProvider, useTheme } from '@/lib/theme';
import { ScrollProgress } from '@/components/ScrollProgress';
import { BackgroundGrid } from '@/components/BackgroundGrid';
import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { StorySection } from '@/components/sections/StorySection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { LeadershipSection } from '@/components/sections/LeadershipSection';
import { EducationSection } from '@/components/sections/EducationSection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';
import { ContactSection } from '@/components/sections/ContactSection';

export default function Page() {
  return (
    <ThemeProvider>
      <PageBody />
    </ThemeProvider>
  );
}

function PageBody() {
  const { pageTone } = useTheme();

  return (
    <main className={`${pageTone} min-h-screen transition-colors duration-500`}>
      <ScrollProgress />
      <BackgroundGrid />
      <Nav />
      <div id="top" className="relative mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <Hero />
        <ProjectsSection />
        <ExperienceSection />
        <SkillsSection />
        <EducationSection />
        <CertificationsSection />
        <LeadershipSection />
        <StorySection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}
