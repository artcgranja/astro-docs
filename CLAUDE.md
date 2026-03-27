## Project: astro-docs

Documentation site for Astro Intelligence projects. Built with Next.js + Fumadocs.

### Stack
- Next.js 15+ with Fumadocs (core, mdx, ui)
- Tailwind CSS 4
- Deployed on Vercel at docs.astrointelligence.dev

### Structure
- `content/docs/anchor/` — Anchor project docs (synced from artcgranja/anchor via CI)
- `source.config.ts` — Fumadocs MDX source configuration
- `next.config.ts` — Next.js config with Fumadocs MDX plugin
- `.github/workflows/receive-docs.yml` — Receives docs sync dispatches

### Adding a new project
1. Add content to `content/docs/<project-name>/`
2. Add a `sync-docs.yml` workflow in the project's repo
3. Add a new `repository_dispatch` type in `receive-docs.yml`

### Commands
- `npm run dev` — dev server
- `npm run build` — production build (runs fumadocs-mdx then next build)
- `npm start` — serve production build
