import { NextRequest, NextResponse } from 'next/server';

// This is a test API route to demonstrate offline handling
export async function GET() {
  return NextResponse.json({
    message: 'This API response will be cached for offline access',
    timestamp: new Date().toISOString(),
    data: {
      example: 'data',
      status: 'success'
    }
  });
}

// This POST route can be used to test background sync
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulate processing that might fail when offline
    if (!navigator.onLine) {
      return NextResponse.json(
        { error: 'Offline: Request queued for later processing' },
        { status: 503 }
      );
    }
    
    // Process the request
    console.log('Processing request:', body);
    
    return NextResponse.json({
      message: 'Request processed successfully',
      data: body
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}