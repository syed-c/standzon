import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FiCalendar, FiUser, FiArrowRight, FiTrendingUp, FiMapPin, FiEye } from 'react-icons/fi';

export const metadata = {
  title: "Exhibition Industry Blog | StandsZone Insights & Trends",
  description: "Stay updated with the latest exhibition industry trends, trade show insights, and expert tips. Discover upcoming events, city guides, and design innovations from StandsZone.",
  keywords: "exhibition blog, trade show trends, exhibition industry insights, booth design tips, trade fair news",
  alternates: {
    canonical: "https://standszone.com/blog",
  },
};

const featuredArticles = [
  {
    title: "Top 10 Upcoming Exhibitions in Cologne 2025-2026",
    slug: "top-10-upcoming-exhibitions-cologne-2025-2026",
    excerpt: "Discover the most important trade shows and exhibitions coming to Cologne's world-class venues. From industrial fairs to creative showcases, here's your complete guide.",
    author: "Marcus Weber",
    date: "2024-12-15",
    readTime: "8 min read",
    category: "City Guides",
    views: "2.1k",
    image: "/api/placeholder/600/300",
    featured: true,
    tags: ["Cologne", "Germany", "Trade Shows", "2025"]
  },
  {
    title: "Exhibition Stand Design Trends 2025: What's Next?",
    slug: "exhibition-stand-design-trends-2025",
    excerpt: "Explore the cutting-edge design trends shaping the future of exhibition stands. From sustainable materials to interactive technologies, discover what's driving innovation.",
    author: "David Rodriguez",
    date: "2024-12-10",
    readTime: "6 min read",
    category: "Design Trends",
    views: "1.8k",
    image: "/api/placeholder/600/300",
    featured: true,
    tags: ["Design", "Trends", "Innovation", "2025"]
  },
  {
    title: "Top 5 Upcoming Exhibitions in Hamburg 2025-2026",
    slug: "top-5-upcoming-exhibitions-hamburg-2025-2026",
    excerpt: "Hamburg's exhibition scene is thriving with major international trade shows. Here's your guide to the most significant events in Germany's maritime capital.",
    author: "Sarah Chen",
    date: "2024-12-08",
    readTime: "7 min read",
    category: "City Guides",
    views: "1.5k",
    image: "/api/placeholder/600/300",
    featured: true,
    tags: ["Hamburg", "Germany", "Maritime", "Trade Shows"]
  }
];

const recentArticles = [
  {
    title: "Sustainable Exhibition Stands: The Future is Green",
    slug: "sustainable-exhibition-stands-future-green",
    excerpt: "How eco-friendly design and sustainable materials are revolutionizing the exhibition industry while maintaining visual impact.",
    author: "Emma Thompson",
    date: "2024-12-05",
    readTime: "5 min read",
    category: "Sustainability",
    views: "980",
    tags: ["Sustainability", "Eco-Friendly", "Materials"]
  },
  {
    title: "ROI Measurement for Trade Show Exhibitions",
    slug: "roi-measurement-trade-show-exhibitions",
    excerpt: "Essential metrics and strategies to measure the success of your exhibition investments and maximize return on investment.",
    author: "Marcus Weber",
    date: "2024-12-03",
    readTime: "10 min read",
    category: "Business Strategy",
    views: "1.2k",
    tags: ["ROI", "Metrics", "Business", "Strategy"]
  },
  {
    title: "Digital Integration in Modern Exhibition Stands",
    slug: "digital-integration-modern-exhibition-stands",
    excerpt: "How AR, VR, and interactive technologies are transforming visitor experiences at trade shows and exhibitions worldwide.",
    author: "David Rodriguez",
    date: "2024-12-01",
    readTime: "8 min read",
    category: "Technology",
    views: "1.4k",
    tags: ["Technology", "AR", "VR", "Digital"]
  },
  {
    title: "Berlin Trade Show Calendar 2025: Complete Guide",
    slug: "berlin-trade-show-calendar-2025-guide",
    excerpt: "Your comprehensive guide to all major trade shows and exhibitions happening in Berlin throughout 2025, including dates and industry focus.",
    author: "Sarah Chen",
    date: "2024-11-28",
    readTime: "12 min read",
    category: "City Guides",
    views: "2.3k",
    tags: ["Berlin", "Germany", "Calendar", "2025"]
  },
  {
    title: "Choosing the Right Exhibition Stand Contractor",
    slug: "choosing-right-exhibition-stand-contractor",
    excerpt: "Expert tips on selecting the perfect exhibition stand builder for your needs, budget, and timeline. Avoid common pitfalls and ensure success.",
    author: "Emma Thompson",
    date: "2024-11-25",
    readTime: "9 min read",
    category: "How-To Guides",
    views: "1.7k",
    tags: ["Contractors", "Selection", "Tips", "Guide"]
  },
  {
    title: "Cost-Effective Exhibition Stand Solutions",
    slug: "cost-effective-exhibition-stand-solutions",
    excerpt: "Maximize your exhibition impact while minimizing costs. Practical strategies for budget-conscious exhibitors without compromising quality.",
    author: "Marcus Weber",
    date: "2024-11-22",
    readTime: "7 min read",
    category: "Budget Tips",
    views: "1.9k",
    tags: ["Budget", "Cost-Effective", "Solutions", "Tips"]
  }
];

const categories = [
  { name: "City Guides", count: 8, color: "bg-blue-100 text-blue-800" },
  { name: "Design Trends", count: 12, color: "bg-purple-100 text-purple-800" },
  { name: "Business Strategy", count: 6, color: "bg-green-100 text-green-800" },
  { name: "Technology", count: 9, color: "bg-orange-100 text-orange-800" },
  { name: "Sustainability", count: 4, color: "bg-emerald-100 text-emerald-800" },
  { name: "How-To Guides", count: 15, color: "bg-indigo-100 text-indigo-800" }
];

export default function BlogPage() {
  console.log("Blog Page: Page loaded");

  return (
    <div className="font-inter min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-navy-900 via-navy-800 to-blue-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Exhibition Industry
              <span className="block text-blue-primary">Insights & Trends</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Stay ahead of the curve with expert insights, industry trends, and practical guides 
              for exhibition professionals and trade show participants.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-lg">
              <div className="flex items-center space-x-2">
                <FiTrendingUp className="text-blue-primary" />
                <span>Industry Trends</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiMapPin className="text-blue-primary" />
                <span>City Guides</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiUser className="text-blue-primary" />
                <span>Expert Tips</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-navy-900">Browse by Category</h2>
            <div className="text-sm text-gray-600">
              50+ articles and growing
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-navy-900 text-white cursor-pointer px-4 py-2">
              All Articles
            </Badge>
            {categories.map((category) => (
              <Badge key={category.name} className={`${category.color} cursor-pointer px-4 py-2`}>
                {category.name} ({category.count})
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-navy-900">
            Featured Articles
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <Card key={article.slug} className="group transition-all duration-300 overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-blue-primary to-blue-dark flex items-center justify-center relative">
                  <div className="text-center text-white p-6">
                    <div className="text-4xl mb-2">📝</div>
                    <Badge className="bg-white/20 text-white border-white/30">
                      {article.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-500 text-yellow-900">
                      Featured
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>{new Date(article.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiEye className="w-4 h-4" />
                        <span>{article.views}</span>
                      </div>
                    </div>
                    <span>{article.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-navy-900 mb-3">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{article.excerpt}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <FiUser className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{article.author}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Link href={`/blog/${article.slug}`} className="text-blue-primary font-medium text-sm flex items-center">
                    Read Full Article <FiArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-navy-900">
            Recent Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.map((article) => (
              <Card key={article.slug} className="group transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <Badge className="bg-gray-100 text-gray-700 text-xs">
                      {article.category}
                    </Badge>
                    <span>{article.readTime}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-navy-900 mb-3">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{article.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <FiUser className="w-4 h-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>{new Date(article.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiEye className="w-4 h-4" />
                      <span>{article.views}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Link href={`/blog/${article.slug}`} className="text-blue-primary font-medium text-sm flex items-center">
                    Read More <FiArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button className="bg-blue-primary text-white px-8 py-3">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-blue-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stay Updated with Industry Insights
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Subscribe to our newsletter and never miss the latest exhibition industry trends, 
            trade show updates, and expert tips delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-light"
            />
            <Button className="bg-white text-blue-primary px-8 py-3">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-blue-100 mt-4">
            Join 5,000+ industry professionals. Unsubscribe anytime.
          </p>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}