import type { Metadata } from 'next';
import { Geist_Mono, Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Pubudu Gunasekara · Software Engineer · SWE Intern Jan 2027',
  description:
    'M.S. in Computer Science at Northeastern University, Silicon Valley. Focused on Java, distributed systems, full-stack engineering, and AI-powered products. Seeking SWE Internship January 2027.',
  keywords: [
    'software engineer',
    'SWE intern',
    'Java',
    'distributed systems',
    'React',
    'Northeastern University',
    'Silicon Valley',
    'full stack',
    'machine learning',
  ],
  openGraph: {
    title: 'Pubudu Gunasekara · Software Engineer',
    description:
      'M.S. CS @ Northeastern University · Java · Distributed Systems · AI/ML · Available Jan 2027',
    url: 'https://pubudugunasekara.github.io',
    siteName: 'Pubudu Gunasekara Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Pubudu Gunasekara · Software Engineer · SWE Intern Jan 2027',
    description: 'M.S. CS @ Northeastern · Java · Distributed Systems · AI/ML · Available Jan 2027',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '64x64' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png', sizes: '64x64' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/assets/pg-mark.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
