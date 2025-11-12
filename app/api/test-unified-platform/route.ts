import { NextRequest, NextResponse } from "next/server";
import { unifiedPlatformAPI } from "@/lib/data/unifiedPlatformData";

export async function GET() {
  try {
    console.log("Testing unified platform API...");
    
    // Test getting builders
    const builders = unifiedPlatformAPI.getBuilders();
    console.log("Builders retrieved:", builders.length);
    
    // Test adding a test builder
    const testBuilder = {
      id: "test-builder-" + Date.now(),
      companyName: "Test Builder",
      slug: "test-builder",
      logo: "/images/builders/default-logo.png",
      establishedYear: new Date().getFullYear(),
      contactInfo: {
        primaryEmail: "test@example.com",
        phone: "123-456-7890",
        website: "https://example.com",
        contactPerson: "Test Person",
        position: "Manager"
      },
      headquarters: {
        city: "Test City",
        country: "Test Country",
        countryCode: "TC",
        address: "123 Test St",
        latitude: 0,
        longitude: 0,
        isHeadquarters: true
      },
      serviceLocations: [],
      companyDescription: "Test builder for debugging",
      rating: 5,
      reviewCount: 10,
      verified: true,
      claimed: false,
      premiumMember: false,
      teamSize: 10,
      projectsCompleted: 50,
      responseTime: "24 hours",
      languages: ["English"],
      specializations: [],
      services: [],
      certifications: [],
      awards: [],
      portfolio: [],
      tradeshowExperience: [],
      priceRange: {
        basicStand: { min: 1000, max: 5000, currency: "USD", unit: "sqm" },
        customStand: { min: 5000, max: 20000, currency: "USD", unit: "sqm" },
        premiumStand: { min: 20000, max: 100000, currency: "USD", unit: "sqm" },
        averageProject: 25000,
        currency: "USD"
      },
      whyChooseUs: ["Quality", "Reliability"],
      clientTestimonials: [],
      socialMedia: {},
      businessLicense: "TEST-123",
      insurance: {
        liability: 1000000,
        currency: "USD",
        validUntil: "2026-12-31",
        insurer: "Test Insurance"
      },
      sustainability: {
        certifications: [],
        ecoFriendlyMaterials: true,
        wasteReduction: true,
        carbonNeutral: false,
        sustainabilityScore: 80
      },
      keyStrengths: ["Design", "Construction"],
      recentProjects: [],
      source: "test",
      gmbImported: false,
      importedFromGMB: false,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: "active",
      plan: "free",
      contactEmail: "test@example.com"
    };
    
    console.log("Adding test builder...");
    const result = await unifiedPlatformAPI.addBuilder(testBuilder as any, "admin");
    console.log("Add builder result:", result);
    
    return NextResponse.json({ 
      success: true, 
      message: "Unified platform API test completed",
      buildersCount: builders.length,
      addResult: result
    });
  } catch (error) {
    console.error("Unified platform API test failed:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to test unified platform API",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}