import { defineDocs, defineConfig } from 'fumadocs-mdx/config';
import rehypeMermaid from 'rehype-mermaid';

export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig({
  mdxOptions: {
    rehypePlugins: [[rehypeMermaid, { strategy: 'inline-svg' }]],
  },
});
