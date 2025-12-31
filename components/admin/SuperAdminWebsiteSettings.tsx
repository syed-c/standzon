import React, { Suspense } from "react";
import SuperAdminWebsiteSettingsClient from '@/components/admin/SuperAdminWebsiteSettingsClient';

// Loading component for Suspense fallback
function LoadingComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading website settings...</p>
      </div>
    </div>
  );
}

export default function SuperAdminWebsiteSettings() {
  console.log("🔧 SuperAdminWebsiteSettings: Component rendered (Server)");
  
  // Pass null values for initial user and settings to avoid server-side data fetching issues
  return (
    <Suspense fallback={<LoadingComponent />}>
      <SuperAdminWebsiteSettingsClient 
        initialUser={null} 
        initialSettings={null} 
      />
    </Suspense>
  );
}