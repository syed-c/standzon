import { NextResponse } from 'next/server';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

export async function GET() {
  try {
    console.log('=== Debugging Builders Data ===');
    
    // Get all builders from unified platform
    const allBuilders = unifiedPlatformAPI.getBuilders();
    console.log(`Total builders in unified platform: ${allBuilders.length}`);
    
    // Log details of first few builders
    console.log('\nFirst 3 builders:');
    allBuilders.slice(0, 3).forEach((builder: any, index) => {
      console.log(`${index + 1}. ${builder.companyName} (${builder.id})`);
      console.log(`   Headquarters:`, builder.headquarters);
      console.log(`   Flat fields: headquarters_city=${builder.headquarters_city}, headquarters_country=${builder.headquarters_country}`);
    });
    
    // Count builders by country
    const countryCounts: Record<string, number> = {};
    allBuilders.forEach((builder: any) => {
      const country = builder.headquarters_country || builder.headquarters?.country || 'Unknown';
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
    
    console.log('\nBuilders by country:');
    Object.entries(countryCounts).forEach(([country, count]) => {
      console.log(`  ${country}: ${count}`);
    });
    
    return NextResponse.json({
      success: true,
      data: {
        totalBuilders: allBuilders.length,
        countryCounts,
        sampleBuilders: allBuilders.slice(0, 3).map((b: any) => ({
          id: b.id,
          companyName: b.companyName,
          headquarters: b.headquarters,
          headquarters_city: b.headquarters_city,
          headquarters_country: b.headquarters_country
        }))
      }
    });
  } catch (error) {
    console.error('Error debugging builders:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}