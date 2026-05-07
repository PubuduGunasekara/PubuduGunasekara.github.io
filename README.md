<h1 align="center">Hi, I'm Pubudu 👋</h1>

<p align="center">
  <b>M.S. Computer Science @ Northeastern University, Silicon Valley</b><br>
  Targeting SWE Internship · January 2027 · San Jose, CA
</p>

<p align="center">
  Premium editorial engineering portfolio built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.
</p>

<p align="center">
  <a href="https://leetcode.com/u/pubuduguna/">
    <img src="https://img.shields.io/badge/LeetCode-pubuduguna-orange?style=flat&logo=leetcode"/>
  </a>
  <a href="https://www.linkedin.com/in/pubudugunasekera/">
    <img src="https://img.shields.io/badge/LinkedIn-connect-blue?style=flat&logo=linkedin"/>
  </a>
  <a href="https://pubudugunasekara.github.io">
    <img src="https://img.shields.io/badge/Portfolio-live-brightgreen?style=flat"/>
  </a>
</p>

---

### 🔨 Currently Building

| Project | Stack | Status |
|---|---|---|
| 🤖 AI Code Review Assistant | Node.js · GPT-4o · React · Redis | 🟡 Currently building |
| ⚙️ Distributed Task Scheduler | Java · Kafka · Redis · Grafana | 🔵 July |
| 📡 ML Anomaly Detection | Python · FastAPI · React Native · TensorFlow | 🔵 August |

### 🛠 Stack

`Java` `JavaScript` `TypeScript` `React` `Next.js` `Node.js` `Spring Boot` `Docker` `Kubernetes` `Python`

### 💼 Previously

**SDET @ Virtusa** — British Telecom project · 1M+ users · 80% test time reduction

### 📊 Current Prep

Java-first DSA · 90 / 800+ LeetCode target · Backend, cloud, and ML/NLP systems focus

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Next.js is configured with `output: 'export'`, so the production static site is generated into `out/`.

## Deploy

### GitHub Actions

Push to `main` and set:

- Repository Settings -> Pages
- Source: GitHub Actions

The workflow at `.github/workflows/deploy.yml` builds the app and deploys the `out/` folder.

### Manual gh-pages deploy

```bash
npm run deploy
```

## Update Content

Most content lives in `app/page.tsx`:

- Hero links
- Story
- Experience
- Skills
- Projects
- Internship preparation
- Leadership
- Education
- Certifications
- Writing topics

## Update Assets

- Profile image: `public/assets/profile.jpg`
- Northeastern logo: `public/assets/northeastern-logo.png`
- Site mark: `public/assets/pg-mark.svg`
- Resume placeholder: `public/assets/Pubudu_Gunasekara_Resume.md`
- When the final PDF is ready, add it to `public/assets/` and update the `links.resume` value in `app/page.tsx`.

## Notes

- GitHub repo count loads from the GitHub API on page load.
- Certification links currently point to official source pages. Replace them with exact credential verification URLs when available.
- Planned project links can be updated when the repositories are live.
