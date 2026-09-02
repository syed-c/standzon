import { permanentRedirect } from 'next/navigation';
import { normalizeCountrySlug } from '@/lib/utils/slugUtils';

// This legacy path is a permanent (308) server-side redirect to the canonical
// /exhibition-stands/... route so search engines consolidate signals correctly.
export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  permanentRedirect(`/exhibition-stands/${normalizeCountrySlug(country)}`);
}
