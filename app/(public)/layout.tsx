import { ReactNode } from 'react';
import { ThemeProvider } from '@/app/theme-provider';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  // Public-facing layout for SEO-optimized pages with theming
  // No auth required, focuses on theming and structure

  return (
    <ThemeProvider theme="public">
      <div className="min-h-screen bg-white">
        <div className="flex flex-col">
          {/* Public header/navigation could go here */}
          <main className="flex-1">
            {children}
          </main>
          {/* Public footer could go here */}
        </div>
      </div>
    </ThemeProvider>
  );
}
