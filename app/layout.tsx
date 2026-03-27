import './global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Space_Grotesk, Fira_Code } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
});

export const metadata: Metadata = {
  title: {
    default: 'Astro Intelligence Docs',
    template: '%s | Astro Docs',
  },
  description: 'Documentation for Astro Intelligence products',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${firaCode.variable}`}
      suppressHydrationWarning
    >
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
