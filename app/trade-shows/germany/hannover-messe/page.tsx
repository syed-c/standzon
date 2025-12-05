import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FiMapPin, FiUsers, FiCalendar, FiTrendingUp, FiStar, FiArrowRight, FiCheckCircle, FiGlobe, FiTool } from 'react-icons/fi';

export const metadata = {
  title: "Hannover Messe 2025 | Exhibition Stand Builders - ExhibitBay",
  description: "Hannover Messe 2025 - World's leading industrial technology trade fair. Get custom exhibition stands from verified builders. April 7-11, 2025 at Hannover Exhibition Centre.",
  keywords: "Hannover Messe 2025, industrial technology exhibition, Hannover trade fair, exhibition stands Hannover, industrial exhibition",
};

const exhibitionDetails = {
  name: "Hannover Messe",
  dates: "April 7-11, 2025",
  location: "Hannover, Germany",
  venue: "Hannover Exhibition Centre",
  website: "hannovermesse.de",
  industry: "Industrial Technology & Automation",
  expectedAttendees: "200,000+",
  expectedExhibitors: "5,000+",
  hallSpace: "496,000 sqm",
  description: "Hannover Messe is the world's leading trade fair for industrial technology, bringing together industry leaders, innovators, and decision-makers from around the globe."
};

const keySegments = [
  {
    name: "Industrial Automation",
    description: "Advanced manufacturing solutions, robotics, and smart factory technologies",
    halls: "Halls 2, 8, 9"
  },
  {
    name: "Energy Solutions",
    description: "Renewable energy, power generation, and energy storage systems",
    halls: "Halls 12, 13, 27"
  },
  {
    name: "Digital Factory",
    description: "Industry 4.0, IoT solutions, and digital transformation technologies",
    halls: "Halls 6, 7, 8"
  },
  {
    name: "Industrial Supply",
    description: "Components, materials, and services for industrial production",
    halls: "Halls 3, 4, 5"
  },
  {
    name: "Research & Technology",
    description: "Cutting-edge research, startups, and emerging technologies",
    halls: "Hall 2"
  }
];

const whyExhibit = [
  {
    icon: <FiGlobe className="w-6 h-6 text-blue-primary" />,
    title: "Global Reach",
    description: "Access to international markets with 75% international visitors"
  },
  {
    icon: <FiUsers className="w-6 h-6 text-blue-primary" />,
    title: "Quality Audience",
    description: "Decision-makers from manufacturing, engineering, and technology sectors"
  },
  {
    icon: <FiTool className="w-6 h-6 text-blue-primary" />,
    title: "Industry Innovation",
    description: "Showcase latest industrial technologies and Industry 4.0 solutions"
  },
  {
    icon: <FiTrendingUp className="w-6 h-6 text-blue-primary" />,
    title: "Business Growth",
    description: "Generate leads, partnerships, and business opportunities"
  }
];

const standOptions = [
  {
    type: "Shell Scheme",
    size: "9-24 sqm",
    price: "From €180/sqm",
    features: ["Basic walls", "Carpet", "Lighting", "Company name board"],
    popular: false
  },
  {
    type: "Custom Built",
    size: "25-100 sqm",
    price: "From €350/sqm",
    features: ["Custom design", "Premium materials", "Advanced lighting", "Storage", "Meeting room"],
    popular: true
  },
  {
    type: "Premium Pavilion",
    size: "100+ sqm",
    price: "Custom Quote",
    features: ["Unique architecture", "Premium finishes", "Multiple levels", "VIP areas", "Full services"],
    popular: false
  }
];

export default function HannoverMesse2025() {
  console.log("Hannover Messe 2025: Page loaded");

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
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">FEATURED EVENT</span>
                <span className="text-blue-primary font-semibold">APRIL 2025</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Hannover Messe
                <span className="block text-blue-primary">2025</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                World's leading trade fair for industrial technology. Connect with global industry leaders 
                and showcase your innovations at the premier industrial automation event.
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center space-x-2">
                  <FiCalendar className="text-blue-primary" />
                  <span>{exhibitionDetails.dates}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiMapPin className="text-blue-primary" />
                  <span>{exhibitionDetails.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiUsers className="text-blue-primary" />
                  <span>{exhibitionDetails.expectedAttendees} Visitors</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-blue-primary text-white px-8 py-4 text-lg">
                  Get Stand Quote
                </Button>
                <Button variant="outline" className="border-white text-white px-8 py-4 text-lg">
                  Download Brochure
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-white">Event Highlights</h3>
                  <div className="space-y-4 text-white">
                    <div className="flex justify-between">
                      <span>Expected Visitors:</span>
                      <span className="font-semibold">{exhibitionDetails.expectedAttendees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Exhibitors:</span>
                      <span className="font-semibold">{exhibitionDetails.expectedExhibitors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Exhibition Space:</span>
                      <span className="font-semibold">{exhibitionDetails.hallSpace}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>International Visitors:</span>
                      <span className="font-semibold">75%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Countries Represented:</span>
                      <span className="font-semibold">60+</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Exhibition Segments */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-navy-900">
            Key Exhibition Segments
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keySegments.map((segment, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-navy-900 mb-3">{segment.name}</h3>
                  <p className="text-gray-600 mb-4">{segment.description}</p>
                  <div className="text-sm text-blue-primary font-medium">{segment.halls}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Exhibit */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-navy-900">
            Why Exhibit at Hannover Messe?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyExhibit.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-navy-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stand Options */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-navy-900">
            Exhibition Stand Options
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {standOptions.map((option, index) => (
              <Card key={index} className={`relative h-full hover:shadow-xl transition-all duration-300 ${option.popular ? 'ring-2 ring-blue-primary' : ''}`}>
                {option.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-primary text-white text-sm px-4 py-1 rounded-full">MOST POPULAR</span>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-navy-900 mb-2">{option.type}</h3>
                  <div className="text-3xl font-bold text-blue-primary mb-2">{option.price}</div>
                  <div className="text-gray-600 mb-6">{option.size}</div>
                  <ul className="space-y-2 mb-8">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <FiCheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${option.popular ? 'bg-blue-primary text-white' : 'border-blue-primary text-blue-primary'}`}
                    variant={option.popular ? "default" : "outline"}
                  >
                    Get Quote
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Event Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-navy-900">
                About Hannover Messe 2025
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                {exhibitionDetails.description}
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <FiMapPin className="text-blue-primary" />
                  <div>
                    <span className="font-semibold text-navy-900">Venue: </span>
                    <span className="text-gray-600">{exhibitionDetails.venue}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FiGlobe className="text-blue-primary" />
                  <div>
                    <span className="font-semibold text-navy-900">Website: </span>
                    <span className="text-gray-600">{exhibitionDetails.website}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FiTrendingUp className="text-blue-primary" />
                  <div>
                    <span className="font-semibold text-navy-900">Focus: </span>
                    <span className="text-gray-600">{exhibitionDetails.industry}</span>
                  </div>
                </div>
              </div>
              <Link href="/contact">
                <Button className="bg-blue-primary text-white px-8 py-4 text-lg">
                  Get Your Stand Quote <FiArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div>
              <Card className="bg-blue-primary text-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Quick Facts</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-semibold">5 Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Opening Hours:</span>
                      <span className="font-semibold">9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hall Space:</span>
                      <span className="font-semibold">{exhibitionDetails.hallSpace}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Outdoor Area:</span>
                      <span className="font-semibold">200,000 sqm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Parking Spaces:</span>
                      <span className="font-semibold">30,000+</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Exhibit at Hannover Messe 2025?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Connect with our expert exhibition stand builders for Hannover Messe. Get custom designs, 
            professional installation, and full-service support for your industrial technology showcase.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-blue-primary px-8 py-4 text-lg">
                Get Free Quote
              </Button>
            </Link>
            <Link href="/exhibition-stands/germany/hannover">
              <Button variant="outline" className="border-white text-white px-8 py-4 text-lg">
                View Hannover Contractors
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