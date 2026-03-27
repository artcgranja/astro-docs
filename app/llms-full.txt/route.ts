import { source } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  try {
    const pages = source.getPages();

    const sections = pages
      .filter((page) => page.data.title && page.url)
      .map((page) => {
        const url = `https://docs.astrointelligence.dev${page.url}`;
        return [
          `# ${page.data.title}`,
          `URL: ${url}`,
          '',
          page.data.description || '',
          '',
        ].join('\n');
      });

    const content = [
      '# Astro Intelligence Docs',
      '> Complete documentation for Astro Intelligence products.',
      '',
      ...sections,
    ].join('\n');

    return new Response(content, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    console.error('Failed to generate llms-full.txt:', err);
    return new Response('Error generating full documentation', {
      status: 500,
    });
  }
}
