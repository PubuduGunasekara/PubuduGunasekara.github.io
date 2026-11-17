// Evaluates the "Ask about me" retrieval on scripts/ask-eval-questions.ts.
//   npm run ask:eval              report on every split with the shipped thresholds
//   npm run ask:eval -- --fails   also list every miss
//   npm run ask:eval -- --sweep   also print a threshold sweep on the dev split only

import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  DEFAULT_THRESHOLDS,
  QUERY_PREFIX,
  answerQuestion,
  ask,
  correctQuestion,
  normalize,
  prepare,
  suggestQuestions,
  type QueryVectors,
  type Thresholds,
} from '../lib/ask/search';
import type { AskIndex, AskResult } from '../lib/ask/types';
import { evalQuestions, liveSuggestionCases, type EvalQuestion } from './ask-eval-questions';

type Extractor = (input: string[], opts: { pooling: 'cls'; normalize: boolean }) => Promise<{ data: Float32Array; dims: number[] }>;

// The project sub-answers (faq:ts-*, faq:rm-*, faq:acr-*) are word-for-word excerpts of one case study. They were
// added after most questions were labelled, so a question whose labels already name a project's case study also
// accepts that project's sub-answers. The report below says how many results relied on this rule.
const SUB: Record<string, string> = { 'cs:task-scheduler': 'faq:ts-', 'cs:resumematch': 'faq:rm-', 'cs:ai-code-reviewer': 'faq:acr-' };
// Likewise faq:skills-<area> is generated from the same skills row as skills:<area>.
const expand = (expect: string[]) => [
  ...expect,
  ...expect.filter((e) => SUB[e]).map((e) => SUB[e]),
  ...expect.filter((e) => /^skills:[a-z-]+$/.test(e)).map((e) => `faq:skills-${e.slice(7)}`),
];
const strictMatches = (id: string, expect: string[]) => expect.some((p) => id === p || id.startsWith(p));
const matches = (id: string, expect: string[]) => strictMatches(id, expand(expect));
const declined = (r: AskResult) => r.type === 'none' || r.type === 'scope' || r.type === 'notListed';

async function main() {
  const index = JSON.parse(readFileSync(path.join(process.cwd(), 'public', 'ask', 'index.json'), 'utf8')) as AskIndex;
  const prepared = prepare(index);
  if (!prepared.vectors) throw new Error('The index has no embeddings, so the hybrid results cannot be evaluated.');

  const { pipeline } = await import('@huggingface/transformers');
  const extractor = (await pipeline('feature-extraction', index.model, { dtype: 'q8' })) as unknown as Extractor;
  const embed = async (q: string): Promise<QueryVectors> => {
    const out = await extractor([QUERY_PREFIX + q, q], { pooling: 'cls', normalize: true });
    const all = Float32Array.from(out.data);
    return { prefixed: all.slice(0, index.dims), plain: all.slice(index.dims) };
  };

  // Same flow as the panel (lib/ask/search.ts ask()): answer as typed, try the typo-corrected question only if that fails.
  const cache = new Map<string, QueryVectors>();
  const embedCached = async (text: string) => {
    let v = cache.get(text);
    if (!v) { v = await embed(text); cache.set(text, v); }
    return v;
  };
  type Row = {
    item: EvalQuestion;
    corrected: boolean;
    hybrid: Awaited<ReturnType<typeof ask>>;
    keyword: Awaited<ReturnType<typeof ask>>;
    vectors: QueryVectors;
  };
  const run = async (t: Thresholds): Promise<Row[]> => {
    const out: Row[] = [];
    for (const item of evalQuestions) {
      const hybrid = await ask(prepared, item.q, embedCached, t);
      const keyword = await ask(prepared, item.q, null, t);
      out.push({ item, corrected: !!hybrid.correction, hybrid, keyword, vectors: await embedCached(hybrid.asked) });
    }
    return out;
  };

  const shownIds = (r: AskResult, expect: string[] | 'none'): string[] => {
    if (r.type === 'faq') return [r.faq.id];
    if (r.type === 'passages') return r.passages.map((p) => p.chunk.id);
    // A direct technology answer counts as right for any question whose expected sources include a skills row.
    if (r.type === 'tech' && expect !== 'none' && expect.some((e) => e.startsWith('skills:') || e === 'faq:skills-overview')) return [expect[0]];
    if (r.type === 'tech') return r.techs.map((t) => `tech:${t.name}`);
    return [];
  };
  const answered = (r: AskResult) => r.type === 'faq' || r.type === 'passages' || r.type === 'tech';
  const pct = (n: number, d: number) => (d === 0 ? '  n/a' : `${((100 * n) / d).toFixed(0).padStart(3)}%`);

  function summarize(rows: Row[], label: string) {
    const on = rows.filter((r) => r.item.expect !== 'none');
    const off = rows.filter((r) => r.item.expect === 'none');
    console.log(`\n${label}  (${on.length} on-topic, ${off.length} should-decline)`);
    console.log('                          hit@1   hit@3   answered   answered+right   declined-correctly');
    for (const [name, pick] of [
      ['keywords only', (r: Row) => r.keyword],
      ['meaning + keywords', (r: Row) => r.hybrid],
    ] as const) {
      let h1 = 0, h3 = 0, ans = 0, right = 0, dec = 0;
      for (const r of on) {
        const exp = r.item.expect as string[];
        const o = pick(r);
        const ids = shownIds(o.result, exp);
        const top = o.hits[0] ? [o.hits[0].chunk.id] : ids;
        if (top.some((id) => matches(id, exp)) || (o.result.type === 'tech' && ids.length)) h1++;
        if (o.hits.slice(0, 3).some((h) => matches(h.chunk.id, exp)) || (o.result.type === 'tech' && ids.length)) h3++;
        if (answered(o.result)) {
          ans++;
          if (ids.slice(0, 1).some((id) => matches(id, exp))) right++;
        }
      }
      for (const r of off) if (declined(pick(r).result)) dec++;
      console.log(
        `  ${name.padEnd(22)}${pct(h1, on.length)}    ${pct(h3, on.length)}    ${pct(ans, on.length)}      ${pct(right, on.length)}            ${dec}/${off.length}`,
      );
    }
  }

  const rows = await run(DEFAULT_THRESHOLDS);
  console.log(`index: ${index.chunks.length} chunks, ${index.aliases.length} aliases, ${index.techs.length} technologies, model ${index.model}`);
  console.log(`thresholds: ${JSON.stringify(DEFAULT_THRESHOLDS)}`);
  summarize(rows.filter((r) => r.item.split === 'dev'), 'DEV (used for tuning)');
  summarize(rows.filter((r) => r.item.split === 'test'), 'TEST (not used for tuning, but its misses were inspected)');
  summarize(rows.filter((r) => r.item.split === 'final'), 'FINAL HOLDOUT (written after the fixes, never tuned on)');
  summarize(rows.filter((r) => r.item.split === 'typo'), 'TYPOS (misspelled questions, corrected before searching)');
  summarize(rows.filter((r) => r.item.split === 'bank'), 'BANK (questions for the project sub-answers, written after them: a sanity check, not a blind test)');

  // typo correction quality
  const clean = rows.filter((r) => r.item.split !== 'typo');
  const falseCorrections = clean.filter((r) => r.corrected);
  const typoRows = rows.filter((r) => r.item.split === 'typo');
  const wouldHaveChanged = clean.filter((r) => correctQuestion(prepared, r.item.q).changes.length > 0).length;
  console.log(`\nTYPO CORRECTION`);
  console.log(`  correctly spelled questions whose answer was replaced by a "corrected" one: ${falseCorrections.length}/${clean.length}${falseCorrections.length ? '  e.g. ' + falseCorrections.slice(0, 4).map((r) => `"${r.item.q}" -> "${r.hybrid.asked}"`).join('; ') : ''}`);
  console.log(`  (the corrector alone would have edited ${wouldHaveChanged}/${clean.length} of them, which "answer as typed first" prevents)`);
  console.log(`  misspelled questions answered using a corrected version: ${typoRows.filter((r) => r.corrected).length}/${typoRows.length}`);

  // did-you-mean rescue for on-topic questions the gate declined
  const declinedOn = rows.filter((r) => r.item.expect !== 'none' && !answered(r.hybrid.result) && r.item.split !== 'typo');
  let rescued = 0;
  for (const r of declinedOn) {
    const ids = suggestQuestions(prepared, r.hybrid.asked, { max: 3, plain: r.vectors.plain, floor: 0.5 }).map((x) => x.id);
    if (ids.some((id) => matches(id, r.item.expect as string[]))) rescued++;
  }
  console.log(`  on-topic questions the panel declined, where a "did you mean" suggestion offered the right curated question: ${rescued}/${declinedOn.length}`);

  // technology lookup coverage
  let techOk = 0;
  const techBad: string[] = [];
  for (const t of index.techs) {
    const { text } = correctQuestion(prepared, `Do you know ${t.name}?`);
    const o = answerQuestion(prepared, text, null);
    if (o.result.type === 'tech' && o.result.techs.some((x) => x.name === t.name || x.aliases.includes(normalize(t.name)))) techOk++;
    else techBad.push(`${t.name} -> ${o.result.type}`);
  }
  console.log(`\nTECHNOLOGY LOOKUP ("Do you know <name>?" for every technology on the site)`);
  console.log(`  answered directly and correctly: ${techOk}/${index.techs.length}${techBad.length ? '\n  misses: ' + techBad.join('; ') : ''}`);
  const notListed = ['Kubernetes', 'Rust', 'Terraform', 'Angular', 'Golang', 'Snowflake', 'Swift', 'Django', 'Scala', 'Photoshop'];
  let nl = 0;
  const nlBad: string[] = [];
  for (const name of notListed) {
    const { text } = correctQuestion(prepared, `Do you know ${name}?`);
    const o = answerQuestion(prepared, text, null);
    if (o.result.type === 'notListed') nl++;
    else nlBad.push(`${name} -> ${o.result.type}`);
  }
  console.log(`  "not listed" skills correctly reported as not on the site: ${nl}/${notListed.length}${nlBad.length ? '  misses: ' + nlBad.join('; ') : ''}`);

  // live suggestions while typing
  let live = 0;
  const liveBad: string[] = [];
  for (const [partial, expected] of liveSuggestionCases) {
    const ids = suggestQuestions(prepared, partial, { max: 4 }).map((s) => s.id);
    if (ids.includes(expected)) live++;
    else liveBad.push(`"${partial}" -> [${ids.join(', ')}]`);
  }
  console.log(`\nLIVE SUGGESTIONS while typing (keywords only, top 4 contains the expected curated question)`);
  console.log(`  ${live}/${liveSuggestionCases.length}${liveBad.length ? '\n  misses: ' + liveBad.join('\n          ') : ''}`);

  {
    const viaSub = rows.filter((r) => {
      if (r.item.expect === 'none' || r.hybrid.result.type !== 'faq') return false;
      const id = r.hybrid.result.faq.id;
      return matches(id, r.item.expect) && !strictMatches(id, r.item.expect);
    });
    console.log(`\nSUB-ANSWERS: ${viaSub.length} of ${rows.filter((r) => r.item.expect !== 'none').length} on-topic results were counted as right only through the sub-answer rule:`);
    for (const r of viaSub) console.log(`  [${r.item.split}] "${r.item.q}" -> ${(r.hybrid.result as { faq: { id: string } }).faq.id}`);
  }

  if (process.argv.includes('--fails')) {
    console.log('\nMISSES (meaning + keywords)');
    for (const r of rows) {
      const o = r.hybrid;
      const top = o.hits[0];
      const typ = o.result.type;
      const exp = r.item.expect;
      const tag = `[${r.item.split}]`;
      const feat = `(sem ${top?.sem?.toFixed(2)}, cov ${top?.coverage.toFixed(2)})`;
      if (exp === 'none') {
        if (answered(o.result)) console.log(`  ${tag} FALSE ANSWER  "${r.item.q}" -> ${shownIds(o.result, exp)[0]} ${feat}`);
      } else if (!answered(o.result)) {
        console.log(`  ${tag} DECLINED     "${r.item.q}" -> ${typ} top=${top?.chunk.id} ${feat}`);
      } else if (!matches(shownIds(o.result, exp)[0] ?? '', exp)) {
        console.log(`  ${tag} WRONG TOP    "${r.item.q}" -> ${shownIds(o.result, exp)[0]} ${feat}`);
      }
    }
  }

  if (process.argv.includes('--sweep')) {
    console.log('\nSWEEP on DEV only: rows = semMin, columns = covMin, cell = answered-right / false-answers (of should-decline)');
    const dev = rows.filter((r) => r.item.split === 'dev');
    const on = dev.filter((r) => r.item.expect !== 'none').length;
    const off = dev.filter((r) => r.item.expect === 'none').length;
    const covs = [0, 0.1, 0.2, 0.3, 0.4];
    console.log('         ' + covs.map((c) => String(c).padEnd(11)).join(''));
    for (const semMin of [0.5, 0.55, 0.6, 0.65]) {
      let line = String(semMin).padEnd(9);
      for (const covMin of covs) {
        const t: Thresholds = { ...DEFAULT_THRESHOLDS, semMin, covMin };
        let right = 0, falseAns = 0;
        for (const r of dev) {
          const o = answerQuestion(prepared, r.hybrid.asked, r.vectors, t);
          const exp = r.item.expect;
          const ids = shownIds(o.result, exp);
          if (exp === 'none') { if (answered(o.result)) falseAns++; }
          else if (ids.length && matches(ids[0], exp)) right++;
        }
        line += `${right}/${on} ${falseAns}/${off}`.padEnd(11);
      }
      console.log(line);
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
