"use client";
import React from 'react';
import { ThemeProvider } from '@/components/client/ThemeProvider';
import { Sidebar, SidebarBody, SidebarLinks } from '@/components/client/SidebarComponents';
import { useSidebar } from '@/components/client/SidebarComponents';

type AdminLayoutProps = {
  sidebar?: React.ReactNode;
  topbar: React.ReactNode;
  children: React.ReactNode;
};

export default function AdminLayout({ sidebar, topbar, children }: AdminLayoutProps) {
  const [open, setOpen] = React.useState(true);
  
  return (
    <div className="min-h-screen premium-dark-bg font-inter overflow-x-hidden admin-dashboard dark">
      {/* Topbar */}
      <div className="sticky top-0 z-40 bg-[#0D1424] backdrop-blur-lg h-16 border-b border-[rgba(255,255,255,0.12)] shadow-lg">
        {topbar}
      </div>

      {/* Body */}
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:block fixed top-16 left-0 h-[calc(100vh-64px)] z-30">
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody />
          </Sidebar>
        </div>

        {/* Main content */}
        <main className="flex-1 min-h-[calc(100vh-64px)] md:ml-[300px] ml-0 overflow-x-hidden">
          <div className="admin-content px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}