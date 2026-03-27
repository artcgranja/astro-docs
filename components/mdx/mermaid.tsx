'use client';

import { useEffect, useId, useRef, useState } from 'react';

export function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, '-');
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const { default: mermaid } = await import('mermaid');

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          fontFamily: 'inherit',
          theme: 'dark',
          themeVariables: {
            darkMode: true,
            background: '#020810',
            primaryColor: '#1e3a5f',
            primaryTextColor: '#e8ecf0',
            primaryBorderColor: '#3b82f6',
            secondaryColor: '#0a1420',
            secondaryTextColor: '#e8ecf0',
            tertiaryColor: '#0a1420',
            lineColor: '#8896a4',
            textColor: '#e8ecf0',
            mainBkg: '#1e3a5f',
            nodeBorder: '#3b82f6',
            clusterBkg: '#0a1420',
            titleColor: '#e8ecf0',
            edgeLabelBackground: '#020810',
          },
        });

        const decoded = chart.replaceAll('\\n', '\n');
        const { svg: rendered } = await mermaid.render(
          `mermaid-${id}`,
          decoded,
        );

        if (!cancelled) {
          setSvg(rendered);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Mermaid render error:', err);
          setError(true);
        }
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <pre
        style={{
          padding: '1rem',
          borderRadius: '0.5rem',
          background: '#0a1420',
          color: '#8896a4',
          overflow: 'auto',
          fontSize: '0.875rem',
        }}
      >
        <code>{chart}</code>
      </pre>
    );
  }

  if (!svg) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#8896a4',
        }}
      >
        Loading diagram...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ maxWidth: '100%', overflow: 'auto' }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
