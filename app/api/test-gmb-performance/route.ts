import { NextRequest, NextResponse } from "next/server";
import { unifiedPlatformAPI } from "@/lib/data/unifiedPlatformData";
import { v4 as uuidv4 } from 'uuid';

// Test endpoint to simulate processing a large number of builders
export async function POST(request: NextRequest) {
  try {
    const { count } = await request.json();
    const builderCount = count || 50; // Default to 50 builders
    
    console.log(`Testing import of ${builderCount} builders...`);
    
    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];
    
    // Process builders in batches to avoid timeouts
    const batchSize = 5;
    for (let i = 0; i < builderCount; i += batchSize) {
      const currentBatchSize = Math.min(batchSize, builderCount - i);
      const batchPromises = [];
      
      for (let j = 0; j < currentBatchSize; j++) {
        const index = i + j;
        const testBuilder = {
          id: uuidv4(), // Generate proper UUID instead of string-based ID
          companyName: `Test Builder ${index}`,
          slug: `test-builder-${index}`,
          logo: "/images/builders/default-logo.png",
          establishedYear: new Date().getFullYear(),
          headquarters: {
            city: "Test City",
            country: "Test Country",
            countryCode: "TC",
            address: `${index} Test St`,
            latitude: 0,
            longitude: 0,
            isHeadquarters: true,
          },
          contactInfo: {
            primaryEmail: `test${index}@example.com`,
            phone: `+123456789${index % 100}`,
            website: "https://example.com",
            contactPerson: "Test Person",
            position: "Manager"
          },
          companyDescription: `This is test builder #${index} for performance testing`,
          rating: 4.5,
          reviewCount: Math.floor(Math.random() * 50) + 10,
          verified: true,
          claimed: false,
          premiumMember: false,
          teamSize: 20,
          projectsCompleted: Math.floor(Math.random() * 100) + 10,
          responseTime: "24 hours",
          languages: ["English", "Spanish"],
          gmbImported: true,
          importedFromGMB: true,
          source: "performance_test",
          lastUpdated: new Date().toISOString(),
          status: "active",
          plan: "free",
          contactEmail: `test${index}@example.com`
        };
        
        batchPromises.push(unifiedPlatformAPI.addBuilder(testBuilder as any, "admin"));
      }
      
      // Wait for all builders in this batch to complete
      const batchResults = await Promise.all(batchPromises);
      
      // Process results
      for (const result of batchResults) {
        if (result.success) {
          successCount++;
        } else {
          failCount++;
          errors.push(result.error || "Unknown error");
        }
      }
      
      console.log(`Processed batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(builderCount/batchSize)} - Success: ${successCount}, Failed: ${failCount}`);
      
      // Add a small delay between batches to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`Test completed - Success: ${successCount}, Failed: ${failCount}`);
    
    return NextResponse.json({
      success: true,
      message: `Test completed - Success: ${successCount}, Failed: ${failCount}`,
      data: {
        successCount,
        failCount,
        errors: failCount > 0 ? errors.slice(0, 5) : undefined // Only return first 5 errors
      }
    });
  } catch (error) {
    console.error("Error in performance test:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to run performance test",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}