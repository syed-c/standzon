export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
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

    if (isVerbose) {
      console.log("📊 Admin builders request:", {
        page,
        limit,
        search,
        filter,
        action,
        prioritizeReal,
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

        // Only add static builders if no real builders exist
        if (buildersToReturn.length === 0) {
          const staticBuilders = getExhibitionBuilders();
          buildersToReturn.push(...staticBuilders);
          if (isVerbose) {
            console.log(
              `📂 No real data found, using ${staticBuilders.length} static builders as fallback`
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

    // Default: Load all builders from persistent storage
    const allBuilders = await builderAPI.getAllBuilders();
    if (isVerbose) {
      console.log(
        `📊 Retrieved ${allBuilders.length} builders from persistent storage`
      );
    }

    // Fallback: if none in persistent storage, serve static builders automatically
    const buildersSource = allBuilders.length === 0 ? getExhibitionBuilders() : allBuilders;
    if (allBuilders.length === 0 && isVerbose) {
      console.log(`📂 Using ${buildersSource.length} static builders as fallback (auto)`);
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
    const result = unifiedPlatformAPI.addBuilder(builderData, "admin");

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

    // Get the current builder
    const currentBuilder = unifiedPlatformAPI.getBuilderById(builderId);
    if (!currentBuilder) {
      return NextResponse.json(
        {
          success: false,
          error: "Builder not found",
        },
        { status: 404 }
      );
    }

    // Update the builder
    const result = unifiedPlatformAPI.updateBuilder(
      builderId,
      updates,
      "admin"
    );

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
