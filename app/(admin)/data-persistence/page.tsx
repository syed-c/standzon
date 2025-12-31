'use client';

import React from 'react';
import DataPersistenceMonitor from '@/components/admin/DataPersistenceMonitor';
import AdminLayout from '@/components/admin/AdminLayout';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';

export default function DataPersistenceMonitorPage() {
  return (
    <AdminLayout sidebar={<Sidebar />} topbar={<Topbar />}>
      {/* Old main page content only, no Navigation/Footer */}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <DataPersistenceMonitor />
        </div>
      </div>
    </AdminLayout>
  );
}