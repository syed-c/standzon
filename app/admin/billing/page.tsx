import React from 'react';
import SuperAdminLayout from '@/components/admin/SuperAdminLayout';
import Topbar from '@/components/admin/Topbar';
import BillingFinanceDashboard from '@/components/BillingFinanceDashboard';

const BillingPage = () => {
  return (
    <SuperAdminLayout topbar={<Topbar />}>
      <div className="overflow-auto">
        <BillingFinanceDashboard />
      </div>
    </SuperAdminLayout>
  );
};

export default BillingPage;