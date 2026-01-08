// This component is designed to be used in server components where pathname is passed as a prop
import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import WhatsAppFloat from './WhatsAppFloat';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';
import { generateBreadcrumbsServer } from '@/lib/utils/generateBreadcrumbs';

interface ServerPageWithBreadcrumbsProps {
  children: React.ReactNode;
  className?: string;
  pathname: string; // pathname is passed as a prop
}

export default function ServerPageWithBreadcrumbs({ 
  children, 
  className = '',
  pathname = ''
}: ServerPageWithBreadcrumbsProps) {
  // Don't show breadcrumbs on the home page
  const showBreadcrumbs = pathname !== '/' && !pathname.startsWith('/debug');

  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <Navigation />
      {showBreadcrumbs && (
        <BreadcrumbNavigation items={generateBreadcrumbsServer(pathname)} />
      )}
      <main className="flex-grow pt-4">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}