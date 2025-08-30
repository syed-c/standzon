import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import RenderingConceptPageContent from '@/components/RenderingConceptPageContent';

export const metadata: Metadata = siteMetadata['/3d-rendering-and-concept-development'] || {
  title: '3D Rendering & Concept Development | Exhibition Design | StandsZone',
  description: 'Photorealistic 3D visuals and rapid concept iterations to align stakeholders and accelerate approvals. Professional 3D rendering for trade shows.',
  openGraph: {
    title: '3D Rendering & Concept Development | Exhibition Design | StandsZone',
    description: 'Photorealistic 3D visuals and rapid concept iterations to align stakeholders and accelerate approvals. Professional 3D rendering for trade shows.',
    images: [{ url: '/og-image.jpg' }],
  },
};

export default function RenderingConceptPage() {
  return <RenderingConceptPageContent />;
}
