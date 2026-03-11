import React from 'react';
import SuperAdminLayout from '@/components/admin/SuperAdminLayout';
import Topbar from '@/components/admin/Topbar';
import SystemSettings from '@/components/SystemSettings';

const SettingsPage = () => {
  return (
    <SuperAdminLayout topbar={<Topbar />}>
      <div className="overflow-auto">
        <SystemSettings />
      </div>
    </SuperAdminLayout>
  );
};

export default SettingsPage;