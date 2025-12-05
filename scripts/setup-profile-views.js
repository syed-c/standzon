const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function setupProfileViews() {
  console.log('🔧 Setting up Profile Views Table...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    console.log('Please check your .env.local file has:');
    console.log('- NEXT_PUBLIC_SUPABASE_URL');
    console.log('- SUPABASE_SERVICE_ROLE_KEY');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // First, let's check if the table exists
    console.log('🔍 Checking if profile_views table exists...');
    
    const { data, error } = await supabase
      .from('profile_views')
      .select('id')
      .limit(1);

    if (error && error.code === 'PGRST205') {
      console.log('📋 Table does not exist. Please create it manually.');
      console.log('\n📝 Copy this SQL and run it in your Supabase Dashboard SQL Editor:');
      console.log('\n' + '='.repeat(80));
      console.log(`
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
      `);
      console.log('='.repeat(80));
      console.log('\n🌐 Or open this URL in your browser:');
      console.log('http://localhost:3000/create-profile-views-table.html');
      console.log('\n✅ After creating the table, the profile view tracking will work automatically!');
      
    } else if (error) {
      console.error('❌ Error checking table:', error);
    } else {
      console.log('✅ Table already exists! Profile view tracking is ready.');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

setupProfileViews();
