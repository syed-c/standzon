import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import AboutPageContent from '@/components/AboutPageContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Export metadata from centralized metadata.json
export const metadata: Metadata = siteMetadata['/about'] || {
  title: 'About StandsZone | Global Exhibition Stand Builder Network',
  description: 'Learn about StandsZone\'s mission to connect exhibitors with top-rated exhibition stand builders worldwide. Over 40 countries, 500+ contractors, 5000+ successful projects.',
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
    title: 'About StandsZone | Global Exhibition Stand Builder Network',
    description: 'Learn about StandsZone\'s mission to connect exhibitors with top-rated exhibition stand builders worldwide. Over 40 countries, 500+ contractors, 5000+ successful projects.',
    images: [{ url: '/og-image.jpg' }],
  },
  alternates: {
    canonical: 'https://standszone.com/about',
  },
};

// Server component shell that renders the client component
export default function AboutPage() {
  return <AboutPageContent />;
}
