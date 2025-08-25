import React from 'react';
import { Metadata } from 'next';
import UserManagement from '@/components/UserManagement';

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
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">ExhibitBay Admin</h1>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">User Management</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {mockAdmin.name}</span>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">AU</span>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="p-6">
        <UserManagement adminId={mockAdmin.id} />
      </main>
    </div>
  );
}