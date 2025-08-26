'use client';

import React from 'react';
import { SuperAdminLeadsManager } from '@/components/SuperAdminLeadsManager';

export default function AdminLeadsPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
        <SuperAdminLeadsManager />
      </div>
    </div>
  );
}
