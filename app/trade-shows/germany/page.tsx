import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FiMapPin,
  FiUsers,
  FiCalendar,
  FiTrendingUp,
  FiStar,
  FiArrowRight,
} from "react-icons/fi";

export const metadata = {
  title: "Top Exhibitions in Germany 2025 | Major Trade Shows - ExhibitBay",
  description:
    "Discover major exhibitions and trade shows in Germany 2025. From Hannover Messe to IFA Berlin, find the best German trade shows for your business. Get exhibition stand quotes.",
  keywords:
    "Germany exhibitions 2025, German trade shows, Hannover Messe, IFA Berlin, K Fair, Medica, German exhibitions",
};

const upcomingShows = [
  {
    name: "Hannover Messe",
    slug: "hannover-messe",
    dates: "Apr 7-11, 2025",
    location: "Hannover",
    venue: "Hannover Exhibition Centre",
    industry: "Industrial Technology",
    attendees: "200,000+",
    exhibitors: "5,000+",
    description: "World's leading trade fair for industrial technology",
    featured: true,
  },
  {
    name: "IFA Berlin",
    slug: "ifa-berlin",
    dates: "Sep 5-10, 2025",
    location: "Berlin",
    venue: "Messe Berlin",
    industry: "Consumer Electronics",
    attendees: "245,000+",
    exhibitors: "1,800+",
    description:
      "Global trade show for consumer electronics and home appliances",
  },
  {
    name: "Medica",
    slug: "medica-dusseldorf",
    dates: "Nov 17-20, 2025",
    location: "Dusseldorf",
    venue: "Messe Dusseldorf",
    industry: "Medical Technology",
    attendees: "120,000+",
    exhibitors: "5,500+",
    description: "World's largest medical trade fair",
  },
  {
    name: "K Fair",
    slug: "k-plastics-rubber",
    dates: "Oct 8-15, 2025",
    location: "Dusseldorf",
    venue: "Messe Dusseldorf",
    industry: "Plastics & Rubber",
    attendees: "230,000+",
    exhibitors: "3,300+",
    description: "World's No.1 trade fair for plastics and rubber",
  },
  {
    name: "Anuga",
    slug: "anuga-cologne",
    dates: "Oct 4-8, 2025",
    location: "Cologne",
    venue: "Koelnmesse",
    industry: "Food & Beverage",
    attendees: "170,000+",
    exhibitors: "7,800+",
    description: "World's leading food and beverage trade fair",
  },
  {
    name: "EMO",
    slug: "emo",
    dates: "Sep 16-21, 2025",
    location: "Hannover",
    venue: "Hannover Exhibition Centre",
    industry: "Metalworking",
    attendees: "130,000+",
    exhibitors: "2,200+",
    description: "World trade fair for metalworking",
  },
  {
    name: "Interpack",
    slug: "interpack",
    dates: "May 8-14, 2025",
    location: "Dusseldorf",
    venue: "Messe Dusseldorf",
    industry: "Packaging",
    attendees: "175,000+",
    exhibitors: "2,800+",
    description: "Leading trade fair for packaging and related processes",
  },
  {
    name: "Automechanika",
    slug: "automechanika-frankfurt",
    dates: "Sep 14-18, 2025",
    location: "Frankfurt",
    venue: "Frankfurt Fair",
    industry: "Automotive",
    attendees: "136,000+",
    exhibitors: "4,600+",
    description:
      "Leading international trade fair for automotive service industry",
  },
  {
    name: "IMTS (European Edition)",
    slug: "emo-hannover",
    dates: "Sep 16-21, 2025",
    location: "Hannover",
    venue: "Hannover Exhibition Centre",
    industry: "Manufacturing Technology",
    attendees: "130,000+",
    exhibitors: "2,200+",
    description:
      "European edition of the world's largest manufacturing technology show",
  },
];

const cities = [
  { name: "Berlin", shows: 15, venues: ["Messe Berlin", "CityCube Berlin"] },
  {
    name: "Dusseldorf",
    shows: 25,
    venues: ["Messe Dusseldorf", "CCD Congress Centre"],
  },
  {
    name: "Cologne",
    shows: 18,
    venues: ["Koelnmesse", "Congress-Centrum Nord"],
  },
  {
    name: "Munich",
    shows: 20,
    venues: ["Messe München", "MOC Veranstaltungscenter"],
  },
  {
    name: "Hannover",
    shows: 12,
    venues: ["Hannover Exhibition Centre", "Congress Centrum"],
  },
  { name: "Frankfurt", shows: 22, venues: ["Frankfurt Fair", "Kap Europa"] },
  {
    name: "Hamburg",
    shows: 8,
    venues: ["Hamburg Messe", "CCH Congress Center"],
  },
  { name: "Stuttgart", shows: 14, venues: ["Messe Stuttgart", "SI-Centrum"] },
];

export default function GermanyTradeShows() {
  console.log("Germany Trade Shows: Page loaded");

  return (
    <div className="font-inter min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-navy-900 via-navy-800 to-blue-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-4xl">🇩🇪</span>
                <span className="text-blue-primary font-semibold">GERMANY</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Top Exhibitions in
                <span className="block text-blue-primary">Germany 2025</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Discover Germany's leading trade shows and exhibitions. From
                industrial technology in Hannover to consumer electronics in
                Berlin, find the perfect events for your business growth.
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center space-x-2">
                  <FiMapPin className="text-blue-primary" />
                  <span>8 Major Cities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiUsers className="text-blue-primary" />
                  <span>134 Annual Shows</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiStar className="text-blue-primary" />
                  <span>Europe's Exhibition Hub</span>
                </div>
              </div>
              <Button className="bg-blue-primary hover:bg-blue-dark text-white px-8 py-4 text-lg">
                Get Exhibition Stand Quote
              </Button>
            </div>
            <div className="hidden lg:block">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-white">
                    Germany Exhibition Market
                  </h3>
                  <div className="space-y-4 text-white">
                    <div className="flex justify-between">
                      <span>Annual Trade Shows:</span>
                      <span className="font-semibold">650+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>International Visitors:</span>
                      <span className="font-semibold">65%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Exhibition Space:</span>
                      <span className="font-semibold">2.8M+ sqm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Market Leader:</span>
                      <span className="font-semibold">Industrial Tech</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Exhibitions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-navy-900">
            Major German Trade Shows 2025
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingShows.map((show, index) => (
              <Link
                key={show.slug}
                href={`/trade-shows/germany/${show.slug}`}
                className="group"
              >
                <Card
                  className={`h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 ${show.featured ? "ring-2 ring-blue-primary" : ""}`}
                >
                  <CardContent className="p-6">
                    {show.featured && (
                      <div className="inline-block bg-blue-primary text-white text-xs px-2 py-1 rounded-full mb-3">
                        FEATURED
                      </div>
                    )}
                    <div className="flex items-center space-x-2 mb-3">
                      <FiCalendar className="text-blue-primary" />
                      <span className="text-sm text-gray-500">
                        {show.dates}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-navy-900 mb-2">
                      {show.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      {show.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center space-x-2">
                        <FiMapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 text-sm">
                          {show.location}, Germany
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiTrendingUp className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 text-sm">
                          {show.industry}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiUsers className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 text-sm">
                          {show.attendees} visitors
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-blue-primary group-hover:text-blue-dark font-medium flex items-center">
                        View Details <FiArrowRight className="ml-1 w-4 h-4" />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="group-hover:bg-blue-primary group-hover:text-white"
                      >
                        Get Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-navy-900">
            German Exhibition Cities
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cities.map((city) => (
              <Link
                key={city.name}
                href={`/exhibition-stands/germany/${city.name.toLowerCase()}`}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold text-navy-900 mb-3">
                      {city.name}
                    </h3>
                    <div className="text-3xl font-bold text-blue-primary mb-2">
                      {city.shows}
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      Annual Shows
                    </div>
                    <div className="space-y-1 mb-4">
                      {city.venues.map((venue) => (
                        <div key={venue} className="text-xs text-gray-600">
                          • {venue}
                        </div>
                      ))}
                    </div>
                    <div className="text-blue-primary group-hover:text-blue-dark font-medium text-sm">
                      View Contractors →
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Exhibit at German Trade Shows?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Connect with Germany's top exhibition stand builders. Get free
            quotes from certified contractors who understand the German market
            and deliver exceptional results across all major venues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-blue-primary hover:bg-gray-100 px-8 py-4 text-lg">
                Get Free Quote
              </Button>
            </Link>
            <Link href="/exhibition-stands/germany">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-primary px-8 py-4 text-lg"
              >
                View German Contractors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
