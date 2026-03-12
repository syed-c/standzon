import { getServerPageContent } from '@/lib/data/serverPageContent';
import RecentLeadsSection from '@/components/ServerRecentLeadsSection';
import { getFontClass } from '@/lib/utils/fonts';

export default async function HomeLeads() {
    const saved = await getServerPageContent('home');

    const leadsIntroFont = saved?.sections?.leadsIntro?.headingFont || '';
    const leadsHeading = saved?.sections?.leadsIntro?.heading || "";
    const leadsParagraph = saved?.sections?.leadsIntro?.paragraph || "";

    return (
        <section className="py-24 px-6 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    {leadsHeading ? (
                        <h3 className={["text-3xl font-black text-[#0f172a] tracking-tight mb-4 uppercase", getFontClass(leadsIntroFont as any)].join(' ')}>
                            {leadsHeading}
                        </h3>
                    ) : (
                        <h3 className="text-3xl font-black text-[#0f172a] tracking-tight mb-4 uppercase">
                            GET 3-5 FREE QUOTES IN 4 STEPS
                        </h3>
                    )}
                    <div className="w-20 h-1 bg-[#c0123d] mx-auto mb-6"></div>
                    {leadsParagraph && (
                        <p className="text-lg text-slate-500 max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: leadsParagraph }} />
                    )}
                </div>

                {/* CMS-driven Info Cards (4 steps) */}
                <div className="grid md:grid-cols-4 gap-8 mb-20">
                    {(() => {
                        const cards = (saved?.sections?.countryPages?.homeInfoCards as Array<any> | undefined) || [];
                        const fallback = [
                            { title: 'Submit Brief', text: 'Detail your specific requirements, brand guidelines, and spatial needs.' },
                            { title: 'Get Matched', text: 'Our algorithm identifies the best-suited local partners for your project.' },
                            { title: 'Compare & Choose', text: 'Review architectural portfolios, technical quotes, and timelines.' },
                            { title: 'Build & Install', text: 'Professional on-site delivery and dismantling by expert local teams.' },
                        ];
                        const icons = ['📋', '🤝', '⚖️', '🏗️'];
                        return (cards.length > 0 ? cards.slice(0, 4) : fallback).map((c, i) => (
                            <div key={i} className="bg-white p-8 border-t-4 border-[#1e3886] shadow-sm">
                                <div className="text-4xl mb-6">{icons[i] || '📌'}</div>
                                <h4 className="font-bold text-lg mb-2 uppercase tracking-tight text-[#0f172a]">
                                    {c.title || ''}
                                </h4>
                                <p className="text-slate-500 text-sm leading-relaxed">{c.text || ''}</p>
                            </div>
                        ));
                    })()}
                </div>

                {/* Stats bar */}
                <div className="bg-white border-b border-slate-100 mb-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
                        <div className="py-10 text-center">
                            <p className="text-4xl font-black text-[#1e3886]">120+</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Countries</p>
                        </div>
                        <div className="py-10 text-center">
                            <p className="text-4xl font-black text-[#1e3886]">55+</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Major Cities</p>
                        </div>
                        <div className="py-10 text-center">
                            <p className="text-4xl font-black text-[#1e3886]">1500+</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Expert Builders</p>
                        </div>
                        <div className="py-10 text-center">
                            <p className="text-4xl font-black text-[#1e3886]">8.2k</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Completed Projects</p>
                        </div>
                    </div>
                </div>

                {/* Recent leads table */}
                <div>
                    <RecentLeadsSection
                        ctaHeading={(saved?.sections?.readyLeads?.heading || '').trim() || undefined}
                        ctaParagraph={(saved?.sections?.readyLeads?.paragraph || '').trim() || undefined}
                        ctaButtons={Array.isArray(saved?.buttons)
                            ? (saved!.buttons as Array<any>).filter(b => (b.section || '').toLowerCase() === 'readyleads').map(b => ({ text: b.text, href: b.link || b.href }))
                            : (saved?.sections?.readyLeads?.buttons || undefined)}
                    />
                </div>
            </div>
        </section>
    );
}
