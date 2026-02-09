import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FiCalendar, FiClock, FiArrowRight, FiBookOpen, FiCompass, FiTrendingUp, FiDollarSign, FiZap, FiUsers } from 'react-icons/fi';
import { FiAward } from 'react-icons/fi';
import { getFeaturedArticles, blogArticles, categories } from '@/lib/blog-data';

export const metadata = {
  title: "Exhibition Industry Insights, Guides & Trade Show Intelligence | StandsZone",
  description: "Professional knowledge hub for exhibitors, brands, and event professionals. Expert guides on stand design, city insights, costs, trends, and contractor selection across 40+ countries.",
  keywords: "exhibition guides, trade show insights, stand design trends, exhibition costs, contractor selection, city guides, trade show planning",
  alternates: {
    canonical: "https://standszone.com/blog",
  },
};

const topicIcons = {
  "Exhibition Stand Guides": FiCompass,
  "City & Country Guides": FiBookOpen,
  "Trade Show Planning": FiTrendingUp,
  "Costs & Budgeting": FiDollarSign,
  "Design & Trends": FiZap,
  "Technology & Innovation": FiZap,
  "Sustainability": FiAward,
  "Contractor Selection": FiUsers
};

export default function BlogPage() {
  const featuredArticles = getFeaturedArticles();
  const recentArticles = blogArticles.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Editorial Introduction */}
      <section className="relative bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-24 md:py-32">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
            Exhibition Industry Insights,<br />Guides & Trade Show Intelligence
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl font-light">
            A professional knowledge hub for exhibitors, brands, and event professionals.
            Comprehensive guides covering stand design, city insights, and industry intelligence.
          </p>
        </div>
      </section>

      {/* Topic Navigation - Editorial Index */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-20">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-10">Browse Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
          {categories.map((category) => {
            const Icon = topicIcons[category.name] || FiBookOpen;
            return (
              <div key={category.slug} className="group cursor-pointer">
                <div className="flex items-start gap-3 mb-2">
                  <Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured / Essential Guides */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24">
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Essential Guides
          </h2>
          <p className="text-lg text-gray-600">
            Comprehensive industry guides for exhibition professionals
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {featuredArticles.map((article, index) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group"
            >
              <article className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                {/* Visual Header with Depth */}
                <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800 h-56 flex items-end p-8">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-500/30 via-transparent to-transparent"></div>
                  <div className="relative z-10">
                    <Badge className="bg-amber-400 text-amber-950 font-semibold mb-4 shadow-sm">
                      Essential Guide
                    </Badge>
                    <h3 className="text-2xl font-bold text-white leading-tight group-hover:underline decoration-2 underline-offset-4">
                      {article.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-4">
                    <Badge variant="outline" className="text-xs font-medium">
                      {article.category}
                    </Badge>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6 flex-1">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <FiClock className="w-4 h-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    {article.lastUpdated && (
                      <span className="text-xs text-emerald-600 font-medium">
                        Updated Jan 2025
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Insights - Secondary Content */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-20">
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Latest Insights
          </h2>
          <p className="text-gray-600">
            Recent articles and industry updates
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group"
            >
              <article className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="mb-4">
                  <Badge variant="outline" className="text-xs font-medium text-gray-600">
                    {article.category}
                  </Badge>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1 line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="flex items-center gap-3 text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <FiClock className="w-3.5 h-3.5" />
                    <span>{article.readTime}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-3.5 h-3.5" />
                    <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* Internal Linking - Editorial Paths */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
            {/* Popular City Guides */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-8">
                Popular Exhibition City Guides
              </h2>
              <nav className="space-y-4">
                {['cologne', 'berlin', 'hamburg', 'dubai', 'las-vegas'].map((city) => (
                  <Link
                    key={city}
                    href={`/exhibition-stands/${city === 'dubai' ? 'united-arab-emirates/' : city === 'las-vegas' ? 'united-states/' : 'germany/'}${city}`}
                    className="group flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    <span className="text-base capitalize">
                      {city.replace(/-/g, ' ')} Exhibition Stands
                    </span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Popular Country Guides */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-8">
                Exhibition Stands by Country
              </h2>
              <nav className="space-y-4">
                {[
                  { slug: 'germany', label: 'Germany' },
                  { slug: 'united-states', label: 'United States' },
                  { slug: 'united-arab-emirates', label: 'United Arab Emirates' },
                  { slug: 'united-kingdom', label: 'United Kingdom' },
                  { slug: 'france', label: 'France' }
                ].map((country) => (
                  <Link
                    key={country.slug}
                    href={`/exhibition-stands/${country.slug}`}
                    className="group flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    <span className="text-base">
                      {country.label} Exhibition Stands
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Controlled and Quiet */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50/30 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Planning an Exhibition?
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Get free quotes from verified exhibition stand builders worldwide.
          </p>
          <Link href="/quote">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base shadow-sm">
              Get Free Quotes
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}