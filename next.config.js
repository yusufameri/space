/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  basePath: process.env.NODE_ENV === 'production' ? '/space' : '', // Only use base path in production
  images: {
    unoptimized: true, // Required for static export
  },
  // Disable server-side features since we're doing static export
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true, // Temporarily ignore ESLint errors during build
  },
};

module.exports = nextConfig;
