'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { BreadcrumbNavigation, generateBreadcrumbs } from './BreadcrumbNavigation';
import Navigation from './Navigation';
import Footer from './Footer';
import WhatsAppFloat from './WhatsAppFloat';

interface ClientPageWithBreadcrumbsProps {
  children: React.ReactNode;
  className?: string;
}

export default function ClientPageWithBreadcrumbs({ 
  children, 
  className = '' 
}: ClientPageWithBreadcrumbsProps) {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on the home page
  const showBreadcrumbs = pathname !== '/' && !pathname.startsWith('/debug');

  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <Navigation />
      {showBreadcrumbs && (
        <BreadcrumbNavigation items={generateBreadcrumbs(pathname)} />
      )}
      <main className="flex-grow pt-4">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}