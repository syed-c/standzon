"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import TradeStyleBanner from "@/components/TradeStyleBanner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FiUsers,
  FiGlobe,
  FiTrendingUp,
  FiCheckCircle,
  FiStar,
  FiShield,
  FiClock,
  FiHeart,
} from "react-icons/fi";
import React, { useEffect, useMemo, useState } from "react";
import { PageContent as SavedPageContent } from "@/lib/data/storage";

const stats = [
  {
    icon: <FiGlobe className="w-8 h-8 text-russian-violet-500" />,
    number: "40+",
    label: "Countries Served",
    description: "Global network spanning continents",
  },
  {
    icon: <FiUsers className="w-8 h-8 text-russian-violet-500" />,
    number: "500+",
    label: "Verified Contractors",
    description: "Pre-screened professionals",
  },
  {
    icon: <FiTrendingUp className="w-8 h-8 text-russian-violet-500" />,
    number: "5,000+",
    label: "Successful Projects",
    description: "Delivered with excellence",
  },
  {
    icon: <FiStar className="w-8 h-8 text-russian-violet-500" />,
    number: "4.8/5",
    label: "Average Rating",
    description: "Client satisfaction score",
  },
];

const values = [
  {
    icon: <FiShield className="w-12 h-12 text-russian-violet-500" />,
    title: "Trust & Reliability",
    description:
      "Every contractor in our network is thoroughly vetted, certified, and continuously monitored to ensure exceptional quality and reliability.",
  },
  {
    icon: <FiGlobe className="w-12 h-12 text-russian-violet-500" />,
    title: "Global Reach",
    description:
      "From major trade show destinations to emerging markets, our extensive network ensures you have access to top talent wherever your next exhibition takes place.",
  },
  {
    icon: <FiClock className="w-12 h-12 text-russian-violet-500" />,
    title: "Efficiency",
    description:
      "Our streamlined platform saves you time and effort by connecting you directly with the right contractors for your specific needs and budget.",
  },
  {
    icon: <FiHeart className="w-12 h-12 text-russian-violet-500" />,
    title: "Partnership",
    description:
      "We don't just connect you with contractors; we build lasting relationships and provide ongoing support throughout your exhibition journey.",
  },
];

const team = [
  {
    name: "Marcus Weber",
    role: "Founder & CEO",
    bio: "15+ years in exhibition industry, former trade show director at major European venues",
    specialties: [
      "Business Strategy",
      "Industry Relations",
      "Global Expansion",
    ],
  },
  {
    name: "Sarah Chen",
    role: "Head of Operations",
    bio: "Operations expert with background in international logistics and project management",
    specialties: [
      "Operations Management",
      "Quality Assurance",
      "Contractor Relations",
    ],
  },
  {
    name: "David Rodriguez",
    role: "Technical Director",
    bio: "Former exhibition stand designer with deep technical expertise and innovation focus",
    specialties: ["Technical Standards", "Innovation", "Design Excellence"],
  },
  {
    name: "Emma Thompson",
    role: "Client Success Manager",
    bio: "Client relationship specialist ensuring exceptional experience throughout the journey",
    specialties: [
      "Client Relations",
      "Support Services",
      "Success Optimization",
    ],
  },
];

const process = [
  {
    step: "1",
    title: "Submit Your Requirements",
    description:
      "Tell us about your exhibition needs, budget, timeline, and preferences through our simple online form.",
  },
  {
    step: "2",
    title: "Receive Matched Proposals",
    description:
      "Get up to 5 customized proposals from pre-vetted contractors who specialize in your industry and location.",
  },
  {
    step: "3",
    title: "Compare & Choose",
    description:
      "Review detailed proposals, portfolios, and ratings to select the perfect partner for your exhibition project.",
  },
  {
    step: "4",
    title: "Project Success",
    description:
      "Work directly with your chosen contractor while we provide ongoing support to ensure project success.",
  },
];

export default function AboutPageContent() {
  console.log("About Page: Page loaded");
  const [saved, setSaved] = useState<SavedPageContent | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "/api/admin/pages-editor?action=get-content&path=%2Fabout",
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
        | { pageId?: string; path?: string }
        | undefined;
      if (!detail?.pageId || detail.pageId === "about" || detail?.path === "/about") {
        (async () => {
          try {
            const res = await fetch(
              "/api/admin/pages-editor?action=get-content&path=%2Fabout",
              { cache: "no-store" }
            );
            const data = await res.json();
            if (data?.success && data?.data) setSaved(data.data);
          } catch {}
        })();
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("global-pages:updated", handler as EventListener);
      return () => window.removeEventListener("global-pages:updated", handler as EventListener);
    }
    return () => {};
  }, []);

  const aboutHeroHeadings = [
    "About Our Mission to Transform",
    "Discover How We're Revolutionizing",
    "Learn About Our Vision for",
    "Meet the Team Behind",
  ];

  const aboutStats = [
    { value: "40+", label: "Countries Served" },
    { value: "500+", label: "Verified Contractors" },
    { value: "5,000+", label: "Successful Projects" },
    { value: "4.8/5", label: "Average Rating" },
  ];

  const aboutButtons = [
    {
      text: "Get Started Today",
      href: "/contact",
      className:
        "bg-transparent text-russian-violet-500 hover:bg-gray-100 px-8 py-4 text-lg",
    },
    {
      text: "Browse Contractors",
      href: "/exhibition-stands",
      variant: "outline" as const,
      className:
        "border-white text-white hover:bg-white hover:text-russian-violet-500 px-8 py-4 text-lg",
    },
  ];

  // Prefer content edited in "Detected Page Content" for hero description
  const bannerDescription = useMemo(() => {
    const html = (saved as any)?.content?.extra?.rawHtml || (saved as any)?.content?.introduction || "";
    if (!html || typeof html !== "string") return "";
    const text = html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.slice(0, 220);
  }, [saved]);

  const heroButtons = [
    {
      text: "Get Started Today",
      href: "/contact",
      className:
        "bg-transparent text-russian-violet-500 hover:bg-gray-100 px-8 py-4 text-lg",
    },
    {
      text: "Browse Contractors",
      href: "/exhibition-stands",
      variant: "outline" as const,
      className:
        "border-white text-white hover:bg-white hover:text-russian-violet-500 px-8 py-4 text-lg",
    },
  ];

  return (
    <div className="font-inter min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-16 pb-12 bg-gradient-to-br from-russian-violet-900 via-dark-purple-800 to-russian-violet-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {(saved as any)?.sections?.hero?.heading || "Exhibition Stand Excellence"}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            {(saved as any)?.sections?.hero?.paragraph || "Connect with the world's finest exhibition stand builders. From concept to completion, we ensure your brand stands out at every trade show."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {heroButtons.map((b, i) => (
              <Link key={i} href={b.href || "#"}>
                <Button
                  variant={b.variant as any}
                  className={b.className}
                >
                  {b.text}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-3">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-russian-violet-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Saved Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-6">
                {(saved as any)?.sections?.mission?.heading || "Our Mission"}
              </h2>
              {((saved as any)?.sections?.mission?.paragraph) ? (
                <div
                  className="prose max-w-none text-gray-700 mb-8"
                  dangerouslySetInnerHTML={{ __html: (saved as any)?.sections?.mission?.paragraph || "" }}
                />
              ) : (
                <>
                  <p className="text-lg text-gray-600 mb-6">
                    StandsZone was founded with a simple yet powerful vision: to
                    eliminate the complexity and uncertainty from finding the
                    right exhibition stand builder. We believe every business
                    deserves access to exceptional exhibition experiences,
                    regardless of size or location.
                  </p>
                  <p className="text-lg text-gray-600 mb-8">
                    Our platform bridges the gap between exhibitors and
                    top-rated contractors worldwide, ensuring quality,
                    reliability, and success for every project. We're not just a
                    directory – we're your trusted partner in exhibition
                    success.
                  </p>
                </>
              )}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FiCheckCircle className="w-6 h-6 text-claret-500" />
                  <span className="text-gray-700">
                    Thoroughly vetted contractor network
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiCheckCircle className="w-6 h-6 text-claret-500" />
                  <span className="text-gray-700">
                    Transparent pricing and proposals
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiCheckCircle className="w-6 h-6 text-claret-500" />
                  <span className="text-gray-700">
                    Ongoing project support and guidance
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiCheckCircle className="w-6 h-6 text-claret-500" />
                  <span className="text-gray-700">
                    Global coverage with local expertise
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-russian-violet-500 to-russian-violet-900 rounded-2xl p-12 text-white">
              <div className="text-center">
                <div className="text-6xl mb-6">🎯</div>
                <h3 className="text-2xl font-bold mb-4">{(saved as any)?.sections?.vision?.heading || "Our Vision"}</h3>
                <p className="text-russian-violet-100 mb-6" dangerouslySetInnerHTML={{ __html: (saved as any)?.sections?.vision?.paragraph || "To become the world's most trusted platform for exhibition stand services, empowering businesses to create memorable brand experiences at every trade show." }} />
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">2019</div>
                  <div className="text-russian-violet-100">Founded in Berlin</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {(saved as any)?.sections?.values?.heading || "Why Choose StandsZone?"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {(saved as any)?.sections?.values?.paragraph || "We're committed to excellence in every aspect of our service, from contractor vetting to project completion."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="mb-4">{value.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {(saved as any)?.sections?.howItWorks?.heading || "How It Works"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {(saved as any)?.sections?.howItWorks?.paragraph || "Our streamlined process makes it easy to find and work with the perfect exhibition stand builder for your needs."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(((saved as any)?.sections?.howItWorks as any[]) || process).map((step: any, index: number) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-russian-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {step.step || (index + 1)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.heading || step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: step.paragraph || step.description || "" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {(saved as any)?.sections?.team?.heading || "Meet Our Team"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {(saved as any)?.sections?.team?.paragraph || "The passionate professionals behind StandsZone, dedicated to revolutionizing the exhibition industry."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(((saved as any)?.sections?.team as any[]) || team).map((member: any, index: number) => (
              <Card key={index} className="text-center border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-russian-violet-500 to-russian-violet-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {member.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <div className="text-russian-violet-500 font-medium mb-3">
                    {member.role}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-russian-violet-500 to-russian-violet-900 rounded-2xl p-8 text-white">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4">{(saved as any)?.sections?.vision?.heading || "Our Vision"}</h3>
              <p className="text-russian-violet-100 mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: (saved as any)?.sections?.vision?.paragraph || "To become the world's most trusted platform for exhibition stand services, empowering businesses to create memorable brand experiences at every trade show." }} />
              <div className="bg-white/10 rounded-lg p-4 inline-block">
                <div className="text-2xl font-bold mb-1">2019</div>
                <div className="text-russian-violet-100">Founded in Berlin</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-russian-violet-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {(saved as any)?.sections?.cta?.heading || "Ready to Transform Your Exhibition Experience?"}
          </h2>
          {(saved as any)?.sections?.cta?.paragraph ? (
            <p className="text-lg mb-8 text-russian-violet-100 leading-relaxed" dangerouslySetInnerHTML={{ __html: (saved as any)?.sections?.cta?.paragraph }} />
          ) : (
            <p className="text-lg mb-8 text-russian-violet-100 leading-relaxed">
              Join thousands of satisfied clients who trust StandsZone to connect
              them with the world's best exhibition stand builders. Start your
              journey today and discover the difference quality makes.
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {(((saved as any)?.sections?.cta?.buttons as any[]) || [
              { text: "Get Started Today", href: "/contact" },
              { text: "Browse Contractors", href: "/exhibition-stands" },
            ]).map((b: any, i: number) => (
              <Link key={i} href={b.href || "#"}>
                <Button
                  className={i === 0 ? "bg-transparent text-russian-violet-500 hover:bg-gray-100 px-8 py-4 text-lg" : "border-white text-white hover:bg-white hover:text-russian-violet-500 px-8 py-4 text-lg"}
                  variant={i === 0 ? undefined : "outline"}
                >
                  {b.text || (i === 0 ? "Get Started Today" : "Browse Contractors")}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
