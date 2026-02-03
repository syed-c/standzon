import React, { Suspense } from "react";
import Image from "next/image";
import { getServerPageContent } from '@/lib/data/serverPageContent';
import PublicQuoteRequest from "@/components/PublicQuoteRequest";
import { getFontClass } from "@/lib/utils/fonts";
import { convertToProxyUrl } from "@/lib/utils/imageProxyUtils";
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import ContactSection from '@/components/ContactSection'; // Assuming standard import
import Link from 'next/link';

export default async function HomeRest() {
    const saved = await getServerPageContent('home');

    // Font choices
    const leadsIntroFont = saved?.sections?.leadsIntro?.headingFont || '';
    const readyLeadsFont = saved?.sections?.readyLeads?.headingFont || '';
    const finalCtaFont = saved?.sections?.finalCta?.headingFont || '';

    const readyStart = saved?.sections?.readyStart || saved?.sections?.getStarted || { heading: "Ready to Get Started?", paragraph: "Connect with verified exhibition stand builders in your target location. Get multiple competitive quotes without creating an account." };
    const finalCta = saved?.sections?.finalCta || { heading: "Let's Create Something Extraordinary", paragraph: "Ready to transform your exhibition presence? Get a personalized quote and discover how we can bring your vision to life.", buttons: [{ text: "Get Free Quotes Now", href: "/quote" }] };

    const topLevelButtons = Array.isArray(saved?.buttons) ? saved!.buttons as Array<{ section?: string; text?: string; link?: string; href?: string }> : [];
    const startButtonsFromTop = topLevelButtons.filter(b => {
        const sec = (b.section || '').toLowerCase();
        return sec === 'readystart' || sec === 'getstarted' || sec === 'start';
    }).map(b => ({ text: b.text, href: b.link || b.href }));

    const finalButtonsFromTop = topLevelButtons.filter(b => (b.section || '').toLowerCase() === 'finalcta').map(b => ({ text: b.text, href: b.link || b.href }));
    const reviewsFromTop = Array.isArray(saved?.reviews) ? saved!.reviews as Array<{ name?: string; role?: string; rating?: number; text?: string; image?: string }> : [];

    return (
        <>
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
                                    <Link key={`${b.text}-${i}`} href={b.href || "#"} prefetch={true} className={i === 0 ? "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold" : "border-2 border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold"}>
                                        {b.text || (i === 0 ? "Get Free Quotes Now" : "Learn More")}
                                    </Link>
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
                            <h2 className={["text-3xl font-bold text-gray-900 mb-3 text-center", getFontClass(leadsIntroFont as any)].join(' ')}>{saved!.sections!.clientSay!.heading}</h2>
                        )}
                        {saved?.sections?.clientSay?.paragraph && (
                            <p className="text-lg text-gray-600 mb-8 text-center" dangerouslySetInnerHTML={{ __html: saved!.sections!.clientSay!.paragraph }} />
                        )}
                        {/* If custom reviews provided, render them; else fallback to existing carousel */}
                        {(Array.isArray(saved?.sections?.reviews) && saved!.sections!.reviews!.length > 0) || reviewsFromTop.length > 0 ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(saved!.sections?.reviews || reviewsFromTop).map((r: { name?: string; role?: string; rating?: number; text?: string; image?: string }, i: number) => (
                                    <div key={i} className="bg-white rounded-xl shadow p-6 border">
                                        <div className="flex items-center gap-4 mb-4">
                                            <Image src={convertToProxyUrl(r.image || "https://via.placeholder.com/80x80")} alt={r.name || "Reviewer"} width={56} height={56} className="w-14 h-14 rounded-full object-cover" />
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

            {/* Contact Section */}
            <Suspense fallback={<div className="py-16 bg-gray-50 animate-pulse"><div className="container mx-auto px-4"><div className="h-64 bg-gray-200 rounded-lg"></div></div></div>}>
                <ContactSection />
            </Suspense>

            {/* Final CTA */}
            <section className="relative py-16 md:py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
                <div className="absolute inset-0">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10"></div>
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className={["text-3xl md:text-4xl lg:text-5xl font-bold mb-6", finalCtaFont ? `font-${finalCtaFont}` : ''].join(' ')}>
                        {finalCta.heading}
                    </h2>
                    <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed" dangerouslySetInnerHTML={{ __html: finalCta.paragraph || "" }} />
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {((finalButtonsFromTop.length > 0 ? finalButtonsFromTop : finalCta.buttons) || []).map((b: { text?: string; href?: string }, i: number) => (
                            <Link
                                key={i}
                                href={b.href || "#"}
                                prefetch={true}
                                className={i === 0
                                    ? "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 inline-block"
                                    : "bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 inline-block"}
                            >
                                {b.text || (i === 0 ? "Get Free Quotes Now" : "Learn More")}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
