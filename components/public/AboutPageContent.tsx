"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import TradeStyleBanner from '@/components/shared/TradeStyleBanner';
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
    icon: <FiGlobe className="w-8 h-8 text-blue-primary" />,
    number: "40+",
    label: "Countries Served",
    description: "Global network spanning continents",
  },
  {
    icon: <FiUsers className="w-8 h-8 text-blue-primary" />,
    number: "500+",
    label: "Verified Contractors",
    description: "Pre-screened professionals",
  },
  {
    icon: <FiTrendingUp className="w-8 h-8 text-blue-primary" />,
    number: "5,000+",
    label: "Successful Projects",
    description: "Delivered with excellence",
  },
  {
    icon: <FiStar className="w-8 h-8 text-blue-primary" />,
    number: "4.8/5",
    label: "Average Rating",
    description: "Client satisfaction score",
  },
];

const values = [
  {
    icon: <FiShield className="w-12 h-12 text-blue-primary" />,
    title: "Trust & Reliability",
    description:
      "Every contractor in our network is thoroughly vetted, certified, and continuously monitored to ensure exceptional quality and reliability.",
  },
  {
    icon: <FiGlobe className="w-12 h-12 text-blue-primary" />,
    title: "Global Reach",
    description:
      "From major trade show destinations to emerging markets, our extensive network ensures you have access to top talent wherever your next exhibition takes place.",
  },
  {
    icon: <FiClock className="w-12 h-12 text-blue-primary" />,
    title: "Efficiency",
    description:
      "Our streamlined platform saves you time and effort by connecting you directly with the right contractors for your specific needs and budget.",
  },
  {
    icon: <FiHeart className="w-12 h-12 text-blue-primary" />,
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
        "bg-white text-blue-primary hover:bg-gray-100 px-8 py-4 text-lg shadow-lg",
    },
    {
      text: "Browse Contractors",
      href: "/exhibition-stands",
      variant: "outline" as const,
      className:
        "border-white text-white hover:bg-white hover:text-blue-primary px-8 py-4 text-lg",
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

  return (
    <div className="font-inter min-h-screen">
      <Navigation />

      {/* Trade Shows style banner */}
      <TradeStyleBanner
        badgeText="Professional Trade Show Database"
        mainHeading={(saved as any)?.sections?.hero?.heading || "About StandsZone"}
        highlightHeading="& Our Mission"
        description={(saved as any)?.sections?.hero?.description || bannerDescription}
        stats={[
          { icon: "calendar", value: "5,000+", label: "Successful Projects" },
          { icon: "map-pin", value: "40+", label: "Countries" },
          { icon: "users", value: "4.8/5", label: "Avg Rating" },
          { icon: "chart-line", value: "500+", label: "Verified Contractors" },
        ]}
        showSearch={false}
      />

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold text-navy-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-gray-700 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">{stat.description}</div>
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
                {(((saved as any)?.sections?.mission?.points as string[]) || [
                  'Thoroughly vetted contractor network',
                  'Transparent pricing and proposals',
                  'Ongoing project support and guidance',
                  'Global coverage with local expertise',
                ]).map((pt: string, i: number) => (
                  <div key={i} className="flex items-center space-x-3">
                    <FiCheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: pt }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-primary to-blue-dark rounded-2xl p-12 text-white">
              <div className="text-center">
                <div className="text-6xl mb-6">🎯</div>
                <h3 className="text-2xl font-bold mb-4">{(saved as any)?.sections?.vision?.heading || "Our Vision"}</h3>
                <p className="text-blue-100 mb-6" dangerouslySetInnerHTML={{ __html: (saved as any)?.sections?.vision?.paragraph || "To become the world's most trusted platform for exhibition stand services, empowering businesses to create memorable brand experiences at every trade show." }} />
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">2019</div>
                  <div className="text-blue-100">Founded in Berlin</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-navy-900">
            {(saved as any)?.sections?.coreValues ? "Our Core Values" : "Our Core Values"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {((saved as any)?.sections?.coreValues || []).length > 0
              ? (saved as any)?.sections?.coreValues?.map((cv: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-6">{values[index]?.icon}</div>
                    <h3 className="text-xl font-semibold text-navy-900 mb-4">{cv.heading}</h3>
                    <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: cv.paragraph || "" }} />
                  </div>
                ))
              : values.map((value, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-6">{value.icon}</div>
                    <h3 className="text-xl font-semibold text-navy-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-navy-900">
            {(saved as any)?.sections?.howItWorks ? "How It Works" : "How It Works"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(((saved as any)?.sections?.howItWorks as any[]) || process).map((step: any, index: number) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">
                    {step.step || (index + 1)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-navy-900 mb-4">
                  {step.title || step.heading}
                </h3>
                {step.paragraph || step.description ? (
                  <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: step.paragraph || step.description }} />
                ) : (
                  <p className="text-gray-600">{step.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-navy-900">
            {(saved as any)?.sections?.team ? "Meet Our Team" : "Meet Our Team"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(((saved as any)?.sections?.team as any[]) || team).map((member: any, index: number) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-primary to-blue-dark rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">
                      {member.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-navy-900 mb-2">
                    {member.name}
                  </h3>
                  <div className="text-blue-primary font-medium mb-4">
                    {member.role}
                  </div>
                  {member.bio ? (
                    <p className="text-gray-600 text-sm mb-4" dangerouslySetInnerHTML={{ __html: member.bio }} />
                  ) : (
                    <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  )}
                  {Array.isArray((member as any).specialties) && (
                    <div className="space-y-1">
                      {(member as any).specialties.map((specialty: string) => (
                        <div key={specialty} className="text-xs text-gray-500">
                          • {specialty}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {(saved as any)?.sections?.cta?.heading || "Ready to Transform Your Exhibition Experience?"}
          </h2>
          {(saved as any)?.sections?.cta?.paragraph ? (
            <p className="text-xl mb-8 text-blue-100" dangerouslySetInnerHTML={{ __html: (saved as any)?.sections?.cta?.paragraph }} />
          ) : (
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of satisfied clients who trust StandsZone to connect
              them with the world's best exhibition stand builders. Start your
              journey today.
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {(((saved as any)?.sections?.cta?.buttons as any[]) || [
              { text: "Get Started Today", href: "/contact" },
              { text: "Browse Contractors", href: "/exhibition-stands" },
            ]).map((b: any, i: number) => (
              <Link key={i} href={b.href || "#"}>
                <Button
                  className={i === 0 ? "bg-white text-blue-primary hover:bg-gray-100 px-8 py-4 text-lg shadow-lg" : "border-white text-white hover:bg-white hover:text-blue-primary px-8 py-4 text-lg shadow-lg"}
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
