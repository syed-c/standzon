'use client';

import React from 'react';
import EnhancedBuilderManagement from '@/components/EnhancedBuilderManagement';

const mockAdmin = {
  id: 'admin-001',
  permissions: [
    'users.manage',
    'content.manage',
    'payments.manage',
    'analytics.view',
    'settings.manage',
    'system.admin',
    'builders.manage',
    'tradeshows.manage',
    'bulk_operations.access',
    'seo.manage',
    'real_time.access'
  ]
};

export default function TestBuilderManagementPage() {
  console.log('Test Builder Management Page loaded');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🔧 Builder Management Testing Page</h1>
          <p className="text-gray-600">
            This page directly tests the Enhanced Builder Management component to verify all CRUD operations work correctly.
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900">✅ Expected Functionality:</h3>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Smart Builder Tab with full CRUD operations</li>
              <li>• Builder Intelligence Tab with analytics</li>
              <li>• View, Edit, Delete, Activate/Deactivate buttons - ALL FUNCTIONAL</li>
              <li>• Real-time synchronization across all platforms</li>
              <li>• Advanced filtering by country, city, status, plan type</li>
            </ul>
          </div>
        </div>

        <EnhancedBuilderManagement 
          adminId={mockAdmin.id}
          permissions={mockAdmin.permissions}
        />
      </div>
    </div>
  );
}