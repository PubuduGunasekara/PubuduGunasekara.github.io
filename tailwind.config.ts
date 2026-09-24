import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        ink: {
          950: '#121c21',
          900: '#17232a',
          850: '#1d2c33',
          800: '#283a42',
          700: '#3f5760',
          500: '#7c8e92',
          300: '#a9b6b5',
          100: '#f6f2ea',
        },
        signal: {
          blue: 'rgb(var(--signal-blue) / <alpha-value>)',
          cyan: 'rgb(var(--signal-cyan) / <alpha-value>)',
          green: 'rgb(var(--signal-green) / <alpha-value>)',
          amber: 'rgb(var(--signal-amber) / <alpha-value>)',
          red: 'rgb(var(--signal-red) / <alpha-value>)',
        },
      },
      boxShadow: {
        premium: 'var(--shadow-premium)',
        hero: 'var(--shadow-hero)',
      },
    },
  },
  plugins: [],
};

export default config;
