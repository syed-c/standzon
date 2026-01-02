"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useTheme } from '@/components/client/ThemeProvider';
import { Bell, Search, Settings, User, Menu, ChevronDown, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Topbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Get session ID from localStorage
      const sessionId = typeof window !== 'undefined' ? localStorage.getItem('adminSessionId') : null;
      
      // Call logout API
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('adminSessionId');
      }
      
      // Redirect to login page
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect to login page even if API call fails
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('adminSessionId');
      }
      router.push('/admin/login');
    }
  };

  return (
    <div className="h-16 flex items-center justify-between px-4 lg:px-6 bg-[#0D1424] backdrop-blur-lg border-b border-[rgba(255,255,255,0.12)]">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 rounded-xl text-[#AAB4C5] hover:bg-[#202A40] hover:text-[#FFFFFF] transition-all duration-300 shadow-md hover:shadow-lg">
          <Menu className="w-5 h-5" />
        </button>
        <div className="text-sm text-[#E2E8F0] truncate">
          <span className="text-[#FFFFFF] font-medium">Admin Dashboard</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-[#1E293B] backdrop-blur-md border border-[rgba(255,255,255,0.15)] rounded-xl pl-10 pr-4 py-2 text-sm text-[#FFFFFF] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3C4A6B] focus:border-transparent w-64 transition-all duration-300 shadow-md hover:shadow-lg"
          />
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl text-[#AAB4C5] hover:bg-[#202A40] hover:text-[#FFFFFF] transition-all duration-300 shadow-md hover:shadow-lg"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            className="p-2 rounded-xl text-[#AAB4C5] hover:bg-[#202A40] hover:text-[#FFFFFF] transition-all duration-300 shadow-md hover:shadow-lg relative"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF5C5C] rounded-full animate-pulse"></span>
          </button>
          
          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#19233A] backdrop-blur-xl border border-[rgba(255,255,255,0.12)] rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.6)] z-50">
              <div className="p-4 border-b border-[rgba(255,255,255,0.12)]">
                <h3 className="font-semibold text-[#FFFFFF]">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-[#202A40] scrollbar-track-[#0D1424] rounded-lg">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-4 border-b border-[rgba(255,255,255,0.09)] hover:bg-[#29344D] transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#3C4A6B] rounded-full mt-2 animate-pulse"></div>
                      <div>
                        <p className="text-sm text-[#FFFFFF]">New builder registration</p>
                        <p className="text-xs text-[#AAB4C5] mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center">
                <button className="text-sm text-[#4F46E5] hover:text-[#FFFFFF] transition-colors duration-300">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button className="p-2 rounded-xl text-[#AAB4C5] hover:bg-[#202A40] hover:text-[#FFFFFF] transition-all duration-300 shadow-md hover:shadow-lg">
          <Settings className="w-5 h-5" />
        </button>

        {/* Profile */}
        <div className="relative">
          <button 
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#202A40] transition-all duration-300 shadow-md hover:shadow-lg"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="h-8 w-8 rounded-full overflow-hidden border border-[rgba(255,255,255,0.12)] shadow-md">
              <Image 
                alt="Avatar" 
                src="/zonelogo1.png" 
                width={32} 
                height={32} 
                className="object-cover"
              />
            </div>
            <ChevronDown className="w-4 h-4 text-[#E2E8F0]" />
          </button>
          
          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#19233A] backdrop-blur-xl border border-[rgba(255,255,255,0.12)] rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.6)] z-50">
              <div className="p-4 border-b border-[rgba(255,255,255,0.12)]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden border border-[rgba(255,255,255,0.12)] shadow-md">
                    <Image 
                      alt="Avatar" 
                      src="/zonelogo1.png" 
                      width={40} 
                      height={40} 
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-[#FFFFFF]">Admin User</p>
                    <p className="text-sm text-[#AAB4C5]">admin@exhibitbay.com</p>
                  </div>
                </div>
              </div>
              <div className="py-2">
                <a href="/admin/profile" className="block px-4 py-2 text-sm text-[#AAB4C5] hover:bg-[#202A40] hover:text-[#FFFFFF] transition-all duration-300">
                  Profile
                </a>
                <a href="/admin/settings" className="block px-4 py-2 text-sm text-[#AAB4C5] hover:bg-[#202A40] hover:text-[#FFFFFF] transition-all duration-300">
                  Settings
                </a>
              </div>
              <div className="border-t border-[rgba(255,255,255,0.12)] py-2">
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-[#FF5C5C] hover:bg-[#202A40] hover:text-[#FFFFFF] transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}