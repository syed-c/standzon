import { NextRequest, NextResponse } from "next/server";
import { unifiedPlatformAPI } from "@/lib/data/unifiedPlatformData";

export async function GET() {
  try {
    console.log('=== Testing Unified Platform Data System ===');
    
    // Get builders from unified platform
    const builders = unifiedPlatformAPI.getBuilders();
    console.log(`Found ${builders.length} builders in unified platform`);
    
    // Get builders asynchronously (ensures initialization)
    const asyncBuilders = await unifiedPlatformAPI.getBuildersAsync();
    console.log(`Found ${asyncBuilders.length} builders in unified platform (async)`);
    
    return NextResponse.json({
      success: true,
      data: {
        syncBuilders: builders.length,
        asyncBuilders: asyncBuilders.length,
        sampleBuilders: asyncBuilders.slice(0, 3).map(b => ({
          id: b.id,
          companyName: b.companyName,
          headquarters: b.headquarters
        }))
      }
    });
  } catch (error) {
    console.error('Error testing unified platform:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
