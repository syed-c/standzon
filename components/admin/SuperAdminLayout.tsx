"use client";

import React from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { 
  Sidebar, 
  SidebarBody, 
  SidebarLinks 
} from '@/components/admin/SuperAdminSidebar';
import { useSidebar } from '@/components/admin/SuperAdminSidebar';

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
  const [open, setOpen] = React.useState(true);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 font-inter overflow-x-hidden admin-dashboard dark">
      {/* Topbar */}
      <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl h-16 border-b border-gray-800 shadow-2xl">
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
        <main className="flex-1 min-h-[calc(100vh-64px)] md:ml-[280px] ml-0 overflow-x-hidden">
          <div className="admin-content px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}