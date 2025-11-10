import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== ENVIRONMENT TEST ===');
    
    // Check environment variables
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('SUPABASE_URL:', supabaseUrl);
    console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!supabaseServiceKey);
    
    // Check if we're in development or production
    const isDev = process.env.NODE_ENV === 'development';
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Is Development:', isDev);
    
    // Check if fetch is working at all
    console.log('Testing basic fetch...');
    try {
      const response = await fetch('https://httpbin.org/get');
      console.log('Basic fetch status:', response.status);
    } catch (fetchErr: any) {
      console.error('Basic fetch failed:', fetchErr.message);
    }
    
    // Test Supabase URL construction
    const testBucket = 'gallery';
    const testPath = 'countries/germany/2025-11-10/1762767272165-1p60c0uhnnw.jpg';
    const testSupabaseUrl = `https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/${testBucket}/${testPath}`;
    
    console.log('Test Supabase URL:', testSupabaseUrl);
    
    return NextResponse.json({ 
      success: true,
      message: 'Environment test completed',
      env: {
        supabaseUrl: supabaseUrl ? '[REDACTED]' : null,
        hasServiceKey: !!supabaseServiceKey,
        nodeEnv: process.env.NODE_ENV,
        isDev: isDev
      },
      testUrl: testSupabaseUrl
    });
  } catch (err: any) {
    console.error('Environment test error:', err);
    return new NextResponse('Test failed: ' + (err.message || String(err)), { status: 500 });
  }
}