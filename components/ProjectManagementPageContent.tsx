"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Lightbulb,
  Target,
  Layers,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TradeStyleBanner from '@/components/shared/TradeStyleBanner';

export default function ProjectManagementPageContent() {
  const [saved, setSaved] = useState<any>(null);
  
  // Default service cards data as fallback
  const defaultServiceCards = [
    {
      title: 'Basic PM',
      description: 'Essential project management for small exhibitions',
      startingFrom: 'Starting from',
      price: '$800',
      features: ['Timeline management', 'Vendor coordination', 'Basic reporting', 'Email support'],
      buttonText: 'Get Quote',
      buttonLink: '/quote',
      badge: ''
    },
    {
      title: 'Standard PM',
      description: 'Comprehensive project management with full support',
      startingFrom: 'Starting from',
      price: '$1,500',
      features: ['Full coordination', 'Regular updates', 'Risk management', 'Phone support'],
      buttonText: 'Get Quote',
      buttonLink: '/quote',
      badge: 'Most Popular'
    },
    {
      title: 'Premium PM',
      description: 'End-to-end project management with dedicated manager',
      startingFrom: 'Starting from',
      price: '$3,000',
      features: ['Dedicated manager', '24/7 support', 'Advanced reporting', 'On-site supervision'],
      buttonText: 'Get Quote',
      buttonLink: '/quote',
      badge: 'Premium'
    }
  ];
  
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "/api/admin/pages-editor?action=get-content&path=%2Ftrade-show-project-management",
          { cache: "no-store" }
        );
        const data = await res.json();
        if (data?.success && data?.data) {
          console.log("Loaded project-management data:", data.data);
          console.log("Service cards:", data.data?.sections?.projectManagement?.services?.serviceCards);
          setSaved(data.data);
        }
      } catch (error) {
        console.error("Error loading project-management data:", error);
      }
    })();
  }, []);

  // Listen for admin updates and refetch saved content in real-time
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent)?.detail as
        | { pageId?: string }
        | undefined;
      if (!detail?.pageId || detail.pageId === "trade-show-project-management") {
        (async () => {
          try {
            const res = await fetch(
              "/api/admin/pages-editor?action=get-content&path=%2Ftrade-show-project-management",
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
        mainHeading={saved?.sections?.projectManagement?.hero?.heading || "Trade Show Project Management"}
        highlightHeading="& Professional Coordination"
        description={saved?.sections?.projectManagement?.hero?.description || "End-to-end PM including vendor coordination, timelines, and on-site supervision."}
        stats={[
          {
            icon: "calendar",
            value: "100%",
            label: "On Time",
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
            value: "4.9/5",
            label: "Avg Rating",
            color: "#f4a261",
          },
          {
            icon: "chart-line",
            value: "800+",
            label: "Projects",
            color: "#a06cd5",
          },
        ]}
        showSearch={false}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Why Choose Project Management Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {saved?.sections?.projectManagement?.whyChoose?.heading || "Why Choose Professional PM?"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {saved?.sections?.projectManagement?.whyChoose?.paragraph || "Ensure your exhibition success with expert project management and coordination"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(saved?.sections?.projectManagement?.whyChoose?.features || []).map((feature: any, index: number) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {(() => {
                    const icons = [Palette, Lightbulb, Target, Layers];
                    const IconComponent = icons[index] || Palette;
                    return <IconComponent className="w-8 h-8 text-purple-600" />;
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

        {/* Our PM Process Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {saved?.sections?.projectManagement?.process?.heading || "Our PM Process"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {saved?.sections?.projectManagement?.process?.paragraph || "Structured approach ensuring your exhibition project runs smoothly from start to finish"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {(saved?.sections?.projectManagement?.process?.steps || []).map((step: any, index: number) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
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

        {/* Project Management Services Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {saved?.sections?.projectManagement?.services?.heading || "Project Management Services"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {saved?.sections?.projectManagement?.services?.paragraph || "Comprehensive PM solutions for every exhibition need"}
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(saved?.sections?.projectManagement?.services?.serviceCards || defaultServiceCards).map((card: any, index: number) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 p-6 relative border border-gray-100"
              >
                {card.badge && (
                  <Badge className="absolute -top-3 -right-3 bg-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
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
                    <span className="text-lg font-bold text-purple-600">
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
                    className="w-full bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 font-semibold py-3 rounded-lg" 
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
        <section className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {saved?.sections?.projectManagement?.cta?.heading || "Ready for Professional Project Management?"}
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {saved?.sections?.projectManagement?.cta?.paragraph || "Connect with PM experts who ensure your exhibition success"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {(saved?.sections?.projectManagement?.cta?.buttons || []).map((button: any, index: number) => (
              <Link key={index} href={button.href || "/quote"}>
                <Button
                  size="lg"
                  className={index === 0 ? "bg-white text-purple-600 hover:bg-gray-100" : "border-white text-white hover:bg-white hover:text-purple-600"}
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
