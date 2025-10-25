import { notFound } from "next/navigation";
import { unifiedPlatformAPI } from "@/lib/data/unifiedPlatformData";
import BuilderProfileClient from "./BuilderProfileClient";
import { getServerSupabase } from "@/lib/supabase";

// Server component wrapper that handles params
export default async function BuilderProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  console.log("🔍 Server: Looking for builder with slug:", slug);

  // Try unified platform in-memory first
  const unifiedBuilders = unifiedPlatformAPI.getBuilders();
  let builder = unifiedBuilders.find((b) => b.slug === slug);

  // Fallback: query Supabase by slug
  if (!builder) {
    try {
      const sb = getServerSupabase();
      if (sb) {
        console.log("🔍 Server: Querying Supabase for builder with slug:", slug);
        
        const { data: supabaseBuilder, error } = await sb
          .from('builder_profiles')
          .select(`
            *,
            builder_service_locations!left(
              id,
              city,
              country,
              country_code,
              is_headquarters
            ),
            builder_services!left(
              id,
              name,
              description,
              category,
              price_from,
              currency,
              unit
            ),
            portfolio_items!left(
              id,
              title,
              description,
              image_url,
              project_year,
              client,
              trade_show,
              stand_size,
              category
            )
          `)
          .eq('slug', slug)
          .single();
        
        if (error) {
          console.log("❌ Server: Supabase error:", error);
        } else if (supabaseBuilder) {
          builder = {
            id: supabaseBuilder.id,
            companyName: supabaseBuilder.company_name,
            slug: (supabaseBuilder.slug || slug || '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, ''),
            logo: supabaseBuilder.logo || "/images/builders/default-logo.png",
            establishedYear: supabaseBuilder.established_year || 2020,
            headquarters: {
              city: supabaseBuilder.headquarters_city || (supabaseBuilder as any).city || "Unknown",
              country: supabaseBuilder.headquarters_country || (supabaseBuilder as any).country || "Unknown",
            },
            serviceLocations: (() => {
              // Process service locations from the joined table
              const serviceLocations: Array<{country: string, cities: string[]}> = [];
              if (supabaseBuilder.builder_service_locations && supabaseBuilder.builder_service_locations.length > 0) {
                // Group by country
                const countryMap = new Map();
                supabaseBuilder.builder_service_locations.forEach((loc: any) => {
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
              
              // If no service locations, use headquarters
              if (serviceLocations.length === 0) {
                serviceLocations.push({
                  country: supabaseBuilder.headquarters_country || "Unknown",
                  cities: [supabaseBuilder.headquarters_city || "Unknown"]
                });
              }
              
              return serviceLocations;
            })(),
            contactInfo: {
              primaryEmail: supabaseBuilder.primary_email || "",
              phone: supabaseBuilder.phone || "",
              website: supabaseBuilder.website || "",
              contactPerson: supabaseBuilder.contact_person || "Contact Person",
              position: supabaseBuilder.position || "Manager",
            },
            services: (() => {
              // Process services from the joined table
              const services: Array<{name: string, description: string, category: string, priceFrom?: string, currency?: string, unit?: string}> = [];
              if (supabaseBuilder.builder_services && supabaseBuilder.builder_services.length > 0) {
                supabaseBuilder.builder_services.forEach((service: any) => {
                  if (service.name) {
                    services.push({
                      name: service.name,
                      description: service.description || '',
                      category: service.category || 'CUSTOM_DESIGN',
                      priceFrom: service.price_from ? service.price_from.toString() : undefined,
                      currency: service.currency || 'USD',
                      unit: service.unit || 'per project'
                    });
                  }
                });
              }
              return services;
            })(),
            portfolio: (() => {
              // Process portfolio items from the joined table
              const portfolio: Array<{title: string, description?: string, imageUrl: string, projectYear?: number, client?: string, tradeShow?: string, standSize?: number}> = [];
              if (supabaseBuilder.portfolio_items && supabaseBuilder.portfolio_items.length > 0) {
                supabaseBuilder.portfolio_items.forEach((item: any) => {
                  if (item.title) {
                    portfolio.push({
                      title: item.title,
                      description: item.description || '',
                      imageUrl: item.image_url || '/images/portfolio/placeholder.jpg',
                      projectYear: item.project_year,
                      client: item.client,
                      tradeShow: item.trade_show,
                      standSize: item.stand_size
                    });
                  }
                });
              }
              return portfolio;
            })(),
            specializations: [
              { id: 'general', name: 'Exhibition Builder', icon: '🏗️', color: '#3B82F6' }
            ],
            companyDescription: supabaseBuilder.company_description || 'Professional exhibition services provider',
            keyStrengths: ["Professional Service", "Quality Work", "Local Expertise"],
            projectsCompleted: supabaseBuilder.projects_completed || 25,
            rating: supabaseBuilder.rating || 4.0,
            reviewCount: supabaseBuilder.review_count || 0,
            responseTime: supabaseBuilder.response_time || 'Within 24 hours',
            languages: supabaseBuilder.languages || ['English'],
            verified: supabaseBuilder.verified || false,
            premiumMember: supabaseBuilder.premium_member || false,
            claimed: supabaseBuilder.claimed || false,
            claimStatus: supabaseBuilder.claim_status || 'unclaimed',
            planType: 'free',
          } as any;
          console.log("✅ Server: Found builder in Supabase:", builder?.companyName);
        }
      }
    } catch (error) {
      console.error("❌ Server: Error querying Supabase:", error);
    }
  }

  if (!builder) {
    console.log("❌ Server: Builder not found with slug:", slug);
    notFound();
  }

  console.log("✅ Server: Found builder:", builder.companyName);
  return <BuilderProfileClient slug={slug} initialBuilder={builder} />;
}

