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

    // Fetch countries and cities from page_contents table
    // Each row has a content JSONB with a 'type' field: 'country' or 'city'
    const pageContentsResult = await supabaseAdmin
      .from('page_contents')
      .select('id, content');

    // Parse countries and cities from page_contents using the 'type' field in content JSONB
    let totalCountries = 0;
    let totalCities = 0;

    if (pageContentsResult.data) {
      for (const page of pageContentsResult.data) {
        const content = page.content;
        
        // Check if content has a 'type' field
        if (content && typeof content === 'object') {
          const type = content.type;
          
          if (type === 'country') {
            totalCountries++;
          } else if (type === 'city') {
            totalCities++;
          }
        }
      }
    }

    // Fetch other data in parallel
    const [
      buildersResult,
      leadsResult,
      quoteRequestsResult,
      quotesResult,
      usersResult,
      exhibitionsResult
    ] = await Promise.all([
      supabaseAdmin.from('builder_profiles').select('id, verified, claimed, claim_status, premium_member, rating, created_at', { count: 'exact', head: true }),
      supabaseAdmin.from('leads').select('id, status, created_at', { count: 'exact', head: true }),
      supabaseAdmin.from('quote_requests').select('id, status, created_at', { count: 'exact', head: true }),
      supabaseAdmin.from('quotes').select('id, status, created_at', { count: 'exact', head: true }),
      supabaseAdmin.from('users').select('id, role, created_at', { count: 'exact', head: true }),
      supabaseAdmin.from('exhibitions').select('id, active, created_at', { count: 'exact', head: true })
    ]);

    // Get counts
    const totalBuilders = buildersResult.count || 0;
    const totalLeads = leadsResult.count || 0;
    const totalQuoteRequests = quoteRequestsResult.count || 0;
    const totalQuotes = quotesResult.count || 0;
    const totalUsers = usersResult.count || 0;
    const totalExhibitions = exhibitionsResult.count || 0;

    // Calculate rates
    const quoteMatchRate = totalQuoteRequests > 0 
      ? Math.round((totalQuotes / totalQuoteRequests) * 100 * 10) / 10 
      : 0;

    // Get pending builder registrations (builders with 'pending' claim status)
    const pendingBuildersResult = await supabaseAdmin
      .from('builder_profiles')
      .select('id, company_name, created_at', { count: 'exact', head: true })
      .eq('claim_status', 'pending');

    const pendingPartnerRequests = pendingBuildersResult.count || 0;

    // Get recent leads for activity calculation
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const recentLeadsResult = await supabaseAdmin
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo);

    const recentLeads = recentLeadsResult.count || 0;

    // Calculate percentage changes (comparing to previous week - simplified for now)
    const leadsChange = recentLeads > 0 ? `+${Math.round((recentLeads / Math.max(totalLeads, 1)) * 100)}%` : '0%';

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalLeads,
          totalBuilders,
          quoteMatchRate: `${quoteMatchRate}%`,
          totalCountries,
          totalCities,
          totalUsers,
          totalExhibitions,
          pendingPartnerRequests,
          leadsChange,
          // Calculate active vs total builders ratio
          activeBuildersRatio: totalBuilders > 0 ? Math.round((totalBuilders / (totalBuilders + pendingPartnerRequests)) * 100) : 0
        },
        // Additional data for the dashboard
        countries: totalCountries,
        cities: totalCities,
        exhibitions: totalExhibitions,
        quoteRequests: totalQuoteRequests,
        quotes: totalQuotes,
        pendingBuilders: pendingPartnerRequests
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
