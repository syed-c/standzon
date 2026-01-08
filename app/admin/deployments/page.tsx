import React from 'react';
import SuperAdminLayout from '@/components/admin/SuperAdminLayout';
import SuperAdminSidebar from '@/components/admin/SuperAdminSidebar';
import DeploymentsPanel from '@/components/DeploymentsPanel';

const DeploymentsPage = () => {
  return (
    <SuperAdminLayout>
      <div className="flex h-full">
        <SuperAdminSidebar />
        <div className="flex-1 overflow-auto p-6">
          <DeploymentsPanel />
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default DeploymentsPage;