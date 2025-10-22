"use client";

import React from 'react';
import GMBAPIFetchTool from '@/components/GMBAPIFetchTool';
import AdminLayout from '@/components/admin/AdminLayout';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';

export default function GMBIntegrationPage() {
  // Mock admin data for the tool
  const mockAdminData = {
    adminId: 'admin-001', 
    permissions: ['gmb_integration', 'builder_management', 'data_management']
  };

  return (
    <AdminLayout sidebar={<Sidebar />} topbar={<Topbar />}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">GMB Integration</h1>
        <p className="text-gray-600 mt-1">Import builders from Google My Business API</p>
      </div>
      
      <GMBAPIFetchTool 
        adminId={mockAdminData.adminId}
        permissions={mockAdminData.permissions}
      />
    </AdminLayout>
  );
}

