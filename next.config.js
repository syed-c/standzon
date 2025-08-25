/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { 
    unoptimized: true 
  },
  devIndicators: false,
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 3000,
        aggregateTimeout: 1000,
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
      };
      config.cache = false;
    }
    return config;
  },
  experimental: {
    turbo: {
      // Use object instead of boolean for turbo config
      moduleIdStrategy: 'deterministic',
    },
  },
  allowedDevOrigins: [
    "*.macaly.dev",
    "*.macaly.app",
    "*.macaly-app.com",
    "*.macaly-user-data.dev",
  ],
};

module.exports = nextConfig;