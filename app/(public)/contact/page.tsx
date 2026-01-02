import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import ContactPageContent from '@/components/client/ContactPageContent';

// Export metadata from centralized metadata.json
export const metadata: Metadata = siteMetadata['/contact'] || {
  title: 'Get Free Exhibition Stand Quotes | Contact StandsZone',
  description: 'Get free quotes from pre-vetted exhibition stand builders. Connect with up to 5 contractors for your trade show project. 24-hour response guaranteed.',
  openGraph: {
    title: 'Get Free Exhibition Stand Quotes | Contact StandsZone',
    description: 'Get free quotes from pre-vetted exhibition stand builders. Connect with up to 5 contractors for your trade show project. 24-hour response guaranteed.',
    images: [{ url: '/og-image.jpg' }],
  },
  alternates: {
    canonical: 'https://standszone.com/contact',
  },
};

export default function ContactPage() {
  return <ContactPageContent />;
}
