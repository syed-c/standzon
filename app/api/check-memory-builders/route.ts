import { NextRequest, NextResponse } from 'next/server';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking in-memory builders...');
    
    const builders = unifiedPlatformAPI.getBuilders();
    
    return NextResponse.json({
      success: true,
      message: `Found ${builders.length} builders in memory`,
      data: {
        count: builders.length,
        builders: builders.map(b => ({
          id: b.id,
          companyName: b.companyName,
          email: b.contactInfo?.primaryEmail,
          city: b.headquarters?.city,
          country: b.headquarters?.country
        }))
      }
    });
    
  } catch (error) {
    console.error('❌ Error checking in-memory builders:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check in-memory builders',
      details: error
    }, { status: 500 });
  }
}
