import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== SUPABASE IMAGE TEST ===');
    
    // Test the direct Supabase URL for the image
    const supabaseUrl = 'https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/countries/germany/2025-11-10/1762771365593-looafqzp4w.jpg';
    
    console.log('Testing Supabase URL:', supabaseUrl);
    
    // Try to fetch directly from Supabase
    const response = await fetch(supabaseUrl);
    
    console.log('Supabase response status:', response.status);
    console.log('Supabase response headers:', Object.fromEntries(response.headers.entries()));
    
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
    
    // Get the content
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('Supabase response size:', buffer.length);
    console.log('Content type:', response.headers.get('content-type'));
    
    // Try to validate if it's a valid image by checking the magic bytes
    if (buffer.length > 4) {
      const magicBytes = buffer.slice(0, 4);
      console.log('Magic bytes:', magicBytes);
      
      // Check for common image formats
      const isJPEG = magicBytes[0] === 0xFF && magicBytes[1] === 0xD8;
      const isPNG = magicBytes[0] === 0x89 && magicBytes[1] === 0x50 && magicBytes[2] === 0x4E && magicBytes[3] === 0x47;
      
      console.log('Is JPEG:', isJPEG);
      console.log('Is PNG:', isPNG);
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Supabase image test completed',
      status: response.status,
      contentType: response.headers.get('content-type'),
      size: buffer.length,
      isJPEG: buffer.length > 2 && buffer[0] === 0xFF && buffer[1] === 0xD8,
      isPNG: buffer.length > 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47
    });
  } catch (err: any) {
    console.error('Supabase image test error:', err);
    return new NextResponse('Test failed: ' + (err.message || String(err)), { status: 500 });
  }
}