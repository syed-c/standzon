'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import SuperAdminLayout from '@/components/admin/SuperAdminLayout';
import Topbar from '@/components/admin/Topbar';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Do not show the sidebar and topbar on the login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <SuperAdminLayout topbar={<Topbar />}>
      {children}
    </SuperAdminLayout>
  );
}
