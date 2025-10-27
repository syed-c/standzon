import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/supabase/database";

export async function GET(request: NextRequest) {
  console.log('🧪 Testing Supabase connection...');
  
  // Check environment variables
  const envCheck = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
  
  console.log('Environment variables check:', envCheck);
  
  // Try to create a test lead
  const dbService = new DatabaseService();
  
  const testLead = {
    company_name: 'API Test Company',
    contact_name: 'Test User',
    contact_email: 'test@example.com',
    contact_phone: '+1-555-TEST',
    trade_show_name: 'Test Show',
    city: 'Test City',
    country: 'Test Country',
    stand_size: 50,
    budget: '$10,000 - $25,000',
    timeline: '2-3 months',
    special_requests: 'This is a test lead from API endpoint',
    status: 'NEW',
    priority: 'MEDIUM',
    source: 'api_test',
    lead_score: 60,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  try {
    const result = await dbService.createLead(testLead);
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      envCheck,
      leadId: result?.id,
      result
    });
  } catch (error: any) {
    console.error('❌ Supabase test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      envCheck,
      details: {
        code: error.code,
        hint: error.hint,
        details: error.details
      }
    }, { status: 500 });
  }
}
