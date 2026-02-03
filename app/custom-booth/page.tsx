import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import CustomBoothPageContent from '@/components/CustomBoothPageContent';

export const metadata: Metadata = siteMetadata['/custom-booth'] || {
  title: 'Custom Exhibition Booths | Bespoke Trade Show Stands | StandsZone',
  description: 'Custom exhibition booth design and construction. Bespoke trade show stands tailored to your brand, industry, and exhibition requirements.',
  openGraph: {
    title: 'Custom Exhibition Booths | Bespoke Trade Show Stands | StandsZone',
    description: 'Custom exhibition booth design and construction. Bespoke trade show stands tailored to your brand, industry, and exhibition requirements.',
    images: [{ url: '/og-image.jpg' }],
  },
  alternates: {
    canonical: 'https://standszone.com/custom-booth',
  },
};


export default function CustomBoothPage() {
  return (
    <CustomBoothPageContent />
  );
}