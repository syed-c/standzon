const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function populateSampleBuilders() {
  console.log('=== Populating Sample Builders ===\n');
  
  // Sample builder data
  const sampleBuilders = [
    {
      company_name: 'Global Exhibition Stands Ltd',
      slug: 'global-exhibition-stands-ltd',
      primary_email: 'info@globalexhibitionstands.com',
      phone: '+1-555-0123',
      website: 'https://globalexhibitionstands.com',
      headquarters_city: 'New York',
      headquarters_country: 'United States',
      contact_person: 'John Smith',
      position: 'CEO',
      company_description: 'Leading provider of custom exhibition stands with over 20 years of experience.',
      team_size: 25,
      projects_completed: 150,
      rating: 4.8,
      verified: true,
      premium_member: true
    },
    {
      company_name: 'European Design Builders',
      slug: 'european-design-builders',
      primary_email: 'contact@europeandesignbuilders.eu',
      phone: '+44-20-7123-4567',
      website: 'https://europeandesignbuilders.eu',
      headquarters_city: 'London',
      headquarters_country: 'United Kingdom',
      contact_person: 'Sarah Johnson',
      position: 'Marketing Director',
      company_description: 'Specializing in innovative booth designs for European trade shows.',
      team_size: 18,
      projects_completed: 95,
      rating: 4.6,
      verified: true,
      premium_member: false
    },
    {
      company_name: 'Asia Pacific Exhibitions',
      slug: 'asia-pacific-exhibitions',
      primary_email: 'info@asiapacificexhibitions.com',
      phone: '+81-3-1234-5678',
      website: 'https://asiapacificexhibitions.com',
      headquarters_city: 'Tokyo',
      headquarters_country: 'Japan',
      contact_person: 'Yamamoto Takeshi',
      position: 'General Manager',
      company_description: 'Expert in creating culturally sensitive exhibition spaces for Asian markets.',
      team_size: 32,
      projects_completed: 210,
      rating: 4.9,
      verified: true,
      premium_member: true
    }
  ];
  
  try {
    console.log('Inserting sample builders into "builder_profiles" table...');
    
    // Insert into builder_profiles table
    const { data, error } = await supabase
      .from('builder_profiles')
      .insert(sampleBuilders)
      .select();
    
    if (error) {
      console.error('Error inserting sample builders:', error.message);
      process.exit(1);
    }
    
    console.log(`Successfully inserted ${data.length} sample builders`);
    console.log('Inserted builders:');
    data.forEach((builder, index) => {
      console.log(`  ${index + 1}. ${builder.company_name} (${builder.id})`);
    });
    
    console.log('\n=== Sample Data Population Complete ===');
    
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

populateSampleBuilders();