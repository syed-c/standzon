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

  // Don't show breadcrumbs on the home page or debug pages
  const showBreadcrumbs = pathname !== '/' && !pathname.startsWith('/debug');

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      {showBreadcrumbs && (
        <div className="sticky top-16 z-10 bg-white">
          <BreadcrumbNavigation items={breadcrumbs} />
        </div>
      )}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}