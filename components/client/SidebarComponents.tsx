"use client";

import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Home, Building2, FileText, Settings, Database, Users, BarChart3, Globe, Upload, Shield, PieChart, Activity, Zap, Award, TrendingUp, Monitor, Sun, Moon } from "lucide-react";
import { useTheme } from '@/components/client/ThemeProvider';

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
  badge?: string;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props}>
        <SidebarLinks />
      </DesktopSidebar>
      <MobileSidebar {...(props as React.ComponentProps<"div">)}>
        <SidebarLinks />
      </MobileSidebar>
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-screen sticky top-0 px-4 py-4 hidden md:flex md:flex-col bg-[#0D1424] w-[300px] flex-shrink-0 border-r border-[rgba(255,255,255,0.12)]",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "60px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-[#0D1424] w-full border-b border-[rgba(255,255,255,0.12)]"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <Menu
            className="text-white cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-[#0D1424] p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-white cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2 text-white hover:bg-[#29344D] rounded-md transition-colors duration-200",
        className
      )}
      {...props}
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-white text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
      {link.badge && open && (
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white"
        >
          {link.badge}
        </motion.span>
      )}
    </Link>
  );
};

// Map section titles to icons
const sectionIcons: Record<string, React.ReactNode> = {
  'DASHBOARD': <Home className="w-4 h-4 text-white" />,
  'DATA MANAGEMENT & IMPORT': <Database className="w-4 h-4 text-white" />,
  'GMB INTEGRATION': <Globe className="w-4 h-4 text-white" />,
  'GENERAL': <Settings className="w-4 h-4 text-white" />,
  'BUILDER MANAGEMENT': <Building2 className="w-4 h-4 text-white" />,
  'CONTENT MANAGEMENT': <FileText className="w-4 h-4 text-white" />,
  'USER MANAGEMENT': <Users className="w-4 h-4 text-white" />,
  'ANALYTICS & MONITORING': <BarChart3 className="w-4 h-4 text-white" />,
  'PERFORMANCE TOOLS': <TrendingUp className="w-4 h-4 text-white" />,
  'SYSTEM TOOLS': <Monitor className="w-4 h-4 text-white" />,
  'PLATFORM INTELLIGENCE': <Zap className="w-4 h-4 text-white" />,
  'ADVANCED MANAGEMENT': <Shield className="w-4 h-4 text-white" />,
};

// Map item labels to icons
const itemIcons: Record<string, React.ReactNode> = {
  // Dashboard
  'Dashboard': <Home className="w-4 h-4 text-white" />,
  'Overview': <Home className="w-4 h-4 text-white" />,
  
  // Builder Management
  'Smart Builders': <Building2 className="w-4 h-4 text-white" />,
  'Builder Analytics': <BarChart3 className="w-4 h-4 text-white" />,
  'Claims & Builder Status': <Shield className="w-4 h-4 text-white" />,
  'Leads Management': <Users className="w-4 h-4 text-white" />,
  
  // Platform Intelligence
  'Global Pages Manager': <FileText className="w-4 h-4 text-white" />,
  'System Settings': <Settings className="w-4 h-4 text-white" />,
  
  // Data Management & Import
  'Bulk Upload System': <Upload className="w-4 h-4 text-white" />,
  'Bulk Builder Import': <Upload className="w-4 h-4 text-white" />,
  'Data Audit System': <Activity className="w-4 h-4 text-white" />,
  'Data Completeness': <PieChart className="w-4 h-4 text-white" />,
  'Data Persistence Monitor': <Activity className="w-4 h-4 text-white" />,
  'Final Audit Report': <FileText className="w-4 h-4 text-white" />,
  
  // GMB Integration
  'GMB API Fetch Tool': <Globe className="w-4 h-4 text-white" />,
  
  // Advanced Management
  'Real-Time Builders': <Zap className="w-4 h-4 text-white" />,
  'Featured Builders': <Award className="w-4 h-4 text-white" />,
  
  // User Management
  'User Management': <Users className="w-4 h-4 text-white" />,
  'Admin Management': <Users className="w-4 h-4 text-white" />,
  
  // System Tools
  'System Logs': <FileText className="w-4 h-4 text-white" />,
  'Backup & Restore': <Database className="w-4 h-4 text-white" />,
  'Activities': <Activity className="w-4 h-4 text-white" />,
  
  // General
  'Pages Editor': <FileText className="w-4 h-4 text-white" />,
  'Portfolio': <FileText className="w-4 h-4 text-white" />,
  'Website Settings': <Settings className="w-4 h-4 text-white" />,
};

// Navigation sections
const sections = [
  {
    title: 'DASHBOARD',
    items: [
      { label: 'Overview', href: '/admin/dashboard', icon: itemIcons['Overview'] },
    ],
  },
  {
    title: 'BUILDER MANAGEMENT',
    items: [
      { label: 'Smart Builders', href: '/admin/builders', icon: itemIcons['Smart Builders'] },
      { label: 'Builder Analytics', href: '/admin/quote-matching-analytics', icon: itemIcons['Builder Analytics'] },
      { label: 'Claims & Builder Status', href: '/admin/profile-claims', icon: itemIcons['Claims & Builder Status'] },
      { label: 'Leads Management', href: '/admin/leads', icon: itemIcons['Leads Management'] },
    ],
  },
  {
    title: 'PLATFORM INTELLIGENCE',
    items: [
      { label: 'Global Pages Manager', href: '/admin/global-pages', icon: itemIcons['Global Pages Manager'] },
      { label: 'System Settings', href: '/admin/settings', icon: itemIcons['System Settings'] },
    ],
  },
  {
    title: 'DATA MANAGEMENT & IMPORT',
    items: [
      { label: 'Bulk Upload System', href: '/admin/bulk-upload', badge: 'CSV', icon: itemIcons['Bulk Upload System'] },
      { label: 'Bulk Builder Import', href: '/admin/bulk-builder-import', badge: 'FIX', icon: itemIcons['Bulk Builder Import'] },
      { label: 'Data Audit System', href: '/admin/data-audit', icon: itemIcons['Data Audit System'] },
      { label: 'Data Completeness', href: '/admin/data-summary', icon: itemIcons['Data Completeness'] },
      { label: 'Data Persistence Monitor', href: '/admin/data-persistence', icon: itemIcons['Data Persistence Monitor'] },
      { label: 'Final Audit Report', href: '/admin/final-audit', icon: itemIcons['Final Audit Report'] },
    ],
  },
  {
    title: 'GMB INTEGRATION',
    items: [
      { label: 'GMB API Fetch Tool', href: '/admin/gmb-integration', badge: 'API', icon: itemIcons['GMB API Fetch Tool'] },
    ],
  },
  {
    title: 'ADVANCED MANAGEMENT',
    items: [
      { label: 'Real-Time Builders', href: '/admin/real-time-builder-manager', icon: itemIcons['Real-Time Builders'] },
      { label: 'Featured Builders', href: '/admin/featured-builders', icon: itemIcons['Featured Builders'] },
    ],
  },
  {
    title: 'USER MANAGEMENT',
    items: [
      { label: 'User Management', href: '/admin/users', icon: itemIcons['User Management'] },
      { label: 'Admin Management', href: '/admin/users/admins', icon: itemIcons['Admin Management'] },
    ],
  },
  {
    title: 'SYSTEM TOOLS',
    items: [
      { label: 'System Logs', href: '/admin/system-logs', icon: itemIcons['System Logs'] },
      { label: 'Backup & Restore', href: '/admin/backup', icon: itemIcons['Backup & Restore'] },
      { label: 'Activities', href: '/admin/activities', icon: itemIcons['Activities'] },
      { label: 'Test Activity Tracking', href: '/admin/test-activity', icon: <Activity className="w-4 h-4 text-white" /> },
    ],
  },
  {
    title: 'GENERAL',
    items: [
      { label: 'Pages Editor', href: '/admin/pages-editor', icon: itemIcons['Pages Editor'] },
      { label: 'Portfolio', href: '/admin/portfolio', icon: itemIcons['Portfolio'] },
      { label: 'Website Settings', href: '/admin/website-settings', icon: itemIcons['Website Settings'] },
    ],
  },
];

export const SidebarLinks = () => {
  const { theme, toggleTheme } = useTheme();
  const { open } = useSidebar();
  
  return (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div>
                <div className="text-sm font-bold text-white">Admin Panel</div>
                <div className="text-xs text-gray-300">Smart Dashboard</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-2 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="px-2 py-1 text-xs tracking-wide font-semibold text-gray-400 uppercase flex items-center gap-2"
              >
                {sectionIcons[section.title] || <div className="w-4 h-4" />}
                {section.title}
              </motion.div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <SidebarLink 
                  key={item.label} 
                  link={item} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Theme Toggle */}
      <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.12)]">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-start gap-2 w-full py-2 text-white hover:bg-[#29344D] rounded-md px-2 transition-colors duration-200"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-white" />
          ) : (
            <Moon className="w-4 h-4 text-white" />
          )}
          {open && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-white"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </motion.span>
          )}
        </button>
        
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="mt-4 px-2 text-xs text-gray-400"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
            <div>v2.1.0</div>
          </motion.div>
        )}
      </div>
    </div>
  );
};