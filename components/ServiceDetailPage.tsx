"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Palette, Lightbulb, Target, Layers } from "lucide-react";
import ClientPageWithBreadcrumbs from "@/components/ClientPageWithBreadcrumbs";
import TradeStyleBanner from "@/components/TradeStyleBanner";

type Stat = { icon: "calendar" | "map-pin" | "users" | "chart-line"; value: string; label: string };
type Item = { heading: string; paragraph: string };
export type ServiceCard = {
  title: string;
  description: string;
  price: string;
  features: string[];
  badge?: string;
  buttonText?: string;
  buttonLink?: string;
};

export interface ServiceDetailContent {
  cmsPath: string;
  /** CMS key map. `section` is the wrapper under `sections`; omit it when the
   *  blocks live directly under `sections` (as the custom-booth row does). */
  cmsKeys: {
    section?: string;
    hero: string;
    whyChoose: string;
    process: string;
    services: string;
    cta: string;
  };
  badge: string;
  heroHeading: string;
  heroHighlight: string;
  heroDescription: string;
  stats: Stat[];
  whyChoose: { heading: string; paragraph: string; features: Item[] };
  process: { heading: string; paragraph: string; steps: Item[] };
  services: { heading: string; paragraph: string; cards: ServiceCard[] };
  cta: { heading: string; paragraph: string; buttons: { text: string; href: string }[] };
}

const FEATURE_ICONS = [Palette, Lightbulb, Target, Layers];

export default function ServiceDetailPage({ content }: { content: ServiceDetailContent }) {
  const [saved, setSaved] = useState<any>(null);

  useEffect(() => {
    const url = `/api/admin/pages-editor?action=get-content&path=${encodeURIComponent(content.cmsPath)}`;
    const load = async () => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();
        if (data?.success && data?.data) setSaved(data.data);
      } catch {
        /* keep defaults */
      }
    };
    load();
    const handler = (e: Event) => {
      const id = (e as CustomEvent)?.detail?.pageId;
      if (!id || id === content.cmsPath.replace(/^\//, "")) load();
    };
    window.addEventListener("global-pages:updated", handler as EventListener);
    return () => window.removeEventListener("global-pages:updated", handler as EventListener);
  }, [content.cmsPath]);

  const { cmsKeys } = content;
  const block = (key: keyof typeof cmsKeys) => {
    const k = cmsKeys[key];
    if (!k) return undefined;
    return cmsKeys.section ? saved?.sections?.[cmsKeys.section]?.[k] : saved?.sections?.[k];
  };

  const hero = block("hero") || {};
  const why = block("whyChoose") || {};
  const proc = block("process") || {};
  const svc = block("services") || {};
  const cta = block("cta") || {};

  const features: Item[] = Array.isArray(why.features) && why.features.length ? why.features : content.whyChoose.features;
  const steps: Item[] = Array.isArray(proc.steps) && proc.steps.length ? proc.steps : content.process.steps;
  const cards: ServiceCard[] = Array.isArray(svc.serviceCards) && svc.serviceCards.length ? svc.serviceCards : content.services.cards;
  const ctaButtons = Array.isArray(cta.buttons) && cta.buttons.length
    ? cta.buttons
    : content.cta.buttons;

  return (
    <ClientPageWithBreadcrumbs className="min-h-screen bg-[#F5F6F7]">
      <TradeStyleBanner
        badgeText={content.badge}
        mainHeading={hero.heading || content.heroHeading}
        highlightHeading={content.heroHighlight}
        description={hero.description || content.heroDescription}
        stats={content.stats.map((s) => ({ ...s, color: "#EC6A6A" }))}
        showSearch={false}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Why choose */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#252525] mb-4">
              {why.heading || content.whyChoose.heading}
            </h2>
            <p className="text-lg text-[#5B5C5D] max-w-2xl mx-auto">
              {why.paragraph || content.whyChoose.paragraph}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = FEATURE_ICONS[index] || Palette;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-[#FDE3E3] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-[#E03A3A]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#252525] mb-2">{feature.heading}</h3>
                  <p className="text-[#5B5C5D]">{feature.paragraph}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Process */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#252525] mb-4">
              {proc.heading || content.process.heading}
            </h2>
            <p className="text-lg text-[#5B5C5D] max-w-2xl mx-auto">
              {proc.paragraph || content.process.paragraph}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-[#E03A3A] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-semibold text-[#252525] mb-2">{step.heading}</h3>
                <p className="text-[#5B5C5D]">{step.paragraph}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 w-6 h-6 text-[#B4B5B6]" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Packages */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#252525] mb-4">
              {svc.heading || content.services.heading}
            </h2>
            <p className="text-lg text-[#5B5C5D] max-w-2xl mx-auto">
              {svc.paragraph || content.services.paragraph}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-[#E4E6E8] shadow-sm hover:shadow-lg hover:border-[#E03A3A]/40 transition-all duration-300 p-6 relative"
              >
                {card.badge && (
                  <Badge className="absolute -top-3 -right-3 bg-[#E03A3A] text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
                    {card.badge}
                  </Badge>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#252525] mb-3">{card.title}</h3>
                  <p className="text-[#5B5C5D] text-sm leading-relaxed">{card.description}</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-[#828384] font-medium">Starting from</span>
                    <span className="text-lg font-bold text-[#E03A3A]">{card.price}</span>
                  </div>
                  <ul className="space-y-3">
                    {(card.features || []).map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-[#5B5C5D]">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href={card.buttonLink || "/quote"}>
                  <Button
                    className="w-full bg-white text-[#E03A3A] border-2 border-[#E03A3A] hover:bg-[#E03A3A] hover:text-white transition-all duration-300 font-semibold py-3 rounded-lg"
                    variant="outline"
                  >
                    {card.buttonText || "Get a Quote"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#E03A3A] rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{cta.heading || content.cta.heading}</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            {cta.paragraph || content.cta.paragraph}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {ctaButtons.map((button: any, index: number) => (
              <Link key={index} href={button.href || "/quote"}>
                <Button
                  size="lg"
                  className={
                    index === 0
                      ? "bg-white text-[#E03A3A] hover:bg-white/90"
                      : "border-white text-white hover:bg-white hover:text-[#E03A3A]"
                  }
                  variant={index === 0 ? "default" : "outline"}
                >
                  {button.text || "Get Started"}
                </Button>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </ClientPageWithBreadcrumbs>
  );
}
