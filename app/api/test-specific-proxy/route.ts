import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test the specific image that's failing in the proxy
    const testImageUrl = 'https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/countries/germany/2025-11-10/1762767272165-1p60c0uhnnw.jpg';
    
    console.log('Testing specific image URL:', testImageUrl);
    
    // Try to fetch the image directly from Supabase
    const response = await fetch(testImageUrl);
    
    console.log('Direct fetch response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Could not read response body');
      console.error('Direct fetch failed:', errorText);
      return NextResponse.json({ 
        success: false,
        message: 'Direct fetch failed',
        status: response.status,
        error: errorText
      });
    }
    
    // Try to get the content
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('Successfully fetched image, size:', buffer.length);
    
    return NextResponse.json({ 
      success: true,
      message: 'Successfully fetched image directly',
      url: testImageUrl,
      status: response.status,
      size: buffer.length
    });
  } catch (err: any) {
    console.error('Test error:', err);
    return new NextResponse('Test failed: ' + (err.message || err), { status: 500 });
  }
}