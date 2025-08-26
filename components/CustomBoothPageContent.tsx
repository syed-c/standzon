"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Zap,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Clock,
  Shield,
  Lightbulb,
  Target,
  Layers,
} from "lucide-react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TradeStyleBanner from "@/components/TradeStyleBanner";

const features = [
  {
    icon: Palette,
    title: "Brand-Focused Design",
    description:
      "Every element designed to reflect your brand identity and values",
  },
  {
    icon: Lightbulb,
    title: "Creative Innovation",
    description: "Cutting-edge design concepts that make your booth stand out",
  },
  {
    icon: Target,
    title: "Goal-Oriented",
    description: "Designed specifically to achieve your exhibition objectives",
  },
  {
    icon: Layers,
    title: "Multi-Functional",
    description: "Spaces that work for meetings, demos, and networking",
  },
];

const process = [
  {
    step: "01",
    title: "Discovery & Brief",
    description: "We understand your brand, goals, and exhibition requirements",
  },
  {
    step: "02",
    title: "Concept Design",
    description:
      "3D concepts and layouts tailored to your space and objectives",
  },
  {
    step: "03",
    title: "Design Refinement",
    description: "Collaborative refinement until the design is perfect",
  },
  {
    step: "04",
    title: "Production & Install",
    description:
      "Expert construction and professional installation at your venue",
  },
];

export default function CustomBoothPageContent() {
  const [saved, setSaved] = useState<any>(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "/api/admin/pages-editor?action=get-content&path=%2Fcustom-booth",
          { cache: "no-store" }
        );
        const data = await res.json();
        if (data?.success && data?.data) setSaved(data.data);
      } catch {}
    })();
  }, []);

  // Listen for admin updates and refetch saved content in real-time
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent)?.detail as
        | { pageId?: string }
        | undefined;
      if (!detail?.pageId || detail.pageId === "custom-booth") {
        (async () => {
          try {
            const res = await fetch(
              "/api/admin/pages-editor?action=get-content&path=%2Fcustom-booth",
              { cache: "no-store" }
            );
            const data = await res.json();
            if (data?.success && data?.data) setSaved(data.data);
          } catch {}
        })();
      }
    };
    window.addEventListener("global-pages:updated", handler as EventListener);
    return () =>
      window.removeEventListener(
        "global-pages:updated",
        handler as EventListener
      );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Trade Shows style banner */}
      <TradeStyleBanner
        badgeText="Professional Trade Show Database"
        mainHeading="Custom Exhibition Booths"
        highlightHeading="& Bespoke Stand Design"
        description="Bespoke trade show stands designed to capture attention, engage visitors, and drive results for your business."
        stats={[
          {
            icon: "calendar",
            value: "15+",
            label: "Design Services",
            color: "#2ec4b6",
          },
          {
            icon: "map-pin",
            value: "Global",
            label: "Coverage",
            color: "#3dd598",
          },
          {
            icon: "users",
            value: "4.8/5",
            label: "Avg Rating",
            color: "#f4a261",
          },
          {
            icon: "chart-line",
            value: "5000+",
            label: "Projects",
            color: "#a06cd5",
          },
        ]}
        showSearch={false}
      />

      {saved?.content?.extra?.rawHtml && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: saved.content.extra.rawHtml }}
            />
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Custom Design?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stand out from the crowd with a booth that's uniquely yours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Design Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From concept to completion, we guide you through every step
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 w-6 h-6 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Services Grid */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Custom Design Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive custom booth solutions for every need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Concept Development",
                description:
                  "Initial design concepts based on your brief and objectives",
                features: [
                  "Brand analysis",
                  "3D visualization",
                  "Space planning",
                  "Material selection",
                ],
                price: "From $2,000",
              },
              {
                title: "Full Custom Design",
                description: "Complete custom booth design with all elements",
                features: [
                  "Unique architecture",
                  "Custom graphics",
                  "Interactive elements",
                  "Lighting design",
                ],
                price: "From $15,000",
                popular: true,
              },
              {
                title: "Modular Custom",
                description: "Custom-designed modular systems for flexibility",
                features: [
                  "Reusable components",
                  "Multiple configurations",
                  "Easy transport",
                  "Cost-effective",
                ],
                price: "From $8,000",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow relative"
              >
                {service.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-purple-500 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-xl mb-2">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Starting from
                      </span>
                      <span className="font-semibold text-purple-600">
                        {service.price}
                      </span>
                    </div>

                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link href="/quote">
                      <Button className="w-full mt-4" variant="outline">
                        Get Quote
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Your Custom Booth?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Connect with expert designers who understand your industry and
            objectives
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Start Your Project
              </Button>
            </Link>
            <Link href="/builders">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-600"
              >
                Browse Designers
              </Button>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
