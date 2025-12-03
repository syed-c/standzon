import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import GraphicsPrintingPageContent from '@/components/GraphicsPrintingPageContent';

export const metadata: Metadata = siteMetadata['/trade-show-graphics-printing'] || {
  title: 'Trade Show Graphics & Printing | Professional Branding Services | StandsZone',
  description: 'High-quality large-format prints, branding, and wayfinding tailored for exhibitions. Professional graphics and printing services.',
  openGraph: {
    title: 'Trade Show Graphics & Printing | Professional Branding Services | StandsZone',
    description: 'High-quality large-format prints, branding, and wayfinding tailored for exhibitions. Professional graphics and printing services.',
    images: [{ url: '/og-image.jpg' }],
  },
  alternates: {
    canonical: 'https://standszone.com/trade-show-graphics-printing',
  },
};

export default function GraphicsPrintingPage() {
  return <GraphicsPrintingPageContent />;
}
