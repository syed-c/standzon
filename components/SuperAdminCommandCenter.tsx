"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface SuperAdminCommandCenterProps {
  adminId: string;
  permissions: string[];
}

export default function SuperAdminCommandCenter({
  adminId,
  permissions,
}: SuperAdminCommandCenterProps) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Stats data
  const stats = [
    {
      icon: "leaderboard",
      label: "Total Leads",
      value: "12,840",
      change: "+12.4%",
      positive: true,
    },
    {
      icon: "monetization_on",
      label: "Annual Revenue",
      value: "$4.27M",
      change: "+8.1%",
      positive: true,
    },
    {
      icon: "engineering",
      label: "Active Builders",
      value: "842",
      change: "-2.1%",
      positive: false,
    },
    {
      icon: "fact_check",
      label: "Quote Match Rate",
      value: "94.2%",
      change: "+0.5%",
      positive: true,
    },
  ];

  // Audit trail data
  const auditTrail = [
    {
      icon: "person_add",
      iconBg: "bg-emerald-100 text-emerald-600",
      title: "New Builder Verified:",
      description: '"Skyline Exhibits Europe" has completed KYC requirements.',
      time: "14 minutes ago • System-Automated",
    },
    {
      icon: "update",
      iconBg: "bg-[#1e3886]/10 text-[#1e3886]",
      title: "CMS Synchronization:",
      description: "42 regional price listings updated for the GCC market.",
      time: "2 hours ago • Admin: M. Ross",
    },
    {
      icon: "report",
      iconBg: "bg-[#c0123d]/10 text-[#c0123d]",
      title: "Security Alert:",
      description:
        "Unusual login attempt detected from unknown IP (192.168.x.x).",
      time: "5 hours ago • Security Protocol",
    },
  ];

  // Partner requests data
  const partnerRequests = [
    {
      initials: "AM",
      name: "ArchiMetric Stands",
      status: "Pending Review • 3h",
    },
    {
      initials: "VG",
      name: "Vanguard Global",
      status: "Processing • 1d",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e3886] mx-auto" />
          <p className="mt-4 text-slate-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Summary Stats ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#1e3886]/10 text-[#1e3886] rounded-lg">
                <span className="material-symbols-outlined text-2xl">
                  {stat.icon}
                </span>
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded ${
                  stat.positive
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-[#c0123d] bg-[#c0123d]/10"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-extrabold text-[#0f172a] mt-1">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* ── Main Grid: Content (2/3) + Sidebar (1/3) ─────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* ── Left Column (2/3) ─────────────────────────────── */}
        <div className="xl:col-span-2 space-y-8">
          {/* Global Network Status */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h4 className="font-bold text-[#0f172a] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1e3886]">
                  public
                </span>
                Global Network Status
              </h4>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors uppercase tracking-wider">
                  Live Map
                </button>
                <button className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors uppercase tracking-wider">
                  Data View
                </button>
              </div>
            </div>
            <div className="h-96 relative bg-slate-100 flex items-center justify-center">
              {/* Abstract radial glow */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,_#1e3886_0%,_transparent_100%)]" />
              <div className="text-slate-400 flex flex-col items-center">
                <span className="material-symbols-outlined text-6xl mb-2 opacity-30">
                  map
                </span>
                <p className="text-sm font-medium tracking-widest uppercase opacity-40">
                  Regional Performance Visualization
                </p>
              </div>
              {/* Animated data-point dots */}
              <div className="absolute top-20 left-1/4 size-4 bg-emerald-500/40 rounded-full animate-pulse flex items-center justify-center">
                <div className="size-2 bg-emerald-500 rounded-full" />
              </div>
              <div className="absolute bottom-1/3 right-1/3 size-4 bg-[#1e3886]/40 rounded-full flex items-center justify-center">
                <div className="size-2 bg-[#1e3886] rounded-full" />
              </div>
              <div className="absolute top-1/2 right-1/4 size-4 bg-[#c0123d]/40 rounded-full flex items-center justify-center">
                <div className="size-2 bg-[#c0123d] rounded-full" />
              </div>
            </div>
          </div>

          {/* System Audit Trail */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h4 className="font-bold text-[#0f172a] uppercase tracking-wider text-sm">
                System Audit Trail
              </h4>
            </div>
            <div className="divide-y divide-slate-100">
              {auditTrail.map((entry, i) => (
                <div
                  key={i}
                  className="p-6 flex gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div
                    className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${entry.iconBg}`}
                  >
                    <span className="material-symbols-outlined">
                      {entry.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-800">
                      <span className="font-bold">{entry.title}</span>{" "}
                      {entry.description}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-tight">
                      {entry.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50 text-center">
              <Link
                href="/admin/data-audit"
                className="text-xs font-bold text-[#1e3886] hover:text-[#0f172a] transition-colors uppercase tracking-widest"
              >
                View Full Audit Log
              </Link>
            </div>
          </div>
        </div>

        {/* ── Right Column (1/3) ────────────────────────────── */}
        <div className="space-y-8">
          {/* Control Panel */}
          <div className="bg-[#0f172a] text-white p-8 rounded-xl shadow-xl space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-[0.2em] opacity-60">
              Control Panel
            </h4>
            <div className="grid grid-cols-1 gap-4">
              {/* Clear System Cache */}
              <Link
                href="/admin/clear-cache"
                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#1e3886] group-hover:text-white transition-colors">
                    cached
                  </span>
                  <span className="text-sm font-semibold">
                    Clear System Cache
                  </span>
                </div>
                <span className="material-symbols-outlined text-sm opacity-40">
                  chevron_right
                </span>
              </Link>

              {/* Add New Builder */}
              <Link
                href="/admin/add-builder"
                className="w-full flex items-center justify-between p-4 bg-[#1e3886] hover:bg-[#1e3886]/90 rounded-lg transition-all group shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-white">
                    add_business
                  </span>
                  <span className="text-sm font-semibold">
                    Add New Builder
                  </span>
                </div>
                <span className="material-symbols-outlined text-sm opacity-60">
                  chevron_right
                </span>
              </Link>

              {/* Generate Monthly Report */}
              <Link
                href="/admin/reports"
                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-400 group-hover:text-white transition-colors">
                    cloud_download
                  </span>
                  <span className="text-sm font-semibold">
                    Generate Monthly Report
                  </span>
                </div>
                <span className="material-symbols-outlined text-sm opacity-40">
                  chevron_right
                </span>
              </Link>

              {/* Emergency Broadcast */}
              <button className="w-full flex items-center justify-between p-4 bg-[#c0123d]/10 hover:bg-[#c0123d] rounded-lg border border-[#c0123d]/20 transition-all group">
                <div className="flex items-center gap-3 text-[#c0123d] group-hover:text-white">
                  <span className="material-symbols-outlined">warning</span>
                  <span className="text-sm font-semibold">
                    Emergency Broadcast
                  </span>
                </div>
                <span className="material-symbols-outlined text-sm opacity-40 group-hover:text-white/40">
                  chevron_right
                </span>
              </button>
            </div>
          </div>

          {/* Partner Requests */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h4 className="font-bold text-[#0f172a] uppercase tracking-wider text-sm mb-6">
              Partner Requests
            </h4>
            <div className="space-y-6">
              {partnerRequests.map((partner, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="size-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-400">
                    {partner.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#0f172a]">
                      {partner.name}
                    </p>
                    <p className="text-xs text-slate-500 uppercase font-medium">
                      {partner.status}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button className="size-8 rounded-lg border border-slate-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors">
                      <span className="material-symbols-outlined text-lg">
                        check
                      </span>
                    </button>
                    <button className="size-8 rounded-lg border border-slate-200 flex items-center justify-center text-[#c0123d] hover:bg-rose-50 transition-colors">
                      <span className="material-symbols-outlined text-lg">
                        close
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Insight */}
          <div className="bg-gradient-to-br from-[#1e3886] to-[#0f172a] p-6 rounded-xl text-white shadow-xl relative overflow-hidden group">
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-white/5 text-[120px] group-hover:rotate-12 transition-transform duration-700">
              insights
            </span>
            <h5 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">
              Market Insight
            </h5>
            <p className="text-lg font-medium leading-tight relative z-10">
              Bespoke wooden structures are trending 40% higher in Europe this
              quarter.
            </p>
            <button className="mt-4 text-xs font-bold underline underline-offset-4 decoration-white/20 hover:decoration-white transition-all relative z-10">
              LEARN MORE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}