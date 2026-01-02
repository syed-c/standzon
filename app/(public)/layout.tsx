import { ReactNode } from 'react';
import { ThemeProvider } from '@/app/theme-provider';
import Shell from '@/components/shared/Shell';
import Navigation from '@/components/client/Navigation';
import Footer from '@/components/client/Footer';

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
        <div className="public-content-wrapper">
          {children}
        </div>
      </Shell>
    </ThemeProvider>
  );
}
