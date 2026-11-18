'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '@/lib/theme';
import { ChatIcon } from '../ui/icons';

const AskPanel = dynamic(() => import('./AskPanel'), { ssr: false });

type Pending = { question: string; n: number } | null;

const AUTO_OPEN_KEY = 'ask:auto-opened';
const TEASER_KEY = 'ask:teaser-seen';
// Measured from the start of the page load, so "3 seconds after the page loads" holds even when the page itself was slow.
const AUTO_OPEN_AFTER_MS = 3000;

function sessionFlag(set?: boolean, key = AUTO_OPEN_KEY): boolean {
  try {
    if (set) sessionStorage.setItem(key, '1');
    return sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

// Open by itself only where it will not get in the way: the home page, once per session, on a screen wide enough
// for the panel to sit beside the page, and not for visitors who asked their browser to save data.
function mayAutoOpen(): boolean {
  if (sessionFlag()) return false;
  if (window.matchMedia('(max-width: 639px)').matches) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !conn?.saveData;
}

export function AskLauncher() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const onHome = pathname === '/' || pathname === '';
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [pending, setPending] = useState<Pending>(null);
  // true when the panel opened by itself: it then leaves focus where it was
  const [quiet, setQuiet] = useState(false);
  const [due, setDue] = useState(false);
  const [ready, setReady] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const visitorOpened = useRef(false);

  const show = useCallback((question?: string) => {
    visitorOpened.current = true;
    sessionFlag(true);
    setQuiet(false);
    setOpen(true);
    setEverOpened(true);
    if (question) setPending((p) => ({ question, n: (p?.n ?? 0) + 1 }));
  }, []);

  useEffect(() => {
    const onOpen = (event: Event) => show((event as CustomEvent<{ question?: string } | undefined>).detail?.question);
    window.addEventListener('ask:open', onOpen);
    return () => window.removeEventListener('ask:open', onOpen);
  }, [show]);

  // Home page: mount the panel (hidden) as soon as the page has loaded, so the search index and the model are
  // already loading, then open it once 3 seconds have passed and it is ready to answer.
  useEffect(() => {
    if (!onHome || !mayAutoOpen()) return;
    let cancelled = false;
    const timers: number[] = [];
    const start = () => {
      if (cancelled) return;
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      const mount = () => !cancelled && setEverOpened(true);
      if (idle) idle(mount, { timeout: 1500 });
      else timers.push(window.setTimeout(mount, 300));
      timers.push(window.setTimeout(() => !cancelled && setDue(true), Math.max(0, AUTO_OPEN_AFTER_MS - performance.now())));
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('load', start);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [onHome]);

  useEffect(() => {
    if (!due || !ready || visitorOpened.current || sessionFlag()) return;
    sessionFlag(true);
    setQuiet(true);
    setOpen(true);
  }, [due, ready]);

  // A short speech bubble next to the button, once per session, for visitors who have not opened the panel.
  useEffect(() => {
    if (sessionFlag(false, TEASER_KEY)) return;
    const show = window.setTimeout(() => setTeaser(true), 2500);
    const hide = window.setTimeout(() => {
      setTeaser(false);
      sessionFlag(true, TEASER_KEY);
    }, 11000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setTeaser(false);
      sessionFlag(true, TEASER_KEY);
    }
  }, [open]);

  useEffect(() => {
    if (wasOpen.current && !open) buttonRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  const isDark = theme === 'dark';

  return (
    <>
      {!open && (
        <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
          {teaser && (
            <div
              aria-hidden="true"
              className={`relative hidden max-w-[15rem] rounded-2xl sm:block rounded-br-md border px-4 py-3 text-sm font-medium leading-5 shadow-xl ${
                isDark ? 'border-signal-cyan/40 bg-ink-850 text-ink-100 shadow-black/40' : 'border-signal-cyan/40 bg-white text-ink-950 shadow-slate-300/60'
              }`}
            >
              Ask about my GPA, projects or relocation
            </div>
          )}
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full bg-signal-cyan/50 motion-safe:animate-ping motion-safe:[animation-iteration-count:4] motion-reduce:hidden"
            />
            <button
              ref={buttonRef}
              type="button"
              onClick={() => show()}
              onMouseEnter={() => void import('./AskPanel')}
              onFocus={() => void import('./AskPanel')}
              aria-haspopup="dialog"
              className={`relative inline-flex items-center gap-2 rounded-full bg-signal-cyan px-4 py-3 text-sm font-semibold shadow-[0_12px_35px_rgba(34,211,238,0.35)] ring-2 ring-signal-cyan/30 ring-offset-2 transition hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                isDark ? 'text-ink-950 ring-offset-ink-950 hover:bg-ink-100' : 'text-ink-100 ring-offset-white hover:bg-ink-900'
              }`}
            >
              <ChatIcon />
              <span>
                Ask <span className="hidden sm:inline">about me</span>
              </span>
              <span
                aria-hidden="true"
                className={`absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 bg-signal-green ${isDark ? 'border-ink-950' : 'border-white'}`}
              />
            </button>
          </div>
        </div>
      )}
      {everOpened && (
        <AskPanel
          open={open}
          onClose={() => setOpen(false)}
          pending={pending}
          focusOnOpen={!quiet}
          onReady={() => setReady(true)}
        />
      )}
    </>
  );
}

export function AskButton({ label = 'Ask me anything' }: { label?: string }) {
  const { theme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent('ask:open'))}
      className={`inline-flex items-center gap-2 rounded-full border border-signal-cyan/40 bg-signal-cyan/10 px-4 py-2 text-sm font-medium transition hover:bg-signal-cyan/20 motion-reduce:transition-none ${
        theme === 'dark' ? 'text-signal-cyan' : 'text-ink-900'
      }`}
    >
      <ChatIcon />
      {label}
    </button>
  );
}
