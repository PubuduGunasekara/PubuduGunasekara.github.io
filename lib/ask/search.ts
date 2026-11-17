import { fallbackMessage, scopeRules } from './rules';
import type { AskIndex, AskResult, AskTech, Chunk, Passage, SearchMode, Suggestion } from './types';

// Retrieval for the "Ask about me" panel. Pure functions with no DOM access, so the browser,
// the index builder and the evaluation script all run exactly the same code.

export const QUERY_PREFIX = 'Represent this sentence for searching relevant passages: ';

export type Thresholds = {
  aliasMin: number; // a curated question this similar to the asked one is answered directly
  semMin: number; // minimum cosine similarity for the top chunk
  semStrong: number; // above this the keyword check and the unknown-term check are skipped
  covMin: number; // minimum idf-weighted share of the question's terms found in the top chunk
  faqMin: number; // a curated answer reached without a close question match needs at least this similarity
  unkMax: number; // decline when more than this share of the question's weight is on words found nowhere on the site
  covMinKeywordOnly: number; // stricter bar when only keyword search is available
};

export const DEFAULT_THRESHOLDS: Thresholds = {
  aliasMin: 0.8,
  semMin: 0.55,
  semStrong: 0.7,
  covMin: 0.2,
  faqMin: 0.72,
  unkMax: 0.5,
  covMinKeywordOnly: 0.5,
};

// The question is embedded twice: with the retrieval instruction (to compare with passages) and as plain
// text (to compare with the curated questions).
export type QueryVectors = { prefixed: Float32Array; plain: Float32Array };

const STOP = new Set(
  (
    'a about above after again all also am an and any are as at be because been before being below between both but by can could did do does doing down during each few for from further had has have having he her here hers him his how i if in into is it its just me more most my no nor not now of off on once only or other our out over own please same she should so some such than that the their them then there these they this those through to too under until up us very was we were what when where which while who whom why will with would you your yours tell give hi hello hey ask want know good great really currently ever much many long able willing attend attending'
  ).split(' '),
);

// "Do you know X?" style questions are best answered by the skills rows.
const SKILL_INTENT = /\b(know|knows|familiar|proficient|comfortable|skilled|experience|experienced|use|used|using|worked with|work with|tools?|stack|technolog)/i;

const SYNONYMS: Record<string, string[]> = {
  ml: ['machine', 'learning'],
  js: ['javascript'],
  ts: ['typescript'],
  db: ['database'],
  swe: ['software', 'engineering'],
  cs: ['computer', 'science'],
  llm: ['language', 'model'],
  llms: ['language', 'model'],
  rag: ['retrieval', 'augmented', 'generation'],
  gpa: ['gpa', 'grade'],
  intern: ['internship'],
  hire: ['seeking', 'looking'],
  hiring: ['seeking', 'looking'],
  available: ['availability', 'summer'],
  relocate: ['relocation'],
  tech: ['skills', 'stack'],
  technologies: ['skills', 'stack'],
  degree: ['education', 'university'],
  studied: ['education', 'university'],
  school: ['education', 'university'],
  email: ['contact', 'email'],
  reach: ['contact', 'email'],
};

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/c\+\+/g, 'cpp')
    .replace(/node\.js/g, 'nodejs')
    .replace(/next\.js/g, 'nextjs')
    .replace(/ci\/cd/g, 'cicd')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function stem(word: string): string {
  let s = word;
  if (s.endsWith('ies') && s.length > 5) s = s.slice(0, -3) + 'y';
  else if (s.endsWith('s') && !s.endsWith('ss') && s.length >= 4) s = s.slice(0, -1);
  if (s.length > 6 && s.endsWith('ation')) {
    s = s.slice(0, -5) + 'at';
  } else {
    for (const suffix of ['ship', 'ing', 'ied', 'er', 'ed', 'es']) {
      if (s.length - suffix.length >= 4 && s.endsWith(suffix)) {
        s = s.slice(0, -suffix.length);
        break;
      }
    }
  }
  if (s.length > 4 && s.endsWith('e')) s = s.slice(0, -1);
  return s.slice(0, 8);
}

export function docTerms(text: string): string[] {
  const out: string[] = [];
  for (const raw of normalize(text).split(' ')) {
    if (!raw || STOP.has(raw)) continue;
    out.push(stem(raw));
  }
  return out;
}

export function queryTerms(question: string): string[] {
  const out: string[] = [];
  for (const raw of normalize(question).split(' ')) {
    if (!raw) continue;
    const words = SYNONYMS[raw] ? [raw, ...SYNONYMS[raw]] : [raw];
    for (const w of words) {
      if (STOP.has(w)) continue;
      out.push(stem(w));
    }
  }
  return [...new Set(out)];
}

type Bm25 = {
  tf: Map<string, number>[];
  len: number[];
  avgLen: number;
  df: Map<string, number>;
  n: number;
};

function buildBm25(chunks: Chunk[]): Bm25 {
  const tf: Map<string, number>[] = [];
  const len: number[] = [];
  const df = new Map<string, number>();
  for (const chunk of chunks) {
    const terms = docTerms(`${chunk.title} ${chunk.title} ${chunk.text}`);
    const counts = new Map<string, number>();
    for (const t of terms) counts.set(t, (counts.get(t) ?? 0) + 1);
    for (const t of counts.keys()) df.set(t, (df.get(t) ?? 0) + 1);
    tf.push(counts);
    len.push(terms.length);
  }
  const avgLen = len.reduce((a, b) => a + b, 0) / Math.max(1, len.length);
  return { tf, len, avgLen, df, n: chunks.length };
}

function idf(bm: Bm25, term: string): number {
  const df = bm.df.get(term) ?? 0;
  return Math.log(1 + (bm.n - df + 0.5) / (df + 0.5));
}

type AliasInfo = { faq: number; stems: Set<string>; words: string[] };

export type Prepared = {
  index: AskIndex;
  bm25: Bm25;
  vectors: Float32Array | null; // chunk rows, then alias rows
  vocab: Map<string, number>; // every word on the site (normalized, not a stopword) -> number of chunks using it
  vocabStems: Set<string>; // stems of those words, so "handles" is recognized as a form of "handle"
  techWords: Set<string>; // every word of every technology name
  aliasInfo: AliasInfo[];
};

export function decodeEmbeddings(base64: string): Float32Array {
  const binary = atob(base64);
  const out = new Float32Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    const byte = binary.charCodeAt(i);
    out[i] = (byte > 127 ? byte - 256 : byte) / 127;
  }
  return out;
}

export function prepare(index: AskIndex): Prepared {
  const vocab = new Map<string, number>();
  const addWords = (text: string) => {
    for (const w of new Set(normalize(text).split(' '))) {
      if (w.length >= 3 && !STOP.has(w)) vocab.set(w, (vocab.get(w) ?? 0) + 1);
    }
  };
  for (const c of index.chunks) addWords(`${c.title} ${c.text}`);
  for (const a of index.aliases) addWords(a.text);
  const vocabStems = new Set<string>();
  for (const w of vocab.keys()) vocabStems.add(stem(w));
  const techWords = new Set<string>();
  for (const t of index.techs) for (const a of t.aliases) for (const w of a.split(' ')) if (w.length >= 3) techWords.add(w);
  const aliasInfo = index.aliases.map((a) => ({
    faq: a.chunk,
    stems: new Set(docTerms(a.text)),
    words: normalize(a.text).split(' '),
  }));
  return {
    index,
    bm25: buildBm25(index.chunks),
    vectors: index.embeddings ? decodeEmbeddings(index.embeddings) : null,
    vocab,
    vocabStems,
    techWords,
    aliasInfo,
  };
}

// ---------------------------------------------------------------------------------------------
// Typo correction (for search only). A word is only changed when it is NOT a word the site contains,
// is at least 5 letters, shares its first letter with the replacement and is one edit away (two for
// 9+ letters). Short words and acronyms are never touched, so "Rust" cannot become "REST".
// ---------------------------------------------------------------------------------------------

function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev2: number[] = [];
  let prev: number[] = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur: number[] = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
      cur[j] = v;
      rowMin = Math.min(rowMin, v);
    }
    if (rowMin > max) return max + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[b.length];
}

const TECH_QUESTION =
  /\b(do you (know|use|have|work with|code in|program in)|did you (use|work with)|have you (used|worked|tried|touched|built|written)|are you (familiar|comfortable|proficient|experienced|skilled|good)|any experience|experience (with|in|using|of)|(your )?(knowledge|skills?|background|expertise) (in|with|of)|know how to|can you (use|code in|program in))\b/i;
const TECH_TAIL =
  /(?:do you (?:know|use|have|work with|code in|program in)|did you (?:use|work with)|have you (?:used|worked with|worked|tried|touched|built with|written)|are you (?:familiar with|comfortable with|proficient in|experienced (?:with|in)|skilled (?:in|with)|good (?:at|with))|any experience (?:with|in|using)|experience (?:with|in|using|of)|(?:knowledge|skills?|background|expertise) (?:in|with|of)|know how to use|can you (?:use|code in|program in))\s+(?:the |any |some |a |an )?(.+?)\s*[?.!]*$/i;

export function correctQuestion(prepared: Prepared, question: string): { text: string; changes: { from: string; to: string }[] } {
  const tail = TECH_TAIL.exec(question);
  const tailStart = tail ? question.lastIndexOf(tail[1]) : Number.POSITIVE_INFINITY;
  const changes: { from: string; to: string }[] = [];
  const text = question.replace(/[A-Za-z][A-Za-z'’-]*/g, (word, offset: number) => {
    const lw = word.toLowerCase().replace(/[’']/g, '');
    if (lw.length < 5 || STOP.has(lw) || prepared.vocab.has(lw) || prepared.techWords.has(lw)) return word;
    // A different form of a word the site uses ("relocating", "handles") is valid English, not a typo.
    if (prepared.vocabStems.has(stem(lw))) return word;
    if (word.length <= 6 && word === word.toUpperCase()) return word;
    const max = lw.length >= 9 ? 2 : 1;
    const inTechTail = offset >= tailStart;
    let best: string | null = null;
    let bestDist = max + 1;
    let bestFreq = -1;
    const consider = (cand: string, freq: number) => {
      if (cand.length < 4 || cand[0] !== lw[0]) return;
      const d = editDistance(lw, cand, max);
      if (d > max) return;
      if (d < bestDist || (d === bestDist && freq > bestFreq)) {
        best = cand;
        bestDist = d;
        bestFreq = freq;
      }
    };
    for (const w of prepared.techWords) consider(w, 1);
    if (!inTechTail) for (const [w, freq] of prepared.vocab) consider(w, freq);
    if (!best) return word;
    const chosen: string = best;
    const fixed = word[0] === word[0].toUpperCase() ? chosen[0].toUpperCase() + chosen.slice(1) : chosen;
    changes.push({ from: word, to: fixed });
    return fixed;
  });
  return { text, changes };
}

// ---------------------------------------------------------------------------------------------
// Technology lookup: "Do you know Python?" is answered straight from the skills and project data.
// ---------------------------------------------------------------------------------------------

export function detectTechs(prepared: Prepared, question: string): AskTech[] {
  let rest = ` ${normalize(question)} `;
  const entries: { alias: string; tech: AskTech }[] = [];
  for (const tech of prepared.index.techs) for (const alias of tech.aliases) entries.push({ alias, tech });
  entries.sort((a, b) => b.alias.length - a.alias.length);
  const found: AskTech[] = [];
  for (const { alias, tech } of entries) {
    const needle = ` ${alias} `;
    if (rest.includes(needle)) {
      if (!found.includes(tech)) found.push(tech);
      rest = rest.split(needle).join(' ');
    }
  }
  return found;
}

// For "Do you know Kubernetes?": the thing asked about, if none of its words appear anywhere on the site.
export function unlistedTerm(prepared: Prepared, question: string): string | null {
  const m = TECH_TAIL.exec(question.trim());
  if (!m) return null;
  const term = m[1]
    .replace(/^(experience|knowledge|skills?|background|expertise)\s+(with|in|using|of)\s+/i, '')
    .replace(/\s+(programming language|language|framework|library|tool|tools|technology|technologies|database|platform|stack|experience)$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  const terms = docTerms(term);
  if (terms.length === 0 || term.length > 40) return null;
  const known = terms.some((t) => (prepared.bm25.df.get(t) ?? 0) > 0);
  return known ? null : term;
}

// ---------------------------------------------------------------------------------------------
// Ranking
// ---------------------------------------------------------------------------------------------

export type Hit = {
  chunk: Chunk;
  rrf: number;
  lex: number;
  coverage: number;
  sem: number | null;
  unk: number;
};

const cueOk = (chunk: Chunk, question: string) => !chunk.cue || new RegExp(chunk.cue, 'i').test(question);

function cosine(vectors: Float32Array, dims: number, row: number, q: Float32Array): number {
  let dot = 0;
  let nv = 0;
  const base = row * dims;
  for (let i = 0; i < dims; i++) {
    const v = vectors[base + i];
    dot += v * q[i];
    nv += v * v;
  }
  return nv === 0 ? 0 : dot / Math.sqrt(nv);
}

// Rank every chunk. The corpus is tiny, so every chunk is scored. The two rankings are combined with
// reciprocal rank fusion (k = 60), the same rule ResumeMatch uses for per-section search.
export function rank(prepared: Prepared, question: string, queryVector: Float32Array | null): Hit[] {
  const { index, bm25, vectors } = prepared;
  const terms = queryTerms(question);
  const termIdf = terms.map((t) => idf(bm25, t));
  const totalIdf = termIdf.reduce((a, b) => a + b, 0) || 1;
  const unk = terms.reduce((acc, t, j) => acc + ((bm25.df.get(t) ?? 0) === 0 ? termIdf[j] : 0), 0) / totalIdf;
  const k1 = 1.2;
  const b = 0.75;

  const lex = index.chunks.map((_, i) => {
    let score = 0;
    terms.forEach((t, j) => {
      const f = bm25.tf[i].get(t) ?? 0;
      if (f === 0) return;
      score += termIdf[j] * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * bm25.len[i]) / bm25.avgLen)));
    });
    return score;
  });
  const coverage = index.chunks.map((_, i) => {
    let found = 0;
    terms.forEach((t, j) => {
      if (bm25.tf[i].has(t)) found += termIdf[j];
    });
    return found / totalIdf;
  });
  const sem =
    vectors && queryVector ? index.chunks.map((_, i) => cosine(vectors, index.dims, i, queryVector)) : null;

  const order = (scores: number[], minScore: number) =>
    scores
      .map((s, i) => ({ s, i }))
      .filter((x) => x.s > minScore)
      .sort((a, b2) => b2.s - a.s)
      .map((x, r) => [x.i, r] as const);

  const rrf = new Array<number>(index.chunks.length).fill(0);
  for (const [i, r] of order(lex, 0)) rrf[i] += 1 / (60 + r);
  if (sem) for (const [i, r] of order(sem, -1)) rrf[i] += 1 / (60 + r);
  if (SKILL_INTENT.test(question)) {
    index.chunks.forEach((c, i) => {
      if (c.kind === 'skills') rrf[i] *= 1.35;
    });
  }

  return index.chunks
    .map((chunk, i) => ({ chunk, rrf: rrf[i], lex: lex[i], coverage: coverage[i], sem: sem ? sem[i] : null, unk }))
    .filter((h) => h.rrf > 0 && cueOk(h.chunk, question))
    .sort((a, b2) => b2.rrf - a.rrf);
}

export function isAnswerable(top: Hit | undefined, hasSemantic: boolean, t: Thresholds): boolean {
  if (!top) return false;
  if (!hasSemantic || top.sem === null) return top.coverage >= t.covMinKeywordOnly && top.unk <= t.unkMax;
  if (top.sem < t.semMin) return false;
  if (top.sem >= t.semStrong) return true;
  return top.coverage >= t.covMin && top.unk <= t.unkMax;
}

// Best curated-question match: the plain question against every alias row.
export function bestAlias(prepared: Prepared, plain: Float32Array, question = ''): { chunk: number; sim: number } | null {
  const { index, vectors } = prepared;
  if (!vectors || index.aliases.length === 0) return null;
  let best: { chunk: number; sim: number } | null = null;
  index.aliases.forEach((alias, j) => {
    if (!cueOk(index.chunks[alias.chunk], question)) return;
    const sim = cosine(vectors, index.dims, index.chunks.length + j, plain);
    if (!best || sim > best.sim) best = { chunk: alias.chunk, sim };
  });
  return best;
}

// ---------------------------------------------------------------------------------------------
// Suggestions: "did you mean" questions while typing, and related questions after an answer.
// ---------------------------------------------------------------------------------------------

export function suggestQuestions(
  prepared: Prepared,
  text: string,
  opts: { max?: number; exclude?: ReadonlySet<string>; plain?: Float32Array | null; floor?: number } = {},
): Suggestion[] {
  const { index, bm25, vectors, aliasInfo } = prepared;
  const max = opts.max ?? 4;
  const trimmed = text.trim();
  if (trimmed.length < 2) return [];
  const midWord = !/\s$/.test(text);
  const words = normalize(trimmed).split(' ').filter(Boolean);
  const last = midWord ? (words[words.length - 1] ?? '') : '';
  const whole = (midWord ? words.slice(0, -1) : words).filter((w) => !STOP.has(w)).map(stem);
  const wholeTerms = [...new Set(whole)];
  const prefix = last.length >= 2 && !STOP.has(last) ? last : '';
  const weight = (t: string) => idf(bm25, t);
  const prefixWeight = prefix ? Math.max(1, ...wholeTerms.map(weight)) * 0.8 : 0;
  const totalWeight = wholeTerms.reduce((a, t) => a + weight(t), 0) + prefixWeight || 1;

  const bestByFaq = new Map<number, number>();
  aliasInfo.forEach((alias, j) => {
    let found = 0;
    for (const t of wholeTerms) if (alias.stems.has(t)) found += weight(t);
    if (prefix && alias.words.some((w) => w.startsWith(prefix))) found += prefixWeight;
    let score = found / totalWeight;
    if (vectors && opts.plain) {
      const sem = cosine(vectors, index.dims, index.chunks.length + j, opts.plain);
      score = Math.max(score * 0.95, sem);
    }
    if (score > (bestByFaq.get(alias.faq) ?? 0)) bestByFaq.set(alias.faq, score);
  });

  const floor = opts.floor ?? (vectors && opts.plain ? 0.62 : 0.5);
  return [...bestByFaq.entries()]
    .filter(([faq, score]) => score >= floor && !opts.exclude?.has(index.chunks[faq].id))
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([faq]) => ({ id: index.chunks[faq].id, question: index.chunks[faq].question ?? index.chunks[faq].title }));
}

// ---------------------------------------------------------------------------------------------
// Answering
// ---------------------------------------------------------------------------------------------

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9“"(])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Pick the one or two sentences of a chunk that share the most (idf-weighted) terms with the question.
export function snippetFor(prepared: Prepared, chunk: Chunk, question: string): string {
  const terms = new Set(queryTerms(question));
  const parts = sentences(chunk.text);
  if (parts.length <= 2) return chunk.text;
  const scored = parts.map((s, i) => {
    const seen = new Set(docTerms(s));
    let score = 0;
    for (const t of terms) if (seen.has(t)) score += idf(prepared.bm25, t);
    return { s, i, score };
  });
  const best = [...scored].sort((a, b) => b.score - a.score || a.i - b.i).slice(0, 2);
  if (best[0].score === 0) return parts.slice(0, 2).join(' ');
  return best
    .sort((a, b) => a.i - b.i)
    .map((x) => x.s)
    .join(' ');
}

// `question` should already be typo-corrected (see correctQuestion).
export function answerQuestion(
  prepared: Prepared,
  question: string,
  queryVectors: QueryVectors | null,
  thresholds: Thresholds = DEFAULT_THRESHOLDS,
): { result: AskResult; hits: Hit[] } {
  const q = question.trim();
  for (const rule of scopeRules) {
    if (rule.pattern.test(q)) return { result: { type: 'scope', message: rule.message }, hits: [] };
  }
  const hasSemantic = !!(prepared.vectors && queryVectors);
  const mode: SearchMode = hasSemantic ? 'meaning and keywords' : 'keywords only';

  if (TECH_QUESTION.test(q)) {
    const techs = detectTechs(prepared, q);
    if (techs.length > 0) return { result: { type: 'tech', techs, mode }, hits: [] };
    const term = unlistedTerm(prepared, q);
    if (term) return { result: { type: 'notListed', term }, hits: [] };
  }

  const hits = rank(prepared, q, hasSemantic && queryVectors ? queryVectors.prefixed : null);
  if (hasSemantic && queryVectors) {
    const alias = bestAlias(prepared, queryVectors.plain, q);
    if (alias && alias.sim >= thresholds.aliasMin) {
      const faq = prepared.index.chunks[alias.chunk];
      return { result: { type: 'faq', faq, mode }, hits: [{ chunk: faq, rrf: 1, lex: 0, coverage: 1, sem: alias.sim, unk: 0 }, ...hits] };
    }
  }
  const top = hits[0];
  if (!isAnswerable(top, hasSemantic, thresholds)) return { result: { type: 'none' }, hits };

  const strongFaq = top.chunk.kind === 'faq' && (!hasSemantic || (top.sem ?? 0) >= thresholds.faqMin);
  if (strongFaq) return { result: { type: 'faq', faq: top.chunk, mode }, hits };

  // A weakly matched curated answer is not shown as if it were certain; show passages from the site instead.
  const passageHits = hits.filter((h) => h.chunk.kind !== 'faq');
  if (top.chunk.kind === 'faq' && !isAnswerable(passageHits[0], hasSemantic, thresholds)) {
    return { result: { type: 'none' }, hits };
  }
  const passages: Passage[] = [];
  for (const hit of hits) {
    if (hit.chunk.kind === 'faq') continue;
    if (passages.length >= 3) break;
    const keep =
      passages.length === 0 ||
      (hasSemantic && hit.sem !== null
        ? hit.sem >= thresholds.semMin - 0.04
        : hit.coverage >= thresholds.covMinKeywordOnly * 0.85);
    if (!keep) continue;
    passages.push({ chunk: hit.chunk, snippet: snippetFor(prepared, hit.chunk, q) });
  }
  if (passages.length === 0) return { result: { type: 'none' }, hits };
  return { result: { type: 'passages', passages, mode }, hits };
}

export type AskOutcome = {
  result: AskResult;
  hits: Hit[];
  asked: string; // the text that was actually searched
  correction: { from: string; to: string }[] | null; // set when the typo-corrected question was used
};

const isAnswer = (r: AskResult) => r.type === 'faq' || r.type === 'tech' || r.type === 'passages';

// The panel's full flow. The question is answered as typed. Only when that gives no answer (or a weaker one)
// is a typo-corrected version tried, so a correctly spelled question is never altered.
export async function ask(
  prepared: Prepared,
  question: string,
  embed: ((text: string) => Promise<QueryVectors | null>) | null,
  thresholds: Thresholds = DEFAULT_THRESHOLDS,
): Promise<AskOutcome> {
  const original = await (async () => {
    const vectors = embed ? await embed(question).catch(() => null) : null;
    return answerQuestion(prepared, question, vectors, thresholds);
  })();
  const { text, changes } = correctQuestion(prepared, question);
  if (changes.length === 0) return { ...original, asked: question, correction: null };
  const vectors = embed ? await embed(text).catch(() => null) : null;
  const corrected = answerQuestion(prepared, text, vectors, thresholds);
  const curated = (r: AskResult) => (r.type === 'faq' ? r.faq.id : r.type === 'tech' ? `tech:${r.techs.map((t) => t.name).join(',')}` : null);
  const better =
    original.result.type !== 'scope' &&
    ((!isAnswer(original.result) && isAnswer(corrected.result)) ||
      (curated(corrected.result) !== null && curated(corrected.result) !== curated(original.result)));
  return better
    ? { ...corrected, asked: text, correction: changes }
    : { ...original, asked: question, correction: null };
}

export { fallbackMessage };
