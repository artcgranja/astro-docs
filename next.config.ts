import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'img.shields.io' },
      { hostname: 'raw.githubusercontent.com' },
    ],
  },
};

export default withMDX(config);
