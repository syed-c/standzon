'use client';

import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { mapTradeShowDBToUI } from '@/lib/utils/tradeShowMapping';
import { TradeShow } from '@/lib/data/tradeShows';
import Link from 'next/link';

export default function AdminTradeshowsPage() {
  const [tradeShows, setTradeShows] = useState<TradeShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase
          .from('trade_shows')
          .select('*')
          .order('start_date', { ascending: false });
        setTradeShows((data || []).map(mapTradeShowDBToUI));
      } catch {
        setTradeShows([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = tradeShows.filter(
    (ts) =>
      ts.name?.toLowerCase().includes(search.toLowerCase()) ||
      ts.city?.toLowerCase().includes(search.toLowerCase()) ||
      ts.country?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Tradeshows</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all exhibition tradeshows and events.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/tradeshows/bulk-import"
            className="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Bulk Import
          </Link>
          <Link
            href="/admin/tradeshows/manage"
            className="px-4 py-2 text-sm font-semibold bg-[#1e3886] text-white rounded-lg hover:bg-[#1e3886]/90 transition-colors"
          >
            Manage Tradeshows
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
        <input
          type="text"
          placeholder="Search tradeshows..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#1e3886] focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-[#0f172a]">All Tradeshows</h2>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{filtered.length} events</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3886]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <span className="material-symbols-outlined text-5xl block mb-2 opacity-40">event_busy</span>
            <p className="text-sm font-medium">No tradeshows found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((ts, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="size-10 bg-[#1e3886]/10 rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#1e3886]">event</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#0f172a] truncate">{ts.name}</p>
                  <p className="text-xs text-slate-500 truncate">{ts.city}, {ts.country}</p>
                </div>
                <div className="text-xs text-slate-400 font-medium hidden md:block">
                  {ts.startDate ? new Date(ts.startDate).toLocaleDateString() : '—'}
                </div>
                <Link
                  href="/admin/tradeshows/manage"
                  className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
                >
                  Manage
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
