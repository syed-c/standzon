import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { path } = params;
    
    if (!path || !path.length) {
      return new NextResponse('Path is required', { status: 400 });
    }

    // Construct the Supabase Storage URL
    const supabaseUrl = `https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/${path.join('/')}`;
    
    // Fetch the image from Supabase
    const response = await fetch(supabaseUrl);
    
    // If the response is not ok, return 404
    if (!response.ok) {
      return new NextResponse('Not found', { status: 404 });
    }
    
    // Convert ArrayBuffer to Buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Get content type from response headers
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    
    // Create response with proper headers
    const nextResponse = new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
    
    return nextResponse;
  } catch (err) {
    console.error('Proxy error:', err);
    return new NextResponse('Internal server error', { status: 500 });
  }
}