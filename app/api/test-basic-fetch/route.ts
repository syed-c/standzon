import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== BASIC FETCH TEST ===');
    
    // Test a simple external URL first
    const testUrl = 'https://httpbin.org/get';
    console.log('Testing basic fetch to:', testUrl);
    
    const response = await fetch(testUrl);
    console.log('Basic fetch status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Could not read response body');
      console.error('Basic fetch failed:', errorText);
      return NextResponse.json({ 
        success: false,
        message: 'Basic fetch failed',
        status: response.status,
        error: errorText
      });
    }
    
    console.log('Basic fetch successful');
    
    // Now test the Supabase URL
    const supabaseUrl = 'https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/countries/germany/2025-11-10/1762767272165-1p60c0uhnnw.jpg';
    console.log('Testing Supabase URL:', supabaseUrl);
    
    const supabaseResponse = await fetch(supabaseUrl);
    console.log('Supabase fetch status:', supabaseResponse.status);
    
    if (!supabaseResponse.ok) {
      const errorText = await supabaseResponse.text().catch(() => 'Could not read response body');
      console.error('Supabase fetch failed:', errorText);
      return NextResponse.json({ 
        success: false,
        message: 'Supabase fetch failed',
        status: supabaseResponse.status,
        error: errorText
      });
    }
    
    console.log('Supabase fetch successful');
    
    return NextResponse.json({ 
      success: true,
      message: 'All fetch tests successful',
      basicFetchStatus: response.status,
      supabaseFetchStatus: supabaseResponse.status
    });
  } catch (err: any) {
    console.error('Basic fetch test error:', err);
    console.error('Error stack:', err.stack);
    return new NextResponse('Test failed: ' + (err.message || err), { status: 500 });
  }
}