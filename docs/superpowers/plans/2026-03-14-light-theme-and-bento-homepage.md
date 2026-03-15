# Light Theme & Bento Grid Homepage Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the broken light theme across the docs site and replace the splash homepage with a bento grid project showcase that fetches GitHub repo data at build time.

**Architecture:** Two sequential workstreams. Workstream 1 adds light theme CSS variables to `custom.css`. Workstream 2 creates a custom Astro page with components for a project card grid, a GitHub API fetch utility, and a static project config — all wired together at build time.

**Tech Stack:** Astro 6, Starlight 0.38, CSS custom properties, GitHub REST API, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-14-light-theme-and-bento-homepage-design.md`

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/styles/custom.css` | Modify | Add `:root[data-theme='light']` block + light scrollbar styles |
| `src/lib/github.ts` | Create | GitHub API fetch function with fallback |
| `src/data/projects.ts` | Create | Static project config (slug, name, repo, icon, features) |
| `src/components/ProjectIcon.astro` | Create | Inline SVG icon renderer by key |
| `src/components/ProjectCard.astro` | Create | Featured/regular project card component |
| `src/components/ProjectGrid.astro` | Create | Bento grid container with placeholder cards |
| `src/pages/index.astro` | Create | Custom homepage with hero + grid + footer |
| `src/content/docs/index.mdx` | Delete | Replaced by `src/pages/index.astro` |

---

## Chunk 1: Light Theme (Workstream 1)

### Task 1: Add light theme CSS variables

**Files:**
- Modify: `src/styles/custom.css:45` (after the closing `}` of the `:root` block)

- [ ] **Step 1: Add the `:root[data-theme='light']` block to `custom.css`**

Add this block immediately after the existing `:root { ... }` closing brace (after line 45):

```css
/* === Astro Intelligence Light Theme === */
:root[data-theme='light'] {
  /* Colors — Astro Intelligence clean slate palette */
  --sl-color-bg: #FAFAF8;
  --sl-color-bg-nav: #ECEEE9;
  --sl-color-bg-sidebar: #ECEEE9;

  /* Accent */
  --sl-color-accent-low: #DBEAFE;
  --sl-color-accent: #1D4ED8;
  --sl-color-accent-high: #2563EB;
  --sl-color-text-accent: #1D4ED8;

  /* Text */
  --sl-color-text: #0F172A;
  --sl-color-text-invert: #FAFAF8;

  /* Grays */
  --sl-color-gray-1: #64748B;
  --sl-color-gray-2: #7A8A9B;
  --sl-color-gray-3: #94A3B8;
  --sl-color-gray-4: #B0BCCB;
  --sl-color-gray-5: #CBD5E1;
  --sl-color-gray-6: #E2E8F0;
  --sl-color-gray-7: #FAFAF8;

  /* Borders */
  --sl-color-hairline-light: rgba(0, 0, 0, 0.06);
  --sl-color-hairline: rgba(0, 0, 0, 0.1);

  /* Code blocks */
  --sl-color-bg-inline-code: rgba(0, 0, 0, 0.06);
}
```

- [ ] **Step 2: Add light-mode scrollbar styles**

Add this block after the existing `::-webkit-scrollbar-thumb:hover` rule (find it by searching for `scrollbar-thumb:hover` — line numbers will have shifted after Step 1's insertion):

```css
/* Light mode scrollbar */
:root[data-theme='light'] ::-webkit-scrollbar-track {
  background: transparent;
}

:root[data-theme='light'] ::-webkit-scrollbar-thumb {
  background: #94A3B8;
  border-radius: 3px;
}

:root[data-theme='light'] ::-webkit-scrollbar-thumb:hover {
  background: #64748B;
}
```

- [ ] **Step 3: Verify the build passes**

Run: `cd /Users/arthurgranja/github/astro-docs && npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Verify visually with dev server**

Run: `cd /Users/arthurgranja/github/astro-docs && npm run dev`
Manual check: Open in browser, toggle theme switcher. Verify:
- Background changes to warm off-white (`#FAFAF8`)
- Nav/sidebar change to sage tint (`#ECEEE9`)
- Text is near-black (`#0F172A`)
- Accent links are deeper blue (`#1D4ED8`)
- Code blocks have subtle dark tint, not white
- Scrollbar thumb is gray, not invisible

- [ ] **Step 5: Commit**

```bash
git add src/styles/custom.css
git commit -m "feat: add light theme mirroring astro-webpage Clean Slate palette"
```

---

## Chunk 2: Bento Grid Homepage (Workstream 2)

### Task 2: Create GitHub API fetch utility

**Files:**
- Create: `src/lib/github.ts`

- [ ] **Step 1: Create the `src/lib/` directory**

```bash
mkdir -p /Users/arthurgranja/github/astro-docs/src/lib
```

- [ ] **Step 2: Write `src/lib/github.ts`**

```typescript
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
```

- [ ] **Step 3: Verify build still passes**

Run: `cd /Users/arthurgranja/github/astro-docs && npm run build`
Expected: Build succeeds. The file is not imported yet, so no runtime effect.

- [ ] **Step 4: Commit**

```bash
git add src/lib/github.ts
git commit -m "feat: add GitHub API fetch utility for build-time repo data"
```

### Task 3: Create static project config

**Files:**
- Create: `src/data/projects.ts`

- [ ] **Step 1: Create the `src/data/` directory**

```bash
mkdir -p /Users/arthurgranja/github/astro-docs/src/data
```

- [ ] **Step 2: Write `src/data/projects.ts`**

```typescript
export interface ProjectConfig {
  slug: string;
  name: string;
  githubRepo: string;
  docsPath: string;
  icon: string;
  iconColor: string;
  features: string[];
  featured: boolean;
}

export const projects: ProjectConfig[] = [
  {
    slug: 'anchor',
    name: 'Anchor',
    githubRepo: 'artcgranja/anchor',
    docsPath: '/anchor/',
    icon: 'anchor',
    iconColor: '#3b82f6',
    features: ['Hybrid RAG', 'Token Memory', 'Provider Agnostic'],
    featured: true,
  },
];
```

- [ ] **Step 3: Commit**

```bash
git add src/data/projects.ts
git commit -m "feat: add static project config with Anchor entry"
```

### Task 4: Create ProjectIcon component

**Files:**
- Create: `src/components/ProjectIcon.astro`

- [ ] **Step 1: Create the `src/components/` directory**

```bash
mkdir -p /Users/arthurgranja/github/astro-docs/src/components
```

- [ ] **Step 2: Write `src/components/ProjectIcon.astro`**

```astro
---
interface Props {
  icon: string;
  size?: number;
}

const { icon, size = 22 } = Astro.props;
---

{icon === 'anchor' && (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="5" r="3" />
    <line x1="12" y1="22" x2="12" y2="8" />
    <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
  </svg>
)}

{/* Default fallback: box/package icon */}
{icon !== 'anchor' && (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectIcon.astro
git commit -m "feat: add ProjectIcon component with anchor SVG and box fallback"
```

### Task 5: Create ProjectCard component

**Files:**
- Create: `src/components/ProjectCard.astro`

- [ ] **Step 1: Write `src/components/ProjectCard.astro`**

```astro
---
import ProjectIcon from './ProjectIcon.astro';
import type { ProjectConfig } from '../data/projects';
import type { GitHubRepoData } from '../lib/github';

interface Props {
  project: ProjectConfig;
  repoData: GitHubRepoData;
}

const { project, repoData } = Astro.props;
const isFeatured = project.featured;

// Format "Updated X days ago"
const updatedDate = new Date(repoData.lastUpdated);
const now = new Date();
const diffDays = Math.floor((now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24));
const updatedText = diffDays === 0 ? 'Updated today' : diffDays === 1 ? 'Updated yesterday' : `Updated ${diffDays} days ago`;

// Language color map
const langColors: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178C6',
  JavaScript: '#F1E05A',
  Rust: '#DEA584',
  Go: '#00ADD8',
};
const langColor = langColors[repoData.language] ?? '#8896a4';
---

<div class:list={['project-card', { featured: isFeatured }]}>
  <div class="card-header">
    <div class="card-identity">
      <div class="icon-container" style={`background: ${project.iconColor}1a; border-color: ${project.iconColor}33; color: ${project.iconColor};`}>
        <ProjectIcon icon={project.icon} size={isFeatured ? 22 : 18} />
      </div>
      <div>
        <div class="card-name">{project.name}</div>
        {isFeatured && <div class="card-owner">{project.githubRepo}</div>}
      </div>
    </div>
    <div class="card-stats">
      <div class="stat">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
        <span>{repoData.stars}</span>
      </div>
      <div class="stat">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sl-color-gray-1)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" /><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" /><line x1="12" y1="12" x2="12" y2="15" /></svg>
        <span>{repoData.forks}</span>
      </div>
    </div>
  </div>

  <p class="card-description">{repoData.description || project.name}</p>

  {isFeatured && project.features.length > 0 && (
    <div class="card-badges">
      {project.features.map((f) => (
        <span class="badge">{f}</span>
      ))}
    </div>
  )}

  <div class="card-footer">
    <div class="card-meta">
      <span class="lang-dot" style={`background: ${langColor};`}></span>
      <span class="lang-name">{repoData.language}</span>
      {isFeatured && (
        <>
          <span class="meta-sep">&middot;</span>
          <span class="meta-date">{updatedText}</span>
        </>
      )}
    </div>
    {isFeatured && (
      <div class="card-links">
        <a href={project.docsPath} class="link-docs">View Docs &rarr;</a>
        <a href={`https://github.com/${project.githubRepo}`} class="link-github" target="_blank" rel="noopener">GitHub &#8599;</a>
      </div>
    )}
  </div>
</div>

<style>
  .project-card {
    background: var(--sl-color-bg-nav);
    border: 1px solid var(--sl-color-hairline);
    border-radius: 16px;
    padding: 24px;
    transition: border-color 0.2s ease;
  }
  .project-card:hover {
    border-color: rgba(128, 128, 128, 0.2);
  }
  .project-card.featured {
    grid-column: span 4;
    padding: 32px;
  }
  .project-card:not(.featured) {
    grid-column: span 2;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .card-identity {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    border: 1px solid;
  }
  .featured .icon-container {
    width: 44px;
    height: 44px;
  }
  .project-card:not(.featured) .icon-container {
    width: 36px;
    height: 36px;
  }
  .card-name {
    font-size: 18px;
    font-weight: 600;
    color: var(--sl-color-text);
  }
  .project-card:not(.featured) .card-name {
    font-size: 15px;
  }
  .card-owner {
    font-size: 12px;
    color: var(--sl-color-gray-1);
  }

  .card-stats {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .stat {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .stat span {
    font-size: 13px;
    color: var(--sl-color-gray-1);
  }

  .card-description {
    font-size: 14px;
    color: var(--sl-color-gray-1);
    line-height: 1.5;
    margin: 0 0 20px 0;
  }
  .project-card:not(.featured) .card-description {
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 16px;
  }

  .card-badges {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 11px;
    color: var(--sl-color-gray-1);
    border: 1px solid var(--sl-color-hairline);
  }
  :root[data-theme='light'] .badge {
    background: rgba(0, 0, 0, 0.04);
  }
  :root:not([data-theme='light']) .badge {
    background: rgba(255, 255, 255, 0.04);
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .card-meta {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .lang-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .lang-name, .meta-date {
    font-size: 12px;
    color: var(--sl-color-gray-1);
  }
  .meta-sep {
    font-size: 12px;
    color: var(--sl-color-gray-3);
  }

  .card-links {
    display: flex;
    gap: 12px;
  }
  .link-docs {
    font-size: 13px;
    color: var(--sl-color-accent);
    text-decoration: none;
    font-weight: 500;
  }
  .link-github {
    font-size: 13px;
    color: var(--sl-color-gray-1);
    text-decoration: none;
  }

  @media (max-width: 768px) {
    .project-card.featured,
    .project-card:not(.featured) {
      grid-column: span 1;
    }
    .project-card:not(.featured) .card-description {
      white-space: normal;
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProjectCard.astro
git commit -m "feat: add ProjectCard component with featured/regular variants"
```

### Task 6: Create ProjectGrid component

**Files:**
- Create: `src/components/ProjectGrid.astro`

- [ ] **Step 1: Write `src/components/ProjectGrid.astro`**

```astro
---
import ProjectCard from './ProjectCard.astro';
import { projects } from '../data/projects';
import { fetchRepoData } from '../lib/github';
import type { GitHubRepoData } from '../lib/github';

// Fetch GitHub data for all projects at build time
const repoDataMap = new Map<string, GitHubRepoData>();
for (const project of projects) {
  const data = await fetchRepoData(project.githubRepo);
  repoDataMap.set(project.slug, data);
}

// Fill grid to 4 slots minimum with placeholder cards.
// Grid pattern: row 1 = span-4 + span-2, row 2 = span-2 + span-4.
// Placeholders alternate wide/narrow to fill remaining slots after real projects.
const totalSlots = 4;
const placeholderCount = Math.max(0, totalSlots - projects.length);
---

<section class="project-grid-section" id="projects">
  <div class="project-grid">
    {projects.map((project) => (
      <ProjectCard project={project} repoData={repoDataMap.get(project.slug)!} />
    ))}

    {Array.from({ length: placeholderCount }).map((_, i) => (
      <div class:list={['placeholder-card', { wide: i % 2 === (projects.length % 2 === 0 ? 0 : 1) }]}>
        <div class="placeholder-icon">
          <span>+</span>
        </div>
        <span class="placeholder-text">Coming Soon</span>
      </div>
    ))}
  </div>
</section>

<style>
  .project-grid-section {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }
  .project-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1rem;
  }

  .placeholder-card {
    grid-column: span 2;
    background: var(--sl-color-bg-nav);
    border: 2px dashed var(--sl-color-hairline);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 160px;
  }
  .placeholder-card.wide {
    grid-column: span 4;
  }
  .placeholder-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    border: 2px dashed var(--sl-color-hairline);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
  }
  .placeholder-icon span {
    font-size: 20px;
    color: var(--sl-color-gray-3);
  }
  .placeholder-text {
    font-size: 14px;
    color: var(--sl-color-gray-3);
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .project-grid {
      grid-template-columns: 1fr;
    }
    .placeholder-card,
    .placeholder-card.wide {
      grid-column: span 1;
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProjectGrid.astro
git commit -m "feat: add ProjectGrid bento layout with placeholder cards"
```

### Task 7: Create custom homepage and delete old splash page

**Files:**
- Create: `src/pages/index.astro`
- Delete: `src/content/docs/index.mdx`

- [ ] **Step 1: Create the `src/pages/` directory**

```bash
mkdir -p /Users/arthurgranja/github/astro-docs/src/pages
```

- [ ] **Step 2: Write `src/pages/index.astro`**

```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import ProjectGrid from '../components/ProjectGrid.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Astro Intelligence',
    template: 'splash',
    hero: { tagline: '' },
    pagefind: false,
  }}
>
  <div class="homepage">
    <!-- Hero -->
    <section class="hero">
      <img src="/favicon.svg" alt="Astro Intelligence" class="hero-logo" />
      <h1 class="hero-title">Astro Intelligence</h1>
      <p class="hero-tagline">Open-source tools for context-engineered AI systems</p>
      <div class="hero-actions">
        <a href="#projects" class="btn-primary">Explore Projects</a>
        <a href="https://github.com/artcgranja" class="btn-outline" target="_blank" rel="noopener">GitHub &#8599;</a>
      </div>
    </section>

    <!-- Project Grid -->
    <ProjectGrid />

    <!-- Footer -->
    <footer class="homepage-footer">
      <p>Built with Starlight &middot; Deployed on Vercel</p>
    </footer>
  </div>
</StarlightPage>

<style>
  .homepage {
    width: 100%;
  }

  /* Hero */
  .hero {
    text-align: center;
    padding: 4rem 1.5rem 3rem;
  }
  .hero-logo {
    height: 48px;
    width: auto;
    margin-bottom: 1rem;
  }
  .hero-title {
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.5px;
    margin: 0 0 0.5rem;
    color: var(--sl-color-text);
  }
  .hero-tagline {
    font-size: 1rem;
    color: var(--sl-color-gray-1);
    margin: 0 0 1.5rem;
  }
  .hero-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }
  .btn-primary {
    background: var(--sl-color-accent);
    color: var(--sl-color-text-invert);
    padding: 0.625rem 1.5rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: opacity 0.2s;
  }
  .btn-primary:hover {
    opacity: 0.9;
  }
  .btn-outline {
    border: 1px solid var(--sl-color-hairline);
    color: var(--sl-color-text);
    padding: 0.625rem 1.5rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: border-color 0.2s;
  }
  .btn-outline:hover {
    border-color: var(--sl-color-gray-1);
  }

  /* Footer */
  .homepage-footer {
    text-align: center;
    margin-top: 2rem;
    padding: 1rem 0;
    border-top: 1px solid var(--sl-color-hairline-light);
  }
  .homepage-footer p {
    font-size: 0.75rem;
    color: var(--sl-color-gray-3);
  }
</style>
```

- [ ] **Step 3: Delete the old splash page**

```bash
rm /Users/arthurgranja/github/astro-docs/src/content/docs/index.mdx
```

- [ ] **Step 4: Verify the build passes**

Run: `cd /Users/arthurgranja/github/astro-docs && npm run build`
Expected: Build succeeds. The homepage route (`/`) is now served by `src/pages/index.astro`.

- [ ] **Step 5: Verify visually with dev server**

Run: `cd /Users/arthurgranja/github/astro-docs && npm run dev`
Manual checks:
- Homepage shows hero section with logo, title, tagline, and two buttons
- Bento grid renders below with Anchor featured card (4-col) + 3 placeholder cards
- Anchor card shows live GitHub data (stars, forks, language, description, last updated)
- "View Docs" link navigates to `/anchor/`
- "GitHub" link opens `github.com/artcgranja/anchor` in new tab
- Theme toggle works — cards adapt to light/dark
- Mobile view: grid collapses to single column
- Starlight header/nav bar appears at the top

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro
git rm src/content/docs/index.mdx
git commit -m "feat: replace splash page with bento grid homepage

Custom Astro page with hero section and project grid that fetches
GitHub repo data at build time. Anchor displayed as featured card."
```
