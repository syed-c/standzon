"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";
import { sanitizeHtml } from "@/lib/utils/html";
import Navigation from "@/components/Navigation";
import UltraFastHero from "@/components/UltraFastHero";
import { getFontClass } from "@/lib/utils/fonts";
import PublicQuoteRequest from "@/components/PublicQuoteRequest";

// ✅ PERFORMANCE: Lazy load non-critical components
const LocationsSection = lazy(() => import("@/components/LocationsSection"));
const TestimonialsCarousel = lazy(() => import("@/components/TestimonialsCarousel"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const Footer = lazy(() => import("@/components/Footer"));

type SavedContent = any;

export default function HomePageContent() {
  const [saved, setSaved] = useState<SavedContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ PERFORMANCE: Optimize data loading with caching
  const load = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/pages-editor?action=get-content&path=%2F", { 
        cache: "no-store",
      });
      const data = await res.json();
      if (data?.success) setSaved(data.data || null);
    } catch (error) {
      console.warn('Failed to load CMS data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const handler = () => load();
    if (typeof window !== "undefined") {
      window.addEventListener("global-pages:updated", handler as EventListener);
      return () => window.removeEventListener("global-pages:updated", handler as EventListener);
    }
    return () => {};
  }, []);

  const heroHeading = saved?.sections?.hero?.heading || "";
  const heroHeadingFont = saved?.sections?.hero?.headingFont || saved?.sections?.typography?.headingFont || "";
  const heroDescriptionRaw = saved?.sections?.hero?.description || "";
  const heroDescription = sanitizeHtml(heroDescriptionRaw);
  const heroBgImage = saved?.sections?.hero?.bgImage || '';
  const heroBgOpacity = typeof saved?.sections?.hero?.bgOpacity === 'number' ? saved.sections.hero.bgOpacity : 0.25;

  // Section heading font choices
  const leadsIntroFont = saved?.sections?.leadsIntro?.headingFont || '';
  const readyLeadsFont = saved?.sections?.readyLeads?.headingFont || '';
  const globalPresenceFont = saved?.sections?.globalPresence?.headingFont || '';
  const finalCtaFont = saved?.sections?.finalCta?.headingFont || '';

  const heroButton = (saved?.sections?.heroButton as { text?: string; href?: string }) || null;

  const readyStart = saved?.sections?.readyStart || saved?.sections?.getStarted || { heading: "Ready to Get Started?", paragraph: "Connect with verified exhibition stand builders in your target location. Get multiple competitive quotes without creating an account." };
  const finalCta = saved?.sections?.finalCta || { heading: "Let's Create Something Extraordinary", paragraph: "Ready to transform your exhibition presence? Get a personalized quote and discover how we can bring your vision to life.", buttons: [ { text: "Get Free Quotes Now", href: "/quote" } ] };

  // Optional top-level arrays support
  const topLevelButtons = Array.isArray(saved?.buttons) ? saved!.buttons as Array<{ section?: string; text?: string; link?: string; href?: string }> : [];
  const heroButtonsFromTop = topLevelButtons.filter(b => (b.section||'').toLowerCase() === 'hero').map(b => ({ text: b.text, href: b.link || b.href }));
  const finalButtonsFromTop = topLevelButtons.filter(b => (b.section||'').toLowerCase() === 'finalcta').map(b => ({ text: b.text, href: b.link || b.href }));

  const reviewsFromTop = Array.isArray(saved?.reviews) ? saved!.reviews as Array<any> : [];
  // Use separate leadsIntro for the heading/paragraph above the table
  const leadsHeading = saved?.sections?.leadsIntro?.heading || "";
  const leadsParagraph = saved?.sections?.leadsIntro?.paragraph || "";
  const startButtonsFromTop = topLevelButtons.filter(b => {
    const sec = (b.section||'').toLowerCase();
    return sec === 'readystart' || sec === 'getstarted' || sec === 'start';
  }).map(b => ({ text: b.text, href: b.link || b.href }));

  return (
    <div className="page-container homepage-container">
      <Navigation />

      <main className="main-content">
        {/* ✅ PERFORMANCE: Ultra-fast hero section with minimal dependencies */}
        <UltraFastHero
          headings={[heroHeading]}
          subtitle=""
          description={heroDescription}
          headingFont={heroHeadingFont}
          bgImage={heroBgImage}
          bgOpacity={heroBgOpacity}
          stats={[
            { value: "120+", label: "Cities Covered" },
            { value: "55+", label: "Countries Served" },
            { value: "1500+", label: "Expert Builders" },
          ]}
          buttons={[
            { text: "Get Free Quote →", isQuoteButton: true },
            { text: "Global Venues", href: "/exhibition-stands", variant: "outline" as const },
            { text: "Find Builders", href: "/builders", variant: "outline" as const },
          ]}
        />

        {/* Recent Leads */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {(leadsHeading || leadsParagraph) && (
              <div className="text-center mb-8">
                {leadsHeading && (
                  <h2 className={["text-2xl md:text-3xl font-bold text-gray-900 mb-3", getFontClass(leadsIntroFont as any)].join(' ')}>{leadsHeading}</h2>
                )}
                {leadsParagraph && (
                  <p className="text-lg text-gray-700 max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: leadsParagraph }} />
                )}
              </div>
            )}
            {/* CMS-driven Info Cards section (4 cards) */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
              {(() => {
                const cards = (saved?.sections?.countryPages?.homeInfoCards as Array<any> | undefined) || [];
                const fallback = [
                  { title: 'Global Network', text: 'Access verified builders across major markets worldwide.' },
                  { title: 'Local Expertise', text: 'Work with local teams who understand venue rules and culture.' },
                  { title: 'Faster Delivery', text: 'Shorter lead times and rapid onsite support when needed.' },
                  { title: 'Cost-Effective', text: 'Save logistics with nearby fabrication and supplier networks.' },
                ];
                return (cards.length > 0 ? cards.slice(0,4) : fallback).map((c, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow p-6 border">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4 text-white"
                         style={{ background: i===0 ? '#3b82f6' : i===1 ? '#10b981' : i===2 ? '#8b5cf6' : '#f59e0b' }}>
                      <span className="font-semibold">{i+1}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{c.title || ''}</h3>
                    <p className="text-gray-600 text-sm">{c.text || ''}</p>
                  </div>
                ));
              })()}
            </div>
            {/* Existing recent leads component with CMS CTA */}
            <div>
              {React.createElement(require("@/components/RecentLeadsSection").default, {
                ctaHeading: (saved?.sections?.readyLeads?.heading || '').trim() || undefined,
                ctaParagraph: (saved?.sections?.readyLeads?.paragraph || '').trim() || undefined,
                ctaButtons: Array.isArray(saved?.buttons)
                  ? (saved!.buttons as Array<any>).filter(b => (b.section||'').toLowerCase() === 'readyleads').map(b => ({ text: b.text, href: b.link || b.href }))
                  : (saved?.sections?.readyLeads?.buttons || undefined),
              })}
            </div>
          </div>
        </section>

        {/* ✅ PERFORMANCE: Lazy load LocationsSection */}
        <Suspense fallback={<div className="py-16 bg-gray-50 animate-pulse"><div className="container mx-auto px-4"><div className="h-64 bg-gray-200 rounded-lg"></div></div></div>}>
          <LocationsSection
            globalPresence={saved?.sections?.globalPresence}
            moreCountries={saved?.sections?.moreCountries}
            expandingMarkets={saved?.sections?.expandingMarkets}
          />
        </Suspense>

        {/* Ready to Get Started (CTA mid) */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className={["text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6", getFontClass(readyLeadsFont as any)].join(' ')}>
                {readyStart.heading || "Ready to Get Started?"}
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 px-4" dangerouslySetInnerHTML={{ __html: readyStart.paragraph || "" }} />
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
                {startButtonsFromTop.length > 0 ? (
                  startButtonsFromTop.map((b, i) => (
                    <a key={`${b.text}-${i}`} href={b.href || "#"} className={i === 0 ? "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold" : "border-2 border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold"}>
                      {b.text || (i === 0 ? "Get Free Quotes Now" : "Learn More")}
                    </a>
                  ))
                ) : (
                  <>
                    <PublicQuoteRequest
                      buttonText="Get Free Quotes Now"
                      className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 touch-active no-tap-highlight"
                    />
                    <PublicQuoteRequest
                      buttonText="Find Local Builders"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 touch-active no-tap-highlight"
                    />
                  </>
                )}
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-4 px-4">
                ✅ No registration required • ✅ Multiple quotes • ✅ Verified builders only
              </p>
            </div>
          </div>
        </section>

        {/* What Our Clients Say + Reviews */}
        {saved?.sections?.clientSay?.heading || saved?.sections?.clientSay?.paragraph ? (
          <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-6xl mx-auto px-4">
              {saved?.sections?.clientSay?.heading && (
                <h2 className={["text-3xl font-bold text-gray-900 mb-3 text-center", getFontClass(leadsIntroFont as any)].join(' ')}>{saved.sections.clientSay.heading}</h2>
              )}
              {saved?.sections?.clientSay?.paragraph && (
                <p className="text-lg text-gray-600 mb-8 text-center" dangerouslySetInnerHTML={{ __html: saved.sections.clientSay.paragraph }} />
              )}
              {/* If custom reviews provided, render them; else fallback to existing carousel */}
              {(Array.isArray(saved?.sections?.reviews) && saved!.sections!.reviews!.length > 0) || reviewsFromTop.length>0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(saved!.sections?.reviews || reviewsFromTop).map((r: any, i: number) => (
                    <div key={i} className="bg-white rounded-xl shadow p-6 border">
                      <div className="flex items-center gap-4 mb-4">
                        <img src={r.image || "https://via.placeholder.com/80x80"} alt={r.name || "Reviewer"} className="w-14 h-14 rounded-full object-cover" />
                        <div>
                          <div className="font-semibold text-gray-900">{r.name || "Anonymous"}</div>
                          <div className="text-sm text-gray-500">{r.role || ""}</div>
                        </div>
                      </div>
                      <div className="text-yellow-500 mb-3">{"★".repeat(Math.max(0, Math.min(5, Number(r.rating) || 5)))}</div>
                      <p className="text-gray-700">{r.text || ""}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <Suspense fallback={<div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>}>
                  <TestimonialsCarousel />
                </Suspense>
              )}
            </div>
          </section>
        ) : (
          <Suspense fallback={<div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>}>
            <TestimonialsCarousel />
          </Suspense>
        )}
        
        {/* ✅ PERFORMANCE: Lazy load ContactSection */}
        <Suspense fallback={<div className="py-16 bg-gray-50 animate-pulse"><div className="container mx-auto px-4"><div className="h-64 bg-gray-200 rounded-lg"></div></div></div>}>
          <ContactSection />
        </Suspense>

        {/* Final CTA - Matching Location Pages Style */}
        <section className="relative py-16 md:py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
          {/* Decorative background overlay - subtle accent gradient */}
          <div className="absolute inset-0">
            <div className="w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10"></div>
          </div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className={["text-3xl md:text-4xl lg:text-5xl font-bold mb-6", finalCtaFont ? `font-${finalCtaFont}` : ''].join(' ')}>
              {finalCta.heading}
            </h2>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed" dangerouslySetInnerHTML={{ __html: finalCta.paragraph }} />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {((finalButtonsFromTop.length>0 ? finalButtonsFromTop : finalCta.buttons) || []).map((b: any, i: number) => (
                <a key={i} href={b.href || "#"}>
                  <button className={i === 0 
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300" 
                    : "bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"}>
                    {b.text || (i === 0 ? "Get Free Quotes Now" : "Learn More")}
                  </button>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      {/* ✅ PERFORMANCE: Lazy load Footer */}
      <Suspense fallback={<div className="h-32 bg-gray-900 animate-pulse"></div>}>
        <Footer />
      </Suspense>
    </div>
  );
}


