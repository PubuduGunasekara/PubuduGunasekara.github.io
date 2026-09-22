'use client';

import { useTheme } from '@/lib/theme';

export function EditorialCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { surface } = useTheme();
  return (
    <div
      className={`rounded-3xl border p-5 shadow-premium transition duration-300 hover:-translate-y-0.5 hover:border-signal-cyan/40 sm:p-6 ${surface} ${className}`}
    >
      {children}
    </div>
  );
}
