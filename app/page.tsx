import Navigation from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import SlidingHeroSection from "@/components/SlidingHeroSection";
import LocationsSection from "@/components/LocationsSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import PublicQuoteRequest from "@/components/PublicQuoteRequest";
import RecentLeadsSection from "@/components/RecentLeadsSection";
import type { Metadata } from "next";
import siteMetadata from "@/app/metadata.json";

// Export metadata from centralized metadata.json
export const metadata: Metadata = siteMetadata["/"];

// Featured builders section removed for production

export default function Home() {
  console.log("🏠 Homepage rendering...");

  const heroHeadings = [
    "We Build Your Stand in",
    "Connect with Top Builders in",
    "Get Competitive Quotes in",
    "Find Verified Contractors in",
  ];

  const heroStats = [
    { value: "45+", label: "Cities Covered" },
    { value: "10+", label: "Countries Served" },
    { value: "500+", label: "Expert Builders" },
  ];

  const heroButtons = [
    {
      text: "Get Free Quote →",
      isQuoteButton: true,
      className:
        "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-8 py-4 text-lg font-semibold rounded-xl border-2 border-transparent transition-all duration-300 hover:shadow-2xl transform hover:scale-105 shadow-lg",
    },
    {
      text: "Global Venues",
      href: "/exhibition-stands",
      variant: "outline" as const,
    },
    {
      text: "Find Builders",
      href: "/builders",
      variant: "outline" as const,
    },
  ];

  return (
    <div className="page-container">
      <Navigation />

      <main className="main-content pt-16">
        <SlidingHeroSection
          headings={heroHeadings}
          subtitle="Any Corner of the World"
          description="Get competitive quotes from verified exhibition stand builders. We compare 500+ contractors in your city to find the perfect match. Save 23% on average with free, instant quotes."
          stats={heroStats}
          buttons={heroButtons}
        />

        {/* Featured Builders Section removed for production */}

        {/* Live Grid Activity Section - Recent Leads */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RecentLeadsSection />
          </div>
        </section>

        <LocationsSection />

        {/* ✅ PUBLIC QUOTE SECTION - No login required */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 px-4">
                Connect with verified exhibition stand builders in your target
                location. Get multiple competitive quotes without creating an
                account.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
                <PublicQuoteRequest
                  buttonText="Get Free Quotes Now"
                  className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4"
                />
                <PublicQuoteRequest
                  buttonText="Find Local Builders"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-base md:text-lg px-6 md:px-8 py-3 md:py-4"
                />
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-4 px-4">
                ✅ No registration required • ✅ Multiple quotes • ✅ Verified
                builders only
              </p>
            </div>
          </div>
        </section>

        <TestimonialsCarousel />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
