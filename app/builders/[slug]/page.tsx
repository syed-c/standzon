import { notFound } from "next/navigation";
import { unifiedPlatformAPI } from "@/lib/data/unifiedPlatformData";
import BuilderProfileClient from "./BuilderProfileClient";
import { getServerSupabase } from '@/lib/supabase';
import { getFallbackData } from '@/lib/fallback-data';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    robots: {
      index: false,
      follow: true,
      nocache: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
  };
}

// Server component wrapper that handles params
export default async function BuilderProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  console.log("🚀 BuilderProfilePage: Starting");

  const { slug } = params;
  console.log("✅ Params resolved, slug:", slug);
  console.log("✅ Slug length:", slug.length);

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
          .maybeSingle(); // Use maybeSingle instead of single to handle cases where no data is found

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
        } else {
          // Try the 'builders' table as fallback
          console.log("🔍 Server: Trying 'builders' table as fallback");
          const { data: buildersTableData, error: buildersError } = await sb
            .from('builders')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();

          console.log("🔍 Builders table query result:", { data: buildersTableData, error: buildersError });

          if (buildersError) {
            console.log("❌ Server: Builders table error:", buildersError);
          } else if (buildersTableData) {
            // Convert builders table data to the expected format
            builder = {
              id: buildersTableData.id,
              companyName: buildersTableData.company_name,
              slug: buildersTableData.slug || slug,
              logo: buildersTableData.logo || "/images/builders/default-logo.png",
              establishedYear: new Date().getFullYear(),
              headquarters: {
                city: buildersTableData.headquarters_city || "Unknown",
                country: buildersTableData.headquarters_country || "Unknown",
              },
              serviceLocations: [{
                country: buildersTableData.headquarters_country || "Unknown",
                cities: [buildersTableData.headquarters_city || "Unknown"]
              }],
              contactInfo: {
                primaryEmail: buildersTableData.primary_email || "",
                phone: buildersTableData.phone || "",
                website: buildersTableData.website || "",
                contactPerson: "Contact Person",
                position: "Manager",
              },
              teamSize: 0,
              businessType: 'company',
              services: [],
              portfolio: [],
              specializations: [
                { id: 'general', name: 'Exhibition Builder', icon: '🏗️', color: '#3B82F6' }
              ],
              companyDescription: buildersTableData.company_description || 'Professional exhibition services provider',
              keyStrengths: ["Professional Service", "Quality Work", "Local Expertise"],
              projectsCompleted: 0,
              rating: buildersTableData.rating || 0,
              reviewCount: buildersTableData.review_count || 0,
              responseTime: 'Contact for response time',
              languages: ['English'],
              verified: buildersTableData.verified || false,
              premiumMember: false,
              claimed: buildersTableData.claimed || false,
              claimStatus: buildersTableData.claim_status || 'unclaimed',
              planType: 'free',
            } as any;
            console.log("✅ Server: Found builder in builders table:", builder?.companyName);
          }
        }
      }
    } catch (error) {
      console.error("❌ Server: Error querying Supabase:", error);
    }
  }

  if (!builder) {
    console.log("❌ Server: Builder not found with slug:", slug);
    // Let's also try to find a builder with a similar slug (in case of URL encoding issues)
    try {
      const sb = getServerSupabase();
      if (sb) {
        console.log("🔍 Server: Trying fuzzy search for builder with slug:", slug);
        const { data: allBuilders, error } = await sb
          .from('builder_profiles')
          .select('*');

        if (!error && allBuilders) {
          const similarBuilder = allBuilders.find(b => b.slug && b.slug.includes(slug.substring(0, Math.min(20, slug.length))));
          if (similarBuilder) {
            console.log("🔍 Server: Found similar builder:", similarBuilder.company_name, similarBuilder.slug);
          }
        }
      }
    } catch (error) {
      console.error("❌ Server: Error in fuzzy search:", error);
    }

    notFound();
  }

  console.log("✅ Server: Found builder:", builder.companyName);
  return (
    <BuilderProfileClient slug={slug} initialBuilder={builder} />
  );
}