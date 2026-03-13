import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/client";

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdminClient();
    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });
    }
    
    const body = await request.json();
    const { leadIds, status } = body;
    
    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ success: false, error: 'No leads provided' }, { status: 400 });
    }
    
    const { data, error } = await supabaseAdmin
      .from('leads')
      .update({ status })
      .in('id', leadIds)
      .select();
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, count: data?.length || 0 });
  } catch (error: any) {
    console.error('❌ Error bulk updating leads:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
