'use client';

import { motion } from 'framer-motion';
import { heroAvailability, heroCredential, heroName, heroTagline, heroTechLine, links } from '@/lib/content';
import { useTheme } from '@/lib/theme';
import { LabeledIconLink, PrimaryLink } from './ui/Links';

function Photo({ sizeClasses }: { sizeClasses: string }) {
  return (
    <div className="relative shrink-0">
      <div aria-hidden="true" className="absolute inset-0 -z-10 scale-125 rounded-full bg-signal-cyan/20 blur-2xl" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/profile.png"
        alt="Pubudu Gunasekara"
        className={`${sizeClasses} rounded-full border border-slate-500/15 object-cover object-[center_28%]`}
      />
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
        className={`premium-grid grid items-center gap-8 rounded-[2rem] border p-8 shadow-premium sm:p-12 md:grid-cols-[1fr_auto] md:gap-10 ${surface}`}
      >
        {/* Mobile-only: small avatar beside the name, instead of a large photo stacked on top */}
        <div className="flex items-center gap-4 md:hidden">
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

        <div className="order-1 text-left">
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

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <PrimaryLink href={links.resume}>Resume</PrimaryLink>
        <LabeledIconLink href={links.github} label="GitHub" icon="github" />
        <LabeledIconLink href={links.linkedin} label="LinkedIn" icon="linkedin" />
        <LabeledIconLink href={links.leetcode} label="LeetCode" icon="leetcode" />
        <LabeledIconLink href={`mailto:${links.email}`} label="Email" icon="email" />
      </div>
    </div>
  );
}
