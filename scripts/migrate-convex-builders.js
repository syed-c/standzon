const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrateConvexBuilders() {
  console.log('🔄 Migrating builders from Convex to Supabase...');

  try {
    // Sample builders that might exist in Convex but not in Supabase
    const convexBuilders = [
      {
        company_name: 'werepair',
        slug: 'werepair',
        primary_email: 'info@werepair.com',
        phone: '+971 50 123 4567',
        website: 'https://werepair.com',
        headquarters_city: 'Dubai',
        headquarters_country: 'United Arab Emirates',
        headquarters_country_code: 'AE',
        headquarters_address: 'Dubai, UAE',
        contact_person: 'John Smith',
        position: 'Manager',
        company_description: 'Professional exhibition stand builders in Dubai, UAE. We specialize in custom exhibition stands, trade show booths, and event displays.',
        team_size: 15,
        projects_completed: 2,
        rating: 4.7,
        review_count: 39,
        response_time: 'Within 24 hours',
        languages: ['English', 'Arabic'],
        verified: true,
        premium_member: false,
        claimed: true,
        claim_status: 'claimed',
        basic_stand_min: 5000,
        basic_stand_max: 15000,
        custom_stand_min: 15000,
        custom_stand_max: 50000,
        premium_stand_min: 50000,
        premium_stand_max: 100000,
        average_project: 25000,
        currency: 'AED'
      },
      {
        company_name: 'Dubai Stand Builders',
        slug: 'dubai-stand-builders',
        primary_email: 'contact@dubaistandbuilders.com',
        phone: '+971 4 123 4567',
        website: 'https://dubaistandbuilders.com',
        headquarters_city: 'Dubai',
        headquarters_country: 'United Arab Emirates',
        headquarters_country_code: 'AE',
        headquarters_address: 'Dubai, UAE',
        contact_person: 'Ahmed Al-Rashid',
        position: 'Director',
        company_description: 'Leading exhibition stand builders in Dubai with over 10 years of experience. We create stunning custom stands for trade shows and exhibitions.',
        team_size: 25,
        projects_completed: 15,
        rating: 4.8,
        review_count: 45,
        response_time: 'Within 12 hours',
        languages: ['English', 'Arabic', 'Hindi'],
        verified: true,
        premium_member: true,
        claimed: true,
        claim_status: 'claimed',
        basic_stand_min: 8000,
        basic_stand_max: 20000,
        custom_stand_min: 20000,
        custom_stand_max: 75000,
        premium_stand_min: 75000,
        premium_stand_max: 150000,
        average_project: 35000,
        currency: 'AED'
      }
    ];

    let migratedCount = 0;
    let skippedCount = 0;

    for (const builderData of convexBuilders) {
      try {
        // Check if builder already exists
        const { data: existingBuilder } = await supabase
          .from('builder_profiles')
          .select('id')
          .eq('slug', builderData.slug)
          .single();

        if (existingBuilder) {
          console.log(`⏭️  Skipping ${builderData.company_name} - already exists`);
          skippedCount++;
          continue;
        }

        // Add timestamps
        const builderWithTimestamps = {
          ...builderData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: builder, error } = await supabase
          .from('builder_profiles')
          .insert(builderWithTimestamps)
          .select()
          .single();

        if (error) {
          console.error(`❌ Error adding ${builderData.company_name}:`, error);
          continue;
        }

        console.log(`✅ Migrated ${builder.company_name} (${builder.slug})`);
        migratedCount++;

        // Update country builder count
        const { data: countryData } = await supabase
          .from('countries')
          .select('builder_count')
          .eq('country_code', builderData.headquarters_country_code)
          .single();

        if (countryData) {
          const { error: updateError } = await supabase
            .from('countries')
            .update({ 
              builder_count: (countryData.builder_count || 0) + 1,
              updated_at: new Date().toISOString()
            })
            .eq('country_code', builderData.headquarters_country_code);

          if (updateError) {
            console.error(`❌ Error updating country builder count for ${builderData.company_name}:`, updateError);
          }
        }

      } catch (error) {
        console.error(`❌ Error processing ${builderData.company_name}:`, error);
      }
    }

    console.log(`\n🎉 Migration completed!`);
    console.log(`   - Migrated: ${migratedCount} builders`);
    console.log(`   - Skipped: ${skippedCount} builders`);

  } catch (error) {
    console.error('❌ Error during migration:', error);
  }
}

// Run the migration
migrateConvexBuilders();
