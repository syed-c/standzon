import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking builders in Supabase...');
    
    const { getServerSupabase } = await import('@/lib/supabase');
    const sb = getServerSupabase();
    
    if (!sb) {
      return NextResponse.json({
        success: false,
        error: 'Supabase client not available'
      });
    }
    
    // Get all builders from Supabase
    const { data: builders, error } = await sb
      .from('builder_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Failed to query builders',
        details: error
      });
    }
    
    return NextResponse.json({
      success: true,
      message: `Found ${builders?.length || 0} builders in Supabase`,
      data: {
        count: builders?.length || 0,
        builders: builders || []
      }
    });
    
  } catch (error) {
    console.error('❌ Error checking builders:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check builders',
      details: error
    }, { status: 500 });
  }
}
