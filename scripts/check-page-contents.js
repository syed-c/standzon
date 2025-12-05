require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Use the environment variables from .env.local
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://elipizumpfnzmzifrcnl.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

console.log('Connecting to Supabase...');
console.log('URL:', SUPABASE_URL);
console.log('Service Role Key exists:', !!SUPABASE_SERVICE_ROLE_KEY);

// Create Supabase client with service role key (admin access)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkPageContentsStructure() {
  try {
    console.log('🔍 Fetching page_contents structure...');
    
    // Fetch a few sample records to understand the structure
    const { data, error } = await supabase
      .from('page_contents')
      .select('*')
      .limit(10);
    
    if (error) {
      console.error('❌ Error fetching page_contents:', error);
      return;
    }
    
    console.log(`✅ Successfully fetched ${data.length} sample records from page_contents`);
    
    // Analyze the structure
    console.log('\n📊 Sample records analysis:');
    data.forEach((record, index) => {
      console.log(`\n--- Record ${index + 1} ---`);
      console.log('ID:', record.id);
      console.log('Path:', record.path);
      console.log('Type:', typeof record.content);
      console.log('Has content:', !!record.content);
      
      // Check if it's a city page
      if (record.id && record.id.includes('-') && !['home', 'custom-booth', 'booth-rental'].includes(record.id)) {
        console.log('📝 This appears to be a CITY page');
      } else if (record.path && record.path.startsWith('/exhibition-stands/') && record.path.split('/').length === 3) {
        console.log('🌍 This appears to be a COUNTRY page');
      } else {
        console.log('📄 This appears to be another type of page');
      }
      
      // Show content structure if it exists
      if (record.content) {
        if (typeof record.content === 'object') {
          console.log('Content keys:', Object.keys(record.content));
          if (record.content.hero) {
            console.log('Hero section:', Object.keys(record.content.hero));
          }
          if (record.content.content) {
            console.log('Content section:', Object.keys(record.content.content));
          }
          // Check for cityPages section
          if (record.content.sections && record.content.sections.cityPages) {
            console.log('City Pages section exists with keys:', Object.keys(record.content.sections.cityPages));
          }
        } else {
          console.log('Content (string):', record.content.substring(0, 100) + '...');
        }
      }
    });
    
    // Count different types of pages
    const countryPages = data.filter(p => 
      p.path && p.path.startsWith('/exhibition-stands/') && p.path.split('/').length === 3
    );
    const cityPages = data.filter(p => 
      p.id && p.id.includes('-') && !['home', 'custom-booth', 'booth-rental'].includes(p.id)
    );
    
    console.log('\n📈 Page Type Summary (from sample):');
    console.log(`   Country pages: ${countryPages.length}`);
    console.log(`   City pages: ${cityPages.length}`);
    
    // Look for specific city examples
    console.log('\n🏙️ City Page Examples:');
    const cityExamples = data.filter(p => 
      p.id && p.id.includes('-') && !['home', 'custom-booth', 'booth-rental'].includes(p.id)
    ).slice(0, 3);
    
    cityExamples.forEach(example => {
      console.log(`   - ID: ${example.id}, Path: ${example.path}`);
    });
    
    // Fetch a specific city page to see its full structure
    console.log('\n🔍 Detailed examination of a city page:');
    const { data: cityPage, error: cityError } = await supabase
      .from('page_contents')
      .select('*')
      .eq('id', 'germany-hamburg')
      .single();
    
    if (cityPage && !cityError) {
      console.log('Full Hamburg page structure:');
      console.log(JSON.stringify(cityPage, null, 2));
    }
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

// Run the function
checkPageContentsStructure();