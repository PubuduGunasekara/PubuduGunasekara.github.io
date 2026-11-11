'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { instantVariants, revealItem, staggerContainer, viewportOnce } from './motion';

export function RevealGroup({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : 'hidden'}
      animate={reduceMotion ? 'visible' : undefined}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={viewportOnce}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div variants={reduceMotion ? instantVariants : revealItem} className={className}>
      {children}
    </motion.div>
  );
}
