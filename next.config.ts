import { NextConfig } from 'next';

const config: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    unoptimized: true, // Disable Next.js image optimization for uploaded files
  },
  // Ensure static files are served correctly
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*',
      },
    ];
  },
  turbopack: {},
};

export default config;