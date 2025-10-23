import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing Supabase configuration...');
    
    const url = process.env.SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';
    
    console.log('Environment variables:', {
      SUPABASE_URL: url ? '✅ Set' : '❌ Not set',
      SUPABASE_SERVICE_ROLE_KEY: serviceKey ? '✅ Set' : '❌ Not set',
      url: url.substring(0, 20) + '...',
      serviceKey: serviceKey.substring(0, 20) + '...'
    });
    
    if (!url || !serviceKey) {
      return NextResponse.json({
        success: false,
        error: 'Supabase environment variables not configured',
        details: {
          url: !!url,
          serviceKey: !!serviceKey
        }
      });
    }
    
    // Test Supabase connection
    try {
      const { getServerSupabase } = await import('@/lib/supabase');
      const sb = getServerSupabase();
      
      if (!sb) {
        return NextResponse.json({
          success: false,
          error: 'Supabase client not created'
        });
      }
      
      // Test a simple query
      const { data, error } = await sb.from('builder_profiles').select('count').limit(1);
      
      return NextResponse.json({
        success: true,
        message: 'Supabase connection successful',
        data: {
          url: url.substring(0, 30) + '...',
          serviceKey: serviceKey.substring(0, 30) + '...',
          queryResult: data,
          error: error
        }
      });
      
    } catch (supabaseError) {
      return NextResponse.json({
        success: false,
        error: 'Supabase connection failed',
        details: supabaseError
      });
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error
    }, { status: 500 });
  }
}
