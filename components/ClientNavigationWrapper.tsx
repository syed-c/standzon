'use client';

import React, { useEffect, useState } from 'react';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import Navigation from '@/components/Navigation';

interface ClientNavigationWrapperProps {
  pathname: string;
  showBreadcrumbs: boolean;
  breadcrumbs: any[];
}

export default function ClientNavigationWrapper({ pathname, showBreadcrumbs, breadcrumbs }: ClientNavigationWrapperProps) {
  // Render Navigation immediately (SSR safe)
  return (
    <>
      <Navigation />
      {showBreadcrumbs && (
        <div className="sticky top-16 z-10 bg-white">
          <BreadcrumbNavigation items={breadcrumbs} />
        </div>
      )}
    </>
  );
}