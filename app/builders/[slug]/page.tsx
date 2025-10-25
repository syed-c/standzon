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
  console.log("🚀 BuilderProfilePage: Starting");
  
  let slug: string;
  try {
    const resolvedParams = await params;
    slug = resolvedParams.slug;
    console.log("✅ Params resolved, slug:", slug);
  } catch (error) {
    console.error("❌ Error resolving params:", error);
    notFound();
  }

  console.log("🔍 Server: Looking for builder with slug:", slug);

  // Try unified platform in-memory first
  const unifiedBuilders = unifiedPlatformAPI.getBuilders();
  console.log("📊 Unified platform builders count:", unifiedBuilders.length);
  let builder = unifiedBuilders.find((b) => b.slug === slug);
  console.log("🔍 Builder found in unified platform:", !!builder);

  // Fallback: query Supabase by slug
  if (!builder) {
    try {
      const sb = getServerSupabase();
      console.log("🔍 Supabase client available:", !!sb);
      
      if (sb) {
        console.log("🔍 Server: Querying Supabase for builder with slug:", slug);
        
        // Use simple query first to avoid complex join issues
        const { data: supabaseBuilder, error } = await sb
          .from('builder_profiles')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        
        console.log("🔍 Supabase query result:", { data: supabaseBuilder, error });
        
        if (error) {
          console.log("❌ Server: Supabase error:", error);
        } else if (supabaseBuilder) {
          // Load portfolio data from portfolio_items table
          let portfolio: any[] = [];
          try {
            const { data: portfolioData } = await sb
              .from('portfolio_items')
              .select('*')
              .eq('builder_id', supabaseBuilder.id)
              .order('year', { ascending: false });
            
            portfolio = (portfolioData || []).map((item: any) => ({
              id: item.id,
              title: item.project_name,
              description: item.description || '',
              imageUrl: item.images && item.images.length > 0 ? item.images[0] : '/images/portfolio/placeholder.jpg',
              projectYear: item.year,
              tradeShow: item.trade_show || '',
              client: item.client_name || '',
              standSize: item.stand_size || 0,
              createdAt: item.created_at
            }));
            console.log("✅ Portfolio loaded for public page:", portfolio.length);
          } catch (error) {
            console.log("❌ Error loading portfolio:", error);
            portfolio = [];
          }

          // Load services from builder_services table
          let services: any[] = [];
          try {
            const { data: servicesData } = await sb
              .from('builder_services')
              .select('*')
              .eq('builder_id', supabaseBuilder.id);
            
            services = (servicesData || []).map((item: any) => ({
              id: item.id,
              name: item.name,
              description: item.description || '',
              category: item.category,
              priceFrom: item.price_from || 0,
              currency: item.currency || 'USD',
              unit: item.unit || 'per project'
            }));
            console.log("✅ Services loaded for public page:", services.length);
          } catch (error) {
            console.log("❌ Error loading services:", error);
            services = [];
          }

          // Load service locations from builder_service_locations table
          let serviceLocations = [];
          try {
            const { data: locationsData } = await sb
              .from('builder_service_locations')
              .select('*')
              .eq('builder_id', supabaseBuilder.id);
            
            // Group by country
            const countryMap = new Map();
            (locationsData || []).forEach((loc: any) => {
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
            
            // If no service locations, use headquarters
            if (serviceLocations.length === 0) {
              serviceLocations.push({
                country: supabaseBuilder.headquarters_country || "Unknown",
                cities: [supabaseBuilder.headquarters_city || "Unknown"]
              });
            }
            console.log("✅ Service locations loaded:", serviceLocations.length);
          } catch (error) {
            console.log("❌ Error loading service locations:", error);
            serviceLocations = [{
              country: supabaseBuilder.headquarters_country || "Unknown",
              cities: [supabaseBuilder.headquarters_city || "Unknown"]
            }];
          }

          // Convert Supabase data to the expected format
          builder = {
            id: supabaseBuilder.id,
            companyName: supabaseBuilder.company_name,
            slug: supabaseBuilder.slug || slug,
            logo: supabaseBuilder.logo || "/images/builders/default-logo.png",
            establishedYear: supabaseBuilder.established_year || new Date().getFullYear(),
            headquarters: {
              city: supabaseBuilder.headquarters_city || "Unknown",
              country: supabaseBuilder.headquarters_country || "Unknown",
            },
            serviceLocations: serviceLocations,
            contactInfo: {
              primaryEmail: supabaseBuilder.primary_email || "",
              phone: supabaseBuilder.phone || "",
              website: supabaseBuilder.website || "",
              contactPerson: supabaseBuilder.contact_person || "Contact Person",
              position: supabaseBuilder.position || "Manager",
            },
            teamSize: supabaseBuilder.team_size || 0,
            businessType: supabaseBuilder.business_type || 'company',
            services: services,
            portfolio: portfolio,
            specializations: [
              { id: 'general', name: 'Exhibition Builder', icon: '🏗️', color: '#3B82F6' }
            ],
            companyDescription: (() => {
              let desc = supabaseBuilder.company_description || '';
              // Remove SERVICE_LOCATIONS JSON from description
              desc = desc.replace(/\n\nSERVICE_LOCATIONS:\[.*?\]/g, '');
              desc = desc.replace(/SERVICE_LOCATIONS:\[.*?\]/g, '');
              desc = desc.replace(/\n\n.*SERVICE_LOCATIONS.*$/g, '');
              desc = desc.replace(/.*SERVICE_LOCATIONS.*$/g, '');
              // Remove any remaining raw data patterns
              desc = desc.replace(/sdfghjl.*$/g, '');
              desc = desc.replace(/testing.*$/g, '');
              desc = desc.replace(/sdfghj.*$/g, '');
              desc = desc.trim();
              return desc || 'Professional exhibition services provider';
            })(),
            keyStrengths: (() => {
              // Try to get key strengths from database or use defaults
              const strengths = [];
              if (supabaseBuilder.verified) strengths.push("Verified Builder");
              if (supabaseBuilder.projects_completed && supabaseBuilder.projects_completed > 0) {
                strengths.push(`${supabaseBuilder.projects_completed} Projects Completed`);
              }
              if (supabaseBuilder.team_size && supabaseBuilder.team_size > 0) {
                strengths.push(`${supabaseBuilder.team_size} Team Members`);
              }
              return strengths.length > 0 ? strengths : ["Professional Service", "Quality Work", "Local Expertise"];
            })(),
            projectsCompleted: supabaseBuilder.projects_completed || 0,
            rating: supabaseBuilder.rating || 0,
            reviewCount: supabaseBuilder.review_count || 0,
            responseTime: supabaseBuilder.response_time || 'Contact for response time',
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

