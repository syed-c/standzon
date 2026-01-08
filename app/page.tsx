import ServerHomePageContent from '@/components/ServerHomePageContent';
import OfflineSupport from '@/components/OfflineSupport';
// import OfflineTest from '@/components/OfflineTest';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { useEffect } from 'react';

export default function Home() {
  return (
    <>
      <ServerHomePageContent />
      {/* <OfflineTest /> */}
      <OfflineSupport />
    </>
  );
}