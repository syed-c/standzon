import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== SUPABASE FETCH TEST ===');
    
    // Test the exact Supabase URL that should work
    const supabaseUrl = 'https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/countries/germany/2025-11-10/1762767272165-1p60c0uhnnw.jpg';
    console.log('Testing Supabase URL:', supabaseUrl);
    
    let response;
    try {
      console.log('Attempting to fetch from Supabase...');
      response = await fetch(supabaseUrl);
      console.log('Supabase fetch completed');
      console.log('Response type:', typeof response);
      console.log('Response status:', response.status);
    } catch (fetchError: any) {
      console.error('Supabase fetch failed with error:', fetchError);
      console.error('Error type:', typeof fetchError);
      console.error('Error message:', fetchError.message);
      console.error('Error stack:', fetchError.stack);
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
    
    // Try to get the content
    console.log('Getting response content...');
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log('Content retrieved, size:', buffer.length);
    
    // Get content type from response headers
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    console.log('Content type:', contentType);
    
    console.log('Supabase fetch successful');
    
    return NextResponse.json({ 
      success: true,
      message: 'Supabase fetch successful',
      status: response.status,
      size: buffer.length,
      contentType: contentType
    });
  } catch (err: any) {
    console.error('Supabase fetch test error:', err);
    console.error('Error stack:', err.stack);
    return new NextResponse('Test failed: ' + (err.message || err), { status: 500 });
  }
}