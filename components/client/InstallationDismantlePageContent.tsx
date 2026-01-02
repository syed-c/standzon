"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/shared/button";
import { Badge } from "@/components/shared/badge";
import {
  Palette,
  Lightbulb,
  Target,
  Layers,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import Navigation from "@/components/client/Navigation";
import Footer from "@/components/client/Footer";
import TradeStyleBanner from '@/components/client/TradeStyleBanner';

export default function InstallationDismantlePageContent() {
  const [saved, setSaved] = useState<any>(null);
  
  // Default service cards data as fallback
  const defaultServiceCards = [
    {
      title: 'Basic Installation',
      description: 'Standard booth setup and dismantle services',
      startingFrom: 'Starting from',
      price: '$500',
      features: ['Professional setup', 'On-time delivery', 'Quality assurance', 'Basic support'],
      buttonText: 'Get Quote',
      buttonLink: '/quote',
      badge: ''
    },
    {
      title: 'Premium Installation',
      description: 'Full-service installation with premium support',
      startingFrom: 'Starting from',
      price: '$1,200',
      features: ['Expert technicians', '24/7 support', 'Quality guarantee', 'Full documentation'],
      buttonText: 'Get Quote',
      buttonLink: '/quote',
      badge: 'Most Popular'
    },
    {
      title: 'Complete I&D Package',
      description: 'End-to-end installation and dismantle service',
      startingFrom: 'Starting from',
      price: '$2,500',
      features: ['Project management', 'Logistics coordination', 'On-site supervision', 'Post-show support'],
      buttonText: 'Get Quote',
      buttonLink: '/quote',
      badge: 'Premium'
    }
  ];
  
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "/api/admin/pages-editor?action=get-content&path=%2Ftrade-show-installation-and-dismantle",
          { cache: "no-store" }
        );
        const data = await res.json();
        if (data?.success && data?.data) {
          console.log("Loaded installation-dismantle data:", data.data);
          console.log("Service cards:", data.data?.sections?.installationDismantle?.services?.serviceCards);
          setSaved(data.data);
        }
      } catch (error) {
        console.error("Error loading installation-dismantle data:", error);
      }
    })();
  }, []);

  // Listen for admin updates and refetch saved content in real-time
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent)?.detail as
        | { pageId?: string }
        | undefined;
      if (!detail?.pageId || detail.pageId === "trade-show-installation-and-dismantle") {
        (async () => {
          try {
            const res = await fetch(
              "/api/admin/pages-editor?action=get-content&path=%2Ftrade-show-installation-and-dismantle",
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

      {/* Hero Section */}
      <TradeStyleBanner
        badgeText="Professional Trade Show Database"
        mainHeading={saved?.sections?.installationDismantle?.hero?.heading || "Trade Show Installation & Dismantle"}
        highlightHeading="& Professional Services"
        description={saved?.sections?.installationDismantle?.hero?.description || "End-to-end I&D services for a flawless show experience, from logistics to on-site execution."}
        stats={[
          {
            icon: "calendar",
            value: "24h",
            label: "Response Time",
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
            value: "1500+",
            label: "Projects",
            color: "#a06cd5",
          },
        ]}
        showSearch={false}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Why Choose Installation & Dismantle Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {saved?.sections?.installationDismantle?.whyChoose?.heading || "Why Choose Professional I&D?"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {saved?.sections?.installationDismantle?.whyChoose?.paragraph || "Ensure your exhibition success with professional installation and dismantle services"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(saved?.sections?.installationDismantle?.whyChoose?.features || []).map((feature: any, index: number) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {(() => {
                    const icons = [Palette, Lightbulb, Target, Layers];
                    const IconComponent = icons[index] || Palette;
                    return <IconComponent className="w-8 h-8 text-orange-600" />;
                  })()}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.heading || "Feature " + (index + 1)}
                </h3>
                <p className="text-gray-600">{feature.paragraph || "Feature description"}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our I&D Process Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {saved?.sections?.installationDismantle?.process?.heading || "Our I&D Process"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {saved?.sections?.installationDismantle?.process?.paragraph || "Streamlined process ensuring your booth is set up perfectly and dismantled efficiently"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {(saved?.sections?.installationDismantle?.process?.steps || []).map((step: any, index: number) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.heading || "Step " + (index + 1)}
                </h3>
                <p className="text-gray-600">{step.paragraph || "Step description"}</p>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 w-6 h-6 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Installation & Dismantle Services Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {saved?.sections?.installationDismantle?.services?.heading || "Installation & Dismantle Services"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {saved?.sections?.installationDismantle?.services?.paragraph || "Comprehensive I&D solutions for every exhibition need"}
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(saved?.sections?.installationDismantle?.services?.serviceCards || defaultServiceCards).map((card: any, index: number) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 p-6 relative border border-gray-100"
              >
                {card.badge && (
                  <Badge className="absolute -top-3 -right-3 bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
                    {card.badge}
                  </Badge>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {card.title || `Service ${index + 1}`}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {card.description || "Service description"}
                  </p>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500 font-medium">
                      {card.startingFrom || "Starting from"}
                    </span>
                    <span className="text-lg font-bold text-orange-600">
                      {card.price || "$0"}
                    </span>
                  </div>
                  
                  <ul className="space-y-3">
                    {(card.features || []).map((feature: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start text-sm text-gray-600"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={card.buttonLink || "/quote"}>
                  <Button 
                    className="w-full bg-white text-orange-600 border-2 border-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-300 font-semibold py-3 rounded-lg" 
                    variant="outline"
                  >
                    {card.buttonText || "Get Quote"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-gradient-to-r from-orange-600 to-red-700 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {saved?.sections?.installationDismantle?.cta?.heading || "Ready for Professional I&D Services?"}
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {saved?.sections?.installationDismantle?.cta?.paragraph || "Connect with installation experts who ensure your exhibition success"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {(saved?.sections?.installationDismantle?.cta?.buttons || []).map((button: any, index: number) => (
              <Link key={index} href={button.href || "/quote"}>
                <Button
                  size="lg"
                  className={index === 0 ? "bg-white text-orange-600 hover:bg-gray-100" : "border-white text-white hover:bg-white hover:text-orange-600"}
                  variant={index === 0 ? "default" : "outline"}
                >
                  {button.text || "Get Started"}
                </Button>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
