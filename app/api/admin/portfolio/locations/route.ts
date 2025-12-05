import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/client';

export async function GET() {
  try {
    console.log('🔍 Fetching location data from Supabase...');
    
    // Fetch all page contents from Supabase using admin client
    const supabase = getSupabaseAdminClient();
    
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase admin client not available'
      }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('page_contents')
      .select('id, path')
      .order('path');

    if (error) {
      console.error('❌ Error fetching page contents:', error);
      return NextResponse.json({ 
        success: false, 
        error: `Failed to fetch page contents: ${error.message}`
      }, { status: 500 });
    }

    console.log(`✅ Successfully fetched ${data.length} page contents from Supabase`);
    
    // Parse paths to extract countries and cities
    const countries: Record<string, { slug: string; name: string }> = {};
    const cities: Record<string, Array<{ slug: string; name: string }>> = {};

    data.forEach((record: any) => {
      const path = record.path;
      if (!path) return;

      // Match country paths: /exhibition-stands/{country}
      const countryMatch = path.match(/^\/exhibition-stands\/([a-z0-9-]+)$/);
      if (countryMatch) {
        const countrySlug = countryMatch[1];
        // Convert slug to readable name (e.g., "united-states" -> "United States")
        const countryName = countrySlug
          .split('-')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        countries[countrySlug] = { slug: countrySlug, name: countryName };
        if (!cities[countrySlug]) {
          cities[countrySlug] = [];
        }
        return;
      }

      // Match city paths: /exhibition-stands/{country}/{city}
      const cityMatch = path.match(/^\/exhibition-stands\/([a-z0-9-]+)\/([a-z0-9-]+)$/);
      if (cityMatch) {
        const countrySlug = cityMatch[1];
        const citySlug = cityMatch[2];
        // Convert slug to readable name
        const cityName = citySlug
          .split('-')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        // Ensure country exists in our list
        if (!countries[countrySlug]) {
          const countryName = countrySlug
            .split('-')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          countries[countrySlug] = { slug: countrySlug, name: countryName };
        }
        
        // Add city to country
        if (!cities[countrySlug]) {
          cities[countrySlug] = [];
        }
        cities[countrySlug].push({ slug: citySlug, name: cityName });
        return;
      }
    });

    console.log('📊 Parsed countries:', Object.keys(countries).length);

    // Convert countries object to array and sort
    const countryArray = Object.values(countries).sort((a, b) => 
      a.name.localeCompare(b.name)
    );

    console.log('📦 Returning', countryArray.length, 'countries and', Object.keys(cities).length, 'city groups');
    
    return NextResponse.json({ 
      success: true,
      countries: countryArray,
      cities: cities,
      totalRecords: data.length
    });
  } catch (error: any) {
    console.error('❌ Error loading country/city data:', error);
    return NextResponse.json({ 
      success: false, 
      error: `Failed to load location data: ${error.message}`
    }, { status: 500 });
  }
}