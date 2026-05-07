# Pubudu Gunasekara Portfolio

A focused React portfolio for GitHub Pages, built to present Pubudu as an active SWE internship candidate for January 2027.

## Run Locally

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Deploy Options

### Option 1: GitHub Actions

Copy the contents of this folder into the root of your `PubuduGunasekara.github.io` repository, then push to `main`.

In GitHub, set:

- Repository Settings -> Pages
- Source: GitHub Actions

The workflow in `.github/workflows/deploy.yml` will install dependencies, build the React app, and deploy the `build` folder to GitHub Pages.

### Option 2: gh-pages package

This project is also configured for the `gh-pages` package:

```bash
npm run deploy
```

## Update Links

All important links are centralized at the top of `src/App.js` in the `LINKS` object:

- Resume
- GitHub
- LinkedIn
- LeetCode
- Email
- Featured project repositories
- Certification verification/source links

## Update Assets

- Profile image: replace `public/assets/profile.jpg`.
- Current resume download: `public/assets/Pubudu_Gunasekara_Resume.md`.
- When your final PDF is ready, add it as `public/assets/Pubudu_Gunasekara_Resume.pdf` and update `resumeDownload` in `src/App.js`.
- Weekly internship-prep progress is stored in the `prep` array in `src/App.js`.

## Notes

- GitHub profile metrics and recent repositories update automatically on page load from the GitHub API.
- LeetCode progress should be updated manually or weekly unless you later add a backend/API workflow.
- Planned project links intentionally use `#` until the repositories or demos are live.
