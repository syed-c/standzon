"use client";

import { Card, CardContent } from '@/components/ui/card';
import { FiTrendingUp, FiLayout, FiTool, FiGlobe, FiUsers, FiAward } from 'react-icons/fi';

export default function ServicesSection() {
  console.log("ServicesSection: Component rendered");

  const services = [
    {
      icon: FiLayout,
      title: "Custom Stand Design",
      description: "Bespoke exhibition stands tailored to your brand identity and objectives. From concept sketches to 3D renderings.",
      features: ["3D Visualization", "Brand Integration", "Space Optimization"]
    },
    {
      icon: FiTool,
      title: "Build & Installation",
      description: "Expert construction and on-site installation with project management and quality assurance.",
      features: ["Project Management", "Quality Control", "On-site Support"]
    },
    {
      icon: FiGlobe,
      title: "Global Services",
      description: "Seamless exhibition solutions across 50+ countries with local expertise and international standards.",
      features: ["Local Partnerships", "Logistics Management", "Compliance Support"]
    },
    {
      icon: FiTrendingUp,
      title: "Marketing Integration",
      description: "Strategic planning to maximize your exhibition ROI with integrated marketing solutions.",
      features: ["Lead Generation", "Digital Integration", "Analytics & Reporting"]
    },
    {
      icon: FiUsers,
      title: "Event Management",
      description: "Complete event coordination from planning to execution, ensuring smooth operations.",
      features: ["Staff Coordination", "Visitor Experience", "Real-time Support"]
    },
    {
      icon: FiAward,
      title: "Premium Experiences",
      description: "Luxury exhibition experiences that leave lasting impressions on your target audience.",
      features: ["VIP Areas", "Interactive Technology", "Hospitality Services"]
    }
  ];

  return (
    <section id="services" className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 mb-6 font-inter">
            Comprehensive Exhibition
            <br />
            <span className="text-blue-primary">Solutions</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From initial concept to final execution, we provide end-to-end exhibition services 
            that transform your vision into reality and drive measurable results.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-blue-100 bg-gradient-to-br from-white to-blue-50/30 hover:border-blue-300 premium-shadow"
            >
              <CardContent className="p-8">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-primary to-blue-light rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-navy-900 mb-4 font-inter">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-blue-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-primary/5 to-gold-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-primary to-gold-primary p-8 lg:p-12 rounded-2xl text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4 font-inter">
              Ready to Create Something Extraordinary?
            </h3>
            <p className="text-lg mb-8 opacity-90">
              Let's discuss your exhibition goals and create a solution that exceeds expectations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Schedule Consultation
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors shadow-lg bg-black/30">
                View Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}