import React from 'react';

interface ShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  topbar?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Shell component for consistent UI scaffolding across different domains.
 * This is a server component by default.
 */
export default function Shell({ 
  children, 
  sidebar, 
  topbar, 
  footer,
  className = "" 
}: ShellProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {topbar && <div className="sticky top-0 z-40">{topbar}</div>}
      
      <div className="flex-1 flex overflow-hidden">
        {sidebar && <aside className="hidden md:block">{sidebar}</aside>}
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      
      {footer && <footer>{footer}</footer>}
    </div>
  );
}
