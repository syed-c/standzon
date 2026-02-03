'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ClientPageWithBreadcrumbsProps {
  children: React.ReactNode;
  pathname?: string;
  className?: string;
}

export default function ClientPageWithBreadcrumbs({ 
  children, 
  pathname,
  className = '' 
}: ClientPageWithBreadcrumbsProps) {
  // Since breadcrumbs are now handled globally in GlobalLayoutProvider,
  // this component only serves as a wrapper for client-side pages
  
  return (
    <div className={cn(`min-h-screen flex flex-col`, className)}>
      <main className="flex-grow pt-0">
        {children}
      </main>
    </div>
  );
}