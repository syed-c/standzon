// This component is designed to be used in server components where pathname is passed as a prop
import React from 'react';
import { ServerBreadcrumbNavigation } from './ServerBreadcrumbNavigation';
import { generateBreadcrumbs } from '@/lib/utils/breadcrumbUtils';

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
      {showBreadcrumbs && (
        <ServerBreadcrumbNavigation items={generateBreadcrumbs(pathname)} />
      )}
      <main className="flex-grow pt-4">
        {children}
      </main>
    </div>
  );
}