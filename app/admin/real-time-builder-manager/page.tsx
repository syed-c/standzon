import React from 'react';
import { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import RealTimeBuilderManager from '@/components/RealTimeBuilderManager';

export const metadata: Metadata = {
  title: 'Real-Time Builder Manager - Admin Dashboard',
  description: 'Advanced builder management with real-time updates, bulk operations, and live data sync.',
};

export default function RealTimeBuilderManagerPage() {
  console.log('Real-Time Builder Manager page loaded');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Real-Time Builder Manager</h1>
            <p className="text-gray-600 mt-2">
              Advanced builder management with live updates, bulk operations, and comprehensive controls
            </p>
          </div>
          
          <RealTimeBuilderManager />
        </div>
      </main>

      <Footer />
    </div>
  );
}