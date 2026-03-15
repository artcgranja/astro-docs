# Light Theme & Bento Grid Homepage — Design Spec

**Date:** 2026-03-14
**Status:** Draft
**Repo:** astro-docs (Starlight docs site for Astro Intelligence)

## Overview

Two workstreams for the astro-docs site (Workstream 1 must be completed first as Workstream 2 depends on its CSS variables):

1. **Light theme** — Add a `:root[data-theme='light']` block to `custom.css` that mirrors astro-webpage's "Clean Slate" palette, fixing the broken light mode across the entire site.
2. **Bento grid homepage** — Replace the current minimal Starlight splash page with a custom Astro page (`src/pages/index.astro`) featuring a project showcase in a bento grid layout, with GitHub repo metadata fetched at build time. Depends on Workstream 1's CSS variables for theme-aware card styling.

## Workstream 1: Light Theme

### Problem

The current `custom.css` only defines dark theme variables. When Starlight switches to light mode, it falls back to default Starlight colors which clash with the custom Space Grotesk font and deep-space design language.

### Solution

Add a `:root[data-theme='light']` block mirroring astro-webpage's light palette from `globals.css`.

### Color Mapping

| CSS Variable | Dark (existing) | Light (proposed) |
|---|---|---|
| `--sl-color-bg` | `#020810` | `#FAFAF8` |
| `--sl-color-bg-nav` | `#0a1420` | `#ECEEE9` |
| `--sl-color-bg-sidebar` | `#0a1420` | `#ECEEE9` |
| `--sl-color-accent-low` | `#0f2847` | `#DBEAFE` |
| `--sl-color-accent` | `#3b82f6` | `#1D4ED8` |
| `--sl-color-accent-high` | `#93c5fd` | `#2563EB` |
| `--sl-color-text` | `#e8ecf0` | `#0F172A` |
| `--sl-color-text-accent` | `#3b82f6` | `#1D4ED8` |
| `--sl-color-text-invert` | `#020810` | `#FAFAF8` |

**Gray scale (7 levels):**

| Level | Dark (existing) | Light (proposed) |
|---|---|---|
| gray-1 | `#8896a4` | `#64748B` |
| gray-2 | `#4a5568` | `#7A8A9B` |
| gray-3 | `#2d3748` | `#94A3B8` |
| gray-4 | `#1a202c` | `#B0BCCB` |
| gray-5 | `#0f1118` | `#CBD5E1` |
| gray-6 | `#0a0e14` | `#E2E8F0` |
| gray-7 | `#020810` | `#FAFAF8` |

**Borders:**

| Variable | Dark (existing) | Light (proposed) |
|---|---|---|
| `--sl-color-hairline-light` | `rgba(255, 255, 255, 0.06)` | `rgba(0, 0, 0, 0.06)` |
| `--sl-color-hairline` | `rgba(255, 255, 255, 0.1)` | `rgba(0, 0, 0, 0.1)` |

**Code blocks:**

| Variable | Dark (existing) | Light (proposed) |
|---|---|---|
| `--sl-color-bg-inline-code` | `rgba(255, 255, 255, 0.06)` | `rgba(0, 0, 0, 0.06)` |

**Scrollbar:** Invert track/thumb colors for light background.

### Files Modified

- `src/styles/custom.css` — Add `:root[data-theme='light']` block after existing `:root` block.

## Workstream 2: Bento Grid Homepage

### Approach

**Custom Astro page** (`src/pages/index.astro`) replacing the current Starlight splash page (`src/content/docs/index.mdx`). This gives full layout control for the bento grid while keeping Starlight's nav/header via its base layout.

### Architecture

```
src/
├── pages/
│   └── index.astro              # Custom homepage (new)
├── components/
│   ├── ProjectGrid.astro        # Bento grid container (new)
│   ├── ProjectCard.astro        # Individual project card (new)
│   └── ProjectIcon.astro        # SVG icon renderer (new)
├── lib/
│   └── github.ts                # GitHub API fetch at build time (new)
├── data/
│   └── projects.ts              # Static project config (new)
├── content/docs/
│   └── index.mdx                # Delete — replaced by src/pages/index.astro
└── styles/
    └── custom.css               # Light theme additions (modify)
```

### Data Flow

```
Build time:
  projects.ts (static config) ──→ ProjectGrid.astro
                                      │
  github.ts (API fetch) ─────────────→│
                                      │
                                      ▼
                              ProjectCard.astro × N
                                      │
                                      ▼
                              ProjectIcon.astro (SVG)
```

### Static Project Config (`src/data/projects.ts`)

Each project is defined statically with metadata that doesn't change per build:

```typescript
interface ProjectConfig {
  slug: string;           // e.g., "anchor"
  name: string;           // e.g., "Anchor"
  githubRepo: string;     // e.g., "artcgranja/anchor"
  docsPath: string;       // e.g., "/anchor/"
  icon: string;           // icon key for ProjectIcon lookup
  iconColor: string;      // accent color for icon tint
  features: string[];     // e.g., ["Hybrid RAG", "Token Memory", "Provider Agnostic"]
  featured: boolean;      // true = 4-col card, false = 2-col card
}
```

Initial config: one entry for Anchor. Adding a project means adding an entry here — no code changes needed.

### GitHub API Fetch (`src/lib/github.ts`)

Fetches at build time (`astro build`) via `fetch()` in the Astro component's frontmatter:

- **Endpoint:** `https://api.github.com/repos/{owner}/{repo}`
- **Data extracted:** `stargazers_count`, `forks_count`, `language`, `description`, `pushed_at`
- **Auth:** Optional `GITHUB_TOKEN` env var for higher rate limits (unauthenticated: 60 req/hr, authenticated: 5000 req/hr)
- **Fallback:** If API fails, use static defaults (0 stars, 0 forks, description from config)
- **No caching layer needed** — Astro builds are static, data is baked in at build time

```typescript
interface GitHubRepoData {
  stars: number;
  forks: number;
  language: string;
  description: string;
  lastUpdated: string;    // ISO date from pushed_at
}

async function fetchRepoData(repo: string): Promise<GitHubRepoData>
```

### Page Layout (`src/pages/index.astro`)

Structure:

1. **Hero section** — Logo, title ("Astro Intelligence"), tagline ("Open-source tools for context-engineered AI systems"), two CTAs ("Explore Projects" scroll-to-grid, "GitHub" external link)
2. **Project grid** — `<ProjectGrid />` component with bento layout
3. **Footer** — Minimal branding ("Built with Starlight · Deployed on Vercel")

The page imports Starlight's `StarlightPage` component to inherit the site header, theme toggle, and global styles. This is Starlight's official API for custom pages outside the content collection.

### Bento Grid Layout (`src/components/ProjectGrid.astro`)

CSS Grid with 6 columns on desktop, 1 column on mobile:

```css
.project-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
}

@media (max-width: 768px) {
  .project-grid {
    grid-template-columns: 1fr;
  }
}
```

- **Featured cards:** `grid-column: span 4` — large card with full metadata
- **Regular cards:** `grid-column: span 2` — compact card
- **Placeholder cards:** "Coming Soon" with dashed border, shown to fill remaining grid slots when fewer than 4 projects exist. Layout: first row is always featured (span-4) + regular (span-2); second row mirrors (span-2 + span-4). Placeholders fill any slots not occupied by real projects.

### Project Card (`src/components/ProjectCard.astro`)

Two variants driven by the `featured` flag:

**Featured (4-col):**
- Icon (44×44 container, SVG inside) + Name + Owner (`artcgranja/repo`)
- Stars ★ count + Forks count (right-aligned)
- Description (1-2 lines)
- Feature badges (pill-shaped, rounded-full)
- Language dot + "Updated X days ago" + "View Docs →" + "GitHub ↗"

**Regular (2-col):**
- Icon (36×36) + Name
- Stars + Forks
- Description (1 line, truncated)
- Language dot

**Hover:** Border color transitions from `var(--sl-color-hairline)` to `var(--sl-color-hairline-light)` with increased opacity (0.06 → 0.15 dark, 0.1 → 0.2 light). Transition: `border-color 0.2s ease`.

### Icon System (`src/components/ProjectIcon.astro`)

Renders inline SVGs based on a key. No external icon library.

**Conventions:**
- `viewBox="0 0 24 24"`, rendered at 22×22px (featured) or 18×18px (regular)
- `fill="none"`, `stroke="currentColor"`, `stroke-width="1.5"`, `stroke-linecap="round"`, `stroke-linejoin="round"`
- Container: `background: {iconColor}/10`, `border: {iconColor}/20`, `border-radius: 10px`
- Each project gets its own accent color for the icon tint

**Initial icons:**
- `anchor` — anchor symbol (circle + vertical line + arc)

Future project icons are added to the switch/map as projects are added. Unknown icon keys render a default "box" icon (generic package/cube) as a fallback.

**Stat icons (stars, forks):** Also inline SVGs, matching GitHub's visual style.

### Light Theme Support

All card styles use CSS custom properties so they automatically adapt:
- Card background: `var(--sl-color-bg-nav)` (dark: `#0a1420`, light: `#ECEEE9`)
- Card border: Uses the border opacity variables from `custom.css`
- Text colors: `var(--sl-color-text)`, gray scale variables
- Badge backgrounds: `rgba()` with theme-appropriate base (white in dark, black in light)

### Adding a New Project

1. Add entry to `src/data/projects.ts` (slug, name, repo, icon, features, featured flag)
2. Add SVG icon to `ProjectIcon.astro` switch/map
3. Rebuild — GitHub data is fetched automatically

No layout changes needed. The grid auto-flows based on `featured` flag and number of projects.

## Testing

- **Light theme:** Toggle Starlight's theme switcher, verify all pages render correctly in both modes
- **Homepage:** Verify bento grid renders with live GitHub data, cards link correctly, responsive layout works on mobile
- **Build:** Verify `npm run build` succeeds with and without `GITHUB_TOKEN`
- **Fallback:** Verify graceful degradation when GitHub API is unreachable

## Out of Scope

- Supabase integration (not needed for docs site)
- Animations/transitions on cards (keep it simple for v1)
- i18n support
- Search functionality on the project grid
