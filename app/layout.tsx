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

const siteUrl = 'https://pubudugunasekara.github.io';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Pubudu Gunasekara · Software Engineer · Open to SWE Internships Summer 2027',
  description:
    'Software engineer focused on backend and distributed systems. M.S. Computer Science at Northeastern (4.0 GPA); I build reliable backend systems and AI-powered developer tools. Open to Software Engineering internships for Summer 2027.',
  keywords: [
    'software engineer',
    'SWE intern',
    'backend engineer',
    'distributed systems',
    'Java',
    'Spring Boot',
    'Apache Kafka',
    'AI-powered developer tools',
    'Northeastern University',
    'Silicon Valley',
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Pubudu Gunasekara · Software Engineer',
    description:
      'Software engineer focused on backend and distributed systems. M.S. CS at Northeastern (4.0 GPA). Open to SWE Internships, Summer 2027.',
    url: siteUrl,
    siteName: 'Pubudu Gunasekara Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pubudu Gunasekara · Software Engineer · Open to SWE Internships Summer 2027',
    description: 'Software engineer focused on backend and distributed systems. M.S. CS at Northeastern (4.0 GPA). Open to SWE Internships, Summer 2027.',
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

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Pubudu Gunasekara',
  jobTitle: 'Software Engineer',
  affiliation: {
    '@type': 'CollegeOrUniversity',
    name: 'Northeastern University',
  },
  url: siteUrl,
  sameAs: ['https://github.com/PubuduGunasekara', 'https://www.linkedin.com/in/pubudugunasekera/', 'https://leetcode.com/u/pubuduguna/'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${geistMono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        {children}
      </body>
    </html>
  );
}
