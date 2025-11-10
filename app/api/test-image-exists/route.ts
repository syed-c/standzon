import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test if the specific image exists in Supabase
    const testImageUrl = 'https://elipizumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/countries/germany/2025-11-10/1762767272165-1p60c0uhnnw.jpg';
    
    // Try to fetch the image directly from Supabase
    const response = await fetch(testImageUrl, { method: 'HEAD' });
    
    return NextResponse.json({ 
      success: true,
      message: 'Image existence test',
      imageUrl: testImageUrl,
      exists: response.ok,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (err: any) {
    console.error('Test error:', err);
    return new NextResponse('Test failed: ' + (err.message || err), { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}