"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { normalizeCountrySlug, normalizeCitySlug } from '@/lib/utils/slugUtils';

export default function CityPage({ params }: { params: { country: string, city: string } }) {
  const router = useRouter();
  const { country, city } = params;
  
  useEffect(() => {
    // Redirect to the exhibition-stands route with the same country and city parameters
    router.replace(`/exhibition-stands/${normalizeCountrySlug(country)}/${normalizeCitySlug(city)}`);
  }, [country, city, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p>Please wait while we redirect you to the city page.</p>
      </div>
    </div>
  );
}