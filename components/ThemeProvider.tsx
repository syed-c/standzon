"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const pathname = usePathname();

  useEffect(() => {
    // Only admin pages get dark mode — everything else is permanently light
    const isAdminPage = pathname && pathname.startsWith('/admin');
    
    if (isAdminPage) {
      setTheme('dark');
    } else {
      // Force light mode for all public-facing pages
      setTheme('light');
    }
  }, [pathname]);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.add('transition-colors');
      document.documentElement.classList.add('duration-300');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('transition-colors');
      document.documentElement.classList.add('duration-300');
    }
    
    // Save theme preference (but don't save for admin pages to keep them always dark)
    const isAdminPage = pathname && pathname.startsWith('/admin');
    if (!isAdminPage) {
      localStorage.setItem('theme', theme);
    }
    
    // Remove transition classes after animation completes
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('transition-colors');
      document.documentElement.classList.remove('duration-300');
    }, 300);
    
    return () => clearTimeout(timer);
  }, [theme, pathname]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}