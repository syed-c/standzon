'use client';

import React, { Suspense } from 'react';
import { RealGlobalPagesManagerClient } from '@/components/RealGlobalPagesManagerClient';

// Loading component for Suspense fallback
function LoadingComponent() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading real global pages data from Convex...</p>
      </div>
    </div>
  );
}

export function RealGlobalPagesManager() {
  console.log("🔧 RealGlobalPagesManager: Component rendered (Server)");
  
  // Pass null/empty values for initial data to avoid server-side data fetching issues
  return (
    <Suspense fallback={<LoadingComponent />}>
      <RealGlobalPagesManagerClient 
        initialStats={null}
        initialCountryPages={[]}
        initialCityPages={[]}
      />
    </Suspense>
  );
}

export default RealGlobalPagesManager;