import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const city = searchParams.get('city');
    
    console.log('=== Testing Location Page Builders ===');
    console.log('Country:', country);
    console.log('City:', city);
    
    // Simulate what the location page does
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/admin/builders?limit=1000&prioritize_real=true`,
      { cache: "no-store" }
    );
    const data = await response.json();
    
    if (data.success && data.data && Array.isArray(data.data.builders)) {
      console.log(`Total builders from API: ${data.data.builders.length}`);
      
      // Filter builders based on location
      let filteredBuilders = data.data.builders;
      
      if (country) {
        // Handle country name variations
        const countryVariations = [country];
        if (country === "United Arab Emirates") {
          countryVariations.push("UAE");
        } else if (country === "UAE") {
          countryVariations.push("United Arab Emirates");
        }
        
        filteredBuilders = data.data.builders.filter((builder: any) => {
          const headquartersCountry = builder.headquarters_country;
          const headquartersMatch = countryVariations.includes(headquartersCountry);
          console.log(`Builder ${builder.company_name}: country=${headquartersCountry}, match=${headquartersMatch}`);
          return headquartersMatch;
        });
        
        console.log(`Builders in ${country}: ${filteredBuilders.length}`);
      }
      
      if (city && country) {
        filteredBuilders = filteredBuilders.filter((builder: any) => {
          const headquartersCity = builder.headquarters_city;
          const cityMatch = headquartersCity && 
            headquartersCity.toLowerCase().trim() === city.toLowerCase().trim();
          console.log(`Builder ${builder.company_name}: city=${headquartersCity}, match=${cityMatch}`);
          return cityMatch;
        });
        
        console.log(`Builders in ${city}, ${country}: ${filteredBuilders.length}`);
      }
      
      // Return sample of builders
      const sampleBuilders = filteredBuilders.slice(0, 3).map((builder: any) => ({
        id: builder.id,
        company_name: builder.company_name,
        headquarters_city: builder.headquarters_city,
        headquarters_country: builder.headquarters_country,
        rating: builder.rating,
        projects_completed: builder.projects_completed,
        verified: builder.verified
      }));
      
      return NextResponse.json({
        success: true,
        data: {
          totalBuilders: data.data.builders.length,
          filteredBuilders: filteredBuilders.length,
          sampleBuilders
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch builders from API'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error testing location page builders:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}