import { NextRequest, NextResponse } from "next/server";
import { enhancedStorage } from "@/lib/database/persistenceAPI";

const STORAGE_KEY = "footer_settings";

// Default footer settings when persistence is disabled
const DEFAULT_FOOTER_SETTINGS = {
  paragraph: "Connect with trusted exhibition stand builders worldwide and make your next trade show booth truly unforgettable.",
  contact: {
    phone: "+1 909-600-0210",
    phoneLink: "tel:19096000210",
    email: "enquiry@standszone.com",
    emailLink: "mailto:enquiry@standszone.com",
    address: "72-32 Broadway, Flushing, NY 11372, USA",
    addressLink: ""
  },
  columns: {
    services: {
      heading: "Services",
      items: [
        { label: "Custom Stand Design", href: "#" },
        { label: "Stand Construction", href: "#" },
        { label: "3D Visualization", href: "#" },
        { label: "Installation Services", href: "#" },
        { label: "Project Management", href: "#" },
        { label: "Graphics & Branding", href: "#" }
      ]
    },
    locations: {
      heading: "Global Locations",
      items: [
        { label: "United Arab Emirates", href: "#" },
        { label: "United States", href: "#" },
        { label: "Germany", href: "#" },
        { label: "Italy", href: "#" },
        { label: "France", href: "#" },
        { label: "Russia", href: "#" },
        { label: "India", href: "#" }
      ]
    },
    resources: {
      heading: "Resources",
      items: [
        { label: "About", href: "#" },
        { label: "Find Builders", href: "#" },
        { label: "Trade Shows", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Quote", href: "#" }
      ]
    }
  },
  bottom: {
    copyright: "© 2024 StandsZone. All rights reserved.",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy-policy" },
      { label: "Terms of Service", href: "/legal/terms-of-service" },
      { label: "Cookie Policy", href: "/legal/cookie-policy" },
      { label: "Sitemap", href: "https://standszone.com/sitemap" }
    ]
  },
  social: [
    { label: "LinkedIn", href: "#", icon: "linkedin" },
    { label: "Twitter", href: "#", icon: "twitter" },
    { label: "Instagram", href: "#", icon: "instagram" },
    { label: "Facebook", href: "#", icon: "facebook" }
  ],
  updatedAt: new Date().toISOString()
};

export async function GET() {
  try {
    // Check if enhancedStorage is available
    if (!enhancedStorage) {
      // Return default footer settings when persistence is disabled
      return NextResponse.json({ success: true, data: DEFAULT_FOOTER_SETTINGS });
    }
    
    const data = await enhancedStorage.readData(STORAGE_KEY, null);
    
    // Ensure sitemap link is always included in the bottom links
    if (data && data.bottom && Array.isArray(data.bottom.links)) {
      // Check if sitemap link already exists
      const hasSitemap = data.bottom.links.some((link: any) => 
        link.label === 'Sitemap' || link.href === 'https://standszone.com/sitemap'
      );
      
      // If sitemap link doesn't exist, add it after "Cookie Policy"
      if (!hasSitemap) {
        const cookiePolicyIndex = data.bottom.links.findIndex((link: any) => 
          link.label === 'Cookie Policy'
        );
        
        if (cookiePolicyIndex !== -1) {
          // Insert sitemap link after Cookie Policy
          data.bottom.links.splice(cookiePolicyIndex + 1, 0, {
            label: 'Sitemap',
            href: 'https://standszone.com/sitemap'
          });
        } else {
          // If Cookie Policy doesn't exist, add sitemap at the end
          data.bottom.links.push({
            label: 'Sitemap',
            href: 'https://standszone.com/sitemap'
          });
        }
      }
    }
    
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error("Footer API GET error:", e);
    return NextResponse.json({ success: false, error: "Failed to load footer settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check if enhancedStorage is available
    if (!enhancedStorage) {
      return NextResponse.json({ success: false, error: "Persistence is disabled" }, { status: 500 });
    }
    
    const body = await request.json();
    
    // Ensure sitemap link is always included in the bottom links
    let bottomLinks = body.bottom?.links || [
      { label: "Privacy Policy", href: "/legal/privacy-policy" },
      { label: "Terms of Service", href: "/legal/terms-of-service" },
      { label: "Cookie Policy", href: "/legal/cookie-policy" },
      { label: "Sitemap", href: "https://standszone.com/sitemap" },
    ];
    
    // Check if sitemap link already exists in the provided links
    const hasSitemap = bottomLinks.some((link: any) => 
      link.label === 'Sitemap' || link.href === 'https://standszone.com/sitemap'
    );
    
    // If sitemap link doesn't exist, add it after "Cookie Policy"
    if (!hasSitemap) {
      const cookiePolicyIndex = bottomLinks.findIndex((link: any) => 
        link.label === 'Cookie Policy'
      );
      
      if (cookiePolicyIndex !== -1) {
        // Insert sitemap link after Cookie Policy
        bottomLinks.splice(cookiePolicyIndex + 1, 0, {
          label: 'Sitemap',
          href: 'https://standszone.com/sitemap'
        });
      } else {
        // If Cookie Policy doesn't exist, add sitemap at the end
        bottomLinks.push({
          label: 'Sitemap',
          href: 'https://standszone.com/sitemap'
        });
      }
    }
    
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
        links: bottomLinks,
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
    console.error("Footer API PUT error:", e);
    return NextResponse.json({ success: false, error: "Failed to save footer settings" }, { status: 500 });
  }
}