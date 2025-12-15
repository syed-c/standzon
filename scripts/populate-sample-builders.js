const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function populateSampleBuilders() {
  console.log('🌱 Populating sample builder data...\n');
  
  try {
    // Sample builders data for UAE/Dubai
    const sampleBuilders = [
      {
        company_name: "Dubai Exhibition Masters",
        slug: "dubai-exhibition-masters",
        headquarters_city: "Dubai",
        headquarters_country: "United Arab Emirates",
        headquarters_country_code: "AE",
        rating: 4.8,
        projects_completed: 127,
        verified: true,
        description: "Leading exhibition stand builders in Dubai with over 15 years of experience. Specializing in custom booth design and fabrication for major trade shows including GITEX and Arab Health.",
        established_year: 2008,
        primary_email: "info@dubaiexhibitionmasters.com",
        phone: "+971 4 123 4567",
        website: "https://dubaiexhibitionmasters.com",
        logo: "/images/builders/default-logo.png"
      },
      {
        company_name: "Emirate Stand Solutions",
        slug: "emirate-stand-solutions",
        headquarters_city: "Dubai",
        headquarters_country: "United Arab Emirates",
        headquarters_country_code: "AE",
        rating: 4.6,
        projects_completed: 89,
        verified: true,
        description: "Creative exhibition stand designers and constructors serving the UAE market. Expertise in modular and custom booth solutions for technology and healthcare sectors.",
        established_year: 2012,
        primary_email: "contact@emiratestands.com",
        phone: "+971 4 234 5678",
        website: "https://emiratestands.com",
        logo: "/images/builders/default-logo.png"
      },
      {
        company_name: "Gulf Display Works",
        slug: "gulf-display-works",
        headquarters_city: "Dubai",
        headquarters_country: "United Arab Emirates",
        headquarters_country_code: "AE",
        rating: 4.7,
        projects_completed: 156,
        verified: true,
        description: "Full-service exhibition stand provider in Dubai. Offering design, fabrication, installation, and dismantling services for events at DWTC and Expo City.",
        established_year: 2005,
        primary_email: "sales@gulfdisplayworks.com",
        phone: "+971 4 345 6789",
        website: "https://gulfdisplayworks.com",
        logo: "/images/builders/default-logo.png"
      }
    ];
    
    console.log('➕ Inserting sample builders into builder_profiles table...');
    
    // Insert builders into builder_profiles table
    const { data, error } = await supabase
      .from('builder_profiles')
      .insert(sampleBuilders)
      .select();
    
    if (error) {
      console.error('❌ Error inserting builders:', error.message);
      return;
    }
    
    console.log(`✅ Successfully inserted ${data.length} sample builders:`);
    data.forEach((builder, index) => {
      console.log(`   ${index + 1}. ${builder.company_name} (${builder.id})`);
    });
    
    console.log('\n🎉 Sample builders populated successfully!');
    console.log('💡 You can now test the city pages with actual builder data.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

populateSampleBuilders();