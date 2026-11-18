'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { embedQuestion, loadEmbedder } from '@/lib/ask/embedder';
import { fallbackMessage } from '@/lib/ask/rules';
import { ask, correctQuestion, prepare, suggestQuestions, type AskOutcome, type Prepared, type QueryVectors } from '@/lib/ask/search';
import type { AskIndex, AskTech, Chunk, Source, Suggestion } from '@/lib/ask/types';
import { useTheme } from '@/lib/theme';
import { DetailsChevronIcon, ExpandIcon } from '../ui/icons';

let indexPromise: Promise<Prepared> | null = null;
function loadIndex(): Promise<Prepared> {
  if (!indexPromise) {
    indexPromise = fetch('/ask/index.json')
      .then((r) => {
        if (!r.ok) throw new Error(`index ${r.status}`);
        return r.json() as Promise<AskIndex>;
      })
      .then(prepare);
    indexPromise.catch(() => {
      indexPromise = null;
    });
  }
  return indexPromise;
}

type Message =
  | { id: number; role: 'user'; text: string }
  | { id: number; role: 'bot'; typed: string; outcome: AskOutcome; related: Suggestion[] }
  | { id: number; role: 'browse' };

type DistributiveOmit<T, K extends keyof never> = T extends unknown ? Omit<T, K> : never;

type SemanticState = 'idle' | 'offer' | 'loading' | 'ready' | 'off';

const external = (href: string) => /^https?:/.test(href);
const joinList = (items: string[]) =>
  items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

function techSentence(t: AskTech): string {
  const used = t.usedIn.map((u) => u.label);
  if (t.members?.length) {
    return `Yes. ${t.name} is covered by ${joinList(t.members)}${used.length ? `, and I’ve used them in ${joinList(used)}` : ''}.`;
  }
  if (t.category) return `Yes. ${t.name} is on my skills list (${t.category})${used.length ? `. I’ve used it in ${joinList(used)}` : ''}.`;
  return `Yes. I’ve used ${t.name} in ${joinList(used)}.`;
}

export default function AskPanel({
  open,
  onClose,
  pending,
  focusOnOpen = true,
  onReady,
}: {
  open: boolean;
  onClose: () => void;
  pending: { question: string; n: number } | null;
  // false when the panel opened by itself, so it does not take focus from whatever the visitor is reading
  focusOnOpen?: boolean;
  // called once the search index has loaded and the panel can answer
  onReady?: () => void;
}) {
  const { mobileMenuSurface, muted, theme } = useTheme();
  const [prepared, setPrepared] = useState<Prepared | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [semantic, setSemantic] = useState<SemanticState>('idle');
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState<Suggestion[]>([]);
  const [busy, setBusy] = useState(false);
  // A larger window for longer answers on screens wide enough for it (the toggle is hidden on phones). Remembered per tab.
  const [expanded, setExpanded] = useState(() => {
    try {
      return sessionStorage.getItem('ask:expanded') === '1';
    } catch {
      return false;
    }
  });
  const toggleExpanded = useCallback(() => {
    setExpanded((v) => {
      try {
        sessionStorage.setItem('ask:expanded', v ? '0' : '1');
      } catch {
        // the choice just is not remembered
      }
      return !v;
    });
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const askedFaqs = useRef<Set<string>>(new Set());
  const handledPending = useRef(0);
  const embedRef = useRef<((text: string) => Promise<QueryVectors | null>) | null>(null);
  const embedCache = useRef<Map<string, QueryVectors>>(new Map());

  // 1. Load the search index when the panel is first shown.
  useEffect(() => {
    let cancelled = false;
    loadIndex()
      .then((p) => {
        if (cancelled) return;
        setPrepared(p);
        onReady?.();
      })
      .catch(() => !cancelled && setLoadError(true));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Start the embedding model in the background, unless the visitor is on a slow or data-saving connection.
  const startSemantic = useCallback(
    (p: Prepared) => {
      if (!p.vectors) {
        setSemantic('off');
        return;
      }
      setSemantic('loading');
      loadEmbedder(p.index.model, setProgress)
        .then(() => {
          embedRef.current = async (text: string) => {
            const cached = embedCache.current.get(text);
            if (cached) return cached;
            const v = await embedQuestion(text, p.index.dims);
            embedCache.current.set(text, v);
            return v;
          };
          setSemantic('ready');
        })
        .catch(() => setSemantic('off'));
    },
    [],
  );

  useEffect(() => {
    if (!prepared || semantic !== 'idle') return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slow = !!conn?.saveData || /(^|-)(2g|3g)$/.test(conn?.effectiveType ?? '');
    if (!prepared.vectors) setSemantic('off');
    else if (slow) setSemantic('offer');
    else startSemantic(prepared);
  }, [prepared, semantic, startSemantic]);

  // Focus the input whenever the panel opens.
  useEffect(() => {
    if (open && focusOnOpen) inputRef.current?.focus();
  }, [open, focusOnOpen]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages, busy]);

  const chips = useMemo(() => {
    if (!prepared) return [];
    const byId = new Map(prepared.index.chunks.map((c) => [c.id, c]));
    return prepared.index.chips.map((id) => byId.get(id)).filter((c): c is Chunk => !!c);
  }, [prepared]);

  const push = useCallback((m: DistributiveOmit<Message, 'id'>) => {
    setMessages((prev) => [...prev, { ...m, id: nextId.current++ } as Message]);
  }, []);

  const byId = useMemo(() => new Map((prepared?.index.chunks ?? []).map((c) => [c.id, c])), [prepared]);

  // Always offer three follow-ups: the answered question's curated chain first, then questions close in meaning,
  // then others from the same category, then the starter questions.
  const relatedFor = useCallback(
    async (p: Prepared, asked: string, answeredFaq: string | null, nothingFound = false): Promise<Suggestion[]> => {
      const exclude = new Set(askedFaqs.current);
      if (answeredFaq) exclude.add(answeredFaq);
      const out: Suggestion[] = [];
      const add = (id: string) => {
        const c = byId.get(id);
        if (!c || c.kind !== 'faq' || c.browse === false || exclude.has(id) || out.some((o) => o.id === id)) return;
        out.push({ id, question: c.question ?? c.title });
      };
      const answered = answeredFaq ? byId.get(answeredFaq) : undefined;
      for (const id of answered?.next ?? []) add(id);
      if (out.length < 3) {
        let plain: Float32Array | null = null;
        if (embedRef.current) plain = (await embedRef.current(asked).catch(() => null))?.plain ?? null;
        for (const s of suggestQuestions(p, asked, { max: 4, exclude, plain, floor: nothingFound ? (plain ? 0.66 : 0.5) : plain ? 0.55 : 0.35 })) add(s.id);
      }
      if (out.length < 3 && answered?.category) {
        for (const c of p.index.chunks) if (c.kind === 'faq' && c.category === answered.category) add(c.id);
      }
      for (const c of chips) add(c.id);
      return out.slice(0, 3);
    },
    [byId, chips],
  );

  const submit = useCallback(
    async (raw: string) => {
      const q = raw.trim();
      if (!q || !prepared || busy) return;
      setBusy(true);
      setInput('');
      setTyping([]);
      push({ role: 'user', text: q });
      try {
        const outcome = await ask(prepared, q, embedRef.current);
        const answeredFaq = outcome.result.type === 'faq' ? outcome.result.faq.id : null;
        if (answeredFaq) askedFaqs.current.add(answeredFaq);
        const related = await relatedFor(prepared, outcome.asked, answeredFaq, outcome.result.type === 'none');
        push({ role: 'bot', typed: q, outcome, related });
      } finally {
        setBusy(false);
      }
    },
    [prepared, busy, push, relatedFor],
  );

  const showBrowse = useCallback(() => {
    push({ role: 'browse' });
  }, [push]);

  const pickFaq = useCallback(
    async (faqId: string) => {
      if (!prepared || busy) return;
      const faq = prepared.index.chunks.find((c) => c.id === faqId);
      if (!faq) return;
      setBusy(true);
      setInput('');
      setTyping([]);
      const question = faq.question ?? faq.title;
      push({ role: 'user', text: question });
      try {
        askedFaqs.current.add(faq.id);
        const related = await relatedFor(prepared, question, faq.id);
        push({
          role: 'bot',
          typed: question,
          outcome: { result: { type: 'faq', faq, mode: 'curated' }, hits: [], asked: question, correction: null },
          related,
        });
      } finally {
        setBusy(false);
      }
    },
    [prepared, busy, push, relatedFor],
  );

  // A question sent from elsewhere on the page (for example "Ask me anything").
  useEffect(() => {
    if (!pending || !prepared || pending.n === handledPending.current) return;
    handledPending.current = pending.n;
    void submit(pending.question);
  }, [pending, prepared, submit]);

  // Live "did you mean" suggestions while typing. The word being typed is left alone; earlier words get typo-corrected.
  useEffect(() => {
    if (!prepared) return;
    const handle = window.setTimeout(() => {
      const text = input;
      if (text.trim().length < 2) return setTyping([]);
      const midWord = !/\s$/.test(text);
      const cut = midWord ? text.lastIndexOf(' ') + 1 : text.length;
      const fixed = correctQuestion(prepared, text.slice(0, cut)).text + text.slice(cut);
      setTyping(suggestQuestions(prepared, fixed, { max: 4 }));
    }, 120);
    return () => window.clearTimeout(handle);
  }, [input, prepared]);

  const meta = prepared?.index.meta;
  const isDark = theme === 'dark';
  const botCard = 'rounded-2xl rounded-bl-md border border-slate-500/20 bg-slate-500/[0.07] px-3.5 py-3 text-sm leading-6';
  const chip =
    'rounded-full border border-signal-cyan/30 bg-signal-cyan/[0.08] px-3 py-1.5 text-left text-xs transition hover:border-signal-cyan/60 hover:bg-signal-cyan/15 motion-reduce:transition-none disabled:opacity-60';
  const sourceLink =
    'inline-flex items-center rounded-full border border-signal-cyan/30 bg-signal-cyan/10 px-2.5 py-1 text-xs font-medium text-signal-cyan transition hover:bg-signal-cyan/20 motion-reduce:transition-none';

  const renderSources = (sources: Source[]) => (
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {sources.map((s) => (
        <li key={`${s.label}-${s.href}`}>
          <a
            href={s.href}
            className={sourceLink}
            {...(external(s.href) ? { target: '_blank', rel: 'noreferrer' } : { onClick: onClose })}
          >
            {s.label}
            <span aria-hidden="true">&nbsp;{external(s.href) ? '↗' : '→'}</span>
          </a>
        </li>
      ))}
    </ul>
  );

  const renderContact = () =>
    meta ? (
      <ul className="mt-2 flex flex-wrap gap-1.5">
        <li>
          <a className={sourceLink} href={`mailto:${meta.email}`}>
            Email me
          </a>
        </li>
        <li>
          <a className={sourceLink} href={meta.resumeHref} target="_blank" rel="noreferrer">
            Resume
          </a>
        </li>
      </ul>
    ) : null;

  const renderRelated = (items: Suggestion[], title: string) =>
    items.length === 0 ? null : (
      <div className="mt-3">
        <p className={`text-xs ${muted}`}>{title}</p>
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {items.map((s) => (
            <li key={s.id}>
              <button type="button" className={chip} onClick={() => void pickFaq(s.id)} disabled={busy}>
                {s.question}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );

  const renderBrowse = () => {
    const faqs = (prepared?.index.chunks ?? []).filter((c) => c.kind === 'faq' && c.browse !== false);
    const order = prepared?.index.categories ?? [];
    const groups = order
      .map((name) => ({ name, items: faqs.filter((c) => c.category === name) }))
      .filter((g) => g.items.length > 0);
    return (
      <div className={botCard}>
        <p>Here is every question I have a prepared answer for, grouped by topic. You can also type your own.</p>
        <div className="mt-2 space-y-1.5">
          {groups.map((g, i) => (
            <details key={g.name} open={i === 0} className="group rounded-xl border border-slate-500/15 bg-slate-500/[0.04] px-3 py-2">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-xs font-semibold [&::-webkit-details-marker]:hidden">
                <span>
                  {g.name} <span className={`font-normal ${muted}`}>({g.items.length})</span>
                </span>
                <DetailsChevronIcon />
              </summary>
              <ul className="mt-2 flex flex-col gap-1">
                {g.items.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      className="w-full rounded-lg px-2 py-1.5 text-left text-xs transition hover:bg-signal-cyan/10 hover:text-signal-cyan motion-reduce:transition-none disabled:opacity-60"
                      onClick={() => void pickFaq(c.id)}
                      disabled={busy}
                    >
                      {c.question ?? c.title}
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>
    );
  };

  const renderBot = (m: Extract<Message, { role: 'bot' }>) => {
    const { outcome } = m;
    const r = outcome.result;
    const skills = prepared?.index.chunks.find((c) => c.id === 'faq:skills-overview');
    return (
      <div className={botCard}>
        {outcome.correction && (
          <p className={`mb-1.5 text-xs ${muted}`}>
            Showing results for “{outcome.asked}”. You typed “{m.typed}”.
          </p>
        )}
        {r.type === 'faq' && (
          <>
            {(r.faq.answer ?? []).map((p) => (
              <p key={p} className="mb-1.5 last:mb-0">
                {p}
              </p>
            ))}
            {renderSources(r.faq.sources ?? [])}
            {renderRelated(m.related, 'You might also ask')}
          </>
        )}
        {r.type === 'tech' && (
          <>
            {r.techs.map((t) => (
              <div key={t.name} className="mb-2 last:mb-0">
                <p>{techSentence(t)}</p>
                {renderSources([...(t.category ? [{ label: 'Skills', href: '/#skills' }] : []), ...t.usedIn])}
              </div>
            ))}
            {renderRelated(m.related, 'You might also ask')}
          </>
        )}
        {r.type === 'passages' && (
          <>
            <p className={`mb-2 text-xs ${muted}`}>This is what the site says that is closest to your question:</p>
            <ul className="space-y-2">
              {r.passages.map((p) => (
                <li key={p.chunk.id} className="rounded-xl border border-slate-500/15 bg-slate-500/[0.05] px-3 py-2">
                  <a
                    href={p.chunk.href}
                    onClick={onClose}
                    className="text-xs font-semibold text-signal-cyan underline-offset-2 hover:underline"
                  >
                    {p.chunk.title} →
                  </a>
                  <p className="mt-1">{p.snippet}</p>
                </li>
              ))}
            </ul>
            {renderRelated(m.related, 'Related questions')}
          </>
        )}
        {r.type === 'notListed' && (
          <>
            <p>
              I don’t list “{r.term}” anywhere on this site, so I can’t say whether I know it. Here is what I do list:
            </p>
            {(skills?.answer ?? []).slice(0, 5).map((p) => (
              <p key={p} className="mt-1 text-xs">
                {p}
              </p>
            ))}
            {renderRelated(m.related, 'You might ask instead')}
            {renderContact()}
          </>
        )}
        {r.type === 'scope' && (
          <>
            <p>{r.message}</p>
            {renderRelated(m.related, 'You might ask instead')}
            {renderContact()}
          </>
        )}
        {r.type === 'none' && (
          <>
            <p>{fallbackMessage}</p>
            {renderRelated(m.related, 'Did you mean one of these?')}
            {renderContact()}
          </>
        )}
        {(r.type === 'faq' || r.type === 'tech' || r.type === 'passages') && 'mode' in r && (
          <p className={`mt-2 text-[11px] ${muted}`}>
            {r.mode === 'curated' ? 'Prepared answer' : `Matched by ${r.mode}`}. Taken from this site.
          </p>
        )}
      </div>
    );
  };

  const status = loadError
    ? 'Search is unavailable right now. You can still email me.'
    : !prepared
      ? 'Loading…'
      : semantic === 'loading'
        ? `Loading smarter search… ${progress}%`
        : semantic === 'ready'
          ? 'Smart search is on: it matches meaning as well as keywords.'
          : semantic === 'offer'
            ? null
            : 'Keyword search is on.';

  return (
    <div
      role="dialog"
      aria-label="Ask about Pubudu"
      aria-modal="false"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      style={{
        boxShadow: isDark
          ? '0 30px 90px -24px rgba(110,231,240,0.40), 0 0 0 1px rgba(110,231,240,0.28)'
          : '0 30px 80px -24px rgba(12,106,133,0.45), 0 0 0 1px rgba(12,106,133,0.30)',
      }}
      className={`fixed inset-x-3 bottom-3 z-50 flex-col overflow-hidden rounded-3xl border backdrop-blur-xl sm:inset-x-auto sm:bottom-5 sm:right-5 ${
        expanded
          ? 'max-h-[min(38rem,calc(100dvh-1.5rem))] sm:h-[min(52rem,calc(100dvh-2.5rem))] sm:max-h-none sm:w-[min(46rem,calc(100vw-2.5rem))]'
          : 'max-h-[min(38rem,calc(100dvh-1.5rem))] sm:w-[26rem]'
      } ${mobileMenuSurface} ${open ? 'flex' : 'hidden'}`}
    >
      <div aria-hidden="true" className="h-1 w-full shrink-0 bg-gradient-to-r from-signal-cyan via-signal-blue to-signal-cyan" />
      <div className="flex items-start justify-between gap-3 border-b border-slate-500/15 bg-gradient-to-br from-signal-cyan/15 via-transparent to-signal-blue/10 px-4 py-3">
        <div className="flex min-w-0 gap-3">
          <span
            aria-hidden="true"
            className={`relative mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-signal-cyan to-signal-blue ${isDark ? 'text-ink-950' : 'text-white'}`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8.5A1.5 1.5 0 0 1 19 17h-7l-4.5 3.5V17H5a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 5 5.5Z"
              />
              <path fill="currentColor" d="M8.5 10.2h7v1.4h-7zm0 2.6h4.5v1.4H8.5z" />
            </svg>
            <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 bg-signal-green ${isDark ? 'border-ink-950' : 'border-white'}`} />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-tight">Ask about Pubudu</h2>
            <p className={`mt-0.5 text-xs leading-5 ${muted}`}>
              Answers come straight from this site, not a live AI. Your questions stay in your browser.
            </p>
            {status && <p className={`mt-1 text-xs ${muted}`}>{status}</p>}
            {semantic === 'offer' && prepared && (
              <button type="button" className={`${chip} mt-1.5`} onClick={() => startSemantic(prepared)}>
                Turn on smarter search (about 35 MB download)
              </button>
            )}
          </div>
        </div>
        <div className="flex shrink-0 gap-1.5">
        <button
          type="button"
          onClick={toggleExpanded}
          aria-pressed={expanded}
          aria-label="Larger window"
          title={expanded ? 'Shrink the window' : 'Enlarge the window'}
          className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-500/25 transition hover:border-signal-cyan/50 hover:text-signal-cyan motion-reduce:transition-none sm:inline-flex"
        >
          <ExpandIcon expanded={expanded} />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-500/25 transition hover:border-signal-cyan/50 hover:text-signal-cyan motion-reduce:transition-none"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
        </div>
      </div>

      <div ref={logRef} role="log" aria-live="polite" aria-relevant="additions" className="min-h-[8rem] flex-1 space-y-4 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <div>
            <p className="text-lg font-semibold tracking-tight">What would you like to know?</p>
            <p className={`mt-1 text-sm leading-6 ${muted}`}>
              Ask about my projects, education, experience, skills, or availability. Typos are fine.
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {chips.map((c) => (
                <li key={c.id}>
                  <button type="button" className={chip} onClick={() => void pickFaq(c.id)} disabled={busy}>
                    {c.question}
                  </button>
                </li>
              ))}
            </ul>
            {prepared && (
              <button type="button" className={`${chip} mt-2`} onClick={showBrowse} disabled={busy}>
                Browse all questions
              </button>
            )}
          </div>
        )}
        {messages.map((m) =>
          m.role === 'user' ? (
            <p
              key={m.id}
              className={`ml-auto max-w-[85%] rounded-2xl rounded-br-md px-3.5 py-2 text-sm font-medium ${isDark ? 'bg-signal-cyan text-ink-950' : 'bg-ink-900 text-ink-100'}`}
            >
              {m.text}
            </p>
          ) : m.role === 'browse' ? (
            <div key={m.id}>{renderBrowse()}</div>
          ) : (
            <div key={m.id}>{renderBot(m)}</div>
          ),
        )}
        {busy && <p className={`text-xs ${muted}`}>Looking…</p>}
      </div>

      <div className="border-t border-slate-500/15 px-3 pb-3 pt-2">
        {typing.length > 0 && (
          <ul aria-label="Suggested questions" className="mb-2 flex flex-col gap-1">
            {typing.map((s) => (
              <li key={s.id}>
                <button type="button" className={`${chip} w-full rounded-xl`} onClick={() => void pickFaq(s.id)} disabled={busy}>
                  {s.question}
                </button>
              </li>
            ))}
          </ul>
        )}
        {prepared && messages.length > 0 && (
          <button
            type="button"
            onClick={showBrowse}
            disabled={busy}
            className={`mb-2 text-xs underline-offset-2 hover:text-signal-cyan hover:underline ${muted}`}
          >
            Browse all questions
          </button>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit(input);
          }}
          className="flex gap-2"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Ask a question about Pubudu"
            placeholder="Ask about my projects, GPA, experience…"
            autoComplete="off"
            className="min-w-0 flex-1 rounded-full border border-slate-500/30 bg-transparent px-4 py-2.5 text-sm placeholder:text-slate-500 focus:border-signal-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-cyan/50"
          />
          <button
            type="submit"
            disabled={!prepared || busy || input.trim().length === 0}
            className={`rounded-full bg-signal-cyan px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 motion-reduce:transition-none ${theme === 'dark' ? 'text-ink-950 hover:bg-ink-100' : 'text-ink-100 hover:bg-ink-900'}`}
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );
}
