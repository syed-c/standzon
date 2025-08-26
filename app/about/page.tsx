import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import AboutPageContent from '@/components/AboutPageContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Export metadata from centralized metadata.json
export const metadata: Metadata = siteMetadata['/about'];

// Server component shell that renders the client component
export default function AboutPage() {
  return <AboutPageContent />;
}
