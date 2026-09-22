'use client';

import { useEffect, useState } from 'react';
import { useIsFinePointer, usePrefersReducedMotion } from '@/lib/hooks';

export function CursorReadout() {
  const isFinePointer = useIsFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isFinePointer || reducedMotion) return;

    const heroEl = document.getElementById('hero');
    if (!heroEl) return;

    const handleMove = (event: MouseEvent) => {
      const rect = heroEl.getBoundingClientRect();
      const inside =
        event.clientY >= rect.top && event.clientY <= rect.bottom && event.clientX >= rect.left && event.clientX <= rect.right;
      setVisible(inside);
      if (inside) setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [isFinePointer, reducedMotion]);

  if (!isFinePointer || reducedMotion || !visible || !pos) return null;

  return (
    <div
      className="pointer-events-none absolute z-10 select-none font-mono text-[10px] text-signal-cyan/50"
      style={{ left: pos.x + 14, top: pos.y + 14 }}
      aria-hidden="true"
    >
      x:{Math.round(pos.x).toString().padStart(4, '0')} y:{Math.round(pos.y).toString().padStart(4, '0')}
    </div>
  );
}
