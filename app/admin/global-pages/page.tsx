'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { GlobalPagesManager } from '@/components/GlobalPagesManager';

export default function GlobalPagesPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlobalPagesManager />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}