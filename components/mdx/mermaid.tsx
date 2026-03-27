import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { renderMermaidSVG } from 'beautiful-mermaid';

export async function Mermaid({ chart }: { chart: string }) {
  try {
    // renderMermaidSVG produces sanitized SVG from mermaid DSL — safe for injection
    let svg = renderMermaidSVG(chart, {
      bg: 'var(--color-fd-background)',
      fg: 'var(--color-fd-foreground)',
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
