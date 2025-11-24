import "./globals.css";
import type { Metadata } from "next";
import { Inter, Poppins, Roboto, Montserrat, Red_Hat_Display } from "next/font/google";
import { Toaster } from '@/components/ui/toaster';
import siteMetadata from '@/app/metadata.json';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PerformanceMonitor from '@/components/PerformanceMonitor';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import CriticalResourcePreloader from '@/components/CriticalResourcePreloader';
import { ConvexClientProvider } from '@/components/ConvexProvider';
// GlobalTypography temporarily disabled due to dev chunk issue

// ✅ PERFORMANCE: Optimize font loading
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

// Paragraph default font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300','400','500','600','700'],
  display: 'swap',
  preload: true,
  variable: '--font-poppins'
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300','400','500','700'],
  display: 'swap',
  preload: true,
  variable: '--font-roboto'
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400','500','600','700'],
  display: 'swap',
  preload: true,
  variable: '--font-montserrat'
});

const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  weight: ['400','500','600','700','900'],
  display: 'swap',
  preload: true,
  variable: '--font-red-hat-display'
});

// Use centralized metadata for the root layout
export const metadata: Metadata = {
  ...siteMetadata['/'],
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
          
          {/* ✅ PERFORMANCE: Critical resource optimization */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="//vercel.live" />
          <link rel="dns-prefetch" href="//vitals.vercel-insights.com" />
          
          {/* Note: Removed preload links that were causing warnings in development */}
        </head>
        <body className={`${inter.className} ${poppins.className} ${roboto.variable} ${montserrat.variable} ${redHatDisplay.variable} h-full m-0 p-0`} suppressHydrationWarning>
          <ConvexClientProvider>
            <CriticalResourcePreloader />
            {/* <GlobalTypography /> */}
            {children}
            <Toaster />
            <PerformanceMonitor />
            <ServiceWorkerRegistration />
            <SpeedInsights />
            <Analytics />
          </ConvexClientProvider>
        </body>
    </html>
  );
}