import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import RenderingConceptPageContent from '@/components/RenderingConceptPageContent';

// Export metadata from centralized metadata.json
export const metadata: Metadata = siteMetadata['/3d-rendering-and-concept-development'];

// Server component shell that renders the client component
export default function RenderingConceptPage() {
  return <RenderingConceptPageContent />;
}