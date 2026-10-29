export const links = {
  resume: '/assets/Pubudu_Gunasekara_Resume.pdf',
  github: 'https://github.com/PubuduGunasekara',
  linkedin: 'https://www.linkedin.com/in/pubudugunasekera/',
  leetcode: 'https://leetcode.com/u/pubuduguna/',
  email: 'pubudupguna@gmail.com',
  // TODO(pubudu): add a Calendly URL here to show the "Book a 15-minute chat" button on Contact.
  calendly: '',
};

export const heroName = 'Pubudu Gunasekara';
export const heroUniversity = 'Northeastern University';
export const heroProgram = 'M.S. Computer Science, Khoury College of Computer Sciences, Silicon Valley';
export const heroExpected = 'Expected May 2028';
export const heroGpa = 'GPA 4.0 / 4.0';
export const heroSeeking = {
  label: 'Seeking:',
  text: 'Software Engineering Internship, Summer 2027, Bay Area.',
};
export const heroProof: { label: string; href?: string }[] = [
  { label: '188 tests, 93.4% line coverage' },
  { label: 'AI code reviewer, live demo', href: 'https://main.d3dm91k4g9mtr9.amplifyapp.com/' },
  { label: 'Java 21, Spring Boot, Kafka, Redis, PostgreSQL' },
];

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
  { place: 'Virtusa', detail: 'Production Java and Selenium test automation on a British Telecommunications platform.' },
  { place: 'Canada', detail: 'A graduate certificate in mobile solutions development.' },
  { place: 'Northeastern, Silicon Valley', detail: 'Backend and distributed systems.' },
];

export const journeyClosing = 'I started in test automation and moved steadily toward building backend and distributed systems.';

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
      'Wrote Java and Selenium WebDriver automated tests inside the team’s framework for a British Telecommunications (BT) platform serving 1M+ users.',
      'Designed and ran test plans across agile sprints.',
      'Finished assigned sprint tickets ahead of the sprint end, leaving room for peer review and ad hoc requests.',
      'Ran client demos and daily stand-ups when the QA lead delegated them, and tracked defect density and open defect counts.',
    ],
    focus: ['Java', 'Selenium WebDriver', 'CST Environment', 'Camunda Cockpit', 'RabbitMQ', 'Swagger UI', 'MQ Console', 'agile'],
    logo: brandAssets.virtusa,
    mark: 'VU',
    highlights: ['British Telecommunications platform', 'Production engineering · 1M+ user platform'],
    reflection: 'Watching a production platform fail in real ways is why my projects are built around failure handling.',
    reflectionLink: { label: 'See how this shaped the Task Scheduler', href: '/projects/task-scheduler/' },
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
    context: 'Java anchors the Task Scheduler and the Virtusa automation; TypeScript builds this site; C++ runs the Arduino controllers in the Smart Farm project; Python and SQL span the rest of the work on this page.',
  },
  {
    category: 'Backend',
    items: ['Spring Boot', 'Node.js', 'Express', 'Kafka', 'Redis', 'PostgreSQL', 'MongoDB', 'REST APIs', 'OpenAI API'],
    context: 'Spring Boot, Kafka, Redis, and PostgreSQL are the core of the Distributed Task Scheduler, built with Hexagonal Architecture: domain logic stays isolated from infrastructure adapters, enforced at build time by an ArchUnit test. The AI Code Review Assistant’s Express API calls the OpenAI API.',
  },
  {
    category: 'Infra & DevOps',
    items: ['Linux', 'Git', 'Docker', 'GitHub Actions', 'CI/CD', 'Prometheus', 'Grafana', 'AWS'],
    context: 'Docker and GitHub Actions package and test the Task Scheduler; Prometheus and Grafana instrument it in production.',
  },
  {
    category: 'Frontend & Mobile',
    items: ['React', 'Next.js', 'React Native', 'Vite', 'Redux', 'Firebase', 'Android and iOS (coursework)'],
    context: 'React and Next.js power this site and the AI Code Review Assistant’s UI; React Native and Firebase drive the Smart Farm app.',
  },
  {
    category: 'Concepts',
    items: ['Distributed Systems', 'Data Structures', 'Object-Oriented Design', 'Concurrency', 'Unit Testing', 'Debugging'],
    context: 'Concurrency and distributed systems drive the Task Scheduler’s locks, retries, and state machine; the Travel Day Scheduler’s heap pruning and the CS5010 Java projects cover data structures and object-oriented design; unit tests back the Task Scheduler and the Virtusa automation.',
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
};

export const projects: Project[] = [
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
      '188 tests (unit plus real-Postgres/Redis integration tests) behind an 80% coverage gate enforced in CI, with Prometheus and Grafana for live observability.',
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
    eyebrow: 'Mobile · IoT · Team project',
    status: 'Complete · Award winner',
    statusColor: 'text-signal-amber',
    href: 'https://github.com/PubuduGunasekara/smart-farm-1.1.0',
    demo: 'https://www.linkedin.com/posts/pubudugunasekera_softwareengineering-iot-fullstackdevelopment-ugcPost-6794005940980072448-jYhD/',
    body: 'Built the app’s device-control section and the physical Arduino farm model. The control panel (water, food, gate, cleaning) sends commands through Firebase to WiFi-enabled Arduino/ESP controllers that drive relays and motors. Team project, one of the Top 10 Most Innovative Projects at the NSBM Green EXE v1.0 software competition.',
    stack: ['React Native (Expo)', 'Redux', 'Firebase', 'Arduino', 'ESP'],
    featured: false,
    embed: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:6794005940980072448?compact=1',
  },
  {
    title: 'Travel Day Scheduler',
    eyebrow: 'Algorithms · Weighted A*',
    status: 'Built',
    statusColor: 'text-signal-green',
    href: 'https://github.com/PubuduGunasekara/SmartTravelPlanner',
    demo: null,
    body: 'Graduate algorithms team project (team of 2): a weighted / anytime A* itinerary planner with heap pruning. I wrote the initial search and the route-visualization frontend.',
    stack: ['Python', 'Weighted A*', 'Flask', 'JavaScript'],
    featured: false,
    embed: null,
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
    meta: 'Coordinated hardware, software, and cloud execution',
  },
  {
    title: 'QA Sub-team Lead & Client-facing Demos',
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
    detail: 'GPA: 3.74 / 4.0.',
    logo: brandAssets.conestoga,
    mark: 'CC',
  },
  {
    school: 'Victoria University',
    program: 'Bachelor of Information Technology',
    meta: 'Melbourne, Australia · 2018 - 2021',
    detail: 'GPA: 6.25 / 7.0.',
    logo: brandAssets.victoria,
    mark: 'VU',
  },
];

export const contactBody =
  'I’m looking for a Summer 2027 Software Engineering internship focused on backend and distributed systems. Reach out if that’s a fit.';
export const contactAvailability = 'Available Summer 2027 · open to relocation';
export const contactLookingFor = ['Backend & distributed systems internships', 'Summer 2027 (May–Aug)', 'Open to relocation'];

export const githubUsername = 'PubuduGunasekara';
export const githubFallbackRepos = 64;

export const whyMeHeading = 'What I can do for your team';

export type WhyMeProject = {
  title: string;
  href?: string;
  built: string;
  with: string;
  means: string;
};

export const whyMeProjects: WhyMeProject[] = [
  {
    title: 'Distributed Task Scheduler',
    href: '/projects/task-scheduler/',
    built: 'A task scheduler that stops duplicate runs when Kafka delivers an event more than once.',
    with: 'Java 21, Spring Boot, Kafka, Redis, PostgreSQL, Prometheus, Docker, GitHub Actions',
    means: 'I build for retries and failure, and I test for it: 188 tests, 93.4% line coverage. Local load test: about 2,700 tasks/min, zero duplicate runs.',
  },
  {
    title: 'AI Code Review Assistant',
    href: '/projects/ai-code-reviewer/',
    built: 'A GitHub app that reviews pull requests. Each finding has a severity, category, CWE reference and suggested fix.',
    with: 'React, Node/Express, PostgreSQL, Redis, gpt-4o-mini, Docker, AWS',
    means: 'I treat model output as untrusted: a strict JSON schema, so a malformed response fails the review. 19 tests. In 5 test reviews: 8.4 s average, about $0.002 each.',
  },
  {
    title: 'Smart Farm',
    built: 'A team project. I built the app’s device-control section and the physical Arduino farm model.',
    with: 'React Native, Firebase, Arduino, ESP',
    means: 'I can build across the app, the cloud and the hardware. Top 10 Most Innovative Projects, NSBM Green EXE v1.0.',
  },
];

export const whyMeExperience =
  'Virtusa, Associate Engineer (Quality Assurance), Jun 2021 to Mar 2022: Java and Selenium WebDriver tests for a British Telecommunications platform serving 1M+ users.';

export const whyMeBuilding = 'Currently building: a retrieval-augmented generation system for my NLP course.';
