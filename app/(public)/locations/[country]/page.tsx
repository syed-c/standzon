"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { normalizeCountrySlug } from '@/lib/utils/slugUtils';

export default function CountryPage({ params }: { params: { country: string } }) {
  const router = useRouter();
  const country = params.country;
  
  useEffect(() => {
    // Redirect to the exhibition-stands route with the same country parameter
    router.replace(`/exhibition-stands/${normalizeCountrySlug(country)}`);
  }, [country, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p>Please wait while we redirect you to the country page.</p>
      </div>
    </div>
  );
}