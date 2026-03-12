'use client';

import React from 'react';
import ServerGlobalLayoutProvider from './ServerGlobalLayoutProvider';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  // pathname is now handled internally by ServerGlobalLayoutProvider
  return <ServerGlobalLayoutProvider>{children}</ServerGlobalLayoutProvider>;
}