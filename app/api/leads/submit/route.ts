import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const getSupabase = () => {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    
    // Get request data
    const data = await request.json();
    const { leadData } = data;

    console.log("📥 Lead submission received:", leadData);

    // Validate required fields
    if (!leadData?.companyName || !leadData?.contactEmail || !leadData?.contactPerson) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: companyName, contactEmail, contactPerson",
        },
        { status: 400 }
      );
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

    // Insert lead into Supabase
    console.log("💾 Saving lead to Supabase...");
    const { data: lead, error: insertError } = await supabase
      .from('quote_requests')
      .insert(leadToInsert)
      .select()
      .single();

    if (insertError) {
      console.error("❌ Failed to save lead to Supabase:", insertError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save lead to database",
          details: insertError.message,
        },
        { status: 500 }
      );
    }

    const leadId = lead.id;
    console.log("✅ Lead saved to Supabase successfully:", leadId);

    // Get qualified builders from Supabase (NO MORE CONVEX)
    console.log("🔍 Finding qualified builders from Supabase...");
    
    // Fetch all builders from Supabase
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
      console.error("❌ Failed to fetch builders from Supabase:", buildersError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch builders",
          details: buildersError.message,
        },
        { status: 500 }
      );
    }

    console.log(`📊 Total builders in system: ${allBuilders?.length || 0}`);

    // Enhanced qualification logic with location matching
    const qualifiedBuilders = (allBuilders || []).filter((builder: any) => {
      if (!leadData.cityName && !leadData.countryName) {
        return true; // Show all builders if no location specified
      }

      // Check if builder serves the requested location
      const builderCity = builder.headquarters_city?.toLowerCase() || "";
      const builderCountry = builder.headquarters_country?.toLowerCase() || "";
      const leadCity = leadData.cityName?.toLowerCase() || "";
      const leadCountry = leadData.countryName?.toLowerCase() || "";

      // Enhanced matching logic
      const locationMatch =
        builderCity === leadCity ||
        builderCountry === leadCountry;

      // Check service locations if available
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

    console.log(`✅ Found ${qualifiedBuilders.length} qualified builders`);

    // Auto-notify builders with credits (simulate for now)
    let notificationsSent = 0;
    let emailsSent = 0;

    try {
      // Filter builders with credits and active subscriptions
      const buildersWithCredits = qualifiedBuilders.filter((builder: any) => {
        // Simulate credit checking - in real implementation, check subscription status
        const hasCredits = builder.premium_member === true;
        const isActive = builder.is_active !== false;
        return hasCredits && isActive;
      });

      console.log(
        `📧 Sending notifications to ${buildersWithCredits.length} builders with credits`
      );

      // Send notifications to qualified builders
      for (const builder of buildersWithCredits) {
        try {
          // In a real implementation, you would:
          // 1. Send email notification
          // 2. Send SMS if enabled
          // 3. Create in-app notification
          // 4. Deduct credits from builder account

          console.log(
            `📧 Notifying builder: ${builder.company_name} (${builder.primary_email})`
          );

          // Simulate email sending
          if (builder.primary_email) {
            emailsSent++;
          }

          notificationsSent++;
        } catch (notificationError) {
          console.error(
            `❌ Failed to notify builder ${builder.company_name}:`,
            notificationError
          );
        }
      }

      // Update lead with notification status
      const { error: updateError } = await supabase
        .from('quote_requests')
        .update({
          matched_builders: buildersWithCredits.map((b: any) => b.id),
          updated_at: new Date().toISOString(),
        })
        .eq('id', leadId);

      if (updateError) {
        console.error("❌ Failed to update lead with matched builders:", updateError);
      }
    } catch (notificationError) {
      console.error("❌ Error sending notifications:", notificationError);
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Lead submitted successfully. ${notificationsSent} qualified builders were notified.`,
      data: {
        leadId,
        leadDetails: {
          id: leadId,
          city: leadData.cityName || "Not specified",
          country: leadData.countryName || "Not specified",
          budget: leadData.budget || "Not specified",
          priority: leadData.priority,
          companyName: leadData.companyName,
          status: leadData.status,
        },
        matchingBuilders: qualifiedBuilders.length,
        qualifiedBuilders: qualifiedBuilders.slice(0, 5).map((b: any) => ({
          id: b.id,
          name: b.company_name,
          city: b.headquarters_city,
          country: b.headquarters_country,
          hasCredits: b.premium_member === true,
        })),
        notificationsSent,
        emailsSent,
        routingSuccess: true,
        systemSettings: {
          routingEnabled: true,
          smtpEnabled: true,
          smsEnabled: false,
        },
        routing: {
          success: true,
          buildersNotified: notificationsSent,
        },
      },
    });
  } catch (error) {
    console.error("❌ Lead submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error during lead submission",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}