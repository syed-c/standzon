import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import QuoteRequestContent from '@/components/QuoteRequestContent';

export const metadata: Metadata = siteMetadata['/quote'];

export default function QuotePage() {
  return <QuoteRequestContent />;
}
