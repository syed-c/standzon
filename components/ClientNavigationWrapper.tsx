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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render the full interactive navigation after mount to avoid hydration issues
  if (isMounted) {
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

  // Render minimal placeholder during SSR/hydration
  return showBreadcrumbs ? (
    <div className="sticky top-16 z-10 bg-white">
      <div className="h-10 bg-gray-100 animate-pulse"></div>
    </div>
  ) : null;
}