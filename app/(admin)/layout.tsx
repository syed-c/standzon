import { ReactNode } from 'react';
import { ThemeProvider } from '@/app/theme-provider';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // Admin-specific layout with theming
  // Client-side auth check will be handled by individual pages

  return (
    <ThemeProvider theme="admin">
      <div className="min-h-screen bg-slate-50">
        <div className="flex">
          {/* Admin sidebar could go here */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
