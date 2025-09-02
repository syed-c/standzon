import { notFound } from "next/navigation";
import { unifiedPlatformAPI } from "@/lib/data/unifiedPlatformData";
import BuilderProfileClient from "./BuilderProfileClient";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

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

  // Fallback: query Convex by slug
  if (!builder) {
    try {
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
      if (convexUrl) {
        const convex = new ConvexHttpClient(convexUrl);
        const convexBuilder = await convex.query(api.builders.getBuilderBySlug, { slug });
        if (convexBuilder) {
          builder = {
            id: convexBuilder._id,
            companyName: convexBuilder.companyName,
            slug: convexBuilder.slug || slug,
            logo: convexBuilder.logo || "/images/builders/default-logo.png",
            establishedYear: convexBuilder.establishedYear || 2020,
            headquarters: {
              city: convexBuilder.headquartersCity || "Unknown",
              country: convexBuilder.headquartersCountry || "Unknown",
            },
            serviceLocations: (convexBuilder.serviceLocations || []).map((l: any) => ({ city: l.city, country: l.country })),
            contactInfo: {
              primaryEmail: convexBuilder.primaryEmail || "",
              phone: convexBuilder.phone || "",
              website: convexBuilder.website || "",
              contactPerson: convexBuilder.contactPerson || "Contact Person",
              position: convexBuilder.position || "Manager",
            },
            services: convexBuilder.services || [],
            specializations: convexBuilder.specializations || [
              { id: 'general', name: 'Exhibition Builder', icon: '🏗️', color: '#3B82F6' }
            ],
            companyDescription: convexBuilder.companyDescription || 'Professional exhibition services provider',
            keyStrengths: ["Professional Service", "Quality Work", "Local Expertise"],
            projectsCompleted: convexBuilder.projectsCompleted || 25,
            rating: convexBuilder.rating || 4.0,
            reviewCount: convexBuilder.reviewCount || 0,
            responseTime: convexBuilder.responseTime || 'Within 24 hours',
            languages: convexBuilder.languages || ['English'],
            verified: convexBuilder.verified || false,
            premiumMember: convexBuilder.premiumMember || false,
            claimed: convexBuilder.claimed || false,
            claimStatus: convexBuilder.claimStatus || 'unclaimed',
            planType: 'free',
          } as any;
        }
      }
    } catch {}
  }

  if (!builder) {
    console.log("❌ Server: Builder not found with slug:", slug);
    notFound();
  }

  console.log("✅ Server: Found builder:", builder.companyName);
  return <BuilderProfileClient slug={slug} initialBuilder={builder} />;
}
