import type { Metadata } from 'next';
import { Geist_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Pubudu Gunasekara · Software Engineer · Open to SWE Internships Summer 2027',
  description:
    'M.S. in Computer Science at Northeastern University, Silicon Valley. Focused on Java, distributed systems, full-stack engineering, and AI-powered products. Open to SWE Internships for Summer 2027.',
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
      'M.S. CS @ Northeastern University · Java · Distributed Systems · AI/ML · Open to SWE Internships Summer 2027',
    url: 'https://pubudugunasekara.github.io',
    siteName: 'Pubudu Gunasekara Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Pubudu Gunasekara · Software Engineer · Open to SWE Internships Summer 2027',
    description: 'M.S. CS @ Northeastern · Java · Distributed Systems · AI/ML · Open to SWE Internships Summer 2027',
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
    <html lang="en" className={`${spaceGrotesk.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
