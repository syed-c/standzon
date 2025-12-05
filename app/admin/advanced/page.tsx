import React from 'react';
import { Metadata } from 'next';
import AdvancedAdminDashboard from '@/components/AdvancedAdminDashboard';

export const metadata: Metadata = {
  title: 'Advanced Admin Control Center - ExhibitBay',
  description: 'Advanced administration tools for complete platform management.',
};

export default function AdvancedAdminPage() {
  return (
    <div className="min-h-screen">
      <AdvancedAdminDashboard 
        adminId="admin-001"
        permissions={[
          'users.manage',
          'content.manage',
          'payments.manage',
          'analytics.view',
          'settings.manage',
          'system.admin'
        ]}
      />
    </div>
  );
}