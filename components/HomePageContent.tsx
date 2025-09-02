"use client";

import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import SlidingHeroSection from "@/components/SlidingHeroSection";
import LocationsSection from "@/components/LocationsSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import PublicQuoteRequest from "@/components/PublicQuoteRequest";

type SavedContent = any;

export default function HomePageContent() {
  const [saved, setSaved] = useState<SavedContent | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/pages-editor?action=get-content&path=%2F", { cache: "no-store" });
      const data = await res.json();
      if (data?.success) setSaved(data.data || null);
    } catch {}
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
  const heroDescription = saved?.sections?.hero?.description ||
    "";

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

      <main className="main-content pt-16">
        <SlidingHeroSection
          headings={[heroHeading]}
          subtitle=""
          description={heroDescription}
          stats={[
            { value: "45+", label: "Cities Covered" },
            { value: "10+", label: "Countries Served" },
            { value: "500+", label: "Expert Builders" },
          ]}
          buttons={(() => {
            const primary = heroButton ? [heroButton] : [];
            const fromTop = heroButtonsFromTop;
            const source = primary.length > 0 ? primary : fromTop;
            return source.length > 0 ? source.map((b, i) => ({ text: b.text || (i === 0 ? "Get Free Quote →" : "Explore"), href: b.href, variant: i === 0 ? undefined : ("outline" as const) })) : [];
          })()}
        />

        {/* Recent Leads */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {(leadsHeading || leadsParagraph) && (
              <div className="text-center mb-8">
                {leadsHeading && (
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{leadsHeading}</h2>
                )}
                {leadsParagraph && (
                  <p className="text-lg text-gray-700 max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: leadsParagraph }} />
                )}
              </div>
            )}
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

        <LocationsSection
          globalPresence={saved?.sections?.globalPresence}
          moreCountries={saved?.sections?.moreCountries}
          expandingMarkets={saved?.sections?.expandingMarkets}
        />

        {/* Ready to Get Started (CTA mid) */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
                {readyStart.heading || "Ready to Get Started?"}
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 px-4" dangerouslySetInnerHTML={{ __html: readyStart.paragraph || "" }} />
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
                {startButtonsFromTop.length > 0 ? (
                  startButtonsFromTop.map((b, i) => (
                    <a key={`${b.text}-${i}`} href={b.href || "#"} className={i === 0 ? "bg-gradient-to-r from-claret to-russian-violet hover:from-dark-purple hover:to-claret text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold" : "border-2 border-dark-purple text-dark-purple hover:bg-dark-purple hover:text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold"}>
                      {b.text || (i === 0 ? "Get Free Quotes Now" : "Learn More")}
                    </a>
                  ))
                ) : (
                  <>
                    <PublicQuoteRequest
                      buttonText="Get Free Quotes Now"
                      className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4"
                    />
                    <PublicQuoteRequest
                      buttonText="Find Local Builders"
                      className="bg-gradient-to-r from-dark-purple to-claret hover:from-russian-violet hover:to-dark-purple text-base md:text-lg px-6 md:px-8 py-3 md:py-4"
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
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{saved.sections.clientSay.heading}</h2>
              )}
              {saved?.sections?.clientSay?.paragraph && (
                <p className="text-lg text-gray-600 mb-8" dangerouslySetInnerHTML={{ __html: saved.sections.clientSay.paragraph }} />
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
                <TestimonialsCarousel />
              )}
            </div>
          </section>
        ) : (
          <TestimonialsCarousel />
        )}
        <ContactSection />

        {/* Final CTA */}
        <section className="py-12 md:py-16 bg-russian-violet text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {finalCta.heading}
            </h2>
            <p className="text-xl mb-8 text-gray-200" dangerouslySetInnerHTML={{ __html: finalCta.paragraph }} />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {((finalButtonsFromTop.length>0 ? finalButtonsFromTop : finalCta.buttons) || []).map((b: any, i: number) => (
                <a key={i} href={b.href || "#"}>
                  <button className={i === 0 ? "bg-transparent text-persian-orange hover:bg-gray-100 px-8 py-4 text-lg rounded border-2 border-persian-orange" : "border-white text-white hover:bg-white hover:text-russian-violet px-8 py-4 text-lg rounded border-2 border-white"}>
                    {b.text || (i === 0 ? "Get Free Quotes Now" : "Learn More")}
                  </button>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


