import React from 'react';
import { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import SuperAdminDashboard from '@/components/admin/SuperAdminDashboard';
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
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const metadata: Metadata = siteMetadata['/admin/dashboard'] || {
  title: 'Admin Dashboard | StandsZone',
  description: 'Administrator dashboard for managing the StandsZone platform.',
  openGraph: {
    title: 'Admin Dashboard | StandsZone',
    description: 'Administrator dashboard for managing the StandsZone platform.',
    images: [{ url: '/og-image.jpg' }],
  },
  alternates: {
    canonical: 'https://standszone.com/admin/dashboard',
  },
};

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
  return (
    <AdminLayout sidebar={<Sidebar />} topbar={<Topbar />}>
      {/* Consolidated Budget Card placeholder wrapper; keep logic inside SuperAdminDashboard */}
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="premium-glass-card p-6 hover:shadow-2xl transition-all duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, Admin</h1>
              <p className="text-gray-400 mt-1">Here's what's happening with your platform today.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Last updated: Just now</span>
              </div>
              <button className="px-3 py-1.5 rounded-xl text-sm bg-gray-700/60 text-gray-300 hover:bg-gray-700/80 transition-all duration-300 flex items-center gap-1 shadow-md hover:shadow-lg">
                <Activity className="w-4 h-4" />
                Live
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Total Revenue', value: '$42,567', change: '+12.5%', icon: <TrendingUp className="w-5 h-5" />, color: 'from-green-500/30 via-emerald-500/30 to-teal-500/30' },
            { title: 'Active Builders', value: '1,248', change: '+8.2%', icon: <Building2 className="w-5 h-5" />, color: 'from-blue-500/30 via-indigo-500/30 to-violet-500/30' },
            { title: 'New Leads', value: '324', change: '+5.7%', icon: <Users className="w-5 h-5" />, color: 'from-purple-500/30 via-fuchsia-500/30 to-pink-500/30' },
            { title: 'Pending Tasks', value: '24', change: '-3.1%', icon: <AlertCircle className="w-5 h-5" />, color: 'from-amber-500/30 via-orange-500/30 to-red-500/30' }
          ].map((stat, index) => (
            <div 
              key={index} 
              className="premium-stat-card overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className={`p-5 bg-gradient-to-r ${stat.color} rounded-xl`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 text-white shadow-lg">
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="premium-glass-card p-6 hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Consolidated Dashboard</h2>
            <div className="flex items-center gap-2">
              {['D','W','M','Y','Custom'].map(x => (
                <button 
                  key={x} 
                  className="px-3 py-1.5 rounded-xl text-sm bg-gray-700/60 text-gray-300 hover:bg-gray-700/80 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {x}
                </button>
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

        {/* Recent Activity */}
        <div className="premium-glass-card overflow-hidden hover:shadow-2xl transition-all duration-500">
          <div className="p-6 border-b border-gray-700/60">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { action: 'New builder registered', user: 'Builder Co.', time: '2 min ago', type: 'success' },
                { action: 'Lead assigned', user: 'John Smith', time: '15 min ago', type: 'info' },
                { action: 'Payment received', user: '$2,400', time: '1 hour ago', type: 'success' },
                { action: 'System backup completed', user: 'Automated', time: '3 hours ago', type: 'info' },
                { action: 'Profile updated', user: 'Sarah Johnson', time: '5 hours ago', type: 'warning' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-700/50 last:border-0 last:pb-0 hover:bg-gray-700/20 transition-all duration-300 rounded-xl p-2">
                  <div className={`p-2 rounded-xl ${
                    activity.type === 'success' ? 'bg-green-500/30 text-green-400 border border-green-500/50' :
                    activity.type === 'warning' ? 'bg-amber-500/30 text-amber-400 border border-amber-500/50' :
                    'bg-blue-500/30 text-blue-400 border border-blue-500/50'
                  }`}>
                    {activity.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
                     activity.type === 'warning' ? <AlertCircle className="w-4 h-4" /> :
                     <Activity className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-200">{activity.action}</p>
                    <p className="text-sm text-gray-400 mt-1">{activity.user} • {activity.time}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Deals table shell to match layout; existing pages remain intact */}
        <div className="premium-glass-card overflow-hidden hover:shadow-2xl transition-all duration-500">
          <div className="p-6 border-b border-gray-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white">All deals</h2>
            <div className="flex flex-wrap items-center gap-2">
              {['Filter','Sort','Search'].map(x => (
                <button 
                  key={x} 
                  className="px-3 py-1.5 rounded-xl text-sm bg-gray-700/60 text-gray-300 hover:bg-gray-700/80 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {x}
                </button>
              ))}
              <button className="px-3 py-1.5 rounded-xl text-sm bg-gray-700 text-gray-200 hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg">
                Export
              </button>
              <button className="premium-gradient-button rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-300">
                Add New
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="w-full overflow-x-auto rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 font-semibold">
                    {['ID','Deals','Contact','Email','Value','Source'].map(h => (
                      <th key={h} className="text-left py-3 pr-6">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Placeholder rows to preserve layout only; real data lives in existing admin pages */}
                  {[1,2,3].map(i => (
                    <tr key={i} className="border-t border-gray-700/50 hover:bg-gray-700/30 transition-all duration-300 rounded-lg">
                      <td className="py-3 pr-6 text-gray-300">0{i}</td>
                      <td className="py-3 pr-6 text-gray-200">Sample Deal {i}</td>
                      <td className="py-3 pr-6 text-gray-300">Contact {i}</td>
                      <td className="py-3 pr-6 text-gray-400">contact{i}@example.com</td>
                      <td className="py-3 pr-6 text-gray-200">$ {3000 + i * 123}</td>
                      <td className="py-3 pr-6 text-gray-400">Inbound</td>
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