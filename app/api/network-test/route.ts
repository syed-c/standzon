import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test basic network connectivity to a simple endpoint
    const testUrl = 'https://httpbin.org/get';
    
    try {
      console.log('Testing network connectivity to:', testUrl);
      const response = await fetch(testUrl, { 
        method: 'GET'
      });
      
      return NextResponse.json({ 
        success: true,
        message: 'Network connectivity test completed',
        url: testUrl,
        status: response.status,
        ok: response.ok
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    } catch (error: any) {
      console.error('Network test error:', error.message);
      return NextResponse.json({ 
        success: false,
        message: 'Network connectivity test failed',
        url: testUrl,
        error: error.message || String(error)
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }
  } catch (err: any) {
    console.error('Network test error:', err);
    return new NextResponse('Network test failed: ' + (err.message || err), { 
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