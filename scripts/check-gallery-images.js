const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDubaiGalleryImages() {
  try {
    console.log('🔍 Checking Dubai gallery images...');
    
    const { data, error } = await supabase
      .from('page_contents')
      .select('content')
      .eq('id', 'united-arab-emirates-dubai')
      .single();
    
    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }
    
    if (!data?.content) {
      console.log('❌ No content found');
      return;
    }
    
    // Check for gallery images in the content structure
    console.log('🔍 Looking for gallery images in content structure...');
    
    // Check in the main content
    if (data.content.galleryImages) {
      console.log('✅ Found galleryImages at root level:', data.content.galleryImages);
    }
    
    // Check in sections.cityPages
    if (data.content.sections && data.content.sections.cityPages && data.content.sections.cityPages['united-arab-emirates-dubai']) {
      const cityContent = data.content.sections.cityPages['united-arab-emirates-dubai'];
      console.log('🔍 City content keys:', Object.keys(cityContent));
      
      if (cityContent.galleryImages) {
        console.log('✅ Found galleryImages in city content:', cityContent.galleryImages);
        console.log('   Type:', typeof cityContent.galleryImages);
        console.log('   Length:', Array.isArray(cityContent.galleryImages) ? cityContent.galleryImages.length : 'Not an array');
      }
    }
    
    // Check in nested countryPages within cityPages
    if (data.content.sections && data.content.sections.cityPages && data.content.sections.cityPages['united-arab-emirates-dubai'] && data.content.sections.cityPages['united-arab-emirates-dubai'].countryPages && data.content.sections.cityPages['united-arab-emirates-dubai'].countryPages.dubai) {
      const nestedContent = data.content.sections.cityPages['united-arab-emirates-dubai'].countryPages.dubai;
      console.log('🔍 Nested content keys:', Object.keys(nestedContent));
      
      if (nestedContent.galleryImages) {
        console.log('✅ Found galleryImages in nested content:', nestedContent.galleryImages);
        console.log('   Type:', typeof nestedContent.galleryImages);
        console.log('   Length:', Array.isArray(nestedContent.galleryImages) ? nestedContent.galleryImages.length : 'Not an array');
      }
    }
    
    console.log('\n📄 Full content structure preview:');
    console.log(JSON.stringify(data.content, null, 2).substring(0, 1000) + '...');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

checkDubaiGalleryImages();