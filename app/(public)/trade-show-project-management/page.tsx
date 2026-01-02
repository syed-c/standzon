import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import ProjectManagementPageContent from '@/components/client/ProjectManagementPageContent';

export const metadata: Metadata = siteMetadata['/trade-show-project-management'] || {
  title: 'Trade Show Project Management | Professional PM Services | StandsZone',
  description: 'End-to-end PM including vendor coordination, timelines, and on-site supervision. Professional project management for exhibitions.',
  openGraph: {
    title: 'Trade Show Project Management | Professional PM Services | StandsZone',
    description: 'End-to-end PM including vendor coordination, timelines, and on-site supervision. Professional project management for exhibitions.',
    images: [{ url: '/og-image.jpg' }],
  },
};

export default function ProjectManagementPage() {
  return <ProjectManagementPageContent />;
}
