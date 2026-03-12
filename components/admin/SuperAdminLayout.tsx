"use client";

import React from 'react';
import {
  Sidebar,
  SidebarBody,
} from '@/components/admin/SuperAdminSidebar';

type SuperAdminLayoutProps = {
  sidebar?: React.ReactNode;
  topbar: React.ReactNode;
  children: React.ReactNode;
};

export default function SuperAdminLayout({
  sidebar,
  topbar,
  children
}: SuperAdminLayoutProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f6f8] font-inter admin-dashboard">
      {/* Sidebar – fixed left column */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody />
      </Sidebar>

      {/* Right column: topbar + scrollable content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0 z-40">
          {topbar}
        </header>

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}