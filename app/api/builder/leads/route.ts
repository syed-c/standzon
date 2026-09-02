import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabase as anonSupabase } from '@/lib/supabase/client';

const supabase = supabaseAdmin || anonSupabase;

/**
 * Leads visible to a builder = anything assigned to them (lead_assignments),
 * plus inquiries sent to their profile directly, plus leads they have accepted.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const builderId = searchParams.get('builderId');
    if (!builderId) {
      return NextResponse.json({ success: false, error: 'Builder ID is required' }, { status: 400 });
    }

    const byId = new Map<string, any>();

    // 1. Assigned via matching
    const { data: assignments } = await supabase
      .from('lead_assignments')
      .select('status, assigned_at, leads(*)')
      .eq('builder_id', builderId);
    for (const a of assignments || []) {
      const l = (a as any).leads;
      if (l?.id) byId.set(l.id, { ...l, assignmentStatus: (a as any).status, assignedAt: (a as any).assigned_at });
    }

    // 2. Sent to this builder's profile directly / accepted by this builder
    const { data: direct } = await supabase
      .from('leads')
      .select('*')
      .or(`targeted_builder_id.eq.${builderId},accepted_by_builder_id.eq.${builderId}`)
      .order('created_at', { ascending: false });
    for (const l of direct || []) if (l?.id && !byId.has(l.id)) byId.set(l.id, l);

    const leads = Array.from(byId.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
    console.error('Error in builder leads API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { leadId, status } = await request.json();
    if (!leadId || !status) {
      return NextResponse.json({ success: false, error: 'Lead ID and status are required' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('leads')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', leadId)
      .select()
      .single();
    if (error) {
      console.error('Error updating lead:', error);
      return NextResponse.json({ success: false, error: 'Failed to update lead' }, { status: 500 });
    }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in leads update API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
