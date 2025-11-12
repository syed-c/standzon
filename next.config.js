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
  async redirects() {
    const map = {
      // Americas
      us: 'united-states', ca: 'canada', mx: 'mexico', br: 'brazil',
      // Europe
      uk: 'united-kingdom', gb: 'united-kingdom', de: 'germany', fr: 'france', it: 'italy', es: 'spain', nl: 'netherlands', be: 'belgium', ch: 'switzerland', at: 'austria', se: 'sweden', no: 'norway', dk: 'denmark', fi: 'finland', pl: 'poland', cz: 'czech-republic', hu: 'hungary',
      // Middle East & Africa
      ae: 'united-arab-emirates', uae: 'united-arab-emirates', sa: 'saudi-arabia', qa: 'qatar', kw: 'kuwait', bh: 'bahrain', om: 'oman', eg: 'egypt', ma: 'morocco', ng: 'nigeria', ke: 'kenya', il: 'israel', lb: 'lebanon', jo: 'jordan',
      // Asia-Pacific
      cn: 'china', hk: 'hong-kong', jp: 'japan', kr: 'south-korea', in: 'india', id: 'indonesia', my: 'malaysia', sg: 'singapore', th: 'thailand', ph: 'philippines', vn: 'vietnam', tw: 'taiwan', ru: 'russia', au: 'australia', nz: 'new-zealand', tr: 'turkey',
      // Other common variants
      za: 'south-africa'
    };
    const redirects = [];
    for (const [code, full] of Object.entries(map)) {
      redirects.push(
        {
          source: `/exhibition-stands/${code}`,
          destination: `/exhibition-stands/${full}`,
          permanent: true,
        },
        {
          source: `/exhibition-stands/${code}/:path*`,
          destination: `/exhibition-stands/${full}/:path*`,
          permanent: true,
        }
      );
    }
    return redirects;
  },
  // Handle problematic static file requests
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