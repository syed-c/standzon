import React, { Suspense } from "react";
import Image from "next/image";
import { getServerPageContent } from '@/lib/data/serverPageContent';
import PublicQuoteRequest from "@/components/PublicQuoteRequest";
import { getFontClass } from "@/lib/utils/fonts";
import { convertToProxyUrl } from "@/lib/utils/imageProxyUtils";
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import ContactSection from '@/components/ContactSection';
import Link from 'next/link';

export default async function HomeRest() {
    const saved = await getServerPageContent('home');

    const leadsIntroFont = saved?.sections?.leadsIntro?.headingFont || '';
    const readyLeadsFont = saved?.sections?.readyLeads?.headingFont || '';
    const finalCtaFont = saved?.sections?.finalCta?.headingFont || '';

    const readyStart = saved?.sections?.readyStart || saved?.sections?.getStarted || { heading: "Ready to Get Started?", paragraph: "Connect with verified exhibition stand builders in your target location. Get multiple competitive quotes without creating an account." };
    const finalCta = saved?.sections?.finalCta || { heading: "Start Your World-Class Journey", paragraph: "Connect with certified architectural partners and elevate your global brand presence through our proprietary network.", buttons: [{ text: "Register as a Builder", href: "/builder/register" }, { text: "Post a Quote RFP", href: "/quote" }] };

    const topLevelButtons = Array.isArray(saved?.buttons) ? saved!.buttons as Array<{ section?: string; text?: string; link?: string; href?: string }> : [];
    const startButtonsFromTop = topLevelButtons.filter(b => {
        const sec = (b.section || '').toLowerCase();
        return sec === 'readystart' || sec === 'getstarted' || sec === 'start';
    }).map(b => ({ text: b.text, href: b.link || b.href }));

    const finalButtonsFromTop = topLevelButtons.filter(b => (b.section || '').toLowerCase() === 'finalcta').map(b => ({ text: b.text, href: b.link || b.href }));
    const reviewsFromTop = Array.isArray(saved?.reviews) ? saved!.reviews as Array<{ name?: string; role?: string; rating?: number; text?: string; image?: string }> : [];

    return (
        <>
            {/* Ready to Get Started (CTA mid) — Crimson style */}
            {/* <section className="py-16 bg-[#c0123d] text-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className={["text-3xl font-black tracking-tighter uppercase italic", getFontClass(readyLeadsFont as any)].join(' ')}>
                            {readyStart.heading || "Ready to Get Started?"}
                        </h3>
                        <p className="text-white/80 mt-2 font-medium max-w-xl" dangerouslySetInnerHTML={{ __html: readyStart.paragraph || "" }} />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {startButtonsFromTop.length > 0 ? (
                            startButtonsFromTop.map((b, i) => (
                                <Link
                                    key={`${b.text}-${i}`}
                                    href={b.href || "#"}
                                    prefetch={true}
                                    className={i === 0
                                        ? "bg-white text-[#c0123d] hover:bg-slate-100 font-black uppercase tracking-widest px-10 py-5 transition-all shadow-xl whitespace-nowrap text-center text-sm"
                                        : "border-2 border-white text-white hover:bg-white hover:text-[#c0123d] font-black uppercase tracking-widest px-10 py-5 transition-all whitespace-nowrap text-center text-sm"
                                    }
                                >
                                    {b.text || (i === 0 ? "Get Free Quotes Now" : "Learn More")}
                                </Link>
                            ))
                        ) : (
                            <>
                                <PublicQuoteRequest
                                    buttonText="Get Free Quotes Now"
                                    className="bg-white text-[#c0123d] hover:bg-slate-100 font-black uppercase tracking-widest px-10 py-5 transition-all shadow-xl whitespace-nowrap text-sm rounded-none"
                                />
                                <PublicQuoteRequest
                                    buttonText="Find Local Builders"
                                    className="border-2 border-white text-white hover:bg-white hover:text-[#c0123d] font-black uppercase tracking-widest px-10 py-5 transition-all whitespace-nowrap text-sm rounded-none"
                                />
                            </>
                        )}
                    </div>
                </div>
            </section> */}

            {/* What Our Clients Say + Reviews */}
            {saved?.sections?.clientSay?.heading || saved?.sections?.clientSay?.paragraph ? (
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            {saved?.sections?.clientSay?.heading && (
                                <h3 className={["text-3xl font-black text-[#0f172a] tracking-tight mb-4 uppercase", getFontClass(leadsIntroFont as any)].join(' ')}>
                                    {saved!.sections!.clientSay!.heading}
                                </h3>
                            )}
                            <div className="w-20 h-1 bg-[#1e3886] mx-auto mb-6"></div>
                            {saved?.sections?.clientSay?.paragraph && (
                                <p className="text-lg text-slate-500 max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: saved!.sections!.clientSay!.paragraph }} />
                            )}
                        </div>
                        {(Array.isArray(saved?.sections?.reviews) && saved!.sections!.reviews!.length > 0) || reviewsFromTop.length > 0 ? (
                            <div className="grid md:grid-cols-3 gap-10">
                                {(saved!.sections?.reviews || reviewsFromTop).map((r: { name?: string; role?: string; rating?: number; text?: string; image?: string }, i: number) => (
                                    <div key={i} className="p-8 border border-slate-100 shadow-sm relative">
                                        <div className="absolute -top-4 left-8 text-4xl text-slate-200 font-serif leading-none">&ldquo;</div>
                                        <div className="flex items-center gap-4 mb-4 mt-4">
                                            {/* <Image src={convertToProxyUrl(r.image || "https://via.placeholder.com/80x80")} alt={r.name || "Reviewer"} width={48} height={48} className="w-12 h-12 rounded-full object-cover" /> */}
                                            <div>
                                                <div className="font-black text-[#0f172a] text-sm">{r.name || "Anonymous"}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{r.role || ""}</div>
                                            </div>
                                        </div>
                                        <p className="italic text-slate-600 leading-relaxed">&ldquo;{r.text || ""}&rdquo;</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Suspense fallback={<div className="h-64 bg-slate-100 animate-pulse"></div>}>
                                <TestimonialsCarousel />
                            </Suspense>
                        )}
                    </div>
                </section>
            ) : (
                <Suspense fallback={<div className="h-64 bg-slate-100 animate-pulse"></div>}>
                    <TestimonialsCarousel />
                </Suspense>
            )}

            {/* Contact Section */}
            <Suspense fallback={<div className="py-16 bg-slate-50 animate-pulse"><div className="max-w-7xl mx-auto px-6"><div className="h-64 bg-slate-200"></div></div></div>}>
                <ContactSection />
            </Suspense>

            {/* Final CTA — Navy with crimson accent */}
            <section className="relative py-32 bg-[#0f172a] overflow-hidden">
                <div className="absolute inset-0 bg-[#0f172a]/80 z-[1]"></div>
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <h2 className={["text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-none", finalCtaFont ? `font-${finalCtaFont}` : ''].join(' ')}>
                        {(() => {
                            const heading = finalCta.heading || "Start Your World-Class Journey";
                            // Try to highlight one word in crimson
                            const words = heading.split(' ');
                            if (words.length > 3) {
                                const midStart = Math.floor(words.length / 2);
                                return (
                                    <>
                                        {words.slice(0, midStart).join(' ')}{' '}
                                        <br />
                                        <span className="text-[#c0123d]">{words.slice(midStart, midStart + 2).join(' ')}</span>{' '}
                                        {words.slice(midStart + 2).join(' ')}
                                    </>
                                );
                            }
                            return heading;
                        })()}
                    </h2>
                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: finalCta.paragraph || "" }} />
                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        {((finalButtonsFromTop.length > 0 ? finalButtonsFromTop : finalCta.buttons) || []).map((b: { text?: string; href?: string }, i: number) => (
                            <Link
                                key={i}
                                href={b.href || "#"}
                                prefetch={true}
                                className={i === 0
                                    ? "bg-[#c0123d] text-white px-12 py-5 font-bold uppercase tracking-widest hover:bg-white hover:text-[#0f172a] transition-all text-sm"
                                    : "bg-[#1e3886] text-white px-12 py-5 font-bold uppercase tracking-widest hover:bg-white hover:text-[#0f172a] transition-all text-sm"
                                }
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
