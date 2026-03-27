import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { renderMermaidSVG } from 'beautiful-mermaid';

export async function Mermaid({ chart }: { chart: string }) {
  try {
    // Use actual hex colors — CSS variables don't resolve at build time
    let svg = renderMermaidSVG(chart, {
      bg: '#020810',
      fg: '#e8ecf0',
      interactive: true,
      transparent: true,
    });

    // Make SVG responsive — fit container width
    svg = svg.replace(/<svg /, '<svg style="max-width:100%;height:auto;" ');

    return (
      <div
        style={{ maxWidth: '100%', overflow: 'auto' }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  } catch {
    return (
      <CodeBlock title="Mermaid">
        <Pre>{chart}</Pre>
      </CodeBlock>
    );
  }
}
