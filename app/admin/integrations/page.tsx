import React from 'react';
import { Metadata } from 'next';
import IntegrationsManagement from '@/components/IntegrationsManagement';
import SuperAdminLayout from '@/components/admin/SuperAdminLayout';
import { Sidebar } from '@/components/admin/SuperAdminSidebar';
import Topbar from '@/components/admin/Topbar';

export const metadata: Metadata = {
  title: 'Integrations Management - Super Admin Dashboard',
  description: 'Manage third-party integrations, API connections, and webhooks.',
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

export default function IntegrationsManagementPage() {
  return (
    <SuperAdminLayout 
      sidebar={<Sidebar />} 
      topbar={<Topbar />}
    >
      <div className="space-y-8">
        <IntegrationsManagement 
          adminId={mockAdmin.id}
          permissions={mockAdmin.permissions}
        />
      </div>
    </SuperAdminLayout>
  );
}