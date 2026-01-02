"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/client/ThemeProvider';
import { 
  Database, 
  Users, 
  Building2, 
  FileText, 
  Settings, 
  BarChart3, 
  Globe, 
  Upload, 
  User, 
  Shield, 
  Package, 
  Map, 
  Calendar, 
  MessageSquare, 
  Award, 
  TrendingUp, 
  Download, 
  Activity,
  Zap,
  PieChart,
  Wallet,
  Bell,
  Search,
  Menu,
  Home,
  LayoutDashboard,
  UserCheck,
  CreditCard,
  FileBarChart,
  HardDrive,
  Key,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  Sun,
  Moon
} from 'lucide-react';

type Item = { label: string; href: string; badge?: string; icon?: React.ReactNode };
type Section = { title: string; items: Item[] };

// Map section titles to icons
const sectionIcons: Record<string, React.ReactNode> = {
  'DASHBOARD': <LayoutDashboard className="w-4 h-4" />,
  'DATA MANAGEMENT & IMPORT': <Database className="w-4 h-4" />,
  'GMB INTEGRATION': <Globe className="w-4 h-4" />,
  'GENERAL': <Settings className="w-4 h-4" />,
  'BUILDER MANAGEMENT': <Building2 className="w-4 h-4" />,
  'CONTENT MANAGEMENT': <FileText className="w-4 h-4" />,
  'USER MANAGEMENT': <Users className="w-4 h-4" />,
  'ANALYTICS & MONITORING': <BarChart3 className="w-4 h-4" />,
  'PERFORMANCE TOOLS': <TrendingUp className="w-4 h-4" />,
  'SYSTEM TOOLS': <Monitor className="w-4 h-4" />,
  'PLATFORM INTELLIGENCE': <Zap className="w-4 h-4" />,
  'ADVANCED MANAGEMENT': <Shield className="w-4 h-4" />,
};

// Map item labels to icons
const itemIcons: Record<string, React.ReactNode> = {
  // Dashboard
  'Dashboard': <Home className="w-4 h-4" />,
  'Overview': <LayoutDashboard className="w-4 h-4" />,
  
  // Builder Management
  'Smart Builders': <Building2 className="w-4 h-4" />,
  'Builder Analytics': <BarChart3 className="w-4 h-4" />,
  'Claims & Builder Status': <Shield className="w-4 h-4" />,
  'Leads Management': <MessageSquare className="w-4 h-4" />,
  
  // Platform Intelligence
  'Global Pages Manager': <FileText className="w-4 h-4" />,
  'System Settings': <Settings className="w-4 h-4" />,
  
  // Data Management & Import
  'Bulk Upload System': <Upload className="w-4 h-4" />,
  'Bulk Builder Import': <Download className="w-4 h-4" />,
  'Data Audit System': <Search className="w-4 h-4" />,
  'Data Completeness': <PieChart className="w-4 h-4" />,
  'Data Persistence Monitor': <Activity className="w-4 h-4" />,
  'Final Audit Report': <FileBarChart className="w-4 h-4" />,
  
  // GMB Integration
  'GMB API Fetch Tool': <Globe className="w-4 h-4" />,
  
  // Advanced Management
  'Real-Time Builders': <Zap className="w-4 h-4" />,
  'Featured Builders': <Award className="w-4 h-4" />,
  
  // User Management
  'User Management': <User className="w-4 h-4" />,
  'Admin Management': <UserCheck className="w-4 h-4" />,
  
  // System Tools
  'System Logs': <FileText className="w-4 h-4" />,
  'Backup & Restore': <HardDrive className="w-4 h-4" />,
  'Activities': <Activity className="w-4 h-4" />,
  
  // General
  'Pages Editor': <FileText className="w-4 h-4" />,
  'Portfolio': <Upload className="w-4 h-4" />,
  'Builders': <Building2 className="w-4 h-4" />,
  'Leads': <Users className="w-4 h-4" />,
  'Users': <User className="w-4 h-4" />,
  'Website Settings': <Settings className="w-4 h-4" />,
};

// New grouped navigation matching requested design
const sections: Section[] = [
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
      { label: 'Test Activity Tracking', href: '/admin/test-activity', icon: <Activity className="w-4 h-4" /> },
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

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col h-full p-4 gap-6 bg-[#0D1424]">
      {/* Sidebar Header */}
      <div className="px-3 pb-4 border-b border-[rgba(255,255,255,0.12)]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#4F46E5] rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="h-6 w-6 text-[#FFFFFF]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#FFFFFF]">Admin Panel</h1>
            <p className="text-xs text-[#AAB4C5]">Smart Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-[#202A40] scrollbar-track-[#0D1424] rounded-lg">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="px-3 pb-2 text-xs tracking-wide font-semibold text-[#E2E8F0] uppercase flex items-center gap-2">
              {sectionIcons[section.title] || <div className="w-4 h-4" />}
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item, index) => {
                const active = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={`${section.title}-${item.label}-${index}`}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                      active 
                        ? 'bg-[#29344D] text-[#FFFFFF] border-l-4 border-[#3C4A6B] shadow-lg' 
                        : 'text-[#E2E8F0] hover:bg-[#29344D] hover:text-[#FFFFFF] hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && <span className="text-[#94A3B8]">{item.icon}</span>}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium transition-all duration-300 ${
                        item.badge === 'CSV' 
                          ? 'bg-[#6366F1] text-[#FFFFFF] border border-[rgba(255,255,255,0.12)] shadow-md' 
                          : item.badge === 'FIX' 
                            ? 'bg-[#FFB020] text-[#FFFFFF] border border-[rgba(255,255,255,0.12)] shadow-md' 
                            : item.badge === 'API' 
                              ? 'bg-[#6366F1] text-[#FFFFFF] border border-[rgba(255,255,255,0.12)] shadow-md' 
                              : 'bg-[#1E293B] text-[#FFFFFF] border border-[rgba(255,255,255,0.12)] shadow-md'
                      }`}>
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

      {/* Theme Switch */}
      <div className="pt-4 border-t border-[rgba(255,255,255,0.12)]">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-300 bg-[#202A40] hover:bg-[#202A40] text-[#AAB4C5] hover:text-[#FFFFFF] shadow-md hover:shadow-lg border border-[rgba(255,255,255,0.25)]"
        >
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-[#E2E8F0]" />
            ) : (
              <Sun className="w-4 h-4 text-[#E2E8F0]" />
            )}
            <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="relative w-10 h-5 bg-[#202A40] rounded-full border border-[rgba(255,255,255,0.25)]">
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-[#FFFFFF] transition-all duration-300 ${theme === 'dark' ? 'left-5' : 'left-0.5'}`}></div>
            </div>
          </div>
        </button>
      </div>

      {/* Sidebar Footer */}
      <div className="pt-4 border-t border-[rgba(255,255,255,0.12)]">
        <div className="px-3 text-xs text-[#AAB4C5]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#4ADE80] rounded-full animate-pulse"></div>
            <span>System Online</span>
          </div>
          <div className="text-[#6B7280]">
            v2.1.0
          </div>
        </div>
      </div>
    </div>
  );
}