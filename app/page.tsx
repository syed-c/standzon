import ServerHomePageContent from '@/components/ServerHomePageContent';
import OfflineSupport from '@/components/OfflineSupport';

export default function Home() {
  return (
    <>
      <ServerHomePageContent />
      {/* <OfflineTest /> */}
      <OfflineSupport />
    </>
  );
}