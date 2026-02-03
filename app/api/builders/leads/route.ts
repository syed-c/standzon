import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/supabase/database";

const dbService = new DatabaseService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const builderId = searchParams.get('builderId');
    const builderEmail = searchParams.get('builderEmail');
    
    if (!builderId && !builderEmail) {
      return NextResponse.json(
        { success: false, error: 'Builder ID or email is required' },
        { status: 400 }
      );
    }
    
    console.log('🔍 Fetching leads for builder:', { builderId, builderEmail });
    
    // Get builder profile to find their service locations
    let builderProfile: any = null;
    
    if (builderId) {
      const { data, error } = await dbService['client']
        .from('builder_profiles')
        .select(`
          *,
          service_locations:builder_service_locations(
            city,
            country,
            country_code,
            is_headquarters
          )
        `)
        .eq('id', builderId)
        .single();
        
      if (!error && data) {
        builderProfile = data;
      }
    }
    
    if (!builderProfile && builderEmail) {
      const { data, error } = await dbService['client']
        .from('builder_profiles')
        .select(`
          *,
          service_locations:builder_service_locations(
            city,
            country,
            country_code,
            is_headquarters
          )
        `)
        .eq('primary_email', builderEmail)
        .single();
        
      if (!error && data) {
        builderProfile = data;
      }
    }
    
    if (!builderProfile) {
      return NextResponse.json(
        { success: false, error: 'Builder profile not found' },
        { status: 404 }
      );
    }
    
    console.log('👤 Builder profile found:', {
      id: builderProfile.id,
      name: builderProfile.company_name,
      hqCity: builderProfile.headquarters_city,
      hqCountry: builderProfile.headquarters_country,
      serviceLocations: builderProfile.service_locations
    });
    
    // Fetch all leads from Supabase
    const { data: allLeads, error: leadsError } = await dbService['client']
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (leadsError) {
      throw leadsError;
    }
    
    console.log(`📊 Total leads in database: ${allLeads?.length || 0}`);
    
    if (!allLeads || allLeads.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          leads: [],
          total: 0,
          targeted: 0,
          locationMatched: 0
        }
      });
    }
    
    // Filter leads relevant to this builder
    const relevantLeads = allLeads.filter((lead: any) => {
      // 1. Check if lead was targeted to this specific builder
      if (lead.targeted_builder_id === builderProfile.id) {
        console.log('✅ Found targeted lead:', lead.company_name);
        return true;
      }
      
      // 2. Check if it's a general inquiry matching builder's service locations
      if (lead.is_general_inquiry) {
        console.log('🔍 Checking general inquiry lead:', {
          leadCompany: lead.company_name,
          searchCity: lead.search_location_city,
          searchCountry: lead.search_location_country,
          builderHqCity: builderProfile.headquarters_city,
          builderHqCountry: builderProfile.headquarters_country,
          hasServiceLocations: !!builderProfile.service_locations
        });
        
        // Check if this is a country-only search (city = country)
        const isCountryOnlySearch = lead.search_location_city?.toLowerCase() === lead.search_location_country?.toLowerCase();
        
        // Check headquarters location match
        const hqCityMatch = lead.search_location_city?.toLowerCase() === builderProfile.headquarters_city?.toLowerCase();
        const hqCountryMatch = lead.search_location_country?.toLowerCase() === builderProfile.headquarters_country?.toLowerCase();
        
        console.log('🏢 HQ Match Check:', { hqCityMatch, hqCountryMatch, isCountryOnlySearch });
        
        if (hqCityMatch || hqCountryMatch) {
          console.log('✅ Found location-matched lead (HQ):', lead.company_name);
          return true;
        }
        
        // Check service locations (if stored in builder profile)
        if (builderProfile.service_locations && Array.isArray(builderProfile.service_locations)) {
          console.log('📍 Checking service locations:', builderProfile.service_locations);
          
          const serviceLocationMatch = builderProfile.service_locations.some((loc: any) => {
            const cityMatch = !isCountryOnlySearch && loc.city?.toLowerCase() === lead.search_location_city?.toLowerCase();
            const countryMatch = loc.country?.toLowerCase() === lead.search_location_country?.toLowerCase();
            
            console.log('📦 Service location check:', { 
              locCity: loc.city, 
              locCountry: loc.country,
              leadCity: lead.search_location_city,
              leadCountry: lead.search_location_country,
              isCountryOnlySearch,
              cityMatch, 
              countryMatch 
            });
            
            // For country-only searches, match if country matches
            if (isCountryOnlySearch) {
              return countryMatch;
            }
            
            // For city+country searches, match if city OR country matches
            return cityMatch || countryMatch;
          });
          
          if (serviceLocationMatch) {
            console.log('✅ Found service location-matched lead:', lead.company_name);
            return true;
          }
        }
      }
      
      return false;
    });
    
    console.log(`✅ Found ${relevantLeads.length} relevant leads for builder`);
    
    // Calculate statistics
    const stats = {
      total: relevantLeads.length,
      targeted: relevantLeads.filter((l: any) => l.targeted_builder_id === builderProfile.id).length,
      locationMatched: relevantLeads.filter((l: any) => l.is_general_inquiry).length,
      byStatus: {
        NEW: relevantLeads.filter((l: any) => l.status === 'NEW').length,
        ASSIGNED: relevantLeads.filter((l: any) => l.status === 'ASSIGNED').length,
        CONTACTED: relevantLeads.filter((l: any) => l.status === 'CONTACTED').length,
        QUOTED: relevantLeads.filter((l: any) => l.status === 'QUOTED').length,
      },
      byPriority: {
        HIGH: relevantLeads.filter((l: any) => l.priority === 'HIGH').length,
        URGENT: relevantLeads.filter((l: any) => l.priority === 'URGENT').length,
        MEDIUM: relevantLeads.filter((l: any) => l.priority === 'MEDIUM').length,
        LOW: relevantLeads.filter((l: any) => l.priority === 'LOW').length,
      }
    };
    
    return NextResponse.json({
      success: true,
      data: {
        leads: relevantLeads,
        stats,
        builderInfo: {
          id: builderProfile.id,
          name: builderProfile.company_name,
          headquarters: {
            city: builderProfile.headquarters_city,
            country: builderProfile.headquarters_country
          }
        }
      }
    });
    
  } catch (error: any) {
    console.error('❌ Error fetching builder leads:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch leads'
      },
      { status: 500 }
    );
  }
}
