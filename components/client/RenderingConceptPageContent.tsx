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

export default function RenderingConceptPageContent() {
  const [saved, setSaved] = useState<any>(null);
  
  // Default service cards data as fallback
  const defaultServiceCards = [
    {
      title: '3D Visualization',
      description: 'Photorealistic 3D renders for booth concepts and designs',
      startingFrom: 'Starting from',
      price: '$800',
      features: ['High-resolution renders', 'Multiple angles', 'Lighting effects', 'Material accuracy'],
      buttonText: 'Get Quote',
      buttonLink: '/quote',
      badge: ''
    },
    {
      title: 'Concept Development',
      description: 'Rapid concept iterations and design exploration',
      startingFrom: 'Starting from',
      price: '$1,200',
      features: ['Multiple concepts', 'Quick iterations', 'Stakeholder alignment', 'Design refinement'],
      buttonText: 'Get Quote',
      buttonLink: '/quote',
      badge: 'Most Popular'
    },
    {
      title: 'Full Design Package',
      description: 'Complete 3D design with all visualizations and concepts',
      startingFrom: 'Starting from',
      price: '$2,500',
      features: ['Complete 3D model', 'Multiple render views', 'Animation sequences', 'Design documentation'],
      buttonText: 'Get Quote',
      buttonLink: '/quote',
      badge: 'Premium'
    }
  ];
  
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "/api/admin/pages-editor?action=get-content&path=%2F3d-rendering-and-concept-development",
          { cache: "no-store" }
        );
        const data = await res.json();
        if (data?.success && data?.data) {
          console.log("Loaded 3d-rendering data:", data.data);
          console.log("Service cards:", data.data?.sections?.renderingConcept?.services?.serviceCards);
          setSaved(data.data);
        }
      } catch (error) {
        console.error("Error loading 3d-rendering data:", error);
      }
    })();
  }, []);

  // Listen for admin updates and refetch saved content in real-time
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent)?.detail as
        | { pageId?: string }
        | undefined;
      if (!detail?.pageId || detail.pageId === "3d-rendering-and-concept-development") {
        (async () => {
          try {
            const res = await fetch(
              "/api/admin/pages-editor?action=get-content&path=%2F3d-rendering-and-concept-development",
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
        mainHeading={saved?.sections?.renderingConcept?.hero?.heading || "3D Rendering & Concept Development"}
        highlightHeading="& Visual Design"
        description={saved?.sections?.renderingConcept?.hero?.description || "Photorealistic 3D visuals and rapid concept iterations to align stakeholders and accelerate approvals."}
        stats={[
          {
            icon: "calendar",
            value: "24h",
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
            value: "4.9/5",
            label: "Avg Rating",
            color: "#f4a261",
          },
          {
            icon: "chart-line",
            value: "2000+",
            label: "Projects",
            color: "#a06cd5",
          },
        ]}
        showSearch={false}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Why Choose 3D Rendering Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {saved?.sections?.renderingConcept?.whyChoose?.heading || "Why Choose 3D Rendering?"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {saved?.sections?.renderingConcept?.whyChoose?.paragraph || "Bring your exhibition concepts to life with stunning visualizations that accelerate decision-making"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(saved?.sections?.renderingConcept?.whyChoose?.features || []).map((feature: any, index: number) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {(() => {
                    const icons = [Palette, Lightbulb, Target, Layers];
                    const IconComponent = icons[index] || Palette;
                    return <IconComponent className="w-8 h-8 text-green-600" />;
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

        {/* Our Design Process Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {saved?.sections?.renderingConcept?.process?.heading || "Our Design Process"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {saved?.sections?.renderingConcept?.process?.paragraph || "From initial concept to final visualization, we guide you through every step"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {(saved?.sections?.renderingConcept?.process?.steps || []).map((step: any, index: number) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
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

        {/* 3D Rendering Services Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {saved?.sections?.renderingConcept?.services?.heading || "3D Rendering Services"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {saved?.sections?.renderingConcept?.services?.paragraph || "Comprehensive 3D visualization solutions for every exhibition need"}
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(saved?.sections?.renderingConcept?.services?.serviceCards || defaultServiceCards).map((card: any, index: number) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 p-6 relative border border-gray-100"
              >
                {card.badge && (
                  <Badge className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
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
                    <span className="text-lg font-bold text-green-600">
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
                    className="w-full bg-white text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 font-semibold py-3 rounded-lg" 
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
        <section className="bg-gradient-to-r from-green-600 to-teal-700 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {saved?.sections?.renderingConcept?.cta?.heading || "Ready to Visualize Your Exhibition Concept?"}
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {saved?.sections?.renderingConcept?.cta?.paragraph || "Connect with 3D rendering experts who bring your ideas to life"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {(saved?.sections?.renderingConcept?.cta?.buttons || []).map((button: any, index: number) => (
              <Link key={index} href={button.href || "/quote"}>
                <Button
                  size="lg"
                  className={index === 0 ? "bg-white text-green-600 hover:bg-gray-100" : "border-white text-white hover:bg-white hover:text-green-600"}
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
