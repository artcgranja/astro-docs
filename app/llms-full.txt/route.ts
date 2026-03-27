import { source } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  const pages = source.getPages();

  const sections = await Promise.all(
    pages.map(async (page) => {
      const url = `https://docs.astrointelligence.dev${page.url}`;
      return [
        `# ${page.data.title}`,
        `URL: ${url}`,
        '',
        page.data.description || '',
        '',
      ].join('\n');
    })
  );

  const content = [
    '# Astro Intelligence Docs',
    '> Complete documentation for Astro Intelligence products.',
    '',
    ...sections,
  ].join('\n');

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
