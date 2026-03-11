'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import { generateBreadcrumbs } from '@/lib/utils/breadcrumbUtils';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

interface GlobalLayoutProviderProps {
  children: React.ReactNode;
}

export default function GlobalLayoutProvider({ children }: GlobalLayoutProviderProps) {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([]);

  useEffect(() => {
    if (pathname) {
      setBreadcrumbs(generateBreadcrumbs(pathname));
    }
  }, [pathname]);

  // Don't show breadcrumbs on debug pages
  const showBreadcrumbs = !pathname.startsWith('/debug');

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      {showBreadcrumbs && (
        <div className="fixed top-16 left-0 right-0 z-[990] bg-[#FFFFFF] border-b border-gray-200" style={{ height: '48px' }}>
          <div className="responsive-container h-full flex items-center">
            <BreadcrumbNavigation items={breadcrumbs} className="!bg-transparent !border-b-0 !py-0 !shadow-none" />
          </div>
        </div>
      )}
      <main className="flex-grow" style={{ marginTop: showBreadcrumbs ? '112px' : '64px' }}>
        <div className="responsive-container">
          {children}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}