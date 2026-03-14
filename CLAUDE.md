## Project: astro-docs

Documentation site for Astro Intelligence projects. Built with Starlight (Astro).

### Stack
- Astro 5+ with Starlight
- rehype-mermaid for build-time diagram rendering
- Deployed on Vercel at docs.astrointelligence.dev

### Structure
- `src/content/docs/anchor/` — Anchor project docs (synced from artcgranja/anchor via CI)
- `src/styles/custom.css` — Brand theme overrides
- `.github/workflows/receive-docs.yml` — Receives docs sync dispatches

### Adding a new project
1. Create a new sidebar entry in `astro.config.mjs`
2. Add a `sync-docs.yml` workflow in the project's repo
3. Add a new `repository_dispatch` type in `receive-docs.yml`
4. Copy initial docs to `src/content/docs/<project-name>/`

### Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run preview` — preview production build
