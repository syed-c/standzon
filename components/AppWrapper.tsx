'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import ServerGlobalLayoutProvider from './ServerGlobalLayoutProvider';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <ServerGlobalLayoutProvider pathname={pathname}>{children}</ServerGlobalLayoutProvider>;
}