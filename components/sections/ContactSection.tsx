'use client';

import { useTheme } from '@/lib/theme';
import { contactBody, links } from '@/lib/content';
import { Section } from '../ui/Section';
import { EditorialCard } from '../ui/EditorialCard';
import { PrimaryLink, SocialIconLink } from '../ui/Links';

export function ContactSection() {
  const { muted } = useTheme();

  return (
    <Section id="contact" eyebrow="08" title="Contact">
      <EditorialCard>
        <h2 className="text-4xl font-semibold tracking-[-0.045em]">Let&apos;s build useful systems.</h2>
        <p className={`mt-5 max-w-2xl leading-8 ${muted}`}>{contactBody}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <PrimaryLink href={links.resume}>Resume</PrimaryLink>
          <SocialIconLink href={links.linkedin} label="LinkedIn" icon="linkedin" />
          <SocialIconLink href={links.github} label="GitHub" icon="github" />
          <SocialIconLink href={links.leetcode} label="LeetCode" icon="leetcode" />
          <SocialIconLink href={links.email} label="Email" icon="email" />
        </div>
      </EditorialCard>
    </Section>
  );
}
