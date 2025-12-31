import React from 'react';
import { Metadata } from 'next';
import UserManagement from '@/components/admin/UserManagement';
import AdminLayout from '@/components/admin/AdminLayout';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';

export const metadata: Metadata = {
  title: 'User Management - Admin Dashboard',
  description: 'Manage platform users, builders, and administrators.',
};

// Mock admin session
const mockAdmin = {
  id: 'admin-001',
  name: 'Admin User',
  permissions: ['users.manage', 'users.delete', 'users.create']
};

export default function AdminUsersPage() {
  return (
    <AdminLayout sidebar={<Sidebar />} topbar={<Topbar />}>
      <UserManagement adminId={mockAdmin.id} />
    </AdminLayout>
  );
}