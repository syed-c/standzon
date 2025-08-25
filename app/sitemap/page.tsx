import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FiMapPin, FiUsers, FiCalendar, FiGlobe, FiTrendingUp, FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';
import { tier1Countries, globalExhibitionStats } from '@/lib/data/countries';
import { ContentGenerator } from '@/lib/utils/contentGeneration';

export const metadata = {
  title: `Site Map - ExhibitBay Global Exhibition Platform | ${globalExhibitionStats.totalCountries} Countries`,
  description: `Complete sitemap of ExhibitBay's global exhibition platform covering ${globalExhibitionStats.totalCountries} countries, ${globalExhibitionStats.totalCities}+ cities, and ${globalExhibitionStats.totalBuilders}+ verified contractors.`,
  keywords: "sitemap, exhibition stands, global coverage, trade shows, builders directory",
};

export default function SitemapPage() {
  console.log('Rendering sitemap with Phase 1 implementation status');
  
  // Calculate implementation progress
  const implementationStats = {
    phase1Countries: tier1Countries.length,
    totalTargetCountries: 80,
    phase1Cities: globalExhibitionStats.totalCities,
    totalTargetCities: 500,
    phase1Builders: globalExhibitionStats.totalBuilders,
    totalTargetBuilders: 500,
    completionPercentage: Math.round((tier1Countries.length / 80) * 100)
  };

  return (
    <div className="font-inter min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-navy-900 via-navy-800 to-blue-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Platform Sitemap
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Complete overview of ExhibitBay's global exhibition platform covering 
              {globalExhibitionStats.totalCountries} countries with {globalExhibitionStats.totalBuilders}+ verified contractors
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <FiGlobe className="text-blue-primary" />
                <span>Phase 1: {globalExhibitionStats.totalCountries} Countries Live</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiMapPin className="text-blue-primary" />
                <span>{globalExhibitionStats.totalCities}+ Cities</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiUsers className="text-blue-primary" />
                <span>{globalExhibitionStats.totalBuilders}+ Verified Builders</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Progress */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">
              Phase 1 Implementation Status
            </h2>
            <p className="text-lg text-gray-600">
              Current progress in our global expansion plan
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-primary mb-2">
                  {implementationStats.phase1Countries}/{implementationStats.totalTargetCountries}
                </div>
                <div className="text-sm text-gray-600">
                  {implementationStats.completionPercentage}% Complete
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-primary h-2 rounded-full" 
                    style={{ width: `${implementationStats.completionPercentage}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Cities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500 mb-2">
                  {implementationStats.phase1Cities}
                </div>
                <div className="text-sm text-gray-600">
                  Major Exhibition Cities
                </div>
                <Badge variant="default" className="mt-2">Active</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Builders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-500 mb-2">
                  {implementationStats.phase1Builders}+
                </div>
                <div className="text-sm text-gray-600">
                  Verified Contractors
                </div>
                <Badge variant="default" className="mt-2">Growing</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Market Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500 mb-2">
                  €{globalExhibitionStats.totalMarketSize.toLocaleString()}M
                </div>
                <div className="text-sm text-gray-600">
                  Total Market Coverage
                </div>
                <Badge variant="secondary" className="mt-2">Phase 1</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Countries & Cities Sitemap */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">
              Geographic Coverage
            </h2>
            <p className="text-lg text-gray-600">
              Detailed breakdown of countries and cities in our network
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {tier1Countries.map((country) => {
              const countrySlug = ContentGenerator.generateSlug(country.name);
              return (
                <Card key={country.code} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {{
                            'GB': '🇬🇧', 'IT': '🇮🇹', 'NL': '🇳🇱', 'BE': '🇧🇪', 'AT': '🇦🇹',
                            'CH': '🇨🇭', 'SE': '🇸🇪', 'DK': '🇩🇰', 'NO': '🇳🇴', 'FI': '🇫🇮'
                          }[country.code] || '🌍'}
                        </span>
                        <div>
                          <div className="text-xl font-bold">{country.name}</div>
                          <div className="text-sm text-gray-600">
                            {country.builderCount} builders • {country.majorCities.length} cities
                          </div>
                        </div>
                      </div>
                      <Badge variant="default">Tier {country.tier}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Market Size:</span>
                          <div className="font-medium">€{country.exhibitionMarketSize}M</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Annual Shows:</span>
                          <div className="font-medium">{country.annualTradeShows}</div>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-gray-500 text-sm font-medium">Major Cities:</span>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          {country.majorCities.map((city) => (
                            <div key={city.slug} className="flex items-center justify-between text-sm">
                              <Link 
                                href={`/exhibition-stands/${countrySlug}/${city.slug}`}
                                className="text-blue-primary hover:underline font-medium"
                              >
                                {city.name} {city.isCapital && '(Capital)'}
                              </Link>
                              <span className="text-gray-500">
                                {city.builderCount} builders
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-100">
                        <Link href={`/exhibition-stands/${countrySlug}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Country Page
                            <FiExternalLink className="w-3 h-3 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Navigation Pages */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">
              Main Platform Pages
            </h2>
            <p className="text-lg text-gray-600">
              Core pages and functionality available on ExhibitBay
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Homepage</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/" className="text-blue-primary hover:underline">• Homepage</Link></li>
                  <li><Link href="/#hero" className="text-blue-primary hover:underline">• Hero Section</Link></li>
                  <li><Link href="/#featured" className="text-blue-primary hover:underline">• Featured Builders</Link></li>
                  <li><Link href="/#services" className="text-blue-primary hover:underline">• Services Overview</Link></li>
                  <li><Link href="/#contact" className="text-blue-primary hover:underline">• Contact Section</Link></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Exhibition Stands</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/exhibition-stands" className="text-blue-primary hover:underline">• Global Directory</Link></li>
                  <li><Link href="/exhibition-stands/united-kingdom" className="text-blue-primary hover:underline">• United Kingdom</Link></li>
                  <li><Link href="/exhibition-stands/italy" className="text-blue-primary hover:underline">• Italy</Link></li>
                  <li><Link href="/exhibition-stands/netherlands" className="text-blue-primary hover:underline">• Netherlands</Link></li>
                  <li><span className="text-gray-500">• + {tier1Countries.length - 3} more countries</span></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Trade Shows</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/trade-shows" className="text-blue-primary hover:underline">• Trade Shows Directory</Link></li>
                  <li><Link href="/trade-shows/germany" className="text-blue-primary hover:underline">• Germany Shows</Link></li>
                  <li><Link href="/trade-shows/germany/hannover-messe" className="text-blue-primary hover:underline">• Hannover Messe 2025</Link></li>
                  <li><span className="text-gray-500">• Phase 2: 300+ shows planned</span></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/custom-booth" className="text-blue-primary hover:underline">• Custom Booth Design</Link></li>
                  <li><Link href="/3d-rendering-and-concept-development" className="text-blue-primary hover:underline">• 3D Rendering</Link></li>
                  <li><Link href="/trade-show-installation-and-dismantle" className="text-blue-primary hover:underline">• Installation Services</Link></li>
                  <li><Link href="/trade-show-project-management" className="text-blue-primary hover:underline">• Project Management</Link></li>
                  <li><Link href="/trade-show-graphics-printing" className="text-blue-primary hover:underline">• Graphics & Printing</Link></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/about" className="text-blue-primary hover:underline">• About Us</Link></li>
                  <li><Link href="/blog" className="text-blue-primary hover:underline">• Blog</Link></li>
                  <li><Link href="/contact" className="text-blue-primary hover:underline">• Contact</Link></li>
                  <li><Link href="/builders" className="text-blue-primary hover:underline">• Builders Directory</Link></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Platform Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/sitemap" className="text-blue-primary hover:underline">• Site Map</Link></li>
                  <li><span className="text-gray-500">• Quote Request System (Phase 4)</span></li>
                  <li><span className="text-gray-500">• User Dashboard (Phase 5)</span></li>
                  <li><span className="text-gray-500">• Multi-language (Phase 6)</span></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Phase Roadmap */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">
              Development Roadmap
            </h2>
            <p className="text-lg text-gray-600">
              Upcoming phases in our global expansion plan
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">Complete</Badge>
                  Phase 1
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="font-medium">Geographic Foundation</div>
                  <div>✅ {globalExhibitionStats.totalCountries} Tier 1 countries</div>
                  <div>✅ {globalExhibitionStats.totalCities}+ major cities</div>
                  <div>✅ Content generation system</div>
                  <div>✅ SEO optimization</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline">Next</Badge>
                  Phase 2
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="font-medium">Trade Show Database</div>
                  <div>🔄 300+ international exhibitions</div>
                  <div>🔄 Event-builder matching</div>
                  <div>🔄 Trade show calendar</div>
                  <div>🔄 Industry categorization</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-gray-200 bg-gray-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary">Planned</Badge>
                  Phase 3-5
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="font-medium">Advanced Features</div>
                  <div>⏳ 500+ builder profiles</div>
                  <div>⏳ Quote matching system</div>
                  <div>⏳ User dashboards</div>
                  <div>⏳ Multi-language support</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Explore Our Global Network
          </h2>
          <p className="text-lg text-blue-light mb-8">
            Start exploring exhibition opportunities across {globalExhibitionStats.totalCountries} countries 
            with {globalExhibitionStats.totalBuilders}+ verified contractors ready to bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/exhibition-stands">
              <Button size="lg" className="bg-blue-primary hover:bg-blue-dark text-white px-8 py-3">
                Browse Countries
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-navy-900 px-8 py-3">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

