'use client';

import { motion } from 'framer-motion';
import { heroAvailability, heroName, heroSummary, heroTagline, heroTechLine, links } from '@/lib/content';
import { useTheme } from '@/lib/theme';
import { PrimaryLink, SecondaryLink } from './ui/Links';

export function Hero() {
  const { muted, surface } = useTheme();

  return (
    <div id="hero" className="pt-10 pb-10 lg:pt-20 lg:pb-16">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`grid items-center gap-10 rounded-[2rem] border p-8 shadow-premium sm:p-12 md:grid-cols-[1fr_auto] ${surface}`}
      >
        <div className="order-1 mx-auto shrink-0 md:order-2 md:mx-0">
          <div className="relative">
            <div aria-hidden="true" className="absolute inset-0 -z-10 scale-125 rounded-full bg-signal-cyan/20 blur-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/profile.png"
              alt="Pubudu Gunasekara"
              className="h-32 w-32 rounded-full border border-slate-500/15 object-cover object-[center_28%] sm:h-40 sm:w-40 md:h-48 md:w-48"
            />
          </div>
        </div>

        <div className="order-2 text-center md:order-1 md:text-left">
          <h1 className="text-balance text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">{heroName}</h1>
          <p className="mt-3 text-balance text-lg font-medium sm:text-xl">{heroTagline}</p>
          <p className={`mx-auto mt-4 max-w-2xl text-balance leading-7 md:mx-0 ${muted}`}>{heroSummary}</p>
          <p className="mt-4 font-mono text-sm text-signal-cyan">{heroTechLine}</p>
          <p className={`mt-2 text-sm ${muted}`}>{heroAvailability}</p>

          <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
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
