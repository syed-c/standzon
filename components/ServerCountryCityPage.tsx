import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { PublicQuoteRequest } from "@/components/PublicQuoteRequest";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BuilderCard } from "./BuilderCard";
import ServerEnhancedLocationPage from "./ServerEnhancedLocationPage";
import { normalizeCountrySlug, normalizeCitySlug } from "@/lib/utils/slugUtils";
import {
  MapPin,
  Users,
  Building2,
  TrendingUp,
  Search,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Save,
  Eye,
  Globe,
  FileText,
  Settings,
  Star,
  Award,
  Calendar,
  Tag,
  Building,
} from "lucide-react";
import { getServerSupabase } from '@/lib/supabase';
import { getAllBuilders } from '@/lib/supabase/builders';
import { getServerPageContent } from '@/lib/data/serverPageContent';

interface Builder {
  id: string;
  companyName: string;
  slug: string;
  headquarters: {
    city: string;
    country: string;
  };
  serviceLocations: Array<{
    city: string;
    country: string;
  }>;
  rating: number;
  reviewCount: number;
  projectsCompleted: number;
  responseTime: string;
  verified: boolean;
  premiumMember: boolean;
  planType?: "free" | "basic" | "professional" | "enterprise";
  services: Array<{
    name: string;
    description: string;
  }>;
  specializations: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
  companyDescription: string;
  keyStrengths: string[];
  logo?: string;
  featured?: boolean;
  portfolio?: any[]; // Add portfolio field for gallery images
}

interface LocalPageContent {
  id: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  heroContent: string;
  seoKeywords: string[];
}

interface ServerCountryCityPageProps {
  country: string;
  city?: string;
  initialBuilders?: Builder[];
  initialContent?: LocalPageContent;
  isEditable?: boolean;
  onContentUpdate?: (content: any) => void;
  hideCitiesSection?: boolean;
  cities?: any[];
  showQuoteForm?: boolean;
  cmsContent?: any;
  serverCmsContent?: any;
  currentPage?: number;
  itemsPerPage?: number;
  totalBuilders?: number;
  totalPages?: number;
}

const BUILDERS_PER_PAGE = 6;

export default async function ServerCountryCityPage({
  country,
  city,
  initialBuilders = [],
  initialContent,
  isEditable = false,
  onContentUpdate,
  hideCitiesSection = false,
  cities = [],
  showQuoteForm = true,
  cmsContent,
  serverCmsContent,
  currentPage,
  itemsPerPage,
  totalBuilders: propTotalBuilders,
  totalPages: propTotalPages
}: ServerCountryCityPageProps) {
  // Fetch CMS content on the server
  let pageContent = serverCmsContent || cmsContent || initialContent || {};
  if (!pageContent || Object.keys(pageContent).length === 0) {
    try {
      const path = city
        ? `/exhibition-stands/${normalizeCountrySlug(country)}/${normalizeCitySlug(city)}`
        : `/exhibition-stands/${normalizeCountrySlug(country)}`;

      const pageId = city
        ? `${normalizeCountrySlug(country)}-${normalizeCitySlug(city)}`
        : normalizeCountrySlug(country);

      pageContent = await getServerPageContent(pageId);
    } catch (error) {
      console.error('Error fetching page content on server:', error);
    }
  }

  // Fetch builders on the server
  let builders = initialBuilders;
  if (!initialBuilders || initialBuilders.length === 0) {
    try {
      const allBuilders = await getAllBuilders();

      // Filter builders for this country (with variations)
      const normalizedCountryName = country.toLowerCase();
      const countryVariations = [normalizedCountryName];
      if (normalizedCountryName.includes("united arab emirates")) {
        countryVariations.push("uae");
      } else if (normalizedCountryName === "uae") {
        countryVariations.push("united arab emirates");
      }

      // Filter builders by location if provided
      const filteredBuilders = allBuilders.filter((builder: any) => {
        // Check headquarters country
        const headquartersCountry = (builder.headquarters_country || builder.country || '').toLowerCase().trim();
        const countryMatch = countryVariations.some(variation =>
          headquartersCountry.includes(variation)
        );

        // Check service locations
        const serviceLocations = builder.service_locations || builder.serviceLocations || [];
        const serviceLocationMatch = serviceLocations.some((loc: any) => {
          const serviceCountry = (loc.country || '').toLowerCase().trim();
          return countryVariations.some(variation =>
            serviceCountry.includes(variation)
          );
        });

        // If city is provided, also filter by city
        if (city) {
          const headquartersCity = (builder.headquarters_city || builder.city || '').toLowerCase().trim();
          const cityMatch = headquartersCity.includes(city.toLowerCase());

          const serviceCityMatch = serviceLocations.some((loc: any) => {
            const serviceCity = (loc.city || '').toLowerCase().trim();
            return serviceCity.includes(city.toLowerCase());
          });

          return (countryMatch || serviceLocationMatch) && (cityMatch || serviceCityMatch);
        }

        return countryMatch || serviceLocationMatch;
      });

      // Transform builders to match Builder interface
      builders = filteredBuilders.map((b: any) => ({
        id: b.id,
        companyName: b.company_name || b.companyName || "",
        slug: b.slug ||
          (b.company_name || b.companyName || "")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-"),
        headquarters: {
          city: b.headquarters_city || b.headquarters?.city || "Unknown",
          country:
            b.headquarters_country ||
            b.headquartersCountry ||
            b.headquarters?.country ||
            "Unknown",
        },
        serviceLocations: b.serviceLocations || b.service_locations || [],
        rating: b.rating || 0,
        reviewCount: b.reviewCount || 0,
        projectsCompleted: b.projects_completed || b.projects_completed || 0,
        responseTime: b.response_time || b.responseTime || "Within 24 hours",
        verified: b.verified || b.isVerified || false,
        premiumMember: b.premium_member || b.premiumMember || false,
        planType: b.plan_type || "free",
        services: b.services || [],
        specializations: b.specializations || [],
        companyDescription: b.description || b.company_description || "",
        keyStrengths: b.key_strengths || [],
        featured: b.featured || false,
        logo: b.logo || b.profile_image || b.image_url || b.avatar || b.photo || b.logo_url || b.brand_logo || "/images/builders/default-logo.png",
        portfolio: b.portfolio || b.gallery_images || b.images || [],
      }));
    } catch (error) {
      console.error("Error loading builders on server:", error);
      builders = [];
    }
  }

  const defaultContent = {
    id: `${normalizeCountrySlug(country)}-${city ? normalizeCitySlug(city) : 'main'}`,
    title: `Exhibition Stand Builders in ${city ? `${city}, ${country}` : country}`,
    metaTitle: `${city ? city + ', ' : ''}${country} Exhibition Stand Builders | Trade Show Booth Design`,
    metaDescription: `Leading exhibition stand builders ${city ? `in ${city}, ` : ''}${country}. Custom trade show displays, booth design, and professional exhibition services.`,
    description: `${city ? city + ', ' : ''}${country} ${city ? 'is a significant market' : 'is a significant market'} for international trade shows and exhibitions. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results ${city ? `in ${city}.` : `across ${country}'s dynamic exhibition landscape.`}`,
    heroContent: `Partner with ${city ? city + ', ' : ''}${country}'s premier exhibition stand builders for trade show success.`,
    seoKeywords: [`${country} exhibition stands`, `${country} trade show builders`, `${country} exhibition builders`, `${country} booth design`, `${country} exhibition services`]
  };

  const mergedContent = {
    ...defaultContent,
    ...(pageContent || {})
  };


  // Calculate pagination
  const effectiveItemsPerPage = itemsPerPage || BUILDERS_PER_PAGE; // Use constant instead of hardcoded 6
  const effectiveCurrentPage = currentPage || 1;

  // Paginate the builders
  const startIndex = (effectiveCurrentPage - 1) * effectiveItemsPerPage;
  const endIndex = startIndex + effectiveItemsPerPage;
  const paginatedBuilders = builders.slice(startIndex, endIndex);

  // Prepare country data for the client component
  const countryData = {
    countryName: country,
    countryCode: "", // We'll get this from a utility function if needed
    flag: "🏳️", // Placeholder flag
    cities: [] // We'll populate this if needed
  };

  return (
    <div className="font-inter">
      <ServerEnhancedLocationPage
        locationType={city ? "city" : "country"}
        locationName={city || country}
        countryName={city ? country : undefined}
        initialBuilders={paginatedBuilders}
        // we will render Cities + SEO + CTA in this parent below pagination
        suppressPostBuildersContent
        exhibitions={[]}
        venues={[]}
        pageContent={mergedContent}
        // ✅ CRITICAL FIX: Pass calculated stats to override defaults
        locationStats={{
          totalBuilders: builders.length,
          averageRating:
            builders.length > 0
              ? Math.round(
                (builders.reduce((sum, b) => sum + b.rating, 0) /
                  builders.length) *
                10
              ) / 10


              : 4.8,
          completedProjects: builders.reduce(
            (sum, b) => sum + b.projectsCompleted,
            0
          ),
          averagePrice: 450,
        }}
        // ✅ NEW: Pass server-side CMS content for immediate rendering
        serverCmsContent={pageContent}
        isEditable={false}
      // NOTE: Removed event handlers to comply with server component restrictions
      // Removed event handlers to comply with server component restrictions
      // searchTerm, onSearchTermChange, and other event handlers are removed
      // onContentUpdate is removed since isEditable is false


      />

      {/* Pagination Controls (immediately after builders) - Now using Links for SEO */}
      {(() => {
        const effectiveTotalPages = propTotalPages || Math.ceil(builders.length / effectiveItemsPerPage);
        const effectiveTotalBuilders = propTotalBuilders || builders.length;

        if (effectiveTotalPages <= 1) return null;

        // Determine base URL for pagination links
        const baseUrl = city
          ? `/exhibition-stands/${normalizeCountrySlug(country)}/${normalizeCitySlug(city)}`
          : `/exhibition-stands/${normalizeCountrySlug(country)}`;

        return (
          <section className="py-6 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {effectiveCurrentPage > 1 ? (
                  <a
                    href={`${baseUrl}?page=${effectiveCurrentPage - 1}`}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-gray-300 bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 text-gray-900 min-w-[80px]"
                  >
                    Previous
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 min-w-[80px] opacity-50 cursor-not-allowed border border-gray-300 text-gray-900">
                    Previous
                  </span>
                )}

                <div className="flex flex-wrap gap-2 justify-center">
                  {Array.from({ length: Math.min(effectiveTotalPages, 10) }, (_, i) => {
                    const pageNum = i + 1;

                    // Smart pagination: show first, last, current, and adjacent pages
                    if (effectiveTotalPages > 10) {
                      if (pageNum === 1 || pageNum === effectiveTotalPages ||
                        (pageNum >= effectiveCurrentPage - 1 && pageNum <= effectiveCurrentPage + 1)) {
                        return (
                          <a
                            key={i}
                            href={`${baseUrl}?page=${pageNum}`}
                            className={
                              effectiveCurrentPage === pageNum
                                ? "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 min-w-[40px]"
                                : "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-gray-300 bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-gray-900 min-w-[40px]"
                            }
                          >
                            {pageNum}
                          </a>
                        );
                      } else if (pageNum === 2 || pageNum === effectiveTotalPages - 1) {
                        return (
                          <span key={i} className="px-2 py-1 text-gray-500">...</span>
                        );
                      }
                      return null;
                    }

                    return (
                      <a
                        key={i}
                        href={`${baseUrl}?page=${pageNum}`}
                        className={
                          effectiveCurrentPage === pageNum
                            ? "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 min-w-[40px]"
                            : "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-gray-300 bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-gray-900 min-w-[40px]"
                        }
                      >
                        {pageNum}
                      </a>
                    );
                  })}
                </div>

                {effectiveCurrentPage < effectiveTotalPages ? (
                  <a
                    href={`${baseUrl}?page=${effectiveCurrentPage + 1}`}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-gray-300 bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 text-gray-900 min-w-[80px]"
                  >
                    Next
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 min-w-[80px] opacity-50 cursor-not-allowed border border-gray-300 text-gray-900">
                    Next
                  </span>
                )}
              </div>
              <div className="text-center text-sm text-gray-500 mt-2">
                Page {effectiveCurrentPage} of {effectiveTotalPages} ({effectiveTotalBuilders.toLocaleString()} builders)
              </div>
            </div>
          </section>
        );
      })()}



      {/* Cities Section placed after builders + pagination - hidden on city pages and specific countries */}
      {(() => {
        // For city pages, we want to hide the cities section completely
        // For country pages, show the cities section as usual
        const shouldShowCitiesSection = !city && cities && cities.length > 0 && !hideCitiesSection &&
          !['jordan', 'lebanon', 'israel'].includes(country.toLowerCase());

        return shouldShowCitiesSection && (
          <section className="py-12 bg-gray-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Cities in {country}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">


                  Browse local pages for major cities across {country}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cities.map((c, index) => {
                  // Import and use the utility function for consistent slug generation
                  const cityUrl = `/exhibition-stands/${normalizeCountrySlug(country)}/${normalizeCitySlug(c.name)}`;
                  return (
                    <a key={`${c.slug || c.name}-${index}`} href={cityUrl} className="group">
                      <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-all h-full">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-gray-900 group-hover:text-blue-700 truncate">
                            {c.name}
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {c.builderCount || 0} builders
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}
      {/* Country Services Section (H2 + paragraph) sourced from CMS */}
      {!city && (
        <section className="py-12 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {(() => {
                // Extract content from CMS structure
                let heading = `Professional Exhibition Stand Builders in ${country}`;

                // Try to get from pageContent first
                if (pageContent) {
                  const countrySlug = country
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "");


                  // Check nested structure in pageContent
                  if (pageContent?.sections?.countryPages?.[countrySlug]?.servicesHeading) {
                    const headingRaw = pageContent.sections.countryPages[countrySlug].servicesHeading;
                    heading = typeof headingRaw === 'object' ?
                      (headingRaw.heading || headingRaw.title || JSON.stringify(headingRaw)) :
                      headingRaw;
                  }
                }

                // Fallback to cmsContent
                if (cmsContent && heading === `Professional Exhibition Stand Builders in ${country}`) {
                  const countrySlug = country
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "");


                  // Check various possible structures in cmsContent
                  if (cmsContent?.sections?.countryPages?.[countrySlug]?.servicesHeading) {
                    const headingRaw = cmsContent.sections.countryPages[countrySlug].servicesHeading;
                    heading = typeof headingRaw === 'object' ?
                      (headingRaw.heading || headingRaw.title || JSON.stringify(headingRaw)) :
                      headingRaw;
                  } else if (cmsContent?.content?.sections?.countryPages?.[countrySlug]?.servicesHeading) {
                    const headingRaw = cmsContent.content.sections.countryPages[countrySlug].servicesHeading;
                    heading = typeof headingRaw === 'object' ?
                      (headingRaw.heading || headingRaw.title || JSON.stringify(headingRaw)) :
                      headingRaw;
                  } else if (cmsContent?.servicesHeading) {
                    const headingRaw = cmsContent.servicesHeading;
                    heading = typeof headingRaw === 'object' ?
                      (headingRaw.heading || headingRaw.title || JSON.stringify(headingRaw)) :
                      headingRaw;
                  }
                }

                return heading;
              })()}
            </h2>
            <div
              className="prose max-w-none leading-relaxed text-gray-900 dark:text-gray-300 prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-900 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-li:text-gray-900 dark:prose-li:text-gray-300"


              dangerouslySetInnerHTML={{
                __html: (() => {
                  // Extract content from CMS structure
                  let paragraph = `<p>${country} offers exceptional exhibition stand building services with skilled craftsmen and innovative designers. Our local builders understand regional market dynamics and can create stunning displays that attract visitors and generate leads.</p>
                     <p>With expertise in various industries including technology, healthcare, automotive, and consumer goods, ${country}'s exhibition stand builders deliver customized solutions that align with your brand identity and marketing objectives.</p>`;

                  // Try to get from pageContent first
                  if (pageContent) {
                    const countrySlug = country
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "");


                    // Check nested structure in pageContent
                    if (pageContent?.sections?.countryPages?.[countrySlug]?.servicesParagraph) {
                      const paragraphRaw = pageContent.sections.countryPages[countrySlug].servicesParagraph;
                      paragraph = typeof paragraphRaw === 'object' ?
                        (paragraphRaw.description || paragraphRaw.text || JSON.stringify(paragraphRaw)) :
                        paragraphRaw;
                    }
                  }

                  // Fallback to cmsContent
                  if (cmsContent && paragraph === `<p>${country} offers exceptional exhibition stand building services with skilled craftsmen and innovative designers. Our local builders understand regional market dynamics and can create stunning displays that attract visitors and generate leads.</p>
                     <p>With expertise in various industries including technology, healthcare, automotive, and consumer goods, ${country}'s exhibition stand builders deliver customized solutions that align with your brand identity and marketing objectives.</p>`) {
                    const countrySlug = country
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "");


                    // Check various possible structures in cmsContent
                    if (cmsContent?.sections?.countryPages?.[countrySlug]?.servicesParagraph) {
                      const paragraphRaw = cmsContent.sections.countryPages[countrySlug].servicesParagraph;
                      paragraph = typeof paragraphRaw === 'object' ?
                        (paragraphRaw.description || paragraphRaw.text || JSON.stringify(paragraphRaw)) :
                        paragraphRaw;
                    } else if (cmsContent?.content?.sections?.countryPages?.[countrySlug]?.servicesParagraph) {
                      const paragraphRaw = cmsContent.content.sections.countryPages[countrySlug].servicesParagraph;
                      paragraph = typeof paragraphRaw === 'object' ?
                        (paragraphRaw.description || paragraphRaw.text || JSON.stringify(paragraphRaw)) :
                        paragraphRaw;
                    } else if (cmsContent?.servicesParagraph) {
                      const paragraphRaw = cmsContent.servicesParagraph;
                      paragraph = typeof paragraphRaw === 'object' ?
                        (paragraphRaw.description || paragraphRaw.text || JSON.stringify(paragraphRaw)) :
                        paragraphRaw;
                    }
                  }

                  return paragraph.replace(/\r?\n/g, "<br/>");
                })()
              }}
            />
          </div>
        </section>
      )}      {/* City Services Section (H2 + paragraph) sourced from CMS */}
      {city && (
        <section className="py-12 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">


              {(() => {
                const countrySlug = country
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "");
                const citySlug = city
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "");
                const key = `${countrySlug}-${citySlug}`;


                // Try multiple sources for city content
                let contentSource = null;

                // First try pageContent
                if (pageContent) {
                  const raw = (pageContent as any)?.sections?.cityPages?.[key];
                  if (raw?.countryPages?.[citySlug]) {
                    contentSource = raw.countryPages[citySlug];
                  } else if (raw?.countryPages?.[city.toLowerCase()]) {
                    contentSource = raw.countryPages[city.toLowerCase()];
                  } else {
                    contentSource = raw;
                  }
                }

                // If no content from pageContent, try cmsContent
                if (!contentSource && cmsContent) {
                  const raw = (cmsContent as any)?.sections?.cityPages?.[key];
                  if (raw?.countryPages?.[citySlug]) {
                    contentSource = raw.countryPages[citySlug];
                  } else if (raw?.countryPages?.[city.toLowerCase()]) {
                    contentSource = raw.countryPages[city.toLowerCase()];
                  } else {
                    contentSource = raw;
                  }
                }

                // Fix: Ensure we're not passing objects directly to JSX
                const headingRaw =
                  contentSource?.servicesHeading ||
                  (cmsContent as any)?.sections?.cityPages?.[key]?.servicesHeading ||
                  (cmsContent as any)?.servicesHeading;

                // Ensure heading is a string, not an object
                const heading = typeof headingRaw === 'object' ? headingRaw?.heading || `Expert Exhibition Stand Builders in ${city}, ${country}` : headingRaw || `Expert Exhibition Stand Builders in ${city}, ${country}`;
                return heading;
              })()}
            </h2>
            <div
              className="prose max-w-none leading-relaxed text-gray-900 dark:text-gray-300 prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-900 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-li:text-gray-900 dark:prose-li:text-gray-300"


              dangerouslySetInnerHTML={{
                __html: (() => {
                  const countrySlug = country
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "");
                  const citySlug = city
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "");
                  const key = `${countrySlug}-${citySlug}`;


                  // Try multiple sources for city content
                  let contentSource = null;

                  // First try pageContent
                  if (pageContent) {
                    const raw = (pageContent as any)?.sections?.cityPages?.[key];
                    if (raw?.countryPages?.[citySlug]) {
                      contentSource = raw.countryPages[citySlug];
                    } else if (raw?.countryPages?.[city.toLowerCase()]) {
                      contentSource = raw.countryPages[city.toLowerCase()];
                    } else {
                      contentSource = raw;
                    }
                  }

                  // If no content from pageContent, try cmsContent
                  if (!contentSource && cmsContent) {
                    const raw = (cmsContent as any)?.sections?.cityPages?.[key];
                    if (raw?.countryPages?.[citySlug]) {
                      contentSource = raw.countryPages[citySlug];
                    } else if (raw?.countryPages?.[city.toLowerCase()]) {
                      contentSource = raw.countryPages[city.toLowerCase()];
                    } else {
                      contentSource = raw;
                    }
                  }

                  // Fix: Ensure we're not passing objects directly to JSX
                  const paragraphRaw =
                    contentSource?.servicesParagraph ||
                    (cmsContent as any)?.sections?.cityPages?.[key]
                      ?.servicesParagraph ||
                    (cmsContent as any)?.servicesParagraph;


                  // Ensure paragraph is a string, not an object
                  const paragraph = typeof paragraphRaw === 'object' ? paragraphRaw?.description ||
                    `<p>${city}, ${country} provides access to top-tier exhibition stand builders who specialize in creating impactful displays for trade shows and exhibitions. Our local experts combine creativity with technical excellence to deliver solutions that exceed expectations.</p>
                     <p>Whether you need a modular booth, custom island display, or specialty activation, ${city}'s exhibition stand builders offer comprehensive services from concept to installation, ensuring your brand stands out in competitive environments.</p>`
                    : paragraphRaw ||


                    `<p>${city}, ${country} provides access to top-tier exhibition stand builders who specialize in creating impactful displays for trade shows and exhibitions. Our local experts combine creativity with technical excellence to deliver solutions that exceed expectations.</p>
                     <p>Whether you need a modular booth, custom island display, or specialty activation, ${city}'s exhibition stand builders offer comprehensive services from concept to installation, ensuring your brand stands out in competitive environments.</p>`;
                  return paragraph.replace(/\r?\n/g, "<br/>");
                })()
              }}
            />
          </div>
        </section>
      )}
      {/* Quote Request Form placed just above the final CTA (only for city pages) */}
      {Boolean(city) && (
        <section className="py-12 bg-gray-50 dark:bg-slate-950">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {`Get Free Quotes from ${city} Builders`}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">


                Submit your requirements and receive competitive quotes from
                verified local builders
              </p>
            </div>
            <div className="max-w-4xl mx-auto flex justify-center">
              <PublicQuoteRequest
                location={country}
                countryCode={country === 'Germany' ? 'DE' :
                  country === 'United Arab Emirates' ? 'AE' :
                    country === 'United Kingdom' ? 'GB' :
                      country === 'France' ? 'FR' :
                        country === 'Spain' ? 'ES' :
                          country === 'Italy' ? 'IT' :
                            country === 'Netherlands' ? 'NL' :
                              country === 'Switzerland' ? 'CH' :
                                country === 'Australia' ? 'AU' :
                                  country === 'India' ? 'IN' :
                                    country === 'Singapore' ? 'SG' :
                                      country === 'China' ? 'CN' : 'US'}


                cityName={city}
                buttonText="Get Free Quote"
                size="lg"
                className=""
              />
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA moved to the very bottom - now sourced from CMS/Supabase */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {(() => {
                const countrySlug = country
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "");
                const citySlug = city
                  ? city
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "")
                  : "";
                const key = city ? `${countrySlug}-${citySlug}` : "";
                const countryBlock =
                  (pageContent as any)?.sections?.countryPages?.[countrySlug] ||
                  (cmsContent as any)?.sections?.countryPages?.[countrySlug] ||
                  (cmsContent as any) ||
                  {};
                const rawCity = city
                  ? (pageContent as any)?.sections?.cityPages?.[key]
                  : null;
                const nestedCity = city && citySlug
                  ? (rawCity as any)?.countryPages?.[citySlug] ? (rawCity as any).countryPages[citySlug] : rawCity
                  : null;
                const cityBlock = city
                  ? nestedCity ||
                  (cmsContent as any)?.sections?.cityPages?.[key] ||
                  (cmsContent as any) ||
                  {}
                  : null;
                const block = city ? cityBlock || {} : countryBlock || {};

                // Fix: Ensure we're not passing objects directly to JSX
                const headingRaw =
                  (block as any)?.finalCtaHeading ||
                  `Ready to Find Your Perfect Builder in ${city || country}?`;

                // Ensure values are strings, not objects
                const heading = typeof headingRaw === 'object' ? headingRaw?.heading || headingRaw : headingRaw;
                return heading;
              })()}
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              {(() => {
                const countrySlug = country
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "");
                const citySlug = city
                  ? city
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "")
                  : "";
                const key = city ? `${countrySlug}-${citySlug}` : "";
                const countryBlock =
                  (pageContent as any)?.sections?.countryPages?.[countrySlug] ||
                  (cmsContent as any)?.sections?.countryPages?.[countrySlug] ||
                  (cmsContent as any) ||
                  {};
                const rawCity = city
                  ? (pageContent as any)?.sections?.cityPages?.[key]
                  : null;
                const nestedCity = city && citySlug
                  ? (rawCity as any)?.countryPages?.[citySlug] ? (rawCity as any).countryPages[citySlug] : rawCity
                  : null;
                const cityBlock = city
                  ? nestedCity ||
                  (cmsContent as any)?.sections?.cityPages?.[key] ||
                  (cmsContent as any) ||
                  {}
                  : null;
                const block = city ? cityBlock || {} : countryBlock || {};

                // Fix: Ensure we're not passing objects directly to JSX
                const paragraphRaw =
                  (block as any)?.finalCtaParagraph ||
                  "Get competitive quotes from verified local builders. Compare proposals and choose the best fit for your exhibition needs.";

                // Ensure values are strings, not objects
                const paragraph = typeof paragraphRaw === 'object' ? paragraphRaw?.description || paragraphRaw : paragraphRaw;
                return paragraph;
              })()}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="text-lg px-8 py-4 text-black">
                {(() => {
                  const countrySlug = country
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "");
                  const citySlug = city
                    ? city
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "")
                    : "";
                  const key = city ? `${countrySlug}-${citySlug}` : "";
                  const countryBlock =
                    (pageContent as any)?.sections?.countryPages?.[countrySlug] ||
                    (cmsContent as any)?.sections?.countryPages?.[countrySlug] ||
                    (cmsContent as any) ||
                    {};
                  const rawCity = city
                    ? (pageContent as any)?.sections?.cityPages?.[key]
                    : null;
                  const nestedCity = city && citySlug
                    ? (rawCity as any)?.countryPages?.[citySlug] || rawCity
                    : null;
                  const cityBlock = city
                    ? nestedCity ||
                    (cmsContent as any)?.sections?.cityPages?.[key] ||
                    (cmsContent as any) ||
                    {}
                    : null;
                  const block = city ? cityBlock || {} : countryBlock || {};

                  // Fix: Ensure we're not passing objects directly to JSX
                  const buttonTextRaw =
                    (block as any)?.finalCtaButtonText || "Start Getting Quotes";

                  // Ensure values are strings, not objects
                  const buttonText = typeof buttonTextRaw === 'object' ? buttonTextRaw?.text || buttonTextRaw : buttonTextRaw;
                  return buttonText;
                })()}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/20 hover:text-gray-900 backdrop-blur-sm text-lg px-8 py-4 shadow-lg"
              // onClick handler removed to comply with server component restrictions
              >
                Back to Top
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Cities section was moved to top */}
    </div >

  );
}