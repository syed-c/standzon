import HomePageContent from '@/components/client/HomePageContent';
import OfflineSupport from '@/components/client/OfflineSupport';
import { getPageContent } from '@/lib/server/db/pages';

// Force dynamic to ensure fresh content if needed, or use revalidate
export const revalidate = 3600; // Cache for 1 hour

export default async function Home() {
  const pageContent = await getPageContent('/');
  
  return (
    <>
      <HomePageContent initialContent={pageContent} />
      <OfflineSupport />
    </>
  );
}
