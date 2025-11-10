import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== SUPABASE INSECURE FETCH TEST ===');
    
    // Test the exact Supabase URL that should work
    const supabaseUrl = 'https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/countries/germany/2025-11-10/1762767272165-1p60c0uhnnw.jpg';
    console.log('Testing Supabase URL:', supabaseUrl);
    
    // Try with different fetch options
    const fetchOptions = {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    
    console.log('Fetch options:', fetchOptions);
    
    let response;
    try {
      console.log('Attempting to fetch from Supabase with options...');
      response = await fetch(supabaseUrl, fetchOptions);
      console.log('Supabase fetch completed');
      console.log('Response status:', response.status);
    } catch (fetchError: any) {
      console.error('Supabase fetch failed with error:', fetchError);
      console.error('Error type:', typeof fetchError);
      console.error('Error message:', fetchError.message);
      
      // Try without SSL verification (this is just for debugging)
      try {
        console.log('Trying with insecure HTTP...');
        const insecureUrl = supabaseUrl.replace('https://', 'http://');
        console.log('Insecure URL:', insecureUrl);
        const insecureResponse = await fetch(insecureUrl, fetchOptions);
        console.log('Insecure fetch status:', insecureResponse.status);
        return NextResponse.json({ 
          success: true,
          message: 'Insecure fetch worked',
          status: insecureResponse.status
        });
      } catch (insecureError: any) {
        console.error('Insecure fetch also failed:', insecureError.message);
      }
      
      return NextResponse.json({ 
        success: false,
        message: 'Supabase fetch failed',
        error: fetchError.message || String(fetchError)
      });
    }
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Could not read response body');
      console.error('Supabase response not OK:', errorText);
      return NextResponse.json({ 
        success: false,
        message: 'Supabase response not OK',
        status: response.status,
        error: errorText
      });
    }
    
    console.log('Supabase fetch successful');
    
    return NextResponse.json({ 
      success: true,
      message: 'Supabase fetch successful',
      status: response.status
    });
  } catch (err: any) {
    console.error('Supabase insecure fetch test error:', err);
    console.error('Error stack:', err.stack);
    return new NextResponse('Test failed: ' + (err.message || err), { status: 500 });
  }
}