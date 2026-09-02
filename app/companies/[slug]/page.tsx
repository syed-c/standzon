import { permanentRedirect } from 'next/navigation';

// The canonical builder profile route is /builders/[slug].
// This legacy /companies/[slug] path issues a permanent (308) redirect so that
// any existing links and indexed URLs consolidate onto the real profile page.
export default async function CompanyProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  permanentRedirect(`/builders/${slug}`);
}
