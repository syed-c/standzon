'use client';

import React from 'react';
import { SuperAdminLeadsManager } from '@/components/SuperAdminLeadsManager';
import AdminLayout from '@/components/admin/AdminLayout';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';

export default function AdminLeadsPage() {
  return (
    <AdminLayout sidebar={<Sidebar />} topbar={<Topbar />}>
      <div className="h-full">
        <SuperAdminLeadsManager />
      </div>
    </AdminLayout>
  );
}
