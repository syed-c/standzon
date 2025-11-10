import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== DETAILED PROXY TEST ===');
    
    // Test the exact same logic as the proxy route
    const bucket = 'gallery';
    const filePath = 'countries/germany/2025-11-10/1762767272165-1p60c0uhnnw.jpg';
    const supabaseUrl = `https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/${bucket}/${filePath}`;
    
    console.log('Testing Supabase URL:', supabaseUrl);
    
    // Try to fetch the image directly from Supabase
    console.log('Attempting to fetch from Supabase...');
    const response = await fetch(supabaseUrl);
    console.log('Fetch completed with status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Could not read response body');
      console.error('Supabase fetch failed:', errorText);
      return NextResponse.json({ 
        success: false,
        message: 'Supabase fetch failed',
        status: response.status,
        error: errorText
      });
    }
    
    // Try to get the content
    console.log('Converting response to buffer...');
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log('Buffer conversion completed, size:', buffer.length);
    
    // Get content type from response headers
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    console.log('Content type:', contentType);
    
    return NextResponse.json({ 
      success: true,
      message: 'Successfully fetched and processed image',
      url: supabaseUrl,
      status: response.status,
      size: buffer.length,
      contentType: contentType
    });
  } catch (err: any) {
    console.error('Detailed proxy test error:', err);
    console.error('Error stack:', err.stack);
    return new NextResponse('Test failed: ' + (err.message || err), { status: 500 });
  }
}