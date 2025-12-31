'use client';

import React from 'react';
import SmartBuildersManager from '@/components/SmartBuildersManager';

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

export default function SmartBuildersPage() {
  console.log('Smart Builders Management Page loaded with enhanced features');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🚀 Smart Builder Management</h1>
          <p className="text-gray-600 mb-4">
            Complete Smart Builder Management with enhanced bulk operations, select all, and delete functionality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900">✅ Select All Functionality</h3>
              <p className="text-sm text-green-800 mt-1">
                Select all builders with checkbox and "Select All" button
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900">🗑️ Bulk Delete Operations</h3>
              <p className="text-sm text-blue-800 mt-1">
                Delete multiple selected builders with confirmation dialogs
              </p>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-900">💥 Delete All Option</h3>
              <p className="text-sm text-red-800 mt-1">
                Danger zone with "Delete All Builders" functionality
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="font-semibold text-orange-900">🔗 Database Integration</h3>
            <ul className="text-sm text-orange-800 mt-2 space-y-1">
              <li>• All deletions are permanent and remove builders from the entire database</li>
              <li>• Deleted builders are removed from website listings, location pages, and API responses</li>
              <li>• No ghost data or undeletable cache remains after deletion</li>
              <li>• Individual delete buttons work with proper confirmation dialogs</li>
            </ul>
          </div>
        </div>

        <SmartBuildersManager 
          adminId={mockAdmin.id}
          permissions={mockAdmin.permissions}
        />
      </div>
    </div>
  );
}
