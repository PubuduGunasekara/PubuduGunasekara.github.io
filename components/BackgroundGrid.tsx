'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/hooks';

export function BackgroundGrid() {
  const { scrollY } = useScroll();
  const reducedMotion = usePrefersReducedMotion();
  const y = useTransform(scrollY, [0, 4000], reducedMotion ? [0, 0] : [0, 80]);

  return (
    <>
      <motion.div style={{ y }} className="premium-grid fixed inset-0 opacity-60" />
      <div className="ambient-glow pointer-events-none fixed inset-0" />
    </>
  );
}
