import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test with a known public image from Supabase
    const testUrl = 'https://elipizumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/test-image.jpg';
    
    // Return both the direct URL and the proxy path for testing
    return NextResponse.json({ 
      message: 'Proxy route is working', 
      testUrl: testUrl,
      proxyPath: '/api/media/gallery/test-image.jpg',
      description: 'To test the proxy, use the proxyPath URL which will fetch the image from the testUrl'
    });
  } catch (err) {
    console.error('Test error:', err);
    return new NextResponse('Test failed', { status: 500 });
  }
}