import React from 'react';
import { Metadata } from 'next';
import NewBuilderDashboard from '@/components/NewBuilderDashboard';
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
          <NewBuilderDashboard builderId="77836f44-6832-4866-81f2-74c84303aa7c" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}