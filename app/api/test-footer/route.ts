import { NextRequest, NextResponse } from "next/server";
import { enhancedStorage } from "@/lib/database/persistenceAPI";

export async function GET() {
  try {
    console.log("Testing footer API...");
    console.log("Enhanced storage:", enhancedStorage ? "Available" : "Not available");
    console.log("ENABLE_PERSISTENCE:", process.env.ENABLE_PERSISTENCE);
    
    if (!enhancedStorage) {
      return NextResponse.json({ 
        success: false, 
        error: "Enhanced storage not available",
        env: {
          ENABLE_PERSISTENCE: process.env.ENABLE_PERSISTENCE
        }
      }, { status: 500 });
    }
    
    const data = await enhancedStorage.readData("footer_settings", null);
    console.log("Footer data retrieved:", !!data);
    
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error("Footer API test failed:", e);
    return NextResponse.json({ success: false, error: "Failed to load footer settings", details: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}