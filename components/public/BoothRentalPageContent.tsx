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

export default function BoothRentalPageContent() {
  const [saved, setSaved] = useState<any>(null);
  
  // Default service cards data as fallback
  const defaultServiceCards = [
    {
      title: 'Modular Booth Rental',
      description: 'Flexible modular systems for various booth sizes and configurations',
      startingFrom: 'Starting from',
      price: '$1,500',
      features: ['Easy setup', 'Multiple configurations', 'Professional appearance', 'Cost-effective'],
      buttonText: 'Get Quote',
      buttonLink: '/quote',
      badge: ''
    },
    {
      title: 'Custom Graphics Package',
      description: 'Complete branding and graphics for your rental booth',
      startingFrom: 'Starting from',
      price: '$800',
      features: ['Brand integration', 'High-quality prints', 'Quick turnaround', 'Installation included'],
      buttonText: 'Get Quote',
      buttonLink: '/quote',
      badge: 'Most Popular'
    },
    {
      title: 'Full Service Rental',
      description: 'Complete booth rental with setup, graphics, and support',
      startingFrom: 'Starting from',
      price: '$3,500',
      features: ['End-to-end service', 'Professional installation', 'On-site support', 'Complete package'],
      buttonText: 'Get Quote',
      buttonLink: '/quote',
      badge: 'Premium'
    }
  ];
  
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "/api/admin/pages-editor?action=get-content&path=%2Fbooth-rental",
          { cache: "no-store" }
        );
        const data = await res.json();
        if (data?.success && data?.data) {
          console.log("Loaded booth-rental data:", data.data);
          console.log("Service cards:", data.data?.sections?.boothRental?.services?.serviceCards);
          setSaved(data.data);
        }
      } catch (error) {
        console.error("Error loading booth-rental data:", error);
      }
    })();
  }, []);

  // Listen for admin updates and refetch saved content in real-time
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent)?.detail as
        | { pageId?: string }
        | undefined;
      if (!detail?.pageId || detail.pageId === "booth-rental") {
        (async () => {
          try {
            const res = await fetch(
              "/api/admin/pages-editor?action=get-content&path=%2Fbooth-rental",
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
        mainHeading={saved?.sections?.boothRental?.hero?.heading || "Booth Rental Services"}
        highlightHeading="& Exhibition Solutions"
        description={saved?.sections?.boothRental?.hero?.description || "Flexible, cost-effective exhibition booth rental solutions with full setup and support."}
        stats={[
          {
            icon: "calendar",
            value: "10+",
            label: "Rental Options",
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
            value: "4.7/5",
            label: "Avg Rating",
            color: "#f4a261",
          },
          {
            icon: "chart-line",
            value: "3000+",
            label: "Rentals",
            color: "#a06cd5",
          },
        ]}
        showSearch={false}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Why Choose Booth Rental Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {saved?.sections?.boothRental?.whyChoose?.heading || "Why Choose Booth Rental?"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {saved?.sections?.boothRental?.whyChoose?.paragraph || "Cost-effective solutions for businesses that need professional exhibition presence without the long-term commitment"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(saved?.sections?.boothRental?.whyChoose?.features || []).map((feature: any, index: number) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {(() => {
                    const icons = [Palette, Lightbulb, Target, Layers];
                    const IconComponent = icons[index] || Palette;
                    return <IconComponent className="w-8 h-8 text-blue-600" />;
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

        {/* Our Rental Process Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {saved?.sections?.boothRental?.process?.heading || "Our Rental Process"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {saved?.sections?.boothRental?.process?.paragraph || "Simple, streamlined process from selection to show floor"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {(saved?.sections?.boothRental?.process?.steps || []).map((step: any, index: number) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
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

        {/* Booth Rental Services Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {saved?.sections?.boothRental?.services?.heading || "Booth Rental Services"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {saved?.sections?.boothRental?.services?.paragraph || "Comprehensive rental solutions for every exhibition need"}
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(saved?.sections?.boothRental?.services?.serviceCards || defaultServiceCards).map((card: any, index: number) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 p-6 relative border border-gray-100"
              >
                {card.badge && (
                  <Badge className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
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
                    <span className="text-lg font-bold text-blue-600">
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
                    className="w-full bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold py-3 rounded-lg" 
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
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {saved?.sections?.boothRental?.cta?.heading || "Ready to Rent Your Exhibition Booth?"}
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {saved?.sections?.boothRental?.cta?.paragraph || "Connect with rental experts who understand your exhibition needs"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {(saved?.sections?.boothRental?.cta?.buttons || []).map((button: any, index: number) => (
              <Link key={index} href={button.href || "/quote"}>
                <Button
                  size="lg"
                  className={index === 0 ? "bg-white text-blue-600 hover:bg-gray-100" : "border-white text-white hover:bg-white hover:text-blue-600"}
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
