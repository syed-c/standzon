import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== SUPABASE CONNECTIVITY TEST ===');
    
    // Test basic connectivity to Supabase domain
    const supabaseDomain = 'https://elipzumpfnzmzifrcnl.supabase.co';
    
    console.log('Testing Supabase domain connectivity:', supabaseDomain);
    
    try {
      // Try a simple HEAD request to the domain
      const domainResponse = await fetch(supabaseDomain, { method: 'HEAD' });
      console.log('Domain HEAD request - Status:', domainResponse.status);
      
      // Try getting the root
      const rootResponse = await fetch(supabaseDomain);
      console.log('Domain GET request - Status:', rootResponse.status);
      
      return NextResponse.json({ 
        success: true,
        message: 'Supabase domain connectivity test completed',
        domainHeadStatus: domainResponse.status,
        domainGetStatus: rootResponse.status
      });
    } catch (domainError: any) {
      console.error('Supabase domain connectivity failed:', domainError.message);
      return NextResponse.json({ 
        success: false,
        message: 'Supabase domain connectivity failed',
        error: domainError.message || String(domainError)
      });
    }
  } catch (err: any) {
    console.error('Supabase connectivity test error:', err);
    return new NextResponse('Test failed: ' + (err.message || String(err)), { status: 500 });
  }
}