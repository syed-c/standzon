'use client';

import React, { Suspense } from 'react';
import { RealSuperAdminLocationManagerClient } from '@/components/RealSuperAdminLocationManagerClient';

// Loading component for Suspense fallback
function LoadingComponent() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading real location data from Convex...</p>
      </div>
    </div>
  );
}

export function RealSuperAdminLocationManager() {
  console.log("🔧 RealSuperAdminLocationManager: Component rendered (Server)");
  
  // Pass empty arrays/null values for initial data to avoid server-side data fetching issues
  return (
    <Suspense fallback={<LoadingComponent />}>
      <RealSuperAdminLocationManagerClient 
        initialCountries={[]}
        initialCities={[]}
        initialLocationStats={null}
      />
    </Suspense>
  );
}

export default RealSuperAdminLocationManager;