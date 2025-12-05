import { NextRequest, NextResponse } from 'next/server';
import { generateAllCountryBuilders, generateBulkBuilders } from '@/lib/utils/bulkBuilderGenerator';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  console.log('🚀 Starting bulk import process...');
  
  try {
    const body = await request.json();
    const { action, countries, count } = body;

    let buildersToAdd = [];

    if (action === 'generate-all') {
      console.log('📊 Generating builders for all supported countries...');
      buildersToAdd = generateAllCountryBuilders();
    } else if (action === 'generate-country' && countries && count) {
      console.log(`📊 Generating ${count} builders for specific countries:`, countries);
      countries.forEach((country: string) => {
        const countryBuilders = generateBulkBuilders(country, count);
        buildersToAdd.push(...countryBuilders);
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid action. Use "generate-all" or "generate-country" with countries array and count.' 
      }, { status: 400 });
    }

    console.log(`📝 Adding ${buildersToAdd.length} builders to the platform...`);

    // Read existing builders
    const buildersPath = path.join(process.cwd(), 'data', 'builders.json');
    let existingData = { _metadata: {}, data: [] };
    
    try {
      const fileContent = await fs.readFile(buildersPath, 'utf8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      console.log('📝 No existing builders file, creating new one...');
    }

    // Check for duplicates by company name + city
    const existingBuilders = existingData.data || [];
    const existingKeys = new Set(
      existingBuilders.map((b: any) => `${b.companyName}-${b.headquarters?.city}`.toLowerCase())
    );

    const newBuilders = buildersToAdd.filter(builder => {
      const key = `${builder.companyName}-${builder.headquarters?.city}`.toLowerCase();
      return !existingKeys.has(key);
    });

    console.log(`🔍 Filtered out ${buildersToAdd.length - newBuilders.length} duplicates`);
    console.log(`✅ Adding ${newBuilders.length} new builders`);

    // Add new builders to existing data
    const updatedData = {
      _metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        checksum: Math.random().toString(36).substring(7)
      },
      data: [...existingBuilders, ...newBuilders]
    };

    // Write updated data back to file
    await fs.writeFile(buildersPath, JSON.stringify(updatedData, null, 2));

    // Also update the GMB imported builders file
    const gmbPath = path.join(process.cwd(), 'lib', 'data', 'gmbImportedBuilders.json');
    const existingGmbBuilders = [];
    
    try {
      const gmbContent = await fs.readFile(gmbPath, 'utf8');
      existingGmbBuilders.push(...JSON.parse(gmbContent));
    } catch (error) {
      console.log('📝 No existing GMB file, creating new one...');
    }

    const updatedGmbBuilders = [...existingGmbBuilders, ...newBuilders];
    await fs.writeFile(gmbPath, JSON.stringify(updatedGmbBuilders, null, 2));

    console.log('✅ Bulk import completed successfully!');

    // Generate summary statistics
    const countryStats = {};
    newBuilders.forEach(builder => {
      const country = builder.headquarters.country;
      if (!countryStats[country]) {
        countryStats[country] = { count: 0, cities: new Set() };
      }
      countryStats[country].count++;
      countryStats[country].cities.add(builder.headquarters.city);
    });

    // Convert Sets to arrays for JSON response
    const countryStatsForResponse = {};
    Object.keys(countryStats).forEach(country => {
      countryStatsForResponse[country] = {
        count: countryStats[country].count,
        cities: Array.from(countryStats[country].cities)
      };
    });

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${newBuilders.length} builders`,
      data: {
        imported: newBuilders.length,
        duplicatesSkipped: buildersToAdd.length - newBuilders.length,
        totalBuilders: updatedData.data.length,
        countryBreakdown: countryStatsForResponse,
        sampleBuilders: newBuilders.slice(0, 5).map(b => ({
          id: b.id,
          companyName: b.companyName,
          city: b.headquarters.city,
          country: b.headquarters.country
        }))
      }
    });

  } catch (error) {
    console.error('❌ Bulk import failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal server error during bulk import' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  console.log('📊 Getting bulk import status...');
  
  try {
    // Read current builders data
    const buildersPath = path.join(process.cwd(), 'data', 'builders.json');
    let existingData = { data: [] };
    
    try {
      const fileContent = await fs.readFile(buildersPath, 'utf8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      console.log('📝 No existing builders file found');
    }

    const builders = existingData.data || [];
    
    // Count by country
    const countryStats = {};
    builders.forEach(builder => {
      const country = builder.headquarters?.country || 'Unknown';
      if (!countryStats[country]) {
        countryStats[country] = { count: 0, cities: new Set(), imported: 0 };
      }
      countryStats[country].count++;
      countryStats[country].cities.add(builder.headquarters?.city);
      
      // Count GMB imported ones (those with gmb_ prefix)
      if (builder.id && builder.id.startsWith('gmb_')) {
        countryStats[country].imported++;
      }
    });

    // Convert Sets to arrays
    const countryStatsForResponse = {};
    Object.keys(countryStats).forEach(country => {
      countryStatsForResponse[country] = {
        total: countryStats[country].count,
        imported: countryStats[country].imported,
        cities: Array.from(countryStats[country].cities),
        cityCount: countryStats[country].cities.size
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        totalBuilders: builders.length,
        totalImported: builders.filter(b => b.id && b.id.startsWith('gmb_')).length,
        countryBreakdown: countryStatsForResponse,
        supportedCountries: ['United States', 'United Arab Emirates', 'United Kingdom', 'Australia'],
        lastUpdated: existingData._metadata?.timestamp || null
      }
    });

  } catch (error) {
    console.error('❌ Failed to get bulk import status:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}