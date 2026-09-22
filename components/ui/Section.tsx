'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme';
import { staggerContainer, viewportOnce } from './motion';
import { RevealItem } from './Reveal';

export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="grid gap-8 border-t border-slate-500/15 py-20 md:grid-cols-[12rem_1fr]"
    >
      <RevealItem className="relative">
        {theme === 'light' && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-1 -top-10 -z-10 select-none whitespace-nowrap font-mono text-[6rem] font-bold leading-none sm:text-[7.5rem]"
            style={{ color: 'transparent', WebkitTextStroke: '1px rgba(15, 23, 42, 0.07)' }}
          >
            {eyebrow}
          </span>
        )}
        <p className="font-mono text-xs text-signal-cyan">{eyebrow}</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">{title}</h2>
      </RevealItem>
      <RevealItem className="min-w-0">{children}</RevealItem>
    </motion.section>
  );
}
