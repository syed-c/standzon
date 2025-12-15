require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Use the environment variables from .env.local
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://elipizumpfnzmzifrcnl.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

console.log('Connecting to Supabase...');
console.log('URL:', SUPABASE_URL);

// Create Supabase client with service role key (admin access)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testCityContentFetch() {
  try {
    console.log('🔍 Testing city content fetch...');
    
    // Test fetching a specific city page
    const countrySlug = 'germany';
    const citySlug = 'hamburg';
    const cityPageId = `${countrySlug}-${citySlug}`;
    
    console.log(`Fetching content for city page ID: ${cityPageId}`);
    
    const { data, error } = await supabase
      .from('page_contents')
      .select('content')
      .eq('id', cityPageId)
      .single();
    
    if (error) {
      console.error('❌ Error fetching city content:', error);
      return;
    }
    
    if (!data?.content) {
      console.log('❌ No content found for city page');
      return;
    }
    
    console.log('✅ Successfully fetched city content');
    console.log('Content type:', typeof data.content);
    
    // Check the structure
    if (typeof data.content === 'object') {
      console.log('Content keys:', Object.keys(data.content));
      
      // Check for nested cityPages structure
      if (data.content.sections && data.content.sections.cityPages) {
        console.log('Found cityPages section');
        console.log('CityPages keys:', Object.keys(data.content.sections.cityPages));
        
        if (data.content.sections.cityPages[cityPageId]) {
          const cityContent = data.content.sections.cityPages[cityPageId];
          console.log('Found specific city content');
          console.log('City content keys:', Object.keys(cityContent));
          
          // Check specific content sections
          if (cityContent.hero) {
            console.log('Hero section:', cityContent.hero);
          }
          if (cityContent.content) {
            console.log('Content section keys:', Object.keys(cityContent.content));
          }
        }
      }
    }
    
    console.log('\n🎉 Test completed successfully!');
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

// Run the function
testCityContentFetch();