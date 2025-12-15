import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import ServicesPageContent from '@/components/ServicesPageContent';

export const metadata: Metadata = siteMetadata['/services'] || {
  title: 'Exhibition Stand Services - Custom Design & Construction | StandsZone',
  description: 'Professional exhibition stand services including custom design, construction, installation, and project management. Get quotes from verified builders worldwide.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Exhibition Stand Services - Custom Design & Construction | StandsZone',
    description: 'Professional exhibition stand services including custom design, construction, installation, and project management. Get quotes from verified builders worldwide.',
    images: [{ url: '/og-image.jpg' }],
  },
  alternates: {
    canonical: 'https://standszone.com/services',
  },
};

export default function ServicesPage() {
  return <ServicesPageContent />;
}