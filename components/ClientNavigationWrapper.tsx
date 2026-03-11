'use client';

import React from 'react';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import Navigation from '@/components/Navigation';

interface ClientNavigationWrapperProps {
  pathname: string;
  showBreadcrumbs: boolean;
  breadcrumbs: any[];
}

export default function ClientNavigationWrapper({ showBreadcrumbs, breadcrumbs }: ClientNavigationWrapperProps) {
  return (
    <div className="flex flex-col">
      <Navigation />
      {showBreadcrumbs && (
        <div className="fixed top-16 left-0 right-0 z-[990] bg-[#FFFFFF] border-b border-gray-200" style={{ height: '48px' }}>
          <div className="responsive-container h-full flex items-center">
            <BreadcrumbNavigation items={breadcrumbs} className="!bg-transparent !border-b-0 !py-0 !shadow-none" />
          </div>
        </div>
      )}
      {/* Spacer to push content below fixed headers */}
      <div style={{ height: showBreadcrumbs ? '112px' : '64px' }} aria-hidden="true" />
    </div>
  );
}