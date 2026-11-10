import type { MetadataRoute } from 'next';
import { caseStudies } from '@/lib/caseStudies';

export const dynamic = 'force-static';

const siteUrl = 'https://pubudugunasekara.github.io';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/` },
    ...Object.keys(caseStudies).map((slug) => ({ url: `${siteUrl}/projects/${slug}/` })),
  ];
}
