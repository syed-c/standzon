import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdminClient();
    
    if (!supabaseAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Supabase admin client not initialized'
      }, { status: 500 });
    }

    // Get pending builder registrations
    const { data: pendingBuilders, error } = await supabaseAdmin
      .from('builder_profiles')
      .select('id, company_name, primary_email, contact_person, created_at, claim_status')
      .in('claim_status', ['pending', 'submitted', 'under_review'])
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching pending builders:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    // Format the data for the dashboard
    const partnerRequests = (pendingBuilders || []).map(builder => {
      const initials = builder.company_name
        ? builder.company_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
        : '??';
      
      const timeAgo = getTimeAgo(builder.created_at);
      
      return {
        id: builder.id,
        initials,
        name: builder.company_name,
        email: builder.primary_email,
        contactPerson: builder.contact_person,
        status: `Pending Review • ${timeAgo}`,
        claimStatus: builder.claim_status
      };
    });

    return NextResponse.json({
      success: true,
      data: partnerRequests
    });

  } catch (error) {
    console.error('Error fetching partner requests:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return `${Math.floor(seconds / 604800)}w`;
}
