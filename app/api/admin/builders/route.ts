export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { adminAPI } from "@/lib/api/admin";
import { unifiedPlatformAPI } from "@/lib/data/unifiedPlatformData";
import {
  exhibitionBuilders,
  getExhibitionBuilders,
} from "@/lib/data/exhibitionBuilders";
import {
  builderAPI,
  leadAPI,
  settingsAPI,
} from "@/lib/database/persistenceAPI";
import { gmbProtection } from "@/lib/database/gmbDataProtection";

// Only log when explicitly enabled
const isVerbose = process.env.VERBOSE_LOGS === "true";

// Helper function to get continent from country name
function getContinent(country: string): string {
  const continentMap: Record<string, string> = {
    "United States": "North America",
    Canada: "North America",
    Mexico: "North America",
    Germany: "Europe",
    France: "Europe",
    "United Kingdom": "Europe",
    Italy: "Europe",
    Spain: "Europe",
    Netherlands: "Europe",
    Belgium: "Europe",
    Switzerland: "Europe",
    Austria: "Europe",
    China: "Asia",
    Japan: "Asia",
    India: "Asia",
    Singapore: "Asia",
    "United Arab Emirates": "Asia",
    Australia: "Oceania",
    "New Zealand": "Oceania",
    Brazil: "South America",
    Argentina: "South America",
    "South Africa": "Africa",
    Egypt: "Africa",
  };

  return continentMap[country] || "Other";
}

// Helper function to get country code from country name
function getCountryCode(country: string): string {
  const countryCodeMap: Record<string, string> = {
    "United States": "US",
    "United Kingdom": "GB",
    "United Arab Emirates": "AE",
    "New Zealand": "NZ",
    "South Africa": "ZA",
    "South Korea": "KR",
    "Saudi Arabia": "SA",
    // Add more mappings as needed
  };

  return countryCodeMap[country] || country.substring(0, 2).toUpperCase();
}

export async function GET(request: Request) {
  try {
    // Only run emergency backup when explicitly enabled
    if (process.env.ENABLE_BACKUPS === "true") {
      await gmbProtection.createEmergencyBackup();
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";
    const filter = searchParams.get("filter") || "all";
    const action = searchParams.get("action") || "";
    const prioritizeReal = searchParams.get("prioritize_real") === "true";
    const includeAllCountries = searchParams.get("include_all_countries") === "true";

    if (isVerbose) {
        console.log("📊 Admin builders request:", {
          page,
          limit,
          search,
          filter,
          action,
          prioritizeReal,
          includeAllCountries,
        });
    }

    // Handle reload action
    if (action === "reload") {
      if (isVerbose) console.log("🔄 Reloading builder data from files...");

      try {
        // Load all builders from persistent storage first
        const persistentBuilders = await builderAPI.getAllBuilders();
        if (isVerbose) {
          console.log(
            `📊 Found ${persistentBuilders.length} builders in persistent storage`
          );
        }

        let buildersToReturn = [...persistentBuilders];

        // If prioritizing real data, filter out mock builders
        if (prioritizeReal) {
          buildersToReturn = buildersToReturn.filter(
            (builder) =>
              builder.source === "google_places_api" ||
              builder.gmbImported ||
              builder.importedFromGMB ||
              (builder.id && builder.id.startsWith("gmb_"))
          );
          if (isVerbose) {
            console.log(
              `🧹 Filtered to ${buildersToReturn.length} real builders (removed mock data)`
            );
          }
        }
        
        // Apply country filter if needed (default to Germany for now)
        if ((filter === "all" || filter === "country") && !includeAllCountries) {
          buildersToReturn = buildersToReturn.filter(
            (builder) =>
              builder.headquarters_country === "Germany" ||
              builder.headquartersCountry === "Germany" ||
              (builder.headquarters &&
                builder.headquarters.country === "Germany")
          );
        }

        // NO FALLBACK TO STATIC DATA - Only return real builders
        if (buildersToReturn.length === 0) {
          if (isVerbose) {
            console.log(
              `📂 No real data found - returning empty array (no static fallback)`
            );
          }
        }

        if (isVerbose) {
          console.log(
            `✅ Successfully reloaded ${buildersToReturn.length} builders`
          );
        }

        return NextResponse.json({
          success: true,
          message: `Successfully reloaded ${buildersToReturn.length} builders from files`,
          data: {
            builders: buildersToReturn.slice(0, limit),
            total: buildersToReturn.length,
            page: 1,
            limit,
            totalPages: Math.ceil(buildersToReturn.length / limit),
          },
        });
      } catch (error) {
        console.error("❌ Error reloading builders:", error);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to reload builder data",
            message: "Error reloading builders from files",
          },
          { status: 500 }
        );
      }
    }

    // Handle delete all action
    if (action === "delete-all") {
      if (isVerbose) console.log("🗑️ Deleting all builders...");
      const result = await builderAPI.deleteAllBuilders();

      return NextResponse.json({
        success: result.success,
        message: result.success
          ? `Successfully deleted ${result.deletedCount} builders`
          : "Failed to delete builders",
        data: {
          deletedCount: result.deletedCount || 0,
          remainingBuilders: 0,
        },
      });
    }

    // Try Supabase first for real builders (prioritize Supabase over Convex)
    let buildersSource: any[] = [];
    
    try {
      // Try Supabase first for real builders
      const { getServerSupabase } = await import('@/lib/supabase');
      const sb = getServerSupabase();
      if (sb) {
        const { data: supabaseBuilders, error } = await sb
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
        
        if (!error && supabaseBuilders && supabaseBuilders.length > 0) {
          buildersSource = supabaseBuilders.map((b: any) => {
            // Process service locations from the joined table
            const serviceLocations: Array<{country: string, cities: string[]}> = [];
            if (b.builder_service_locations && b.builder_service_locations.length > 0) {
              // Group by country
              const countryMap = new Map();
              b.builder_service_locations.forEach((loc: any) => {
                if (loc.country && loc.city) {
                  if (!countryMap.has(loc.country)) {
                    countryMap.set(loc.country, []);
                  }
                  countryMap.get(loc.country).push(loc.city);
                }
              });
              
              // Convert to the expected format
              countryMap.forEach((cities: string[], country: string) => {
                serviceLocations.push({
                  country,
                  cities: [...new Set(cities)] // Remove duplicates
                });
              });
            }
            
            return {
              id: b.id,
              companyName: b.company_name,
              slug: b.slug,
              rating: b.rating || 0,
              reviewCount: b.review_count || 0,
              verified: !!b.verified,
              claimed: !!b.claimed,
              premiumMember: !!b.premium_member,
              projectsCompleted: b.projects_completed || 0,
              responseTime: b.response_time || "Within 24 hours",
              languages: b.languages || ["English"],
              createdAt: b.created_at,
              source: b.source || 'supabase',
              gmbImported: false,
              headquarters: {
                city: b.headquarters_city || "Unknown",
                country: b.headquarters_country || "Unknown",
                countryCode: b.headquarters_country_code || "XX",
                address: b.headquarters_address || "",
              },
              contactInfo: {
                primaryEmail: b.primary_email || '',
                phone: b.phone || '',
                website: b.website || '',
                contactPerson: b.contact_person || '',
                position: b.position || '',
              },
              companyDescription: b.company_description || '',
              logo: b.logo || '/images/builders/default-logo.png',
              establishedYear: b.established_year || new Date().getFullYear(),
              teamSize: b.team_size || 0,
              serviceLocations: serviceLocations as Array<{country: string, cities: string[]}>,
            };
          });
          
          if (isVerbose) {
            console.log(`📊 Retrieved ${buildersSource.length} builders from Supabase`);
          }
        }
      }
    } catch (supabaseErr) {
      if (isVerbose) {
        console.warn('⚠️ Supabase fetch failed, trying Convex:', supabaseErr);
      }
    }

    // If Supabase had no data, try Convex as fallback
    if (buildersSource.length === 0) {
      try {
        const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
        if (convexUrl) {
          const convex = new ConvexHttpClient(convexUrl);
          const convexData = await convex.query(api.builders.getAllBuilders, { limit: 10000, offset: 0 });
          const convexBuilders = Array.isArray(convexData?.builders) ? convexData.builders : [];
          if (isVerbose) {
            console.log(`📡 Convex returned ${convexBuilders.length} builders`);
          }
          if (convexBuilders.length > 0) {
            // Map Convex format to unified shape expected by clients of this endpoint
            buildersSource = convexBuilders.map((b: any) => ({
              id: b._id,
              companyName: b.companyName,
              slug: b.slug || b.companyName?.toLowerCase()?.replace(/[^a-z0-9]/g, "-") || "",
              rating: b.rating || 0,
              reviewCount: b.reviewCount || 0,
              verified: !!b.verified,
              claimed: !!b.claimed,
              premiumMember: !!b.premiumMember,
              projectsCompleted: b.projectsCompleted || 0,
              responseTime: b.responseTime || "Within 24 hours",
              languages: b.languages || ["English"],
              createdAt: b.createdAt,
              source: b.source,
              gmbImported: !!(b.gmbImported || b.importedFromGMB || b.source === "GMB_API"),
              headquarters: {
                city: b.headquartersCity || "Unknown",
                country: b.headquartersCountry || "Unknown",
                countryCode: b.headquartersCountryCode || "XX",
                address: b.headquartersAddress || "",
              },
            }));
          }
        }
      } catch (e) {
        if (isVerbose) console.warn("⚠️ Convex builders fetch failed, trying persistent storage", e);
      }
    }

    // If both Supabase and Convex had no data, try persistent storage
    if (buildersSource.length === 0) {
      try {
        const persistentBuilders = await builderAPI.getAllBuilders();
        if (isVerbose) {
          console.log(`📊 Retrieved ${persistentBuilders.length} builders from persistent storage`);
        }
        buildersSource = persistentBuilders;
      } catch (err) {
        if (isVerbose) {
          console.error('⚠️ Failed to read persistent builders:', err);
        }
        buildersSource = [];
      }
    }

    // NO FALLBACK TO STATIC DATA - Only return real builders from Supabase/Convex/persistence
    if (buildersSource.length === 0) {
      if (isVerbose) {
        console.log(`📂 No real builders found - returning empty array (no static fallback)`);
      }
    }

    // If requesting per-country aggregation, compute after sourcing builders
    if (action === "countries") {
      // Ensure we have the latest buildersSource compiled
      const countryStats: Record<string, { builderCount: number; ratingSum: number; ratingCount: number }> = {};

      for (const builder of buildersSource) {
        const countryName = builder?.headquarters?.country || "Unknown";
        if (!countryStats[countryName]) {
          countryStats[countryName] = { builderCount: 0, ratingSum: 0, ratingCount: 0 };
        }
        countryStats[countryName].builderCount += 1;

        const rating = Number(builder?.rating || 0);
        if (!Number.isNaN(rating) && rating > 0) {
          countryStats[countryName].ratingSum += rating;
          countryStats[countryName].ratingCount += 1;
        }
      }

      const data = Object.entries(countryStats).map(([name, stats]) => ({
        name,
        builderCount: stats.builderCount,
        averageRating: stats.ratingCount > 0 ? Number((stats.ratingSum / stats.ratingCount).toFixed(2)) : 0,
      }));

      return NextResponse.json({ success: true, data });
    }

    // Apply filters
    let filteredBuilders = [...buildersSource];

    // Apply search filter
    if (search) {
      filteredBuilders = filteredBuilders.filter(
        (builder) =>
          builder.companyName?.toLowerCase().includes(search.toLowerCase()) ||
          builder.headquarters?.city
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          builder.headquarters?.country
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    // Apply other filters
    if (filter !== "all") {
      switch (filter) {
        case "verified":
          filteredBuilders = filteredBuilders.filter(
            (builder) => builder.verified
          );
          break;
        case "gmb":
          filteredBuilders = filteredBuilders.filter(
            (builder) =>
              builder.gmbImported ||
              builder.importedFromGMB ||
              builder.source === "google_places_api"
          );
          break;
        case "premium":
          filteredBuilders = filteredBuilders.filter(
            (builder) => builder.premiumMember
          );
          break;
      }
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBuilders = filteredBuilders.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        builders: paginatedBuilders,
        total: filteredBuilders.length,
        page,
        limit,
        totalPages: Math.ceil(filteredBuilders.length / limit),
      },
    });
  } catch (error) {
    console.error("❌ GET Error in admin builders API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch builders",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (isVerbose) console.log("📝 Admin builders API - POST request received");

    const builderData = await request.json();
    if (isVerbose) console.log("📊 Adding builder:", builderData);

    // Add builder using unified platform API
    const result = await unifiedPlatformAPI.addBuilder(builderData, "admin");

    if (result.success) {
      if (isVerbose) console.log("✅ Builder added successfully");
      return NextResponse.json({
        success: true,
        message: "Builder added successfully",
        data: result.data,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to add builder" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("❌ POST Error in admin builders API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("📝 Admin builders API - PUT request received");

    // Handle PUT requests (updates)
    const { builderId, updates } = await request.json();

    if (!builderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Builder ID is required for updates",
        },
        { status: 400 }
      );
    }

    console.log("🔄 Updating builder:", builderId, updates);

    // Get the current builder - check Supabase first, then in-memory
    let currentBuilder = null;
    
    try {
      // Try Supabase first
      const { getServerSupabase } = await import('@/lib/supabase');
      const sb = getServerSupabase();
      if (sb) {
        const { data: supabaseBuilder, error } = await sb
          .from('builder_profiles')
          .select('*')
          .eq('id', builderId)
          .single();
        
        if (!error && supabaseBuilder) {
          currentBuilder = supabaseBuilder;
          console.log("✅ Found builder in Supabase for update");
        }
      }
    } catch (supabaseErr) {
      console.warn('⚠️ Supabase lookup failed, trying in-memory:', supabaseErr);
    }
    
    // If not found in Supabase, try in-memory
    if (!currentBuilder) {
      currentBuilder = unifiedPlatformAPI.getBuilderById(builderId);
    }
    
    if (!currentBuilder) {
      return NextResponse.json(
        {
          success: false,
          error: "Builder not found",
        },
        { status: 404 }
      );
    }

    // Update the builder - try Supabase first, then in-memory
    let result = null;
    
    try {
      // Try updating in Supabase first
      const { getServerSupabase } = await import('@/lib/supabase');
      const sb = getServerSupabase();
      if (sb) {
        // Map the updates to Supabase column names
        const supabaseUpdates: any = {
          updated_at: new Date().toISOString()
        };
        
        // Handle service locations specifically
        if (updates.serviceLocations) {
          // Clean existing service locations from description and add new ones
          const existingDescription = currentBuilder.company_description || '';
          const cleanedDescription = existingDescription.replace(/\n\nSERVICE_LOCATIONS:\[.*?\]/g, '');
          const serviceLocationsJson = JSON.stringify(updates.serviceLocations);
          supabaseUpdates.company_description = `${cleanedDescription}\n\nSERVICE_LOCATIONS:${serviceLocationsJson}`;
          
          // Also sync to builder_service_locations table
          try {
            // First, delete existing service locations for this builder
            await sb
              .from('builder_service_locations')
              .delete()
              .eq('builder_id', builderId);
            
            // Then insert new service locations
            const serviceLocationRecords = [];
            for (const location of updates.serviceLocations) {
              if (location.country && location.cities && location.cities.length > 0) {
                for (const city of location.cities) {
                  serviceLocationRecords.push({
                    builder_id: builderId,
                    city: city,
                    country: location.country,
                    country_code: getCountryCode(location.country),
                    is_headquarters: false // You can set this based on your logic
                  });
                }
              }
            }
            
            if (serviceLocationRecords.length > 0) {
              const { error: serviceLocationError } = await sb
                .from('builder_service_locations')
                .insert(serviceLocationRecords);
              
              if (serviceLocationError) {
                console.error("❌ Error inserting service locations:", serviceLocationError);
              } else {
                console.log(`✅ Inserted ${serviceLocationRecords.length} service locations`);
              }
            }
          } catch (serviceLocationErr) {
            console.error("❌ Error syncing service locations:", serviceLocationErr);
          }
        }
        
        // Handle other common field mappings
        if (updates.companyName) supabaseUpdates.company_name = updates.companyName;
        if (updates.description) supabaseUpdates.company_description = updates.description;
        if (updates.phone) supabaseUpdates.phone = updates.phone;
        if (updates.email) supabaseUpdates.primary_email = updates.email;
        if (updates.website) supabaseUpdates.website = updates.website;
        if (updates.contactName) supabaseUpdates.contact_person = updates.contactName;
        if (updates.teamSize !== undefined) supabaseUpdates.team_size = updates.teamSize;
        if (updates.establishedYear) supabaseUpdates.established_year = updates.establishedYear;
        if (updates.logo) supabaseUpdates.logo = updates.logo;
        
        console.log('🔄 Supabase update data:', supabaseUpdates);
        
        const { data, error } = await sb
          .from('builder_profiles')
          .update(supabaseUpdates)
          .eq('id', builderId)
          .select()
          .single();
        
        if (!error && data) {
          result = { success: true, data };
          console.log("✅ Builder updated successfully in Supabase");
        } else {
          console.error("❌ Supabase update error:", error);
        }
      }
    } catch (supabaseErr) {
      console.warn('⚠️ Supabase update failed, trying in-memory:', supabaseErr);
    }
    
    // If Supabase update failed, try in-memory
    if (!result) {
      result = unifiedPlatformAPI.updateBuilder(
        builderId,
        updates,
        "admin"
      );
    }

    if (result.success) {
      console.log("✅ Builder updated successfully");
      return NextResponse.json({
        success: true,
        message: "Builder updated successfully",
        data: result.data,
      });
    } else {
      console.error("❌ Failed to update builder:", result.error);
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to update builder",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ PUT Error in builders API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("🗑️ Admin builders API - DELETE request received");

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // Handle delete all action
    if (action === "delete-all") {
      console.log("🗑️ Deleting all builders...");
      const builders = unifiedPlatformAPI.getBuilders();
      const deletedCount = builders.length;

      // Clear all builders
      unifiedPlatformAPI.clearAll();

      return NextResponse.json({
        success: true,
        message: `Successfully deleted ${deletedCount} builders`,
        data: {
          deletedCount,
          remainingBuilders: 0,
        },
      });
    }

    // Handle single builder deletion
    const { builderId } = await request.json();

    if (!builderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Builder ID is required for deletion",
        },
        { status: 400 }
      );
    }

    console.log("🗑️ Deleting builder:", builderId);

    // Delete the builder
    const result = unifiedPlatformAPI.deleteBuilder(builderId, "admin");

    if (result.success) {
      console.log("✅ Builder deleted successfully");
      return NextResponse.json({
        success: true,
        message: "Builder deleted successfully",
      });
    } else {
      console.error("❌ Failed to delete builder:", result.error);
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to delete builder",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ DELETE Error in builders API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
