'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme';
import { usePrefersReducedMotion } from '@/lib/hooks';

type NodeId = 'producer' | 'kafka' | 'consumer' | 'redis' | 'process' | 'retry' | 'ack' | 'dlq';
type Variant = 'neutral' | 'success' | 'warning' | 'critical';

const nodes: Record<NodeId, { x: number; y: number; label: string; sub: string }> = {
  producer: { x: 75, y: 124, label: 'Producer', sub: 'submits task' },
  kafka: { x: 220, y: 124, label: 'Kafka topic', sub: 'at-least-once' },
  consumer: { x: 365, y: 124, label: 'Consumer', sub: 'claims task' },
  redis: { x: 510, y: 124, label: 'Redis lock', sub: 'SETNX' },
  process: { x: 655, y: 124, label: 'Process', sub: 'runs handler' },
  ack: { x: 730, y: 200, label: 'Ack', sub: 'complete' },
  retry: { x: 655, y: 40, label: 'Retry', sub: 'backoff' },
  dlq: { x: 510, y: 200, label: 'DLQ', sub: 'dead-letter' },
};

const nodeInfo: Record<NodeId, string> = {
  producer: 'Publishes tasks onto the Kafka topic.',
  kafka: 'Buffers tasks with at-least-once delivery — a consumer may see a task more than once.',
  consumer: 'Spring Boot listener that claims tasks off the topic.',
  redis: 'SETNX-based distributed lock that rejects duplicate execution across consumer instances.',
  process: 'Task handler executes business logic while holding the lock.',
  retry: 'Failed executions are rescheduled with exponential backoff instead of being dropped.',
  ack: 'Lock released, task marked complete, metrics recorded to Prometheus.',
  dlq: 'Tasks that exhaust their retry budget land here for inspection instead of vanishing silently.',
};

type Frame = { node: NodeId; edge?: [NodeId, NodeId]; caption: string; variant: Variant };

const scenarios: Frame[][] = [
  [
    { node: 'producer', caption: 'Producer publishes the task to the "tasks" Kafka topic.', variant: 'neutral' },
    { node: 'kafka', edge: ['producer', 'kafka'], caption: 'At-least-once delivery — the task won’t be lost, even if occasionally redelivered.', variant: 'neutral' },
    { node: 'consumer', edge: ['kafka', 'consumer'], caption: 'A consumer instance picks up the task from the partition.', variant: 'neutral' },
    { node: 'redis', edge: ['consumer', 'redis'], caption: 'Redis SETNX attempts to acquire a distributed lock keyed by task ID.', variant: 'neutral' },
    { node: 'process', edge: ['redis', 'process'], caption: 'Lock acquired — the task executes exactly once, even with multiple consumers running.', variant: 'neutral' },
    { node: 'ack', edge: ['process', 'ack'], caption: 'Success. Lock released, task marked complete.', variant: 'success' },
  ],
  [
    { node: 'producer', caption: 'Producer publishes the task to the "tasks" Kafka topic.', variant: 'neutral' },
    { node: 'kafka', edge: ['producer', 'kafka'], caption: 'At-least-once delivery guarantees the task reaches a consumer.', variant: 'neutral' },
    { node: 'consumer', edge: ['kafka', 'consumer'], caption: 'A consumer instance picks up the task from the partition.', variant: 'neutral' },
    { node: 'redis', edge: ['consumer', 'redis'], caption: 'Redis SETNX acquires the distributed lock for this task ID.', variant: 'neutral' },
    { node: 'process', edge: ['redis', 'process'], caption: 'Lock acquired — the task begins executing.', variant: 'neutral' },
    { node: 'retry', edge: ['process', 'retry'], caption: 'Execution failed. Instead of failing outright, it’s rescheduled with exponential backoff.', variant: 'warning' },
    { node: 'process', edge: ['retry', 'process'], caption: 'Retry attempt — the task executes again with the lock re-acquired.', variant: 'neutral' },
    { node: 'ack', edge: ['process', 'ack'], caption: 'Success on retry. Lock released, task marked complete.', variant: 'success' },
  ],
  [
    { node: 'producer', caption: 'Producer publishes the task to the "tasks" Kafka topic.', variant: 'neutral' },
    { node: 'kafka', edge: ['producer', 'kafka'], caption: 'At-least-once delivery guarantees the task reaches a consumer.', variant: 'neutral' },
    { node: 'consumer', edge: ['kafka', 'consumer'], caption: 'A consumer instance picks up the task from the partition.', variant: 'neutral' },
    { node: 'redis', edge: ['consumer', 'redis'], caption: 'Redis SETNX acquires the distributed lock for this task ID.', variant: 'neutral' },
    { node: 'process', edge: ['redis', 'process'], caption: 'Lock acquired — the task begins executing.', variant: 'neutral' },
    { node: 'retry', edge: ['process', 'retry'], caption: 'First failure — retry #1 scheduled with backoff.', variant: 'warning' },
    { node: 'process', edge: ['retry', 'process'], caption: 'Retry #1 runs — and fails again.', variant: 'neutral' },
    { node: 'retry', edge: ['process', 'retry'], caption: 'Retry #2 scheduled — the backoff interval increases.', variant: 'warning' },
    { node: 'dlq', edge: ['retry', 'dlq'], caption: 'Retries exhausted. The task moves to the dead-letter queue instead of disappearing silently.', variant: 'critical' },
  ],
];

const edgeList: Array<[NodeId, NodeId]> = [
  ['producer', 'kafka'],
  ['kafka', 'consumer'],
  ['consumer', 'redis'],
  ['redis', 'process'],
  ['process', 'ack'],
  ['process', 'retry'],
  ['retry', 'dlq'],
];

function edgeKey(a: NodeId, b: NodeId) {
  return [a, b].sort().join('-');
}

function variantColor(variant: Variant) {
  if (variant === 'success') return 'text-signal-green';
  if (variant === 'warning') return 'text-signal-amber';
  if (variant === 'critical') return 'text-signal-red';
  return 'text-signal-cyan';
}

export function SchedulerDiagram() {
  const { muted } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);
  const [pinned, setPinned] = useState<NodeId | null>(null);

  const frames = scenarios[scenarioIndex];
  const frame = frames[frameIndex];

  useEffect(() => {
    if (pinned || reducedMotion) return;
    const timer = setTimeout(() => {
      if (frameIndex < frames.length - 1) {
        setFrameIndex(frameIndex + 1);
      } else {
        setScenarioIndex((scenarioIndex + 1) % scenarios.length);
        setFrameIndex(0);
      }
    }, frame.variant === 'success' || frame.variant === 'critical' ? 2200 : 1450);
    return () => clearTimeout(timer);
  }, [frameIndex, scenarioIndex, pinned, reducedMotion, frame, frames.length]);

  const activeEdgeKey = frame.edge ? edgeKey(frame.edge[0], frame.edge[1]) : null;
  const activeNode = pinned ?? frame.node;
  const caption = pinned ? nodeInfo[pinned] : frame.caption;
  const captionVariant = pinned ? 'neutral' : frame.variant;

  const packet = nodes[frame.node];

  const nodeIds = useMemo(() => Object.keys(nodes) as NodeId[], []);

  return (
    <div className="rounded-3xl border border-slate-500/15 bg-slate-500/[0.04] p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs text-signal-cyan">architecture · live walkthrough</p>
        {pinned && (
          <button
            type="button"
            onClick={() => setPinned(null)}
            className="rounded-full border border-slate-500/20 px-3 py-1 font-mono text-[10px] opacity-70 transition hover:border-signal-cyan/40 hover:opacity-100"
          >
            resume autoplay
          </button>
        )}
      </div>

      <svg viewBox="0 0 800 240" className="mt-4 h-auto w-full" role="img" aria-label="Task scheduler architecture diagram">
        {edgeList.map(([a, b]) => {
          const isActive = activeEdgeKey === edgeKey(a, b) && !pinned;
          const na = nodes[a];
          const nb = nodes[b];
          const isCurve = (a === 'process' && b === 'retry') || (a === 'retry' && b === 'dlq');
          const path = isCurve
            ? a === 'process' && b === 'retry'
              ? `M ${na.x + 40} ${na.y - 10} C ${na.x + 40} ${na.y - 60}, ${nb.x + 40} ${nb.y + 60}, ${nb.x + 40} ${nb.y + 12}`
              : `M ${na.x} ${na.y + 14} C ${na.x - 20} ${na.y + 70}, ${nb.x + 20} ${nb.y - 70}, ${nb.x} ${nb.y - 14}`
            : `M ${na.x + 42} ${na.y} L ${nb.x - 42} ${nb.y}`;
          return (
            <path
              key={`${a}-${b}`}
              d={path}
              fill="none"
              strokeWidth={isActive ? 2.5 : 1.5}
              className={isActive ? `${variantColor(frame.variant)} opacity-90` : 'stroke-slate-500/25'}
              stroke="currentColor"
              strokeDasharray={isCurve ? '4 4' : undefined}
            />
          );
        })}

        {!pinned && !reducedMotion && (
          <motion.circle
            r={5}
            cx={packet.x}
            cy={packet.y}
            className={variantColor(frame.variant)}
            fill="currentColor"
            animate={{ cx: packet.x, cy: packet.y }}
            transition={{ type: 'spring', stiffness: 90, damping: 16 }}
          />
        )}

        {nodeIds.map((id) => {
          const n = nodes[id];
          const isActive = activeNode === id;
          const isDlq = id === 'dlq';
          return (
            <g
              key={id}
              transform={`translate(${n.x}, ${n.y})`}
              className={`cursor-pointer ${
                isActive ? variantColor(pinned ? 'neutral' : frame.variant) : isDlq ? 'text-signal-red/60' : 'text-slate-500'
              }`}
              onClick={() => setPinned((current) => (current === id ? null : id))}
            >
              {isActive && (
                <motion.circle
                  cx={0}
                  cy={0}
                  r={30}
                  fill="currentColor"
                  opacity={0.12}
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              <rect
                x={-42}
                y={-20}
                width={84}
                height={40}
                rx={12}
                fill="currentColor"
                fillOpacity={isActive ? 0.16 : isDlq ? 0.08 : 0.08}
                stroke="currentColor"
                strokeOpacity={isActive ? 0.6 : 0.25}
              />
              <text textAnchor="middle" y={-2} fill="currentColor" className={`font-mono text-[11px] font-medium ${isActive ? '' : 'opacity-80'}`}>
                {n.label}
              </text>
              <text textAnchor="middle" y={12} fill="currentColor" className="font-mono text-[8px] opacity-50">
                {n.sub}
              </text>
            </g>
          );
        })}
      </svg>

      <motion.p
        key={pinned ? `pin-${pinned}` : `${scenarioIndex}-${frameIndex}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`mt-3 min-h-[2.5rem] text-sm leading-6 ${muted}`}
      >
        <span className={`mr-2 font-mono text-[10px] ${variantColor(captionVariant)}`}>
          {pinned ? 'pinned' : '● live'}
        </span>
        {caption}
      </motion.p>
      <p className="mt-2 font-mono text-[10px] opacity-40">Click any node to pause and inspect it.</p>
    </div>
  );
}
