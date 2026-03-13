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

    // Get recent builder registrations
    const recentBuilders = await supabaseAdmin
      .from('builder_profiles')
      .select('id, company_name, claimed, claim_status, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    // Get recent leads
    const recentLeads = await supabaseAdmin
      .from('leads')
      .select('id, company_name, contact_name, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    // Get recent quote requests
    const recentQuoteRequests = await supabaseAdmin
      .from('quote_requests')
      .select('id, company_name, contact_name, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    // Build audit trail from real data
    const auditTrail: Array<{
      icon: string;
      iconBg: string;
      title: string;
      description: string;
      time: string;
    }> = [];

    // Process recent builders
    if (recentBuilders.data) {
      for (const builder of recentBuilders.data) {
        const timeAgo = getTimeAgo(builder.created_at);
        if (builder.claim_status === 'pending') {
          auditTrail.push({
            icon: "pending_actions",
            iconBg: "bg-amber-100 text-amber-600",
            title: "New Builder Registration:",
            description: `"${builder.company_name}" has submitted a registration request.`,
            time: `${timeAgo} • Builder Portal`
          });
        } else if (builder.claimed && builder.claim_status === 'approved') {
          auditTrail.push({
            icon: "verified",
            iconBg: "bg-emerald-100 text-emerald-600",
            title: "Builder Verified:",
            description: `"${builder.company_name}" has been verified and claim approved.`,
            time: `${timeAgo} • Admin`
          });
        }
      }
    }

    // Process recent leads
    if (recentLeads.data) {
      for (const lead of recentLeads.data) {
        const timeAgo = getTimeAgo(lead.created_at);
        auditTrail.push({
          icon: "lead",
          iconBg: "bg-[#1e3886]/10 text-[#1e3886]",
          title: "New Lead Received:",
          description: `${lead.company_name} - ${lead.status} inquiry from ${lead.contact_name}.`,
          time: `${timeAgo} • Website`
        });
      }
    }

    // Process recent quote requests
    if (recentQuoteRequests.data) {
      for (const quote of recentQuoteRequests.data) {
        const timeAgo = getTimeAgo(quote.created_at);
        auditTrail.push({
          icon: "request_quote",
          iconBg: "bg-blue-100 text-blue-600",
          title: "Quote Request:",
          description: `New quote request from ${quote.company_name} - ${quote.status}.`,
          time: `${timeAgo} • Quote System`
        });
      }
    }

    // Sort by time (most recent first) and take top 10
    auditTrail.sort((a, b) => {
      const timeA = parseTimeAgo(a.time);
      const timeB = parseTimeAgo(b.time);
      return timeA - timeB;
    });

    return NextResponse.json({
      success: true,
      data: auditTrail.slice(0, 10)
    });

  } catch (error) {
    console.error('Error fetching audit trail:', error);
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
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return `${Math.floor(seconds / 604800)} weeks ago`;
}

function parseTimeAgo(timeString: string): number {
  const match = timeString.match(/(\d+)\s*(minute|hour|day|week)/i);
  if (!match) return 999999;
  
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  
  switch (unit) {
    case 'minute': return value * 60;
    case 'hour': return value * 3600;
    case 'day': return value * 86400;
    case 'week': return value * 604800;
    default: return 999999;
  }
}
