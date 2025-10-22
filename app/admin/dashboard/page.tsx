import React from 'react';
import { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import SuperAdminDashboard from '@/components/SuperAdminDashboard';
import AdminLayout from '@/components/admin/AdminLayout';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';
import { 
  BarChart3, 
  Users, 
  Building2, 
  TrendingUp, 
  ChevronRight, 
  Activity, 
  Database, 
  Globe, 
  Settings, 
  FileText, 
  Award, 
  MessageSquare,
  Download
} from 'lucide-react';

export const metadata: Metadata = siteMetadata['/admin/dashboard'];

// Mock admin session - In production, this would come from authentication
const mockAdmin = {
  id: 'admin-001',
  name: 'Super Admin',
  email: 'admin@exhibitbay.com',
  role: 'super_admin' as const,
  permissions: [
    'users.manage',
    'content.manage',
    'payments.manage',
    'analytics.view',
    'settings.manage',
    'system.admin',
    'builders.manage',
    'tradeshows.manage',
    'bulk_operations.access',
    'seo.manage',
    'real_time.access'
  ],
  lastLogin: '2024-12-19T10:00:00Z',
  loginCount: 234
};

export default function SmartAdminDashboardPage() {
  console.log('Smart Admin AI Dashboard loaded for:', mockAdmin);

  return (
    <AdminLayout sidebar={<Sidebar />} topbar={<Topbar />}>
      {/* Consolidated Budget Card placeholder wrapper; keep logic inside SuperAdminDashboard */}
      <div className="space-y-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Consolidated Budget</h2>
            <div className="flex items-center gap-2">
              {['D','W','M','Y','Custom'].map(x => (
                <button key={x} className="px-2.5 py-1 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 text-gray-800">{x}</button>
              ))}
            </div>
          </div>
          {/* Keep existing charts/totals inside dashboard component */}
          <SuperAdminDashboard 
            adminId={mockAdmin.id}
            permissions={mockAdmin.permissions}
            hideSidebar
          />
        </div>

        {/* All Deals table shell to match layout; existing pages remain intact */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">All deals</h2>
            <div className="flex items-center gap-2">
              {['Filter','Sort','Search'].map(x => (
                <button key={x} className="px-2.5 py-1.5 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 text-gray-800">{x}</button>
              ))}
              <button className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 text-gray-900">Export</button>
              <button className="px-3 py-1.5 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700">Add New</button>
            </div>
          </div>
          <div className="p-6">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-600 font-semibold">
                    {['ID','Deals','Contact','Email','Value','Source'].map(h => (
                      <th key={h} className="text-left py-3 pr-6">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Placeholder rows to preserve layout only; real data lives in existing admin pages */}
                  {[1,2,3].map(i => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-3 pr-6">0{i}</td>
                      <td className="py-3 pr-6">Sample Deal {i}</td>
                      <td className="py-3 pr-6">Contact {i}</td>
                      <td className="py-3 pr-6">contact{i}@example.com</td>
                      <td className="py-3 pr-6">$ {3000 + i * 123}</td>
                      <td className="py-3 pr-6">Inbound</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}