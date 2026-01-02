import { ReactNode } from 'react';
import { ThemeProvider } from '@/app/theme-provider';
import Shell from '@/components/ui/Shell';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface BuilderLayoutProps {
  children: ReactNode;
}

/**
 * Builder domain layout.
 * Handles builder theming and UI scaffolding.
 * Purely UI-focused, no auth logic.
 */
export default function BuilderLayout({ children }: BuilderLayoutProps) {
  return (
    <ThemeProvider theme="builder">
      <Shell 
        topbar={<Navigation />} 
        footer={<Footer />}
        className="bg-white"
      >
        <div className="builder-content-wrapper pt-20">
          {children}
        </div>
      </Shell>
    </ThemeProvider>
  );
}
