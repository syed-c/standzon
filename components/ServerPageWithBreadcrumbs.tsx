// This component is designed to be used in server components as a wrapper
import React from 'react';

interface ServerPageWithBreadcrumbsProps {
  children: React.ReactNode;
  className?: string;
  pathname?: string; // pathname is passed as a prop but not used since breadcrumbs are global
}

export default function ServerPageWithBreadcrumbs({ 
  children, 
  className = '',
  pathname
}: ServerPageWithBreadcrumbsProps) {
  // Since breadcrumbs are now handled globally in GlobalLayoutProvider,
  // this component only serves as a wrapper for server-side pages
  
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <main className="flex-grow pt-0">
        {children}
      </main>
    </div>
  );
}