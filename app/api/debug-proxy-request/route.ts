import { NextResponse } from 'next/server';

// This is a debug endpoint to understand what's happening with proxy requests
export async function GET(request: Request) {
  try {
    console.log('=== DEBUG PROXY REQUEST ===');
    console.log('Request URL:', request.url);
    console.log('Request method:', request.method);
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    // Parse the URL to see what path is being requested
    const url = new URL(request.url);
    console.log('Requested path:', url.pathname);
    
    // Extract the media path
    const pathParts = url.pathname.split('/').slice(3); // Remove /api/debug-proxy-request/
    console.log('Path parts:', pathParts);
    
    return NextResponse.json({ 
      success: true,
      message: 'Debug proxy request completed',
      requestUrl: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      path: url.pathname,
      pathParts: pathParts
    });
  } catch (err: any) {
    console.error('Debug proxy request error:', err);
    return new NextResponse('Debug failed: ' + (err.message || String(err)), { status: 500 });
  }
}