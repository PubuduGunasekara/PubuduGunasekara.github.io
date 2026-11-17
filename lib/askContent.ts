import type { Source } from './ask/types';

// Curated answers for the "Ask about me" panel. Every statement here restates something that is already
// on the site. Answers that list data (skills, education, contact, leadership, what I can do) are
// generated from lib/content.ts by scripts/build-ask-index.ts, so they cannot drift.

export type Faq = {
  id: string;
  question: string;
  variants: string[];
  answer: string[];
  sources: Source[];
  chip?: boolean;
};

const home = (id: string, label: string): Source => ({ label, href: `/#${id}` });
const caseStudy = (slug: string, label: string, section?: string): Source => ({
  label,
  href: `/projects/${slug}/${section ? `#${section}` : ''}`,
});

export const staticFaqs: Faq[] = [
  {
    id: 'who-are-you',
    chip: true,
    question: 'Who are you?',
    variants: ['Tell me about yourself', 'Give me the short version', 'Introduce yourself', 'Who is Pubudu', 'Summarize your background'],
    answer: [
      'I’m Pubudu Gunasekara, an M.S. Computer Science student at Northeastern University (Khoury College, Silicon Valley). I’m expected to graduate in May 2028 and my GPA is 4.0 / 4.0. I’m based in San Jose, CA.',
      'I focus on backend, distributed systems and AI applications. My two main projects are ResumeMatch (a RAG system) and a Distributed Task Scheduler. Before my master’s I worked in QA at Virtusa on a platform with 1M+ users.',
    ],
    sources: [home('highlights', 'The short version'), home('education', 'Education')],
  },
  {
    id: 'looking-for',
    chip: true,
    question: 'What are you looking for?',
    variants: [
      'What role are you looking for',
      'Are you looking for an internship',
      'When are you available',
      'Are you available for Summer 2027',
      'What kind of job do you want',
      'What are you seeking',
      'What is your availability',
      'What is your start date',
      'When are you free to start',
    ],
    answer: [
      'A Software Engineering internship for Summer 2027 (May to August), in the Bay Area, focused on backend, distributed systems and AI applications. I’m open to relocation.',
    ],
    sources: [home('contact', 'Contact')],
  },
  {
    id: 'relocation',
    chip: true,
    question: 'Are you open to relocation?',
    variants: ['Would you relocate', 'Where are you located', 'Where are you based', 'Where do you live', 'What is your location'],
    answer: [
      'Yes, I’m open to relocation. I’m based in San Jose, CA right now, and I’m looking for a Summer 2027 internship with the Bay Area as my target.',
    ],
    sources: [home('contact', 'Contact')],
  },
  {
    id: 'strongest-project',
    chip: true,
    question: 'What’s your strongest project?',
    variants: ['What is your best project', 'What are you most proud of', 'What are your main projects', 'Flagship project', 'What have you built', 'Show me your work'],
    answer: [
      'My two main projects are ResumeMatch and the Distributed Task Scheduler.',
      'ResumeMatch is a RAG web app that compares a resume with 107,528 real LinkedIn postings, runs fully on a laptop (13.8 s median per resume) and checks every claim in code. It also offers tailoring, interview prep and a recruiter mode with blind review, and has 355 tests.',
      'The Distributed Task Scheduler runs background jobs across workers without running one twice. It has 188 tests and 93.4% line coverage, and in a local load test it sustained about 2,700 tasks per minute with zero duplicate runs.',
      'I also built an AI Code Review Assistant and led the Smart Farm IoT team.',
    ],
    sources: [caseStudy('resumematch', 'ResumeMatch case study'), caseStudy('task-scheduler', 'Task Scheduler case study'), home('projects', 'Featured work')],
  },
  {
    id: 'resumematch',
    question: 'Tell me about ResumeMatch',
    variants: ['What is ResumeMatch', 'Tell me about your RAG system', 'Your retrieval augmented generation project', 'How does ResumeMatch work', 'resume matching project'],
    answer: [
      'ResumeMatch is a retrieval-augmented generation (RAG) system. It compares a resume with 107,528 real LinkedIn job postings and shows which requirements the resume meets, with every claim checked against the resume and the posting it came from.',
      'It runs fully local (bge-small embeddings, ChromaDB, and llama3.2:3b through Ollama), so no resume text is sent to an outside service and no paid API is used. The model only proposes; code checks every claim.',
      'It is a full web app (a Next.js site on a FastAPI service, with sign-in and roles): beyond the match report it drafts resume edits, cover letters and interview questions with invented facts removed, compares a revised resume, builds a role report for any job title, and lets recruiters rank up to 10 resumes with blind review.',
      'I measured a 13.8 s median per resume on an M3 Pro (3 resumes, 9 runs). With the 3B model, 35 of 48 “matched” claims (73%) cited a posting that never mentioned them, which is why every claim is checked in code.',
    ],
    sources: [caseStudy('resumematch', 'ResumeMatch case study'), { label: 'Code on GitHub', href: 'https://github.com/PubuduGunasekara/rag-resumematch' }],
  },
  {
    id: 'resumematch-limits',
    question: 'What are the limits of ResumeMatch?',
    variants: ['What does ResumeMatch not do', 'Weaknesses of your RAG system', 'ResumeMatch weaknesses', 'ResumeMatch limitations', 'Downsides of ResumeMatch', 'Honest limits of your project', 'What is not measured in ResumeMatch'],
    answer: [
      'The checks compare wording, so a resume that lists NetSuite shows “ERP system” as not found. Errors go toward “not found”, never toward a false match. The 3B model also sometimes misreads the resume’s own words in chat answers, so sources are shown.',
      'I have only tested synthetic resumes so far (20 fictional ones in 16 fields), and I have no ground-truth relevance labels yet, so retrieval quality and claim-check precision are not measured. The vector search is approximate (97% of the true nearest chunks on average). The GPU VM profile has not been run.',
    ],
    sources: [caseStudy('resumematch', 'ResumeMatch limits', 'limits')],
  },
  {
    id: 'what-failed',
    question: 'What went wrong first in ResumeMatch?',
    variants: ['What failed first', 'What mistakes did you make', 'What did you learn from the failures', 'Bugs you hit in your RAG system', 'Lessons learned from ResumeMatch'],
    answer: [
      'The search read only half of a long resume, because the embedder ignores text past 512 tokens. I now split the resume into sections of at most 480 tokens.',
      'Typo correction rewrote “Redis” to “Hedis” and the company “Midstate” to “Mistake”, so it is now used for search only, with rules that cut false corrections on clean resumes from 45 to 6. Employer benefits came back as skills. A prompt instruction made the model list less, with findings per run falling from 2.8 to 0.2. The chat also credited postings’ requirements to the candidate until claims about the candidate had to be backed by the resume.',
      'The biggest finding was that with the 3B model, 35 of 48 “matched” claims (73%) cited a posting that never mentioned them. That is why every claim is now checked from both sides.',
    ],
    sources: [caseStudy('resumematch', 'What failed first', 'what-failed-first')],
  },
  {
    id: 'task-scheduler',
    question: 'Tell me about the Distributed Task Scheduler',
    variants: ['What is the task scheduler', 'Kafka Redis project', 'Tell me about your backend project', 'How do you prevent duplicate execution', 'Job scheduler project'],
    answer: [
      'It is a backend job scheduler that runs background jobs across several workers and avoids running one twice, even though Kafka can deliver an event more than once. Three layers stop duplicates: a Redis lock, a database state machine and optimistic locking.',
      'Failed jobs retry with backoff (10s, 30s, 90s) and then go to a dead-letter queue, and a recovery job catches tasks stuck behind a crashed worker.',
      'It has 188 tests and 93.4% line coverage. In a local load test (1,000 simulated 50 ms tasks, 3 consumers) it sustained about 2,700 tasks per minute with zero duplicate runs. It runs in a local Docker Compose stack and is not deployed.',
    ],
    sources: [caseStudy('task-scheduler', 'Task Scheduler case study'), { label: 'Code on GitHub', href: 'https://github.com/PubuduGunasekara/distributed-task-scheduler' }],
  },
  {
    id: 'ai-code-reviewer',
    question: 'Tell me about the AI Code Review Assistant',
    variants: ['What is the code reviewer', 'Pull request review app', 'OpenAI project', 'GitHub OAuth app', 'Do you have a live demo'],
    answer: [
      'It is a web app that signs in with GitHub, reads a pull request’s diff and returns severity-tagged findings, each with a category, a CWE reference and a suggested fix.',
      'A strict JSON schema (OpenAI Structured Outputs) makes a malformed model response fail the review instead of showing wrong results. It also has a per-user hourly rate limit and a Redis cache.',
      'In 5 test reviews, a review took 8.4 s on average and cost about $0.002. That is latency and cost only, not a measure of review quality. There is a live demo.',
    ],
    sources: [
      caseStudy('ai-code-reviewer', 'AI Code Review case study'),
      { label: 'Live demo', href: 'https://main.d3dm91k4g9mtr9.amplifyapp.com/' },
    ],
  },
  {
    id: 'smart-farm',
    question: 'Tell me about Smart Farm',
    variants: ['IoT project', 'Arduino project', 'Hardware experience', 'Did you lead a team', 'NSBM Green EXE', 'The farm project', 'Smart Farm project', 'IoT farm'],
    answer: [
      'Smart Farm is an IoT team project. I led the team and built the app’s device-control section and the physical Arduino farm model (sensors, TT motors, Arduino and ESP controllers, relays).',
      'The control panel sends water, food, gate and cleaning commands through Firebase to WiFi Arduino/ESP controllers that drive relays and motors. It was one of the Top 10 Most Innovative Projects at the NSBM Green EXE v1.0 software competition.',
    ],
    sources: [home('projects', 'Earlier projects'), { label: 'Code on GitHub', href: 'https://github.com/PubuduGunasekara/smart-farm-1.1.0' }],
  },
  {
    id: 'multi-user-blog',
    question: 'Tell me about the Multi-User Blog',
    variants: ['MERN stack project', 'Full-stack project', 'Express MongoDB project', 'What did you find in the blog tests'],
    answer: [
      'It is a multi-author phone review and news site where every post waits for admin approval. It has an Express REST API (93 endpoints) on MongoDB with JWT roles, and Next.js static generation for SEO.',
      'I added a 42-test API suite in 2026, which surfaced a privilege-escalation bug that is now documented in the repo.',
    ],
    sources: [home('projects', 'Earlier projects'), { label: 'Code on GitHub', href: 'https://github.com/PubuduGunasekara/Multi-User-Blog' }],
  },
  {
    id: 'virtusa',
    chip: true,
    question: 'What did you do at Virtusa?',
    variants: ['Tell me about your work experience', 'Do you have professional experience', 'QA experience', 'Selenium experience', 'Where have you worked', 'What was your job at Virtusa'],
    answer: [
      'I was an Associate Engineer in QA at Virtusa in Colombo, Sri Lanka, from June 2021 to March 2022. I verified a British Telecommunications (BT) platform serving 1M+ users by writing Java and Selenium WebDriver tests and running test plans in agile sprints.',
      'I closed about 10 tickets per 2-week sprint, 2-3 days early, while handling peer reviews, client demos and meetings, and tracking defect density and open defect counts.',
      'Watching a production platform fail in real ways is why my projects are built around failure handling.',
    ],
    sources: [home('experience', 'Experience')],
  },
  {
    id: 'ai-rag-experience',
    chip: true,
    question: 'Do you have AI or RAG experience?',
    variants: ['Machine learning experience', 'Have you worked with LLMs', 'NLP experience', 'Vector search experience', 'What AI projects have you built', 'Applied AI experience', 'Embeddings experience'],
    answer: [
      'Yes. ResumeMatch is a RAG system I built end to end: embeddings, vector search with ChromaDB, a local LLM through Ollama, and code that checks every claim the model makes. The AI Code Review Assistant uses OpenAI Structured Outputs with a strict JSON schema.',
      'I’m also taking Machine Learning and Natural Language Processing at Northeastern (in progress, Fall 2026).',
    ],
    sources: [caseStudy('resumematch', 'ResumeMatch case study'), caseStudy('ai-code-reviewer', 'AI Code Review case study'), home('skills', 'Skills')],
  },
  {
    id: 'testing',
    question: 'How do you test your work?',
    variants: ['Do you write tests', 'Testing experience', 'Test coverage', 'Quality practices', 'Do you use CI'],
    answer: [
      'Distributed Task Scheduler: 188 tests, including integration tests against real PostgreSQL and Redis, with 93.4% line and 91.1% branch coverage and an 80% CI gate. ResumeMatch: 355 tests that run in about 4 seconds with no model, index or network. AI Code Review Assistant: 19 backend tests. Multi-User Blog: a 42-test API suite I added in 2026.',
      'At Virtusa I wrote Java and Selenium WebDriver tests for a platform with 1M+ users.',
    ],
    sources: [caseStudy('task-scheduler', 'Task Scheduler testing', 'testing'), home('experience', 'Experience')],
  },
];

export const chipOrder = [
  'who-are-you',
  'looking-for',
  'strongest-project',
  'virtusa',
  'ai-rag-experience',
  'skills-overview',
  'relocation',
  'contact',
];
