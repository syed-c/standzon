// Script to test the fixes for builder display issues
const { unifiedPlatformAPI } = require('../lib/data/unifiedPlatformData');

async function testFixes() {
  console.log('=== Testing Builder Display Fixes ===');
  
  try {
    // Test unified platform initialization
    console.log('Testing unified platform initialization...');
    const isInitialized = unifiedPlatformAPI.isInitialized();
    console.log(`Unified platform initialized: ${isInitialized}`);
    
    // Get builders synchronously
    console.log('Getting builders synchronously...');
    const syncBuilders = unifiedPlatformAPI.getBuilders();
    console.log(`Sync builders count: ${syncBuilders.length}`);
    
    // Get builders asynchronously
    console.log('Getting builders asynchronously...');
    const asyncBuilders = await unifiedPlatformAPI.getBuildersAsync();
    console.log(`Async builders count: ${asyncBuilders.length}`);
    
    // Log sample builders
    if (asyncBuilders.length > 0) {
      console.log('Sample builders:');
      asyncBuilders.slice(0, 3).forEach((builder, index) => {
        console.log(`${index + 1}. ${builder.companyName} (${builder.id})`);
        console.log(`   Headquarters:`, builder.headquarters);
        console.log(`   Flat fields: headquarters_city=${builder.headquarters_city}, headquarters_country=${builder.headquarters_country}`);
      });
    }
    
    // Count builders by country
    const countryCounts = {};
    asyncBuilders.forEach((builder) => {
      const country = builder.headquarters_country || builder.headquarters?.country || 'Unknown';
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
    
    console.log('Builders by country:');
    Object.entries(countryCounts).forEach(([country, count]) => {
      console.log(`  ${country}: ${count}`);
    });
    
    console.log('=== Test completed successfully ===');
    process.exit(0);
  } catch (error) {
    console.error('Error testing fixes:', error);
    process.exit(1);
  }
}

testFixes();