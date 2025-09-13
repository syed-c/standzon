import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from '@/components/ui/toaster';
import siteMetadata from '@/app/metadata.json';
import { ConvexClientProvider } from '@/components/convex-client-provider';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PerformanceMonitor from '@/components/PerformanceMonitor';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import CriticalResourcePreloader from '@/components/CriticalResourcePreloader';

// ✅ PERFORMANCE: Optimize font loading
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
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
          
          {/* ✅ CRITICAL: Inline critical CSS */}
          <style dangerouslySetInnerHTML={{
            __html: `
              /* Critical above-the-fold styles */
              .hero-gradient { background: linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #1e293b 100%); }
              .btn-primary { background: linear-gradient(to right, #ec4899, #f43f5e); color: white; padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; transition: all 0.3s; }
              .btn-outline { border: 2px solid white; color: white; padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; transition: all 0.3s; backdrop-filter: blur(12px); }
              .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
              @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
              .scroll-smooth { scroll-behavior: smooth; }
              @media (prefers-reduced-motion: reduce) { .scroll-smooth { scroll-behavior: auto; } .animate-pulse { animation: none; } }
            `
          }} />
          
          {/* ✅ CRITICAL: Resource hints for faster loading */}
          <link rel="preload" href="/_next/static/css/" as="style" />
          <link rel="preload" href="/_next/static/chunks/" as="script" />
        </head>
        <body className={`${inter.className} h-full m-0 p-0`} suppressHydrationWarning>
          <ConvexClientProvider>
            <CriticalResourcePreloader />
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


