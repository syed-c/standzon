import React from 'react';
import { Metadata } from 'next';
import SuperAdminCommandCenter from '@/components/SuperAdminCommandCenter';
import SuperAdminLayout from '@/components/admin/SuperAdminLayout';
import { Sidebar } from '@/components/admin/SuperAdminSidebar';
import Topbar from '@/components/admin/Topbar';

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
    <SuperAdminLayout 
      sidebar={<Sidebar children={undefined} />} 
      topbar={<Topbar />}
    >
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:shadow-2xl transition-all duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Super Admin Command Center</h1>
              <p className="text-gray-400 mt-1">Platform oversight, analytics, and operational monitoring.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Operational
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-xl text-sm bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border border-blue-500/30">
                Super Admin
              </div>
            </div>
          </div>
        </div>

        <SuperAdminCommandCenter 
          adminId={mockAdmin.id}
          permissions={mockAdmin.permissions}
        />
      </div>
    </SuperAdminLayout>
  );
}