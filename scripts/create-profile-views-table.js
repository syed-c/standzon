const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function createProfileViewsTable() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'Set' : 'Missing');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('🔄 Creating profile_views table...');

    // Create the profile_views table
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create profile_views table for tracking profile page visits
        CREATE TABLE IF NOT EXISTS profile_views (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          builder_id UUID NOT NULL REFERENCES builder_profiles(id) ON DELETE CASCADE,
          viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          ip_address VARCHAR(45),
          user_agent TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_profile_views_builder_id ON profile_views(builder_id);
        CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_at ON profile_views(viewed_at);
        CREATE INDEX IF NOT EXISTS idx_profile_views_builder_viewed ON profile_views(builder_id, viewed_at);
      `
    });

    if (error) {
      console.error('❌ Error creating table:', error);
      
      // Try alternative approach - direct SQL execution
      console.log('🔄 Trying alternative approach...');
      
      const { data: createTable, error: createError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'profile_views');

      if (createError) {
        console.error('❌ Cannot check table existence:', createError);
        return;
      }

      if (createTable && createTable.length === 0) {
        console.log('📝 Table does not exist, creating manually...');
        
        // Try to create table using raw SQL
        const { error: rawError } = await supabase
          .from('profile_views')
          .select('id')
          .limit(1);

        if (rawError && rawError.code === 'PGRST205') {
          console.log('✅ Table creation needed - this is expected');
          console.log('📋 Please run this SQL in your Supabase dashboard:');
          console.log(`
CREATE TABLE profile_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  builder_id UUID NOT NULL REFERENCES builder_profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_profile_views_builder_id ON profile_views(builder_id);
CREATE INDEX idx_profile_views_viewed_at ON profile_views(viewed_at);
CREATE INDEX idx_profile_views_builder_viewed ON profile_views(builder_id, viewed_at);
          `);
        }
      } else {
        console.log('✅ Table already exists');
      }
    } else {
      console.log('✅ Table created successfully');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createProfileViewsTable();
