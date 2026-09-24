'use client';

import { useState } from 'react';
import { contactAvailability, contactBody, links } from '@/lib/content';
import { useTheme } from '@/lib/theme';
import { Section } from '../ui/Section';
import { EditorialCard } from '../ui/EditorialCard';
import { PrimaryLink, SecondaryLink, SocialIconLink } from '../ui/Links';

export function ContactSection() {
  const { muted } = useTheme();
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable; the email text is still visible and selectable.
    }
  }

  return (
    <Section id="contact" eyebrow="08" title="Contact">
      <EditorialCard>
        <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Let&apos;s talk about a Summer 2027 internship.</h2>
        <p className={`mt-5 max-w-2xl leading-8 ${muted}`}>{contactBody}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={copyEmail}
            className="group inline-flex items-center gap-2 rounded-full border border-slate-500/15 bg-slate-500/10 px-5 py-3 text-sm font-medium transition hover:border-signal-cyan/40 hover:text-signal-cyan"
          >
            {links.email}
            <span className={`font-mono text-xs ${copied ? 'text-signal-green' : muted}`}>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <p className={`mt-4 text-sm ${muted}`}>{contactAvailability}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <PrimaryLink href={links.resume}>Resume</PrimaryLink>
          <SecondaryLink href={links.linkedin}>LinkedIn</SecondaryLink>
          <SecondaryLink href={links.github}>GitHub</SecondaryLink>
          <SocialIconLink href={links.leetcode} label="LeetCode" icon="leetcode" />
          {links.calendly && <SecondaryLink href={links.calendly}>Book a 15-minute chat</SecondaryLink>}
        </div>
      </EditorialCard>
    </Section>
  );
}
