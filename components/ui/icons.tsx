import { motion } from 'framer-motion';

export function ChevronIcon({ open, className = 'h-3.5 w-3.5' }: { open: boolean; className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 16 16"
      className={`shrink-0 opacity-50 transition group-hover:opacity-90 ${className}`}
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m3 6 5 5 5-5" />
    </motion.svg>
  );
}

export function DetailsChevronIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`shrink-0 opacity-50 transition-transform duration-200 group-open:rotate-180 group-hover:opacity-90 motion-reduce:transition-none ${className}`}
    >
      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m3 6 5 5 5-5" />
    </svg>
  );
}

export function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      {open ? (
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m6 6 12 12M18 6 6 18" />
      ) : (
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
      )}
    </svg>
  );
}

export function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
        d="M12 4.5V2.5M12 21.5v-2M4.93 4.93 3.5 3.5M20.5 20.5l-1.43-1.43M4.5 12h-2M21.5 12h-2M4.93 19.07l-1.43 1.43M20.5 3.5l-1.43 1.43"
      />
      <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z"
      />
    </svg>
  );
}

export function ResumeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="currentColor" d="M6 2.75A2.75 2.75 0 0 0 3.25 5.5v13A2.75 2.75 0 0 0 6 21.25h12a2.75 2.75 0 0 0 2.75-2.75v-8.38a2.75 2.75 0 0 0-.8-1.94l-4.13-4.13a2.75 2.75 0 0 0-1.94-.8H6Zm7.75 1.76c.36.05.7.22.96.48l4.3 4.3c.26.26.43.6.48.96h-3.24a2.5 2.5 0 0 1-2.5-2.5V4.51ZM7 13.25h10a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1 0-1.5Zm0 3h7a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1 0-1.5Z" />
    </svg>
  );
}

export type SocialIconName = 'github' | 'linkedin' | 'leetcode' | 'email';

export function SocialIcon({ icon }: { icon: SocialIconName }) {
  if (icon === 'github') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path fill="currentColor" d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.34-3.79-1.34-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .1 2.63.71 3.27-.45.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.29-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.15a10.7 10.7 0 0 1 5.64 0c2.15-1.45 3.1-1.15 3.1-1.15.61 1.55.23 2.69.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.32-2.63 5.27-5.14 5.55.4.35.76 1.04.76 2.1v3.11c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z" />
      </svg>
    );
  }

  if (icon === 'linkedin') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path fill="currentColor" d="M5.36 6.93a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.58 21h3.55V8.4H3.58V21Zm5.97 0h3.55v-6.67c0-1.78.85-2.84 2.3-2.84 1.33 0 1.98.92 1.98 2.84V21h3.54v-7.4c0-3.64-1.94-5.45-4.66-5.45-2.15 0-3.11 1.18-3.64 2.01h-.05V8.4H9.55V21Z" />
      </svg>
    );
  }

  if (icon === 'leetcode') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="m13.9 4.2-7.1 7.1a3.8 3.8 0 0 0 0 5.4l2.2 2.2a3.8 3.8 0 0 0 5.4 0l1.1-1.1M9.6 12h9.3M14.3 4.7l2.2 2.2" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="currentColor" d="M4.75 5h14.5A2.75 2.75 0 0 1 22 7.75v8.5A2.75 2.75 0 0 1 19.25 19H4.75A2.75 2.75 0 0 1 2 16.25v-8.5A2.75 2.75 0 0 1 4.75 5Zm.24 1.5 6.31 5.22c.41.34.99.34 1.4 0l6.31-5.22H4.99Zm15.51 1.38-6.84 5.66a2.6 2.6 0 0 1-3.32 0L3.5 7.88v8.37c0 .69.56 1.25 1.25 1.25h14.5c.69 0 1.25-.56 1.25-1.25V7.88Z" />
    </svg>
  );
}
