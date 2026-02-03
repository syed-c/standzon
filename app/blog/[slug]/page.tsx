import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, getAllSlugs, blogArticles } from '@/lib/blog-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FiClock, FiCalendar, FiTag, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

export async function generateStaticParams() {
    return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const article = getArticleBySlug(params.slug);

    if (!article) {
        return {
            title: 'Article Not Found',
        };
    }

    return {
        title: `${article.title} | StandsZone Insights`,
        description: article.metaDescription || article.excerpt,
        keywords: article.tags.join(', '),
        alternates: {
            canonical: `https://standszone.com/blog/${article.slug}`,
        },
        openGraph: {
            title: article.title,
            description: article.metaDescription || article.excerpt,
            type: 'article',
            publishedTime: article.date,
            modifiedTime: article.lastUpdated || article.date,
            authors: [article.author],
            tags: article.tags,
        }
    };
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
    const article = getArticleBySlug(params.slug);

    if (!article) {
        notFound();
    }

    // Get related articles from the same category
    const relatedArticles = blogArticles
        .filter(a => a.category === article.category && a.slug !== article.slug)
        .slice(0, 3);

    return (
        <div className="min-h-screen bg-white">
            {/* Back Navigation */}
            <div className="border-b border-gray-100 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
                    <Link href="/blog" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
                        <FiArrowLeft className="mr-2 w-4 h-4" />
                        Back to all guides
                    </Link>
                </div>
            </div>

            {/* Article Header */}
            <article className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <header className="py-12 md:py-16 border-b border-gray-100">
                    {/* Category */}
                    <Badge className="bg-blue-100 text-blue-700 mb-6">
                        {article.category}
                    </Badge>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight">
                        {article.title}
                    </h1>

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                            <FiCalendar className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">Published {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        {article.lastUpdated && (
                            <div className="flex items-center gap-2 text-emerald-600 font-medium">
                                <FiCalendar className="w-4 h-4" />
                                <span>Updated {new Date(article.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <FiClock className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">{article.readTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <span>By <span className="font-medium text-slate-900">{article.author}</span></span>
                        </div>
                    </div>
                </header>

                {/* Executive Summary */}
                <div className="py-12 border-b border-gray-100">
                    <div className="bg-blue-50/50 border-l-4 border-blue-600 px-8 py-6 rounded-r-lg">
                        <p className="text-lg text-slate-900 leading-relaxed">{article.excerpt}</p>
                    </div>
                </div>

                {/* Article Content */}
                <div className="py-12 md:py-16">
                    <div
                        className="prose prose-lg max-w-none dark:prose-invert
              [&_h2]:font-bold [&_h2]:text-3xl [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:leading-tight [&_h2]:tracking-tight
              [&_h3]:font-bold [&_h3]:text-2xl [&_h3]:mt-10 [&_h3]:mb-4
              [&_p]:leading-relaxed [&_p]:mb-6 [&_p]:text-base
              [&_ul]:my-6 [&_li]:leading-relaxed
              [&_strong]:font-semibold"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>

                {/* Tags */}
                <div className="py-8 border-t border-gray-100">
                    <div className="flex items-start gap-3 flex-wrap">
                        <FiTag className="text-slate-400 mt-1 flex-shrink-0" />
                        <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-sm font-normal text-slate-700">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Related Resources Section */}
                {(article.relatedCities?.length || article.relatedCountries?.length || article.relatedTradeShows?.length) ? (
                    <div className="py-12 border-t border-gray-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Related Resources</h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {article.relatedCities && article.relatedCities.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                                        Exhibition Cities
                                    </h3>
                                    <nav className="space-y-3">
                                        {article.relatedCities.map((city) => (
                                            <Link
                                                key={city}
                                                href={`/exhibition-stands/${city}`}
                                                className="group flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
                                            >
                                                <FiArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                                                <span className="capitalize">{city.replace(/-/g, ' ')}</span>
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            )}

                            {article.relatedCountries && article.relatedCountries.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                                        Countries
                                    </h3>
                                    <nav className="space-y-3">
                                        {article.relatedCountries.map((country) => (
                                            <Link
                                                key={country}
                                                href={`/exhibition-stands/${country}`}
                                                className="group flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
                                            >
                                                <FiArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                                                <span className="capitalize">{country.replace(/-/g, ' ')}</span>
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            )}

                            {article.relatedTradeShows && article.relatedTradeShows.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                                        Trade Shows
                                    </h3>
                                    <nav className="space-y-3">
                                        {article.relatedTradeShows.map((show) => (
                                            <Link
                                                key={show}
                                                href={`/exhibitions/${show}`}
                                                className="group flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
                                            >
                                                <FiArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                                                <span className="capitalize">{show.replace(/-/g, ' ')}</span>
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}

                {/* Contextual CTA */}
                <div className="py-12 border-t border-gray-100">
                    <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white rounded-2xl p-10 md:p-12 shadow-lg">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            {article.category === 'City Guides'
                                ? `Ready to Exhibit?`
                                : 'Planning Your Next Exhibition?'}
                        </h2>
                        <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-2xl">
                            {article.category === 'City Guides'
                                ? 'Connect with verified local stand builders who understand venue requirements and deliver exceptional results.'
                                : 'Get free quotes from verified exhibition stand builders worldwide. Compare proposals and find the perfect partner.'}
                        </p>
                        <Link href="/quote">
                            <Button className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-6 text-base shadow-sm">
                                Get Free Quotes
                            </Button>
                        </Link>
                    </div>
                </div>
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <section className="bg-gray-50 border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-20">
                        <h2 className="text-2xl font-bold text-slate-900 mb-10">Related Guides</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedArticles.map((related) => (
                                <Link
                                    key={related.slug}
                                    href={`/blog/${related.slug}`}
                                    className="group"
                                >
                                    <article className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                                        <Badge variant="outline" className="text-xs font-medium text-slate-600 mb-4 w-fit">
                                            {related.category}
                                        </Badge>
                                        <h3 className="text-lg font-semibold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                                            {related.title}
                                        </h3>
                                        <p className="text-sm text-slate-700 mb-4 line-clamp-3 flex-1 leading-relaxed">
                                            {related.excerpt}
                                        </p>
                                        <div className="text-xs text-slate-500 flex items-center gap-3 pt-3 border-t border-gray-100">
                                            <span>{related.readTime}</span>
                                            <span>•</span>
                                            <span>{new Date(related.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
