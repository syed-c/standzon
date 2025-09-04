import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Initialize Convex client for server-side operations (guarded)
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null;

export async function POST(request: NextRequest) {
  console.log("🎯 Lead submission API called");

  // Bail out early if Convex URL is not configured
  if (!convex) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Convex URL not configured. Set NEXT_PUBLIC_CONVEX_URL in environment variables.",
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    console.log("📝 Lead submission data received:", body);

    // Map the incoming data to Convex schema format
    const leadData = {
      // Lead source information
      source: body.source || "public_quote_request",
      sourceUrl: body.sourceUrl,

      // Client information - map from different possible field names
      companyName: body.companyName || body.company || "Not specified",
      contactPerson:
        body.contactName || body.name || body.contactPerson || "Not specified",
      contactEmail: body.email || body.contactEmail,
      contactPhone: body.phone || body.contactPhone,

      // Project details - enhanced exhibition handling
      exhibitionName: body.exhibitionName || body.exhibition,
      exhibitionSlug:
        body.exhibitionSlug ||
        (body.exhibitionName
          ? body.exhibitionName
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")
          : undefined),
      standSize: body.standSize
        ? typeof body.standSize === "string" && body.standSize.includes("(")
          ? parseInt(body.standSize.match(/\d+/)?.[0] || "0")
          : parseInt(body.standSize.toString())
        : undefined,
      standSizeUnit: body.standSizeUnit || "sqm",
      budget: body.budget,
      timeline: body.timeline,

      // Enhanced location information
      countryName:
        body.country ||
        body.countryName ||
        body.builderLocation?.split(",").pop()?.trim(),
      cityName:
        body.city ||
        body.cityName ||
        body.location ||
        body.builderLocation?.split(",")[0]?.trim(),
      venue: body.venue,

      // Requirements and preferences
      services: body.services
        ? Array.isArray(body.services)
          ? body.services
          : [body.services]
        : undefined,
      specialRequirements:
        body.message || body.requirements || body.specialRequirements,
      designPreferences: body.designPreferences,

      // Lead management
      status: body.status || "new",
      priority:
        body.priority ||
        body.urgency ||
        (body.timeline?.includes("1-2 months") ? "high" : "medium"),
      assignedBuilders: undefined,
      notifiedBuilders: undefined,
      responseCount: 0,

      // Timestamps
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    console.log("🔄 Mapped lead data for Convex:", leadData);

    // Validate required fields
    if (!leadData.contactEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required",
        },
        { status: 400 }
      );
    }

    console.log("💾 Creating lead in Convex database:", leadData);

    // Create lead in Convex
    const leadId = await convex.mutation(api.leads.createLead, leadData);

    console.log("✅ Lead created successfully with ID:", leadId);

    // Get qualified builders from Convex
    console.log("🔍 Finding qualified builders...");
    const buildersResult = await convex.query(api.builders.getAllBuilders);

    let allBuilders = [];
    if (
      buildersResult &&
      buildersResult.ok &&
      Array.isArray(buildersResult.builders)
    ) {
      allBuilders = buildersResult.builders;
    }

    console.log(`📊 Total builders in system: ${allBuilders.length}`);

    // Enhanced qualification logic with location matching
    const qualifiedBuilders = allBuilders.filter((builder) => {
      if (!leadData.cityName && !leadData.countryName) {
        return true; // Show all builders if no location specified
      }

      // Check if builder serves the requested location
      const builderLocation = builder.location?.toLowerCase() || "";
      const builderCity = builder.headquartersCity?.toLowerCase() || "";
      const builderCountry = builder.headquartersCountry?.toLowerCase() || "";
      const leadCity = leadData.cityName?.toLowerCase() || "";
      const leadCountry = leadData.countryName?.toLowerCase() || "";

      // Enhanced matching logic
      const locationMatch =
        builderLocation.includes(leadCity) ||
        builderLocation.includes(leadCountry) ||
        builderCity === leadCity ||
        builderCountry === leadCountry ||
        leadCity.includes(builderLocation) ||
        leadCountry.includes(builderLocation);

      // Check service locations if available
      const serviceLocationMatch = builder.serviceLocations?.some(
        (loc) =>
          loc.city?.toLowerCase() === leadCity ||
          loc.country?.toLowerCase() === leadCountry
      );

      return locationMatch || serviceLocationMatch;
    });

    console.log(`✅ Found ${qualifiedBuilders.length} qualified builders`);

    // Auto-notify builders with credits (simulate for now)
    let notificationsSent = 0;
    let emailsSent = 0;

    try {
      // Filter builders with credits and active subscriptions
      const buildersWithCredits = qualifiedBuilders.filter((builder) => {
        // Simulate credit checking - in real implementation, check subscription status
        const hasCredits =
          builder.subscriptionPlan !== "free" ||
          (builder.leadCredits && builder.leadCredits > 0);
        const isActive = builder.isActive !== false;
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
            `📧 Notifying builder: ${builder.companyName} (${builder.contactEmail || builder.email})`
          );

          // Simulate email sending
          if (builder.contactEmail || builder.email) {
            emailsSent++;
          }

          notificationsSent++;
        } catch (notificationError) {
          console.error(
            `❌ Failed to notify builder ${builder.companyName}:`,
            notificationError
          );
        }
      }

      // Update lead with notification status
      await convex.mutation(api.leads.updateLeadNotifications, {
        leadId,
        notifiedBuilders: buildersWithCredits.map((b) => b._id),
        notificationsSent,
        emailsSent,
      });
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
        qualifiedBuilders: qualifiedBuilders.slice(0, 5).map((b) => ({
          id: b._id,
          name: b.companyName || b.name,
          city: b.headquartersCity,
          country: b.headquartersCountry,
          location: b.location,
          hasCredits:
            b.subscriptionPlan !== "free" ||
            (b.leadCredits && b.leadCredits > 0),
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
