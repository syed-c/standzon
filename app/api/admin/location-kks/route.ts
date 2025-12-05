// Superadmin Location KKS (Key Knowledge Store) API Endpoint
// For GMB API integration and exhibition hub management
// Route: /api/admin/location-kks

import { NextRequest, NextResponse } from 'next/server';
import LocationKKS from '@/lib/api/locationKKS';

export async function GET(request: NextRequest) {
  try {
    console.log('🌍 Location KKS API called');
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const continent = searchParams.get('continent');
    const country = searchParams.get('country');
    const city = searchParams.get('city');
    const industry = searchParams.get('industry');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    console.log('📊 Location KKS Query:', { action, continent, country, city, industry, limit });

    switch (action) {
      case 'all-regions':
        console.log('📍 Fetching all exhibition regions...');
        const allRegions = LocationKKS.getAllExhibitionRegions();
        return NextResponse.json({
          success: true,
          message: `Loaded ${allRegions.totalStats.exhibitionHubs} exhibition hubs across ${allRegions.totalStats.continents} continents`,
          data: allRegions
        });

      case 'gmb-locations':
        console.log('🔍 Fetching GMB search locations...');
        const gmbLocations = LocationKKS.getGMBSearchLocations({
          continent,
          country,
          city,
          limit
        });
        return NextResponse.json({
          success: true,
          message: `Found ${gmbLocations.length} GMB search locations`,
          data: gmbLocations
        });

      case 'top-destinations':
        console.log('🌟 Fetching top exhibition destinations...');
        const topDestinations = LocationKKS.getTopGlobalExhibitionDestinations(limit || 25);
        return NextResponse.json({
          success: true,
          message: `Top ${topDestinations.length} exhibition destinations loaded`,
          data: topDestinations
        });

      case 'europe-hubs':
        console.log('🇪🇺 Fetching European exhibition hubs...');
        const europeHubs = LocationKKS.getEuropeanExhibitionHubs();
        return NextResponse.json({
          success: true,
          message: `${europeHubs.length} European exhibition hubs loaded`,
          data: europeHubs
        });

      case 'asia-hubs':
        console.log('🇨🇳 Fetching Asian exhibition hubs...');
        const asiaHubs = LocationKKS.getAsianExhibitionHubs();
        return NextResponse.json({
          success: true,
          message: `${asiaHubs.length} Asian exhibition hubs loaded`,
          data: asiaHubs
        });

      case 'north-america-hubs':
        console.log('🇺🇸 Fetching North American exhibition hubs...');
        const naHubs = LocationKKS.getNorthAmericanExhibitionHubs();
        return NextResponse.json({
          success: true,
          message: `${naHubs.length} North American exhibition hubs loaded`,
          data: naHubs
        });

      case 'industry-hubs':
        if (!industry) {
          return NextResponse.json({
            success: false,
            message: 'Industry parameter required for industry-hubs action'
          }, { status: 400 });
        }
        console.log(`🏭 Fetching exhibition hubs for ${industry} industry...`);
        const industryHubs = LocationKKS.getExhibitionHubsByIndustry(industry, limit || 20);
        return NextResponse.json({
          success: true,
          message: `${industryHubs.length} exhibition hubs found for ${industry} industry`,
          data: industryHubs
        });

      case 'gmb-search-plan':
        console.log('📋 Generating comprehensive GMB search plan...');
        const searchPlan = LocationKKS.generateGMBSearchPlan();
        return NextResponse.json({
          success: true,
          message: `GMB search plan generated for ${searchPlan.totalLocations} locations`,
          data: searchPlan
        });

      case 'validate-location':
        if (!country) {
          return NextResponse.json({
            success: false,
            message: 'Country parameter required for location validation'
          }, { status: 400 });
        }
        console.log(`✅ Validating location: ${country}${city ? `, ${city}` : ''}`);
        const validation = LocationKKS.validateLocation(country, city || undefined);
        return NextResponse.json({
          success: validation.isValid,
          message: validation.isValid ? 'Location found in KKS' : 'Location not found',
          data: validation
        });

      case 'location-hierarchy':
        if (!country) {
          return NextResponse.json({
            success: false,
            message: 'Country parameter required for location hierarchy'
          }, { status: 400 });
        }
        console.log(`🏗️ Getting location hierarchy: ${country}${city ? `, ${city}` : ''}`);
        const hierarchy = LocationKKS.getLocationHierarchy(country, city || undefined);
        return NextResponse.json({
          success: true,
          message: 'Location hierarchy retrieved',
          data: hierarchy
        });

      case 'stats':
        console.log('📊 Fetching Location KKS statistics...');
        const allRegionsStats = LocationKKS.getAllExhibitionRegions();
        return NextResponse.json({
          success: true,
          message: 'Location KKS statistics retrieved',
          data: {
            overview: allRegionsStats.totalStats,
            continents: allRegionsStats.continents,
            topCountries: allRegionsStats.countries
              .sort((a, b) => b.cities.length - a.cities.length)
              .slice(0, 10)
              .map(c => ({ name: c.name, code: c.code, cities: c.cities.length })),
            regionBreakdown: allRegionsStats.continents.map(continent => {
              const continentCountries = allRegionsStats.countries.filter(c => c.continent === continent);
              const continentHubs = allRegionsStats.exhibitionHubs.filter(h => h.continent === continent);
              return {
                continent,
                countries: continentCountries.length,
                exhibitionHubs: continentHubs.length,
                totalEvents: continentHubs.reduce((sum, hub) => sum + hub.annualEvents, 0)
              };
            })
          }
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action. Available actions: all-regions, gmb-locations, top-destinations, europe-hubs, asia-hubs, north-america-hubs, industry-hubs, gmb-search-plan, validate-location, location-hierarchy, stats',
          availableActions: [
            'all-regions',
            'gmb-locations', 
            'top-destinations',
            'europe-hubs',
            'asia-hubs', 
            'north-america-hubs',
            'industry-hubs',
            'gmb-search-plan',
            'validate-location',
            'location-hierarchy',
            'stats'
          ]
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Location KKS API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error in Location KKS',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Location KKS POST request');
    
    const body = await request.json();
    const { action, batch_locations, gmb_integration } = body;

    switch (action) {
      case 'batch-gmb-search':
        console.log('📦 Processing batch GMB search...');
        
        if (!batch_locations || !Array.isArray(batch_locations)) {
          return NextResponse.json({
            success: false,
            message: 'batch_locations array required'
          }, { status: 400 });
        }

        // Process each location for GMB search
        const batchResults = batch_locations.map((locationQuery: any) => {
          const gmbLocations = LocationKKS.getGMBSearchLocations(locationQuery);
          return {
            query: locationQuery,
            locations: gmbLocations,
            searchQueries: gmbLocations.flatMap(loc => loc.searchQueries).slice(0, 10)
          };
        });

        return NextResponse.json({
          success: true,
          message: `Processed ${batchResults.length} batch GMB searches`,
          data: {
            batchResults,
            totalLocations: batchResults.reduce((sum, result) => sum + result.locations.length, 0),
            totalSearchQueries: batchResults.reduce((sum, result) => sum + result.searchQueries.length, 0)
          }
        });

      case 'gmb-integration-setup':
        console.log('🔧 Setting up GMB integration...');
        
        const integrationPlan = LocationKKS.generateGMBSearchPlan();
        
        return NextResponse.json({
          success: true,
          message: 'GMB integration setup completed',
          data: {
            plan: integrationPlan,
            recommendations: {
              priorityLocations: integrationPlan.priorityLocations.slice(0, 10),
              suggestedSearchFrequency: 'Weekly for high-priority, monthly for others',
              estimatedAPICallsPerWeek: integrationPlan.priorityLocations.length * 10 + 
                                      (integrationPlan.totalLocations - integrationPlan.priorityLocations.length) * 3,
              keyIndustries: integrationPlan.industryBreakdown.slice(0, 5)
            }
          }
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid POST action. Available actions: batch-gmb-search, gmb-integration-setup'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Location KKS POST Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error in Location KKS POST',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}