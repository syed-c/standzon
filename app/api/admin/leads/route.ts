import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/supabase/database";

const dbService = new DatabaseService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'with-context') {
      // Get leads with full context information
      const leads = await dbService.getLeads();
      
      // Enrich with context info
      const enrichedLeads = leads.map((lead: any, idx: number) => ({
        idx: idx + 1,
        ...lead,
        // Add computed fields for easy filtering
        lead_type: lead.is_general_inquiry ? 'General Inquiry' : 'Builder-Specific',
        has_builder_target: !!lead.targeted_builder_id,
        has_location_context: !!(lead.search_location_city || lead.search_location_country),
        event_vs_search_match: (
          lead.city === lead.search_location_city && 
          lead.country === lead.search_location_country
        ),
      }));
      
      return NextResponse.json({
        success: true,
        count: enrichedLeads.length,
        data: enrichedLeads,
        summary: {
          total: enrichedLeads.length,
          general_inquiries: enrichedLeads.filter((l: any) => l.is_general_inquiry).length,
          builder_specific: enrichedLeads.filter((l: any) => !l.is_general_inquiry).length,
          with_location_context: enrichedLeads.filter((l: any) => l.has_location_context).length,
          with_design_files: enrichedLeads.filter((l: any) => l.has_design_files).length,
        }
      });
    }
    
    // Default: return all leads
    const leads = await dbService.getLeads();
    
    return NextResponse.json({
      success: true,
      count: leads.length,
      data: leads
    });
    
  } catch (error: any) {
    console.error('❌ Error fetching leads:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}
