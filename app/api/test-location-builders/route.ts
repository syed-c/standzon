import { NextResponse } from 'next/server';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const city = searchParams.get('city');
    
    console.log('=== Testing Location Builders ===');
    console.log('Country:', country);
    console.log('City:', city);
    
    // Get all builders from unified platform
    const allBuilders = unifiedPlatformAPI.getBuilders();
    console.log(`Total builders in unified platform: ${allBuilders.length}`);
    
    // Filter builders for the specified location
    let filteredBuilders = allBuilders;
    
    if (country) {
      // Handle country name variations
      const countryVariations = [country];
      if (country === "United Arab Emirates") {
        countryVariations.push("UAE");
      } else if (country === "UAE") {
        countryVariations.push("United Arab Emirates");
      }
      
      console.log('Country variations:', countryVariations);
      
      filteredBuilders = allBuilders.filter((builder: any) => {
        // Check for flat structure (Supabase format)
        const headquartersCountry = builder.headquarters_country || builder.headquarters?.country;
        console.log('Builder country:', headquartersCountry);
        const headquartersMatch = countryVariations.includes(headquartersCountry);
        console.log('Match result:', headquartersMatch);
        return headquartersMatch;
      });
      
      console.log(`Builders in ${country}: ${filteredBuilders.length}`);
    }
    
    if (city && country) {
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
    const sampleBuilders = filteredBuilders.slice(0, 5).map((builder: any) => ({
      id: builder.id,
      companyName: builder.companyName,
      headquarters: builder.headquarters,
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
    console.error('Error testing location builders:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}