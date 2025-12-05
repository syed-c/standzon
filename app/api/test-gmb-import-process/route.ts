import { NextRequest, NextResponse } from "next/server";
import { unifiedPlatformAPI } from "@/lib/data/unifiedPlatformData";

// Simulate the GMB import process with sample data
export async function GET() {
  try {
    console.log("Testing GMB import process simulation...");
    
    // Sample GMB listings (similar to what would be fetched from Google Places API)
    const sampleListings = [
      {
        id: "ChIJ8_3G6sxpXz4RqmYloAkrs7Y",
        businessName: "Exhibition Stand Contractors, Builders Dubai, Booth Contractors, Designers in Abu Dhabi",
        address: "Dubai, UAE",
        phone: "+971-4-1234567",
        website: "https://example.com",
        rating: 4.5,
        reviewCount: 25,
        city: "Dubai",
        country: "UAE",
        source: "google_places_api"
      },
      {
        id: "ChIJNZisMalDXz4RvuGaG6Pgshc",
        businessName: "Stands Bay Exhibition Stand Builders Dubai, Booth Contractors, Designers in Abu Dhabi",
        address: "Dubai, UAE",
        phone: "+971-4-2345678",
        website: "https://example2.com",
        rating: 4.2,
        reviewCount: 18,
        city: "Dubai",
        country: "UAE",
        source: "google_places_api"
      }
    ];
    
    console.log(`Processing ${sampleListings.length} sample listings...`);
    
    // Transform listings to builder format (similar to transformGMBToBuilder)
    const transformedBuilders = sampleListings.map((listing) => {
      const countryCode = "AE"; // UAE
      const category = "Exhibition Services";
      const gmbId = listing.id;
      const builderId = `gmb_${gmbId}`;
      
      return {
        id: builderId,
        companyName: listing.businessName,
        slug: listing.businessName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "unknown-builder",
        logo: "/images/builders/default-logo.png",
        establishedYear: new Date().getFullYear(),
        contactInfo: {
          primaryEmail: "",
          phone: listing.phone || "",
          website: listing.website || "",
          contactPerson: "Contact Person",
          position: "Manager",
        },
        headquarters: {
          city: listing.city || "Unknown",
          country: listing.country || "Unknown",
          address: listing.address || "",
          countryCode: countryCode,
          latitude: 0,
          longitude: 0,
          isHeadquarters: true,
        },
        serviceLocations: [
          {
            city: listing.city || "Unknown",
            country: listing.country || "Unknown",
            address: listing.address || "",
            countryCode: countryCode,
            latitude: 0,
            longitude: 0,
            isHeadquarters: false,
          },
        ],
        rating: listing.rating || 0,
        reviewCount: listing.reviewCount || 0,
        verified: false,
        claimed: false,
        claimStatus: "unclaimed",
        premiumMember: false,
        teamSize: 0,
        projectsCompleted: 0,
        responseTime: "New to platform",
        languages: ["English"],
        specializations: [
          {
            id: "real-gmb-data",
            name: category,
            slug: category.toLowerCase().replace(/\s+/g, "-"),
            description: `${category} services`,
            color: "#3B82F6",
            icon: "🏗️",
            subcategories: [],
            annualGrowthRate: 0,
            averageBoothCost: 0,
            popularCountries: [],
          },
        ],
        services: [
          {
            id: "gmb-service",
            name: category,
            description: `Professional ${category.toLowerCase()} services`,
            category: "Construction",
            priceFrom: 0,
            currency: "USD",
            unit: "per project",
            popular: false,
            turnoverTime: "Contact for details",
          },
        ],
        certifications: [],
        awards: [],
        portfolio: [],
        tradeshowExperience: [],
        priceRange: {
          basicStand: { min: 0, max: 0, currency: "USD", unit: "per sqm" },
          customStand: { min: 0, max: 0, currency: "USD", unit: "per sqm" },
          premiumStand: { min: 0, max: 0, currency: "USD", unit: "per sqm" },
          averageProject: 0,
          currency: "USD"
        },
        companyDescription: `Professional ${category.toLowerCase()} services in ${listing.city || "Unknown"}`,
        whyChooseUs: [],
        clientTestimonials: [],
        socialMedia: {},
        businessLicense: "",
        insurance: {
          liability: 0,
          currency: "USD",
          validUntil: "",
          insurer: ""
        },
        sustainability: {
          certifications: [],
          ecoFriendlyMaterials: false,
          wasteReduction: false,
          carbonNeutral: false,
          sustainabilityScore: 0
        },
        keyStrengths: [],
        recentProjects: [],
        source: "google_places_api",
        gmbData: {
          originalId: gmbId,
          placeId: gmbId,
          fetchDate: new Date().toISOString(),
          businessHours: "Not available",
          photos: [],
          types: [],
          businessStatus: "OPERATIONAL",
        },
        websiteDomain: "unknown.com",
        claimingEmail: null,
        createdAt: new Date().toISOString(),
        importedFromGMB: true,
        gmbImported: true,
        status: "active",
        plan: "free",
        contactEmail: ""
      };
    });
    
    console.log(`Transformed ${transformedBuilders.length} listings to builder shape`);
    
    // Save builders using unifiedPlatformAPI
    let createdCount = 0;
    let failedCount = 0;
    const errors: string[] = [];
    
    console.log(`Starting to save ${transformedBuilders.length} builders to Supabase...`);
    
    for (const builder of transformedBuilders) {
      try {
        console.log(`Saving builder: ${builder.companyName} (ID: ${builder.id})`);
        
        const result = await unifiedPlatformAPI.addBuilder(builder as any, "admin");
        
        if (result.success) {
          createdCount++;
          console.log(`✅ Created builder: ${builder.companyName}`);
        } else {
          failedCount++;
          errors.push(`Failed to create ${builder.companyName}: ${result.error}`);
          console.error(`❌ Failed to create builder: ${builder.companyName}`, result.error);
        }
      } catch (error) {
        failedCount++;
        errors.push(`Error creating ${builder.companyName}: ${error instanceof Error ? error.message : "Unknown error"}`);
        console.error(`❌ Error creating builder: ${builder.companyName}`, error);
      }
    }
    
    console.log(`GMB listing creation completed: ${createdCount} created, ${failedCount} failed`);
    
    return NextResponse.json({
      success: true,
      message: `GMB listing creation completed: ${createdCount} created, ${failedCount} failed`,
      data: {
        processed: transformedBuilders.length,
        created: createdCount,
        failed: failedCount,
        errors: failedCount > 0 ? errors : undefined
      }
    });
  } catch (error) {
    console.error("Unexpected error in GMB import process simulation:", error);
    return NextResponse.json({
      success: false,
      error: "Unexpected error in GMB import process simulation",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}