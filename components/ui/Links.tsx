'use client';

import { useTheme } from '@/lib/theme';
import { ResumeIcon, SocialIcon, type SocialIconName } from './icons';

export function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      className={`group inline-flex items-center gap-2 rounded-full bg-signal-cyan px-5 py-3 text-sm font-semibold shadow-[0_12px_35px_rgba(34,211,238,0.22)] transition hover:-translate-y-0.5 ${
        isDark ? 'text-ink-950 hover:bg-ink-100' : 'text-ink-100 hover:bg-ink-900'
      }`}
    >
      <ResumeIcon />
      {children}
    </a>
  );
}

export function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      className="rounded-full border border-slate-500/15 bg-slate-500/10 px-5 py-3 text-sm transition hover:border-signal-cyan/40 hover:text-signal-cyan"
    >
      {children}
    </a>
  );
}

export function SocialIconLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: SocialIconName;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-current/70 transition hover:bg-signal-cyan/10 hover:text-signal-cyan"
    >
      <SocialIcon icon={icon} />
    </a>
  );
}
