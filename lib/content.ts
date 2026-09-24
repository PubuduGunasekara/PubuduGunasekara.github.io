export const links = {
  resume: '/assets/Pubudu_Gunasekara_Resume.pdf',
  github: 'https://github.com/PubuduGunasekara',
  linkedin: 'https://www.linkedin.com/in/pubudugunasekera/',
  leetcode: 'https://leetcode.com/u/pubuduguna/',
  email: 'mailto:pubudupguna@gmail.com',
};

export const heroName = 'Pubudu Gunasekara';
export const heroTagline = 'Software engineer focused on backend and distributed systems.';
export const heroSummary =
  'M.S. Computer Science at Northeastern (4.0 GPA). I build reliable backend systems and AI-powered developer tools, and previously built Java test automation for a British Telecommunications platform serving 1M+ users.';
export const heroTechLine = 'Java · Spring Boot · Kafka · Redis · PostgreSQL · AWS';

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
  gunasekaraTransport: '/assets/logos/gunasekara-transport.jpg',
};

export type JourneyStep = {
  place: string;
  detail: string;
};

export const journeySteps: JourneyStep[] = [
  { place: 'Sri Lanka', detail: 'Foundations, hackathons, and an IoT system I led as a student.' },
  { place: 'Virtusa', detail: 'Production Java and Selenium test automation on a British Telecommunications platform.' },
  { place: 'Canada', detail: 'A postgraduate certificate in mobile solutions development.' },
  { place: 'Northeastern, Silicon Valley', detail: 'Backend and distributed systems.' },
];

export const journeyClosing = 'I started in test automation and moved steadily toward building backend and distributed systems.';

export const experience = [
  {
    role: 'Web Developer',
    company: 'Gunasekara Transport',
    period: 'Dec 2025 - Jun 2026 · Remote',
    bullets: [
      'Build and maintain the corporate website and web app interfaces as the company expands into online construction-material supply.',
      'Built an internal business management system replacing manual processes — modules for HR, operational workflows, and reporting.',
      'Handle domain configuration and email gateway administration for the company’s web presence.',
    ],
    focus: ['React.js', 'JavaScript', 'PHP', 'WordPress', 'Docker'],
    logo: brandAssets.gunasekaraTransport,
    mark: 'GT',
    highlight: 'Corporate site + internal business system',
  },
  {
    role: 'Associate Engineer – QA',
    company: 'Virtusa',
    period: 'Jun 2021 - Mar 2022 · Colombo',
    bullets: [
      'Built Java and Selenium WebDriver test automation for a British Telecommunications platform serving 1M+ users.',
      'Designed and planned tests across agile sprints, working directly with developers to validate bug fixes.',
      'Ran client demos and daily stand-ups under the QA lead’s delegation, and tracked defect metrics for the module.',
    ],
    focus: ['Java', 'Selenium WebDriver', 'RabbitMQ', 'Swagger UI', 'Camunda Cockpit', 'agile', 'defect tracking'],
    logo: brandAssets.virtusa,
    mark: 'VU',
    highlight: 'British Telecommunications platform',
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
    items: ['Java', 'JavaScript', 'Python', 'SQL'],
    context: 'Java anchors the Task Scheduler and the Virtusa automation; Python and SQL span the rest of the work below.',
  },
  {
    category: 'Backend & Distributed',
    items: ['Spring Boot', 'Node.js / Express', 'Apache Kafka', 'Redis', 'PostgreSQL', 'MongoDB', 'REST APIs', 'hexagonal architecture'],
    context: 'Spring Boot, Kafka, Redis, and a hexagonal service boundary are the core of the Distributed Task Scheduler.',
  },
  {
    category: 'Cloud & Infra',
    items: ['Docker', 'Docker Compose', 'GitHub Actions', 'CI/CD', 'Prometheus', 'Grafana', 'AWS'],
    context: 'Docker and GitHub Actions package and test the Task Scheduler; Prometheus and Grafana instrument it in production.',
  },
  {
    category: 'Frontend',
    items: ['React', 'Next.js', 'React Native', 'Vite', 'Redux'],
    context: 'React and Next.js power this site and the AI Code Review Assistant’s UI.',
  },
  {
    category: 'Applied AI',
    items: ['OpenAI API', 'LLM integration', 'structured outputs'],
    context: 'The AI Code Review Assistant sends a prompt-specified JSON contract to gpt-4o-mini and defensively validates the response server-side before trusting it.',
    secondary: true,
  },
];

export const familiarSkills = ['C++', 'Jenkins'];

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
    body: 'Background jobs need to run reliably across multiple workers — without duplicating work, losing failures silently, or leaving a job stuck forever if a worker crashes mid-task.',
    highlights: [
      'Three independent layers — a Redis lock, a database state machine, and optimistic locking — stop the same job from running twice, even with Kafka’s at-least-once delivery.',
      'Failed jobs retry with backoff (10s, 30s, 90s) before landing in a dead-letter queue instead of vanishing; a recovery sweeper catches jobs stuck behind a crashed worker.',
      '164 tests (unit plus real-Postgres/Redis integration tests) behind an 80% coverage gate enforced in CI, with Prometheus and Grafana for live observability.',
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
    body: 'Pull requests often sit for a day or more before anyone looks at them — this signs in with GitHub, reads the diff, and gives every PR an instant, severity-tagged first-pass review.',
    highlights: [
      'Large diffs are trimmed to fit the model’s context window instead of failing outright; results are cached in Redis by diff hash so re-opening a PR is instant and free.',
      'The review endpoint is rate limited per user in Redis and fails open — if Redis is briefly unavailable, reviews still work rather than the whole app going down.',
      'Review history persists in PostgreSQL, so it survives a server restart even after the Redis cache expires.',
    ],
    stack: ['Node.js', 'Express', 'React', 'gpt-4o-mini', 'Redis', 'PostgreSQL', 'GitHub OAuth', 'Docker', 'AWS EC2', 'AWS Amplify'],
    featured: true,
    embed: null,
    caseStudySlug: 'ai-code-reviewer',
  },
  {
    title: 'Travel Day Scheduler',
    eyebrow: 'Algorithms · Weighted A*',
    status: 'Built',
    statusColor: 'text-signal-green',
    href: 'https://github.com/PubuduGunasekara/SmartTravelPlanner',
    demo: null,
    body: 'Given a set of places to visit in a day, this finds the itinerary that fits in the most enjoyment within a time budget, using Weighted A* search over real travel-time matrices. A 2-person graduate algorithms project — I co-designed the algorithm and built the initial search plus the route-visualization frontend.',
    highlights: [
      'Each search state is (time, location, places-visited); the search escalates its weight and prunes the open set to stay fast and bounded.',
      'Served through a Flask API with a JavaScript frontend that visualizes the resulting route.',
    ],
    stack: ['Python', 'Weighted A*', 'Flask', 'JavaScript'],
    featured: true,
    embed: null,
  },
  {
    title: 'IoT Smart Farm System',
    eyebrow: 'Mobile · IoT · Team project',
    status: 'Complete · Award winner',
    statusColor: 'text-signal-amber',
    href: 'https://github.com/PubuduGunasekara/smart-farm-1.1.0',
    demo: 'https://www.linkedin.com/posts/pubudugunasekera_softwareengineering-iot-fullstackdevelopment-ugcPost-6794005940980072448-jYhD/',
    body: 'Cross-platform IoT farm-monitoring app (Android/iOS). Top 10 Most Innovative Projects, NSBM Green EXE v1.0.',
    stack: ['React Native', 'Redux', 'Firebase', 'IoT', 'Android', 'iOS'],
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
    body: 'A Java application modeling a bird conservatory: seven bird types in a multi-level class hierarchy, aviary housing rules that reject extinct species, food tracking across all housed birds, and a guest directory. Built with abstract classes, enums, and a JUnit test suite.',
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
    body: 'A turn-based RPG battle simulator in Java. Characters equip gear, items auto-combine when a slot is full, and a greedy rule drives each turn. Built around a Template Method pattern, immutable items, and a seeded random source so battles are deterministic in tests.',
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
    title: 'Graduate Student Career Advisory Board Member',
    meta: 'Northeastern University · Aug 2026 - Present · founding student representative, Khoury College',
  },
  {
    title: 'Graduate Leadership Institute (GLI)',
    meta: 'Northeastern University, Silicon Valley · included a CliftonStrengths assessment',
  },
  {
    title: 'Smart Farm IoT Project — Team Lead',
    meta: 'Coordinated hardware, software, and cloud execution',
  },
  {
    title: 'QA Sub-team Lead & Client-facing Demos',
    meta: 'Virtusa · AU / UK / LK sprint cycles',
  },
  {
    title: '1st Place — NSBM Green University Hackathon',
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
  [
    'Kotlin Core + SQL + React Native Credentials',
    'JetBrains Academy + Additional',
    'https://www.linkedin.com/in/pubudugunasekera/details/certifications/',
  ],
];

export const education = [
  {
    school: 'Northeastern University',
    program: 'M.S. Computer Science',
    meta: 'Silicon Valley, CA · Jan 2026 - Expected May 2028',
    detail: 'GPA: 4.0 / 4.0. Completed: Algorithms, Programming Design Paradigms (Java). In progress (Fall 2026): Machine Learning, Natural Language Processing.',
    logo: brandAssets.northeastern,
    mark: 'NU',
  },
  {
    school: 'Conestoga College',
    program: 'Postgraduate Certificate - Mobile Solutions Development',
    meta: 'Waterloo, ON, Canada · 2022 - 2023',
    detail: 'GPA: 3.74 / 4.0.',
    logo: brandAssets.conestoga,
    mark: 'CC',
  },
  {
    school: 'Victoria University Melbourne',
    program: 'Bachelor of Information Technology',
    meta: 'Offshore program, Colombo, Sri Lanka · 2018 - 2021',
    detail: 'GPA: 6.25 / 7.0.',
    logo: brandAssets.victoria,
    mark: 'VU',
  },
];

export const heroAvailability = 'Seeking Software Engineering internships · Summer 2027';
export const contactBody =
  'I’m seeking Software Engineering, Full-Stack, Backend, Cloud, and Machine Learning internships for Summer 2027.';

export const githubUsername = 'PubuduGunasekara';
export const githubFallbackRepos = 64;
