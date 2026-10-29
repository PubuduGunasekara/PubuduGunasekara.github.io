'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  heroExpected,
  heroGpa,
  heroName,
  heroProof,
  heroProgram,
  heroSeeking,
  heroUniversity,
  links,
} from '@/lib/content';
import { useTheme } from '@/lib/theme';
import { LabeledIconLink, PrimaryLink } from './ui/Links';

function Photo({ sizeClasses }: { sizeClasses: string }) {
  const { theme } = useTheme();
  const ringColor = theme === 'dark' ? 'bg-ink-950' : 'bg-[#f8f6f2]';

  return (
    <div className="relative shrink-0">
      {/* outer halo: diffuse teal glow, static */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 scale-[1.4] rounded-full bg-signal-cyan/10 blur-[16px]" />
      {/* hairline ring between the halo and the photo */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 scale-110 rounded-full border border-signal-cyan/[0.08]" />
      {/* inner solid ring, in the card's own surface tone, so the photo lifts off the card */}
      <div className={`rounded-full p-1 ${ringColor}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/profile-256.jpg"
          alt="Pubudu Gunasekara"
          className={`${sizeClasses} rounded-full object-cover object-[center_28%]`}
        />
      </div>
    </div>
  );
}

export function Hero() {
  const { muted, surface } = useTheme();
  const reduceMotion = useReducedMotion();

  return (
    <div id="hero" className="pt-5 pb-8 sm:pt-8 lg:pt-14 lg:pb-12">
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`relative overflow-hidden rounded-[2rem] border p-5 text-center shadow-hero sm:p-10 sm:text-left lg:p-12 ${surface}`}
      >
        {/* Texture lives on its own layer so its fade mask only affects the
            grid, not the real content stacked on top of it (mask-image
            masks an element's whole painted box, children included). */}
        <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10" />

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Photo sizeClasses="h-14 w-14 sm:h-16 sm:w-16" />
          <h1 className="text-xl font-semibold tracking-[-0.02em] sm:text-2xl">{heroName}</h1>
        </div>

        {/* University wordmark: the largest element, in Northeastern red (text only, no logo) */}
        <div className="mt-6 sm:mt-8">
          <p className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-nu-red-text sm:text-5xl lg:text-6xl">
            {heroUniversity}
          </p>
          <span aria-hidden="true" className="mx-auto mt-4 block h-0.5 w-16 rounded-full bg-nu-red sm:mx-0" />
          <p className="mt-4 text-base font-medium sm:text-lg">{heroProgram}</p>
          <p className={`mt-1 text-sm ${muted}`}>{heroExpected}</p>
        </div>

        <p className="mt-5 flex justify-center sm:justify-start">
          <span className="rounded-full border border-nu-red/30 bg-nu-red/10 px-3 py-1 font-mono text-sm font-semibold text-nu-red-text">
            {heroGpa}
          </span>
        </p>

        <p className="mt-5 text-base leading-7">
          <span className="font-semibold">{heroSeeking.label}</span> {heroSeeking.text}
        </p>

        {/* Proof strip: three compact, verifiable facts */}
        <ul className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
          {heroProof.map((item) => {
            const chip =
              'inline-flex items-center rounded-full border border-slate-500/20 bg-slate-500/10 px-3 py-1.5 font-mono text-xs';
            return (
              <li key={item.label}>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`${chip} text-signal-cyan transition hover:border-nu-red/50 hover:text-nu-red-text`}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className={chip}>{item.label}</span>
                )}
              </li>
            );
          })}
        </ul>
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

      {/* sm and up: single-row wrap */}
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
