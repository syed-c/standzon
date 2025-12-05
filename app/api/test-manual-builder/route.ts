import { NextRequest, NextResponse } from "next/server";
import { unifiedPlatformAPI } from "@/lib/data/unifiedPlatformData";

export async function GET() {
  try {
    console.log("Testing manual builder creation...");
    
    // Create a test builder
    const testBuilder = {
      id: "test-builder-" + Date.now(),
      companyName: "Test Builder Company",
      slug: "test-builder-company",
      logo: "/images/builders/default-logo.png",
      establishedYear: new Date().getFullYear(),
      headquarters: {
        city: "Test City",
        country: "Test Country",
        countryCode: "TC",
        address: "123 Test St",
        latitude: 0,
        longitude: 0,
        isHeadquarters: true,
      },
      contactInfo: {
        primaryEmail: "test@example.com",
        phone: "+1234567890",
        website: "https://example.com",
        contactPerson: "Test Person",
        position: "Manager"
      },
      companyDescription: "This is a test builder for debugging purposes",
      rating: 4.5,
      reviewCount: 10,
      verified: true,
      claimed: false,
      premiumMember: false,
      teamSize: 20,
      projectsCompleted: 50,
      responseTime: "24 hours",
      languages: ["English", "Spanish"],
      gmbImported: true,
      importedFromGMB: true,
      source: "manual_test",
      lastUpdated: new Date().toISOString(),
      status: "active",
      plan: "free",
      contactEmail: "test@example.com"
    };
    
    console.log("Adding test builder to unified platform...");
    const result = await unifiedPlatformAPI.addBuilder(testBuilder as any, "admin");
    
    console.log("Add builder result:", result);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: "Test builder created successfully",
        data: result.data
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: "Failed to create test builder",
        details: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Unexpected error testing manual builder creation:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Unexpected error testing manual builder creation",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}