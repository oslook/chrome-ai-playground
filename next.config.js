/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    // Enable experimental features if needed
    optimizeCss: true,
  },
};

module.exports = nextConfig;
