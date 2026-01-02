import React from 'react';
import LocationKKSDashboard from '@/components/client/LocationKKSDashboard';

export default function LocationKKSPage() {
  return (
    <div data-macaly="location-kks-page" className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <LocationKKSDashboard />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Location KKS - Exhibition Regions Database | Superadmin',
  description: 'Comprehensive Location Key Knowledge Store for exhibition regions worldwide. Manage exhibition hubs, GMB API integration, and location-based builder searches.',
  keywords: ['location database', 'exhibition hubs', 'GMB API', 'superadmin', 'location management']
};