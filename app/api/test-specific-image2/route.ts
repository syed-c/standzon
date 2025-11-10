import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== SPECIFIC IMAGE TEST ===');
    
    // Use the exact filename we know exists from the Supabase File Check
    const bucket = 'gallery';
    const filePath = 'countries/germany/2025-11-10/1762767272165-1p60c0uhnnw.jpg';
    const supabaseUrl = `https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/${bucket}/${filePath}`;
    
    console.log('Testing known existing image:', supabaseUrl);
    
    // Try to fetch with different approaches
    console.log('Approach 1: Basic fetch');
    try {
      const response1 = await fetch(supabaseUrl);
      console.log('Approach 1 status:', response1.status);
      if (response1.ok) {
        const buffer = await response1.arrayBuffer();
        console.log('Approach 1 successful, size:', buffer.byteLength);
        return NextResponse.json({ 
          success: true,
          message: 'Approach 1 successful',
          status: response1.status,
          size: buffer.byteLength
        });
      }
    } catch (err1: any) {
      console.error('Approach 1 failed:', err1.message);
    }
    
    console.log('Approach 2: Fetch with headers');
    try {
      const response2 = await fetch(supabaseUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      console.log('Approach 2 status:', response2.status);
      if (response2.ok) {
        const buffer = await response2.arrayBuffer();
        console.log('Approach 2 successful, size:', buffer.byteLength);
        return NextResponse.json({ 
          success: true,
          message: 'Approach 2 successful',
          status: response2.status,
          size: buffer.byteLength
        });
      }
    } catch (err2: any) {
      console.error('Approach 2 failed:', err2.message);
    }
    
    return NextResponse.json({ 
      success: false,
      message: 'All approaches failed'
    });
  } catch (err: any) {
    console.error('Specific image test error:', err);
    return new NextResponse('Test failed: ' + (err.message || String(err)), { status: 500 });
  }
}