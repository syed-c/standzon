import "./globals.css";
import type { Metadata } from "next";
import { Inter, Poppins, Roboto, Montserrat, Red_Hat_Display } from "next/font/google";
import { Toaster } from '@/components/ui/toaster';
import siteMetadata from '@/app/metadata.json';

import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import CriticalResourcePreloader from '@/components/CriticalResourcePreloader';
import DeferredAnalytics from '@/components/DeferredAnalytics';
import DeferredMonitoring from '@/components/DeferredMonitoring';
import NonCriticalScripts from '@/components/NonCriticalScripts';
import { ThemeProvider } from '@/components/ThemeProvider';
import AppWrapper from '@/components/AppWrapper';
// GlobalTypography temporarily disabled due to dev chunk issue

// Font optimization: Reduce font weights and enable swap
const inter = Inter({
  subsets: ["latin"],
  display: 'optional', // Use optional for better performance
  preload: true,
  fallback: ['system-ui', 'arial'],
  weight: ['400', '500', '600'], // Only load essential weights
});

// Limit font weights for performance
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'], // Reduced from ['300','400','500','600','700']
  display: 'optional',
  preload: true,
  variable: '--font-poppins'
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // Reduced from ['300','400','500','700']
  display: 'optional',
  preload: true,
  variable: '--font-roboto'
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'], // Reduced from ['400','500','600','700']
  display: 'optional',
  preload: true,
  variable: '--font-montserrat'
});

const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // Reduced from ['400','500','600','700','900']
  display: 'optional',
  preload: true,
  variable: '--font-red-hat-display'
});



// Use centralized metadata for the root layout
export const metadata: Metadata = {
  ...siteMetadata['/'],
  // ✅ SEO: Add robots meta tag
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // ✅ PERFORMANCE: Add performance hints
  other: {
    'x-dns-prefetch-control': 'on',
    'x-frame-options': 'DENY',
    'x-content-type-options': 'nosniff',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth h-full m-0 p-0" suppressHydrationWarning>
      <head>
        {/* ✅ FAVICON: Add favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />

        {/* ✅ PWA: Add manifest for installable app */}
        <link rel="manifest" href="/manifest.json" />

        {/* ✅ PWA: Add theme color for mobile browsers */}
        <meta name="theme-color" content="#1e40af" />

        {/* ✅ PWA: Add mobile-web-app-capable meta tag */}
        <meta name="mobile-web-app-capable" content="yes" />

        {/* ✅ PWA: Add apple mobile web app meta tags */}
        <meta name="apple-mobile-web-app-title" content="StandsZone" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* ✅ RESPONSIVE: Add viewport meta tag for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes" />

        {/* ✅ SEO: Add robots meta tag */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-video-preview:-1, max-snippet:-1" />

        {/* ✅ PERFORMANCE: Critical resource optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://api.mapbox.com" />
        <link rel="dns-prefetch" href="//vercel.live" />
        <link rel="dns-prefetch" href="//vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />

        {/* ✅ PERFORMANCE: Preload critical resources */}
        {/* Next.js Font handles preloading automatically */}

        {/* ✅ PERFORMANCE: Critical CSS for hero section */}
        <style>{`
            /* Critical hero styles */
            .hero-gradient {
              background: linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #1e293b 100%);
            }
            
            /* Critical button styles */
            .btn-primary {
              background: linear-gradient(90deg, #E11D74 0%, #F1558E 100%);
            }
            
            /* Animation optimizations */
            .animate-bounce {
              animation: bounce 2s infinite;
            }
            
            .animate-pulse {
              animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}</style>

        {/* ✅ PERFORMANCE: Inline critical CSS */}
        <style>{`
            /* Critical CSS for header and navigation */
            .nav-container { display: flex; align-items: center; justify-content: space-between; }
            .header-gradient { background: linear-gradient(135deg, #1e40af 0%, #1e293b 100%); }
            
            /* Critical typography */
            .text-gradient { background: linear-gradient(90deg, #E11D74 0%, #F1558E 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            
            /* Critical layout */
            .page-container { min-height: 100vh; display: flex; flex-direction: column; }
            .main-content { flex: 1; }
            
            /* Sticky navigation for better UX */
            nav.sticky-nav { position: sticky; top: 0; z-index: 100; }
            
            /* Optimized scroll behavior */
            html { scroll-behavior: smooth; scroll-padding-top: 4rem; }
          `}</style>

        {/* Note: Removed preload links that were causing warnings in development */}
      </head>
      <body className={`${inter.className} ${poppins.className} ${roboto.variable} ${montserrat.variable} ${redHatDisplay.variable} h-full m-0 p-0`} suppressHydrationWarning>
        <ThemeProvider>
          <CriticalResourcePreloader />
          {/* <GlobalTypography /> */}
          <AppWrapper>
            {children}
          </AppWrapper>
          <Toaster />
          <DeferredAnalytics />
          <DeferredMonitoring />
          <NonCriticalScripts />
        </ThemeProvider>
      </body>
    </html>
  );
}