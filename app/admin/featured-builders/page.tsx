import React from 'react';
import FeaturedBuildersManager from '@/components/FeaturedBuildersManager';

export default function FeaturedBuildersPage() {
  console.log('Featured Builders Management Page loaded');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🌟 Featured Builders Management</h1>
          <p className="text-gray-600 mb-4">
            Control which builders appear as featured on location pages with priority ranking system.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-900">✨ Admin Featured Control</h3>
              <p className="text-sm text-purple-800 mt-1">
                Set top 3-5 builders to appear first on all location pages
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900">🎯 Priority Rankings</h3>
              <p className="text-sm text-blue-800 mt-1">
                Control exact position (Top 1, Top 2, Top 3) for featured builders
              </p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900">🏆 Auto-Feature Top Rated</h3>
              <p className="text-sm text-green-800 mt-1">
                Quickly feature the top 3 highest-rated verified builders
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="font-semibold text-orange-900">📍 Location Page Impact</h3>
            <ul className="text-sm text-orange-800 mt-2 space-y-1">
              <li>• Admin featured builders appear at the top of all location pages</li>
              <li>• Featured builders get special badges and highlighting</li>
              <li>• Priority ranking controls exact display order</li>
              <li>• Regular featured status is maintained separately</li>
            </ul>
          </div>
        </div>

        <FeaturedBuildersManager />
      </div>
    </div>
  );
}