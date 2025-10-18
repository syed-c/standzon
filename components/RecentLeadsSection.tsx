"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";

type LeadsCTAButton = { text?: string; href?: string };
export default function RecentLeadsSection({
  ctaHeading,
  ctaParagraph,
  ctaButtons,
}: {
  ctaHeading?: string;
  ctaParagraph?: string;
  ctaButtons?: LeadsCTAButton[];
}) {
  console.log("🎯 RecentLeadsSection rendering...");

  const [displayLeads, setDisplayLeads] = useState<any[]>([]);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  // Try to fetch real leads data from Convex
  let recentLeads;
  try {
    recentLeads = useQuery(api.leads.getRecentLeadsForPublic, { limit: 10 });
  } catch (error) {
    console.log("⚠️ Convex query failed, using mock data:", error);
    recentLeads = null;
  }

  // Fallback mock data for when Convex is not available
  const mockLeads = [
    {
      id: "1",
      exhibitionName: "CES 2024",
      standSize: "50 sqm",
      budget: "$25,000",
      submittedAt: Date.now() - 86400000,
      status: "Open",
    },
    {
      id: "2",
      exhibitionName: "Hannover Messe",
      standSize: "30 sqm",
      budget: "$15,000",
      submittedAt: Date.now() - 172800000,
      status: "Matched",
    },
    {
      id: "3",
      exhibitionName: "GITEX Technology",
      standSize: "75 sqm",
      budget: "$40,000",
      submittedAt: Date.now() - 259200000,
      status: "Open",
    },
    {
      id: "4",
      exhibitionName: "Mobile World Congress",
      standSize: "25 sqm",
      budget: "$12,000",
      submittedAt: Date.now() - 345600000,
      status: "Responded",
    },
    {
      id: "5",
      exhibitionName: "Bauma Munich",
      standSize: "100 sqm",
      budget: "$60,000",
      submittedAt: Date.now() - 432000000,
      status: "Open",
    },
    {
      id: "6",
      exhibitionName: "ISE Amsterdam",
      standSize: "40 sqm",
      budget: "$20,000",
      submittedAt: Date.now() - 518400000,
      status: "Open",
    },
    {
      id: "7",
      exhibitionName: "MEDICA Dusseldorf",
      standSize: "Size not specified",
      budget: "Budget not specified",
      submittedAt: Date.now() - 604800000,
      status: "Open",
    },
    {
      id: "8",
      exhibitionName: "Arab Health Dubai",
      standSize: "60 sqm",
      budget: "$35,000",
      submittedAt: Date.now() - 691200000,
      status: "Matched",
    },
    {
      id: "9",
      exhibitionName: "K Fair Dusseldorf",
      standSize: "80 sqm",
      budget: "$45,000",
      submittedAt: Date.now() - 777600000,
      status: "Open",
    },
    {
      id: "10",
      exhibitionName: "Automechanika",
      standSize: "45 sqm",
      budget: "$22,000",
      submittedAt: Date.now() - 864000000,
      status: "Open",
    },
  ];

  useEffect(() => {
    if (recentLeads && Array.isArray(recentLeads) && recentLeads.length > 0) {
      console.log("✅ Using real Convex data:", recentLeads.length, "leads");
      setDisplayLeads(recentLeads);
      setIsUsingMockData(false);
    } else {
      console.log("📝 Using mock data fallback");
      setDisplayLeads(mockLeads);
      setIsUsingMockData(true);
    }
  }, [recentLeads]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800 border-green-200";
      case "Matched":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Responded":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-6">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Live Lead Activity
        </h2>
        <p className="text-xl text-gray-600 mb-2">
          Real exhibition stand requests from clients worldwide
        </p>
        <p className="text-sm text-emerald-600 font-medium">
          ✨ Updated in real-time • Join now to access these leads
        </p>
        {isUsingMockData && (
          <p className="text-xs text-gray-500 mt-1">
            (Demo data - connecting to live system...)
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
        {/* Header */}
        <div className="px-3 md:px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600">
          <div className="grid grid-cols-4 gap-1 md:gap-2 text-xs font-semibold text-white">
            <div className="truncate">Exhibition</div>
            <div className="truncate">Size</div>
            <div className="truncate">Budget</div>
            <div className="truncate">Date</div>
          </div>
        </div>

        {/* Leads List */}
        <div className="divide-y divide-gray-100 max-h-80 md:max-h-96 overflow-y-auto">
          {displayLeads.slice(0, 10).map((lead, index) => (
            <div
              key={`${lead.id}-${index}`}
              className="px-3 md:px-4 py-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 group"
            >
              <div className="grid grid-cols-4 gap-1 md:gap-2 items-center text-xs md:text-sm">
                <div className="min-w-0">
                  <div className="flex items-start space-x-1 md:space-x-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mt-1 flex-shrink-0"></div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors truncate text-xs md:text-sm">
                        {lead.exhibitionName}
                      </div>
                      {lead.status && (
                        <span
                          className={`inline-block px-1 py-0.5 text-xs rounded-full border mt-1 ${getStatusColor(lead.status)} hidden sm:inline-block`}
                        >
                          {lead.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-gray-700 text-xs truncate">
                  {lead.standSize}
                </div>
                <div className="text-gray-700 text-xs truncate">
                  {lead.budget}
                </div>
                <div className="text-gray-500 text-xs truncate">
                  {formatDate(lead.submittedAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-6">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 md:p-6 text-white">
          <h3 className="text-lg md:text-xl font-bold mb-2">
            {ctaHeading || "Ready to Access These Leads?"}
          </h3>
          <p className="text-emerald-100 mb-4 text-sm md:text-base">
            {ctaParagraph ||
              "Join our platform as a verified builder and start receiving qualified leads like these"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {(ctaButtons && ctaButtons.length > 0
              ? ctaButtons
              : [
                  { text: "Join as Builder", href: "/builders" },
                  { text: "Learn More", href: "/about" },
                ]
            ).map((b, i) => (
              <a
                key={i}
                href={b.href || "#"}
                className={
                  i === 0
                    ? "px-4 py-2 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors text-sm md:text-base"
                    : "px-4 py-2 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-sm md:text-base"
                }
              >
                {b.text || (i === 0 ? "Primary" : "Secondary")}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="text-center p-3 md:p-4 bg-white rounded-xl shadow-sm border border-emerald-100">
          <div className="text-lg md:text-xl font-bold text-emerald-600">
            150+
          </div>
          <div className="text-xs md:text-sm text-gray-600">
            Leads This Month
          </div>
        </div>
        <div className="text-center p-3 md:p-4 bg-white rounded-xl shadow-sm border border-emerald-100">
          <div className="text-lg md:text-xl font-bold text-teal-600">
            $2.5M+
          </div>
          <div className="text-xs md:text-sm text-gray-600">
            Total Project Value
          </div>
        </div>
      </div>
    </div>
  );
}
