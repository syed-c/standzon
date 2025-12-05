import { NextRequest, NextResponse } from 'next/server';
import { builderAPI } from '@/lib/database/persistenceAPI';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching imported builders from database...');
    
    // Get all builders from database instead of static file
    const allBuilders = await builderAPI.getAllBuilders();
    console.log(`📊 Total builders in database: ${allBuilders.length}`);
    
    // Filter builders that were imported from GMB
    const importedFromGMB = Array.isArray(allBuilders) ? allBuilders.filter((builder: any) => 
      builder && (
        builder.businessLicense?.startsWith('GMB-') || 
        builder.id?.startsWith('gmb_')
      )
    ) : [];
    
    console.log(`📊 GMB imported builders: ${importedFromGMB.length}`);
    
    const countriesWithImports = Array.from(new Set(
      importedFromGMB.map((b: any) => b.headquarters?.country).filter(Boolean)
    ));
    
    const businessTypes = Array.from(new Set(
      importedFromGMB.flatMap((b: any) => b.services?.map((s: any) => s.name) || []).filter(Boolean)
    ));

    // Get real-time statistics from database
    const stats = await builderAPI.getStats();

    return NextResponse.json({
      success: true,
      data: {
        totalBuilders: allBuilders.length,
        importedFromGMB: importedFromGMB.length,
        originalBuilders: allBuilders.length - importedFromGMB.length,
        importedBuilders: importedFromGMB.map((builder: any) => ({
          id: builder.id,
          name: builder.companyName,
          city: builder.headquarters?.city,
          country: builder.headquarters?.country,
          businessType: builder.services?.[0]?.name || 'Unknown',
          rating: builder.rating,
          phone: builder.contactInfo?.phone,
          website: builder.contactInfo?.website,
          importedAt: 'Recently',
          category: builder.services?.[0]?.category || 'General'
        })),
        countriesWithImports,
        businessTypes,
        platformStats: {
          totalBuilders: stats.totalBuilders,
          verifiedBuilders: stats.verifiedBuilders,
          totalCountries: stats.totalCountries,
          totalCities: stats.totalCities,
          averageRating: Math.round(stats.averageRating * 10) / 10,
          totalProjects: (stats as any).totalProjects || 0,
          importedFromGMB: importedFromGMB.length
        },
        message: `Found ${importedFromGMB.length} businesses imported from Google Places API. Platform now has ${allBuilders.length} total builders.`
      }
    });

  } catch (error) {
    console.error('❌ Failed to fetch imported builders:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch imported builders data'
    }, { status: 500 });
  }
}