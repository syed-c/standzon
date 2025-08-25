import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import BuildersDirectoryContent from '@/components/BuildersDirectoryContent';

// Export metadata from centralized metadata.json
export const metadata: Metadata = siteMetadata['/builders'];

// Server component shell that renders the client component
export default function BuildersPage() {
  return <BuildersDirectoryContent />;
}
