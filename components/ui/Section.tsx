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
  const { muted } = useTheme();

  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="grid gap-8 border-t border-slate-500/15 py-20 md:grid-cols-[12rem_1fr]"
    >
      <RevealItem>
        <p className={`font-mono text-xs ${muted}`}>{eyebrow}</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">{title}</h2>
      </RevealItem>
      <RevealItem className="min-w-0">{children}</RevealItem>
    </motion.section>
  );
}
