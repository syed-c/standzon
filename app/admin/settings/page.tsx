import React from 'react';
import SuperAdminLayout from '@/components/admin/SuperAdminLayout';
import { Sidebar, SidebarBody } from '@/components/admin/SuperAdminSidebar';
import SystemSettings from '@/components/SystemSettings';

const SettingsPage = () => {
  return (
    <SuperAdminLayout>
      <div className="flex h-full">
        <Sidebar>
          <SidebarBody />
        </Sidebar>
        <div className="flex-1 overflow-auto p-6">
          <SystemSettings />
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SettingsPage;