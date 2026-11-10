'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';
import type { Metric } from '@/lib/content';
import { useTheme } from '@/lib/theme';

function format(metric: Metric, value: number) {
  const decimals = metric.decimals ?? 0;
  return (
    value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + (metric.suffix ?? '')
  );
}

function CountUp({ metric }: { metric: Metric }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduceMotion = useReducedMotion();
  const final = format(metric, metric.value);
  // The server-rendered HTML and reduced-motion visitors always see the final value.
  const [display, setDisplay] = useState(final);

  useEffect(() => {
    if (reduceMotion) return;
    setDisplay(format(metric, 0));
  }, [reduceMotion, metric]);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, metric.value, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(format(metric, v)),
      onComplete: () => setDisplay(final),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, metric, final]);

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {display}
      </span>
      <span className="sr-only">{final}</span>
    </>
  );
}

export function MetricsStrip({ metrics }: { metrics: Metric[] }) {
  const { muted } = useTheme();

  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {metrics.map((metric) => (
        <li key={metric.label} className="rounded-xl border border-slate-500/15 bg-slate-500/[0.04] p-3">
          <p className="font-mono text-2xl font-semibold tracking-tight text-nu-red-text tabular-nums">
            <CountUp metric={metric} />
          </p>
          <p className={`mt-1 text-xs leading-4 ${muted}`}>{metric.label}</p>
        </li>
      ))}
    </ul>
  );
}
