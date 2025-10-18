import { notFound } from "next/navigation";
import { unifiedPlatformAPI } from "@/lib/data/unifiedPlatformData";
import BuilderProfileClient from "./BuilderProfileClient";
import { getServerSupabase } from "@/lib/supabase";

// Server component wrapper that handles params
export default async function BuilderProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

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
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (error) {
          console.log("❌ Server: Supabase error:", error);
        } else if (supabaseBuilder) {
          builder = {
            id: supabaseBuilder.id,
            companyName: supabaseBuilder.company_name,
            slug: supabaseBuilder.slug || slug,
            logo: supabaseBuilder.logo || "/images/builders/default-logo.png",
            establishedYear: supabaseBuilder.established_year || 2020,
            headquarters: {
              city: supabaseBuilder.headquarters_city || "Unknown",
              country: supabaseBuilder.headquarters_country || "Unknown",
            },
            serviceLocations: [
              {
                city: supabaseBuilder.headquarters_city || "Unknown",
                country: supabaseBuilder.headquarters_country || "Unknown",
              }
            ],
            contactInfo: {
              primaryEmail: supabaseBuilder.primary_email || "",
              phone: supabaseBuilder.phone || "",
              website: supabaseBuilder.website || "",
              contactPerson: supabaseBuilder.contact_person || "Contact Person",
              position: supabaseBuilder.position || "Manager",
            },
            services: [],
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

