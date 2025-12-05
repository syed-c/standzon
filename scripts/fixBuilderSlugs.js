const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixBuilderSlugs() {
  console.log('Fixing builder slugs...');
  
  try {
    // Get all builders from both tables
    const { data: buildersData, error: buildersError } = await supabase
      .from('builders')
      .select('id, company_name, slug');
    
    if (buildersError) {
      console.error('Error fetching builders:', buildersError);
      process.exit(1);
    }
    
    const { data: profilesData, error: profilesError } = await supabase
      .from('builder_profiles')
      .select('id, company_name, slug');
    
    if (profilesError) {
      console.error('Error fetching builder profiles:', profilesError);
      process.exit(1);
    }
    
    // Combine data from both tables
    const allBuilders = [...(buildersData || []), ...(profilesData || [])];
    console.log(`Found ${allBuilders.length} builders`);
    
    let fixedCount = 0;
    
    for (const builder of allBuilders) {
      if (builder.slug && builder.slug.length > 50) {
        // Generate a shorter slug
        let newSlug = builder.company_name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        // Limit slug length to 50 characters
        if (newSlug.length > 50) {
          newSlug = newSlug.substring(0, 50).replace(/-+$/, ''); // Remove trailing dashes
        }
        
        // Make sure the slug is unique
        let uniqueSlug = newSlug;
        let counter = 1;
        let isUnique = false;
        
        while (!isUnique) {
          const { data: existingBuilders, error } = await supabase
            .from('builders')
            .select('id')
            .eq('slug', uniqueSlug)
            .neq('id', builder.id);
          
          const { data: existingProfiles, error: profilesError } = await supabase
            .from('builder_profiles')
            .select('id')
            .eq('slug', uniqueSlug)
            .neq('id', builder.id);
          
          if ((existingBuilders && existingBuilders.length > 0) || 
              (existingProfiles && existingProfiles.length > 0)) {
            // Slug already exists, add a counter
            uniqueSlug = `${newSlug}-${counter}`;
            counter++;
          } else {
            isUnique = true;
          }
        }
        
        // Update the builder with the new slug
        if (buildersData.find(b => b.id === builder.id)) {
          const { error: updateError } = await supabase
            .from('builders')
            .update({ slug: uniqueSlug })
            .eq('id', builder.id);
          
          if (updateError) {
            console.error(`Error updating builder ${builder.id}:`, updateError);
          } else {
            console.log(`Fixed slug for builder ${builder.company_name}: ${builder.slug} -> ${uniqueSlug}`);
            fixedCount++;
          }
        } else {
          const { error: updateError } = await supabase
            .from('builder_profiles')
            .update({ slug: uniqueSlug })
            .eq('id', builder.id);
          
          if (updateError) {
            console.error(`Error updating builder profile ${builder.id}:`, updateError);
          } else {
            console.log(`Fixed slug for builder profile ${builder.company_name}: ${builder.slug} -> ${uniqueSlug}`);
            fixedCount++;
          }
        }
      }
    }
    
    console.log(`Fixed ${fixedCount} builder slugs`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixBuilderSlugs();