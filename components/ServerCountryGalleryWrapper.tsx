'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the CountryGallery component with no SSR
const DynamicCountryGallery = dynamic(
  () => import('./CountryGallery'),
  { ssr: false }
);

export default function ServerCountryGalleryWrapper({ images }: { images: string[] }) {
  return (
    <Suspense fallback={<div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>}>
      <DynamicCountryGallery images={images} />
    </Suspense>
  );
}