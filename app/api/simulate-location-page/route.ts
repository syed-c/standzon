import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'Germany';
    const city = searchParams.get('city');
    
    console.log('=== SIMULATE LOCATION PAGE ===');
    console.log('Country:', country);
    console.log('City:', city);
    
    // Simulate what the location page does - fetch all builders
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    // Ensure the base URL has a protocol (http:// or https://)
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = `https://${baseUrl}`;
    }
    
    const response = await fetch(
      `${baseUrl}/api/admin/builders?limit=1000&prioritize_real=true`,
      { cache: "no-store" }
    );
    const data = await response.json();
    
    if (data.success && data.data && Array.isArray(data.data.builders)) {
      console.log(`Total builders from API: ${data.data.builders.length}`);
      
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
      
      // Filter builders for this country
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
      
      // Transform builders to match expected interface
      const transformedBuilders = filteredBuilders.map((b: any) => ({
        id: b.id,
        companyName: b.company_name || b.companyName || "",
        companyDescription: b.description || b.companyDescription || "",
        headquarters: {
          city: b.headquarters_city || b.headquarters?.city || "Unknown",
          country:
            b.headquarters_country ||
            b.headquartersCountry ||
            b.headquarters?.country ||
            "Unknown",
          countryCode: b.headquarters?.countryCode || "XX",
          address: b.headquarters?.address || "",
          latitude: b.headquarters?.latitude || 0,
          longitude: b.headquarters?.longitude || 0,
          isHeadquarters: true,
        },
        serviceLocations: b.serviceLocations || b.service_locations || [],
        keyStrengths: b.keyStrengths || [],
        verified: b.verified || b.isVerified || false,
        rating: b.rating || 0,
        projectsCompleted:
          b.projectsCompleted || b.projects_completed || 0,
        importedFromGMB: b.importedFromGMB || b.gmbImported || false,
        logo: b.logo || "/images/builders/default-logo.png",
        establishedYear: b.establishedYear || b.established_year || 2020,
        teamSize: b.teamSize || 10,
        reviewCount: b.reviewCount || 0,
        responseTime: b.responseTime || "Within 24 hours",
        languages: b.languages || ["English"],
        premiumMember: b.premiumMember || b.premium_member || false,
        slug:
          b.slug ||
          (b.company_name || b.companyName || "")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-"),
        primary_email: b.primary_email || b.primaryEmail || "",
        phone: b.phone || "",
        website: b.website || "",
        contact_person: b.contact_person || b.contactPerson || "",
        position: b.position || "",
        gmbImported:
          b.gmbImported ||
          b.importedFromGMB ||
          b.source === "GMB_API" ||
          false,
      }));
      
      // Return sample of filtered builders
      const sampleBuilders = transformedBuilders.slice(0, 5).map((builder: any) => ({
        id: builder.id,
        companyName: builder.companyName,
        headquarters: builder.headquarters,
        serviceLocations: builder.serviceLocations,
        rating: builder.rating,
        projectsCompleted: builder.projectsCompleted,
        verified: builder.verified,
        status: builder.status
      }));
      
      return NextResponse.json({
        success: true,
        data: {
          totalBuilders: data.data.builders.length,
          filteredBuilders: transformedBuilders.length,
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
    console.error('Error simulating location page:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}