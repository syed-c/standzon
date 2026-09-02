import { permanentRedirect } from 'next/navigation';
import { normalizeCountrySlug, normalizeCitySlug } from '@/lib/utils/slugUtils';

// This legacy path is a permanent (308) server-side redirect to the canonical
// /exhibition-stands/... route so search engines consolidate signals correctly.
export default async function CityPage({
  params,
}: {
  params: Promise<{ country: string; city: string }>;
}) {
  const { country, city } = await params;
  permanentRedirect(
    `/exhibition-stands/${normalizeCountrySlug(country)}/${normalizeCitySlug(city)}`
  );
}
