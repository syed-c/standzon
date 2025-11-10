import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    console.log('=== SIMPLE PROXY CALLED ===');
    console.log('Request URL:', request.url);
    
    // Parse the URL to get the path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').slice(3); // Remove /api/simple-proxy/
    console.log('Path parts:', pathParts);
    
    if (pathParts.length === 0) {
      return new NextResponse('Path is required', { status: 400 });
    }
    
    // Reconstruct the Supabase URL
    const filePath = pathParts.join('/');
    const supabaseUrl = `https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/${filePath}`;
    console.log('Supabase URL:', supabaseUrl);
    
    // Simple fetch
    const response = await fetch(supabaseUrl);
    console.log('Fetch status:', response.status);
    
    if (!response.ok) {
      return new NextResponse(`Failed to fetch: ${response.status}`, { status: response.status });
    }
    
    // Get the data
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    
    console.log('Returning image, size:', buffer.length, 'type:', contentType);
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err: any) {
    console.error('Simple proxy error:', err);
    return new NextResponse('Internal error: ' + (err.message || String(err)), { status: 500 });
  }
}