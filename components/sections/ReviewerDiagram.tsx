'use client';

import { useMemo, useState } from 'react';
import { useTheme } from '@/lib/theme';
import { useMediaQuery } from '@/lib/hooks';

type NodeId = 'oauth' | 'frontend' | 'api' | 'postgres' | 'redis' | 'github' | 'openai';

type NodeDef = { x: number; y: number; label: string; sub: string; info: string };

const desktopNodes: Record<NodeId, NodeDef> = {
  oauth: { x: 100, y: 40, label: 'GitHub OAuth', sub: 'sign in', info: 'Login goes through GitHub OAuth (Passport) with repo scope, so the app can read PR diffs on the user’s behalf.' },
  frontend: { x: 100, y: 150, label: 'Frontend', sub: 'React · Amplify', info: 'React + Vite, hosted on AWS Amplify. Signs the user in and calls the Express API.' },
  api: { x: 340, y: 150, label: 'Express API', sub: 'AWS EC2', info: 'Express on EC2. Coordinates GitHub, OpenAI, the cache, and the database. No business logic lives in the frontend.' },
  postgres: { x: 610, y: 40, label: 'PostgreSQL', sub: 'sessions + reviews', info: 'Durable store: sessions (via connect-pg-simple), and the reviews / review_comments tables backing review history.' },
  redis: { x: 610, y: 115, label: 'Redis', sub: 'cache + rate limit', info: 'Caches review results by diff hash for 1 hour, and rate-limits the review endpoint per user (fails open if Redis errors).' },
  github: { x: 610, y: 190, label: 'GitHub API', sub: 'Octokit', info: 'Fetches the user’s repositories, pull requests, and PR diffs via Octokit.' },
  openai: { x: 610, y: 265, label: 'gpt-4o-mini', sub: 'OpenAI', info: 'Receives the (possibly truncated) diff and a prompt specifying the JSON shape to return; the server validates the response defensively.' },
};

const mobileNodes: Record<NodeId, NodeDef> = {
  oauth: { x: 150, y: 40, label: 'GitHub OAuth', sub: 'sign in', info: desktopNodes.oauth.info },
  frontend: { x: 150, y: 130, label: 'Frontend', sub: 'React · Amplify', info: desktopNodes.frontend.info },
  api: { x: 150, y: 220, label: 'Express API', sub: 'AWS EC2', info: desktopNodes.api.info },
  postgres: { x: 150, y: 310, label: 'PostgreSQL', sub: 'sessions + reviews', info: desktopNodes.postgres.info },
  redis: { x: 150, y: 390, label: 'Redis', sub: 'cache + rate limit', info: desktopNodes.redis.info },
  github: { x: 150, y: 470, label: 'GitHub API', sub: 'Octokit', info: desktopNodes.github.info },
  openai: { x: 150, y: 550, label: 'gpt-4o-mini', sub: 'OpenAI', info: desktopNodes.openai.info },
};

const edges: Array<[NodeId, NodeId]> = [
  ['frontend', 'oauth'],
  ['frontend', 'api'],
  ['api', 'postgres'],
  ['api', 'redis'],
  ['api', 'github'],
  ['api', 'openai'],
];

export function ReviewerDiagram() {
  const { muted, theme } = useTheme();
  const inactiveTextClass = theme === 'dark' ? 'text-ink-300' : 'text-ink-700';
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const [selected, setSelected] = useState<NodeId>('api');

  const nodes = isDesktop ? desktopNodes : mobileNodes;
  const viewBox = isDesktop ? '0 0 760 320' : '0 0 300 610';
  const nodeIds = useMemo(() => Object.keys(nodes) as NodeId[], [nodes]);

  return (
    <div className="rounded-3xl border border-slate-500/15 bg-slate-500/[0.04] p-4 sm:p-6">
      <p className="font-mono text-xs text-signal-cyan">architecture</p>

      <svg viewBox={viewBox} className="mt-4 h-auto w-full" role="img" aria-label="AI Code Review Assistant architecture diagram">
        {edges.map(([a, b]) => {
          const na = nodes[a];
          const nb = nodes[b];
          const isVertical = !isDesktop || na.x === nb.x;
          const path = isVertical
            ? `M ${na.x} ${na.y + 22} L ${nb.x} ${nb.y - 22}`
            : `M ${na.x + 46} ${na.y} L ${nb.x - 46} ${nb.y}`;
          const isBranch = a === 'api' && b !== 'oauth';
          const branchPath =
            isDesktop && isBranch ? `M ${na.x + 46} ${na.y} C ${na.x + 100} ${na.y}, ${nb.x - 60} ${nb.y}, ${nb.x - 46} ${nb.y}` : path;
          return (
            <path
              key={`${a}-${b}`}
              d={isDesktop ? branchPath : path}
              fill="none"
              strokeWidth={1.5}
              className="stroke-slate-500/35"
              stroke="currentColor"
            />
          );
        })}

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
              className={`cursor-pointer outline-none transition ${
                isActive ? 'text-signal-cyan' : inactiveTextClass
              } focus-visible:opacity-100`}
              onClick={() => setSelected(id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelected(id);
                }
              }}
            >
              <rect
                x={-46}
                y={-22}
                width={92}
                height={44}
                rx={12}
                fill="currentColor"
                fillOpacity={isActive ? 0.16 : 0.07}
                stroke="currentColor"
                strokeOpacity={isActive ? 0.7 : 0.35}
                strokeWidth={isActive ? 2 : 1}
              />
              {isActive && (
                <rect x={-49} y={-25} width={98} height={50} rx={14} fill="none" stroke="currentColor" strokeOpacity={0.9} strokeWidth={1.5} strokeDasharray="3 3" />
              )}
              <text textAnchor="middle" y={-2} fill="currentColor" className="font-mono text-[13px] font-semibold">
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
