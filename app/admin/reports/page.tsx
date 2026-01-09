import React from 'react';
import SuperAdminLayout from '@/components/admin/SuperAdminLayout';
import { Sidebar, SidebarBody } from '@/components/admin/SuperAdminSidebar';
import WeeklyReports from '@/components/WeeklyReports';

const ReportsPage = () => {
  return (
    <SuperAdminLayout>
      <div className="flex h-full">
        <Sidebar>
          <SidebarBody />
        </Sidebar>
        <div className="flex-1 overflow-auto p-6">
          <WeeklyReports />
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default ReportsPage;