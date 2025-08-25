"use client";

import React from 'react';
import GMBAPIFetchTool from '@/components/GMBAPIFetchTool';

export default function GMBIntegrationPage() {
  // Mock admin data for the tool
  const mockAdminData = {
    adminId: 'admin-001', 
    permissions: ['gmb_integration', 'builder_management', 'data_management']
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">GMB Integration</h1>
          <p className="text-gray-600 mt-1">Import builders from Google My Business API</p>
        </div>
        
        <GMBAPIFetchTool 
          adminId={mockAdminData.adminId}
          permissions={mockAdminData.permissions}
        />
      </div>
    </div>
  );
}

