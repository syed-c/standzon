import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== KNOWN IMAGE TEST ===');
    
    // Return a known good 1x1 transparent PNG
    const knownGoodImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    const buffer = Buffer.from(knownGoodImage, 'base64');
    
    console.log('Known good image size:', buffer.length);
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err: any) {
    console.error('Known image test error:', err);
    return new NextResponse('Test failed: ' + (err.message || String(err)), { status: 500 });
  }
}