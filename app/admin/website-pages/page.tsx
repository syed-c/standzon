import React from 'react';
import WebsitePagesManager from '@/components/WebsitePagesManager';

export default function WebsitePagesPage() {
  console.log('Website Pages Management Page loaded');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📄 Website Pages Management</h1>
          <p className="text-gray-600 mb-4">
            Manage all static website pages including policy documents, legal pages, and content pages.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900">🛡️ Policy Pages</h3>
              <p className="text-sm text-blue-800 mt-1">
                Privacy policy, terms of service, cookie policy, and data protection
              </p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900">📋 Legal Compliance</h3>
              <p className="text-sm text-green-800 mt-1">
                EU GDPR compliant, CCPA ready, and international law coverage
              </p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-900">🎯 SEO Optimized</h3>
              <p className="text-sm text-purple-800 mt-1">
                Structured content for better search rankings and transparency
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="font-semibold text-orange-900">🚀 Content Management Features</h3>
            <ul className="text-sm text-orange-800 mt-2 space-y-1">
              <li>• Real-time editing with markdown support</li>
              <li>• Publish/unpublish pages instantly</li>
              <li>• SEO-friendly URL structure (/legal/privacy-policy)</li>
              <li>• Priority-based organization system</li>
              <li>• Automatic last modified tracking</li>
              <li>• Search and filter capabilities</li>
            </ul>
          </div>
        </div>

        <WebsitePagesManager />
      </div>
    </div>
  );
}