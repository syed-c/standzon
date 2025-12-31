import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import RenderingConceptPageContent from '@/components/RenderingConceptPageContent';

// Export metadata from centralized metadata.json
export const metadata: Metadata = siteMetadata['/3d-rendering-and-concept-development'] || {
  title: '3D Rendering & Concept Development | Exhibition Design Services | StandsZone',
  description: 'Professional 3D rendering and concept development services for exhibition stands. Visualize your booth design before construction begins.',
  openGraph: {
    title: '3D Rendering & Concept Development | Exhibition Design Services | StandsZone',
    description: 'Professional 3D rendering and concept development services for exhibition stands. Visualize your booth design before construction begins.',
    images: [{ url: '/og-image.jpg' }],
  },
  alternates: {
    canonical: 'https://standszone.com/3d-rendering-and-concept-development',
  },
};

// Server component shell that renders the client component
export default function RenderingConceptPage() {
  return <RenderingConceptPageContent />;
}