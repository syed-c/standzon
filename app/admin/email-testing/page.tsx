import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import EmailTestingClient from './EmailTestingClient';

export const metadata: Metadata = siteMetadata['/admin/email-testing'] || {
  title: 'Email Testing | Admin Dashboard',
  description: 'Test and verify email notification system with production SMTP configuration'
};

export default function EmailTestingPage() {
  return <EmailTestingClient />;
}