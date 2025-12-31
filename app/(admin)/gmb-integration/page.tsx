'use client';

import React, { Suspense, useState } from 'react';
import GMBAPIFetchTool from '@/components/GMBAPIFetchTool';
import AdminLayout from '@/components/admin/AdminLayout';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';

function GMBIntegrationClient() {
  // Mock admin data for the tool
  const mockAdminData = {
    adminId: 'admin-001', 
    permissions: ['gmb_integration', 'builder_management', 'data_management']
  };

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">GMB Integration</h1>
      <p className="text-gray-600 mt-1">Import builders from Google My Business API</p>
      
      <GMBAPIFetchTool 
        adminId={mockAdminData.adminId}
        permissions={mockAdminData.permissions}
      />
    </div>
  );
}

// Loading component for Suspense fallback
function LoadingComponent() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading GMB integration tool...</p>
      </div>
    </div>
  );
}

export default function GMBIntegrationPage() {
  return (
    <AdminLayout sidebar={<Sidebar />} topbar={<Topbar />}>
      <Suspense fallback={<LoadingComponent />}>
        <GMBIntegrationClient />
      </Suspense>
    </AdminLayout>
  );
}