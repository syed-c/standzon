import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  
  // Handle requests for missing main-app.js
  if (path.includes('main-app.js')) {
    console.log('Serving empty response for main-app.js request');
    return new NextResponse('', {
      status: 204, // No content
      headers: {
        'Content-Type': 'application/javascript',
      },
    });
  }
  
  // Handle requests for .well-known paths
  if (path.includes('.well-known')) {
    return new NextResponse('Not found', { status: 404 });
  }
  
  // For other static file requests, return 404
  return new NextResponse('Not found', { status: 404 });
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return new NextResponse('Method not allowed', { status: 405 });
}