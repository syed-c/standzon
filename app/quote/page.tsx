import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import QuoteRequestContent from '@/components/QuoteRequestContent';

export const metadata: Metadata = siteMetadata['/quote'] || {
  title: 'Get Free Exhibition Stand Quote | Instant Quote Request | StandsZone',
  description: 'Get instant free quotes from verified exhibition stand builders. Compare prices, services, and find the perfect contractor for your trade show project.',
  openGraph: {
    title: 'Get Free Exhibition Stand Quote | Instant Quote Request | StandsZone',
    description: 'Get instant free quotes from verified exhibition stand builders. Compare prices, services, and find the perfect contractor for your trade show project.',
    images: [{ url: '/og-image.jpg' }],
  },
  alternates: {
    canonical: 'https://standszone.com/quote',
  },
};

export default function QuotePage() {
  return <QuoteRequestContent />;
}
