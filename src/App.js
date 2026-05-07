import { useEffect, useMemo, useState } from 'react';
import './App.css';

const GITHUB = 'https://github.com/PubuduGunasekara';
const LINKEDIN = 'https://www.linkedin.com/in/pubudugunasekera/';
const LEETCODE = 'https://leetcode.com/u/pubuduguna/';
const EMAIL = 'hello@pubudugunasekara.com';

const LINKS = {
  linkedin: LINKEDIN,
  github: GITHUB,
  leetcode: LEETCODE,
  email: `mailto:${EMAIL}`,
  resumeDownload: `${process.env.PUBLIC_URL}/assets/Pubudu_Gunasekara_Resume.md`,
  projects: {
    aiReview: `${GITHUB}?tab=repositories`,
    scheduler: '#',
    smartFarm: `${GITHUB}?tab=repositories&q=smart+farm`,
    carDealership: `${GITHUB}?tab=repositories&q=car`,
    smartTravel: 'https://github.com/PubuduGunasekara/SmartTravelPlanner',
    blog: 'https://github.com/PubuduGunasekara/Multi-User-Blog',
    foodOrdering: 'https://github.com/PubuduGunasekara/Virtual-Food-Ordering-and-Maintainance-management-System',
  },
  certs: {
    azure: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/',
    ibmFullStack: 'https://www.coursera.org/professional-certificates/ibm-full-stack-cloud-developer',
    metaAndroid: 'https://www.coursera.org/professional-certificates/meta-android-developer',
    pythonEverybody: 'https://www.coursera.org/specializations/python',
    kotlinCore: 'https://hyperskill.org/tracks/18',
    sqlIntro: 'https://hyperskill.org/tracks/31',
    ibmSoftSkills: 'https://www.coursera.org/professional-certificates/people-and-soft-skills-for-professional-and-personal-success',
  },
};

const navItems = ['experience', 'skills', 'projects', 'prep', 'education', 'contact'];

const experience = [
  {
    date: '2021 — 2022',
    title: 'SDET — Associate Automation QA Engineer',
    company: 'Virtusa (Pvt) Ltd',
    context: 'Client: British Telecom (BT PLC), production platform serving 1M+ users',
    body:
      'Built Java and Selenium automation from scratch, reduced regression testing from 4 hours to 45 minutes, coordinated QA delivery across Sri Lanka, UK, and Australia teams, and supported Jenkins nightly test automation.',
    stack: ['Java', 'Selenium', 'Jenkins', 'TestNG', 'JIRA', 'Git'],
  },
];

const skills = [
  {
    title: 'Primary Stack',
    body: 'Java is my main engineering language. JavaScript, React, and Node.js are my practical full-stack stack.',
    items: ['Java', 'Spring Boot', 'JavaScript', 'React', 'Node.js', 'REST APIs', 'PostgreSQL'],
  },
  {
    title: 'Software Engineering Depth',
    body: 'The areas I am actively developing through coursework, projects, and interview preparation.',
    items: ['Algorithms', 'OOP', 'Distributed Systems', 'Docker', 'GitHub Actions', 'Kafka', 'Redis'],
  },
  {
    title: 'Quality and Delivery',
    body: 'Production QA experience gives me a strong foundation in reliability, testing, and release discipline.',
    items: ['Selenium', 'Jenkins', 'JUnit', 'TestNG', 'CI/CD', 'JIRA', 'Git'],
  },
];

const projects = [
  {
    title: 'AI Code Review Assistant',
    type: 'AI developer tooling',
    date: 'May — June 2026',
    status: 'Building',
    body:
      'GitHub PR reviewer using GPT-4o, OAuth, diff parsing, inline AI comments, Redis rate limits, PostgreSQL persistence, Docker, CI/CD, and AWS EC2 deployment.',
    signal: 'Designed for real PR diffs and sub-2s feedback latency.',
    stack: ['React', 'Node.js', 'Express', 'GPT-4o API', 'PostgreSQL', 'Redis', 'Docker'],
    href: LINKS.projects.aiReview,
  },
  {
    title: 'Distributed Task Scheduler',
    type: 'Backend systems',
    date: 'July — August 2026',
    status: 'Planned',
    body:
      'Kafka-backed scheduler with worker nodes, Redis distributed locking, PostgreSQL job state, observability dashboards, and integration tests.',
    signal: 'Target: 10,000 tasks/min, p99 <50ms, 3 worker nodes.',
    stack: ['Java 21', 'Spring Boot', 'Kafka', 'Redis', 'PostgreSQL', 'JUnit'],
    href: LINKS.projects.scheduler,
  },
  {
    title: 'Smart Farm IoT + ML Platform',
    type: 'IoT and applied ML',
    date: 'v2 planned Aug 2026',
    status: 'Complete + v2 planned',
    body:
      'React Native smart farm app connected to Firebase real-time sensor data and a physical IoT unit. v2 adds anomaly detection and WebSocket streaming.',
    signal: 'Combines mobile, real-time data, hardware integration, and ML direction.',
    stack: ['React Native', 'Firebase', 'IoT', 'FastAPI', 'scikit-learn'],
    href: LINKS.projects.smartFarm,
  },
  {
    title: 'Car Dealership Review Platform',
    type: 'Full-stack delivery',
    date: 'Cloud deployment',
    status: 'Complete',
    body:
      'National dealership review platform with React, Node.js, Django, MongoDB, Jenkins, GitHub Actions, Docker, Kubernetes, and IBM Cloud Code Engine.',
    signal: 'Shows CI/CD, containers, orchestration, and full-stack deployment practice.',
    stack: ['React', 'Node.js', 'Django', 'MongoDB', 'Docker', 'Kubernetes'],
    href: LINKS.projects.carDealership,
  },
];

const additionalProjects = [
  ['SmartTravelPlanner', 'Algorithms module final project', LINKS.projects.smartTravel],
  ['Multi-User Blog', 'React/Node full-stack project', LINKS.projects.blog],
  ['Virtual Food Ordering and Maintenance System', 'NSBM Green University project', LINKS.projects.foodOrdering],
];

const prep = [
  {
    title: 'LeetCode and DSA',
    metric: '90 / 800+ target',
    body: 'Java-first preparation using NeetCode 150, company-tagged practice, and weekly contest routines.',
    items: ['Arrays & Strings', 'HashMap', 'Two Pointers', 'Sliding Window', 'Binary Search'],
  },
  {
    title: 'Project Execution',
    metric: '2 active builds',
    body: 'Current focus is shipping the AI Code Review Assistant and designing the Distributed Task Scheduler with measurable backend constraints.',
    items: ['API design', 'rate limits', 'queues', 'observability', 'CI/CD'],
  },
  {
    title: 'Academic Focus',
    metric: 'Spring + Fall 2026',
    body: 'Completed Algorithms and Java Programming Design Paradigm. Planning Machine Learning and Natural Language Processing in fall.',
    items: ['Algorithms', 'Java', 'Machine Learning', 'NLP'],
  },
];

const education = [
  {
    date: 'Jan 2026 — Dec 2027',
    school: 'Northeastern University',
    program: 'M.S. Computer Science',
    place: 'Silicon Valley, CA',
    detail: 'Completed: Algorithms, Programming Design Paradigm — Java. Fall plan: Machine Learning, Natural Language Processing.',
  },
  {
    date: '2022 — 2023',
    school: 'Conestoga College',
    program: 'Ontario Graduate Certificate — Mobile Solutions Development',
    place: 'Kitchener, Ontario, Canada',
    detail: 'GPA: 3.74 / 4.0',
  },
  {
    date: '2018 — 2021',
    school: 'Victoria University Melbourne',
    program: 'Bachelor of Information Technology',
    place: 'Melbourne, Australia',
    detail: 'Web and Mobile Application Development. Score: 6.25 / 7.0',
  },
  {
    date: '2016 — 2017',
    school: 'NIBM Colombo',
    program: 'Higher National Diploma — Software Development',
    place: 'Colombo, Sri Lanka',
    detail: 'National Institute of Business Management',
  },
];

const certifications = [
  ['Microsoft Azure Fundamentals AZ-900', 'Microsoft', LINKS.certs.azure],
  ['IBM Full Stack Software Developer', 'IBM / Coursera', LINKS.certs.ibmFullStack],
  ['Meta Android Developer', 'Meta / Coursera', LINKS.certs.metaAndroid],
  ['Python for Everybody Specialization', 'University of Michigan / Coursera', LINKS.certs.pythonEverybody],
  ['Kotlin Core', 'JetBrains Academy', LINKS.certs.kotlinCore],
  ['Introduction to SQL', 'JetBrains Academy', LINKS.certs.sqlIntro],
  ['People & Soft Skills for Professional Success', 'IBM / Coursera', LINKS.certs.ibmSoftSkills],
];

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [githubUser, setGithubUser] = useState({ public_repos: 64, followers: 0 });
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    Promise.all([
      fetch('https://api.github.com/users/PubuduGunasekara').then((res) => (res.ok ? res.json() : Promise.reject(res))),
      fetch('https://api.github.com/users/PubuduGunasekara/repos?sort=updated&per_page=4').then((res) => (res.ok ? res.json() : Promise.reject(res))),
    ])
      .then(([user, repoData]) => {
        setGithubUser(user);
        setRepos(repoData);
      })
      .catch(() => {
        setGithubUser({ public_repos: 64, followers: 0 });
        setRepos([]);
      });
  }, []);

  const githubLanguages = useMemo(() => {
    const counts = repos.reduce((acc, repo) => {
      if (repo.language) acc[repo.language] = (acc[repo.language] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).slice(0, 4);
  }, [repos]);

  return (
    <div className="app" data-theme={theme}>
      <nav className="topbar" aria-label="Primary navigation">
        <a href="#home" className="brand">pubudu /</a>
        <div className="navlinks">
          {navItems.map((item) => <a key={item} href={`#${item}`}>{item}</a>)}
        </div>
        <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? 'light' : 'dark'}
        </button>
      </nav>

      <main id="home" className="shell">
        <header className="hero">
          <img src={`${process.env.PUBLIC_URL}/assets/profile.jpg`} alt="Pubudu Gunasekara" />
          <div>
            <p className="status">Available for SWE internship · Jan 2027</p>
            <h1>Pubudu Gunasekara</h1>
            <h2>Software engineer focused on Java, React, Node.js, and reliable backend systems.</h2>
            <p>
              M.S. Computer Science student at Northeastern University Silicon Valley.
              Previously at Virtusa, where I worked on a British Telecom production platform serving 1M+ users.
            </p>
            <div className="hero-links">
              <a className="primary-link" href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={LINKS.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={LINKS.leetcode} target="_blank" rel="noreferrer">LeetCode</a>
              <a href="#resume">Resume</a>
            </div>
          </div>
        </header>

        <Section id="experience" number="1" title="Experience">
          {experience.map((item) => <TimelineItem key={item.title} item={item} />)}
        </Section>

        <Section id="skills" number="2" title="Skills">
          <div className="simple-grid">
            {skills.map((group) => (
              <article className="compact-card" key={group.title}>
                <h3>{group.title}</h3>
                <p>{group.body}</p>
                <TagList items={group.items} />
              </article>
            ))}
          </div>
        </Section>

        <Section id="projects" number="3" title="Projects">
          <div className="project-stack">
            {projects.map((project) => <ProjectItem key={project.title} project={project} />)}
          </div>
          <div className="minor-links">
            {additionalProjects.map(([title, context, href]) => (
              <a key={title} href={href} target="_blank" rel="noreferrer">
                <span>{context}</span>
                {title}
              </a>
            ))}
          </div>
        </Section>

        <Section id="prep" number="4" title="Internship Prep">
          <div className="prep-grid">
            {prep.map((item) => (
              <article className="compact-card accent" key={item.title}>
                <span>{item.metric}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <TagList items={item.items} />
              </article>
            ))}
          </div>
          <GitHubStrip user={githubUser} repos={repos} languages={githubLanguages} />
        </Section>

        <Section id="education" number="5" title="Education">
          {education.map((item) => <TimelineItem key={item.school} item={item} />)}
        </Section>

        <Section id="certifications" number="6" title="Certifications">
          <div className="cert-list">
            {certifications.map(([name, issuer, href]) => (
              <a key={name} href={href} target="_blank" rel="noreferrer">
                <strong>{name}</strong>
                <span>{issuer}</span>
              </a>
            ))}
          </div>
        </Section>

        <Section id="resume" number="7" title="Resume">
          <article className="resume-box">
            <div>
              <h3>Resume snapshot</h3>
              <p>Use this for a quick view today. Replace the markdown file with your final PDF when ready.</p>
            </div>
            <div className="hero-links">
              <a href={LINKS.resumeDownload} target="_blank" rel="noreferrer">View resume</a>
              <a className="primary-link" href={LINKS.resumeDownload} download>Download</a>
            </div>
          </article>
        </Section>

        <Section id="contact" number="8" title="Contact">
          <div className="contact">
            <h2>Let’s connect.</h2>
            <p>I’m actively seeking SWE internship opportunities for January 2027.</p>
            <div className="hero-links">
              <a className="primary-link" href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={LINKS.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={LINKS.leetcode} target="_blank" rel="noreferrer">LeetCode</a>
              <a href={LINKS.email}>Email</a>
            </div>
          </div>
        </Section>

        <footer>
          <span>© 2026 Pubudu Gunasekara</span>
          <span>React · GitHub Pages</span>
          <span>{new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
        </footer>
      </main>
    </div>
  );
}

function Section({ id, number, title, children }) {
  return (
    <section id={id} className="section">
      <div className="section-label">
        <span>{number}.</span>
        <h2>{title}</h2>
      </div>
      <div className="section-content">{children}</div>
    </section>
  );
}

function TimelineItem({ item }) {
  return (
    <article className="timeline-item">
      <time>{item.date}</time>
      <div>
        <h3>{item.title || item.school}</h3>
        <p className="muted">{item.company || item.program}</p>
        <p>{item.context || `${item.place}. ${item.detail}`}</p>
        {item.body && <p>{item.body}</p>}
        {item.stack && <TagList items={item.stack} />}
      </div>
    </article>
  );
}

function ProjectItem({ project }) {
  return (
    <article className="project-item">
      <div>
        <p className="meta">{project.type} · {project.date}</p>
        <h3>{project.title}</h3>
        <p>{project.body}</p>
        <p className="signal">{project.signal}</p>
        <TagList items={project.stack} />
      </div>
      <div className="project-side">
        <span>{project.status}</span>
        <a href={project.href} target={project.href === '#' ? undefined : '_blank'} rel={project.href === '#' ? undefined : 'noreferrer'}>
          GitHub
        </a>
      </div>
    </article>
  );
}

function GitHubStrip({ user, repos, languages }) {
  return (
    <article className="github-strip">
      <div>
        <strong>{user.public_repos || 64}</strong>
        <span>public repos</span>
      </div>
      <div>
        <strong>{user.followers || 0}</strong>
        <span>followers</span>
      </div>
      <div>
        <strong>{repos.length || 4}</strong>
        <span>recent repos loaded</span>
      </div>
      <div>
        <strong>{languages.map(([language]) => language).join(' / ') || 'Java / JS'}</strong>
        <span>recent stack signal</span>
      </div>
    </article>
  );
}

function TagList({ items }) {
  return (
    <div className="tags">
      {items.map((item) => <span key={item}>{item}</span>)}
    </div>
  );
}

export default App;
