import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import ContactPageContent from '@/components/ContactPageContent';

// Export metadata from centralized metadata.json
export const metadata: Metadata = siteMetadata['/contact'];

export default function ContactPage() {
  return <ContactPageContent />;
}
