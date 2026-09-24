'use client';

import { useMemo, useState } from 'react';
import { useTheme } from '@/lib/theme';
import { useMediaQuery } from '@/lib/hooks';

type NodeId = 'producer' | 'kafka' | 'worker' | 'redis' | 'postgres' | 'retry' | 'dlq' | 'recovery';

type NodeDef = { x: number; y: number; label: string; sub: string; info: string };

const desktopNodes: Record<NodeId, NodeDef> = {
  producer: { x: 90, y: 190, label: 'Producer', sub: 'submits task', info: 'A client call saves the task to PostgreSQL and publishes a creation event to Kafka.' },
  kafka: { x: 280, y: 190, label: 'Kafka topic', sub: 'at-least-once', info: 'Kafka guarantees at-least-once delivery. A worker may see the same event more than once, so that is treated as normal, not an edge case.' },
  worker: { x: 470, y: 190, label: 'Worker', sub: 'Spring Boot', info: 'Any instance of the same Spring Boot service, joined to the same Kafka consumer group, can pick up the event.' },
  redis: { x: 660, y: 190, label: 'Redis lock', sub: 'SETNX · 30s TTL', info: 'SETNX acquires a per-task lock before work starts. Released with a Lua compare-and-delete script, so a worker can never release a lock it doesn’t own.' },
  postgres: { x: 850, y: 190, label: 'PostgreSQL', sub: 'state machine', info: 'The source of truth. A state machine plus JPA @Version optimistic locking means a task can only start once and can’t be corrupted by a concurrent write.' },
  retry: { x: 850, y: 320, label: 'Retry scheduler', sub: '10s / 30s / 90s', info: 'Polls for FAILED tasks whose backoff has elapsed and re-publishes them to Kafka with exponential backoff, not instant retry.' },
  dlq: { x: 1050, y: 320, label: 'Dead-letter queue', sub: 'task-dlq topic', info: 'After the 4th failure (initial attempt + 3 retries), the task is marked DEAD_LETTER and published here for manual inspection instead of vanishing.' },
  recovery: { x: 1050, y: 70, label: 'Recovery sweep', sub: 'polls every 60s', info: 'Separately finds tasks stuck RUNNING past a 5-minute timeout (a worker likely crashed) and fails them through the same retry path, and re-publishes PENDING tasks whose creation event was lost.' },
};

const mobileNodes: Record<NodeId, NodeDef> = {
  producer: { x: 150, y: 40, label: 'Producer', sub: 'submits task', info: desktopNodes.producer.info },
  kafka: { x: 150, y: 130, label: 'Kafka topic', sub: 'at-least-once', info: desktopNodes.kafka.info },
  worker: { x: 150, y: 220, label: 'Worker', sub: 'Spring Boot', info: desktopNodes.worker.info },
  redis: { x: 150, y: 310, label: 'Redis lock', sub: 'SETNX · 30s TTL', info: desktopNodes.redis.info },
  postgres: { x: 150, y: 400, label: 'PostgreSQL', sub: 'state machine', info: desktopNodes.postgres.info },
  recovery: { x: 150, y: 490, label: 'Recovery sweep', sub: 'polls every 60s', info: desktopNodes.recovery.info },
  retry: { x: 150, y: 580, label: 'Retry scheduler', sub: '10s / 30s / 90s', info: desktopNodes.retry.info },
  dlq: { x: 150, y: 670, label: 'Dead-letter queue', sub: 'task-dlq topic', info: desktopNodes.dlq.info },
};

const straightEdges: Array<[NodeId, NodeId]> = [
  ['producer', 'kafka'],
  ['kafka', 'worker'],
  ['worker', 'redis'],
  ['redis', 'postgres'],
  ['postgres', 'retry'],
  ['retry', 'dlq'],
];

const dashedEdges: Array<[NodeId, NodeId]> = [
  ['postgres', 'recovery'],
  ['recovery', 'retry'],
];

export function SchedulerDiagram() {
  const { muted, theme } = useTheme();
  const inactiveTextClass = theme === 'dark' ? 'text-ink-300' : 'text-ink-700';
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const [selected, setSelected] = useState<NodeId>('postgres');

  const nodes = isDesktop ? desktopNodes : mobileNodes;
  const viewBox = isDesktop ? '0 0 1140 400' : '0 0 300 730';
  const nodeIds = useMemo(() => Object.keys(nodes) as NodeId[], [nodes]);

  function edgePath(a: NodeId, b: NodeId, curved: boolean) {
    const na = nodes[a];
    const nb = nodes[b];
    if (!isDesktop) {
      return `M ${na.x} ${na.y + 24} L ${nb.x} ${nb.y - 24}`;
    }
    if (na.x === nb.x) {
      return `M ${na.x} ${na.y + 24} L ${nb.x} ${nb.y - 24}`;
    }
    if (curved) {
      return `M ${na.x + 8} ${na.y + 22} C ${na.x + 50} ${na.y + 90}, ${nb.x - 50} ${nb.y - 90}, ${nb.x - 8} ${nb.y - 22}`;
    }
    return `M ${na.x + 80} ${na.y} L ${nb.x - 80} ${nb.y}`;
  }

  return (
    <div className="rounded-3xl border border-slate-500/15 bg-slate-500/[0.04] p-4 sm:p-6">
      <p className="font-mono text-xs text-signal-cyan">architecture</p>

      <svg viewBox={viewBox} className="mt-4 h-auto w-full" role="img" aria-label="Distributed task scheduler architecture diagram">
        {straightEdges.map(([a, b]) => (
          <path key={`${a}-${b}`} d={edgePath(a, b, false)} fill="none" strokeWidth={1.5} className="stroke-slate-500/40" stroke="currentColor" />
        ))}
        {dashedEdges.map(([a, b]) => (
          <path
            key={`${a}-${b}`}
            d={edgePath(a, b, true)}
            fill="none"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            className="stroke-slate-500/40"
            stroke="currentColor"
          />
        ))}

        {nodeIds.map((id) => {
          const n = nodes[id];
          const isActive = selected === id;
          return (
            <g
              key={id}
              transform={`translate(${n.x}, ${n.y})`}
              tabIndex={0}
              role="button"
              aria-label={`${n.label}: ${n.info}`}
              aria-pressed={isActive}
              className={`cursor-pointer outline-none transition ${isActive ? 'text-signal-cyan' : inactiveTextClass}`}
              onClick={() => setSelected(id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelected(id);
                }
              }}
            >
              <rect
                x={-80}
                y={-24}
                width={160}
                height={48}
                rx={12}
                fill="currentColor"
                fillOpacity={isActive ? 0.16 : 0.07}
                stroke="currentColor"
                strokeOpacity={isActive ? 0.7 : 0.35}
                strokeWidth={isActive ? 2 : 1}
              />
              {isActive && (
                <rect x={-83} y={-27} width={166} height={54} rx={14} fill="none" stroke="currentColor" strokeOpacity={0.9} strokeWidth={1.5} strokeDasharray="3 3" />
              )}
              <text textAnchor="middle" y={-3} fill="currentColor" className="font-mono text-[13px] font-semibold">
                {n.label}
              </text>
              <text textAnchor="middle" y={15} fill="currentColor" className="font-mono text-[12px] opacity-85">
                {n.sub}
              </text>
            </g>
          );
        })}
      </svg>

      <p className={`mt-3 min-h-[2.5rem] text-sm leading-6 ${muted}`}>
        <span className="mr-2 font-mono text-xs text-signal-cyan">{nodes[selected].label}</span>
        {nodes[selected].info}
      </p>
      <p className={`mt-2 font-mono text-xs ${muted}`}>Click or tab to a node to read what it does.</p>
    </div>
  );
}
