import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== EXTERNAL REQUEST TEST ===');
    
    // Test a simple external request
    const testUrl = 'https://httpbin.org/status/200';
    console.log('Testing external URL:', testUrl);
    
    const response = await fetch(testUrl);
    console.log('External request status:', response.status);
    
    return NextResponse.json({ 
      success: true,
      message: 'External request test',
      status: response.status
    });
  } catch (err: any) {
    console.error('External request error:', err);
    return new NextResponse('Test failed: ' + (err.message || String(err)), { status: 500 });
  }
}