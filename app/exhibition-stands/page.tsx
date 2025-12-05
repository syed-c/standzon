import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import ExhibitionStandsContent from '@/components/ExhibitionStandsContent';

// Export metadata from centralized metadata.json
export const metadata: Metadata = siteMetadata['/exhibition-stands'] || {
  title: 'Exhibition Stands Worldwide | 21+ Countries & 104+ Cities | Global Directory | StandsZone',
  description: 'Comprehensive global directory of exhibition stand builders covering 21+ countries and 104+ major cities. Professional trade show services across Europe, Asia, Americas, Africa, and Oceania. Custom stands, modular systems, and full-service solutions.',
  openGraph: {
    title: 'Exhibition Stands Worldwide | 21+ Countries & 104+ Cities | Global Directory | StandsZone',
    description: 'Comprehensive global directory of exhibition stand builders covering 21+ countries and 104+ major cities. Professional trade show services across Europe, Asia, Americas, Africa, and Oceania. Custom stands, modular systems, and full-service solutions.',
    images: [{ url: '/og-image.jpg' }],
  },
  alternates: {
    canonical: 'https://standszone.com/exhibition-stands',
  },
};

export default function ExhibitionStandsPage() {
  return <ExhibitionStandsContent />;
}
