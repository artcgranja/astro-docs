import { llms } from 'fumadocs-core/source';
import { source } from '@/lib/source';

export const revalidate = false;

export function GET() {
  try {
    const content = llms(source).index();

    return new Response(content, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    console.error('Failed to generate llms.txt:', err);
    return new Response('Error generating documentation index', {
      status: 500,
    });
  }
}
