import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test the specific image path that's not working
    const proxyPath = '/api/media/gallery/countries/germany/2025-11-10/1762766352270-ksbpcilklof.jpg';
    
    // Try to fetch through our proxy
    const response = await fetch(`http://localhost:3002${proxyPath}`);
    
    return NextResponse.json({ 
      success: true,
      message: 'Specific image proxy test',
      proxyPath: proxyPath,
      proxyUrl: `http://localhost:3002${proxyPath}`,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      ok: response.ok
    });
  } catch (err) {
    console.error('Test error:', err);
    return new NextResponse('Test failed: ' + (err as Error).message, { status: 500 });
  }
}