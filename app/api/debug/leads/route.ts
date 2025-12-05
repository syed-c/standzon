import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/supabase/database";

const dbService = new DatabaseService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const builderId = searchParams.get('builderId') || '32a91e7f-6781-41f0-accf-007aa54a111c';
    
    console.log('🔍 DEBUG: Checking leads for builder:', builderId);
    
    // 1. Check if builder exists
    const { data: builderData, error: builderError } = await dbService['client']
      .from('builder_profiles')
      .select('*')
      .eq('id', builderId)
      .single();
    
    if (builderError || !builderData) {
      return NextResponse.json({
        success: false,
        step: 'builder_lookup',
        error: builderError?.message || 'Builder not found',
        builderId,
        suggestion: 'Run this SQL to find correct ID: SELECT id, company_name FROM builder_profiles WHERE company_name LIKE \'%Zon%\' LIMIT 5;'
      });
    }
    
    console.log('✅ Builder found:', builderData.company_name);
    
    // 2. Check all leads
    const { data: allLeads, error: leadsError } = await dbService['client']
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (leadsError) {
      return NextResponse.json({
        success: false,
        step: 'leads_fetch',
        error: leadsError.message
      });
    }
    
    console.log(`📊 Total leads in database: ${allLeads?.length || 0}`);
    
    // 3. Check targeted leads
    const targetedLeads = allLeads?.filter((lead: any) => 
      lead.targeted_builder_id === builderId
    ) || [];
    
    // 4. Check location-matched leads
    const locationLeads = allLeads?.filter((lead: any) => 
      lead.is_general_inquiry === true &&
      (lead.search_location_city?.toLowerCase() === builderData.headquarters_city?.toLowerCase() ||
       lead.search_location_country?.toLowerCase() === builderData.headquarters_country?.toLowerCase())
    ) || [];
    
    // 5. Debug info for each lead
    const leadDebug = allLeads?.map((lead: any) => ({
      id: lead.id.substring(0, 8) + '...',
      company: lead.company_name,
      targeted_to: lead.targeted_builder_id?.substring(0, 8) + '...' || 'none',
      matches_this_builder: lead.targeted_builder_id === builderId,
      is_general: lead.is_general_inquiry,
      search_city: lead.search_location_city,
      search_country: lead.search_location_country,
      created: new Date(lead.created_at).toLocaleString()
    })) || [];
    
    return NextResponse.json({
      success: true,
      builder: {
        id: builderData.id,
        name: builderData.company_name,
        hq_city: builderData.headquarters_city,
        hq_country: builderData.headquarters_country
      },
      summary: {
        total_leads_in_db: allLeads?.length || 0,
        targeted_to_this_builder: targetedLeads.length,
        location_matched: locationLeads.length,
        total_relevant: targetedLeads.length + locationLeads.length
      },
      targeted_leads: targetedLeads.map((l: any) => ({
        id: l.id,
        company: l.company_name,
        email: l.contact_email,
        city: l.search_location_city,
        country: l.search_location_country,
        created_at: l.created_at
      })),
      location_leads: locationLeads.map((l: any) => ({
        id: l.id,
        company: l.company_name,
        email: l.contact_email,
        city: l.search_location_city,
        country: l.search_location_country,
        created_at: l.created_at
      })),
      all_leads_debug: leadDebug
    });
    
  } catch (error: any) {
    console.error('❌ Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
