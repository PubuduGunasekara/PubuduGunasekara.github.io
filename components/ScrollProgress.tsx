'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.2 });

  return (
    <motion.div
      style={{ scaleX: progress }}
      className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-signal-cyan/80"
      aria-hidden="true"
    />
  );
}
