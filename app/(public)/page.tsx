'use client';

import HomePageContent from '@/components/HomePageContent';
import OfflineSupport from '@/components/OfflineSupport';
// import OfflineTest from '@/components/OfflineTest';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { useEffect } from 'react';

export default function Home() {
  const { addRecentlyVisited } = useIndexedDB();
  
  useEffect(() => {
    // Track this page visit
    addRecentlyVisited('/', 'Home');
  }, [addRecentlyVisited]);
  
  return (
    <>
      <HomePageContent />
      {/* <OfflineTest /> */}
      <OfflineSupport />
    </>
  );
}