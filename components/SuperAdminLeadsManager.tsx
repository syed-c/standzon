'use client';

import React, { Suspense } from 'react';
import { SuperAdminLeadsManagerClient } from '@/components/SuperAdminLeadsManagerClient';

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

export function SuperAdminLeadsManager() {
  console.log("🔧 SuperAdminLeadsManager: Component rendered (Server)");
  
  // Pass empty arrays for initial leads and quote requests to avoid server-side data fetching issues
  return (
    <Suspense fallback={<LoadingComponent />}>
      <SuperAdminLeadsManagerClient 
        initialLeads={[]} 
        initialQuoteRequests={[]} 
      />
    </Suspense>
  );
}