import React from 'react';
import { Metadata } from 'next';
import UnifiedBuilderDashboard from '@/components/UnifiedBuilderDashboard';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Builder Dashboard - ExhibitBay',
  description: 'Manage your exhibition stand building business with our unified dashboard system.',
};

export default function BuilderDashboardPage() {
  console.log('✅ Unified Builder Dashboard page loaded');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-20 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <UnifiedBuilderDashboard />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}