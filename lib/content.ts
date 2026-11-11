export const links = {
  resume: '/assets/Pubudu_Gunasekara_Resume.pdf',
  github: 'https://github.com/PubuduGunasekara',
  linkedin: 'https://www.linkedin.com/in/pubudugunasekera/',
  leetcode: 'https://leetcode.com/u/pubuduguna/',
  email: 'pubudupguna@gmail.com',
  // TODO(pubudu): add a Calendly URL here to show the "Book a 15-minute chat" button on Contact.
  calendly: '',
};

// TODO(pubudu): set these when ResumeMatch has a demo. An empty value hides the demo video and the "Live demo" button.
export const resumeMatchConfig = {
  demoVideoUrl: '',
  liveDemoUrl: '',
};

export type Metric = {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
};

export const resumeMatchMetrics: Metric[] = [
  { value: 107528, label: 'real LinkedIn postings searched' },
  { value: 13.8, decimals: 1, suffix: ' s', label: 'median per resume (M3 Pro, 3 resumes, 9 runs)' },
  { value: 226, label: 'tests' },
  { value: 73, suffix: '%', label: 'unsupported “matched” claims caught (35 of 48)' },
];

export const heroName = 'Pubudu Gunasekara';
export const heroUniversity = 'Northeastern University';
export const heroProgram = 'M.S. Computer Science, Khoury College of Computer Sciences, Silicon Valley';
export const heroExpected = 'Expected May 2028';
export const heroGpa = 'GPA 4.0 / 4.0';
export const heroSeeking = {
  label: 'Seeking:',
  text: 'Software Engineering Internship, Summer 2027, Bay Area. Backend, distributed systems and AI applications.',
};
export const heroLocation = 'Based in San Jose, CA';
export const heroProof = ['Java 21, Spring Boot, Kafka, Redis, PostgreSQL, RAG'];

export const nav = [
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certs' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'story', label: 'Story' },
  { id: 'contact', label: 'Contact' },
];

export const brandAssets = {
  northeastern: '/assets/northeastern-logo.png',
  conestoga: '/assets/logos/conestoga.svg',
  victoria: '/assets/logos/victoria.svg',
  virtusa: '/assets/logos/virtusa.svg',
};

export type JourneyStep = {
  place: string;
  detail: string;
};

export const journeySteps: JourneyStep[] = [
  { place: 'Sri Lanka', detail: 'Foundations, hackathons, and an IoT system I led as a student.' },
  { place: 'Virtusa', detail: 'Java and Selenium test automation on a British Telecommunications platform.' },
  { place: 'Canada', detail: 'A graduate certificate in mobile solutions development.' },
  { place: 'Northeastern, Silicon Valley', detail: 'Backend, distributed systems and AI applications.' },
];

export const journeyClosing = 'I started in test automation and moved steadily toward building backend, distributed and AI systems.';

export type Experience = {
  role: string;
  company: string;
  period: string;
  bullets: string[];
  focus: string[];
  logo: string;
  mark: string;
  highlights?: string[];
  reflection?: string;
  reflectionLink?: { label: string; href: string };
};

export const experience: Experience[] = [
  {
    role: 'Associate Engineer, QA',
    company: 'Virtusa',
    period: 'Jun 2021 - Mar 2022 · Colombo',
    bullets: [
      'Verified a British Telecommunications (BT) platform serving 1M+ users by writing Java and Selenium WebDriver tests and running test plans in agile sprints.',
      'Closed about 10 tickets per 2-week sprint, 2-3 days early, while handling peer reviews, client demos and meetings, and tracking defect density and open defect counts.',
    ],
    focus: ['Java', 'Selenium WebDriver', 'CST Environment', 'Camunda Cockpit', 'RabbitMQ', 'Swagger UI', 'MQ Console', 'agile'],
    logo: brandAssets.virtusa,
    mark: 'VU',
    highlights: ['British Telecommunications platform', 'QA for a 1M+ user platform'],
    reflection: 'Watching a production platform fail in real ways is why my projects are built around failure handling.',
    reflectionLink: { label: 'See how this shaped the Task Scheduler', href: '/projects/task-scheduler/' },
  },
  {
    role: 'Team Member',
    company: 'Food Services & Hospitality',
    period: 'Jan 2024 - Dec 2025 · Waterloo, Canada',
    bullets: [],
    focus: [],
    logo: '',
    mark: 'FS',
  },
];

export type SkillCategory = {
  category: string;
  items: string[];
  context: string;
  secondary?: boolean;
};

export const skills: SkillCategory[] = [
  {
    category: 'Languages',
    items: ['Java', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'C++ (Arduino)'],
    context: 'Java anchors the Task Scheduler and the Virtusa automation; TypeScript builds this site; C++ runs the Arduino controllers in the Smart Farm project; Python powers ResumeMatch; SQL spans the rest of the work on this page.',
  },
  {
    category: 'Backend',
    items: ['Spring Boot', 'Node.js', 'Express', 'FastAPI', 'Kafka', 'Redis', 'PostgreSQL', 'MongoDB', 'REST APIs', 'OpenAI API'],
    context: 'Spring Boot, Kafka, Redis, and PostgreSQL are the core of the Distributed Task Scheduler, built with Hexagonal Architecture: domain logic stays isolated from infrastructure adapters, enforced at build time by an ArchUnit test. The AI Code Review Assistant’s Express API calls the OpenAI API, and ResumeMatch’s API is built with FastAPI.',
  },
  {
    category: 'AI & RAG',
    items: ['RAG', 'Embeddings (sentence-transformers, bge-small)', 'Vector search (ChromaDB)', 'Ollama (local LLMs)', 'LLMs', 'Structured outputs', 'OpenAI API'],
    context: 'ResumeMatch retrieves job postings with bge-small-en-v1.5 embeddings and ChromaDB, runs llama3.2:3b through Ollama, and checks every claim in code. The AI Code Review Assistant uses OpenAI Structured Outputs.',
  },
  {
    category: 'Infra & Testing',
    items: ['Linux', 'Git', 'Docker', 'AWS', 'Azure', 'GitHub Actions', 'CI/CD', 'Prometheus', 'Grafana', 'Selenium WebDriver', 'JUnit', 'Testcontainers'],
    context: 'Docker and GitHub Actions package and test the Task Scheduler; Prometheus and Grafana instrument it in the local Docker Compose stack. Selenium WebDriver drove the Virtusa test automation, and JUnit and Testcontainers back the Task Scheduler’s tests.',
  },
  {
    category: 'Frontend & Mobile',
    items: ['React', 'Next.js', 'Streamlit', 'React Native (Expo)', 'Vite', 'Redux', 'Firebase', 'Android, iOS and Android Wear (coursework)'],
    context: 'React and Next.js power this site and the AI Code Review Assistant’s UI; React Native and Firebase drive the Smart Farm app; ResumeMatch uses Next.js and Streamlit.',
  },
  {
    category: 'Fundamentals',
    items: ['Algorithms', 'Distributed Systems', 'Data Structures', 'Object-Oriented Design', 'Concurrency', 'Unit Testing', 'Debugging'],
    context: 'Concurrency and distributed systems drive the Task Scheduler’s locks, retries, and state machine; the CS5010 Java projects cover data structures and object-oriented design; unit tests back the Task Scheduler and the Virtusa automation.',
    secondary: true,
  },
];

export type Project = {
  title: string;
  eyebrow: string;
  status: string;
  statusColor?: string;
  href: string;
  demo?: string | null;
  body: string;
  highlights?: string[];
  stack: string[];
  featured?: boolean;
  embed?: string | null;
  hasDiagram?: boolean;
  caseStudySlug?: string;
  metrics?: Metric[];
};

export const projects: Project[] = [
  {
    title: 'ResumeMatch',
    eyebrow: 'RAG system · Runs locally',
    status: 'Built',
    statusColor: 'text-signal-green',
    href: 'https://github.com/PubuduGunasekara/rag-resumematch',
    demo: resumeMatchConfig.liveDemoUrl || null,
    body: 'A retrieval-augmented generation (RAG) system that compares a resume with 107,528 real LinkedIn job postings and shows which requirements it meets, with every claim checked against the resume and the posting it came from.',
    highlights: [
      'The model only proposes. Code checks that the cited posting asks for the requirement, that the resume quote is really in the resume, and that a “missing” skill is not listed. Rankings and verdicts are computed in code.',
      'Runs fully local: bge-small-en-v1.5 embeddings, ChromaDB and llama3.2:3b through Ollama. The resume never leaves the machine and no paid API is used.',
      'With the 3B model, 35 of 48 “matched” claims (73%) cited a posting that never mentioned them, so every claim is now checked from both sides.',
    ],
    stack: ['Python', 'FastAPI', 'Next.js', 'TypeScript', 'Streamlit', 'ChromaDB', 'sentence-transformers', 'Ollama', 'Docker', 'GitHub Actions'],
    featured: true,
    embed: null,
    caseStudySlug: 'resumematch',
    metrics: resumeMatchMetrics,
  },
  {
    title: 'Distributed Task Scheduler',
    eyebrow: 'Backend · Distributed systems',
    status: 'Built',
    statusColor: 'text-signal-green',
    href: 'https://github.com/PubuduGunasekara/distributed-task-scheduler',
    demo: null,
    body: 'Background jobs need to run reliably across multiple workers, without duplicating work, losing failures silently, or leaving a job stuck forever if a worker crashes mid-task.',
    highlights: [
      'Three independent layers (a Redis lock, a database state machine, and optimistic locking) stop the same job from running twice, even with Kafka’s at-least-once delivery.',
      'Failed jobs retry with backoff (10s, 30s, 90s) before landing in a dead-letter queue instead of vanishing; a recovery sweeper catches jobs stuck behind a crashed worker.',
      '188 tests (unit plus real-Postgres/Redis integration tests) behind an 80% coverage gate enforced in CI, with Prometheus and Grafana for observability in the local Docker Compose stack.',
      'In a local load test (1,000 simulated 50 ms tasks, 3 consumers) it sustained about 2,700 tasks/min with zero duplicate runs.',
    ],
    stack: ['Java 21', 'Spring Boot', 'Apache Kafka', 'Redis', 'PostgreSQL', 'Docker', 'Prometheus', 'Grafana', 'JUnit', 'GitHub Actions'],
    featured: true,
    embed: null,
    hasDiagram: true,
    caseStudySlug: 'task-scheduler',
  },
  {
    title: 'AI Code Review Assistant',
    eyebrow: 'Full-stack · Applied AI',
    status: 'Live',
    statusColor: 'text-signal-green',
    href: 'https://github.com/PubuduGunasekara/ai-code-reviewer',
    demo: 'https://main.d3dm91k4g9mtr9.amplifyapp.com/',
    body: 'Pull requests often sit for a day or more before anyone looks at them. This signs in with GitHub, reads the diff, and gives every PR an instant, severity-tagged first-pass review.',
    highlights: [
      'Large diffs are trimmed to fit the model’s context window instead of failing outright; results are cached in Redis by diff hash so re-opening a PR is instant and free.',
      'The review endpoint is rate limited per user in Redis and fails open, so if Redis is briefly unavailable, reviews still work rather than the whole app going down.',
      'Review history persists in PostgreSQL, so it survives a server restart even after the Redis cache expires.',
      'In 5 test reviews, a review took 8.4 s on average and cost about $0.002.',
    ],
    stack: ['Node.js', 'Express', 'React', 'gpt-4o-mini', 'Redis', 'PostgreSQL', 'GitHub OAuth', 'Docker', 'AWS EC2', 'AWS Amplify'],
    featured: true,
    embed: null,
    caseStudySlug: 'ai-code-reviewer',
  },
  {
    title: 'Multi-User Blog',
    eyebrow: 'Full-stack · MERN · Bachelor’s project',
    status: 'Built · 2020–21',
    statusColor: 'text-signal-green',
    href: 'https://github.com/PubuduGunasekara/Multi-User-Blog',
    demo: null,
    body: 'A multi-author phone review and news site where every post waits for admin approval. Express REST API (93 endpoints) on MongoDB with JWT roles, and Next.js static generation for SEO (Lighthouse SEO 100 on a local build). Revisited in 2026 with a 42-test API suite, which surfaced a privilege-escalation bug now documented in the repo.',
    stack: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'Next.js', 'React', 'JWT'],
    featured: false,
    embed: null,
  },
  {
    title: 'IoT Smart Farm System',
    eyebrow: 'Mobile · IoT · Team project, team lead',
    status: 'Complete · Award winner',
    statusColor: 'text-signal-amber',
    href: 'https://github.com/PubuduGunasekara/smart-farm-1.1.0',
    demo: 'https://www.linkedin.com/posts/pubudugunasekera_softwareengineering-iot-fullstackdevelopment-ugcPost-6794005940980072448-jYhD/',
    body: 'I led the team and built the app’s device-control section and the physical Arduino farm model (sensors, TT motors, Arduino and ESP controllers, relays). The control panel (water, food, gate, cleaning) sends commands through Firebase to WiFi-enabled Arduino/ESP controllers that drive relays and motors. Top 10 Most Innovative Projects at the NSBM Green EXE v1.0 software competition.',
    stack: ['React Native (Expo)', 'Redux', 'Firebase', 'Arduino', 'ESP'],
    featured: false,
    embed: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:6794005940980072448?compact=1',
  },
  {
    title: 'Bird Conservatory Management System',
    eyebrow: 'Object-oriented design · CS5010',
    status: 'Built',
    statusColor: 'text-signal-green',
    href: 'https://github.com/PubuduGunasekara/Bird-Conservatory-Management-System',
    demo: null,
    body: 'A Java conservatory system: bird class hierarchy, housing rules, food tracking, and a guest directory.',
    stack: ['Java', 'OOP', 'JUnit'],
    featured: false,
    embed: null,
  },
  {
    title: 'Role Playing Games',
    eyebrow: 'Design patterns · CS5010',
    status: 'Built',
    statusColor: 'text-signal-green',
    href: 'https://github.com/PubuduGunasekara/RolePlayingGames',
    demo: null,
    body: 'A turn-based Java RPG battle simulator: gear, auto-combining items, and a greedy turn rule.',
    stack: ['Java', 'Design patterns', 'JUnit'],
    featured: false,
    embed: null,
  },
];

export type LeadershipEntry = {
  title: string;
  meta: string;
};

export const leadership: LeadershipEntry[] = [
  {
    title: 'Graduate Student Career Advisory Board',
    meta: 'Northeastern University · Founding Cohort Member',
  },
  {
    title: 'Husky Code Club',
    meta: 'Northeastern University · Member',
  },
  {
    title: 'Graduate Leadership Institute (GLI)',
    meta: 'Northeastern University, Silicon Valley · included a CliftonStrengths assessment',
  },
  {
    title: 'Smart Farm IoT Project, Team Lead',
    meta: 'Led the team; built the app’s control section and the physical farm model',
  },
  {
    title: 'Client-facing demos and QA coordination',
    meta: 'Virtusa · AU / UK / LK sprint cycles',
  },
  {
    title: '1st Place, NSBM Green University Hackathon',
    meta: 'Overnight hackathon win',
  },
];

export const certifications: Array<[string, string, string]> = [
  [
    'Foundations of Responsible AI Learning',
    'Northeastern University',
    'https://northeastern.badges.parchment.com/public/credentials/30jlIDuTS6GsL5WAC0pM5g?identity__email=gunasekaraarachchi.p@northeastern.edu&utm_source=linkedin_credentials',
  ],
  [
    'Microsoft Certified: Azure Fundamentals (AZ-900)',
    'Microsoft',
    'https://learn.microsoft.com/en-us/users/pubudupraneeth-0557/credentials/f2522fcd3042b6a5?ref=https%3A%2F%2Fwww.linkedin.com%2F',
  ],
  [
    'IBM Full Stack Software Developer Professional Certificate',
    'IBM / Coursera',
    'https://www.coursera.org/account/accomplishments/specialization/certificate/MF27EJXFYCC3',
  ],
  [
    'Meta Android Developer Professional Certificate',
    'Meta / Coursera',
    'https://www.coursera.org/account/accomplishments/professional-cert/PPXS7HE57Y8Y?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=prof',
  ],
  [
    'Python for Everybody Specialization',
    'University of Michigan / Coursera',
    'https://www.coursera.org/account/accomplishments/specialization/certificate/H4W6EJV3D255',
  ],
];

export type Education = {
  school: string;
  program: string;
  meta: string;
  detail: string;
  logo: string;
  mark: string;
  wideLogo?: boolean;
};

export const education: Education[] = [
  {
    school: 'Northeastern University, Khoury College of Computer Sciences',
    program: 'M.S. Computer Science',
    meta: 'San Jose, CA · Jan 2026 - Expected May 2028',
    detail: 'GPA: 4.0 / 4.0. Completed: Algorithms, Programming Design Paradigms (Java). In progress (Fall 2026): Machine Learning, Natural Language Processing.',
    logo: brandAssets.northeastern,
    mark: 'NU',
    wideLogo: true,
  },
  {
    school: 'Conestoga College',
    program: 'Graduate Certificate - Mobile Solutions Development',
    meta: 'Waterloo, ON, Canada · 2022 - 2023',
    detail: 'GPA: 3.74 / 4.0. Coursework: Android and iOS Application Development, Android Wear, Mobile Capstone.',
    logo: brandAssets.conestoga,
    mark: 'CC',
  },
  {
    school: 'Victoria University',
    program: 'Bachelor of Information Technology',
    meta: 'Melbourne, Australia · 2018 - 2021',
    detail: 'GPA: 6.25 / 7.0. Major: Web and Mobile Application Development.',
    logo: brandAssets.victoria,
    mark: 'VU',
  },
];

export const contactBody =
  'I’m looking for a Summer 2027 Software Engineering internship focused on backend, distributed systems and AI applications. Reach out if that’s a fit.';
export const contactAvailability = 'Available Summer 2027 · open to relocation';
export const contactLookingFor = ['Backend, distributed systems and AI application internships', 'Summer 2027 (May–Aug)', 'Open to relocation'];


export const highlights = {
  kicker: 'The short version',
  title: 'Everything you need to know about me, in one glance',
  sub: 'Highlights of my projects and work experience. The details are below.',
};

export type HighlightAccent = 'cyan' | 'green' | 'amber' | 'blue' | 'red';

export type HighlightItem = {
  title: string;
  kind?: string;
  href?: string;
  accent: HighlightAccent;
  fact: string;
  dates?: string;
  built: string;
  used: string[];
  learned: string;
  helps: string;
};

export const highlightProjects: HighlightItem[] = [
  {
    title: 'ResumeMatch',
    kind: 'RAG system',
    href: '/projects/resumematch/',
    accent: 'red',
    fact: '107,528 postings searched',
    built: 'A retrieval-augmented generation (RAG) app: it finds job postings that match a resume, then checks every claim against the resume and the posting.',
    used: ['Python', 'FastAPI', 'ChromaDB', 'Ollama', 'RAG'],
    learned: '73% of a 3B model’s “matched” claims were unsupported, so code now checks every one.',
    helps: 'AI results you can verify, running fully on your own machine.',
  },
  {
    title: 'Distributed Task Scheduler',
    kind: 'Backend job scheduler',
    href: '/projects/task-scheduler/',
    accent: 'cyan',
    fact: '188 tests, 93.4% coverage',
    built: 'A backend job queue and scheduler: it runs background jobs across several workers and avoids running one twice.',
    used: ['Java', 'Kafka', 'Redis', 'PostgreSQL'],
    learned: 'Designing for failure: retries, a dead-letter queue, recovery.',
    helps: 'Your background work keeps running when something fails.',
  },
  {
    title: 'AI Code Review Assistant',
    kind: 'AI web app',
    href: '/projects/ai-code-reviewer/',
    accent: 'green',
    fact: '8.4 s, ~$0.002 per review (5 test reviews)',
    built: 'A web app that uses an AI model to review a GitHub pull request and list issues with fixes.',
    used: ['React', 'Node/Express', 'Redis', 'OpenAI'],
    learned: 'Not trusting AI output blindly: strict checks, rate limits, caching.',
    helps: 'A first review in seconds, so teammates focus on harder problems.',
  },
  {
    title: 'Smart Farm',
    kind: 'IoT project',
    accent: 'amber',
    fact: 'Top 10 Most Innovative Projects, NSBM Green EXE v1.0',
    built: 'A phone app that controls an Arduino farm model (water, feed, gate, cleaning). I led the team and built the app’s control section and the model.',
    used: ['React Native', 'Firebase', 'Arduino'],
    learned: 'How apps, cloud and hardware connect, and teamwork.',
    helps: 'I connect software to real devices and work in a team.',
  },
];

export const highlightWork: HighlightItem = {
  title: 'Virtusa',
  accent: 'blue',
  fact: '1M+ user platform',
  dates: 'Associate Engineer (QA) · Jun 2021 to Mar 2022',
  built: 'Verified a British Telecommunications platform by writing tests and running test plans.',
  used: ['Java', 'Selenium WebDriver', 'Agile'],
  learned: 'How a large platform is tested; working with developers and clients.',
  helps: 'I know how real software gets tested before release.',
};

export const learnMore = {
  title: 'Want to learn more about me?',
  sub: 'Everything in detail, below.',
};
