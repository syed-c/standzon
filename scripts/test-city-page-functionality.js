const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testCityPageFunctionality() {
  console.log('🧪 Testing city page functionality...\n');
  
  try {
    // Test 1: Fetch Dubai page content (like the city page does)
    console.log('1️⃣ Testing Dubai page content fetch...');
    const countrySlug = 'united-arab-emirates';
    const citySlug = 'dubai';
    const cityPageId = `${countrySlug}-${citySlug}`;
    
    const { data: cmsContent, error: cmsError } = await supabase
      .from('page_contents')
      .select('content')
      .eq('id', cityPageId)
      .single();
    
    if (cmsError) {
      console.log('❌ CMS content fetch error:', cmsError.message);
    } else if (cmsContent?.content) {
      console.log('✅ CMS content fetched successfully');
      console.log('   Title:', cmsContent.content.hero?.title || 'No title');
      console.log('   Meta title:', cmsContent.content.seo?.metaTitle || 'No meta title');
      console.log('   Has content sections:', !!cmsContent.content.content);
    }
    console.log('');
    
    // Test 2: Fetch builders (like the city page does)
    console.log('2️⃣ Testing builder fetch for UAE...');
    
    // Try the same approach as in unifiedPlatformData.ts
    const { data: uaeBuilders, error: buildersError } = await supabase
      .from('builder_profiles')
      .select('*')
      .ilike('headquarters_country', '%united arab emirates%');
    
    if (buildersError) {
      console.log('❌ Builders fetch error:', buildersError.message);
    } else {
      console.log(`✅ Found ${uaeBuilders.length} UAE builders:`);
      uaeBuilders.forEach((builder, index) => {
        console.log(`   ${index + 1}. ${builder.company_name} in ${builder.headquarters_city}`);
        console.log(`      Rating: ${builder.rating}, Projects: ${builder.projects_completed}, Verified: ${builder.verified}`);
      });
    }
    console.log('');
    
    // Test 3: Simulate the city page builder filtering logic
    console.log('3️⃣ Testing city page builder filtering logic...');
    
    const cityName = 'Dubai';
    const countryName = 'United Arab Emirates';
    
    // This simulates what happens in the city page component
    const filteredBuilders = uaeBuilders.filter(builder => {
      const builderCity = (builder.headquarters_city || '').toLowerCase().trim();
      const normalizedCity = cityName.toLowerCase().trim();
      
      const match = builderCity === normalizedCity || builderCity.includes(normalizedCity);
      console.log(`   Builder "${builder.company_name}" - City match: ${match}`);
      
      return match;
    });
    
    console.log(`✅ Filtered to ${filteredBuilders.length} Dubai builders`);
    console.log('');
    
    // Test 4: Check if content formatting works
    console.log('4️⃣ Testing content formatting...');
    
    if (cmsContent?.content) {
      const citySpecificContent = cmsContent.content?.sections?.cityPages?.[cityPageId] || cmsContent.content;
      
      // Extract content like the formatCmsContent function does
      const formattedContent = {
        title: citySpecificContent?.hero?.title || citySpecificContent?.hero?.heading || `Exhibition Stand Builders in ${cityName}, ${countryName}`,
        metaTitle: citySpecificContent?.seo?.metaTitle || `${cityName} Exhibition Stand Builders | ${countryName}`,
        description: citySpecificContent?.content?.introduction || citySpecificContent?.hero?.description || citySpecificContent?.heroDescription || `Discover professional exhibition stand builders in ${cityName}, ${countryName}.`,
        heroContent: citySpecificContent?.hero?.description || citySpecificContent?.heroDescription || `Connect with ${cityName}'s leading exhibition stand builders for your next trade show project.`,
      };
      
      console.log('✅ Formatted content:');
      console.log('   Title:', formattedContent.title);
      console.log('   Meta title:', formattedContent.metaTitle);
      console.log('   Description length:', formattedContent.description.length);
      console.log('   Hero content length:', formattedContent.heroContent.length);
    }
    
    console.log('\n🎉 City page functionality test complete!');
    console.log('💡 The city page should now display content and builders properly.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testCityPageFunctionality();