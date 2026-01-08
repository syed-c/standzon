import React from 'react';
import SuperAdminLayout from '@/components/admin/SuperAdminLayout';
import SuperAdminSidebar from '@/components/admin/SuperAdminSidebar';
import BillingFinanceDashboard from '@/components/BillingFinanceDashboard';

const BillingPage = () => {
  return (
    <SuperAdminLayout>
      <div className="flex h-full">
        <SuperAdminSidebar />
        <div className="flex-1 overflow-auto p-6">
          <BillingFinanceDashboard />
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default BillingPage;