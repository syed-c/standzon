import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== IMAGE RESPONSE TEST ===');
    
    // Test the exact same image URL that's failing
    const testImageUrl = 'https://standzon.vercel.app/api/media/gallery/countries/germany/2025-11-10/1762771365593-looafqzp4w.jpg';
    
    console.log('Testing image URL:', testImageUrl);
    
    // Try to fetch the image through our own proxy
    const response = await fetch(testImageUrl);
    
    console.log('Proxy response status:', response.status);
    console.log('Proxy response headers:', Object.fromEntries(response.headers.entries()));
    
    // Get the content
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('Response size:', buffer.length);
    console.log('First 10 bytes:', buffer.slice(0, 10));
    
    // Check if it's a valid image
    const contentType = response.headers.get('content-type');
    console.log('Content type:', contentType);
    
    // Check if it's the placeholder
    if (buffer.length === 70) { // Our placeholder is 70 bytes
      console.log('This is likely the placeholder image');
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Image response test completed',
      status: response.status,
      contentType: contentType,
      size: buffer.length,
      isPlaceholder: buffer.length === 70
    });
  } catch (err: any) {
    console.error('Image response test error:', err);
    return new NextResponse('Test failed: ' + (err.message || String(err)), { status: 500 });
  }
}