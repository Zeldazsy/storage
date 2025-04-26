import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: true,
  optimizeCss: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}',
    },
  },
  experimental: {
    typedRoutes: true,
    scrollRestoration: true,
    urlImports: [],
  },
};

export default nextConfig;
