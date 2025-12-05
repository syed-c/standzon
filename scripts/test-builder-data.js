const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testBuilderData() {
  console.log('🧪 Testing builder data for pages...');

  try {
    // Test 1: Check UAE builders for location page
    console.log('\n1️⃣ Testing UAE builders for location page:');
    const { data: uaeBuilders, error: uaeError } = await supabase
      .from('builder_profiles')
      .select('*')
      .eq('headquarters_country', 'United Arab Emirates')
      .eq('verified', true);

    if (uaeError) {
      console.error('❌ Error fetching UAE builders:', uaeError);
    } else {
      console.log(`✅ Found ${uaeBuilders.length} verified UAE builders:`);
      uaeBuilders.forEach(builder => {
        console.log(`   • ${builder.company_name} (${builder.slug})`);
        console.log(`     - Rating: ${builder.rating}/5`);
        console.log(`     - Projects: ${builder.projects_completed}`);
        console.log(`     - Verified: ${builder.verified}`);
      });
    }

    // Test 2: Check werepair builder for profile page
    console.log('\n2️⃣ Testing werepair builder for profile page:');
    const { data: werepairBuilder, error: werepairError } = await supabase
      .from('builder_profiles')
      .select('*')
      .eq('slug', 'werepair')
      .single();

    if (werepairError) {
      console.error('❌ Error fetching werepair builder:', werepairError);
    } else if (werepairBuilder) {
      console.log(`✅ Found werepair builder:`);
      console.log(`   • Company: ${werepairBuilder.company_name}`);
      console.log(`   • Slug: ${werepairBuilder.slug}`);
      console.log(`   • Location: ${werepairBuilder.headquarters_city}, ${werepairBuilder.headquarters_country}`);
      console.log(`   • Verified: ${werepairBuilder.verified}`);
      console.log(`   • Rating: ${werepairBuilder.rating}/5`);
      console.log(`   • Projects: ${werepairBuilder.projects_completed}`);
    } else {
      console.log('❌ werepair builder not found');
    }

    // Test 3: Check Italy builders
    console.log('\n3️⃣ Testing Italy builders:');
    const { data: italyBuilders, error: italyError } = await supabase
      .from('builder_profiles')
      .select('*')
      .eq('headquarters_country', 'Italy')
      .eq('verified', true);

    if (italyError) {
      console.error('❌ Error fetching Italy builders:', italyError);
    } else {
      console.log(`✅ Found ${italyBuilders.length} verified Italy builders:`);
      italyBuilders.forEach(builder => {
        console.log(`   • ${builder.company_name} (${builder.slug})`);
      });
    }

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
}

// Run the tests
testBuilderData();
