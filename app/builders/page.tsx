import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import BuildersDirectoryContent from '@/components/BuildersDirectoryContent';

// Export metadata from centralized metadata.json
export const metadata: Metadata = siteMetadata['/builders'] || {
  title: 'Exhibition Stand Builders Directory | Verified Contractors | StandsZone',
  description: 'Browse our directory of verified exhibition stand builders worldwide. Find top-rated contractors with proven track records for your trade show project.',
  openGraph: {
    title: 'Exhibition Stand Builders Directory | Verified Contractors | StandsZone',
    description: 'Browse our directory of verified exhibition stand builders worldwide. Find top-rated contractors with proven track records for your trade show project.',
    images: [{ url: '/og-image.jpg' }],
  },
  alternates: {
    canonical: 'https://standszone.com/builders',
  },
};

import { Suspense } from 'react';

// Server component shell that renders the client component
export default function BuildersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading builders...</div>}>
      <BuildersDirectoryContent />
    </Suspense>
  );
}
