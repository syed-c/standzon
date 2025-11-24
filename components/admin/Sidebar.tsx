"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Item = { label: string; href: string; badge?: string };
type Section = { title: string; items: Item[] };

// New grouped navigation matching requested design
const sections: Section[] = [
  {
    title: 'DATA MANAGEMENT & IMPORT',
    items: [
      { label: 'Bulk Builder Import', href: '/admin/bulk-import', badge: 'FIX' },
      { label: 'Data Audit System', href: '/admin/data-audit' },
      { label: 'Data Completeness', href: '/admin/data-summary' },
      { label: 'Data Persistence Monitor', href: '/admin/data-persistence' },
      { label: 'Final Audit Report', href: '/admin/final-audit' },
    ],
  },
  {
    title: 'GMB INTEGRATION',
    items: [
      { label: 'GMB API Fetch Tool', href: '/admin/gmb-integration', badge: 'API' },
    ],
  },
  {
    title: 'GENERAL',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard' },
      { label: 'Pages Editor', href: '/admin/pages-editor' },
      { label: 'Portfolio', href: '/admin/portfolio' },
      { label: 'Builders', href: '/admin/builders' },
      { label: 'Leads', href: '/admin/leads' },
      { label: 'Users', href: '/admin/users' },
      { label: 'Website Settings', href: '/admin/website-settings' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full p-4 gap-6">
      {sections.map((section) => (
        <div key={section.title}>
          <div className="px-3 pb-2 text-[11px] tracking-wide font-semibold text-gray-500">
            {section.title}
          </div>
          <div className="space-y-1">
            {section.items.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-[13px] ${active ? 'bg-indigo-100 font-semibold text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] ${item.badge === 'CSV' ? 'bg-indigo-100 text-indigo-700' : item.badge === 'FIX' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}


