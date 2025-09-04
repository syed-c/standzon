import { NextRequest, NextResponse } from "next/server";
import { enhancedStorage } from "@/lib/database/persistenceAPI";

const STORAGE_KEY = "footer_settings";

export async function GET() {
  try {
    const data = await enhancedStorage.readData(STORAGE_KEY, null);
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Failed to load footer settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = {
      paragraph: body.paragraph || "",
      contact: {
        phone: body.contact?.phone || "",
        phoneLink: body.contact?.phoneLink || "",
        email: body.contact?.email || "",
        emailLink: body.contact?.emailLink || "",
        address: body.contact?.address || "",
        addressLink: body.contact?.addressLink || "",
      },
      columns: {
        services: { heading: body.columns?.services?.heading || "Services", items: body.columns?.services?.items || [] },
        locations: { heading: body.columns?.locations?.heading || "Global Locations", items: body.columns?.locations?.items || [] },
        resources: { heading: body.columns?.resources?.heading || "Resources", items: body.columns?.resources?.items || [] },
      },
      bottom: {
        copyright: body.bottom?.copyright || "© 2024 StandsZone. All rights reserved.",
        links: body.bottom?.links || [
          { label: "Privacy Policy", href: "/legal/privacy-policy" },
          { label: "Terms of Service", href: "/legal/terms-of-service" },
          { label: "Cookie Policy", href: "/legal/cookie-policy" },
        ],
      },
      social: body.social || [
        { label: "LinkedIn", href: "#", icon: "linkedin" },
        { label: "Twitter", href: "#", icon: "twitter" },
        { label: "Instagram", href: "#", icon: "instagram" },
        { label: "Facebook", href: "#", icon: "facebook" },
      ],
      updatedAt: new Date().toISOString(),
    };

    await enhancedStorage.writeData(STORAGE_KEY, payload);
    return NextResponse.json({ success: true, data: payload });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Failed to save footer settings" }, { status: 500 });
  }
}


