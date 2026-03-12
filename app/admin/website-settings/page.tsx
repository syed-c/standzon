import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import SuperAdminWebsiteSettings from '@/components/SuperAdminWebsiteSettings';

export const metadata: Metadata = {
  title: 'Website Settings • Admin Dashboard',
  description: 'Manage website content, contact information, and branding settings.',
};

export default function WebsiteSettingsPage() {
  return (
    <>
      <SuperAdminWebsiteSettings />
    </>
  );
}