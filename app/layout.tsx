import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from '@/components/ui/toaster';
import siteMetadata from '@/app/metadata.json';
import { ConvexClientProvider } from '@/components/convex-client-provider';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PerformanceMonitor from '@/components/PerformanceMonitor';

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
          {/* ✅ PERFORMANCE: Preload critical resources */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="//vercel.live" />
          <link rel="dns-prefetch" href="//vitals.vercel-insights.com" />
        </head>
        <body className={`${inter.className} h-full m-0 p-0`} suppressHydrationWarning>
          <ConvexClientProvider>
            {children}
            <Toaster />
            <PerformanceMonitor />
            <SpeedInsights />
            <Analytics />
          </ConvexClientProvider>
        </body>
    </html>
  );
}


