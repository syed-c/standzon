import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import BulkDataImportClient from './BulkDataImportClient';

export const metadata: Metadata = siteMetadata['/admin/bulk-data-import'] || {
  title: 'Bulk Data Import | Admin Dashboard',
  description: 'Import sample builders and data to populate the platform'
};

export default function BulkDataImportPage() {
  return <BulkDataImportClient />;
}