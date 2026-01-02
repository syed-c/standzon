import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import BoothRentalPageContent from '@/components/client/BoothRentalPageContent';

export const metadata: Metadata = siteMetadata['/booth-rental'] || {
  title: 'Booth Rental Services | Exhibition Stand Rental | StandsZone',
  description: 'Flexible, cost-effective exhibition booth rental solutions with full setup and support. Professional rental services for trade shows and exhibitions.',
  openGraph: {
    title: 'Booth Rental Services | Exhibition Stand Rental | StandsZone',
    description: 'Flexible, cost-effective exhibition booth rental solutions with full setup and support. Professional rental services for trade shows and exhibitions.',
    images: [{ url: '/og-image.jpg' }],
  },
  alternates: {
    canonical: 'https://standszone.com/booth-rental',
  },
};

export default function BoothRentalPage() {
  return <BoothRentalPageContent />;
} 