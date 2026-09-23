'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '@/lib/theme';
import { storyPoints, storySummary } from '@/lib/content';
import { Section } from '../ui/Section';
import { ChevronIcon } from '../ui/icons';
import { EngineeringPath } from './EngineeringPath';

const accentDot = ['bg-signal-cyan', 'bg-signal-green', 'bg-signal-blue', 'bg-signal-amber'];
const accentText = ['text-signal-cyan', 'text-signal-green', 'text-signal-blue', 'text-signal-amber'];

export function StorySection() {
  const { muted } = useTheme();
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 0.85', 'end 0.5'] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const toggle = (index: number) =>
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <Section id="story" eyebrow="07" title="Story">
      <p className={`mb-10 max-w-2xl text-sm leading-6 ${muted}`}>{storySummary}</p>

      <div className="grid gap-16 lg:grid-cols-[1fr_15rem]">
        <div ref={containerRef} className="relative">
          <span className="absolute left-[3px] top-1 bottom-1 w-px bg-slate-500/15" aria-hidden="true" />
          <motion.span
            style={{ scaleY: fill }}
            className="absolute left-[3px] top-1 bottom-1 w-px origin-top bg-signal-cyan"
            aria-hidden="true"
          />
          <motion.div layout className="flex flex-col gap-3">
            {storyPoints.map((item, index) => {
              const isOpen = openSet.has(index);
              return (
                <motion.div layout key={item.title} className="relative pl-8">
                  <span
                    className={`absolute left-0 top-[7px] h-[7px] w-[7px] rounded-full ${accentDot[index]}`}
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-start justify-between gap-4 py-2 text-left"
                  >
                    <div>
                      <p className={`font-mono text-xs ${accentText[index]}`}>{item.label}</p>
                      <h3 className="mt-2 text-lg font-semibold tracking-tight transition group-hover:opacity-80 sm:text-xl">
                        {item.title}
                      </h3>
                    </div>
                    <span className="mt-2 shrink-0">
                      <ChevronIcon open={isOpen} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className={`max-w-xl pb-2 leading-7 ${muted}`}>{item.body}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
        <EngineeringPath />
      </div>
    </Section>
  );
}
