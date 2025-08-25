import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from '@/components/ui/toaster';
import siteMetadata from '@/app/metadata.json';
import { ConvexClientProvider } from '@/components/convex-client-provider';

const inter = Inter({ subsets: ["latin"] });

// Use centralized metadata for the root layout
export const metadata: Metadata = siteMetadata['/'];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth h-full m-0 p-0" suppressHydrationWarning>
        <body className={`${inter.className} h-full m-0 p-0`} suppressHydrationWarning>
          <ConvexClientProvider>
            {children}
            <Toaster />
          </ConvexClientProvider>
        </body>
    </html>
  );
}


