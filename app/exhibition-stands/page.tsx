import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import ExhibitionStandsContent from '@/components/ExhibitionStandsContent';

// Export metadata from centralized metadata.json
export const metadata: Metadata = siteMetadata['/exhibition-stands'];

export default function ExhibitionStandsPage() {
  return <ExhibitionStandsContent />;
}
