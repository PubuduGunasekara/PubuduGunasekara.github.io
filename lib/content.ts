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
  conestoga: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Conestoga_College_logo.svg',
  victoria: 'https://upload.wikimedia.org/wikipedia/en/c/c6/Victoria_University_%28Australia%29_logo.svg',
  nibm: 'https://upload.wikimedia.org/wikipedia/en/3/3a/National_Institute_of_Business_Management_Logo.png',
  virtusa: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Virtusa_Logo.svg',
  gunasekaraTransport: 'https://gunasekaratransport.com/logo.JPG',
};

export const storyPoints = [
  {
    label: '01 / Foundation',
    title: 'Curiosity became engineering practice.',
    body: 'My early work grew through hackathons, university projects, and leading a Smart Farm IoT system that connected embedded hardware, real-time data, and mobile software.',
  },
  {
    label: '02 / Production',
    title: 'Quality became a systems habit.',
    body: 'At Virtusa, I worked on a British Telecom production platform serving 1M+ users, building automation that reduced regression testing from hours to minutes.',
  },
  {
    label: '03 / Adaptability',
    title: 'Sri Lanka, Canada, and the U.S. shaped how I work.',
    body: 'Studying and building across international environments made me more adaptable, collaborative, and precise about how software supports real users and teams.',
  },
  {
    label: '04 / Direction',
    title: 'Now I am moving toward scalable software and AI systems.',
    body: 'At Northeastern University Silicon Valley, my focus is backend systems, distributed systems, cloud infrastructure, and AI-assisted engineering workflows.',
  },
];

export const engineeringPath = ['Sri Lanka', 'Canada', 'San Jose'];

export const storySummary =
  'Hackathons and IoT in Sri Lanka → QA on a 1M-user Virtusa production platform → grad school and distributed systems in Silicon Valley.';

export const currentFocus = [
  {
    label: 'Backend',
    value: 'Java + Node.js services',
    detail: 'Strengthening API design, service boundaries, and production-style backend thinking.',
  },
  {
    label: 'Cloud',
    value: 'Docker + CI/CD',
    detail: 'Turning full-stack projects into deployable systems with CI/CD and observable infrastructure.',
  },
  {
    label: 'Applied AI',
    value: 'LLM integration',
    detail: 'Building practical AI-assisted engineering workflows with structured output and service boundaries.',
  },
  {
    label: 'Distributed Systems',
    value: 'Kafka + Redis',
    detail: 'Designing for at-least-once delivery, safe concurrency, retries, and observability.',
  },
];

export const experience = [
  {
    role: 'Web Developer',
    company: 'Gunasekara Transport',
    period: '2025 - 2026 · Remote',
    bullets: [
      'Build and maintain the corporate website and web app interfaces as the company expands into online construction-material supply.',
      'Built an internal business management system replacing manual processes — modules for HR, operational workflows, data management, and reporting.',
    ],
    focus: ['React.js', 'JavaScript', 'WordPress', 'PHP', 'Docker', 'internal business systems', 'cloud hosting', 'web development'],
    logo: brandAssets.gunasekaraTransport,
    mark: 'GT',
    highlight: 'Corporate site + internal business system',
  },
  {
    role: 'Associate Engineer – QA',
    company: 'Virtusa',
    period: '2021 - 2022',
    bullets: [
      'Built Java and Selenium WebDriver test automation for a British Telecommunications platform serving over 1M users.',
      'Led test planning, client demos, and daily stand-ups for the module, collaborating with developers to validate bug fixes.',
      'Tracked defect densities and open defect counts across agile sprints.',
    ],
    focus: ['Java', 'Selenium', 'test automation', 'test planning', 'QA methodologies', 'defect tracking', 'agile', 'client demos'],
    logo: brandAssets.virtusa,
    mark: 'VU',
    highlight: 'British Telecommunications platform',
  },
];

export type SkillCategory = {
  category: string;
  items: string[];
  context: string;
};

export const skills: SkillCategory[] = [
  {
    category: 'Languages',
    items: ['Java', 'JavaScript', 'TypeScript', 'Python', 'C++'],
    context: 'Java anchors the Task Scheduler and Virtusa automation; Python and TypeScript span the rest of the projects below.',
  },
  {
    category: 'Frontend',
    items: ['React', 'Next.js', 'React Native', 'Redux', 'Tailwind CSS', 'HTML5', 'CSS3'],
    context: 'React and Next.js power this site and the AI Code Review Assistant’s UI.',
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express', 'Spring Boot', 'FastAPI', 'REST APIs', 'GraphQL'],
    context: 'Spring Boot and Node.js / Express are the backbone of the Task Scheduler and AI Code Review Assistant.',
  },
  {
    category: 'Distributed Systems',
    items: ['Apache Kafka', 'Redis', 'Docker', 'Microservices', 'CI/CD'],
    context: 'Kafka, Redis, and a hexagonal service boundary are the core of the Distributed Task Scheduler.',
  },
  {
    category: 'Cloud & Infra',
    items: ['AWS (EC2, S3)', 'Prometheus', 'Grafana', 'GitHub Actions', 'Jenkins'],
    context: 'Prometheus and Grafana instrument the Task Scheduler; GitHub Actions runs CI across every repo.',
  },
  {
    category: 'Applied AI',
    items: ['OpenAI / LLM APIs', 'LLM integration', 'structured output'],
    context: 'Structured, schema-constrained LLM output drives the AI Code Review Assistant’s severity-tagged findings.',
  },
  {
    category: 'Databases',
    items: ['PostgreSQL', 'MongoDB', 'MySQL', 'Firebase', 'Redis'],
    context: 'PostgreSQL and Redis handle persistence, session storage, and rate limiting in the AI Code Review Assistant.',
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
    meta: 'Northeastern University · Aug 2026 - Present · founding student rep, Khoury College',
  },
  {
    title: 'Graduate Leadership Institute (GLI)',
    meta: 'Northeastern University, Silicon Valley',
  },
  {
    title: 'CliftonStrengths Assessment',
    meta: 'Understanding personal strengths in team contexts',
  },
  {
    title: 'Smart Farm IoT Project — Team Lead',
    meta: 'Coordinated hardware, software, and cloud execution',
  },
  {
    title: '1st Place — NSBM Green University Hackathon',
    meta: 'Overnight hackathon win',
  },
  {
    title: 'QA Sub-team Lead',
    meta: 'Virtusa · AU / UK / LK sprint cycles',
  },
  {
    title: 'Client-facing Demos',
    meta: 'Virtusa',
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
  [
    'People & Soft Skills: Essential for Professional Success',
    'IBM / Coursera',
    'https://www.coursera.org/account/accomplishments/specialization/certificate/BF5BGR9ZE9YT',
  ],
];

export const education = [
  {
    school: 'Northeastern University',
    program: 'M.S. Computer Science',
    meta: 'Silicon Valley, CA · Jan 2026 - Expected May 2028',
    detail: 'GPA: 4.0 / 4.0. Completed: Algorithms, Programming Design Paradigm (Java). Planned: Machine Learning, NLP.',
    logo: brandAssets.northeastern,
    mark: 'NU',
  },
  {
    school: 'Conestoga College',
    program: 'Ontario Graduate Certificate - Mobile Solutions Development',
    meta: 'Waterloo, ON, Canada · 2022 - 2023',
    detail: 'GPA: 3.74 / 4.0.',
    logo: brandAssets.conestoga,
    mark: 'CC',
  },
  {
    school: 'Victoria University Melbourne',
    program: 'Bachelor of Information Technology',
    meta: 'Offshore program, Colombo, Sri Lanka · 2018 - 2021',
    detail: 'Web and Mobile Application Development, studied offshore in Sri Lanka. GPA: 6.25 / 7.0.',
    logo: brandAssets.victoria,
    mark: 'VU',
  },
  {
    school: 'NIBM Colombo',
    program: 'Higher National Diploma - Software Development',
    meta: 'Colombo, Sri Lanka · 2016 - 2017',
    detail: 'Software development foundation. GPA: 3.81 / 4.0.',
    logo: brandAssets.nibm,
    mark: 'NB',
  },
];

export const heroAvailability = 'Seeking Software Engineering internships · Summer 2027';
export const contactBody =
  'I’m seeking Software Engineering, Full-Stack, Backend, Cloud, and Machine Learning internships for Summer 2027.';

export const githubUsername = 'PubuduGunasekara';
export const githubFallbackRepos = 64;
