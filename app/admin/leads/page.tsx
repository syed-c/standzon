import React, { Suspense } from 'react';
import { SuperAdminLeadsManager } from '@/components/SuperAdminLeadsManager';
import AdminLayout from '@/components/admin/AdminLayout';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';

// Loading component for Suspense fallback
function LoadingComponent() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading lead management dashboard...</p>
      </div>
    </div>
  );
}

export default function AdminLeadsPage() {
  return (
    <AdminLayout sidebar={<Sidebar />} topbar={<Topbar />}>
      <div className="h-full">
        <Suspense fallback={<LoadingComponent />}>
          <SuperAdminLeadsManager />
        </Suspense>
      </div>
    </AdminLayout>
  );
}