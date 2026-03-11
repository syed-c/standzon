import React from 'react';
import SuperAdminLayout from '@/components/admin/SuperAdminLayout';
import Topbar from '@/components/admin/Topbar';
import RBACManagement from '@/components/RBACManagement';

const RBACPage = () => {
  return (
    <SuperAdminLayout topbar={<Topbar />}>
      <div className="overflow-auto">
        <RBACManagement />
      </div>
    </SuperAdminLayout>
  );
};

export default RBACPage;