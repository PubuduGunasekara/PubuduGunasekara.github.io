'use client';

import { useEffect, useState } from 'react';
import { githubFallbackRepos, githubUsername } from './content';

type GithubStats = {
  publicRepos: number;
  loading: boolean;
  isFallback: boolean;
};

export function useGithubStats(): GithubStats {
  const [stats, setStats] = useState<GithubStats>({
    publicRepos: githubFallbackRepos,
    loading: true,
    isFallback: false,
  });

  useEffect(() => {
    let cancelled = false;

    fetch(`https://api.github.com/users/${githubUsername}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (cancelled) return;
        setStats({
          publicRepos: typeof data.public_repos === 'number' ? data.public_repos : githubFallbackRepos,
          loading: false,
          isFallback: false,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setStats({ publicRepos: githubFallbackRepos, loading: false, isFallback: true });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
}
