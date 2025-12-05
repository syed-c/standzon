#!/usr/bin/env ts-node

/**
 * Run Supabase Migration
 * 
 * This script runs the comprehensive migration to move all data to Supabase
 */

import { config } from 'dotenv';
import SupabaseMigration from './migrate-to-supabase';

// Load environment variables
config();

async function main() {
  console.log('🚀 Starting Supabase Migration...');
  console.log('=====================================');
  
  // Check required environment variables
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_CONVEX_URL'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`  - ${varName}`));
    process.exit(1);
  }
  
  console.log('✅ Environment variables loaded');
  console.log(`📊 Supabase URL: ${process.env.SUPABASE_URL}`);
  console.log(`🔗 Convex URL: ${process.env.NEXT_PUBLIC_CONVEX_URL}`);
  
  try {
    const migration = new SupabaseMigration();
    await migration.migrate();
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('=====================================');
    console.log('Next steps:');
    console.log('1. Update your application to use the new Supabase database');
    console.log('2. Remove old database connections (Convex, Prisma, file storage)');
    console.log('3. Test all functionality with Supabase');
    console.log('4. Deploy the updated application');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  main().catch(console.error);
}
