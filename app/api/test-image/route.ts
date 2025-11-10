import { NextResponse } from 'next/server';

// Test function to verify the proxy is working
async function testProxy() {
  try {
    // Test with a known public image from Supabase
    const testImageUrl = 'https://elipizumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/test-image.jpg';
    
    // Try to fetch the image through our proxy
    const proxyUrl = '/api/media/gallery/test-image.jpg';
    
    return {
      success: true,
      message: 'Proxy test endpoint',
      testImageUrl,
      proxyUrl,
      note: 'To test actual image proxying, try accessing the proxyUrl directly in your browser'
    };
  } catch (err) {
    console.error('Test error:', err);
    return {
      success: false,
      error: 'Test failed: ' + (err as Error).message
    };
  }
}

export async function GET() {
  try {
    const result = await testProxy();
    return NextResponse.json(result);
  } catch (err) {
    console.error('Test endpoint error:', err);
    return new NextResponse('Internal server error', { status: 500 });
  }
}