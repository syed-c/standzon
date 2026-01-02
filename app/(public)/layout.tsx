import { ReactNode } from 'react';
import { ThemeProvider } from '@/app/theme-provider';
import Shell from '@/components/ui/Shell';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface PublicLayoutProps {
  children: ReactNode;
}

/**
 * Public domain layout.
 * Optimized for SEO and minimal overhead.
 */
export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <ThemeProvider theme="public">
      <Shell 
        topbar={<Navigation />} 
        footer={<Footer />}
        className="bg-white"
      >
        <div className="public-content-wrapper pt-20">
          {children}
        </div>
      </Shell>
    </ThemeProvider>
  );
}
