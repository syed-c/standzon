import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { PublicQuoteRequest } from "@/components/PublicQuoteRequest";
import { BuilderCard } from "./BuilderCard";
import ServerEnhancedLocationPage from "./ServerEnhancedLocationPage";
import BuildersLoadMore from "./BuildersLoadMore";
import { normalizeCountrySlug, normalizeCitySlug } from "@/lib/utils/slugUtils";
import {
  MapPin,
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Building,
  Star,
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
  portfolio?: any[];
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
      const normalizedCountryName = country.toLowerCase();
      const countryVariations = [normalizedCountryName];
      if (normalizedCountryName.includes("united arab emirates")) {
        countryVariations.push("uae");
      } else if (normalizedCountryName === "uae") {
        countryVariations.push("united arab emirates");
      }

      const filteredBuilders = allBuilders.filter((builder: any) => {
        const headquartersCountry = (builder.headquarters_country || builder.country || '').toLowerCase().trim();
        const countryMatch = countryVariations.some(variation => headquartersCountry.includes(variation));
        const serviceLocations = builder.service_locations || builder.serviceLocations || [];
        const serviceLocationMatch = serviceLocations.some((loc: any) => {
          const serviceCountry = (loc.country || '').toLowerCase().trim();
          return countryVariations.some(variation => serviceCountry.includes(variation));
        });

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

      builders = filteredBuilders.map((b: any) => ({
        id: b.id,
        companyName: b.company_name || b.companyName || "",
        slug: b.slug || (b.company_name || b.companyName || "").toLowerCase().replace(/[^a-z0-9]/g, "-"),
        headquarters: {
          city: b.headquarters_city || b.headquarters?.city || "Unknown",
          country: b.headquarters_country || b.headquartersCountry || b.headquarters?.country || "Unknown",
        },
        serviceLocations: b.serviceLocations || b.service_locations || [],
        rating: b.rating || 0,
        reviewCount: b.reviewCount || 0,
        projectsCompleted: b.projects_completed || 0,
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
    description: `${city ? city + ', ' : ''}${country} is a significant market for international trade shows and exhibitions. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results.`,
    heroContent: `Partner with ${city ? city + ', ' : ''}${country}'s premier exhibition stand builders for trade show success.`,
    seoKeywords: [`${country} exhibition stands`, `${country} trade show builders`]
  };

  const mergedContent = {
    ...defaultContent,
    ...(pageContent || {})
  };

  // Helper to resolve CMS text
  const resolveText = (raw: any, fallback: string = '') => {
    if (!raw) return fallback;
    if (typeof raw === 'string') return raw;
    if (typeof raw === 'object') return raw.description || raw.text || raw.heading || raw.title || fallback;
    return fallback;
  };

  // Resolve services heading & paragraph for the Insights section
  const getServicesContent = () => {
    const countrySlug = country.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const citySlug = city ? city.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : "";
    const key = city ? `${countrySlug}-${citySlug}` : "";

    let headingRaw: any = null;
    let paragraphRaw: any = null;

    if (!city) {
      // Country
      headingRaw = pageContent?.sections?.countryPages?.[countrySlug]?.servicesHeading
        || cmsContent?.sections?.countryPages?.[countrySlug]?.servicesHeading
        || cmsContent?.content?.sections?.countryPages?.[countrySlug]?.servicesHeading
        || cmsContent?.servicesHeading;

      paragraphRaw = pageContent?.sections?.countryPages?.[countrySlug]?.servicesParagraph
        || cmsContent?.sections?.countryPages?.[countrySlug]?.servicesParagraph
        || cmsContent?.content?.sections?.countryPages?.[countrySlug]?.servicesParagraph
        || cmsContent?.servicesParagraph;
    } else {
      // City
      const raw = (pageContent as any)?.sections?.cityPages?.[key] || (cmsContent as any)?.sections?.cityPages?.[key];
      const contentSource = raw?.countryPages?.[citySlug!] || raw?.countryPages?.[city?.toLowerCase() || ''] || raw;
      headingRaw = contentSource?.servicesHeading || (cmsContent as any)?.sections?.cityPages?.[key]?.servicesHeading || (cmsContent as any)?.servicesHeading;
      paragraphRaw = contentSource?.servicesParagraph || (cmsContent as any)?.sections?.cityPages?.[key]?.servicesParagraph || (cmsContent as any)?.servicesParagraph;
    }

    const heading = resolveText(headingRaw, city
      ? `Exhibition Booth Contractors in ${city}, ${country}`
      : `Exhibition Booth Contractors in ${country}`);

    const paragraph = resolveText(paragraphRaw, city
      ? `<p>${city}, ${country} provides access to top-tier exhibition stand builders who specialize in creating impactful displays for trade shows and exhibitions.</p><p>Our local experts combine creativity with technical excellence to deliver solutions that exceed expectations.</p>`
      : `<p>${country} offers exceptional exhibition stand building services with skilled craftsmen and innovative designers. Our local builders understand regional market dynamics and can create stunning displays that attract visitors and generate leads.</p><p>With expertise in various industries including technology, healthcare, automotive, and consumer goods, ${country}'s exhibition stand builders deliver customized solutions that align with your brand identity and marketing objectives.</p>`);

    return { heading, paragraph: typeof paragraph === 'string' ? paragraph.replace(/\r?\n/g, "<br/>") : paragraph };
  };

  const servicesContent = getServicesContent();

  // Location stats
  const locationStats = {
    totalBuilders: builders.length,
    averageRating: builders.length > 0
      ? Math.round((builders.reduce((sum, b) => sum + b.rating, 0) / builders.length) * 10) / 10
      : 4.8,
    completedProjects: builders.reduce((sum, b) => sum + b.projectsCompleted, 0),
    averagePrice: 450,
  };

  return (
    <div className="font-inter">
      {/* ServerEnhancedLocationPage: Hero → Stats Ribbon → [builders slot] → Why Choose → CTA Form → Gallery */}
      <ServerEnhancedLocationPage
        locationType={city ? "city" : "country"}
        locationName={city || country}
        countryName={city ? country : undefined}
        initialBuilders={builders}
        suppressPostBuildersContent
        suppressBuilders
        exhibitions={[]}
        venues={[]}
        pageContent={mergedContent}
        locationStats={locationStats}
        serverCmsContent={pageContent}
        isEditable={false}
        buildersSlot={
          <section id="builders-grid" className="py-20 bg-[#f6f6f8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#0f172a] uppercase tracking-tight mb-2">
                    Verified Premier Builders in {city || country}
                  </h2>
                  <p className="text-slate-600 text-sm">Top-rated contractors with verified project history and client testimonials.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:border-[#1e3886] transition-colors">
                    Filter by Rating
                  </button>
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:border-[#1e3886] transition-colors">
                    {city ? "City Specialists" : "Country Specialists"}
                  </button>
                </div>
              </div>

              {builders.length > 0 ? (
                <BuildersLoadMore
                  builders={builders}
                  location={city || country}
                  initialCount={2}
                  incrementBy={2}
                />
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                  <Building className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-black text-[#0f172a] mb-2">No Builders Listed Yet</h3>
                  <p className="text-slate-500 mb-8">We&apos;re expanding our directory for {city || country}. Get notified when builders are added.</p>
                  <PublicQuoteRequest
                    location={city || country}
                    buttonText="Request Builders for This Location"
                    className="bg-[#1e3886] text-white font-black px-8 py-3 h-auto rounded-lg hover:bg-[#c0123d] transition-all border-0"
                  />
                </div>
              )}
            </div>
          </section>
        }
      />


      {/* ── STRATEGIC HUBS / CITIES ── */}
      {!city && cities && cities.length > 0 && !hideCitiesSection &&
        !['jordan', 'lebanon', 'israel'].includes(country.toLowerCase()) && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-[#0f172a] mb-12 uppercase tracking-tighter">
              {country} Strategic Hubs
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {cities.slice(0, 6).map((c, index) => {
                const cityUrl = `/exhibition-stands/${normalizeCountrySlug(country)}/${normalizeCitySlug(c.name)}`;
                // Generate generic hub-specific features per city
                const features = c.features || [
                  `${c.builderCount || 0}+ Local Builders`,
                  "Same-day Site Visits",
                  "Local Venue Specialists",
                ];
                const subtitle = c.subtitle || c.tagline || `Exhibitions & Trade Shows`;
                const imgSrc = c.image || c.imageUrl || c.photo;

                return (
                  <a key={`${c.slug || c.name}-${index}`} href={cityUrl} className="group cursor-pointer">
                    <div className="h-64 rounded-2xl overflow-hidden mb-6 relative bg-slate-200">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={c.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                          <MapPin className="w-12 h-12 text-slate-500" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute bottom-6 left-6">
                        <h3 className="text-2xl font-black text-white">{c.name}</h3>
                        <p className="text-sm text-slate-200">{subtitle}</p>
                      </div>
                    </div>
                    <ul className="space-y-3 text-sm font-medium text-slate-600">
                      {features.slice(0, 3).map((feat: string, fi: number) => (
                        <li key={fi} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#1e3886] shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── PROFESSIONAL EXHIBITION INSIGHTS + SIDEBAR ── */}
      <section className="py-20 bg-[#f6f6f8] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main article */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl md:text-3xl font-black text-[#0f172a] mb-8 uppercase tracking-tighter">
                Professional Exhibition Insights
              </h2>
              <article className="bg-white rounded-xl p-8 border border-slate-200">
                <h3 className="text-xl font-black text-[#0f172a] mb-4">
                  {servicesContent.heading}
                </h3>
                <div
                  className="prose max-w-none text-slate-600 prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4 prose-headings:text-[#0f172a] prose-li:text-slate-600 prose-strong:text-[#0f172a] text-sm"
                  dangerouslySetInnerHTML={{ __html: servicesContent.paragraph }}
                />
                <a
                  href="#builders-grid"
                  className="text-[#1e3886] font-black inline-flex items-center gap-2 hover:gap-4 transition-all text-sm mt-6"
                >
                  Browse All Builders <ArrowRight className="w-4 h-4" />
                </a>
              </article>
            </div>

            {/* Sidebar */}
            <div>
              <h2 className="text-lg font-black text-[#0f172a] mb-6 uppercase tracking-tighter">
                Directory Stats
              </h2>
              <div className="space-y-3 mb-6">
                {[
                  { label: `Active ${city || country} Builders`, val: locationStats.totalBuilders.toLocaleString(), highlight: false },
                  { label: "Industry Categories", val: "34", highlight: false },
                  { label: "Avg. Trust Score", val: `${locationStats.averageRating}/5`, highlight: true },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-lg">
                    <span className="text-sm font-semibold text-slate-500">{s.label}</span>
                    <span className={`text-lg font-black ${s.highlight ? "text-emerald-600" : "text-[#0f172a]"}`}>
                      {s.val}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-[#1e3886]/10 rounded-xl border border-[#1e3886]/20">
                <h4 className="font-black text-[#1e3886] mb-2 text-sm">Need Help Choosing?</h4>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Our consultants can provide a shortlist of builders matching your specific technical requirements.
                </p>
                <PublicQuoteRequest
                  location={city || country}
                  buttonText="Get Expert Consultation"
                  className="text-xs font-black uppercase text-[#1e3886] p-0 h-auto bg-transparent border-0 hover:bg-transparent shadow-none"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 bg-[#c0123d] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tighter leading-tight">
            {(() => {
              const countrySlug = country.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
              const citySlug = city ? city.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : "";
              const key = city ? `${countrySlug}-${citySlug}` : "";
              const countryBlock = (pageContent as any)?.sections?.countryPages?.[countrySlug] || (cmsContent as any)?.sections?.countryPages?.[countrySlug] || (cmsContent as any) || {};
              const rawCity = city ? (pageContent as any)?.sections?.cityPages?.[key] : null;
              const nestedCity = city && citySlug ? (rawCity as any)?.countryPages?.[citySlug] || rawCity : null;
              const cityBlock = city ? nestedCity || (cmsContent as any)?.sections?.cityPages?.[key] || (cmsContent as any) || {} : null;
              const block = city ? cityBlock || {} : countryBlock || {};
              const headingRaw = (block as any)?.finalCtaHeading || `Start Your World-Class Exhibition Journey`;
              return resolveText(headingRaw, `Start Your World-Class Exhibition Journey`);
            })()}
          </h2>
          <p className="text-lg text-white/80 mb-10 leading-relaxed max-w-2xl mx-auto">
            {(() => {
              const countrySlug = country.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
              const citySlug = city ? city.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : "";
              const key = city ? `${countrySlug}-${citySlug}` : "";
              const countryBlock = (pageContent as any)?.sections?.countryPages?.[countrySlug] || (cmsContent as any)?.sections?.countryPages?.[countrySlug] || (cmsContent as any) || {};
              const rawCity = city ? (pageContent as any)?.sections?.cityPages?.[key] : null;
              const nestedCity = city && citySlug ? (rawCity as any)?.countryPages?.[citySlug] || rawCity : null;
              const cityBlock = city ? nestedCity || (cmsContent as any)?.sections?.cityPages?.[key] || (cmsContent as any) || {} : null;
              const block = city ? cityBlock || {} : countryBlock || {};
              const raw = (block as any)?.finalCtaParagraph || `Don't leave your brand representation to chance. Connect with the best builders in ${city || country} today.`;
              return resolveText(raw, `Don't leave your brand representation to chance. Connect with the best builders in ${city || country} today.`);
            })()}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PublicQuoteRequest
              location={city || country}
              buttonText="Browse Full Directory"
              className="bg-white text-[#c0123d] px-10 py-4 h-auto rounded-lg font-black text-base hover:shadow-2xl transition-all uppercase tracking-widest border-0"
            />
            <PublicQuoteRequest
              location={city || country}
              buttonText="Post a Project Tender"
              className="bg-transparent border-2 border-white text-white px-10 py-4 h-auto rounded-lg font-black text-base hover:bg-white/10 transition-all uppercase tracking-widest"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

