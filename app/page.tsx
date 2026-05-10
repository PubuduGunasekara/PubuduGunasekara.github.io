'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type Theme = 'dark' | 'light';

const links = {
  resume: '/assets/Pubudu_Gunasekara_Resume.pdf',
  github: 'https://github.com/PubuduGunasekara',
  linkedin: 'https://www.linkedin.com/in/pubudugunasekera/',
  leetcode: 'https://leetcode.com/u/pubuduguna/',
  email: 'mailto:pubudupguna@gmail.com',
};

const nav = [
  { id: 'story', label: 'Story' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'prep', label: 'Prep' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certs' },
  { id: 'contact', label: 'Contact' },
];

const brandAssets = {
  northeastern: '/assets/northeastern-logo.png',
  conestoga: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Conestoga_College_logo.svg',
  victoria: 'https://upload.wikimedia.org/wikipedia/en/c/c6/Victoria_University_%28Australia%29_logo.svg',
  nibm: 'https://upload.wikimedia.org/wikipedia/en/3/3a/National_Institute_of_Business_Management_Logo.png',
  virtusa: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Virtusa_Logo.svg',
  gunasekaraTransport: 'https://gunasekaratransport.com/logo.JPG',
};

const storyPoints = [
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
    body: 'At Northeastern University Silicon Valley, my focus is backend systems, cloud infrastructure, machine learning, NLP, and AI-assisted engineering workflows.',
  },
];

const experience = [
  {
    role: 'Associate Engineer - QA Automation',
    company: 'Virtusa',
    period: '2021 - 2022',
    body: 'Built Java and Selenium automation for a British Telecom production platform serving 1M+ users. Reduced regression test cycles from 4 hours to 45 minutes (80% reduction). Led QA sub-team across international sprint cycles spanning Sri Lanka, UK, and Australia. Delivered client demos that secured continued project investment. Integrated automation into Jenkins CI/CD pipelines for nightly quality gates.',
    focus: ['Java', 'Selenium', 'Jenkins', 'CI/CD', 'TestNG', 'JIRA', 'BDD', 'team leadership', 'client presentation'],
    logo: brandAssets.virtusa,
    mark: 'VU',
    highlight: '1M+ users · 80% test time reduction',
  },
  {
    role: 'Web Developer',
    company: 'Gunasekara Transport',
    period: '2025 - Present · Remote',
    body: 'Building and maintaining web infrastructure across ecommerce platforms, WordPress, React.js interfaces, internal tooling, reporting automation, and architecture planning for operational software systems.',
    focus: ['ecommerce platforms', 'React.js', 'WordPress', 'web development', 'internal tools', 'automation', 'reporting systems'],
    logo: brandAssets.gunasekaraTransport,
    mark: 'GT',
    highlight: null,
  },
];

const skills: Array<[string, string[]]> = [
  ['Languages', ['Java', 'JavaScript', 'TypeScript', 'Python', 'Kotlin', 'C++']],
  ['Frontend', ['React', 'Next.js', 'React Native', 'Redux', 'Tailwind CSS', 'HTML5', 'CSS3']],
  ['Backend', ['Node.js', 'Express', 'Spring Boot', 'FastAPI', 'REST APIs', 'GraphQL']],
  ['Distributed Systems', ['Apache Kafka', 'Redis', 'Docker', 'Kubernetes', 'Microservices', 'CI/CD']],
  ['Cloud & Infra', ['AWS (EC2, S3)', 'Azure', 'IBM Cloud', 'Prometheus', 'Grafana', 'GitHub Actions', 'Jenkins']],
  ['AI / ML', ['scikit-learn', 'TensorFlow/Keras', 'OpenAI API', 'Pandas', 'NumPy', 'NLP', 'Responsible AI']],
  ['Databases', ['PostgreSQL', 'MongoDB', 'MySQL', 'Firebase', 'Redis']],
];

const projects = [
  {
    title: 'AI Code Review Assistant',
    eyebrow: 'Active build · AI tooling',
    status: 'Building · Week 1 of 6',
    statusColor: 'text-signal-green',
    href: 'https://github.com/PubuduGunasekara/ai-code-reviewer',
    demo: null,
    body: 'GPT-4o powered GitHub PR reviewer. OAuth login connects repositories, reviews pull request diffs, and returns inline comments with severity scores and CWE references. Redis handles rate limiting and repeated diff chunks, with GitHub Actions deploying the app to AWS EC2.',
    challenge: 'Build an AI tool that handles real GitHub diffs with sub-2s review latency, caching identical chunks in Redis to cut API costs.',
    impact: 'This is my main January 2027 portfolio build: LLM integration, full-stack engineering, and DevOps in one practical tool.',
    stack: ['Node.js', 'Express', 'GPT-4o API', 'React', 'Redis', 'GitHub OAuth', 'PostgreSQL', 'Docker', 'GitHub Actions', 'AWS EC2'],
    featured: true,
    embed: null,
  },
  {
    title: 'Distributed Task Scheduler',
    eyebrow: 'Planned build · Distributed systems',
    status: 'Planned · July 2026',
    statusColor: 'text-signal-cyan',
    href: 'https://github.com/PubuduGunasekara',
    demo: null,
    body: 'Production-scale task scheduler built on Kafka. Processes 10,000 tasks/min at p99 <50ms across 3 worker nodes. Redis distributed locking prevents duplicate execution across workers. Full Prometheus + Grafana monitoring dashboard.',
    challenge: 'Design fault-tolerant distributed execution with exponential backoff retry, dead-letter queues, and horizontal scaling without duplicate task runs.',
    impact: 'A focused systems project for practicing Kafka, distributed locks, retries, monitoring, and failure handling in a realistic backend setting.',
    stack: ['Java 21', 'Spring Boot 3', 'Apache Kafka', 'Redis', 'PostgreSQL', 'Docker Compose', 'Prometheus', 'Grafana', 'JUnit 5', 'Testcontainers'],
    featured: false,
    embed: null,
  },
  {
    title: 'IoT Smart Farm System',
    eyebrow: 'Identity project · v2 coming August',
    status: 'Complete / evolving',
    statusColor: 'text-signal-amber',
    href: 'https://github.com/PubuduGunasekara/smart-farm-1.1.0',
    demo: 'https://www.linkedin.com/posts/pubudugunasekera_informationtechnology-project-teamleadership-ugcPost-6794005940980072448-amQm',
    body: 'Led a team building a Smart Farm system around NodeMCU sensors, Firebase real-time data, and React Native monitoring. Connected embedded hardware, cloud-backed state, and mobile UX into a working agricultural automation prototype. v2 adds ML anomaly detection.',
    challenge: 'Coordinate hardware, mobile software, real-time data pipelines, and team execution into one reliable system with sub-second sensor response.',
    impact: 'My first major team leadership project, connecting hardware, software, and cloud layers. It now sets up the ML Anomaly Detection platform planned for August 2026.',
    stack: ['NodeMCU', 'IoT', 'React Native', 'Firebase', 'Android', 'iOS', 'real-time monitoring', 'team leadership'],
    featured: false,
    embed: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:6794005940980072448?compact=1',
  },
  {
    title: 'ML Anomaly Detection Platform',
    eyebrow: 'Planned build · Smart Farm v2',
    status: 'Planned · August 2026',
    statusColor: 'text-signal-cyan',
    href: links.github,
    demo: null,
    body: 'Extension of Smart Farm v1 that adds production ML. Isolation Forest and LSTM time-series models detect sensor anomalies in real time. A FastAPI inference service streams updates over WebSockets, while the React Native dashboard sends Firebase Cloud Messaging alerts.',
    challenge: 'Translate ML model outputs into reliable real-time software with <50ms inference latency, observable pipelines, and mobile-first alerting.',
    impact: 'A practical bridge between software engineering and ML: real-time inference, mobile alerts, IoT data, and an automated retraining workflow.',
    stack: ['Python', 'FastAPI', 'scikit-learn', 'TensorFlow/Keras', 'React Native', 'Firebase', 'WebSockets', 'Docker', 'GitHub Actions', 'AWS S3'],
    featured: false,
    embed: null,
  },
  {
    title: 'Cloud Dealership Platform',
    eyebrow: 'Infrastructure and delivery',
    status: 'Complete',
    statusColor: 'text-signal-green',
    href: 'https://github.com/PubuduGunasekara/xrwvm-fullstack_developer_capstone',
    demo: null,
    body: 'Full-stack dealership review platform with containerised services, CI/CD automation, Kubernetes orchestration, and IBM Cloud Code Engine deployment. React frontend, Django + Node.js backend, MongoDB persistence.',
    challenge: 'Move beyond application code into deployment, infrastructure, and production-style delivery with full CI/CD automation.',
    impact: 'Shows cloud engineering, Kubernetes orchestration, and release automation across a multi-service architecture on IBM Cloud.',
    stack: ['React', 'Node.js', 'Django', 'MongoDB', 'Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'IBM Cloud'],
    featured: false,
    embed: null,
  },
  {
    title: 'Multi-User MERN Application',
    eyebrow: 'Full-stack product engineering',
    status: 'Complete',
    statusColor: 'text-signal-green',
    href: 'https://github.com/PubuduGunasekara/Multi-User-Blog',
    demo: null,
    body: 'Multi-user blogging platform with JWT authentication, role-based access, REST API design, and Next.js server-side rendering for SEO. Redux state management, MongoDB Atlas for scalable data persistence.',
    challenge: 'Design a coherent full-stack architecture with clear user flows, secure auth, and maintainable service boundaries.',
    impact: 'Full MERN delivery across UI, APIs, auth, and data persistence with SSR. Demonstrates clean full-stack architecture with JWT authentication, role-based access, and production patterns applied to a real multi-user product.',
    stack: ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'Redux', 'JWT', 'REST APIs', 'SEO'],
    featured: false,
    embed: null,
  },
];

const prep: Array<[string, string, string]> = [
  ['LeetCode', '90 / 800+ target', 'Java-first DSA practice with NeetCode 150, company-tagged problems, and weekly review.'],
  ['Daily rhythm', '3-6 hrs/day', 'Roadmap cadence: DSA every day, focused project work, alternating system design and behavioral preparation.'],
  ['Applications', '100+ thoughtful targets', 'Organizing referrals, alumni outreach, targeted applications, and interview follow-ups without making the portfolio feel numbers-only.'],
];

const plannedBuilds = [
  {
    name: 'AI Code Review Assistant',
    stack: 'Node.js · GPT-4o · React · Redis',
    timing: 'Week 1',
    status: 'Currently building',
  },
  {
    name: 'Distributed Task Scheduler',
    stack: 'Java · Kafka · Redis · Grafana',
    timing: 'July',
    status: 'Next build',
  },
  {
    name: 'ML Anomaly Detection',
    stack: 'Python · FastAPI · React Native · TensorFlow',
    timing: 'August',
    status: 'Next build',
  },
];

const leadership = [
  'Graduate Leadership Institute (GLI), Northeastern University, Silicon Valley',
  'CliftonStrengths assessment, understanding personal strengths in team contexts',
  'Led Smart Farm IoT project team: coordinated hardware, software, and cloud execution',
  '1st Place, NSBM Green University overnight hackathon',
  'Led QA sub-team at Virtusa across AU / UK / LK sprint cycles',
  'Delivered client-facing demos at Virtusa that secured continued BT project investment',
];

const certifications: Array<[string, string, string]> = [
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

const education = [
  {
    school: 'Northeastern University',
    program: 'M.S. Computer Science',
    meta: 'Silicon Valley, CA · Jan 2026 - Dec 2027',
    detail: 'Completed: Algorithms, Programming Design Paradigm (Java). Planned: Machine Learning, NLP.',
    logo: brandAssets.northeastern,
    mark: 'NU',
  },
  {
    school: 'Conestoga College',
    program: 'Ontario Graduate Certificate - Mobile Solutions Development',
    meta: 'Kitchener, Canada · 2022 - 2023',
    detail: 'GPA: 3.74 / 4.0.',
    logo: brandAssets.conestoga,
    mark: 'CC',
  },
  {
    school: 'Victoria University Melbourne',
    program: 'Bachelor of Information Technology',
    meta: 'Melbourne, Australia · 2018 - 2021',
    detail: 'Web and Mobile Application Development. GPA: 6.25 / 7.0.',
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

export default function Page() {
  const [theme, setTheme] = useState<Theme>('light');
  const [github, setGithub] = useState({ public_repos: 64 });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('theme') as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    fetch('https://api.github.com/users/PubuduGunasekara')
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setGithub({ public_repos: data.public_repos || 64 }))
      .catch(() => setGithub({ public_repos: 64 }));
  }, []);

  const pageTone = theme === 'dark'
    ? 'bg-ink-950 text-ink-100'
    : 'light bg-[#f6f7fb] text-ink-950';

  const surface = theme === 'dark'
    ? 'border-white/10 bg-white/[0.035]'
    : 'border-black/10 bg-white/70';

  const mobileMenuSurface = theme === 'dark'
    ? 'border-white/15 bg-ink-950/95 text-ink-100 shadow-2xl shadow-black/40'
    : 'border-black/10 bg-white/95 text-ink-950 shadow-2xl shadow-slate-200/70';

  const mobileMenuItem = theme === 'dark'
    ? 'text-ink-200 hover:bg-white/10 hover:text-signal-cyan'
    : 'text-ink-700 hover:bg-signal-cyan/10 hover:text-ink-950';

  const muted = theme === 'dark' ? 'text-ink-300' : 'text-ink-500';

  return (
    <main className={`${pageTone} min-h-screen transition-colors duration-500`}>
      <div className="premium-grid fixed inset-0 opacity-60" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(125,211,252,0.12),transparent_30rem)]" />

      <nav className="sticky top-0 z-50 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 backdrop-blur-xl sm:px-8">
        <a href="#top" className="flex items-center gap-3 font-mono text-sm tracking-tight">
          <img src="/assets/pg-mark.svg" alt="" className="h-8 w-8" />
          <span className="hidden sm:inline">pubudugunasekara.dev</span>
        </a>
        <div className={`hidden rounded-full border px-3 py-2 text-xs ${surface} md:flex md:gap-4`}>
          {nav.map((item) => (
            <a key={item.id} href={`#${item.id}`} className={`${muted} transition hover:text-signal-cyan`}>
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition hover:border-signal-cyan md:hidden ${surface}`}
          >
            <MenuIcon open={menuOpen} />
          </button>
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`rounded-full border px-3 py-2 font-mono text-xs transition hover:border-signal-cyan ${surface}`}
          >
            {theme === 'dark' ? 'light' : 'dark'}
          </button>
        </div>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`absolute left-5 right-5 top-[4.75rem] rounded-3xl border p-2 backdrop-blur-xl md:hidden ${mobileMenuSurface}`}
          >
            <div className="grid grid-cols-2 gap-1">
              {nav.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${mobileMenuItem}`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </nav>

      <div id="top" className="relative mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8 lg:pt-24">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end"
        >
          <div>
            <p className="mb-5 font-mono text-sm text-signal-cyan">Software engineering · cloud · ML systems</p>
            <h1 className="max-w-4xl text-balance text-6xl font-semibold tracking-[-0.075em] sm:text-7xl lg:text-8xl">
              Pubudu Gunasekara
            </h1>
            <p className={`mt-7 max-w-3xl text-balance text-xl leading-8 ${muted}`}>
              M.S. in Computer Science at Northeastern University, Silicon Valley. I&apos;m focused on
              building distributed systems and AI-powered products. Previously worked as an SDET at
              Virtusa on a British Telecom platform with over{' '}
              <span className="text-signal-green font-medium">1M users</span>
              {', '}where I helped reduce regression testing by{' '}
              <span className="text-signal-green font-medium">80%</span>.
            </p>
            <HeroActions />
          </div>

          <aside className={`rounded-3xl border p-5 shadow-premium ${surface}`}>
            <div className="flex items-center gap-4">
              <img src="/assets/profile.png" alt="Pubudu Gunasekara" className="h-20 w-20 rounded-2xl border border-slate-500/15 object-cover object-[center_28%]" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-signal-green opacity-75" />
                    <span className="recording-dot relative inline-flex h-2.5 w-2.5 rounded-full bg-signal-green" />
                  </span>
                  <p className="font-mono text-xs text-signal-green font-medium">
                    Open to SWE Internship · Jan 2027
                  </p>
                </div>
                <p className={`mt-2 text-sm ${muted}`}>San Jose, CA · Northeastern Silicon Valley</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Metric
                value={<AnimatedCounter target={github.public_repos} suffix="" />}
                label="GitHub repos"
              />
              <Metric
                value={<><AnimatedCounter target={1} suffix="M+" /></>}
                label="BT users served"
              />
              <Metric
                value={<><AnimatedCounter target={80} suffix="%" /></>}
                label="test time reduced"
              />
              <Metric
                value={<><AnimatedCounter target={90} suffix="/800+" /></>}
                label="LeetCode progress"
              />
            </div>
          </aside>
        </motion.header>

        <Section id="story" eyebrow="01" title="Story">
          <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
            <div className="grid gap-4">
              {storyPoints.map((item, index) => (
                <StoryRow key={item.title} item={item} index={index} surface={surface} muted={muted} />
              ))}
            </div>
            <StoryVisual surface={surface} muted={muted} />
          </div>
        </Section>

        <Section id="experience" eyebrow="02" title="Experience">
          <div className="grid gap-4">
            {experience.map((item) => (
              <EditorialCard key={item.role} surface={surface}>
                <div className="grid gap-6 md:grid-cols-[13rem_1fr]">
                  <div>
                    <BrandLogo src={item.logo} alt={`${item.company} logo`} mark={item.mark} />
                    <p className="mt-4 font-mono text-xs text-signal-cyan">{item.period}</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight">{item.role}</h3>
                    <p className="mt-1 text-signal-blue">{item.company}</p>
                    <p className={`mt-4 leading-7 ${muted}`}>{item.body}</p>
                    <TagList items={item.focus} />
                    {item.highlight && (
                      <p className="mt-4 font-mono text-xs text-signal-green">{item.highlight}</p>
                    )}
                  </div>
                </div>
              </EditorialCard>
            ))}
          </div>
        </Section>

        <Section id="skills" eyebrow="03" title="Skills">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {skills.map(([category, list]) => (
              <EditorialCard key={category} surface={surface}>
                <h3 className="font-mono text-sm text-signal-cyan">{category}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {list.map((skill) => <Skill key={skill}>{skill}</Skill>)}
                </div>
              </EditorialCard>
            ))}
          </div>
        </Section>

        <Section id="projects" eyebrow="04" title="Featured Projects">
          <div className="grid gap-5">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} surface={surface} muted={muted} />
            ))}
          </div>
        </Section>

        <Section id="prep" eyebrow="05" title="Internship Preparation">
          <div className="grid gap-4 md:grid-cols-3">
            {prep.map(([title, metric, body]) => (
              <EditorialCard key={title} surface={surface}>
                <p className="font-mono text-xs text-signal-amber">{metric}</p>
                <h3 className="mt-4 text-xl font-semibold tracking-tight">{title}</h3>
                <p className={`mt-3 leading-7 ${muted}`}>{body}</p>
              </EditorialCard>
            ))}
          </div>
          <div className="mt-5 grid gap-3">
            <p className={`font-mono text-xs ${muted}`}>active build pipeline</p>
            {plannedBuilds.map((build) => (
              <EditorialCard key={build.name} surface={surface}>
                <div className="grid gap-3 md:grid-cols-[1fr_1.1fr_9rem_9rem] md:items-center">
                  <p className="text-lg font-semibold tracking-tight">{build.name}</p>
                  <p className={`font-mono text-xs ${muted}`}>{build.stack}</p>
                  <p className="font-mono text-xs text-signal-amber">{build.timing}</p>
                  <p className={`font-mono text-xs ${build.status === 'Currently building' ? 'text-signal-green' : 'text-signal-cyan'}`}>
                    {build.status}
                  </p>
                </div>
              </EditorialCard>
            ))}
          </div>
        </Section>

        <Section id="leadership" eyebrow="06" title="Leadership & Growth">
          <EditorialCard surface={surface}>
            <p className={`max-w-3xl leading-8 ${muted}`}>
              Leadership has been a constant thread: from winning a hackathon overnight to leading cross-country QA teams at Virtusa on a 1M+ user production platform, to coordinating hardware, software, and cloud teams on the Smart Farm project. Now developing structured leadership frameworks through Northeastern&apos;s Graduate Leadership Institute.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {leadership.map((item) => (
                <p key={item} className={`rounded-2xl border px-4 py-3 text-sm ${surface}`}>{item}</p>
              ))}
            </div>
          </EditorialCard>
        </Section>

        <Section id="education" eyebrow="07" title="Education">
          <div className="grid gap-4">
            {education.map((item) => (
              <EditorialCard key={item.school} surface={surface}>
                <div className="grid gap-5 md:grid-cols-[14rem_1fr_1.1fr] md:items-center">
                  <BrandLogo src={item.logo} alt={`${item.school} logo`} mark={item.mark} wide />
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">{item.school}</h3>
                    <p className="mt-1 text-signal-blue">{item.program}</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-signal-cyan">{item.meta}</p>
                    <p className={`mt-3 ${muted}`}>{item.detail}</p>
                  </div>
                </div>
              </EditorialCard>
            ))}
          </div>
        </Section>

        <Section id="certifications" eyebrow="08" title="Certifications">
          <div className="grid gap-3 md:grid-cols-2">
            {certifications.map(([name, issuer, href], index) => (
              <a key={name} href={href} target="_blank" rel="noreferrer">
                <EditorialCard surface={surface} className={index < 5 ? 'border-signal-cyan/30' : ''}>
                  <p className="text-lg font-semibold tracking-tight">{name}</p>
                  <p className={`mt-2 text-sm ${muted}`}>{issuer}</p>
                </EditorialCard>
              </a>
            ))}
          </div>
        </Section>

        <Section id="contact" eyebrow="09" title="Contact">
          <EditorialCard surface={surface}>
            <h2 className="text-4xl font-semibold tracking-[-0.045em]">Let&apos;s build useful systems.</h2>
            <p className={`mt-5 max-w-2xl leading-8 ${muted}`}>
              I&apos;m seeking Software Engineering, Full-Stack, Backend, Cloud, and Machine Learning internships starting January 2027.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryLink href={links.resume}>Resume</PrimaryLink>
              <SocialIconLink href={links.linkedin} label="LinkedIn" icon="linkedin" />
              <SocialIconLink href={links.github} label="GitHub" icon="github" />
              <SocialIconLink href={links.leetcode} label="LeetCode" icon="leetcode" />
              <SocialIconLink href={links.email} label="Email" icon="email" />
            </div>
          </EditorialCard>
        </Section>

        <footer className={`border-t border-slate-500/15 py-10 text-sm ${muted}`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Pubudu Gunasekara. All rights reserved.</p>
            <p className="font-mono text-xs">Built May 2026 · Next.js · TypeScript · GitHub Pages</p>
          </div>
        </footer>
      </div>
    </main>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="grid gap-8 border-t border-slate-500/15 py-20 md:grid-cols-[12rem_1fr]"
    >
      <div>
        <p className="font-mono text-xs text-signal-cyan">{eyebrow}</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      <div>{children}</div>
    </motion.section>
  );
}

function EditorialCard({
  surface,
  children,
  className = '',
}: {
  surface: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl border p-5 shadow-premium transition duration-300 hover:-translate-y-0.5 hover:border-signal-cyan/40 sm:p-6 ${surface} ${className}`}>
      {children}
    </div>
  );
}

function StoryRow({
  item,
  index,
  surface,
  muted,
}: {
  item: { label: string; title: string; body: string };
  index: number;
  surface: string;
  muted: string;
}) {
  const accents = ['text-signal-cyan', 'text-signal-green', 'text-signal-blue', 'text-signal-amber'];
  return (
    <EditorialCard surface={surface}>
      <div className="grid gap-5 md:grid-cols-[11rem_1fr]">
        <p className={`font-mono text-xs ${accents[index]}`}>{item.label}</p>
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">{item.title}</h3>
          <p className={`mt-3 leading-7 ${muted}`}>{item.body}</p>
        </div>
      </div>
    </EditorialCard>
  );
}

function StoryVisual({ surface, muted }: { surface: string; muted: string }) {
  const steps = ['Sri Lanka', 'Canada', 'San Jose'];
  const focus = [
    {
      label: 'Backend',
      value: 'Java + Node.js services',
      detail: 'Strengthening API design, service boundaries, and production-style backend thinking.',
    },
    {
      label: 'Cloud',
      value: 'Docker + Kubernetes',
      detail: 'Turning full-stack projects into deployable systems with CI/CD and observable infrastructure.',
    },
    {
      label: 'ML/NLP',
      value: 'Fall 2026 focus',
      detail: 'Preparing for Machine Learning and NLP coursework through practical AI-assisted systems.',
    },
    {
      label: 'Interviewing',
      value: '90 / 800+ LeetCode',
      detail: 'Java-first DSA, weekly review, company-tagged practice, and project-based preparation.',
    },
  ];
  const [active, setActive] = useState(0);

  return (
    <EditorialCard surface={surface} className="h-full">
      <p className="font-mono text-xs text-signal-green">engineering path</p>
      <div className="mt-8 space-y-5">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-4">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-signal-cyan/30 bg-signal-cyan/10 font-mono text-xs text-signal-cyan">
              {index + 1}
              {index < steps.length - 1 && <span className="absolute left-1/2 top-9 h-9 w-px bg-slate-500/20" />}
            </div>
            <p className="text-sm font-medium">{step}</p>
          </div>
        ))}
      </div>
      <div className={`mt-8 rounded-2xl border border-slate-500/15 p-4 text-sm leading-6 ${muted}`}>
        Full-stack systems, cloud delivery, automation, and a current turn toward ML/NLP systems.
      </div>
      <div className="mt-5">
        <p className="font-mono text-xs text-signal-cyan">current focus</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {focus.map((item, index) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setActive(index)}
              className={`rounded-2xl border px-3 py-2 text-left text-xs transition ${active === index ? 'border-signal-cyan/50 bg-signal-cyan/10 text-signal-cyan' : 'border-slate-500/15 opacity-75 hover:border-signal-cyan/30 hover:opacity-100'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-3 rounded-2xl border border-slate-500/15 p-4">
          <p className="text-sm font-semibold tracking-tight">{focus[active].value}</p>
          <p className={`mt-2 text-sm leading-6 ${muted}`}>{focus[active].detail}</p>
        </div>
      </div>
    </EditorialCard>
  );
}

function ProjectCard({
  project,
  index,
  surface,
  muted,
}: {
  project: {
    title: string;
    eyebrow: string;
    status: string;
    statusColor?: string;
    href: string;
    body: string;
    challenge: string;
    impact: string;
    stack: string[];
    featured?: boolean;
    embed?: string | null;
    demo?: string | null;
  };
  index: number;
  surface: string;
  muted: string;
}) {
  return (
    <EditorialCard surface={surface} className={project.featured ? 'border-signal-cyan/40 bg-signal-cyan/[0.035]' : ''}>
      <div className="grid gap-7 lg:grid-cols-[1fr_16rem]">
        <div>
          <p className="font-mono text-xs text-signal-cyan">0{index + 1} / {project.eyebrow}</p>
          <h3 className="mt-4 text-3xl font-semibold tracking-[-0.045em]">{project.title}</h3>
          <p className={`mt-4 leading-7 ${muted}`}>{project.body}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <p className={`text-sm leading-6 ${muted}`}><span className="font-semibold text-current">Challenge: </span>{project.challenge}</p>
            <p className={`text-sm leading-6 ${muted}`}><span className="font-semibold text-current">Impact: </span>{project.impact}</p>
          </div>
          <TagList items={project.stack} />
          {project.embed && (
            <div className="mt-7 overflow-hidden rounded-3xl border border-slate-500/15 bg-slate-500/10">
              <iframe
                src={project.embed}
                title={`${project.title} LinkedIn demo`}
                className="h-[399px] w-full"
                allowFullScreen
              />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between gap-6">
          <p className={`font-mono text-xs ${project.statusColor || 'text-signal-amber'}`}>{project.status}</p>
          <div className="flex flex-col gap-3">
            <SecondaryLink href={project.href}>GitHub</SecondaryLink>
            {project.demo && <SecondaryLink href={project.demo}>Demo post</SecondaryLink>}
          </div>
        </div>
      </div>
    </EditorialCard>
  );
}

function Metric({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-500/15 bg-slate-500/10 p-4">
      <p className="font-mono text-2xl">{value}</p>
      <p className="mt-1 text-xs opacity-70">{label}</p>
    </div>
  );
}

function AnimatedCounter({
  target,
  duration = 1800,
  suffix = '',
  prefix = '',
}: {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {items.map((item) => <Skill key={item}>{item}</Skill>)}
    </div>
  );
}

function Skill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-500/15 bg-slate-500/10 px-3 py-1.5 font-mono text-xs opacity-80 transition hover:border-signal-cyan/40 hover:opacity-100">
      <TechMark name={children} />
      {children}
    </span>
  );
}

function TechMark({ name }: { name: string }) {
  const compact = name
    .replace(/[^a-zA-Z0-9+\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <svg aria-hidden="true" viewBox="0 0 28 28" className="h-4 w-4 shrink-0 text-signal-cyan/70">
      <circle cx="14" cy="14" r="12" fill="currentColor" opacity="0.12" />
      <circle cx="14" cy="14" r="11.5" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <text x="14" y="17" textAnchor="middle" className="fill-current text-[9px] font-semibold">
        {compact || '•'}
      </text>
    </svg>
  );
}

function BrandLogo({
  src,
  alt,
  mark,
  wide = false,
}: {
  src?: string;
  alt: string;
  mark: string;
  wide?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`flex items-center justify-center rounded-2xl border border-slate-300 bg-white p-3 shadow-sm ${wide ? 'h-16 w-full' : 'h-14 w-14'}`}>
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className={`${wide ? 'max-h-9 max-w-[10rem]' : 'max-h-9 max-w-9'} object-contain opacity-90 transition hover:opacity-100`}
        />
      ) : (
        <span className="font-mono text-sm text-signal-cyan">{mark}</span>
      )}
    </div>
  );
}

function HeroActions() {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <PrimaryLink href={links.resume}>Resume</PrimaryLink>
      <div className="flex rounded-full border border-slate-500/15 bg-slate-500/10 p-1">
        <SocialIconLink href={links.github} label="GitHub" icon="github" />
        <SocialIconLink href={links.linkedin} label="LinkedIn" icon="linkedin" />
        <SocialIconLink href={links.leetcode} label="LeetCode" icon="leetcode" />
        <SocialIconLink href={links.email} label="Email" icon="email" />
      </div>
    </div>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      {open ? (
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m6 6 12 12M18 6 6 18" />
      ) : (
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
      )}
    </svg>
  );
}

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      className="inline-flex items-center gap-2 rounded-full bg-signal-cyan px-5 py-3 text-sm font-semibold text-ink-950 shadow-[0_12px_35px_rgba(34,211,238,0.22)] transition hover:-translate-y-0.5 hover:bg-ink-100"
    >
      <ResumeIcon />
      {children}
    </a>
  );
}

function SocialIconLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: 'github' | 'linkedin' | 'leetcode' | 'email';
}) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-current/70 transition hover:bg-signal-cyan/10 hover:text-signal-cyan"
    >
      <SocialIcon icon={icon} />
    </a>
  );
}

function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      className="rounded-full border border-slate-500/15 bg-slate-500/10 px-5 py-3 text-sm transition hover:border-signal-cyan/40 hover:text-signal-cyan"
    >
      {children}
    </a>
  );
}

function ResumeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="currentColor" d="M6 2.75A2.75 2.75 0 0 0 3.25 5.5v13A2.75 2.75 0 0 0 6 21.25h12a2.75 2.75 0 0 0 2.75-2.75v-8.38a2.75 2.75 0 0 0-.8-1.94l-4.13-4.13a2.75 2.75 0 0 0-1.94-.8H6Zm7.75 1.76c.36.05.7.22.96.48l4.3 4.3c.26.26.43.6.48.96h-3.24a2.5 2.5 0 0 1-2.5-2.5V4.51ZM7 13.25h10a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1 0-1.5Zm0 3h7a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1 0-1.5Z" />
    </svg>
  );
}

function SocialIcon({ icon }: { icon: 'github' | 'linkedin' | 'leetcode' | 'email' }) {
  if (icon === 'github') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path fill="currentColor" d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.34-3.79-1.34-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .1 2.63.71 3.27-.45.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.29-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.15a10.7 10.7 0 0 1 5.64 0c2.15-1.45 3.1-1.15 3.1-1.15.61 1.55.23 2.69.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.32-2.63 5.27-5.14 5.55.4.35.76 1.04.76 2.1v3.11c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z" />
      </svg>
    );
  }

  if (icon === 'linkedin') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path fill="currentColor" d="M5.36 6.93a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.58 21h3.55V8.4H3.58V21Zm5.97 0h3.55v-6.67c0-1.78.85-2.84 2.3-2.84 1.33 0 1.98.92 1.98 2.84V21h3.54v-7.4c0-3.64-1.94-5.45-4.66-5.45-2.15 0-3.11 1.18-3.64 2.01h-.05V8.4H9.55V21Z" />
      </svg>
    );
  }

  if (icon === 'leetcode') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="m13.9 4.2-7.1 7.1a3.8 3.8 0 0 0 0 5.4l2.2 2.2a3.8 3.8 0 0 0 5.4 0l1.1-1.1M9.6 12h9.3M14.3 4.7l2.2 2.2" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="currentColor" d="M4.75 5h14.5A2.75 2.75 0 0 1 22 7.75v8.5A2.75 2.75 0 0 1 19.25 19H4.75A2.75 2.75 0 0 1 2 16.25v-8.5A2.75 2.75 0 0 1 4.75 5Zm.24 1.5 6.31 5.22c.41.34.99.34 1.4 0l6.31-5.22H4.99Zm15.51 1.38-6.84 5.66a2.6 2.6 0 0 1-3.32 0L3.5 7.88v8.37c0 .69.56 1.25 1.25 1.25h14.5c.69 0 1.25-.56 1.25-1.25V7.88Z" />
    </svg>
  );
}
