import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeMermaid from 'rehype-mermaid';

export default defineConfig({
  site: 'https://docs.astrointelligence.dev',
  integrations: [
    starlight({
      title: 'Astro Intelligence',
      logo: {
        src: './src/assets/logo.svg',
        replacesTitle: true,
      },
      favicon: '/favicon.svg',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/artcgranja' },
      ],
      sidebar: [
        {
          label: 'Anchor',
          autogenerate: { directory: 'anchor' },
        },
      ],
      customCss: ['./src/styles/custom.css'],
      lastUpdated: true,
      pagination: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
    }),
  ],
  markdown: {
    rehypePlugins: [[rehypeMermaid, { strategy: 'inline-svg' }]],
  },
});
