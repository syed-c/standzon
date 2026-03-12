import React from 'react';
import { Metadata } from 'next';
import SuperAdminCommandCenter from '@/components/SuperAdminCommandCenter';

export const metadata: Metadata = {
  title: 'Command Center - Super Admin Dashboard',
  description: 'Central hub for platform oversight, analytics, and operational monitoring.',
};

// Mock admin session
const mockAdmin = {
  id: 'super-admin-001',
  name: 'Super Admin',
  email: 'superadmin@standzon.com',
  role: 'super_admin' as const,
  permissions: [
    'users.manage',
    'content.manage',
    'payments.manage',
    'analytics.view',
    'settings.manage',
    'system.admin',
    'tenants.manage',
    'builders.manage',
    'tradeshows.manage',
    'bulk_operations.access',
    'seo.manage',
    'real_time.access',
    'tenants.create',
    'tenants.update',
    'tenants.delete',
    'projects.manage',
    'leads.manage',
    'deployments.manage',
    'domains.manage',
    'integrations.manage',
    'reports.generate',
    'insights.view',
    'alerts.manage',
    'logs.view',
  ],
  lastLogin: '2024-12-19T10:00:00Z',
  loginCount: 234
};

export default function CommandCenterPage() {
  return (
    <>
      <SuperAdminCommandCenter 
        adminId={mockAdmin.id}
        permissions={mockAdmin.permissions}
      />
    </>
  );
}