export interface GitHubRepoData {
  stars: number;
  forks: number;
  language: string;
  description: string;
  lastUpdated: string;
}

const FALLBACK: GitHubRepoData = {
  stars: 0,
  forks: 0,
  language: 'Unknown',
  description: '',
  lastUpdated: new Date().toISOString(),
};

export async function fetchRepoData(repo: string): Promise<GitHubRepoData> {
  const token = import.meta.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'astro-docs',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (!res.ok) {
      console.warn(`GitHub API error for ${repo}: ${res.status}`);
      return { ...FALLBACK };
    }
    const data = await res.json();
    return {
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
      language: data.language ?? 'Unknown',
      description: data.description ?? '',
      lastUpdated: data.pushed_at ?? new Date().toISOString(),
    };
  } catch (err) {
    console.warn(`GitHub API fetch failed for ${repo}:`, err);
    return { ...FALLBACK };
  }
}
