/**
 * Apply Supabase Schema
 * 
 * This script applies the database schema to your Supabase project
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function applySchema() {
  console.log('🚀 Applying Supabase Schema...');
  console.log('=====================================');
  
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Schema file not found:', schemaPath);
      process.exit(1);
    }
    
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Reading schema file...');
    console.log(`📏 Schema size: ${schema.length} characters`);
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`🔧 Found ${statements.length} SQL statements to execute`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.trim()) {
        try {
          console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
          
          const { data, error } = await supabase.rpc('exec_sql', {
            sql: statement
          });
          
          if (error) {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (error) {
          console.error(`❌ Exception in statement ${i + 1}:`, error.message);
          errorCount++;
        }
      }
    }
    
    console.log('\n📊 Schema Application Report');
    console.log('============================');
    console.log(`✅ Successful statements: ${successCount}`);
    console.log(`❌ Failed statements: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('\n🎉 Schema applied successfully!');
      console.log('You can now run the data migration: npm run migrate:supabase');
    } else {
      console.log('\n⚠️ Some statements failed. Please check the errors above.');
      console.log('You may need to apply the schema manually via the Supabase dashboard.');
    }
    
  } catch (error) {
    console.error('❌ Schema application failed:', error);
    console.log('\n💡 Alternative: Apply the schema manually via Supabase Dashboard');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy the contents of supabase/migrations/001_initial_schema.sql');
    console.log('4. Paste and run the SQL');
  }
}

// Run the schema application
if (require.main === module) {
  applySchema().catch(console.error);
}

module.exports = applySchema;
