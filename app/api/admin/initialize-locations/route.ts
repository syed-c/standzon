import { NextResponse } from 'next/server';

// Import your countries data
import { allCountriesWithCities } from '@/lib/data/countries';

export async function GET() {
  try {
    console.log('🌍 Loading countries and cities data for locations');
    
    // Transform the countries data to include cities
    const countriesWithCities = allCountriesWithCities.map(country => ({
      name: country.name,
      code: country.code,
      cities: country.majorCities.map(city => city.name)
    }));

    console.log(`✅ Loaded ${countriesWithCities.length} countries with cities`);

    return NextResponse.json({
      success: true,
      data: {
        countries: countriesWithCities
      }
    });

  } catch (error) {
    console.error('❌ Error loading countries data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to load countries data'
    }, { status: 500 });
  }
}
