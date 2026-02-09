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
    // Set device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Add allowed domains for image optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
      {
        protocol: 'https',
        hostname: 'standsbay.com',
      },
      {
        protocol: 'https',
        hostname: 'standszone.com',
      },
    ],
    qualities: [25, 50, 75, 85, 90, 100],
  },
  // ✅ PERFORMANCE: Enable modern features
  serverExternalPackages: ['@react-email/render'],
  experimental: {
    // Enable SWC transforms
    // swcPlugins: [
    //   ['next-superjson-plugin', {}]
    // ],
    // ✅ PERFORMANCE: Enable modern features
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'react-icons',
      'lodash',
      'date-fns'
    ],
    // Reduce build time by limiting concurrent operations
    workerThreads: false,
    cpus: 2, // Limit CPU usage to prevent resource contention
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

    // Add performance optimizations
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      path: false,
      os: false,
      crypto: false,
    };

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

    // 🔥 BUILD OPTIMIZATION: Additional performance optimizations for faster builds
    if (!dev) {
      // Enable tree shaking
      config.optimization.usedExports = true;
      config.optimization.providedExports = true;
      
      // Enable minimizer for production
      if (Array.isArray(config.optimization.minimizer)) {
        config.optimization.minimizer = config.optimization.minimizer.filter(
          (minimizer) => minimizer && typeof minimizer !== 'string'
        );
      }
    }

    return config;
  },

  // ✅ PERFORMANCE: Additional performance optimizations
  compiler: {
    removeConsole: {
      exclude: ['error', 'warn'], // Keep error and warn logs
    },
    reactRemoveProperties: false, // Keep React properties for compatibility
    relay: undefined, // No relay integration
    styledComponents: false, // We're using Tailwind, not styled-components
  },
  // Enable output standalone for optimized Docker builds
  output: 'standalone',
  // Enable compression for production builds
  compress: true,
  // 🔥 BUILD OPTIMIZATION: Reduce static page generation time
  staticPageGenerationTimeout: 120, // 2 minutes instead of default 60
  // 🔥 BUILD OPTIMIZATION: Faster builds
  trailingSlash: false,
  // ✅ PERFORMANCE: Enable caching headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
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
          // Performance headers
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-video-preview:-1, max-snippet:-1',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
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
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Type',
            value: 'font/woff2',
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