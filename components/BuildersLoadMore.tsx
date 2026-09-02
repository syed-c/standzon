"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Star, Building2, ArrowRight, CheckCircle } from "lucide-react";
import { convertToProxyUrl } from "@/lib/utils/imageProxyUtils";
import { isMissingImage } from "@/lib/utils/placeholders";

interface BuildersLoadMoreProps {
  builders: any[];
  location: string;
  initialCount?: number;
  incrementBy?: number;
}

export default function BuildersLoadMore({
  builders,
  location,
  initialCount = 4,
  incrementBy = 4,
}: BuildersLoadMoreProps) {
  const [visible, setVisible] = useState(initialCount);

  const shownBuilders = builders.slice(0, visible);
  const hasMore = visible < builders.length;

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-6">
        {shownBuilders.map((b: any, idx: number) => {
          const rawImg =
            b.portfolio?.[0]?.image ||
            b.portfolio?.[0]?.imageUrl ||
            (typeof b.portfolio?.[0] === "string" ? b.portfolio[0] : null) ||
            b.logo ||
            b.profile_image ||
            b.image_url;
          const portfolioImg = isMissingImage(
            typeof rawImg === "string" ? rawImg : rawImg?.image || rawImg?.url
          )
            ? null
            : typeof rawImg === "string"
            ? rawImg
            : rawImg.image || rawImg.url;

          const rating = b.rating || 4.8;
          const reviewCount = b.reviewCount || b.review_count || 0;
          const isPremium =
            b.premiumMember ||
            b.premium_member ||
            b.planType === "professional" ||
            b.planType === "enterprise";
          const isVerified = b.verified || b.isVerified;
          const hq =
            b.headquarters?.city || b.headquarters_city || b.city || location;
          const hqCountry =
            b.headquarters?.country || b.headquarters_country || b.country || "";
          const desc =
            b.companyDescription || b.description || b.company_description || "";
          const projDone = b.projectsCompleted || b.projects_completed || 0;
          const responseTime =
            b.responseTime || b.response_time || "Within 24 hours";
          const badgeLabel =
            idx === 0 && visible === initialCount
              ? "Verified Platinum"
              : isPremium
              ? "Recommended"
              : isVerified
              ? "Verified"
              : "";
          const badgeBg = badgeLabel === "Verified Platinum" ? "bg-emerald-600" : "bg-[#E03A3A]";

          return (
            <div
              key={b.id || b.slug || idx}
              className="bg-[#FCFCFD] rounded-xl border border-[#E4E6E8] overflow-hidden flex flex-col hover:shadow-lg hover:border-[#E03A3A]/40 transition-all duration-300 group"
            >
              {/* Image */}
              <div className="h-40 relative bg-[#F5F6F7] shrink-0">
                {portfolioImg ? (
                  <Image
                    src={convertToProxyUrl(portfolioImg)}
                    alt={`${b.companyName || "Exhibition stand builder"} — exhibition stand project`}
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#B4B5B6]">
                    <Building2 className="w-10 h-10" strokeWidth={1.5} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Portfolio coming soon
                    </span>
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
              <div className="flex-1 flex flex-col p-5">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="text-base font-bold text-[#252525] group-hover:text-[#E03A3A] transition-colors leading-tight">
                    {b.companyName}
                  </h3>
                  <span className="flex items-center gap-1 text-[#252525] shrink-0">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-black">{rating}</span>
                  </span>
                </div>

                <p className="text-xs text-[#5B5C5D] font-semibold flex items-center gap-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-[#B4B5B6]" /> {hq}
                  {hqCountry && hqCountry !== hq ? `, ${hqCountry}` : ""}
                  {reviewCount > 0 ? ` • ${reviewCount} reviews` : ""}
                </p>

                {desc && (
                  <p className="text-[#5B5C5D] text-sm leading-relaxed mb-4 line-clamp-2">
                    {desc}
                  </p>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] mb-4 mt-auto">
                  <span className="text-[#5B5C5D]">
                    <span className="font-bold text-[#252525]">
                      {projDone > 0 ? `${projDone.toLocaleString()}+` : "New"}
                    </span>{" "}
                    projects
                  </span>
                  <span className="text-[#5B5C5D]">
                    Responds <span className="font-bold text-[#252525]">{responseTime}</span>
                  </span>
                  {isVerified && (
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <a
                    href={`/builders/${b.slug || b.id}`}
                    className="flex-1 bg-[#252525] text-white text-xs font-bold py-2.5 px-3 rounded-lg hover:bg-[#E03A3A] transition-all text-center"
                  >
                    View Profile
                  </a>
                  <a
                    href="#quote-form"
                    className="flex-1 bg-white border border-[#E4E6E8] text-[#252525] text-xs font-bold py-2.5 px-3 rounded-lg hover:border-[#E03A3A] hover:text-[#E03A3A] transition-all text-center"
                  >
                    Request Quote
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisible((v) => v + incrementBy)}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#252525] text-white font-black rounded-lg hover:bg-[#E03A3A] transition-all uppercase tracking-wide text-sm"
          >
            Load More Builders
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-[#828384] mt-2 font-medium">
            Showing {shownBuilders.length} of {builders.length} builders
          </p>
        </div>
      )}

      {!hasMore && builders.length > 4 && (
        <p className="mt-8 text-center text-xs text-[#828384] font-medium uppercase tracking-wider">
          All {builders.length} builders shown
        </p>
      )}
    </div>
  );
}
