import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { CountryCityPage } from "@/components/CountryCityPage";
import { GLOBAL_EXHIBITION_DATA } from "@/lib/data/globalCities";
import { getServerSupabase } from "@/lib/supabase";

// Create a map for easy lookup
const COUNTRY_DATA: Record<string, any> = {};
GLOBAL_EXHIBITION_DATA.countries.forEach(country => {
  COUNTRY_DATA[country.slug] = {
    name: country.name,
    code: country.countryCode,
    flag: '🏳️' // Placeholder flag
  };
});

interface CountryPageProps {
  params: Promise<{
    country: string;
  }>;
}

// Fetch CMS content for the country page
async function getCountryPageContent(countrySlug: string) {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log("🔍 Server-side: Fetching CMS data for country:", countrySlug);
      
      const result = await sb
        .from("page_contents")
        .select("content")
        .eq("id", countrySlug)
        .single();

      if (result.error) {
        console.log("❌ Server-side: Supabase error:", result.error);
        return null;
      }

      if (result.data?.content) {
        console.log("✅ Server-side: Found CMS data for country:", countrySlug);
        return result.data.content;
      }
    }

    return null;
  } catch (error) {
    console.error("❌ Error fetching country page content:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country: countrySlug } = await params;
  const countryInfo = COUNTRY_DATA[countrySlug as keyof typeof COUNTRY_DATA];
  
  if (!countryInfo) {
    return {
      title: 'Country Not Found',
      description: 'The requested country page was not found.',
    };
  }

  // Try to fetch CMS content for metadata
  let cmsMetadata = null;
  try {
    const sb = getServerSupabase();
    if (sb) {
      const result = await sb
        .from('page_contents')
        .select('content')
        .eq('id', countrySlug)
        .single();
        
      if (!result.error && result.data?.content) {
        const content = result.data.content;
        const seo = content.seo || {};
        const hero = content.hero || {};
        
        cmsMetadata = {
          title: seo.metaTitle || hero.title || `Exhibition Stand Builders in ${countryInfo.name} | Professional Trade Show Displays`,
          description: seo.metaDescription || `Find professional exhibition stand builders across ${countryInfo.name}. Custom trade show displays, booth design, and comprehensive exhibition services.`,
          keywords: seo.keywords || [`exhibition stands ${countryInfo.name}`, `booth builders ${countryInfo.name}`, `trade show displays ${countryInfo.name}`, `${countryInfo.name} exhibition builders`, `${countryInfo.name} booth design`, `${countryInfo.name} exhibition stands`],
        };
      }
    }
  } catch (error) {
    console.error('❌ Error fetching CMS metadata:', error);
  }

  // Use CMS metadata if available, otherwise fall back to default
  const title = cmsMetadata?.title || `Exhibition Stand Builders in ${countryInfo.name} | Professional Trade Show Displays`;
  const description = cmsMetadata?.description || `Find professional exhibition stand builders across ${countryInfo.name}. Custom trade show displays, booth design, and comprehensive exhibition services.`;
  const keywords = cmsMetadata?.keywords || [`exhibition stands ${countryInfo.name}`, `booth builders ${countryInfo.name}`, `trade show displays ${countryInfo.name}`, `${countryInfo.name} exhibition builders`, `${countryInfo.name} booth design`, `${countryInfo.name} exhibition stands`];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/exhibition-stands/${countrySlug}`,
    },
  };
}

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: countrySlug } = await params;
  const countryInfo = COUNTRY_DATA[countrySlug as keyof typeof COUNTRY_DATA];
  
  if (!countryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Country Not Found</h1>
          <p>The requested country page was not found.</p>
        </div>
      </div>
    );
  }

  console.log(`${countryInfo.flag} Loading ${countryInfo.name} page with modern UI...`);
  
  const cmsContent = await getCountryPageContent(countrySlug);
  
  // Fetch builders from Supabase API
  let builders = [];
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/admin/builders?limit=1000&prioritize_real=true`,
      { cache: "no-store" }
    );
    const data = await response.json();
    
    if (data.success && data.data && Array.isArray(data.data.builders)) {
      // Handle country name variations (UAE vs United Arab Emirates)
      const countryVariations = [countryInfo.name];
      if (countryInfo.name === "United Arab Emirates") {
        countryVariations.push("UAE");
      } else if (countryInfo.name === "UAE") {
        countryVariations.push("United Arab Emirates");
      }
      
      // Filter builders for this country (with variations)
      builders = data.data.builders.filter((builder: any) => {
        const headquartersCountry = builder.headquarters_country;
        const headquartersMatch = countryVariations.includes(headquartersCountry);
        return headquartersMatch;
      });
      
      // Deduplicate builders by ID
      const builderMap = new Map();
      builders.forEach((builder: any) => {
        if (!builderMap.has(builder.id)) {
          builderMap.set(builder.id, builder);
        }
      });
      
      builders = Array.from(builderMap.values());
    }
  } catch (error) {
    console.error("❌ Error loading builders:", error);
  }
  
  const defaultContent = {
    id: `${countrySlug}-main`,
    title: `Exhibition Stand Builders in ${countryInfo.name}`,
    metaTitle: `${countryInfo.name} Exhibition Stand Builders | Trade Show Booth Design`,
    metaDescription: `Leading exhibition stand builders across ${countryInfo.name}. Custom trade show displays, booth design, and professional exhibition services.`,
    description: `${countryInfo.name} is a significant market for international trade shows and exhibitions. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in ${countryInfo.name}'s dynamic exhibition landscape.`,
    heroContent: `Partner with ${countryInfo.name}'s premier exhibition stand builders for trade show success across the country.`,
    seoKeywords: [`${countryInfo.name} exhibition stands`, `${countryInfo.name} trade show builders`, `${countryInfo.name} exhibition builders`, `${countryInfo.name} booth design`, `${countryInfo.name} exhibition services`]
  };
  
  const countryBlock = cmsContent?.sections?.countryPages?.[countrySlug] || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };

  // Prepare country data for the client component
  const countryData = {
    countryName: countryInfo.name,
    countryCode: countryInfo.code,
    flag: countryInfo.flag,
    cities: [] // We'll populate this if needed
  };

  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country={countryInfo.name}
        initialBuilders={builders}
        initialContent={mergedContent}
        cmsContent={cmsContent}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}