'use client';

import React from 'react';
import GlobalLayoutProvider from './GlobalLayoutProvider';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  return <GlobalLayoutProvider>{children}</GlobalLayoutProvider>;
}