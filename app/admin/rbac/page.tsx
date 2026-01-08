import React from 'react';
import SuperAdminLayout from '@/components/admin/SuperAdminLayout';
import SuperAdminSidebar from '@/components/admin/SuperAdminSidebar';
import RBACManagement from '@/components/RBACManagement';

const RBACPage = () => {
  return (
    <SuperAdminLayout>
      <div className="flex h-full">
        <SuperAdminSidebar />
        <div className="flex-1 overflow-auto p-6">
          <RBACManagement />
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default RBACPage;