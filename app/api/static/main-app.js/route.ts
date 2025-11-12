import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Serve an empty JavaScript file for main-app.js requests
  // This prevents 404 errors for missing chunks
  return new NextResponse('', {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

export async function POST(request: NextRequest) {
  return new NextResponse('Method not allowed', { status: 405 });
}