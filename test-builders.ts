import { getAllBuilders } from './lib/supabase/builders';
async function test() {
  const b = await getAllBuilders();
  console.log("Found builders:", b.length);
  const withPortfolio = b.filter((i: any) => i.portfolio && Array.isArray(i.portfolio) && i.portfolio.length > 0);
  console.log("With portfolio array:", withPortfolio.length);
  const withGalleryImages = b.filter((i: any) => i.gallery_images && Array.isArray(i.gallery_images) && i.gallery_images.length > 0);
  console.log("With gallery_images array:", withGalleryImages.length);
  if (withGalleryImages.length > 0) {
     console.log("Sample gallery_images:", withGalleryImages[0].gallery_images.slice(0, 2));
  }
}
test().catch(console.error);
