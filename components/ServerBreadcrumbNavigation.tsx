// Server-compatible breadcrumb navigation component
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ServerBreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function ServerBreadcrumbNavigation({ items, className = '' }: ServerBreadcrumbNavigationProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav 
      className={`bg-white border-b border-gray-200 py-3 relative z-10 ${className}`}
      aria-label="Breadcrumb"
      data-macaly="breadcrumb-navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm">
          {/* Home link */}
          <li>
            <a 
              href="/" 
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9,22 9,12 15,12 15,22"></polyline>
              </svg>
              <span className="sr-only">Home</span>
            </a>
          </li>

          {/* Breadcrumb items */}
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li key={index} className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 mx-2">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
                {item.href && !isLast ? (
                  <a 
                    href={item.href}
                    className="text-gray-500 hover:text-gray-700 font-medium"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className={`font-medium ${isLast ? 'text-gray-900' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

export default ServerBreadcrumbNavigation;