'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';
import { generateBreadcrumbs } from '@/lib/utils/breadcrumbUtils';
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
  const currentPathname = usePathname();
  const resolvedPathname = pathname || currentPathname;
  
  // Don't show breadcrumbs on the home page
  const showBreadcrumbs = resolvedPathname !== '/' && !resolvedPathname.startsWith('/debug');

  return (
    <div className={cn(`min-h-screen flex flex-col`, className)}>
      {showBreadcrumbs && (
        <BreadcrumbNavigation items={generateBreadcrumbs(resolvedPathname)} />
      )}
      <main className="flex-grow pt-4">
        {children}
      </main>
    </div>
  );
}