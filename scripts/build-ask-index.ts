// Builds public/ask/index.json for the "Ask about me" panel.
// Run automatically before `npm run dev` and `npm run build`.
//
// 1. Split the site's content (lib/content.ts, lib/caseStudies.ts, lib/askContent.ts) into chunks.
// 2. Embed every chunk with the same model the browser uses (bge-small-en-v1.5, 8-bit).
// 3. Write one static JSON file. If the model cannot be loaded (for example, no network), the file is
//    still written without embeddings and the panel falls back to keyword search.
//
// Set ASK_REQUIRE_EMBEDDINGS=1 to make a missing embedding a hard failure.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  certifications,
  contactAvailability,
  contactBody,
  education,
  experience,
  heroExpected,
  heroGpa,
  heroLocation,
  heroName,
  heroProgram,
  heroSeeking,
  heroUniversity,
  highlightProjects,
  highlightWork,
  journeyClosing,
  journeySteps,
  leadership,
  links,
  projects,
  skills,
} from '../lib/content';
import { caseStudies } from '../lib/caseStudies';
import { chipOrder, staticFaqs } from '../lib/askContent';
import { CATEGORY_ORDER, NEXT, buildBank, categoryOf, hiddenFromBrowse } from './ask-bank';
import { normalize } from '../lib/ask/search';
import { slugify } from '../lib/ask/slug';
import type { AskIndex, AskTech, Chunk, Source } from '../lib/ask/types';

const VERSION = 5;
const MODEL = 'Xenova/bge-small-en-v1.5';
const DIMS = 384;
const OUT = path.join(process.cwd(), 'public', 'ask', 'index.json');

const sentence = (s: string) => {
  const t = s.trim();
  return /[.!?”"]$/.test(t) ? t : `${t}.`;
};
const join = (parts: string[]) => parts.map(sentence).join(' ');

function buildChunks(): { chunks: Chunk[]; aliases: { chunk: number; text: string }[]; techs: AskTech[] } {
  const chunks: Chunk[] = [];
  const aliasTexts: { id: string; text: string }[] = [];
  const add = (c: Chunk) => chunks.push(c);

  // About
  add({
    id: 'about:summary',
    kind: 'about',
    title: 'About Pubudu',
    href: '/#highlights',
    text: join([
      `I’m ${heroName}, an M.S. Computer Science student at ${heroUniversity} (${heroProgram.replace('M.S. Computer Science, ', '')})`,
      `${heroExpected}. ${heroGpa.replace('GPA ', 'GPA: ')}`,
      heroLocation.replace('Based in', 'I’m based in'),
      `${heroSeeking.label} ${heroSeeking.text}`,
      `${contactAvailability}`,
      contactBody,
    ]),
  });

  // Education
  for (const e of education) {
    add({
      id: `edu:${slugify(e.school.split(',')[0])}`,
      kind: 'education',
      title: `Education: ${e.school}`,
      href: '/#education',
      text: join([`${e.program}`, e.meta.replace(/·/g, ','), e.detail]),
    });
  }

  // Experience
  for (const x of experience) {
    add({
      id: `exp:${slugify(x.company)}`,
      kind: 'experience',
      title: `Experience: ${x.role} at ${x.company}`,
      href: '/#experience',
      text: join([
        `${x.role} at ${x.company}, ${x.period.replace(/·/g, ',')}`,
        ...(x.highlights ?? []),
        ...x.bullets,
        ...(x.focus.length ? [`Tools: ${x.focus.join(', ')}`] : []),
        ...(x.reflection ? [x.reflection] : []),
      ]),
    });
  }

  // Skills
  for (const s of skills) {
    add({
      id: `skills:${slugify(s.category)}`,
      kind: 'skills',
      title: `Skills: ${s.category}`,
      href: '/#skills',
      text: join([`${s.category}: ${s.items.join(', ')}`, s.context]),
    });
  }

  // Projects: overview, one chunk per detail bullet, and the highlights-card summary
  for (const p of projects) {
    const slug = slugify(p.title);
    const href = p.caseStudySlug ? `/projects/${p.caseStudySlug}/` : '/#projects';
    add({
      id: `proj:${slug}`,
      kind: 'project',
      title: `Project: ${p.title}`,
      href,
      text: join([`${p.title} (${p.eyebrow.replace(/·/g, ',')})`, p.body, `Built with ${p.stack.join(', ')}`]),
    });
    (p.highlights ?? []).forEach((h, i) =>
      add({ id: `proj:${slug}:detail-${i + 1}`, kind: 'project', title: `Project: ${p.title}`, href, text: sentence(h) }),
    );
  }
  for (const t of [...highlightProjects, highlightWork]) {
    add({
      id: `tile:${slugify(t.title)}`,
      kind: 'project',
      title: `Summary: ${t.title}`,
      href: t.href ?? (t === highlightWork ? '/#experience' : '/#projects'),
      text: join([
        `${t.title}${t.kind ? ` (${t.kind})` : ''}: ${t.fact}`,
        `What I built: ${t.built}`,
        `Used: ${t.used.join(', ')}`,
        `What I learned: ${t.learned}`,
        `How it helps a team: ${t.helps}`,
      ]),
    });
  }

  // Case studies
  const cs = (slug: string, heading: string, title: string, text: string, n?: number) =>
    add({
      id: `cs:${slug}:${slugify(heading)}${n === undefined ? '' : `:${n}`}`,
      kind: 'case-study',
      title,
      href: `/projects/${slug}/#${slugify(heading)}`,
      text,
    });
  for (const study of Object.values(caseStudies)) {
    const t = (heading: string) => `${study.title} case study: ${heading}`;
    if (study.kind === 'sectioned') {
      for (const section of study.sections) {
        if (section.paragraphs?.length) cs(study.slug, section.heading, t(section.heading), join(section.paragraphs));
        (section.bullets ?? []).forEach((b, i) => cs(study.slug, section.heading, t(section.heading), sentence(b), i + 1));
      }
    } else {
      cs(study.slug, 'Problem', t('Problem'), join(study.problem));
      cs(study.slug, 'Architecture', t('Architecture'), join(study.architectureNote));
      (study.whyComponents ?? []).forEach((w, i) =>
        cs(study.slug, 'Why these components', t(`Why ${w.title}`), `${w.title}. ${w.body}`, i + 1),
      );
      study.keyDecisions.forEach((d, i) =>
        cs(study.slug, 'Key engineering decisions', t(d.title), `${d.title}. ${d.body}`, i + 1),
      );
      study.failureScenarios.forEach((d, i) =>
        cs(study.slug, 'Failure scenarios and trade-offs', t(d.title), `${d.title}. ${d.body}`, i + 1),
      );
      cs(study.slug, 'Testing', t('Testing'), join(study.testing));
      cs(study.slug, 'Observability', t('Observability'), join(study.observability));
      cs(study.slug, 'Deployment and CI', t('Deployment and CI'), join(study.deployment));
      study.limitations.forEach((l, i) =>
        cs(study.slug, 'Known limitations and next steps', t('Known limitations'), sentence(l), i + 1),
      );
    }
  }

  // Leadership, certifications, story, contact
  leadership.forEach((l, i) =>
    add({
      id: `lead:${i + 1}`,
      kind: 'leadership',
      title: `Leadership: ${l.title}`,
      href: '/#leadership',
      text: join([`${l.title}, ${l.meta.replace(/·/g, ',')}`]),
    }),
  );
  add({
    id: 'certs:all',
    kind: 'certification',
    title: 'Certifications',
    href: '/#certifications',
    text: join([`Certifications: ${certifications.map(([name, issuer]) => `${name} (${issuer})`).join('; ')}`]),
  });
  add({
    id: 'story:journey',
    kind: 'story',
    title: 'How I got here',
    href: '/#story',
    text: join([...journeySteps.map((s) => `${s.place}: ${s.detail}`), journeyClosing]),
  });
  add({
    id: 'contact:links',
    kind: 'contact',
    title: 'Contact',
    href: '/#contact',
    text: join([
      `Email: ${links.email}`,
      `LinkedIn: ${links.linkedin}`,
      `GitHub: ${links.github}`,
      `LeetCode: ${links.leetcode}`,
      'My resume is available to download from the Resume button',
    ]),
  });

  // FAQs: curated answers, plus answers generated from the site's data
  const faq = (id: string, question: string, variants: string[], answer: string[], sources: Source[], chip = false, cue?: string) => {
    for (const text of [question, ...variants]) aliasTexts.push({ id: `faq:${id}`, text });
    add({
      id: `faq:${id}`,
      kind: 'faq',
      title: question,
      question,
      answer,
      sources,
      chip,
      cue,
      href: sources[0].href,
      text: [question, ...variants, ...answer].join(' '),
    });
  };

  for (const f of staticFaqs) faq(f.id, f.question, f.variants, f.answer, f.sources, !!f.chip);
  for (const f of buildBank()) {
    if (f.answer.some((a) => !a || !a.trim())) throw new Error(`Bank answer ${f.id} has an empty line (a source text was not found)`);
    faq(f.id, f.question, f.variants, f.answer, f.sources);
  }

  faq(
    'skills-overview',
    'What tech do you know?',
    ['What are your skills', 'Which programming languages do you know', 'Tech stack', 'What technologies do you use', 'What languages do you code in'],
    [
      ...skills.map((s) => `${s.category}: ${s.items.join(', ')}.`),
      'Open any row in the Skills section to see where I used each one.',
    ],
    [{ label: 'Skills', href: '/#skills' }],
    true,
  );
  faq(
    'education',
    'What is your education?',
    ['Where did you study', 'What degrees do you have', 'What is your GPA', 'Where did you go to school', 'What are you studying'],
    education.map((e) => `${e.school}: ${e.program} (${e.meta.replace(/·/g, ',')}). ${e.detail}`),
    [{ label: 'Education', href: '/#education' }],
  );
  faq(
    'leadership',
    'Do you have leadership experience?',
    ['Have you led a team', 'Extracurricular activities', 'Clubs and awards', 'Hackathons you won', 'Teamwork and leadership'],
    leadership.map((l) => `${l.title}: ${l.meta}.`),
    [{ label: 'Leadership', href: '/#leadership' }],
  );
  faq(
    'certifications',
    'What certifications do you have?',
    ['Any certificates', 'Azure certification', 'Cloud certification', 'IBM certificate', 'Coursera certificates'],
    certifications.map(([name, issuer]) => `${name} (${issuer}).`),
    [{ label: 'Certifications', href: '/#certifications' }],
  );
  faq(
    'contact',
    'How can I contact you?',
    ['What is your email', 'Where can I find your resume', 'LinkedIn and GitHub links', 'How do I reach you', 'Can I schedule a call', 'Get in touch'],
    [
      `Email is the best way to reach me: ${links.email}.`,
      'You can also find me on LinkedIn and GitHub, and download my resume with the Resume button at the top of the page.',
    ],
    [
      { label: 'Contact', href: '/#contact' },
      { label: 'LinkedIn', href: links.linkedin },
      { label: 'GitHub', href: links.github },
    ],
    true,
  );
  faq(
    'what-can-you-do',
    'What can you do for my team?',
    ['Why should we hire you', 'What value do you bring', 'What are your strengths', 'How can you help our company', 'Why you'],
    [...highlightProjects, highlightWork].map((t) => `${t.title}: ${t.helps}`),
    [{ label: 'The short version', href: '/#highlights' }],
  );


  // ----- generated answers: education -----
  const gpaOf = (detail: string) => /GPA:\s*(\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?)/.exec(detail)?.[1] ?? null;
  const cut = (detail: string, pattern: RegExp) => detail.replace(pattern, '').trim();
  const nu = education.find((e) => e.school.startsWith('Northeastern'));
  const conestoga = education.find((e) => e.school.startsWith('Conestoga'));
  const victoria = education.find((e) => e.school.startsWith('Victoria'));
  if (!nu || !conestoga || !victoria) throw new Error('Expected Northeastern, Conestoga and Victoria in education');
  const eduSrc: Source[] = [{ label: 'Education', href: '/#education' }];

  faq(
    'gpa',
    'What is your GPA?',
    ['What are your grades', 'How did you do academically', 'Academic performance', 'What GPA do you have at Northeastern', 'What was your undergraduate GPA', 'Conestoga GPA', 'Victoria University GPA', 'Is your GPA good'],
    [
      `At Northeastern my GPA is ${gpaOf(nu.detail)} (${nu.program}, in progress).`,
      `At Conestoga College it was ${gpaOf(conestoga.detail)} (${conestoga.program.replace('Graduate Certificate - ', 'Graduate Certificate in ')}), and at Victoria University it was ${gpaOf(victoria.detail)} (${victoria.program}).`,
    ],
    eduSrc,
  );
  faq(
    'courses',
    'What courses have you taken?',
    ['What classes are you taking', 'Northeastern coursework', 'Which courses have you completed', 'What are you studying this semester', 'Relevant coursework', 'Machine learning course', 'NLP course', 'Algorithms course', 'What subjects have you studied', 'Are you taking machine learning'],
    [
      `Northeastern: ${cut(nu.detail, /GPA:\s*\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?\.\s*/)}`,
      `Conestoga College: ${cut(conestoga.detail, /GPA:\s*\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?\.\s*/)}`,
      `Victoria University: ${cut(victoria.detail, /GPA:\s*\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?\.\s*/)}`,
    ],
    eduSrc,
  );
  faq(
    'graduation',
    'When do you graduate?',
    ['Expected graduation date', 'When will you finish your master’s', 'Graduation year', 'When did you start at Northeastern', 'How long is your program', 'When does your degree end'],
    [`I started the ${nu.program} at Northeastern in Jan 2026 and I’m expected to graduate in May 2028.`],
    eduSrc,
  );
  faq(
    'northeastern',
    'Tell me about your master’s at Northeastern',
    ['Northeastern University', 'Khoury College', 'Silicon Valley campus', 'What are you studying at Northeastern', 'What is your major', 'M.S. Computer Science', 'What is your graduate program'],
    [`${nu.school}: ${nu.program}, ${nu.meta.replace(/·/g, ',')}. ${nu.detail}`],
    eduSrc,
  );
  faq(
    'conestoga',
    'Tell me about Conestoga College',
    ['What did you study in Canada', 'Graduate certificate', 'Mobile Solutions Development', 'Waterloo college', 'What is your postgraduate certificate', 'Mobile development education'],
    [`${conestoga.school}: ${conestoga.program}, ${conestoga.meta.replace(/·/g, ',')}. ${conestoga.detail}`],
    eduSrc,
  );
  faq(
    'undergrad',
    'What is your undergraduate degree?',
    ['Bachelor’s degree', 'Where did you do your bachelor’s', 'Victoria University', 'Tell me about Melbourne', 'What did you major in', 'What was your first degree'],
    [`${victoria.school}: ${victoria.program}, ${victoria.meta.replace(/·/g, ',')}. ${victoria.detail}`],
    eduSrc,
  );

  // ----- generated answers: experience -----
  const virtusa = experience.find((e) => e.company === 'Virtusa');
  const hospitality = experience.find((e) => e.company.startsWith('Food Services'));
  if (!virtusa || !hospitality) throw new Error('Expected Virtusa and Food Services in experience');
  const expSrc: Source[] = [{ label: 'Experience', href: '/#experience' }];

  faq(
    'work-history',
    'What is your work history?',
    ['Employment history', 'Where have you worked before', 'Work experience timeline', 'Do you have industry experience', 'Previous jobs', 'List your jobs', 'Do you have professional experience', 'What was your last job', 'What did you do most recently', 'Most recent job'],
    experience.map((e) => `${e.role} at ${e.company}, ${e.period.replace(/·/g, ',')}.`),
    expSrc,
  );
  faq(
    'virtusa-details',
    'How long did you work at Virtusa and where?',
    ['When did you work at Virtusa', 'Virtusa dates', 'Where was Virtusa', 'How long were you at Virtusa', 'What was your title at Virtusa'],
    [`${virtusa.role} at ${virtusa.company}, ${virtusa.period.replace(/·/g, ',')}.`],
    expSrc,
  );
  faq(
    'virtusa-tools',
    'What tools did you use at Virtusa?',
    ['What tech stack did you use as a QA engineer', 'Selenium Camunda RabbitMQ', 'QA tools', 'Test automation tools', 'What did you test with'],
    [`At Virtusa I worked with: ${virtusa.focus.join(', ')}.`],
    expSrc,
  );
  faq(
    'hospitality',
    'What did you do in food services and hospitality?',
    ['Waterloo job', 'Tell me about your job in Canada', 'Non-tech work experience', 'What did you do between Conestoga and Northeastern', 'Team member job'],
    [`${hospitality.role} in ${hospitality.company}, ${hospitality.period.replace(/·/g, ',')}. This site does not list more detail about that role.`],
    expSrc,
  );
  faq(
    'awards',
    'Have you won any awards?',
    ['Hackathon winner', 'Top 10 innovative project', 'Achievements', 'Competitions you won', 'Any recognition'],
    [
      ...leadership.filter((l) => /1st place|hackathon/i.test(l.title)).map((l) => `${l.title}: ${l.meta}.`),
      'Smart Farm, the team project I led, was one of the Top 10 Most Innovative Projects at the NSBM Green EXE v1.0 software competition.',
    ],
    [{ label: 'Leadership', href: '/#leadership' }],
  );
  faq(
    'resume',
    'Where can I download your resume?',
    ['Can I see your resume', 'Do you have a CV', 'Send me your resume', 'Resume PDF', 'Download CV'],
    ['Use the Resume button at the top of the page. It downloads my current resume as a PDF.'],
    [{ label: 'Download resume', href: links.resume }],
  );

  // ----- generated answers: one pair per project -----
  const covered = new Set(staticFaqs.map((f) => f.id));
  const slugToFaq: Record<string, string> = {
    resumematch: 'resumematch',
    'distributed-task-scheduler': 'task-scheduler',
    'ai-code-review-assistant': 'ai-code-reviewer',
    'multi-user-blog': 'multi-user-blog',
    'iot-smart-farm-system': 'smart-farm',
  };
  for (const p of projects) {
    const slug = slugify(p.title);
    const project: Source = { label: p.title, href: p.caseStudySlug ? `/projects/${p.caseStudySlug}/` : '/#projects' };
    if (!slugToFaq[slug] || !covered.has(slugToFaq[slug])) {
      faq(
        `project-${slug}`,
        `Tell me about ${p.title}`,
        [`What is ${p.title}`, `${p.title} project`, `Describe ${p.title}`],
        [p.body, `Built with ${p.stack.join(', ')}.`],
        [project, { label: 'Code on GitHub', href: p.href }],
      );
    }
    faq(
      `stack-${slug}`,
      `What tech stack does ${p.title} use?`,
      [`${p.title} technologies`, `What is ${p.title} built with`, `${p.title} tools`, `Which languages does ${p.title} use`],
      [`${p.title} is built with ${p.stack.join(', ')}.`],
      [project],
      false,
      '\\b(stack|tech|technolog|built with|made with|tools?|languages?|frameworks?|librar(y|ies)|written in|built using|uses?)\\b',
    );
    faq(
      `code-${slug}`,
      `Where is the code for ${p.title}?`,
      [`${p.title} GitHub`, `${p.title} repo`, `${p.title} source code`, `Link to ${p.title}`],
      [
        `The code for ${p.title} is on GitHub, linked below.`,
        ...(p.demo ? ['There is also a demo, linked below.'] : []),
      ],
      [
        { label: 'Code on GitHub', href: p.href },
        ...(p.demo ? [{ label: 'Demo', href: p.demo }] : []),
        project,
      ],
      false,
      '\\b(code|github|repo|repository|source|link|demo|url)\\b',
    );
  }

  // chip order + flags
  const byId = new Map(chunks.map((c) => [c.id, c]));
  for (const c of chunks) if (c.kind === 'faq') c.chip = false;
  for (const id of chipOrder) {
    const c = byId.get(`faq:${id}`);
    if (!c) throw new Error(`chipOrder references a missing FAQ: ${id}`);
    c.chip = true;
  }
  // browse metadata: category, curated follow-ups
  for (const c of chunks) {
    if (c.kind !== 'faq') continue;
    const id = c.id.slice(4);
    c.category = categoryOf(id);
    c.browse = !hiddenFromBrowse(id);
    const next = NEXT[id];
    if (next) {
      for (const n of next) if (!byId.has(`faq:${n}`)) throw new Error(`NEXT[${id}] references a missing FAQ: ${n}`);
      c.next = next.map((n) => `faq:${n}`);
    }
  }
  for (const id of Object.keys(NEXT)) if (!byId.has(`faq:${id}`)) throw new Error(`NEXT has a key with no FAQ: ${id}`);
  const position = new Map(chunks.map((c, i) => [c.id, i]));
  const aliases = aliasTexts.map((a) => ({ chunk: position.get(a.id) as number, text: a.text }));
  return { chunks, aliases, techs: buildTechs() };
}


// ---- technology lookup ("Do you know Python?") ----
const CANON: [RegExp, string][] = [
  [/^(apache )?kafka$/, 'Kafka'],
  [/^java( 21)?$/, 'Java'],
  [/^(node|nodejs|node js)$/, 'Node.js'],
  [/^react native( expo)?$/, 'React Native'],
  [/^(postgres|postgresql)$/, 'PostgreSQL'],
  [/^rest( apis?)?$/, 'REST APIs'],
  [/^openai( api)?$/, 'OpenAI API'],
  [/^cpp( arduino)?$/, 'C++'],
  [/^spring( boot)?( 3 5)?$/, 'Spring Boot'],
  [/^(openai )?gpt 4o mini$/, 'gpt-4o-mini'],
  [/^structured outputs?$/, 'Structured outputs'],
  [/^(oop|object oriented (design|programming))$/, 'Object-oriented design'],
  [/^unit (testing|tests?)$/, 'Unit testing'],
  [/^distributed systems?$/, 'Distributed systems'],
  [/^data structures?$/, 'Data structures'],
  [/^(llms?|local llms?)$/, 'LLMs'],
  [/^(next|nextjs)$/, 'Next.js'],
  [/^aws( ec2| amplify)?$/, 'AWS'],
  [/^(selenium|selenium webdriver)$/, 'Selenium WebDriver'],
  [/^(express|express 5)$/, 'Express'],
  [/^react( 19)?( vite)?$/, 'React'],
  [/^rag$/, 'RAG'],
  [/^design patterns?$/, 'Design patterns'],
  [/^(mongo|mongodb)$/, 'MongoDB'],
  [/^(gpt 4o mini|gpt4o mini)$/, 'gpt-4o-mini'],
  [/^(bge small|bge small en v1 5|embeddings.*)$/, 'Embeddings'],
  [/^(chroma|chromadb)$/, 'ChromaDB'],
];
const EXTRA_ALIASES: Record<string, string[]> = {
  Kafka: ['kafka', 'apache kafka'],
  'Node.js': ['nodejs', 'node js', 'node'],
  PostgreSQL: ['postgres', 'postgresql', 'psql'],
  JavaScript: ['javascript', 'js'],
  TypeScript: ['typescript', 'ts'],
  'C++': ['cpp'],
  'CI/CD': ['cicd', 'ci cd'],
  'REST APIs': ['rest', 'rest api', 'rest apis', 'restful'],
  'OpenAI API': ['openai', 'open ai', 'openai api'],
  LLMs: ['llm', 'llms', 'large language model', 'large language models', 'local llm', 'local llms'],
  RAG: ['rag', 'retrieval augmented generation'],
  Embeddings: ['embedding', 'embeddings', 'sentence transformers', 'bge small', 'bge'],
  'Vector search': ['vector search', 'vector database', 'vector db'],
  ChromaDB: ['chromadb', 'chroma'],
  'Next.js': ['nextjs', 'next js'],
  React: ['react', 'reactjs'],
  Express: ['express', 'expressjs'],
  MongoDB: ['mongodb', 'mongo'],
  AWS: ['aws', 'amazon web services'],
  'Selenium WebDriver': ['selenium', 'webdriver', 'selenium webdriver'],
  'Spring Boot': ['spring boot', 'spring'],
  FastAPI: ['fastapi', 'fast api'],
  Android: ['android'],
  iOS: ['ios'],
  'Docker Compose': ['docker compose'],
  'GitHub Actions': ['github actions'],
  'Structured outputs': ['structured outputs', 'structured output'],
  'Unit testing': ['unit testing', 'unit tests', 'unit test'],
  'Object-oriented design': ['object oriented design', 'oop', 'object oriented programming'],
  'Data structures': ['data structures', 'data structure'],
  'Distributed systems': ['distributed systems', 'distributed system'],
};

function splitTechNames(raw: string): string[] {
  const m = /^(.*?)\s*\((.*)\)$/.exec(raw);
  let names: string[] = [];
  if (m) {
    names = [m[1], ...m[2].split(',').map((x) => x.trim())];
    if (/^(coursework|local llms)$/i.test(m[2].trim())) names = [m[1], ...(/local llms/i.test(m[2]) ? ['LLMs'] : [])];
  } else {
    names = [raw];
  }
  return names
    .flatMap((n) => n.split(/,| and /).map((x) => x.trim()))
    .filter((n) => n && !/^(coursework|local)$/i.test(n));
}

function canonical(name: string): string {
  const key = normalize(name);
  for (const [re, canon] of CANON) if (re.test(key)) return canon;
  return name.replace(/^Apache /, '');
}


const CONCEPTS: { name: string; aliases: string[]; members: string[] }[] = [
  { name: 'Cloud', aliases: ['cloud', 'cloud platform', 'cloud platforms', 'cloud computing'], members: ['AWS', 'Azure'] },
  { name: 'Databases', aliases: ['database', 'databases', 'sql database', 'nosql', 'data storage'], members: ['PostgreSQL', 'MongoDB', 'SQL', 'Redis'] },
  { name: 'Frontend', aliases: ['frontend', 'front end', 'web frontend', 'ui development'], members: ['React', 'Next.js', 'Redux', 'Vite', 'Streamlit'] },
  { name: 'Backend', aliases: ['backend', 'back end', 'server side'], members: ['Spring Boot', 'Node.js', 'Express', 'FastAPI', 'Kafka', 'Redis', 'PostgreSQL'] },
  { name: 'Testing', aliases: ['testing', 'test automation', 'automated testing', 'qa'], members: ['Selenium WebDriver', 'JUnit', 'Testcontainers', 'Unit testing'] },
  { name: 'Mobile development', aliases: ['mobile development', 'mobile apps', 'android development', 'ios development'], members: ['React Native', 'Android', 'iOS', 'Firebase'] },
];

function buildTechs(): AskTech[] {
  const byName = new Map<string, { name: string; category: string | null; aliases: Set<string>; usedIn: Map<string, Source> }>();
  const touch = (rawName: string, category: string | null) => {
    const name = canonical(rawName);
    const key = normalize(name);
    let entry = byName.get(key);
    if (!entry) {
      entry = { name, category, aliases: new Set(), usedIn: new Map() };
      byName.set(key, entry);
    }
    if (!entry.category && category) entry.category = category;
    entry.aliases.add(normalize(name));
    entry.aliases.add(normalize(rawName));
    const extra = Object.entries(EXTRA_ALIASES).find(([k]) => normalize(k) === normalize(name));
    for (const a of extra?.[1] ?? []) entry.aliases.add(normalize(a));
    return entry;
  };

  for (const s of skills) for (const item of s.items) for (const n of splitTechNames(item)) touch(n, s.category);

  const project = (title: string, href: string): Source => ({ label: title, href });
  for (const p of projects) {
    const src = project(p.title, p.caseStudySlug ? `/projects/${p.caseStudySlug}/` : '/#projects');
    for (const raw of p.stack) for (const n of splitTechNames(raw)) touch(n, null).usedIn.set(src.label, src);
  }
  for (const study of Object.values(caseStudies)) {
    const src = project(study.title, `/projects/${study.slug}/`);
    for (const raw of study.stack) for (const n of splitTechNames(raw)) touch(n, null).usedIn.set(src.label, src);
  }
  for (const x of experience) {
    const src = project(x.company, '/#experience');
    for (const raw of x.focus) for (const n of splitTechNames(raw)) touch(n, null).usedIn.set(src.label, src);
  }

  const real: AskTech[] = [...byName.values()].map((e) => ({
    name: e.name,
    category: e.category,
    aliases: [...e.aliases].filter((a) => a.length >= 2),
    usedIn: [...e.usedIn.values()],
  }));
  const concepts: AskTech[] = CONCEPTS.map((c) => {
    const members = c.members.map((m) => real.find((t) => normalize(t.name) === normalize(m))).filter((t): t is AskTech => !!t);
    if (members.length === 0) throw new Error(`No members found for concept ${c.name}`);
    const usedIn = new Map<string, Source>();
    for (const m of members) for (const u of m.usedIn) usedIn.set(u.label, u);
    return {
      name: c.name,
      category: members[0].category,
      aliases: c.aliases.map(normalize),
      usedIn: [...usedIn.values()],
      members: members.map((m) => m.name),
    };
  });
  return [...real, ...concepts].sort((a, b) => a.name.localeCompare(b.name));
}

type Extractor = (
  input: string[],
  opts: { pooling: 'cls'; normalize: boolean },
) => Promise<{ data: Float32Array; dims: number[] }>;

async function embed(texts: string[]): Promise<string> {
  const { pipeline } = await import('@huggingface/transformers');
  const extractor = (await pipeline('feature-extraction', MODEL, { dtype: 'q8' })) as unknown as Extractor;
  const out = new Int8Array(texts.length * DIMS);
  const batch = 8;
  for (let i = 0; i < texts.length; i += batch) {
    const slice = texts.slice(i, i + batch);
    const res = await extractor(slice, { pooling: 'cls', normalize: true });
    if (res.dims[1] !== DIMS) throw new Error(`Expected ${DIMS} dimensions, got ${res.dims[1]}`);
    for (let r = 0; r < slice.length; r++) {
      for (let d = 0; d < DIMS; d++) {
        out[(i + r) * DIMS + d] = Math.max(-127, Math.min(127, Math.round(res.data[r * DIMS + d] * 127)));
      }
    }
  }
  return Buffer.from(out.buffer).toString('base64');
}

async function main() {
  const { chunks, aliases, techs } = buildChunks();
  const hash = createHash('sha256')
    .update(JSON.stringify({ VERSION, MODEL, chunks, aliases, techs }))
    .digest('hex')
    .slice(0, 16);

  if (existsSync(OUT)) {
    try {
      const existing = JSON.parse(readFileSync(OUT, 'utf8')) as AskIndex;
      if (existing.hash === hash && existing.embeddings) {
        console.log(`[ask] index is up to date (${chunks.length} chunks, ${hash}); skipping`);
        return;
      }
    } catch {
      // rebuild
    }
  }

  let embeddings: string | null = null;
  try {
    // Chunks are embedded as passages; aliases are embedded as plain questions (no instruction prefix)
    const inputs = [
      ...chunks.map((c) => (c.kind === 'faq' ? c.text : `${c.title}. ${c.text}`)),
      ...aliases.map((a) => a.text),
    ];
    const t0 = Date.now();
    embeddings = await embed(inputs);
    console.log(`[ask] embedded ${chunks.length} chunks and ${aliases.length} aliases in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  } catch (error) {
    if (process.env.ASK_REQUIRE_EMBEDDINGS === '1') throw error;
    console.warn(`[ask] WARNING: could not create embeddings, search will be keyword-only. ${(error as Error).message}`);
  }

  const index: AskIndex = {
    version: VERSION,
    model: MODEL,
    dims: DIMS,
    hash,
    meta: { email: links.email, resumeHref: links.resume, linkedin: links.linkedin, github: links.github },
    chips: chipOrder.map((id) => `faq:${id}`),
    categories: CATEGORY_ORDER,
    chunks,
    techs,
    aliases,
    embeddings,
  };
  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(index));
  const kb = (Buffer.byteLength(JSON.stringify(index)) / 1024).toFixed(0);
  console.log(`[ask] wrote ${path.relative(process.cwd(), OUT)}: ${chunks.length} chunks, ${aliases.length} aliases, ${techs.length} technologies, ${kb} KB, embeddings ${embeddings ? 'yes' : 'NO'}`);
}

main().catch((error) => {
  console.error('[ask] failed:', error);
  process.exit(1);
});
