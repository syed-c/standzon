const { createClient } = require('@supabase/supabase-js');

// Supabase configuration from env
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'NOT SET');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugCityContent() {
  try {
    // Test with a specific city page
    const countrySlug = 'germany';
    const citySlug = 'hamburg';
    const cityPageId = `${countrySlug}-${citySlug}`;
    
    console.log(`🔍 Debugging content for city page: ${cityPageId}`);
    
    // Fetch the content from page_contents table
    const { data, error } = await supabase
      .from('page_contents')
      .select('*')
      .eq('id', cityPageId)
      .single();
    
    if (error) {
      console.error('❌ Supabase error:', error);
      return;
    }
    
    if (!data) {
      console.log('❌ No data found for this page ID');
      return;
    }
    
    console.log('✅ Found data:');
    console.log('ID:', data.id);
    console.log('Content type:', typeof data.content);
    
    // Pretty print the content structure
    if (data.content) {
      console.log('\n📄 Content structure:');
      console.log(JSON.stringify(data.content, null, 2));
      
      // Check specific fields that might be used in the hero section
      console.log('\n🔍 Checking hero-related fields:');
      if (data.content.hero) {
        console.log('Hero field:', data.content.hero);
      }
      if (data.content.heroDescription) {
        console.log('HeroDescription field:', data.content.heroDescription);
      }
      if (data.content.sections?.cityPages?.[cityPageId]) {
        const cityContent = data.content.sections.cityPages[cityPageId];
        console.log('City page content:', cityContent);
        if (cityContent.hero) {
          console.log('City content hero:', cityContent.hero);
        }
        if (cityContent.heroDescription) {
          console.log('City content heroDescription:', cityContent.heroDescription);
        }
      }
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

debugCityContent();