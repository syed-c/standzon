import React from 'react';
import SuperAdminLayout from '@/components/admin/SuperAdminLayout';
import Topbar from '@/components/admin/Topbar';
import DeploymentsPanel from '@/components/DeploymentsPanel';

const DeploymentsPage = () => {
  return (
    <SuperAdminLayout topbar={<Topbar />}>
      <div className="overflow-auto">
        <DeploymentsPanel />
      </div>
    </SuperAdminLayout>
  );
};

export default DeploymentsPage;