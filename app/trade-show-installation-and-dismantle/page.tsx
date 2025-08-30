import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import InstallationDismantlePageContent from '@/components/InstallationDismantlePageContent';

export const metadata: Metadata = siteMetadata['/trade-show-installation-and-dismantle'] || {
  title: 'Trade Show Installation & Dismantle | Professional I&D Services | StandsZone',
  description: 'End-to-end I&D services for a flawless show experience, from logistics to on-site execution. Professional installation and dismantle for exhibitions.',
  openGraph: {
    title: 'Trade Show Installation & Dismantle | Professional I&D Services | StandsZone',
    description: 'End-to-end I&D services for a flawless show experience, from logistics to on-site execution. Professional installation and dismantle for exhibitions.',
    images: [{ url: '/og-image.jpg' }],
  },
};

export default function InstallationDismantlePage() {
  return <InstallationDismantlePageContent />;
}
