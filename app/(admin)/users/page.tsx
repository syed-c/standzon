import React from 'react';
import { Metadata } from 'next';
import UserManagement from '@/components/client/UserManagement';
import AuthBoundary from '@/components/client/AuthBoundary';

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
    <AuthBoundary requiredRole="admin">
      <UserManagement adminId={mockAdmin.id} />
    </AuthBoundary>
  );
}
