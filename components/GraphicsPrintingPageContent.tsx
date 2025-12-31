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

export default function GraphicsPrintingPageContent() {
  const [saved, setSaved] = useState<any>(null);
  
  // Default service cards data as fallback
  const defaultServiceCards = [
    {
      title: 'Basic Graphics',
      description: 'Essential graphics and branding for exhibitions',
      startingFrom: 'Starting from',
      price: '$300',
      features: ['Logo integration', 'Basic layouts', 'Standard printing', 'Quick turnaround'],
      buttonText: 'Get Quote',
      buttonLink: '/quote',
      badge: ''
    },
    {
      title: 'Premium Graphics',
      description: 'High-quality graphics with advanced design',
      startingFrom: 'Starting from',
      price: '$800',
      features: ['Custom designs', 'Multiple formats', 'Premium materials', 'Design consultation'],
      buttonText: 'Get Quote',
      buttonLink: '/quote',
      badge: 'Most Popular'
    },
    {
      title: 'Complete Package',
      description: 'Full graphics and printing solution',
      startingFrom: 'Starting from',
      price: '$1,500',
      features: ['Full branding', 'All materials', 'Installation support', 'Ongoing updates'],
      buttonText: 'Get Quote',
      buttonLink: '/quote',
      badge: 'Premium'
    }
  ];
  
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "/api/admin/pages-editor?action=get-content&path=%2Ftrade-show-graphics-printing",
          { cache: "no-store" }
        );
        const data = await res.json();
        if (data?.success && data?.data) {
          console.log("Loaded graphics-printing data:", data.data);
          console.log("Service cards:", data.data?.sections?.graphicsPrinting?.services?.serviceCards);
          setSaved(data.data);
        }
      } catch (error) {
        console.error("Error loading graphics-printing data:", error);
      }
    })();
  }, []);

  // Listen for admin updates and refetch saved content in real-time
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent)?.detail as
        | { pageId?: string }
        | undefined;
      if (!detail?.pageId || detail.pageId === "trade-show-graphics-printing") {
        (async () => {
          try {
            const res = await fetch(
              "/api/admin/pages-editor?action=get-content&path=%2Ftrade-show-graphics-printing",
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
        mainHeading={saved?.sections?.graphicsPrinting?.hero?.heading || "Trade Show Graphics & Printing"}
        highlightHeading="& Professional Branding"
        description={saved?.sections?.graphicsPrinting?.hero?.description || "High-quality large-format prints, branding, and wayfinding tailored for exhibitions."}
        stats={[
          {
            icon: "calendar",
            value: "48h",
            label: "Turnaround",
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
            value: "1200+",
            label: "Projects",
            color: "#a06cd5",
          },
        ]}
        showSearch={false}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Why Choose Graphics & Printing Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {saved?.sections?.graphicsPrinting?.whyChoose?.heading || "Why Choose Professional Graphics?"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {saved?.sections?.graphicsPrinting?.whyChoose?.paragraph || "Make your exhibition stand out with professional graphics and high-quality printing"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(saved?.sections?.graphicsPrinting?.whyChoose?.features || []).map((feature: any, index: number) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {(() => {
                    const icons = [Palette, Lightbulb, Target, Layers];
                    const IconComponent = icons[index] || Palette;
                    return <IconComponent className="w-8 h-8 text-red-600" />;
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

        {/* Our Graphics Process Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {saved?.sections?.graphicsPrinting?.process?.heading || "Our Graphics Process"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {saved?.sections?.graphicsPrinting?.process?.paragraph || "From concept to final print, we ensure your graphics are perfect"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {(saved?.sections?.graphicsPrinting?.process?.steps || []).map((step: any, index: number) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
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

        {/* Graphics & Printing Services Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {saved?.sections?.graphicsPrinting?.services?.heading || "Graphics & Printing Services"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {saved?.sections?.graphicsPrinting?.services?.paragraph || "Comprehensive graphics and printing solutions for every exhibition need"}
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(saved?.sections?.graphicsPrinting?.services?.serviceCards || defaultServiceCards).map((card: any, index: number) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 p-6 relative border border-gray-100"
              >
                {card.badge && (
                  <Badge className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
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
                    <span className="text-lg font-bold text-red-600">
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
                    className="w-full bg-white text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 font-semibold py-3 rounded-lg" 
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
        <section className="bg-gradient-to-r from-red-600 to-pink-700 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {saved?.sections?.graphicsPrinting?.cta?.heading || "Ready for Professional Graphics & Printing?"}
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {saved?.sections?.graphicsPrinting?.cta?.paragraph || "Connect with graphics experts who bring your brand to life"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {(saved?.sections?.graphicsPrinting?.cta?.buttons || []).map((button: any, index: number) => (
              <Link key={index} href={button.href || "/quote"}>
                <Button
                  size="lg"
                  className={index === 0 ? "bg-white text-red-600 hover:bg-gray-100" : "border-white text-white hover:bg-white hover:text-red-600"}
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
