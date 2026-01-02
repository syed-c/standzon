import React from 'react';
import { Metadata } from 'next';
import NewBuilderDashboard from '@/components/client/NewBuilderDashboard';
import AuthBoundary from '@/components/boundaries/AuthBoundary';

export const metadata: Metadata = {
  title: 'Builder Dashboard - ExhibitBay',
  description: 'Manage your exhibition stand building business with our unified dashboard system.',
};

export default function BuilderDashboardPage() {
  console.log('✅ Unified Builder Dashboard page loaded');

  return (
    <AuthBoundary requiredRole="builder">
      <div className="max-w-7xl mx-auto py-6">
        <NewBuilderDashboard />
      </div>
    </AuthBoundary>
  );
}
