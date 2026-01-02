import { ReactNode } from 'react';
import { ThemeProvider } from '@/app/theme-provider';
import Shell from '@/components/ui/Shell';
import Topbar from '@/components/admin/Topbar';
import Sidebar from '@/components/admin/Sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Admin domain layout.
 * Handles admin theming and UI scaffolding.
 * Purely UI-focused, no auth logic.
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ThemeProvider theme="admin">
      <Shell 
        topbar={<Topbar />} 
        sidebar={<div className="w-[300px] h-full overflow-y-auto border-r border-gray-800"><Sidebar /></div>}
        className="bg-slate-900 text-white"
      >
        <div className="admin-content-wrapper p-4 md:p-8">
          {children}
        </div>
      </Shell>
    </ThemeProvider>
  );
}
