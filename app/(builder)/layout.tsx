import { ReactNode } from 'react';
import { ThemeProvider } from '@/app/theme-provider';

interface BuilderLayoutProps {
  children: ReactNode;
}

export default function BuilderLayout({ children }: BuilderLayoutProps) {
  // Builder-specific layout with theming
  // Auth checks handled by individual pages

  return (
    <ThemeProvider theme="builder">
      <div className="min-h-screen bg-white">
        <div className="flex flex-col">
          {/* Builder header could go here */}
          <main className="flex-1">
            {children}
          </main>
          {/* Builder footer could go here */}
        </div>
      </div>
    </ThemeProvider>
  );
}
