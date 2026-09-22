'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { currentFocus, heroBadge, links } from '@/lib/content';
import { useGithubStats } from '@/lib/useGithubStats';
import { useTheme } from '@/lib/theme';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { AnimatedCounter } from './ui/AnimatedCounter';
import { SocialIconLink } from './ui/Links';
import { CursorReadout } from './CursorReadout';

export function Hero() {
  const { surface, muted } = useTheme();
  const github = useGithubStats();
  const reducedMotion = usePrefersReducedMotion();
  const [focusIndex, setFocusIndex] = useState(3);

  return (
    <div id="hero" className="relative pt-8 lg:pt-16">
      <CursorReadout />

      {!reducedMotion && (
        <motion.div
          className="pointer-events-none absolute -left-24 -top-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-signal-cyan/[0.07] blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 24, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />
      )}

      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end"
      >
        <div>
          <p className="mb-4 font-mono text-sm text-signal-cyan">
            Software engineering &middot; cloud &middot; ML systems
            <span className="cursor-blink ml-1.5 inline-block h-4 w-[2px] translate-y-0.5 align-middle bg-signal-cyan" aria-hidden="true" />
          </p>
          <h1
            className="max-w-3xl text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-5xl lg:text-6xl"
            style={{ textShadow: '0 0 60px rgb(var(--signal-cyan) / 0.18)' }}
          >
            Pubudu Gunasekara
          </h1>
          <p className={`mt-5 max-w-2xl text-balance leading-7 ${muted}`}>
            M.S. in Computer Science at Northeastern University, Silicon Valley. I&apos;m focused on
            building distributed systems and AI-powered products. Previously worked as an SDET at
            Virtusa on a British Telecom platform with over{' '}
            <span className="text-signal-green font-medium">1M users</span>
            {', '}where I helped build Java and Selenium automation for regression testing.
          </p>
          <div className="mt-7 flex rounded-full border border-slate-500/15 bg-slate-500/10 p-1">
            <SocialIconLink href={links.github} label="GitHub" icon="github" />
            <SocialIconLink href={links.linkedin} label="LinkedIn" icon="linkedin" />
            <SocialIconLink href={links.leetcode} label="LeetCode" icon="leetcode" />
            <SocialIconLink href={links.email} label="Email" icon="email" />
          </div>
        </div>

        <aside
          className={`group relative overflow-hidden rounded-3xl border p-5 shadow-premium transition-colors duration-300 hover:border-signal-cyan/30 ${surface}`}
        >
          <div className="flex items-center gap-4">
            <div className="hero-photo-ring shrink-0">
              <div className="overflow-hidden rounded-[0.85rem]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/profile.png"
                  alt="Pubudu Gunasekara"
                  className="h-[4.5rem] w-[4.5rem] object-cover object-[center_28%]"
                />
              </div>
              <span className="pulse-dot absolute -bottom-0.5 -right-0.5 inline-flex h-3 w-3 rounded-full bg-signal-green opacity-75" aria-hidden="true" />
              <span className="recording-dot absolute -bottom-0.5 -right-0.5 inline-flex h-3 w-3 rounded-full bg-signal-green" aria-hidden="true" />
            </div>
            <div>
              <p className="font-mono text-xs font-medium text-signal-green">{heroBadge}</p>
              <p className={`mt-2 text-sm ${muted}`}>San Jose, CA &middot; Northeastern Silicon Valley</p>
            </div>
          </div>

          <div className="relative mt-6 overflow-hidden rounded-2xl border border-slate-500/15 bg-slate-500/[0.05] p-4 font-mono text-xs transition-colors duration-300 group-hover:border-signal-cyan/20">
            <div className="flex items-center justify-between opacity-60">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-signal-green opacity-75" />
                  <span className="recording-dot relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-green" />
                </span>
                live
              </span>
              <span className="flex gap-1" aria-hidden="true">
                <span className="h-1.5 w-1.5 rounded-full bg-signal-red/50" />
                <span className="h-1.5 w-1.5 rounded-full bg-signal-amber/50" />
                <span className="h-1.5 w-1.5 rounded-full bg-signal-green/50" />
              </span>
            </div>
            <div className="mt-3 space-y-1.5">
              <a
                href={links.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between transition hover:text-signal-cyan"
              >
                <span className="opacity-50">repos</span>
                <span className="flex items-center gap-1 text-signal-cyan">
                  {github.loading ? (
                    <span className="inline-block h-3 w-8 animate-pulse rounded bg-current/10" />
                  ) : (
                    <AnimatedCounter target={github.publicRepos} suffix="+" />
                  )}
                  <span className="opacity-40">&#8599;</span>
                </span>
              </a>
              <div className="flex items-center justify-between">
                <span className="opacity-50">users served</span>
                <span className="text-signal-green">
                  <AnimatedCounter target={1} suffix="M+" />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="opacity-50">ci / cd</span>
                <span>passing</span>
              </div>
              <button
                type="button"
                onClick={() => setFocusIndex((i) => (i + 1) % currentFocus.length)}
                aria-label="Cycle current focus"
                className="flex w-full items-center justify-between text-left transition hover:text-signal-cyan"
              >
                <span className="opacity-50">focus</span>
                <span className="relative flex items-center gap-1.5 overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={focusIndex}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {currentFocus[focusIndex].label.toLowerCase()}
                    </motion.span>
                  </AnimatePresence>
                  <span className="opacity-30">&#8635;</span>
                </span>
              </button>
            </div>
          </div>
        </aside>
      </motion.header>
    </div>
  );
}
