"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FiMenu, FiX, FiChevronDown, FiUser } from 'react-icons/fi';
import Link from 'next/link';

// Add null checks for icons to prevent runtime errors
const SafeIcon = ({ IconComponent, ...props }: { IconComponent: any } & React.SVGProps<SVGSVGElement>) => {
  if (!IconComponent) {
    return null;
  }
  return <IconComponent {...props} />;
};

export default function SimpleNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/30'
        : 'bg-white/90 backdrop-blur-md shadow-md'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="group">
              <h1 className="text-2xl font-bold font-inter transition-all duration-300 group-hover:scale-105">
                <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent">Stands</span><span className="text-gray-800">Zone</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation - All items clearly visible */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-gray-800 hover:text-pink-600 font-medium transition-colors">Home</Link>
            <Link href="/builders" className="text-gray-800 hover:text-pink-600 font-medium transition-colors">Find Builders</Link>
            <Link href="/trade-shows" className="text-gray-800 hover:text-pink-600 font-medium transition-colors">Trade Shows</Link>
            <Link href="/exhibition-stands" className="text-gray-800 hover:text-pink-600 font-medium transition-colors">Locations</Link>
            <Link href="/services" className="text-gray-800 hover:text-pink-600 font-medium transition-colors">Services</Link>
            <Link href="/blog" className="text-gray-800 hover:text-pink-600 font-medium transition-colors">Blog</Link>
            <Link href="/about" className="text-gray-800 hover:text-pink-600 font-medium transition-colors">About</Link>

            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'account' ? null : 'account')}
                className="flex items-center space-x-1 text-gray-800 hover:text-pink-600 font-medium transition-colors"
              >
                <SafeIcon IconComponent={FiUser} className="w-4 h-4" />
                <span>Account</span>
                <SafeIcon IconComponent={FiChevronDown} className={`w-3 h-3 transition-transform ${activeDropdown === 'account' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'account' && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  <Link href="/auth/login" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">🔐 Login</Link>
                  <Link href="/builder/register" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">🏗️ Builder Registration</Link>
                  <Link href="/auth/register" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">👥 Sign Up</Link>
                  <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">⚡ Admin Portal</Link>
                </div>
              )}
            </div>

            {/* Get Quote Button */}
            <Link href="/quote">
              <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 font-semibold rounded-lg shadow-lg transition-all duration-300">
                Get Quote
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-3">
            <Link href="/quote">
              <Button size="sm" className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-xl shadow-lg min-h-[44px]">
                Quote
              </Button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl transition-all duration-300 text-gray-700 hover:bg-pink-50 hover:text-pink-600 border border-gray-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {isOpen ? <SafeIcon IconComponent={FiX} className="w-6 h-6" /> : <SafeIcon IconComponent={FiMenu} className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden fixed top-0 left-0 w-full h-screen bg-white/98 backdrop-blur-xl shadow-2xl z-[200] animate-in slide-in-from-top duration-300 flex flex-col">
          {/* Header spacer */}
          <div className="h-20 flex-shrink-0 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-200"></div>

          {/* Mobile menu items */}
          <div className="flex-1 px-4 pt-4 pb-6 space-y-2 overflow-y-auto">
            <Link href="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 rounded-xl font-medium">Home</Link>
            <Link href="/builders" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 rounded-xl font-medium">Find Builders</Link>
            <Link href="/trade-shows" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 rounded-xl font-medium">Trade Shows</Link>
            <Link href="/exhibition-stands" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 rounded-xl font-medium">Locations</Link>
            <Link href="/services" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 rounded-xl font-medium">Services</Link>
            <Link href="/blog" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 rounded-xl font-medium">Blog</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 rounded-xl font-medium">About</Link>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Account</h3>
              <Link href="/auth/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 rounded-xl font-medium">🔐 Login</Link>
              <Link href="/builder/register" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 rounded-xl font-medium">🏗️ Builder Registration</Link>
              <Link href="/auth/register" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 rounded-xl font-medium">👥 Sign Up</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}