import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing Supabase insert directly...');
    
    const { getServerSupabase } = await import('@/lib/supabase');
    const sb = getServerSupabase();
    
    if (!sb) {
      return NextResponse.json({
        success: false,
        error: 'Supabase client not available'
      });
    }
    
    // Test insert with minimal data
    const testBuilder = {
      id: 'test_builder_' + Date.now(),
      company_name: 'Test Direct Insert',
      slug: 'test-direct-insert',
      primary_email: 'test-direct@example.com',
      phone: '1234567890',
      contact_person: 'Test Person',
      company_description: 'Test description',
      headquarters_city: 'Test City',
      headquarters_country: 'Test Country',
      verified: false,
      claimed: true,
      claim_status: 'verified',
      premium_member: false,
      created_at: new Date().toISOString(),
      source: 'test_direct'
    };
    
    console.log('📝 Inserting test builder:', testBuilder);
    
    const { data, error } = await sb
      .from('builder_profiles')
      .insert(testBuilder)
      .select();
    
    if (error) {
      console.error('❌ Supabase insert error:', error);
      return NextResponse.json({
        success: false,
        error: 'Supabase insert failed',
        details: error
      });
    }
    
    console.log('✅ Supabase insert successful:', data);
    
    return NextResponse.json({
      success: true,
      message: 'Direct Supabase insert successful',
      data: data
    });
    
  } catch (error) {
    console.error('❌ Test insert error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test insert failed',
      details: error
    }, { status: 500 });
  }
}
