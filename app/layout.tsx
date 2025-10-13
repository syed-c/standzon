import "./globals.css";
import type { Metadata } from "next";
import { Inter, Poppins, Roboto, Montserrat } from "next/font/google";
import { Toaster } from '@/components/ui/toaster';
import siteMetadata from '@/app/metadata.json';
import { ConvexClientProvider } from '@/components/convex-client-provider';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PerformanceMonitor from '@/components/PerformanceMonitor';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import CriticalResourcePreloader from '@/components/CriticalResourcePreloader';
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
          {/* ✅ PERFORMANCE: Critical resource optimization */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="//vercel.live" />
          <link rel="dns-prefetch" href="//vitals.vercel-insights.com" />
          
          {/* ✅ CRITICAL: Preload hero section resources */}
          <link rel="preload" href="/api/admin/pages-editor?action=get-content&path=%2F" as="fetch" crossOrigin="anonymous" />
          <link rel="preload" href="/api/admin/footer" as="fetch" crossOrigin="anonymous" />
          
          {/* Note: Removed inline critical CSS and invalid preloads to avoid hydration mismatches and 404s. */}
        </head>
        <body className={`${inter.className} ${poppins.className} ${roboto.variable} ${montserrat.variable} h-full m-0 p-0`} suppressHydrationWarning>
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


