import React, { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import ManageBuildersClient from '@/components/ManageBuildersClient';

// Loading component for Suspense fallback
function LoadingComponent() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Exhibition Builders</h1>
            <p className="text-gray-600">Edit, verify, and manage all exhibition stand builders</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Filters skeleton */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message indicating client-side only */}
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Loading Builder Management</h3>
            <p className="text-gray-600">
              This page requires client-side interaction and will load shortly.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ManageBuildersPage() {
  // Pass an empty array as initial builders to avoid server-side data fetching issues
  return (
    <Suspense fallback={<LoadingComponent />}>
      <ManageBuildersClient initialBuilders={[]} />
    </Suspense>
  );
}