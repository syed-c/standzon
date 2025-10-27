
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FiMenu, FiX, FiChevronDown, FiUser, FiZap } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import logoImg from '@/components/zonelogo2.png';
import LogoutButton from '@/components/LogoutButton';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    console.log("Navigation: Setting up scroll listener");
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Check for logged in user
    const checkAuthStatus = () => {
      try {
        const userStr = localStorage.getItem('currentUser');
        if (userStr && userStr !== 'undefined' && userStr !== 'null') {
          const user = JSON.parse(userStr);
          if (user && typeof user === 'object' && user.isLoggedIn) {
            setCurrentUser(user);
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear corrupted data
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
      }
    };

    handleScroll();
    checkAuthStatus();
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', checkAuthStatus); // Listen for auth changes
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkAuthStatus);
      if (dropdownTimeout) clearTimeout(dropdownTimeout);
    };
  }, [dropdownTimeout]);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Updated navigation structure according to requirements
  const mainNavItems = [
    { label: 'Home', href: '/' },
    { 
      label: 'Find Builders', 
      href: '/builders',
      submenu: [
        { label: 'All Builders Directory', href: '/builders' },
        { label: 'Top Rated Builders', href: '/builders?sort=rating' },
        { label: 'Browse by Location', href: '/exhibition-stands' },
        { label: 'Verified Only', href: '/builders?verified=true' },
      ]
    },
    { 
      label: 'Trade Shows', 
      href: '/trade-shows',
      submenu: [
        { label: 'All Trade Shows & Exhibitions', href: '/trade-shows' },
        { label: 'Technology Shows', href: '/trade-shows?industry=technology' },
        { label: 'Healthcare & Medical', href: '/trade-shows?industry=healthcare' },
        { label: 'Manufacturing', href: '/trade-shows?industry=manufacturing' },
        { label: 'Upcoming Events', href: '/trade-shows?status=upcoming' },
      ]
    },
    { 
      label: 'Locations', 
      href: '/exhibition-stands',
      submenu: [
        { label: 'Browse Builders by Location', href: '/exhibition-stands' },
        { label: 'Germany Builders', href: '/exhibition-stands/germany' },
        { label: 'USA Builders', href: '/exhibition-stands/united-states' },
        { label: 'UAE Builders', href: '/exhibition-stands/uae' },
        { label: 'France Builders', href: '/exhibition-stands/france' },
      ]
    },
    { 
      label: 'Services', 
      href: '/services',
      submenu: [
        { label: 'Custom Stand Design', href: '/custom-booth' },
        { label: 'Stand Construction', href: '/booth-rental' },
        { label: '3D Visualization', href: '/3d-rendering-and-concept-development' },
        { label: 'Installation Services', href: '/trade-show-installation-and-dismantle' },
        { label: 'Project Management', href: '/trade-show-project-management' },
        { label: 'Graphics & Branding', href: '/trade-show-graphics-printing' },
      ]
    },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
  ];

  // Account dropdown menu - dynamic based on auth status
  const getAccountItems = (): Array<{label: string; href: string; isGreeting?: boolean}> => {
    if (currentUser) {
      // Authenticated user options
      const baseItems = [
        { 
          label: `👋 ${currentUser.name || currentUser.email}`, 
          href: '#', 
          isGreeting: true 
        }
      ];

      // Add role-specific dashboard links
      switch (currentUser.role) {
        case 'admin':
          baseItems.push({ label: '🔧 Admin Dashboard', href: '/admin/dashboard', isGreeting: false });
          baseItems.push({ label: '⚙️ Admin Settings', href: '/admin/settings', isGreeting: false });
          // Note: Global Pages Manager removed intentionally
          break;
        case 'builder':
          baseItems.push({ label: '🏗️ Builder Dashboard', href: '/builder/dashboard', isGreeting: false });
          baseItems.push({ label: '📊 My Profile', href: `/builders/${currentUser.id || 'profile'}`, isGreeting: false });
          break;
        default:
          // Redirect generic dashboard to admin dashboard as requested
          baseItems.push({ label: '📋 Dashboard', href: '/admin/dashboard', isGreeting: false });
      }
      // Remove messaging link from account menu
      // baseItems.push({ label: '📧 Messages', href: '/messaging', isGreeting: false });
      
      return baseItems;
    } else {
      // Only builder and admin authentication - no client registration
      return [
        { label: '🏗️ Builder Login', href: '/auth/login?type=builder', isGreeting: false },
        { label: '🏢 Builder Registration', href: '/builder/register', isGreeting: false },
        { label: '⚡ Admin Portal', href: '/auth/login?type=admin', isGreeting: false },
      ];
    }
  };

  const accountItems = getAccountItems();

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeout) clearTimeout(dropdownTimeout);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 600);
    setDropdownTimeout(timeout);
  };

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeout) clearTimeout(dropdownTimeout);
  };

  const handleDropdownMouseLeave = () => {
    setActiveDropdown(null);
  };

  // Add click handler for mobile/touch devices
  const handleDropdownClick = (label: string) => {
    if (activeDropdown === label) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(label);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-300 ${ 
      isScrolled 
        ? '!bg-slate-900/98 backdrop-blur-xl shadow-xl border-b border-slate-700/50' 
        : '!bg-slate-900/95 backdrop-blur-lg shadow-md border-b border-slate-700/30'
    }`} style={{ backgroundColor: isScrolled ? 'rgba(15, 23, 42, 0.98)' : 'rgba(15, 23, 42, 0.95)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="group flex items-center">
              <Image 
                src={logoImg} 
                alt="StandsZone" 
                width={160} 
                height={40} 
                priority 
                className="h-8 w-auto md:h-10 transition-transform duration-300 group-hover:scale-105" 
              />
              <span className="sr-only">StandsZone</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-6">
            <div className="flex items-center space-x-1">
              {mainNavItems.map((item) => (
                <div key={item.label} className="relative group">
                  {item.submenu ? (
                    <div
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                      className="relative"
                    >
                      <button
                        className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 !text-white hover:text-pink-400 hover:bg-slate-800/60 whitespace-nowrap"
                        onClick={() => handleDropdownClick(item.label)}
                      >
                        <span>{item.label}</span>
                        <FiChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                          activeDropdown === item.label ? 'rotate-180' : ''
                        }`} />
                      </button>
                      {activeDropdown === item.label && (
                        <div 
                          className="absolute top-full left-0 mt-1 w-56 !bg-slate-800 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700 py-1 z-[999] animate-in fade-in slide-in-from-top-2 duration-200"
                          style={{ backgroundColor: 'rgb(30, 41, 59)' }}
                          onMouseEnter={handleDropdownMouseEnter}
                          onMouseLeave={handleDropdownMouseLeave}
                        >
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className="block px-4 py-2.5 text-sm !text-white hover:bg-slate-700/80 hover:text-pink-400 transition-all duration-150"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 !text-white hover:text-pink-400 hover:bg-slate-800/60 whitespace-nowrap"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Account & CTA with improved contrast */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Login/Register or Account Dropdown */}
            {!currentUser ? (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login?type=builder">
                  <Button variant="ghost" size="sm" className="text-white hover:text-pink-400 hover:bg-slate-800/60 text-sm">
                    <FiUser className="w-4 h-4 mr-1.5" />
                    Builder Login
                  </Button>
                </Link>
                <span className="text-slate-600">|</span>
                <Link href="/builder/register">
                  <Button variant="ghost" size="sm" className="text-white hover:text-pink-400 hover:bg-slate-800/60 text-sm">
                    Join as Builder
                  </Button>
                </Link>
              </div>
            ) : (
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('Account')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 !text-white hover:text-pink-400 hover:bg-slate-800/60 whitespace-nowrap"
                  onClick={() => handleDropdownClick('Account')}
                >
                  <FiUser className="w-4 h-4" />
                  <span className="hidden xl:inline">Account</span>
                  <FiChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                    activeDropdown === 'Account' ? 'rotate-180' : ''
                  }`} />
                </button>
                {activeDropdown === 'Account' && (
                  <div 
                    className="absolute top-full right-0 mt-1 w-56 !bg-slate-800 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700 py-1 z-[999] animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{ backgroundColor: 'rgb(30, 41, 59)' }}
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    {accountItems.map((accountItem) => (
                      accountItem.isGreeting ? (
                        <div
                          key={accountItem.label}
                          className="px-4 py-2.5 text-slate-400 border-b border-slate-700/50 bg-slate-900/50"
                        >
                          <span className="text-sm font-medium">{accountItem.label}</span>
                          {currentUser && (
                            <div className="text-xs text-slate-500 mt-0.5">
                              {currentUser.role === 'admin' && '🔧 Administrator'}
                              {currentUser.role === 'builder' && '🏗️ Builder Account'}
                              {currentUser.role === 'client' && '👤 Client Account'}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          key={accountItem.label}
                          href={accountItem.href}
                          className="block px-4 py-2.5 text-sm !text-white hover:bg-slate-700/80 hover:text-pink-400 transition-all duration-150"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {accountItem.label}
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Get Free Quote CTA Button */}
            <Link href="/quote">
              <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-5 py-2 font-semibold text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap">
                <FiZap className="w-4 h-4 mr-1.5" />
                Get Free Quote
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Link href="/quote">
              <Button size="sm" className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-semibold">
                <FiZap className="w-3 h-3 mr-1" />
                Quote
              </Button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg transition-all duration-200 text-white hover:text-pink-400 hover:bg-slate-800/60"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 w-screen h-screen bg-slate-900/98 backdrop-blur-lg shadow-2xl z-[9998] animate-in slide-in-from-top duration-200 flex flex-col overflow-x-hidden">
          {/* Header spacer */}
          <div className="h-16 flex-shrink-0 bg-slate-900 border-b border-slate-700"></div>
          
          {/* Scrollable content area */}
          <div className="flex-1 px-4 pt-6 pb-6 space-y-3 overflow-y-auto">
            {/* Mobile Get Quote at Top */}
            <div className="mb-6">
              <Link href="/quote" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-3.5 rounded-lg shadow-lg font-semibold text-base">
                  <FiZap className="w-5 h-5 mr-2" />
                  Get Free Quote
                </Button>
              </Link>
            </div>

            {/* Main Navigation */}
            {mainNavItems.map((item) => (
              <div key={item.label} className="space-y-2">
                <Link
                  href={item.href}
                  className="block px-4 py-3 text-white hover:text-pink-400 hover:bg-slate-800/60 transition-all duration-150 rounded-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
                {item.submenu && (
                  <div className="ml-4 space-y-1 bg-slate-800/40 rounded-lg p-2">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all duration-150 rounded-md"
                        onClick={() => setIsOpen(false)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Account section for mobile */}
            <div className="mt-8 pt-6 border-t border-slate-700">
              <h3 className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Account</h3>
              {!currentUser ? (
                <div className="space-y-2">
                  <Link
                    href="/auth/login?type=builder"
                    className="block px-4 py-3 text-white hover:text-pink-400 hover:bg-slate-800/60 transition-all duration-150 rounded-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    🔐 Builder Login
                  </Link>
                  <Link
                    href="/builder/register"
                    className="block px-4 py-3 text-white hover:text-pink-400 hover:bg-slate-800/60 transition-all duration-150 rounded-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    🏢 Builder Registration
                  </Link>
                  <Link
                    href="/auth/login?type=admin"
                    className="block px-4 py-3 text-white hover:text-pink-400 hover:bg-slate-800/60 transition-all duration-150 rounded-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    ⚡ Admin Portal
                  </Link>
                </div>
              ) : (
                accountItems.map((accountItem) => (
                  !accountItem.isGreeting && (
                    <Link
                      key={accountItem.label}
                      href={accountItem.href}
                      className="block px-4 py-3 text-white hover:text-pink-400 hover:bg-slate-800/60 transition-all duration-150 rounded-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {accountItem.label}
                    </Link>
                  )
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

