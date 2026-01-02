import React, { Suspense } from 'react';
import { SuperAdminLeadsManager } from '@/components/client/SuperAdminLeadsManager';
import AdminLayout from '@/components/client/AdminLayout';
import Sidebar from '@/components/client/Sidebar';
import Topbar from '@/components/client/Topbar';

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