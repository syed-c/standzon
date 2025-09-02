
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FiMenu, FiX, FiChevronDown, FiUser, FiZap } from 'react-icons/fi';
import Link from 'next/link';
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
          baseItems.push({ label: '📋 Dashboard', href: '/dashboard', isGreeting: false });
      }

      baseItems.push({ label: '📧 Messages', href: '/messaging', isGreeting: false });
      
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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 overflow-visible ${ 
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-xl shadow-lg border-b border-slate-800/50' 
        : 'bg-slate-900/90 backdrop-blur-md shadow-md border-b border-slate-800/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo - Updated with pink Zone text for better visibility */}
          <div className="flex-shrink-0">
            <Link href="/" className="group">
              <h1 className="text-xl lg:text-2xl font-bold font-inter transition-all duration-300 group-hover:scale-105">
                <span className="bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent">Stands</span><span className="bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 bg-clip-text text-transparent">Zone</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation - Updated for better contrast */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
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
                        className="flex items-center space-x-1 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 text-white hover:text-pink-400 hover:bg-gray-800/80 border border-transparent hover:border-pink-500/30 whitespace-nowrap"
                        onClick={() => handleDropdownClick(item.label)}
                        style={{ color: 'white' }}
                      >
                        <span style={{ color: 'white' }}>{item.label}</span>
                        <FiChevronDown className={`w-3 h-3 transition-transform duration-300 text-white ${
                          activeDropdown === item.label ? 'rotate-180' : ''
                        }`} />
                      </button>
                      {activeDropdown === item.label && (
                        <div 
                          className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700 py-2 z-[9999] animate-in fade-in slide-in-from-top-3 duration-300 dropdown-menu pointer-events-auto"
                          onMouseEnter={handleDropdownMouseEnter}
                          onMouseLeave={handleDropdownMouseLeave}
                        >
                          {item.submenu.map((subItem, index) => (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className="block px-6 py-3 text-gray-300 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 hover:text-pink-400 transition-all duration-200 border-l-4 border-transparent hover:border-pink-500 first:rounded-t-2xl last:rounded-b-2xl"
                              onClick={() => setActiveDropdown(null)}
                              style={{ color: '#d1d5db' }}
                            >
                              <span className="font-medium" style={{ color: 'inherit' }}>{subItem.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 text-white hover:text-pink-400 hover:bg-gray-800/80 border border-transparent hover:border-pink-500/30 whitespace-nowrap"
                      style={{ color: 'white' }}
                    >
                      <span style={{ color: 'white' }}>{item.label}</span>
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
                  <Button variant="ghost" size="sm" className="text-white hover:text-pink-400 hover:bg-gray-800/50 border-gray-700" style={{ color: 'white' }}>
                    <FiUser className="w-4 h-4 mr-1 text-white" />
                    <span style={{ color: 'white' }}>Builder Login</span>
                  </Button>
                </Link>
                <span className="text-gray-600">|</span>
                <Link href="/builder/register">
                  <Button variant="ghost" size="sm" className="text-white hover:text-pink-400 hover:bg-gray-800/50 border-gray-700" style={{ color: 'white' }}>
                    <span style={{ color: 'white' }}>Join as Builder</span>
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
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-300 text-white hover:text-pink-400 hover:bg-gray-800/80 border border-transparent hover:border-pink-500/30"
                  onClick={() => handleDropdownClick('Account')}
                  style={{ color: 'white' }}
                >
                  <FiUser className="w-4 h-4 text-white" />
                  <span className="hidden xl:inline" style={{ color: 'white' }}>Account</span>
                  <FiChevronDown className={`w-3 h-3 transition-transform duration-300 text-white ${
                    activeDropdown === 'Account' ? 'rotate-180' : ''
                  }`} />
                </button>
                {activeDropdown === 'Account' && (
                  <div 
                    className="absolute top-full right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700 py-2 z-[9999] animate-in fade-in slide-in-from-top-3 duration-300"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    {accountItems.map((accountItem, index) => (
                      accountItem.isGreeting ? (
                        <div
                          key={accountItem.label}
                          className="px-6 py-3 text-gray-400 border-b border-gray-700 bg-gray-800 first:rounded-t-2xl"
                        >
                          <span className="text-sm font-medium" style={{ color: '#9ca3af' }}>{accountItem.label}</span>
                          {currentUser && (
                            <div className="text-xs text-gray-500 mt-1">
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
                          className="block px-6 py-3 text-gray-300 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 hover:text-pink-400 transition-all duration-200 border-l-4 border-transparent hover:border-pink-500"
                          onClick={() => setActiveDropdown(null)}
                          style={{ color: '#d1d5db' }}
                        >
                          <span className="font-medium" style={{ color: 'inherit' }}>{accountItem.label}</span>
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Get Free Quote CTA Button - Updated with pink theme */}
            <Link href="/quote">
              <Button className="bg-gradient-to-r from-pink-600 via-pink-700 to-pink-800 hover:from-pink-700 hover:via-pink-800 hover:to-pink-900 text-white px-6 py-2.5 font-semibold text-sm rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-pink-500/50 whitespace-nowrap" style={{ color: 'white' }}>
                <FiZap className="w-4 h-4 mr-2 text-white" />
                <span style={{ color: 'white' }}>Get Free Quote</span>
              </Button>
            </Link>
          </div>

          {/* Mobile menu button - Updated colors */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Mobile Get Quote Button */}
            <Link href="/quote">
              <Button size="sm" className="bg-gradient-to-r from-pink-600 to-pink-800 text-white px-4 py-2 rounded-xl shadow-lg">
                <FiZap className="w-3 h-3 mr-1" />
                Quote
              </Button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl transition-all duration-300 text-white hover:bg-gray-800 hover:text-pink-400 border border-gray-700"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Updated for better contrast */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 w-screen max-w-screen h-screen bg-slate-950/98 backdrop-blur-sm shadow-2xl z-[9998] animate-in slide-in-from-top duration-200 flex flex-col overflow-x-hidden overscroll-contain">
          {/* Header spacer with dark gradient */}
          <div className="h-16 lg:h-18 flex-shrink-0 bg-slate-900 border-b border-slate-700"></div>
          
          {/* Scrollable content area */}
          <div className="flex-1 px-4 pt-4 pb-6 space-y-3 overflow-y-auto min-h-0">
            {/* Mobile Get Quote at Top */}
            <div className="mb-4">
              <Link href="/quote" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-pink-600 via-pink-700 to-pink-800 text-white py-3 rounded-xl shadow-lg font-semibold">
                  <FiZap className="w-4 h-4 mr-2" />
                  Get Free Quote - Instant Response
                </Button>
              </Link>
            </div>

            {/* Main Navigation with white text */}
            {mainNavItems.map((item) => (
              <div key={item.label} className="space-y-1">
                <Link
                  href={item.href}
                  className="block px-4 py-3 text-white hover:text-pink-400 hover:bg-slate-800 transition-all duration-200 rounded-xl font-medium border border-slate-800/60"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
                {item.submenu && (
                  <div className="ml-4 space-y-1 bg-white rounded-xl p-2 shadow-lg border border-slate-200">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="block px-3 py-2 text-sm text-gray-800 hover:text-pink-600 hover:bg-slate-100 transition-all duration-200 rounded-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Account section for mobile with dark theme */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <h3 className="px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Account</h3>
              {!currentUser ? (
                <div className="space-y-2">
                  <Link
                    href="/auth/login?type=builder"
                    className="block px-4 py-3 text-white hover:text-pink-400 hover:bg-slate-800 transition-all duration-200 rounded-xl font-medium border border-slate-800/60"
                    onClick={() => setIsOpen(false)}
                  >
                    🔐 Builder Login
                  </Link>
                  <Link
                    href="/builder/register"
                    className="block px-4 py-3 text-white hover:text-pink-400 hover:bg-slate-800 transition-all duration-200 rounded-xl font-medium border border-slate-800/60"
                    onClick={() => setIsOpen(false)}
                  >
                    🏢 Builder Registration
                  </Link>
                  <Link
                    href="/auth/login?type=admin"
                    className="block px-4 py-3 text-white hover:text-pink-400 hover:bg-slate-800 transition-all duration-200 rounded-xl font-medium border border-slate-800/60"
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
                      className="block px-4 py-3 text-white hover:text-pink-400 hover:bg-slate-800 transition-all duration-200 rounded-xl font-medium border border-slate-800/60"
                      onClick={() => setIsOpen(false)}
                    >
                      {accountItem.label}
                    </Link>
                  )
                ))
              )}
            </div>
          </div>
          
          {/* Bottom padding with dark gradient */}
          <div className="flex-shrink-0 h-6 bg-gradient-to-r from-gray-800 to-gray-900"></div>
        </div>
      )}
    </nav>
  );
}

