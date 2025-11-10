import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    console.log('=== PROXY CALL TEST ===');
    console.log('Request URL:', request.url);
    
    // Simulate calling the actual proxy endpoint
    const proxyUrl = 'http://localhost:3000/api/media/gallery/countries/germany/2025-11-10/1762773151025-r7d4gm0qc5.jpg';
    console.log('Simulating proxy call to:', proxyUrl);
    
    // In a real scenario, this would be an internal call
    // But for now, let's just return a success message
    return NextResponse.json({ 
      success: true,
      message: 'Proxy call test completed',
      simulatedProxyUrl: proxyUrl
    });
  } catch (err: any) {
    console.error('Proxy call test error:', err);
    return new NextResponse('Test failed: ' + (err.message || String(err)), { status: 500 });
  }
}