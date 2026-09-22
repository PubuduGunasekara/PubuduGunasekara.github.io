'use client';

import { useState } from 'react';

export function BrandLogo({
  src,
  alt,
  mark,
  wide = false,
}: {
  src?: string;
  alt: string;
  mark: string;
  wide?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`flex items-center justify-center rounded-2xl border border-slate-300 bg-white p-3 shadow-sm ${wide ? 'h-16 w-full' : 'h-14 w-14'}`}
    >
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className={`${wide ? 'max-h-9 max-w-[10rem]' : 'max-h-9 max-w-9'} object-contain opacity-90 transition hover:opacity-100`}
        />
      ) : (
        <span className="font-mono text-sm text-signal-cyan">{mark}</span>
      )}
    </div>
  );
}
