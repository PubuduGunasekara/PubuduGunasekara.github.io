'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme';
import { currentFocus, engineeringPath } from '@/lib/content';

export function EngineeringPath() {
  const { muted } = useTheme();
  const [active, setActive] = useState(0);

  return (
    <div className="lg:border-l lg:border-slate-500/15 lg:pl-8">
      <p className="font-mono text-xs text-signal-green">engineering path</p>
      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium">
        {engineeringPath.map((step, index) => (
          <span key={step} className="flex items-center gap-2">
            {index > 0 && <span className="opacity-30">&rarr;</span>}
            {step}
          </span>
        ))}
      </div>

      <p className="mt-10 font-mono text-xs text-signal-cyan">current focus</p>
      <div className="mt-4 flex flex-col">
        {currentFocus.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setActive(index)}
            className={`border-l py-1.5 pl-3 text-left text-sm transition ${
              active === index
                ? 'border-signal-cyan text-signal-cyan'
                : 'border-slate-500/15 opacity-60 hover:border-signal-cyan/40 hover:opacity-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-4"
      >
        <p className="text-sm font-semibold tracking-tight">{currentFocus[active].value}</p>
        <p className={`mt-2 text-sm leading-6 ${muted}`}>{currentFocus[active].detail}</p>
      </motion.div>
    </div>
  );
}
