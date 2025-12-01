import { NextResponse } from 'next/server';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const city = searchParams.get('city');
    
    console.log('=== Test Location Builders API ===');
    console.log('Country:', country);
    console.log('City:', city);
    
    // Get all builders from unified platform
    const allBuilders = unifiedPlatformAPI.getBuilders();
    console.log(`Total builders in unified platform: ${allBuilders.length}`);
    
    // Log sample of builders for debugging
    if (allBuilders.length > 0) {
      console.log('First 3 builders:');
      allBuilders.slice(0, 3).forEach((builder: any, index: number) => {
        console.log(`${index + 1}. ${builder.companyName || builder.company_name}`, {
          id: builder.id,
          headquarters: builder.headquarters || {
            city: builder.headquarters_city,
            country: builder.headquarters_country
          },
          serviceLocations: builder.serviceLocations || builder.service_locations
        });
      });
    }
    
    // Filter builders if country/city specified
    let filteredBuilders = allBuilders;
    if (country) {
      // Normalize strings for comparison
      const normalizeString = (str: string) => {
        if (!str) return '';
        return str.toString().toLowerCase().trim();
      };
      
      const normalizedCountry = normalizeString(country);
      
      // Create country variations
      const countryVariations = [normalizedCountry];
      if (normalizedCountry.includes("united arab emirates")) {
        countryVariations.push("uae");
      } else if (normalizedCountry === "uae") {
        countryVariations.push("united arab emirates");
      }
      
      filteredBuilders = allBuilders.filter((builder: any) => {
        // Check headquarters country
        const headquartersCountry = normalizeString(builder.headquarters?.country || builder.headquarters_country);
        const headquartersMatch = countryVariations.some(variation => 
          headquartersCountry === variation || headquartersCountry.includes(variation)
        );
        
        // Check service locations
        const serviceLocations = builder.serviceLocations || builder.service_locations || [];
        const serviceLocationMatch = serviceLocations.some((loc: any) => {
          const serviceCountry = normalizeString(loc.country);
          return countryVariations.some(variation => 
            serviceCountry === variation || serviceCountry.includes(variation)
          );
        });
        
        return headquartersMatch || serviceLocationMatch;
      });
      
      console.log(`Builders in ${country}: ${filteredBuilders.length}`);
      
      // Further filter by city if specified
      if (city && filteredBuilders.length > 0) {
        const normalizedCity = normalizeString(city);
        
        filteredBuilders = filteredBuilders.filter((builder: any) => {
          // Check headquarters city
          const headquartersCity = normalizeString(builder.headquarters?.city || builder.headquarters_city);
          const headquartersMatch = headquartersCity === normalizedCity || headquartersCity.includes(normalizedCity);
          
          // Check service locations for city
          const serviceLocations = builder.serviceLocations || builder.service_locations || [];
          const serviceLocationMatch = serviceLocations.some((loc: any) => {
            const serviceCity = normalizeString(loc.city);
            return serviceCity === normalizedCity || serviceCity.includes(normalizedCity);
          });
          
          return headquartersMatch || serviceLocationMatch;
        });
        
        console.log(`Builders in ${city}, ${country}: ${filteredBuilders.length}`);
      }
    }
    
    // Return sample of filtered builders
    const sampleBuilders = filteredBuilders.slice(0, 5).map((builder: any) => ({
      id: builder.id,
      companyName: builder.companyName || builder.company_name,
      headquarters: builder.headquarters || {
        city: builder.headquarters_city,
        country: builder.headquarters_country
      },
      serviceLocations: builder.serviceLocations || builder.service_locations,
      status: builder.status
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        totalBuilders: allBuilders.length,
        filteredBuilders: filteredBuilders.length,
        sampleBuilders,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in test-location-builders API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}