'use client';

import { motion } from 'framer-motion';
import { heroAvailability, heroCredential, heroName, heroTagline, heroTechLine, links } from '@/lib/content';
import { useTheme } from '@/lib/theme';
import { LabeledIconLink, PrimaryLink } from './ui/Links';

function Photo({ sizeClasses }: { sizeClasses: string }) {
  const { theme } = useTheme();
  const ringColor = theme === 'dark' ? 'bg-ink-950' : 'bg-[#f8f6f2]';

  return (
    <div className="relative shrink-0">
      {/* outer halo: diffuse teal glow, static */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 scale-[1.4] rounded-full bg-signal-cyan/10 blur-[20px]" />
      {/* hairline ring between the halo and the photo */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 scale-110 rounded-full border border-signal-cyan/[0.08]" />
      {/* inner solid ring, in the card's own surface tone, so the photo lifts off the card */}
      <div className={`rounded-full p-1.5 ${ringColor}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/profile.png"
          alt="Pubudu Gunasekara"
          className={`${sizeClasses} rounded-full object-cover object-[center_28%]`}
        />
      </div>
    </div>
  );
}

export function Hero() {
  const { muted, surface } = useTheme();

  return (
    <div id="hero" className="pt-10 pb-10 lg:pt-20 lg:pb-16">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`relative grid items-center gap-8 overflow-hidden rounded-[2rem] border p-8 shadow-hero sm:p-12 md:grid-cols-[1fr_auto] md:gap-10 lg:p-14 ${surface}`}
      >
        {/* Texture lives on its own layer so its fade mask only affects the
            grid, not the real content stacked on top of it (mask-image
            masks an element's whole painted box, children included). */}
        <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10" />

        {/* True mobile only (<640px): photo on top, name/tagline centered below it */}
        <div className="flex flex-col items-center text-center sm:hidden">
          <Photo sizeClasses="h-28 w-28" />
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.02em]">{heroName}</h1>
          <p className="mt-2 text-base font-medium">{heroTagline}</p>
        </div>

        {/* sm to md (tablet): small avatar beside the name, left-aligned - unchanged */}
        <div className="hidden items-center gap-4 sm:flex md:hidden">
          <Photo sizeClasses="h-16 w-16" />
          <div className="text-left">
            <h1 className="text-2xl font-semibold tracking-[-0.02em]">{heroName}</h1>
            <p className="mt-1 text-sm font-medium">{heroTagline}</p>
          </div>
        </div>

        {/* Desktop-only photo, right column */}
        <div className="order-2 hidden md:block">
          <Photo sizeClasses="h-40 w-40 sm:h-48 sm:w-48" />
        </div>

        <div className="order-1 text-center sm:text-left">
          <div className="hidden md:block">
            <h1 className="text-balance text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">{heroName}</h1>
            <p className="mt-3 text-balance text-lg font-medium sm:text-xl">{heroTagline}</p>
          </div>

          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-signal-green/30 bg-signal-green/10 px-3 py-1.5 font-mono text-xs text-signal-green sm:text-sm">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal-green" aria-hidden="true" />
            {heroAvailability}
          </span>

          <p className={`mt-3 text-sm ${muted}`}>{heroCredential}</p>
          <p className="mt-3 font-mono text-sm text-signal-cyan">{heroTechLine}</p>
        </div>
      </motion.header>

      {/* True mobile (<640px): single wrapping row, item order chosen so the
          natural wrap lands as a balanced 3-then-2 (measured button widths at
          390px: Resume+GitHub+Email fits one line, LinkedIn+LeetCode fits the next) */}
      <div className="mt-6 flex flex-wrap justify-center gap-3 sm:hidden">
        <PrimaryLink href={links.resume}>Resume</PrimaryLink>
        <LabeledIconLink href={links.github} label="GitHub" icon="github" />
        <LabeledIconLink href={`mailto:${links.email}`} label="Email" icon="email" />
        <LabeledIconLink href={links.linkedin} label="LinkedIn" icon="linkedin" />
        <LabeledIconLink href={links.leetcode} label="LeetCode" icon="leetcode" />
      </div>

      {/* sm and up: unchanged single-row wrap */}
      <div className="mt-6 hidden flex-wrap justify-center gap-3 sm:flex">
        <PrimaryLink href={links.resume}>Resume</PrimaryLink>
        <LabeledIconLink href={links.github} label="GitHub" icon="github" />
        <LabeledIconLink href={links.linkedin} label="LinkedIn" icon="linkedin" />
        <LabeledIconLink href={links.leetcode} label="LeetCode" icon="leetcode" />
        <LabeledIconLink href={`mailto:${links.email}`} label="Email" icon="email" />
      </div>
    </div>
  );
}
