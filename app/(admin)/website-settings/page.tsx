import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import SuperAdminWebsiteSettings from '@/components/server/SuperAdminWebsiteSettings';
import AdminLayout from '@/components/client/AdminLayout';
import Sidebar from '@/components/client/Sidebar';
import Topbar from '@/components/client/Topbar';

export const metadata: Metadata = {
  title: 'Website Settings • Admin Dashboard',
  description: 'Manage website content, contact information, and branding settings.',
};

export default function WebsiteSettingsPage() {
  return (
    <AdminLayout sidebar={<Sidebar />} topbar={<Topbar />}>
      <SuperAdminWebsiteSettings />
    </AdminLayout>
  );
}