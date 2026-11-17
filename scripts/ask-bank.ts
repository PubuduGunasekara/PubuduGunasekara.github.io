// The question bank for the "Ask about me" panel.
//
// Almost every answer here is taken word for word from text that already exists on the site (the case
// studies, project cards and experience entries), selected by heading, so nothing is invented and the
// answers cannot drift from the pages they quote. If a heading is renamed, the build fails loudly.

import { caseStudies } from '../lib/caseStudies';
import type { ClassicCaseStudy, SectionedCaseStudy } from '../lib/caseStudies';
import {
  experience,
  highlightProjects,
  highlightWork,
  leadership,
  projects,
  resumeMatchConfig,
  skills,
} from '../lib/content';
import { slugify } from '../lib/ask/slug';
import type { Source } from '../lib/ask/types';

export type BankFaq = {
  id: string;
  question: string;
  variants: string[];
  answer: string[];
  sources: Source[];
};

const classic = (slug: string): ClassicCaseStudy => {
  const c = caseStudies[slug];
  if (!c || c.kind === 'sectioned') throw new Error(`Case study ${slug} is missing or not a classic one`);
  return c;
};
const sectioned = (slug: string): SectionedCaseStudy => {
  const c = caseStudies[slug];
  if (!c || c.kind !== 'sectioned') throw new Error(`Case study ${slug} is missing or not a sectioned one`);
  return c;
};
const pick = <T extends { title: string }>(list: T[], startsWith: string, where: string): T => {
  const found = list.find((x) => x.title.startsWith(startsWith));
  if (!found) throw new Error(`Could not find "${startsWith}" in ${where}`);
  return found;
};
const section = (c: SectionedCaseStudy, heading: string) => {
  const s = c.sections.find((x) => x.heading === heading);
  if (!s) throw new Error(`Could not find section "${heading}" in ${c.slug}`);
  return s;
};
const para = (s: { paragraphs?: string[]; heading: string }, pattern: RegExp): string => {
  const found = (s.paragraphs ?? []).find((p) => pattern.test(p));
  if (!found) throw new Error(`Could not find a paragraph matching ${pattern} in ${s.heading}`);
  return found;
};
const bulletWith = (bullets: string[], pattern: RegExp, where: string): string => {
  const found = bullets.find((b) => pattern.test(b));
  if (!found) throw new Error(`Could not find a line matching ${pattern} in ${where}`);
  return found;
};
const scenario = (f: { title: string; body: string }) => `${f.title.replace(/[.]$/, '')}. ${f.body}`;
const at = (c: { slug: string }, heading: string, label: string): Source => ({
  label,
  href: `/projects/${c.slug}/#${slugify(heading)}`,
});

export function buildBank(): BankFaq[] {
  const bank: BankFaq[] = [];
  const add = (f: BankFaq) => bank.push(f);

  // ----------------------------------------------------------------------------- ResumeMatch
  const rm = sectioned('resumematch');
  const problem = section(rm, 'Problem');
  const approach = section(rm, 'Approach');
  const measured = section(rm, 'What I measured');
  const rmTitle = 'ResumeMatch case study';

  add({
    id: 'rm-how-it-works',
    question: 'How does ResumeMatch work, step by step?',
    variants: ['ResumeMatch pipeline', 'What are the steps in ResumeMatch', 'Walk me through ResumeMatch', 'Architecture of ResumeMatch', 'How does your RAG pipeline work', 'What are the steps in your RAG pipeline'],
    answer: [
      para(approach, /model only proposes/),
      `The steps are: ${(approach.bullets ?? []).map((b) => b.replace(/\.$/, '')).join('; ')}.`,
    ],
    sources: [at(rm, 'Approach', 'Approach, with the pipeline diagram')],
  });
  add({
    id: 'rm-verification',
    question: 'How does ResumeMatch check what the model says?',
    variants: ['How do you stop the model making things up in ResumeMatch', 'Claim verification', 'How do you validate LLM output', 'Do you trust the LLM output', 'What does the code check', 'How do you verify the model claims'],
    answer: [para(approach, /model only proposes/)],
    sources: [at(rm, 'Approach', rmTitle)],
  });
  add({
    id: 'rm-measured',
    question: 'What did you measure in ResumeMatch?',
    variants: ['ResumeMatch results', 'ResumeMatch metrics', 'ResumeMatch benchmarks', 'ResumeMatch numbers', 'What are the results of your RAG system'],
    answer: [...(measured.paragraphs ?? []), ...(measured.bullets ?? [])],
    sources: [at(rm, 'What I measured', 'What I measured')],
  });
  add({
    id: 'rm-speed',
    question: 'How fast is ResumeMatch?',
    variants: ['ResumeMatch speed', 'How long does ResumeMatch take per resume', 'ResumeMatch latency', 'Is ResumeMatch fast', 'Where does the time go in ResumeMatch'],
    answer: (measured.bullets ?? []).slice(0, 2),
    sources: [at(rm, 'What I measured', 'What I measured')],
  });
  add({
    id: 'rm-retrieval',
    question: 'How good is the search in ResumeMatch?',
    variants: ['ResumeMatch recall', 'Retrieval quality of ResumeMatch', 'How accurate is the vector search', 'Recall at 30', 'Did you tune the vector index', 'How well does typo correction work'],
    answer: (measured.bullets ?? []).filter((b) => /^(Vector search|Typo correction|Chunk cleanup)/.test(b)),
    sources: [at(rm, 'What I measured', 'What I measured')],
  });
  add({
    id: 'rm-local',
    question: 'Why does ResumeMatch run locally?',
    variants: ['Does ResumeMatch send my resume anywhere', 'Is ResumeMatch private', 'Does ResumeMatch use the OpenAI API', 'Do I need an API key for ResumeMatch', 'Privacy of ResumeMatch', 'Which models does ResumeMatch use'],
    answer: [para(problem, /runs fully on one machine/)],
    sources: [at(rm, 'Problem', rmTitle)],
  });
  add({
    id: 'rm-data',
    question: 'What data does ResumeMatch search?',
    variants: ['Where do the job postings come from', 'ResumeMatch dataset', 'How many job postings does ResumeMatch search', 'What is the dataset', 'LinkedIn postings data', 'How did you clean the data'],
    answer: [para(problem, /107,528 real LinkedIn/)],
    sources: [at(rm, 'Problem', rmTitle)],
  });
  add({
    id: 'rm-origin',
    question: 'Was ResumeMatch a class project?',
    variants: ['Did you build ResumeMatch alone', 'Did you use Claude Code for ResumeMatch', 'Did AI help you build ResumeMatch', 'Did you use AI tools to build it', 'CS6120 project', 'Is ResumeMatch your own work', 'Who built ResumeMatch'],
    answer: [para(problem, /started in Fall 2026/)],
    sources: [at(rm, 'Problem', rmTitle)],
  });
  add({
    id: 'rm-demo',
    question: 'Is there a demo of ResumeMatch?',
    variants: ['ResumeMatch live demo', 'Can I try ResumeMatch', 'ResumeMatch video', 'Where can I see ResumeMatch running', 'Is ResumeMatch hosted', 'Can I try it myself'],
    answer: resumeMatchConfig.liveDemoUrl
      ? ['There is a live demo of ResumeMatch, linked below.']
      : [
          'There is no hosted demo, because ResumeMatch runs on your own machine so that a resume never leaves it. The case study shows screenshots of the app (run on synthetic test resumes) and the pipeline diagram, the code is on GitHub, and you can run it yourself.',
        ],
    sources: [
      at(rm, 'Problem', rmTitle),
      { label: 'Code on GitHub', href: rm.repo },
      ...(resumeMatchConfig.liveDemoUrl ? [{ label: 'Live demo', href: resumeMatchConfig.liveDemoUrl }] : []),
    ],
  });

  const whatItDoes = section(rm, 'What it does');
  const beyond = section(rm, 'Beyond the match');
  const security = section(rm, 'Privacy and security');
  const feature = (prefix: string) => bulletWith(beyond.bullets ?? [], new RegExp(`^${prefix}`), 'ResumeMatch Beyond the match');

  add({
    id: 'rm-features',
    question: 'What can ResumeMatch do beyond matching a resume?',
    variants: ['ResumeMatch features', 'What features does ResumeMatch have', 'Is ResumeMatch a web app', 'Who is ResumeMatch for', 'Does ResumeMatch have a website', 'What does the ResumeMatch site include', 'Does ResumeMatch have a frontend'],
    answer: [...(whatItDoes.paragraphs ?? []), ...(whatItDoes.bullets ?? [])],
    sources: [at(rm, 'What it does', 'What it does, with a screenshot'), at(rm, 'Beyond the match', 'Features in detail')],
  });
  add({
    id: 'rm-recruiter',
    question: 'Does ResumeMatch have a recruiter mode?',
    variants: ['Blind review in ResumeMatch', 'Can ResumeMatch rank candidates', 'How does ResumeMatch rank resumes for a job', 'Bias in ranking resumes', 'Anonymous resume screening', 'How does blind review work'],
    answer: [feature('Recruiter mode')],
    sources: [at(rm, 'Beyond the match', 'Recruiter mode, with a screenshot')],
  });
  add({
    id: 'rm-tailoring',
    question: 'Can ResumeMatch rewrite a resume or write a cover letter?',
    variants: ['ResumeMatch tailoring', 'Interview prep in ResumeMatch', 'How do you stop the model inventing facts in a cover letter', 'Cover letter generation', 'Resume bullet rewrites', 'Does it write interview questions'],
    answer: [feature('Tailoring'), feature('Interview prep')],
    sources: [at(rm, 'Beyond the match', 'Tailoring and interview prep, with a screenshot')],
  });
  add({
    id: 'rm-role-report',
    question: 'What is the role report in ResumeMatch?',
    variants: ['What do postings for a job title ask for', 'Search filters in ResumeMatch', 'Explore a role', 'Salary and remote filters', 'Does ResumeMatch need a hand-made skill list'],
    answer: [feature('Role report'), feature('Search filters')],
    sources: [at(rm, 'Beyond the match', 'Features in detail')],
  });
  add({
    id: 'rm-security',
    question: 'How does ResumeMatch handle privacy and sign-in?',
    variants: ['ResumeMatch security', 'Are uploaded resumes stored', 'ResumeMatch authentication and roles', 'Is my resume deleted after upload', 'Is telemetry on in ResumeMatch', 'How does sign-in work in ResumeMatch'],
    answer: security.bullets ?? [],
    sources: [at(rm, 'Privacy and security', 'Privacy and security')],
  });
  add({
    id: 'rm-tests',
    question: 'How is ResumeMatch tested?',
    variants: ['ResumeMatch test coverage', 'How many tests does ResumeMatch have', 'ResumeMatch CI', 'Did you audit the claim checks', 'How do you know the claim checks work', 'Are the ResumeMatch tests fast'],
    answer: [bulletWith(measured.bullets ?? [], /^Tests:/, 'ResumeMatch measured'), bulletWith(measured.bullets ?? [], /^Claim audit:/, 'ResumeMatch measured')],
    sources: [at(rm, 'What I measured', 'What I measured')],
  });
  add({
    id: 'rm-run-it',
    question: 'How do I run ResumeMatch myself?',
    variants: ['How do I install ResumeMatch', 'ResumeMatch quick start', 'Can I run ResumeMatch locally', 'What do I need to run ResumeMatch', 'Setup instructions for ResumeMatch', 'Is there a sample index'],
    answer: [
      'You need Python 3.11 or 3.12 and Ollama. The fastest path uses a prebuilt sample index of 2,000 postings (37 MB), so no Kaggle account or dataset download is needed. On a fresh clone on my M3 Pro this reached its first result in about 2.5 minutes, not counting the one-time 2 GB model download.',
      'Or run everything in Docker with docker-compose.local.yml. The README has the steps and the demo accounts, and the repository includes 20 synthetic test resumes.',
    ],
    sources: [{ label: 'Quick start in the README', href: `${rm.repo}#try-it` }],
  });

  // ----------------------------------------------------------------------------- Task Scheduler
  const ts = classic('task-scheduler');
  const tsDecision = (t: string) => pick(ts.keyDecisions, t, 'task-scheduler keyDecisions');
  const tsFailure = (t: string) => pick(ts.failureScenarios, t, 'task-scheduler failureScenarios');
  const tsWhy = (t: string) => pick(ts.whyComponents ?? [], t, 'task-scheduler whyComponents');
  const tsTitle = 'Task Scheduler case study';

  add({
    id: 'ts-duplicates',
    question: 'How does the scheduler stop duplicate execution?',
    variants: ['How do you prevent a job running twice', 'At-least-once versus exactly-once in your scheduler', 'Kafka redelivery handling', 'Redis lock and state machine', 'Idempotency in the task scheduler', 'How do you handle duplicate Kafka messages'],
    answer: [tsDecision('Duplicate execution').body],
    sources: [at(ts, 'Key engineering decisions', tsTitle)],
  });
  add({
    id: 'ts-retries',
    question: 'How do retries and the dead-letter queue work?',
    variants: ['Retry backoff in the scheduler', 'What happens when a task fails', 'Dead letter topic', 'Exponential backoff', 'How many retries does a task get', 'What happens after the third retry'],
    answer: [tsDecision('Backoff instead of hammering').body],
    sources: [at(ts, 'Key engineering decisions', tsTitle)],
  });
  add({
    id: 'ts-recovery',
    question: 'What happens if a worker crashes?',
    variants: ['Crash recovery in the scheduler', 'Stuck tasks', 'What if a worker dies mid-task', 'Recovery sweep', 'How do you recover stuck jobs', 'How do you recover from a worker crash'],
    answer: [tsDecision('Recovering from a crashed worker').body],
    sources: [at(ts, 'Key engineering decisions', tsTitle)],
  });
  add({
    id: 'ts-architecture',
    question: 'How is the Task Scheduler organized?',
    variants: ['Hexagonal architecture', 'Is the scheduler microservices or a monolith', 'ArchUnit', 'Modular monolith', 'How do workers scale', 'Is the scheduler a microservice'],
    answer: [tsDecision('The build enforces the architecture boundary').body, ts.architectureNote[1]],
    sources: [at(ts, 'Architecture', tsTitle)],
  });
  for (const [id, title, question, variants] of [
    ['ts-why-kafka', 'Kafka', 'Why did you use Kafka in the scheduler?', ['Why Kafka', 'What does Kafka do in your project', 'Kafka versus a database queue', 'Why did you pick Kafka for the scheduler']],
    ['ts-why-redis', 'Redis', 'Why did you use Redis in the scheduler?', ['Why Redis', 'What is Redis used for in the scheduler', 'Redis lock', 'Why not store task state in Redis']],
    ['ts-why-postgres', 'PostgreSQL', 'Why did you use PostgreSQL in the scheduler?', ['Why PostgreSQL', 'Where is task state stored', 'Optimistic locking with Version', 'What does the state machine protect']],
    ['ts-why-monolith', 'Modular monolith', 'Why one service instead of microservices?', ['Why a modular monolith', 'Why not microservices', 'How do workers scale without separate services']],
  ] as [string, string, string, string[]][]) {
    add({ id, question, variants, answer: [tsWhy(title).body], sources: [at(ts, 'Why these components', tsTitle)] });
  }
  add({
    id: 'ts-failure-redelivery',
    question: 'What if two workers get the same event?',
    variants: ['Two workers, same message', 'Concurrent consumers', 'Race condition in the scheduler', 'What if the lock expires'],
    answer: [scenario(tsFailure('Two workers consume'))],
    sources: [at(ts, 'Failure scenarios and trade-offs', tsTitle)],
  });
  add({
    id: 'ts-failure-long-task',
    question: 'What if a task runs longer than the timeout?',
    variants: ['Long running tasks', 'Recovery timeout versus lock TTL', 'Lease renewal and fencing tokens', 'Can a task run twice'],
    answer: [scenario(tsFailure('A worker crashes while legitimately'))],
    sources: [at(ts, 'Failure scenarios and trade-offs', tsTitle)],
  });
  add({
    id: 'ts-failure-exhausted',
    question: 'What happens when retries run out?',
    variants: ['Dead letter', 'Exhausted retries', 'Where do failed tasks go', 'What is DEAD_LETTER'],
    answer: [scenario(tsFailure('Retries are exhausted'))],
    sources: [at(ts, 'Failure scenarios and trade-offs', tsTitle)],
  });
  add({
    id: 'ts-limits',
    question: 'What are the limits of the Task Scheduler?',
    variants: ['Weaknesses of the scheduler', 'Known limitations of the scheduler', 'What would you improve in the scheduler', 'Future work on the scheduler', 'What are the trade-offs in the scheduler'],
    answer: ts.limitations,
    sources: [at(ts, 'Known limitations and next steps', 'Known limitations')],
  });
  add({
    id: 'ts-observability',
    question: 'How do you monitor the scheduler?',
    variants: ['Prometheus and Grafana in the scheduler', 'Metrics', 'Observability', 'Dashboards'],
    answer: ts.observability,
    sources: [at(ts, 'Observability', tsTitle)],
  });
  add({
    id: 'ts-deploy',
    question: 'How is the Task Scheduler built and deployed?',
    variants: ['Docker Compose', 'CI pipeline for the scheduler', 'GitHub Actions for the scheduler', 'Is the scheduler deployed', 'Is the scheduler in production'],
    answer: [...ts.deployment, 'It runs in a local Docker Compose stack and is not deployed anywhere.'],
    sources: [at(ts, 'Deployment and CI', tsTitle)],
  });
  add({
    id: 'ts-tests',
    question: 'How is the Task Scheduler tested?',
    variants: ['How many tests does the scheduler have', 'Scheduler test coverage', 'Does the scheduler have integration tests', 'What is the code coverage of the scheduler', 'Scheduler testing strategy', 'Does the scheduler run against a real database in tests'],
    answer: ts.testing,
    sources: [at(ts, 'Testing', 'Testing')],
  });
  add({
    id: 'ts-load-test',
    question: 'How did you load test the scheduler?',
    variants: ['Throughput of the scheduler', 'Tasks per minute', 'Performance test', 'How many tasks per minute can it process', 'How fast is the task scheduler'],
    answer: [bulletWith(ts.testing, /load test/i, 'task-scheduler testing')],
    sources: [at(ts, 'Testing', 'Testing')],
  });

  // ----------------------------------------------------------------------------- AI Code Review Assistant
  const acr = classic('ai-code-reviewer');
  const acrDecision = (t: string) => pick(acr.keyDecisions, t, 'ai-code-reviewer keyDecisions');
  const acrFailure = (t: string) => pick(acr.failureScenarios, t, 'ai-code-reviewer failureScenarios');
  const acrTitle = 'AI Code Review case study';

  add({
    id: 'acr-oauth',
    question: 'How does sign-in work in the AI Code Review Assistant?',
    variants: ['GitHub OAuth', 'How do you pick a pull request', 'Sessions in the code reviewer', 'Authentication in your reviewer app'],
    answer: [acrDecision('GitHub OAuth').body],
    sources: [at(acr, 'Key engineering decisions', acrTitle)],
  });
  add({
    id: 'acr-large-diffs',
    question: 'What happens with very large pull requests?',
    variants: ['Diff truncation', 'Context window limit', 'Big pull requests', 'What if the diff is too large'],
    answer: [acrDecision('Large diffs').body],
    sources: [at(acr, 'Key engineering decisions', acrTitle)],
  });
  add({
    id: 'acr-schema',
    question: 'How do you validate the model output in the code reviewer?',
    variants: ['JSON schema and structured outputs', 'What if the model returns bad JSON', 'Structured Outputs strict mode', 'Model refusal handling', 'How do you validate JSON from the model in the reviewer'],
    answer: [acrDecision('A strict schema').body],
    sources: [at(acr, 'Key engineering decisions', acrTitle)],
  });
  add({
    id: 'acr-ratelimit-cache',
    question: 'How do rate limiting and caching work in the code reviewer?',
    variants: ['Redis rate limit Lua script', 'Cache key', 'Fail open', 'How do you control OpenAI costs', 'How do you keep OpenAI costs down'],
    answer: [acrDecision('Rate limiting that is atomic').body],
    sources: [at(acr, 'Key engineering decisions', acrTitle)],
  });
  add({
    id: 'acr-failure-validation',
    question: 'What if the model refuses or returns invalid output?',
    variants: ['Bad model output', 'Invalid response format', 'Out of range score', 'Model returns the wrong shape'],
    answer: [scenario(acrFailure('The model refuses')), scenario(acrFailure('The model returns the right shape'))],
    sources: [at(acr, 'Failure scenarios and trade-offs', acrTitle)],
  });
  add({
    id: 'acr-failure-transient',
    question: 'What if OpenAI is rate limited or down?',
    variants: ['OpenAI errors', 'Transient failure', 'Network error during a review', 'Can the user retry a review'],
    answer: [scenario(acrFailure('A transient failure'))],
    sources: [at(acr, 'Failure scenarios and trade-offs', acrTitle)],
  });
  add({
    id: 'acr-failure-redis',
    question: 'What if Redis goes down in the code reviewer?',
    variants: ['Redis outage', 'Fail open versus fail closed', 'What happens without the cache'],
    answer: [scenario(acrFailure('Redis is briefly unavailable'))],
    sources: [at(acr, 'Failure scenarios and trade-offs', acrTitle)],
  });
  add({
    id: 'acr-failure-concurrency',
    question: 'What if two requests process the same review?',
    variants: ['Double processing', 'Concurrent review requests', 'Race condition in the reviewer', 'What if the review request is sent twice'],
    answer: [scenario(acrFailure('Two requests to process'))],
    sources: [at(acr, 'Failure scenarios and trade-offs', acrTitle)],
  });
  add({
    id: 'acr-limits',
    question: 'What are the limits of the AI Code Review Assistant?',
    variants: ['Weaknesses of the code reviewer', 'Known limitations of the reviewer', 'What would you improve in the reviewer', 'Future work on the code reviewer'],
    answer: acr.limitations,
    sources: [at(acr, 'Known limitations and next steps', 'Known limitations')],
  });
  add({
    id: 'acr-testing',
    question: 'How is the AI Code Review Assistant tested?',
    variants: ['Code reviewer tests', 'CI for the reviewer', 'Do you mock OpenAI in tests', 'How many tests does the reviewer have'],
    answer: acr.testing,
    sources: [at(acr, 'Testing', 'Testing')],
  });
  const reviewer = projects.find((p) => p.title === 'AI Code Review Assistant');
  if (!reviewer) throw new Error('AI Code Review Assistant project not found');
  add({
    id: 'acr-cost',
    question: 'How much does a review cost, and how long does it take?',
    variants: ['Latency and cost of the code reviewer', 'Review cost', 'Review speed', 'Price per review', 'How much does a review cost with the code reviewer'],
    answer: [
      bulletWith(reviewer.highlights ?? [], /5 test reviews/i, 'AI Code Review Assistant highlights'),
      'That is latency and cost only, not a measure of review quality.',
    ],
    sources: [at(acr, 'Testing', 'Testing')],
  });

  // ----------------------------------------------------------------------------- Experience and projects
  const virtusa = experience.find((e) => e.company === 'Virtusa');
  if (!virtusa?.reflection) throw new Error('Virtusa reflection is missing');
  add({
    id: 'virtusa-impact',
    question: 'How did Virtusa shape your projects?',
    variants: ['What did you learn at Virtusa', 'Why do you focus on failure handling', 'How does QA experience help you as an engineer', 'How did your QA job influence your engineering'],
    answer: [virtusa.reflection],
    sources: [{ label: 'Experience', href: '/#experience' }, { label: 'Task Scheduler case study', href: '/projects/task-scheduler/' }],
  });
  add({
    id: 'virtusa-sprints',
    question: 'How productive were you at Virtusa?',
    variants: ['Tickets per sprint', 'Did you finish work early at Virtusa', 'Agile experience at Virtusa', 'How did you work in sprints'],
    answer: [`At Virtusa: ${virtusa.bullets[1].charAt(0).toLowerCase()}${virtusa.bullets[1].slice(1)}`],
    sources: [{ label: 'Experience', href: '/#experience' }],
  });
  const farm = projects.find((p) => p.title === 'IoT Smart Farm System');
  const farmLead = leadership.find((l) => /Smart Farm/.test(l.title));
  if (!farm || !farmLead) throw new Error('Smart Farm entries not found');
  add({
    id: 'smart-farm-role',
    question: 'What was your role in Smart Farm?',
    variants: ['Did you lead the Smart Farm team', 'What did you build in Smart Farm', 'Team lead experience', 'What was your role on the farm project'],
    answer: [`${farm.body.split('. ')[0]}.`, `${farmLead.title}: ${farmLead.meta}.`],
    sources: [{ label: 'Leadership', href: '/#leadership' }, { label: 'Code on GitHub', href: farm.href }],
  });

  // ----------------------------------------------------------------------------- Skills by area
  const skillQuestion: Record<string, string> = {
    Languages: 'What programming languages do you know?',
    Backend: 'What backend technologies do you know?',
    'AI & RAG': 'What AI and RAG skills do you have?',
    'Infra & Testing': 'What infrastructure, cloud and testing tools do you use?',
    'Frontend & Mobile': 'What frontend and mobile skills do you have?',
    Fundamentals: 'What computer science fundamentals do you know?',
  };
  for (const s of skills) {
    add({
      id: `skills-${slugify(s.category)}`,
      question: skillQuestion[s.category] ?? `What ${s.category} skills do you have?`,
      variants: [`${s.category} skills`, `Tell me about your ${s.category.toLowerCase()} skills`, `${s.category} technologies`],
      answer: [`${s.category}: ${s.items.join(', ')}.`, s.context],
      sources: [{ label: 'Skills', href: '/#skills' }],
    });
  }

  // ----------------------------------------------------------------------------- About me, the site, this chat
  add({
    id: 'learned',
    question: 'What did you learn from your projects?',
    variants: ['Lessons learned', 'What have you taken away from your work', 'What are your key takeaways', 'What did you take away from your projects'],
    answer: [...highlightProjects, highlightWork].map((t) => `${t.title}: ${t.learned}`),
    sources: [{ label: 'The short version', href: '/#highlights' }],
  });
  add({
    id: 'handle-failure',
    question: 'How do you design for failure?',
    variants: ['How do you handle failure in your systems', 'What is your approach to reliability', 'Reliability engineering experience', 'Fault tolerance experience', 'How do you build reliable systems'],
    answer: [
      virtusa.reflection,
      'In the Task Scheduler that means retries with backoff, a dead-letter queue and a recovery job for stuck tasks. In ResumeMatch and the AI Code Review Assistant it means treating model output as untrusted and failing loudly when it is wrong.',
    ],
    sources: [{ label: 'Task Scheduler case study', href: '/projects/task-scheduler/' }, { label: 'ResumeMatch case study', href: '/projects/resumematch/' }],
  });
  add({
    id: 'how-chat-works',
    question: 'How does this chat work?',
    variants: ['Is this chatbot an AI', 'Are you an AI', 'Is this ChatGPT', 'How does the Ask panel work', 'How do you correct typos', 'Does this send my questions anywhere', 'Are you a chatbot'],
    answer: [
      'This is not a generative AI. It searches the content of this site in your browser and shows my own words, so it cannot make anything up.',
      'It combines keyword search with embeddings (a small model that runs in your browser), matches your question against dozens of prepared questions, and corrects typos using only words that appear on this site. If it has no good answer it says so and suggests questions instead.',
      'Your questions never leave your browser.',
    ],
    sources: [{ label: 'Source on GitHub', href: 'https://github.com/PubuduGunasekara/PubuduGunasekara.github.io' }],
  });
  add({
    id: 'this-site',
    question: 'How was this site built?',
    variants: ['What tech does your portfolio use', 'Is the portfolio open source', 'Portfolio source code', 'What is the site built with', 'What was this website made with'],
    answer: ['This site is built with Next.js and TypeScript, styled with Tailwind CSS, and hosted on GitHub Pages as a static site. The source is on GitHub.'],
    sources: [{ label: 'Source on GitHub', href: 'https://github.com/PubuduGunasekara/PubuduGunasekara.github.io' }],
  });

  return bank;
}

// Curated follow-up questions, shown first after an answer.
export const NEXT: Record<string, string[]> = {
  'who-are-you': ['strongest-project', 'looking-for', 'virtusa'],
  'looking-for': ['relocation', 'resume', 'contact'],
  relocation: ['looking-for', 'contact', 'who-are-you'],
  'strongest-project': ['resumematch', 'task-scheduler', 'ai-code-reviewer'],
  resumematch: ['rm-features', 'rm-how-it-works', 'what-failed', 'rm-measured'],
  'rm-features': ['rm-recruiter', 'rm-tailoring', 'rm-role-report', 'rm-security'],
  'rm-recruiter': ['rm-security', 'rm-features', 'rm-verification'],
  'rm-tailoring': ['rm-verification', 'rm-recruiter', 'rm-features'],
  'rm-role-report': ['rm-features', 'rm-data', 'rm-recruiter'],
  'rm-security': ['rm-local', 'rm-recruiter', 'rm-features'],
  'rm-tests': ['rm-measured', 'rm-verification', 'testing'],
  'rm-run-it': ['rm-demo', 'rm-tests', 'rm-local'],
  'what-failed': ['rm-verification', 'resumematch-limits', 'rm-measured'],
  'resumematch-limits': ['rm-measured', 'rm-demo', 'what-failed'],
  'rm-how-it-works': ['rm-verification', 'rm-retrieval', 'rm-local'],
  'rm-verification': ['what-failed', 'rm-measured', 'rm-how-it-works'],
  'rm-measured': ['rm-speed', 'rm-retrieval', 'resumematch-limits'],
  'rm-speed': ['rm-measured', 'rm-local', 'rm-how-it-works'],
  'rm-retrieval': ['rm-measured', 'rm-data', 'rm-how-it-works'],
  'rm-local': ['rm-security', 'rm-data', 'rm-demo'],
  'rm-data': ['rm-how-it-works', 'rm-retrieval', 'rm-local'],
  'rm-origin': ['rm-local', 'resumematch', 'how-chat-works'],
  'rm-demo': ['rm-run-it', 'rm-local', 'rm-how-it-works'],
  'task-scheduler': ['ts-duplicates', 'ts-retries', 'ts-recovery', 'ts-limits'],
  'ts-duplicates': ['ts-failure-redelivery', 'ts-why-redis', 'ts-retries'],
  'ts-retries': ['ts-failure-exhausted', 'ts-recovery', 'ts-duplicates'],
  'ts-recovery': ['ts-failure-long-task', 'ts-retries', 'ts-limits'],
  'ts-architecture': ['ts-why-monolith', 'ts-why-kafka', 'ts-deploy'],
  'ts-why-kafka': ['ts-duplicates', 'ts-why-redis', 'ts-why-postgres'],
  'ts-why-redis': ['ts-why-postgres', 'ts-duplicates', 'ts-why-kafka'],
  'ts-why-postgres': ['ts-why-redis', 'ts-duplicates', 'ts-architecture'],
  'ts-why-monolith': ['ts-architecture', 'ts-deploy', 'ts-why-kafka'],
  'ts-failure-redelivery': ['ts-duplicates', 'ts-failure-long-task', 'ts-why-redis'],
  'ts-failure-long-task': ['ts-limits', 'ts-recovery', 'ts-failure-redelivery'],
  'ts-failure-exhausted': ['ts-retries', 'ts-recovery', 'ts-limits'],
  'ts-limits': ['ts-failure-long-task', 'ts-load-test', 'ts-observability'],
  'ts-observability': ['ts-deploy', 'ts-load-test', 'ts-limits'],
  'ts-deploy': ['ts-observability', 'ts-architecture', 'ts-load-test'],
  'ts-load-test': ['ts-tests', 'ts-observability', 'ts-limits'],
  'ts-tests': ['ts-load-test', 'testing', 'ts-observability'],
  'ai-code-reviewer': ['acr-schema', 'acr-ratelimit-cache', 'acr-cost', 'acr-limits'],
  'acr-oauth': ['acr-schema', 'acr-large-diffs', 'acr-cost'],
  'acr-large-diffs': ['acr-schema', 'acr-cost', 'acr-limits'],
  'acr-schema': ['acr-failure-validation', 'acr-ratelimit-cache', 'acr-testing'],
  'acr-ratelimit-cache': ['acr-failure-redis', 'acr-cost', 'acr-schema'],
  'acr-failure-validation': ['acr-schema', 'acr-failure-transient', 'acr-testing'],
  'acr-failure-transient': ['acr-failure-redis', 'acr-failure-validation', 'acr-limits'],
  'acr-failure-redis': ['acr-ratelimit-cache', 'acr-failure-concurrency', 'acr-limits'],
  'acr-failure-concurrency': ['acr-limits', 'acr-failure-redis', 'acr-testing'],
  'acr-limits': ['acr-failure-concurrency', 'acr-testing', 'acr-cost'],
  'acr-testing': ['acr-schema', 'acr-limits', 'testing'],
  'acr-cost': ['acr-ratelimit-cache', 'acr-large-diffs', 'acr-limits'],
  'smart-farm': ['smart-farm-role', 'leadership', 'awards'],
  'smart-farm-role': ['leadership', 'awards', 'smart-farm'],
  'multi-user-blog': ['testing', 'strongest-project', 'skills-backend'],
  virtusa: ['virtusa-tools', 'virtusa-impact', 'virtusa-sprints', 'work-history'],
  'virtusa-tools': ['virtusa', 'virtusa-sprints', 'skills-infra-testing'],
  'virtusa-impact': ['handle-failure', 'task-scheduler', 'virtusa'],
  'virtusa-sprints': ['virtusa', 'virtusa-tools', 'work-history'],
  'virtusa-details': ['virtusa', 'virtusa-tools', 'work-history'],
  'work-history': ['virtusa', 'hospitality', 'virtusa-tools'],
  hospitality: ['work-history', 'virtusa', 'who-are-you'],
  'ai-rag-experience': ['resumematch', 'ai-code-reviewer', 'skills-ai-rag', 'courses'],
  'skills-overview': ['skills-languages', 'skills-backend', 'skills-ai-rag', 'skills-infra-testing'],
  'skills-languages': ['skills-backend', 'skills-ai-rag', 'skills-overview'],
  'skills-backend': ['skills-infra-testing', 'skills-ai-rag', 'task-scheduler'],
  'skills-ai-rag': ['ai-rag-experience', 'resumematch', 'skills-backend'],
  'skills-infra-testing': ['testing', 'skills-backend', 'certifications'],
  'skills-frontend-mobile': ['skills-languages', 'smart-farm', 'skills-backend'],
  'skills-fundamentals': ['skills-languages', 'courses', 'task-scheduler'],
  testing: ['ts-load-test', 'acr-testing', 'virtusa'],
  gpa: ['courses', 'graduation', 'education'],
  courses: ['gpa', 'graduation', 'northeastern'],
  graduation: ['looking-for', 'northeastern', 'gpa'],
  education: ['gpa', 'courses', 'certifications'],
  northeastern: ['courses', 'gpa', 'graduation'],
  conestoga: ['undergrad', 'education', 'skills-frontend-mobile'],
  undergrad: ['conestoga', 'education', 'northeastern'],
  certifications: ['skills-infra-testing', 'education', 'courses'],
  contact: ['resume', 'looking-for', 'relocation'],
  resume: ['contact', 'looking-for', 'who-are-you'],
  awards: ['leadership', 'smart-farm', 'who-are-you'],
  leadership: ['smart-farm', 'awards', 'virtusa'],
  'what-can-you-do': ['strongest-project', 'learned', 'who-are-you'],
  learned: ['handle-failure', 'strongest-project', 'what-can-you-do'],
  'handle-failure': ['task-scheduler', 'virtusa-impact', 'resumematch'],
  'how-chat-works': ['this-site', 'who-are-you', 'strongest-project'],
  'this-site': ['how-chat-works', 'who-are-you', 'skills-frontend-mobile'],
};

export const CATEGORY_ORDER = ['About me', 'Contact and availability', 'Education', 'Experience', 'Skills', 'Projects', 'ResumeMatch', 'Task Scheduler', 'AI Code Review Assistant'];

export function categoryOf(id: string): string {
  if (/^(who-are-you|what-can-you-do|awards|leadership|how-chat-works|this-site|learned|handle-failure)$/.test(id)) return 'About me';
  if (/^(looking-for|relocation|contact|resume)$/.test(id)) return 'Contact and availability';
  if (/^(gpa|courses|graduation|northeastern|conestoga|undergrad|education|certifications)$/.test(id)) return 'Education';
  if (/^(virtusa|work-history|hospitality)/.test(id)) return 'Experience';
  if (/^(skills-|ai-rag-experience|testing)/.test(id)) return 'Skills';
  if (/^(resumematch|rm-|what-failed)/.test(id)) return 'ResumeMatch';
  if (/^(task-scheduler|ts-)/.test(id)) return 'Task Scheduler';
  if (/^(ai-code-reviewer|acr-)/.test(id)) return 'AI Code Review Assistant';
  return 'Projects';
}

// Per-project stack and code lookups are for search only, so they are left out of the browse list.
export const hiddenFromBrowse = (id: string) => /^(stack|code|project)-/.test(id);
