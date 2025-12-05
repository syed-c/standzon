import { NextResponse } from 'next/server';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

export async function GET() {
  try {
    console.log('=== Testing Fixes ===');
    
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
      asyncBuilders.slice(0, 3).forEach((builder: any, index) => {
        console.log(`${index + 1}. ${builder.companyName} (${builder.id})`);
        console.log(`   Headquarters:`, builder.headquarters);
        console.log(`   Flat fields: headquarters_city=${builder.headquarters_city}, headquarters_country=${builder.headquarters_country}`);
      });
    }
    
    // Count builders by country
    const countryCounts: Record<string, number> = {};
    asyncBuilders.forEach((builder: any) => {
      const country = builder.headquarters_country || builder.headquarters?.country || 'Unknown';
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
    
    console.log('Builders by country:');
    Object.entries(countryCounts).forEach(([country, count]) => {
      console.log(`  ${country}: ${count}`);
    });
    
    return NextResponse.json({
      success: true,
      data: {
        isInitialized,
        syncBuilders: syncBuilders.length,
        asyncBuilders: asyncBuilders.length,
        countryCounts,
        sampleBuilders: asyncBuilders.slice(0, 3).map((b: any) => ({
          id: b.id,
          companyName: b.companyName,
          headquarters: b.headquarters,
          headquarters_city: b.headquarters_city,
          headquarters_country: b.headquarters_country
        }))
      }
    });
  } catch (error) {
    console.error('Error testing fixes:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}