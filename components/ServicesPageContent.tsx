'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Hammer, 
  Truck, 
  Users, 
  Zap, 
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Clock,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import ClientPageWithBreadcrumbs from '@/components/ClientPageWithBreadcrumbs';

const services = [
  {
    id: 'custom-design',
    title: 'Custom Stand Design',
    description: 'Stands designed from scratch around your brand, products and stand space',
    icon: Palette,
    features: ['3D Visualization', 'Brand Integration', 'Space Optimization', 'Interactive Elements'],
    priceRange: '$200-800/sqm',
    popular: true,
    href: '/custom-booth'
  },
  {
    id: 'construction',
    title: 'Stand Construction',
    description: 'Workshop fabrication and finishing to the approved design and drawings',
    icon: Hammer,
    features: ['Quality Materials', 'Expert Craftsmanship', 'On-time Delivery', 'Safety Compliance'],
    priceRange: '$150-600/sqm',
    popular: true,
    href: '/custom-booth'
  },
  {
    id: 'installation',
    title: 'Installation & Dismantling',
    description: 'Complete setup and breakdown services at exhibition venues',
    icon: Truck,
    features: ['Venue Coordination', 'Professional Team', 'Equipment Handling', 'Post-event Cleanup'],
    priceRange: '$50-200/sqm',
    popular: false,
    href: '/trade-show-installation-and-dismantle'
  },
  {
    id: 'project-management',
    title: 'Project Management',
    description: 'End-to-end project coordination and management services',
    icon: Users,
    features: ['Timeline Management', 'Vendor Coordination', 'Quality Control', 'Budget Management'],
    priceRange: '$100-300/day',
    popular: false,
    href: '/trade-show-project-management'
  },
  {
    id: '3d-visualization',
    title: '3D Visualization',
    description: 'Photorealistic 3D renders and virtual walkthroughs',
    icon: Zap,
    features: ['Photorealistic Renders', 'Virtual Reality', 'Design Iterations', 'Client Presentations'],
    priceRange: '$500-2000/project',
    popular: false,
    href: '/3d-rendering-and-concept-development'
  },
  {
    id: 'graphics-printing',
    title: 'Graphics & Printing',
    description: 'High-quality graphics, signage, and promotional materials',
    icon: Award,
    features: ['Large Format Printing', 'Digital Graphics', 'Fabric Displays', 'LED Screens'],
    priceRange: '$20-100/sqm',
    popular: false,
    href: '/trade-show-graphics-printing'
  }
];

const benefits = [
  {
    icon: Globe,
    title: 'Global Network',
    description: 'Vetted stand builders across 60+ countries, matched to your show'
  },
  {
    icon: Clock,
    title: 'Fast Turnaround',
    description: 'Most quote requests are answered within 24 hours'
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'Profiles, project history and client feedback are reviewed before listing'
  },
  {
    icon: Star,
    title: 'Expert Support',
    description: 'A real person to help from first brief through to build day'
  }
];

export default function ServicesPageContent() {
  return (
    <ClientPageWithBreadcrumbs className="min-h-screen bg-[#F5F6F7]">
      
      {/* Hero Section */}
      <section className="bg-[#252525] text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Exhibition Stand Services: Design, Build, Graphics &amp; Installation
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Everything your trade show stand needs, in one place: custom design, construction,
              3D visualisation, graphics &amp; printing, installation &amp; dismantle, and full project
              management. Get matched with verified builders worldwide and compare quotes in 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote">
                <Button size="lg" className="bg-white text-[#E03A3A]">
                  Get Free Quote
                </Button>
              </Link>
              <Link href="/builders">
                <Button size="lg" variant="outline" className="border-white text-white">
                  Browse Builders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Services Grid */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#252525] mb-4">
              Full-Service Exhibition Stand Solutions
            </h2>
            <p className="text-lg text-[#5B5C5D] max-w-2xl mx-auto">
              From concept to carpet: design, build, graphics, AV, logistics and on-site support for exhibitions in any market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow relative">
                {service.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-[#E03A3A] text-white">
                    Popular
                  </Badge>
                )}
                <CardHeader>
                  <div className="w-12 h-12 bg-[#FDE3E3] rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-[#E03A3A]" />
                  </div>
                  <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-[#5B5C5D]">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#828384]">Starting from</span>
                      <span className="font-semibold text-[#E03A3A]">{service.priceRange}</span>
                    </div>
                    
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-[#5B5C5D]">
                          <CheckCircle className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Link href={service.href}>
                      <Button className="w-full mt-4" variant="outline">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#252525] mb-4">
              Why Exhibitors Choose StandsZone
            </h2>
            <p className="text-lg text-[#5B5C5D] max-w-2xl mx-auto">
              A single brief gets you matched with vetted builders, then real quotes you can compare side by side.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#FDE3E3] rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-[#E03A3A]" />
                </div>
                <h3 className="text-lg font-semibold text-[#252525] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-[#5B5C5D]">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#252525] mb-4">
              How to Get Your Exhibition Stand Built
            </h2>
            <p className="text-lg text-[#5B5C5D] max-w-2xl mx-auto">
              Four simple steps from brief to a stand that is built and installed on time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Submit Requirements', description: 'Tell us about your exhibition needs and preferences' },
              { step: '02', title: 'Get Quotes', description: 'Receive competitive quotes from verified builders' },
              { step: '03', title: 'Choose Builder', description: 'Compare and select the best builder for your project' },
              { step: '04', title: 'Project Delivery', description: 'Your stand is designed, built, and installed on time' }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-[#E03A3A] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-[#252525] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#5B5C5D]">
                  {item.description}
                </p>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 w-6 h-6 text-[#B4B5B6]" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#E03A3A] rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Matched With Verified Exhibition Stand Builders
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Send one brief and receive quotes from vetted builders who work at your show.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-[#E03A3A]">
                Get Free Quote
              </Button>
            </Link>
            <Link href="/builders">
              <Button size="lg" variant="outline" className="border-white text-white">
                Browse Builders
              </Button>
            </Link>
          </div>
        </section>
      </div>

    </ClientPageWithBreadcrumbs>
  );
}