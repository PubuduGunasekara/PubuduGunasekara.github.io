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
  title: 'Pubudu Gunasekara · Software Engineer',
  description:
    'M.S. Computer Science student at Northeastern University Silicon Valley building scalable full-stack, backend, cloud, and machine learning systems. Seeking SWE internships for January 2027.',
  keywords: [
    'Pubudu Gunasekara',
    'Software Engineer',
    'Northeastern University',
    'Full Stack',
    'Backend',
    'Cloud',
    'Machine Learning',
    'SWE Internship',
  ],
  openGraph: {
    title: 'Pubudu Gunasekara · Software Engineer',
    description:
      'Full-stack, backend, cloud, and ML systems portfolio for a Northeastern M.S. Computer Science student seeking January 2027 internships.',
    url: 'https://pubudugunasekara.github.io',
    siteName: 'Pubudu Gunasekara',
    type: 'website',
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
