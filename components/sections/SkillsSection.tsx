'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { familiarSkills, skills } from '@/lib/content';
import { useTheme } from '@/lib/theme';
import { Section } from '../ui/Section';
import { ChevronIcon } from '../ui/icons';
import { RevealGroup, RevealItem } from '../ui/Reveal';

const accentDot = ['bg-signal-cyan', 'bg-signal-green', 'bg-signal-blue', 'bg-signal-amber'];

export function SkillsSection() {
  const { muted } = useTheme();
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());

  const toggle = (index: number) =>
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <Section id="skills" eyebrow="03" title="Skills">
      <RevealGroup className="flex flex-col">
        {skills.map((group, index) => {
          const isOpen = openSet.has(index);
          return (
            <RevealItem key={group.category}>
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                className={`group grid w-full gap-2 border-t border-slate-500/15 py-5 text-left transition first:border-t-0 hover:bg-slate-500/[0.03] sm:grid-cols-[11rem_1fr_1.5rem] sm:items-baseline sm:gap-6 sm:px-2 ${
                  group.secondary ? 'opacity-70' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${accentDot[index % accentDot.length]}`} aria-hidden="true" />
                  <p className={`font-mono text-xs ${group.secondary ? muted : 'text-signal-cyan'}`}>{group.category}</p>
                  <span className={`font-mono text-xs ${muted} opacity-70`}>{String(group.items.length).padStart(2, '0')}</span>
                </div>
                <p className={`${group.secondary ? 'text-sm' : ''} leading-7 ${muted}`}>
                  {group.items.map((skill, i) => (
                    <span key={skill}>
                      <span className="transition hover:text-signal-cyan">{skill}</span>
                      {i < group.items.length - 1 && <span className="opacity-50"> &middot; </span>}
                    </span>
                  ))}
                </p>
                <span className="hidden justify-self-end sm:block">
                  <ChevronIcon open={isOpen} className="h-3 w-3" />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className={`pb-5 text-sm leading-6 sm:px-2 ${muted}`}>
                      <span className="font-medium opacity-80">in practice: </span>
                      {group.context}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </RevealItem>
          );
        })}
      </RevealGroup>
      <p className={`mt-5 border-t border-slate-500/15 pt-5 text-xs ${muted} sm:px-2`}>
        <span className="opacity-60">Familiar: </span>
        {familiarSkills.join(' · ')}
      </p>
    </Section>
  );
}
