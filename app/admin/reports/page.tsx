import React from 'react';
import SuperAdminLayout from '@/components/admin/SuperAdminLayout';
import Topbar from '@/components/admin/Topbar';
import WeeklyReports from '@/components/WeeklyReports';

const ReportsPage = () => {
  return (
    <SuperAdminLayout topbar={<Topbar />}>
      <div className="overflow-auto">
        <WeeklyReports />
      </div>
    </SuperAdminLayout>
  );
};

export default ReportsPage;