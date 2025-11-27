import { NextResponse } from 'next/server';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const city = searchParams.get('city');
    
    console.log('=== Testing Unified Platform Filtering ===');
    console.log('Country:', country);
    console.log('City:', city);
    
    // Get all builders from unified platform
    const allBuilders = unifiedPlatformAPI.getBuilders();
    console.log(`Total builders in unified platform: ${allBuilders.length}`);
    
    // Filter builders using unified platform's filter method
    let filteredBuilders = allBuilders;
    
    if (country) {
      filteredBuilders = unifiedPlatformAPI.filterBuilders({
        country: country
      });
      console.log(`Builders in ${country}: ${filteredBuilders.length}`);
    }
    
    if (city && country) {
      // For city filtering, we need to do it manually since unifiedPlatformAPI doesn't have a city filter
      filteredBuilders = filteredBuilders.filter((builder: any) => {
        // Check for flat structure (Supabase format)
        const headquartersCity = builder.headquarters_city || builder.headquarters?.city;
        const cityMatch = headquartersCity && 
          headquartersCity.toLowerCase().trim() === city.toLowerCase().trim();
        return cityMatch;
      });
      console.log(`Builders in ${city}, ${country}: ${filteredBuilders.length}`);
    }
    
    // Return sample of builders
    const sampleBuilders = filteredBuilders.slice(0, 3).map((builder: any) => ({
      id: builder.id,
      companyName: builder.companyName,
      headquarters: builder.headquarters,
      headquarters_city: builder.headquarters_city,
      headquarters_country: builder.headquarters_country,
      rating: builder.rating,
      projectsCompleted: builder.projectsCompleted,
      verified: builder.verified
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        totalBuilders: allBuilders.length,
        filteredBuilders: filteredBuilders.length,
        sampleBuilders
      }
    });
  } catch (error) {
    console.error('Error testing unified platform filtering:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}