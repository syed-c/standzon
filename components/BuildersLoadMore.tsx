"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Star, Building, ArrowRight, CheckCircle } from "lucide-react";
import { convertToProxyUrl } from "@/lib/utils/imageProxyUtils";

interface BuildersLoadMoreProps {
  builders: any[];
  location: string;
  initialCount?: number;
  incrementBy?: number;
}

export default function BuildersLoadMore({
  builders,
  location,
  initialCount = 2,
  incrementBy = 2,
}: BuildersLoadMoreProps) {
  const [visible, setVisible] = useState(initialCount);

  const shownBuilders = builders.slice(0, visible);
  const hasMore = visible < builders.length;

  return (
    <div>
      <div className="space-y-5">
        {shownBuilders.map((b: any, idx: number) => {
          const portfolioImg =
            b.portfolio?.[0]?.image ||
            b.portfolio?.[0]?.imageUrl ||
            (typeof b.portfolio?.[0] === "string" ? b.portfolio[0] : null) ||
            b.logo ||
            b.profile_image ||
            b.image_url;
          const rating = b.rating || 4.8;
          const reviewCount = b.reviewCount || b.review_count || 0;
          const isPremium =
            b.premiumMember ||
            b.premium_member ||
            b.planType === "professional" ||
            b.planType === "enterprise";
          const isVerified = b.verified || b.isVerified;
          const hq =
            b.headquarters?.city ||
            b.headquarters_city ||
            b.city ||
            location;
          const hqCountry =
            b.headquarters?.country || b.headquarters_country || b.country || "";
          const estYear = b.establishedYear || b.established_year || "";
          const desc =
            b.companyDescription || b.description || b.company_description || "";
          const projDone = b.projectsCompleted || b.projects_completed || 0;
          const responseTime =
            b.responseTime || b.response_time || "Within 24 hours";
          const badgeLabel =
            idx === 0
              ? "Verified Platinum"
              : isPremium
              ? "Recommended"
              : isVerified
              ? "Verified"
              : "";
          const badgeBg =
            idx === 0 ? "bg-emerald-500" : "bg-[#1e3886]";

          return (
            <div
              key={b.id || b.slug || idx}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col lg:flex-row gap-6 hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Image */}
              <div className="lg:w-56 h-44 rounded-lg overflow-hidden bg-slate-100 relative shrink-0">
                {portfolioImg ? (
                  <Image
                    src={convertToProxyUrl(
                      typeof portfolioImg === "string"
                        ? portfolioImg
                        : (portfolioImg as any).image ||
                            (portfolioImg as any).url ||
                            ""
                    )}
                    alt={b.companyName || "Builder"}
                    fill
                    sizes="224px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <Building className="w-12 h-12 text-slate-400" />
                  </div>
                )}
                {badgeLabel && (
                  <div
                    className={`absolute top-3 left-3 ${badgeBg} text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-tight`}
                  >
                    {badgeLabel}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between flex-col md:flex-row items-start mb-2 gap-2 md:gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#0f172a] group-hover:text-[#c0123d] transition-colors leading-tight">
                      {b.companyName}
                    </h3>
                    <p className="text-xs text-slate-500 font-bold flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {hq}
                      {hqCountry && hqCountry !== hq ? `, ${hqCountry}` : ""}
                      {estYear ? ` • Est. ${estYear}` : ""}
                    </p>
                  </div>
                  <div className="text-left md:text-right shrink-0">
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-lg font-black ml-1 text-[#0f172a]">
                        {rating}
                      </span>
                    </div>
                    {reviewCount > 0 && (
                      <span className="text-[10px] text-slate-400 uppercase font-bold">
                        {reviewCount} Reviews
                      </span>
                    )}
                  </div>
                </div>

                {desc && (
                  <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                    {desc}
                  </p>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  {[
                    {
                      label: "Projects Done",
                      val:
                        projDone > 0
                          ? `${projDone.toLocaleString()}+`
                          : "Available",
                      color: "",
                    },
                    { label: "Response", val: responseTime, color: "" },
                    {
                      label: "Status",
                      val: isVerified ? "Verified" : "Active",
                      color: isVerified ? "text-emerald-600" : "",
                    },
                    {
                      label: "Plan",
                      val:
                        (b.planType || "Standard").charAt(0).toUpperCase() +
                        (b.planType || "Standard").slice(1),
                      color: isPremium ? "text-[#c0123d]" : "",
                    },
                  ].map((stat, si) => (
                    <div
                      key={si}
                    >
                      <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        {stat.label}
                      </span>
                      <span
                        className={`text-sm font-bold text-[#0f172a] ${stat.color}`}
                      >
                        {stat.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Sidebar */}
              <div className="lg:w-48 flex flex-col justify-center gap-3 pt-6 lg:pt-0 lg:pl-6 shrink-0 mt-4 lg:mt-0">
                <a
                  href={`/builders/${b.slug || b.id}`}
                  className="w-full bg-[#0f172a] text-white text-sm font-bold py-3 px-4 rounded-lg hover:bg-[#c0123d] transition-all text-center"
                >
                  View Portfolio
                </a>
                <a
                  href="#quote-form"
                  className="w-full bg-white border border-slate-200 text-[#0f172a] text-sm font-bold py-3 px-4 rounded-lg hover:border-[#c0123d] transition-all text-center"
                >
                  Request Quote
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisible((v) => v + incrementBy)}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#0f172a] text-white font-black rounded-lg hover:bg-[#1e3886] transition-all uppercase tracking-wide text-sm"
          >
            Load More Builders
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Showing {shownBuilders.length} of {builders.length} builders
          </p>
        </div>
      )}

      {!hasMore && builders.length > 0 && (
        <p className="mt-8 text-center text-xs text-slate-400 font-medium uppercase tracking-wider">
          All {builders.length} builders shown
        </p>
      )}
    </div>
  );
}
