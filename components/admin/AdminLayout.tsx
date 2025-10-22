"use client";
import React from 'react';

type AdminLayoutProps = {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  children: React.ReactNode;
};

export default function AdminLayout({ sidebar, topbar, children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-white font-inter overflow-x-hidden">
      {/* Topbar */}
      <div className="sticky top-0 z-40 bg-white h-16 border-b border-gray-200">
        {topbar}
      </div>

      {/* Body */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block" style={{ width: 260 }}>
          <div className="h-screen sticky top-0 overflow-y-auto border-r border-gray-200 bg-gray-50">
            {sidebar}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-h-[calc(100vh-64px)] overflow-x-hidden">
          <div className="admin-content px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1200px] mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}


