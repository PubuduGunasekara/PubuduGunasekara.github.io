import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        ink: {
          950: '#05070d',
          900: '#0a0d14',
          850: '#10141d',
          800: '#171c27',
          700: '#242b38',
          500: '#687386',
          300: '#a8b0bf',
          100: '#eef2f7',
        },
        signal: {
          blue: '#9db8ff',
          cyan: '#7dd3fc',
          green: '#86efac',
          amber: '#f6d58c',
        },
      },
      boxShadow: {
        premium: '0 24px 80px rgba(0,0,0,0.28)',
      },
    },
  },
  plugins: [],
};

export default config;
