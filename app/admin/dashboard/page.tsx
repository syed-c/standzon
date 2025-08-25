import React from 'react';
import { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import SuperAdminDashboard from '@/components/SuperAdminDashboard';
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
    <div className="min-h-screen bg-gray-50">
      <SuperAdminDashboard 
        adminId={mockAdmin.id}
        permissions={mockAdmin.permissions}
      />
    </div>
  );
}