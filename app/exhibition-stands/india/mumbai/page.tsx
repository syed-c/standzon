import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { SlidingHeroSection } from '@/components/SlidingHeroSection';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Star, Phone, Globe, Mail, Calendar, Users } from "lucide-react";
import Link from "next/link";
import PublicQuoteRequest from '@/components/PublicQuoteRequest';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Mumbai, India | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Mumbai, India. Custom trade show displays, booth design, and comprehensive exhibition services. Connect with verified contractors in Mumbai.`,
    keywords: [`exhibition stands Mumbai`, `booth builders Mumbai India`, `trade show displays Mumbai`, `Mumbai exhibition builders`, `Bombay Exhibition Centre stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Mumbai, India`,
      description: `Professional exhibition stand builders in Mumbai, India. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Mumbai, India`,
      description: `Professional exhibition stand builders in Mumbai, India. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/india/mumbai`,
    },
  };
}

export default async function MumbaiPage() {
  console.log('🇮🇳 Loading Mumbai, India page...');
  
  try {
    // Preload builders data for Mumbai
    const preloadedBuildersData = await preloadQuery(api.locations.getBuildersForLocation, { 
      country: 'India',
      city: 'Mumbai'
    });

    console.log('✅ Mumbai page loaded successfully');
    console.log('📊 Loaded builders:', preloadedBuildersData?.length || 0);

    return (
      <div className="font-inter">
        <Navigation />
        
        {/* Hero Section */}
        <SlidingHeroSection
          headings={[
            "Exhibition Stands in Mumbai",
            "Custom Booth Design Mumbai", 
            "Trade Show Displays Mumbai"
          ]}
          subtitle="India"
          description="Expert exhibition stand builders in Mumbai, India. Custom booth design and construction for major venues and trade shows."
          stats={[
            { value: `${preloadedBuildersData?.length || 0}+`, label: "Builders" },
            { value: "5", label: "Major Venues" },
            { value: "200+", label: "Annual Events" },
            { value: "300 sqm", label: "Avg Size" }
          ]}
          buttons={[
            {
              text: "Find Exhibition Builders",
              href: "#builders",
              variant: "outline"
            },
            {
              text: "Get Free Quote",
              isQuoteButton: true
            }
          ]}
          location="Mumbai, India"
          backgroundGradient="linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <Link href="/exhibition-stands" className="text-gray-700 hover:text-blue-600">Exhibition Stands</Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <Link href="/exhibition-stands/india" className="text-gray-700 hover:text-blue-600">India</Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-500">Mumbai</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* City Info Section */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  About Mumbai
                </h2>
                <div className="prose prose-lg text-gray-600">
                  <p>
                    Mumbai stands as India's commercial capital and a key exhibition destination, 
                    hosting dynamic trade shows and business events. Our verified exhibition stand builders 
                    combine innovative design with exceptional craftsmanship to create memorable brand 
                    experiences in this vibrant market.
                  </p>
                  <p>
                    Mumbai offers unique advantages for exhibition projects with its strategic 
                    location, skilled local builders, and world-class exhibition infrastructure. Local builders 
                    provide unmatched expertise in navigating venue requirements and regional preferences, 
                    ensuring cost-effective solutions and successful project execution.
                  </p>
                </div>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>City Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Local Builders</span>
                      <span className="font-semibold">{preloadedBuildersData?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trade Shows</span>
                      <span className="font-semibold">200+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Population</span>
                      <span className="font-semibold">12.4M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Country</span>
                      <span className="font-semibold">India</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Builders Section */}
          <section id="builders">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Exhibition Stand Builders in Mumbai
              </h2>
            </div>

            {!preloadedBuildersData || preloadedBuildersData.length === 0 ? (
              <Card className="p-8 text-center">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Coming Soon
                </h3>
                <p className="text-gray-600 mb-6">
                  We're working on adding exhibition stand builders specifically for Mumbai. 
                  In the meantime, you can browse builders from India.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/exhibition-stands/india">
                    <Button variant="outline">
                      Browse India Builders
                    </Button>
                  </Link>
                  <PublicQuoteRequest 
                    buttonText="Get Free Quote"
                    location="Mumbai, India"
                  />
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {preloadedBuildersData.slice(0, 12).map((builder) => (
                  <Card key={builder._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg mb-2">
                            <Link 
                              href={`/builders/${builder.slug}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {builder.companyName}
                            </Link>
                          </CardTitle>
                          {builder.headquartersCity && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {builder.headquartersCity}
                              {builder.headquartersCity !== 'Mumbai' && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">
                                  Serves Mumbai
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                        {builder.verified && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {builder.rating && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 font-medium">{builder.rating}</span>
                          </div>
                          {builder.reviewCount && (
                            <span className="text-sm text-gray-600">
                              ({builder.reviewCount} reviews)
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        {builder.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{builder.phone}</span>
                          </div>
                        )}
                        {builder.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <a 
                              href={builder.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 transition-colors"
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                        {builder.primaryEmail && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{builder.primaryEmail}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <Link href={`/builders/${builder.slug}`}>
                          <Button className="w-full" size="sm">
                            View Profile & Get Quote
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* CTA Section */}
          <section className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Need a Custom Exhibition Stand in Mumbai?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get quotes from multiple verified builders and compare prices instantly
            </p>
            <div className="flex gap-4 justify-center">
              <PublicQuoteRequest 
                buttonText="Get Free Quotes"
                location="Mumbai, India"
                className="bg-white text-blue-600 hover:bg-gray-100"
              />
              <Link href="/exhibition-stands/india">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                  Browse All India Builders
                </Button>
              </Link>
            </div>
          </section>
        </div>

        <Footer />
        <WhatsAppFloat />
      </div>
    );
  } catch (error) {
    console.error('❌ Error loading Mumbai page:', error);
    return (
      <div className="font-inter">
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Error Loading Page</h1>
            <p className="text-gray-600 mb-8">There was an error loading this page. Please try again later.</p>
          </div>
        </div>
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  }
}
