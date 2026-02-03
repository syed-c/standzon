/**
 * Test script to verify Supabase lead insertion
 */

import { DatabaseService } from '../lib/supabase/database';

async function testLeadCreation() {
  console.log('🧪 Testing Supabase lead creation...\n');
  
  const dbService = new DatabaseService();
  
  // Create a test lead
  const testLead = {
    company_name: 'Test Company Inc.',
    contact_name: 'John Doe',
    contact_email: 'john.doe@test.com',
    contact_phone: '+1-555-0123',
    trade_show_name: 'Test Exhibition 2025',
    city: 'Las Vegas',
    country: 'United States',
    stand_size: 100,
    budget: '$25,000 - $50,000',
    timeline: '3-4 months',
    special_requests: 'Test request from debug script',
    status: 'NEW',
    priority: 'MEDIUM',
    source: 'test_script',
    lead_score: 75,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  console.log('📝 Test lead data:', testLead);
  console.log('\n');
  
  try {
    console.log('💾 Attempting to create lead in Supabase...');
    const result = await dbService.createLead(testLead);
    
    if (result) {
      console.log('✅ SUCCESS! Lead created with ID:', result.id);
      console.log('📄 Full result:', result);
      return true;
    } else {
      console.log('❌ FAILED! No result returned');
      return false;
    }
  } catch (error: any) {
    console.error('❌ ERROR creating lead:', error.message);
    console.error('Full error:', error);
    
    // Check for specific error types
    if (error.message?.includes('client not initialized')) {
      console.log('\n🔍 Diagnosis: Supabase client initialization failed');
      console.log('Check your environment variables:');
      console.log('- NEXT_PUBLIC_SUPABASE_URL');
      console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
      console.log('- SUPABASE_SERVICE_ROLE_KEY');
    } else if (error.code) {
      console.log('\n🔍 Diagnosis: Database error');
      console.log('Error code:', error.code);
      console.log('Error hint:', error.hint);
      console.log('Error details:', error.details);
    }
    
    return false;
  }
}

// Run the test
testLeadCreation()
  .then((success) => {
    console.log('\n' + '='.repeat(60));
    if (success) {
      console.log('🎉 Test completed successfully!');
      console.log('Your Supabase lead insertion is working.');
    } else {
      console.log('⚠️ Test failed!');
      console.log('Lead insertion is not working properly.');
    }
    console.log('='.repeat(60));
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
  });
