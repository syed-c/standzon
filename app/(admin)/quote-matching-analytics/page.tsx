import React from 'react';
import { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import RealTimePlatformAnalytics from '@/components/RealTimePlatformAnalytics';

export const metadata: Metadata = {
  title: 'Quote Matching Analytics - Phase 4 Complete | ExhibitBay',
  description: 'Real-time analytics dashboard for AI-powered quote matching system. Phase 4 implementation featuring intelligent builder matching and platform performance insights.',
};

export default function QuoteMatchingAnalyticsPage() {
  console.log('Quote Matching Analytics page loaded - Phase 4 Complete');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navigation />
      
      <main className="pt-20">
        <RealTimePlatformAnalytics />
      </main>

      <Footer />
    </div>
  );
}