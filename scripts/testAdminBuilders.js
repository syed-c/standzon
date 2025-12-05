const { getAllBuilders } = require('../lib/supabase/builders');

// Set environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://elipizumpfnzmzifrcnl.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsaXBpenVtcGZuem16aWZyY25sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyOTk0ODYsImV4cCI6MjA3MTg3NTQ4Nn0.ja14hIvo-7uLZQqCtnVsqaoHsE7h15aNCSCe5zQxZ38';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsaXBpenVtcGZuem16aWZyY25sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI5OTQ4NiwiZXhwIjoyMDcxODc1NDg2fQ.ITtRDQ9QxL2zsa8E95bg5IuvlUtpA8kVommxMpDSb-4';

async function testAdminBuilders() {
  console.log('=== Testing Admin Builders Access ===\n');
  
  try {
    console.log('Fetching all builders...');
    const builders = await getAllBuilders();
    console.log(`Found ${builders.length} builders`);
    
    if (builders.length > 0) {
      console.log('\nFirst 3 builders:');
      builders.slice(0, 3).forEach((builder, index) => {
        console.log(`${index + 1}. ${builder.company_name} (${builder.id})`);
      });
    }
    
    console.log('\n=== Test Complete ===');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testAdminBuilders();