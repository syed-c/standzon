import { NextRequest, NextResponse } from 'next/server';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 Clearing in-memory builders...');
    
    // Clear builders from memory
    unifiedPlatformAPI.clearBuilders();
    
    return NextResponse.json({
      success: true,
      message: 'In-memory builders cleared successfully'
    });
  } catch (error) {
    console.error('❌ Error clearing builders:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to clear builders'
    }, { status: 500 });
  }
}
