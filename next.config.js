/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // ✅ PERFORMANCE: Enable image optimization
  images: { 
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  devIndicators: false,
  // ✅ PERFORMANCE: Enable compression and optimization
  compress: true,
  poweredByHeader: false,
  // ✅ PERFORMANCE: Optimize webpack configuration
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 3000,
        aggregateTimeout: 1000,
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
      };
      config.cache = false;
    }
    
    // ✅ PERFORMANCE: Optimize bundle splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Create separate chunks for heavy libraries
          recharts: {
            name: 'recharts',
            test: /[\\/]node_modules[\\/](recharts)[\\/]/,
            chunks: 'all',
            priority: 20,
          },
          lucide: {
            name: 'lucide',
            test: /[\\/]node_modules[\\/](lucide-react)[\\/]/,
            chunks: 'all',
            priority: 20,
          },
          ui: {
            name: 'ui',
            test: /[\\/]components[\\/]ui[\\/]/,
            chunks: 'all',
            priority: 15,
          },
          admin: {
            name: 'admin',
            test: /[\\/]components[\\/].*[Aa]dmin.*[\\/]/,
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
          },
          // Optimize CSS chunks
          styles: {
            name: 'styles',
            type: 'css/mini-extract',
            chunks: 'all',
            enforce: true,
            priority: 30,
          },
        },
      };
    }
    
    return config;
  },
  experimental: {
    turbo: {
      moduleIdStrategy: 'deterministic',
    },
    // ✅ PERFORMANCE: Enable modern features
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  // ✅ PERFORMANCE: Enable caching headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // ✅ PERFORMANCE: Optimize CSS preloading
  async rewrites() {
    return [
      {
        source: '/_next/static/chunks/main-app.js',
        destination: '/api/static/main-app.js',
      },
      {
        source: '/.well-known/:path*',
        destination: '/api/static/.well-known/:path*',
      },
    ];
  },
  allowedDevOrigins: [
    "*.macaly.dev",
    "*.macaly.app",
    "*.macaly-app.com",
    "*.macaly-user-data.dev",
  ],
};

module.exports = nextConfig;