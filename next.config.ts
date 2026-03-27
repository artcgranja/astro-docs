import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'img.shields.io' },
      { hostname: 'raw.githubusercontent.com' },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment' as const,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withMDX(config);
