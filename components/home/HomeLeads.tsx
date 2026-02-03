import { getServerPageContent } from '@/lib/data/serverPageContent';
import RecentLeadsSection from '@/components/ServerRecentLeadsSection';
import { getFontClass } from '@/lib/utils/fonts';

export default async function HomeLeads() {
    const saved = await getServerPageContent('home');

    const leadsIntroFont = saved?.sections?.leadsIntro?.headingFont || '';
    const leadsHeading = saved?.sections?.leadsIntro?.heading || "";
    const leadsParagraph = saved?.sections?.leadsIntro?.paragraph || "";

    // CMS-driven Info Cards section (4 cards) -- Extracted to be here or inside Leads?
    // It was just before RecentLeadsSection in the original file.

    return (
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
                        return (cards.length > 0 ? cards.slice(0, 4) : fallback).map((c, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow p-6 border">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4 text-white"
                                    style={{ background: i === 0 ? '#3b82f6' : i === 1 ? '#10b981' : i === 2 ? '#8b5cf6' : '#f59e0b' }}>
                                    <span className="font-semibold">{i + 1}</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{c.title || ''}</h3>
                                <p className="text-gray-600 text-sm">{c.text || ''}</p>
                            </div>
                        ));
                    })()}
                </div>

                {/* Existing recent leads component with CMS CTA */}
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
