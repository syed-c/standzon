import React from 'react';
import { generateBreadcrumbs } from '@/lib/utils/breadcrumbUtils';
// import StaticNavigationHeader from '@/components/StaticNavigationHeader'; // Removed for consolidation
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ClientNavigationWrapper from '@/components/ClientNavigationWrapper';

interface ServerGlobalLayoutProviderProps {
  children: React.ReactNode;
  pathname: string;
}

export default function ServerGlobalLayoutProvider({ children, pathname }: ServerGlobalLayoutProviderProps) {
  // Don't show breadcrumbs on the home page or debug pages
  const showBreadcrumbs = pathname !== '/' && !pathname.startsWith('/debug');
  const breadcrumbs = pathname ? generateBreadcrumbs(pathname) : [];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Static header removed to prevent double-header issue. Using ClientNavigationWrapper for consistent unified header. */}

      {/* Dynamic parts handled by client component */}
      <ClientNavigationWrapper pathname={pathname} showBreadcrumbs={showBreadcrumbs} breadcrumbs={breadcrumbs} />

      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}