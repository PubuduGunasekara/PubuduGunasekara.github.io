import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const siteUrl = 'https://pubudugunasekara.github.io';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/` },
    { url: `${siteUrl}/projects/task-scheduler/` },
    { url: `${siteUrl}/projects/ai-code-reviewer/` },
  ];
}
