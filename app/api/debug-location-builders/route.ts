import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'Germany';
    const city = searchParams.get('city');
    
    console.log('=== Debug Location Builders API ===');
    console.log('Country:', country);
    console.log('City:', city);
    
    // Simulate what the location page does - fetch all builders
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/admin/builders?limit=1000&prioritize_real=true`,
      { cache: "no-store" }
    );
    const data = await response.json();
    
    if (data.success && data.data && Array.isArray(data.data.builders)) {
      console.log(`Total builders from API: ${data.data.builders.length}`);
      
      // Show first few builders for debugging
      console.log('First 3 builders:');
      data.data.builders.slice(0, 3).forEach((builder: any, index: number) => {
        console.log(`${index + 1}. ${builder.company_name || builder.companyName || 'Unknown'}`, {
          id: builder.id,
          headquarters_city: builder.headquarters_city,
          headquarters_country: builder.headquarters_country,
          headquarters: builder.headquarters,
          service_locations: builder.service_locations,
          serviceLocations: builder.serviceLocations
        });
      });
      
      // Apply our filtering logic
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
      
      console.log('Country variations:', countryVariations);
      
      // Filter builders
      let filteredBuilders = data.data.builders.filter((builder: any) => {
        // Check headquarters country
        const headquartersCountry = normalizeString(builder.headquarters_country || builder.headquarters?.country);
        const headquartersMatch = countryVariations.some(variation => 
          headquartersCountry === variation || headquartersCountry.includes(variation)
        );
        
        // Check service locations
        const serviceLocations = builder.service_locations || builder.serviceLocations || [];
        const serviceLocationMatch = serviceLocations.some((loc: any) => {
          const serviceCountry = normalizeString(loc.country);
          return countryVariations.some(variation => 
            serviceCountry === variation || serviceCountry.includes(variation)
          );
        });
        
        // For city pages, also check city
        let cityMatch = true;
        if (city) {
          const normalizedCity = normalizeString(city);
          // Check headquarters city
          const headquartersCity = normalizeString(builder.headquarters_city || builder.headquarters?.city);
          const headquartersCityMatch = headquartersCity === normalizedCity || headquartersCity.includes(normalizedCity);
          
          // Check service locations for city
          const serviceCityMatch = serviceLocations.some((loc: any) => {
            const serviceCity = normalizeString(loc.city);
            return serviceCity === normalizedCity || serviceCity.includes(normalizedCity);
          });
          
          cityMatch = headquartersCityMatch || serviceCityMatch;
        }
        
        const isActive = builder.status !== 'inactive';
        
        const result = (headquartersMatch || serviceLocationMatch) && cityMatch && isActive;
        
        // Log first builder details
        if (data.data.builders.indexOf(builder) === 0) {
          console.log('First builder filtering details:', {
            headquartersCountry,
            headquartersMatch,
            serviceLocationMatch,
            cityMatch,
            isActive,
            finalResult: result
          });
        }
        
        return result;
      });
      
      console.log(`Builders in ${city ? `${city}, ` : ''}${country}: ${filteredBuilders.length}`);
      
      // Return sample of filtered builders
      const sampleBuilders = filteredBuilders.slice(0, 5).map((builder: any) => ({
        id: builder.id,
        company_name: builder.company_name,
        headquarters_city: builder.headquarters_city,
        headquarters_country: builder.headquarters_country,
        service_locations: builder.service_locations,
        serviceLocations: builder.serviceLocations,
        rating: builder.rating,
        projects_completed: builder.projects_completed,
        verified: builder.verified,
        status: builder.status
      }));
      
      return NextResponse.json({
        success: true,
        data: {
          totalBuilders: data.data.builders.length,
          filteredBuilders: filteredBuilders.length,
          sampleBuilders,
          countryVariations,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch builders from API'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error debugging location builders:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}