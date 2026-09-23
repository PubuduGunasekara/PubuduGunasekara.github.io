'use client';

import { motion } from 'framer-motion';
import { heroAvailability, heroName, heroSummary, heroTagline, heroTechLine, links } from '@/lib/content';
import { useTheme } from '@/lib/theme';
import { PrimaryLink, SecondaryLink } from './ui/Links';

export function Hero() {
  const { muted } = useTheme();

  return (
    <div id="hero" className="pt-10 lg:pt-20">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="grid items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-14"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/profile.png"
          alt="Pubudu Gunasekara"
          className="h-28 w-28 shrink-0 rounded-2xl border border-slate-500/15 object-cover object-[center_28%] sm:h-32 sm:w-32"
        />

        <div>
          <h1 className="text-balance text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">{heroName}</h1>
          <p className="mt-3 text-balance text-lg font-medium sm:text-xl">{heroTagline}</p>
          <p className={`mt-4 max-w-2xl text-balance leading-7 ${muted}`}>{heroSummary}</p>
          <p className="mt-4 font-mono text-sm text-signal-cyan">{heroTechLine}</p>
          <p className={`mt-2 text-sm ${muted}`}>{heroAvailability}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <PrimaryLink href={links.resume}>Resume</PrimaryLink>
            <SecondaryLink href={links.github}>GitHub</SecondaryLink>
            <SecondaryLink href={links.linkedin}>LinkedIn</SecondaryLink>
            <SecondaryLink href="#contact">Contact</SecondaryLink>
          </div>
        </div>
      </motion.header>
    </div>
  );
}
