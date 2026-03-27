'use client';

import { use, useEffect, useId, useState } from 'react';

const cache = new Map<string, Promise<unknown>>();

function cachePromise<T>(key: string, setPromise: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  if (cached) return cached as Promise<T>;
  const promise = setPromise();
  cache.set(key, promise);
  return promise;
}

export function Mermaid({ chart }: { chart: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <MermaidContent chart={chart} />;
}

function MermaidContent({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, '-');

  const { default: mermaid } = use(
    cachePromise('mermaid', () => import('mermaid')),
  );

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

  const { svg } = use(
    cachePromise(`render-${id}-${chart}`, () =>
      mermaid.render(`mermaid-${id}`, chart.replaceAll('\\n', '\n')),
    ),
  );

  return (
    <div
      style={{ maxWidth: '100%', overflow: 'auto' }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
