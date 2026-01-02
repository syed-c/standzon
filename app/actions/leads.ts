'use server';

import { createQuoteRequest, updateQuoteRequest } from '@/lib/server/db/leads';
import { createServerClient } from '@/lib/server/supabase';
import { revalidateTag } from 'next/cache';

export async function submitLeadAction(leadData: any) {
  try {
    console.log("📥 Lead submission action received:", leadData);

    // Validate required fields
    if (!leadData?.companyName || !leadData?.contactEmail || !leadData?.contactPerson) {
      return {
        success: false,
        error: "Missing required fields: companyName, contactEmail, contactPerson",
      };
    }

    // Set default values
    const leadToInsert = {
      company_name: leadData.companyName,
      contact_person: leadData.contactPerson,
      contact_email: leadData.contactEmail,
      contact_phone: leadData.contactPhone || null,
      trade_show: leadData.tradeShow || null,
      trade_show_slug: leadData.tradeShowSlug || null,
      stand_size: leadData.standSize || null,
      budget: leadData.budget || null,
      timeline: leadData.timeline || null,
      requirements: leadData.requirements || null,
      special_requests: leadData.specialRequests || null,
      city_name: leadData.cityName || null,
      country_name: leadData.countryName || null,
      venue: leadData.venue || null,
      status: leadData.status || "Open",
      priority: leadData.priority || "Standard",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const lead = await createQuoteRequest(leadToInsert);
    const leadId = lead.id;

    const supabase = createServerClient();
    
    // Fetch all builders for matching
    const { data: allBuilders, error: buildersError } = await supabase
      .from('builder_profiles')
      .select(`
        *,
        builder_service_locations!left(
          id,
          city,
          country,
          country_code,
          is_headquarters
        )
      `)
      .order('created_at', { ascending: false });

    if (buildersError) {
       console.error("❌ Failed to fetch builders for matching:", buildersError);
    }

    // Qualification logic
    const qualifiedBuilders = (allBuilders || []).filter((builder: any) => {
      if (!leadData.cityName && !leadData.countryName) {
        return true;
      }
      const builderCity = builder.headquarters_city?.toLowerCase() || "";
      const builderCountry = builder.headquarters_country?.toLowerCase() || "";
      const leadCity = leadData.cityName?.toLowerCase() || "";
      const leadCountry = leadData.countryName?.toLowerCase() || "";

      const locationMatch = builderCity === leadCity || builderCountry === leadCountry;

      let serviceLocationMatch = false;
      if (builder.builder_service_locations && Array.isArray(builder.builder_service_locations)) {
        serviceLocationMatch = builder.builder_service_locations.some(
          (loc: any) =>
            loc.city?.toLowerCase() === leadCity ||
            loc.country?.toLowerCase() === leadCountry
        );
      }
      return locationMatch || serviceLocationMatch;
    });

    const buildersWithCredits = qualifiedBuilders.filter((builder: any) => {
      const hasCredits = builder.premium_member === true;
      const isActive = builder.is_active !== false;
      return hasCredits && isActive;
    });

    // Update lead with matched builders
    await updateQuoteRequest(leadId, {
      matched_builders: buildersWithCredits.map((b: any) => b.id),
      updated_at: new Date().toISOString(),
    });

    revalidateTag('leads');

    return {
      success: true,
      message: `Lead submitted successfully. ${buildersWithCredits.length} qualified builders were notified.`,
      data: {
        leadId,
        matchingBuilders: qualifiedBuilders.length,
        notificationsSent: buildersWithCredits.length,
      },
    };
  } catch (error) {
    console.error("❌ Lead submission action error:", error);
    return {
      success: false,
      error: "Internal server error during lead submission",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
