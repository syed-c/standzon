import { NextRequest, NextResponse } from 'next/server';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

// Real-time sync between builder dashboard changes and public listings
export async function POST(request: NextRequest) {
  try {
    const { builderId, changes, action } = await request.json();
    
    console.log('🔄 Syncing builder changes to public listings:', { builderId, action });
    
    if (!builderId) {
      return NextResponse.json({
        success: false,
        error: 'Builder ID is required'
      }, { status: 400 });
    }

    // Get current builder profile
    const builders = unifiedPlatformAPI.getBuilders();
    const builder = builders.find(b => b.id === builderId);
    
    if (!builder) {
      return NextResponse.json({
        success: false,
        error: 'Builder not found'
      }, { status: 404 });
    }

    let updatedBuilder = { ...builder };
    let syncResults = [];

    // Process different types of changes
    switch (action) {
      case 'update_services':
        updatedBuilder.services = changes.services || [];
        updatedBuilder.specializations = changes.specializations || [];
        syncResults.push('Services updated across all location pages');
        break;

      case 'update_locations':
        updatedBuilder.serviceLocations = changes.serviceLocations || [];
        
        // Re-index builder on location pages
        const locationSyncResult = await syncBuilderToLocationPages(updatedBuilder);
        syncResults.push(...locationSyncResult.messages);
        break;

      case 'update_profile':
        // Update basic profile information
        Object.keys(changes).forEach(key => {
          if (changes[key] !== undefined) {
            updatedBuilder[key] = changes[key];
          }
        });
        syncResults.push('Profile updated on all listings');
        break;

      case 'update_portfolio':
        updatedBuilder.portfolio = changes.portfolio || [];
        syncResults.push('Portfolio updated on public profile');
        break;

      case 'update_pricing':
        updatedBuilder.priceRange = changes.priceRange || {};
        syncResults.push('Pricing information updated');
        break;

      default:
        // Generic update for any field changes
        Object.keys(changes).forEach(key => {
          if (changes[key] !== undefined) {
            updatedBuilder[key] = changes[key];
          }
        });
        syncResults.push('Builder information updated');
    }

    // Add sync metadata
    updatedBuilder.lastSyncedAt = new Date().toISOString();
    updatedBuilder.updatedAt = new Date().toISOString();

    // Update builder in unified platform
    const updateResult = unifiedPlatformAPI.updateBuilder(builderId, updatedBuilder);
    
    if (!updateResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update builder profile'
      }, { status: 500 });
    }

    // Update search index and caches
    await updateSearchIndex(updatedBuilder);
    await invalidateLocationCaches(updatedBuilder);

    console.log(`✅ Builder sync completed for ${builderId}: ${syncResults.length} updates`);

    return NextResponse.json({
      success: true,
      data: {
        builderId,
        updatedAt: updatedBuilder.updatedAt,
        syncResults,
        affectedLocations: updatedBuilder.serviceLocations?.map((loc: any) => `${loc.city}, ${loc.country}`) || []
      },
      message: 'Builder information synced successfully across all listings'
    });

  } catch (error) {
    console.error('❌ Builder sync error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to sync builder changes'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const builderId = searchParams.get('builderId');
    
    if (!builderId) {
      return NextResponse.json({
        success: false,
        error: 'Builder ID is required'
      }, { status: 400 });
    }

    // Get sync status for builder
    const builders = unifiedPlatformAPI.getBuilders();
    const builder = builders.find(b => b.id === builderId);
    
    if (!builder) {
      return NextResponse.json({
        success: false,
        error: 'Builder not found'
      }, { status: 404 });
    }

    // Calculate sync health
    const syncHealth = calculateSyncHealth(builder);
    
    return NextResponse.json({
      success: true,
      data: {
        builderId,
        lastSyncedAt: builder.lastSyncedAt,
        syncHealth,
        listingStatus: {
          totalLocations: builder.serviceLocations?.length || 0,
          activeListings: countActiveListings(builder),
          pendingUpdates: checkPendingUpdates(builder)
        }
      }
    });

  } catch (error) {
    console.error('❌ Error checking sync status:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check sync status'
    }, { status: 500 });
  }
}

// Helper functions
async function syncBuilderToLocationPages(builder: any): Promise<{ messages: string[] }> {
  const messages: string[] = [];
  
  if (!builder.serviceLocations || !Array.isArray(builder.serviceLocations)) {
    return { messages: ['No service locations to sync'] };
  }

  // For each service location, ensure builder appears on that location page
  for (const location of builder.serviceLocations) {
    try {
      // Update location-specific listing data
      const locationKey = `${location.country.toLowerCase()}-${location.city.toLowerCase()}`;
      
      // In a real implementation, this would update location-specific data stores
      // For now, we'll log the sync actions
      console.log(`📍 Syncing ${builder.companyName} to location: ${location.city}, ${location.country}`);
      
      messages.push(`Synced to ${location.city}, ${location.country}`);
      
    } catch (error) {
      console.error(`❌ Failed to sync to location ${location.city}:`, error);
      messages.push(`Failed to sync to ${location.city}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return { messages };
}

async function updateSearchIndex(builder: any): Promise<void> {
  // Update search index with new builder information
  console.log('🔍 Updating search index for builder:', builder.companyName);
  
  // In a real implementation, this would update Elasticsearch, Algolia, or similar
  // For now, we'll simulate the update
  
  const searchData = {
    id: builder.id,
    companyName: builder.companyName,
    description: builder.description,
    services: builder.services?.map((s: any) => s.name) || [],
    locations: builder.serviceLocations?.map((l: any) => `${l.city}, ${l.country}`) || [],
    specializations: builder.specializations?.map((s: any) => s.name) || [],
    rating: builder.rating,
    verified: builder.verified,
    premiumMember: builder.premiumMember,
    updatedAt: builder.updatedAt
  };
  
  // Simulate search index update
  console.log('📝 Search index updated with data:', searchData);
}

async function invalidateLocationCaches(builder: any): Promise<void> {
  // Invalidate caches for location pages where this builder appears
  console.log('🗑️ Invalidating location page caches for builder:', builder.companyName);
  
  if (!builder.serviceLocations) return;
  
  for (const location of builder.serviceLocations) {
    const cacheKeys = [
      `location-${location.country.toLowerCase()}`,
      `location-${location.country.toLowerCase()}-${location.city.toLowerCase()}`,
      `builders-${location.city.toLowerCase()}`
    ];
    
    // Simulate cache invalidation
    cacheKeys.forEach(key => {
      console.log(`🗑️ Invalidated cache: ${key}`);
    });
  }
}

function calculateSyncHealth(builder: any): {
  status: 'healthy' | 'warning' | 'error';
  score: number;
  issues: string[];
} {
  const issues: string[] = [];
  let score = 100;

  // Check last sync time
  if (builder.lastSyncedAt) {
    const lastSync = new Date(builder.lastSyncedAt);
    const hoursSinceSync = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceSync > 24) {
      issues.push('Profile not synced in 24+ hours');
      score -= 20;
    }
  } else {
    issues.push('Profile never synced');
    score -= 30;
  }

  // Check for required fields
  const requiredFields = ['companyName', 'contactEmail', 'serviceLocations'];
  for (const field of requiredFields) {
    if (!builder[field] || (Array.isArray(builder[field]) && builder[field].length === 0)) {
      issues.push(`Missing required field: ${field}`);
      score -= 15;
    }
  }

  // Check service locations
  if (builder.serviceLocations && builder.serviceLocations.length === 0) {
    issues.push('No service locations specified');
    score -= 25;
  }

  let status: 'healthy' | 'warning' | 'error' = 'healthy';
  if (score < 70) status = 'error';
  else if (score < 90) status = 'warning';

  return { status, score: Math.max(0, score), issues };
}

function countActiveListings(builder: any): number {
  // Count how many location pages this builder appears on
  return builder.serviceLocations?.length || 0;
}

function checkPendingUpdates(builder: any): number {
  // Check for any pending updates that haven't been synced
  // This would typically check a queue or sync status
  return 0; // Simplified for demo
}