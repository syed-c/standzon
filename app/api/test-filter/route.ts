import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    console.log('=== TEST FILTER API ===');
    
    const sb = getServerSupabase();
    if (!sb) {
      return NextResponse.json({
        success: false,
        error: 'Supabase not configured'
      }, { status: 500 });
    }
    
    console.log('✅ Supabase configured');
    
    // Get all builders from builder_profiles (since that's where the data is)
    console.log('🔍 Getting all builders from builder_profiles...');
    const { data: allBuilders, error: buildersError } = await sb
      .from('builder_profiles')
      .select('*');
    
    if (buildersError) {
      throw new Error(`Failed to fetch builders: ${buildersError.message}`);
    }
    
    console.log(`✅ Found ${allBuilders?.length || 0} builders`);
    
    // Test filtering for United Arab Emirates
    console.log('🔍 Testing filtering for United Arab Emirates...');
    const countryInfo = { name: 'United Arab Emirates' };
    const countryVariations = [countryInfo.name.toLowerCase()];
    if (countryInfo.name === "United Arab Emirates") {
      countryVariations.push("uae");
    } else if (countryInfo.name === "UAE") {
      countryVariations.push("united arab emirates");
    }
    
    console.log('Country variations:', countryVariations);
    
    // Apply filtering logic
    const filteredBuilders = allBuilders?.filter((builder: any) => {
      // Normalize strings for comparison
      const normalizeString = (str: string) => {
        if (!str) return '';
        return str.toString().toLowerCase().trim();
      };
      
      const normalizedCountry = normalizeString(countryInfo.name);
      
      // Check headquarters country (handle different field names)
      const headquartersCountry = normalizeString(
        builder.headquarters_country || 
        builder.headquarters?.country || 
        builder.headquartersCountry || 
        ''
      );
      
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
      
      // Log first few builders for debugging
      if (allBuilders && allBuilders.indexOf(builder) < 3) {
        console.log(`Builder ${builder.company_name}:`, {
          headquartersCountry,
          headquartersMatch,
          serviceLocationMatch,
          finalResult: headquartersMatch || serviceLocationMatch
        });
      }
      
      return headquartersMatch || serviceLocationMatch;
    }) || [];
    
    console.log(`✅ Filtered builders for ${countryInfo.name}: ${filteredBuilders.length}`);
    
    // Show sample of filtered builders
    const sampleBuilders = filteredBuilders.slice(0, 3).map((builder: any) => ({
      id: builder.id,
      company_name: builder.company_name,
      headquarters_city: builder.headquarters_city,
      headquarters_country: builder.headquarters_country
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        totalBuilders: allBuilders?.length || 0,
        filteredBuilders: filteredBuilders.length,
        countryVariations,
        sampleBuilders
      }
    });
  } catch (error) {
    console.error('Error testing filter:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}