const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDubaiHeroDescription() {
  try {
    console.log('🔍 Checking Dubai hero description...');
    
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
    
    // Check for hero description in the content structure
    console.log('🔍 Looking for hero description in content structure...');
    
    // Check in the main content
    if (data.content.heroDescription) {
      console.log('✅ Found heroDescription at root level:', data.content.heroDescription.substring(0, 100) + '...');
    }
    
    // Check in sections.cityPages
    if (data.content.sections && data.content.sections.cityPages && data.content.sections.cityPages['united-arab-emirates-dubai']) {
      const cityContent = data.content.sections.cityPages['united-arab-emirates-dubai'];
      console.log('🔍 City content keys:', Object.keys(cityContent));
      
      if (cityContent.heroDescription) {
        console.log('✅ Found heroDescription in city content:', cityContent.heroDescription.substring(0, 100) + '...');
      }
      
      // Check hero object
      if (cityContent.hero) {
        console.log('✅ Found hero object in city content:', JSON.stringify(cityContent.hero, null, 2));
      }
    }
    
    // Check in nested countryPages within cityPages
    if (data.content.sections && data.content.sections.cityPages && data.content.sections.cityPages['united-arab-emirates-dubai'] && data.content.sections.cityPages['united-arab-emirates-dubai'].countryPages && data.content.sections.cityPages['united-arab-emirates-dubai'].countryPages.dubai) {
      const nestedContent = data.content.sections.cityPages['united-arab-emirates-dubai'].countryPages.dubai;
      console.log('🔍 Nested content keys:', Object.keys(nestedContent));
      
      if (nestedContent.heroDescription) {
        console.log('✅ Found heroDescription in nested content:', nestedContent.heroDescription.substring(0, 100) + '...');
      }
      
      // Check hero object
      if (nestedContent.hero) {
        console.log('✅ Found hero object in nested content:', JSON.stringify(nestedContent.hero, null, 2));
      }
    }
    
    console.log('\n📄 Full content structure preview:');
    console.log(JSON.stringify(data.content, null, 2).substring(0, 2000) + '...');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

checkDubaiHeroDescription();