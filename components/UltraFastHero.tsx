'use client';

import React, { memo } from 'react';
import { sanitizeHtml } from '@/lib/utils/html';
import { Button } from '@/components/ui/button';
import PublicQuoteRequest from '@/components/PublicQuoteRequest';

interface UltraFastHeroProps {
  headings: string[];
  subtitle?: string;
  description?: string;
  stats?: Array<{ value: string; label: string }>;
  buttons?: Array<{ text: string; href?: string; isQuoteButton?: boolean; variant?: 'outline' | 'default' }>;
}

// ✅ PERFORMANCE: Memoized component to prevent unnecessary re-renders
const UltraFastHero = memo(function UltraFastHero({
  headings,
  subtitle = "",
  description = "",
  stats = [],
  buttons = []
}: UltraFastHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ✅ PERFORMANCE: CSS-only gradient background (no images) */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* ✅ PERFORMANCE: Minimal overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* ✅ PERFORMANCE: Critical content above the fold */}
        <div className="space-y-8">
          {/* Headings */}
          <div className="space-y-4">
            {headings.map((heading, index) => (
              <h1 
                key={index}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                style={{ 
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  willChange: 'transform' // Optimize for animations
                }}
              >
                {heading}
              </h1>
            ))}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <h2 className="text-xl md:text-2xl text-blue-100 font-medium">
              {subtitle}
            </h2>
          )}

          {/* Description - allow basic HTML from CMS */}
          {description && (
            <div
              className="text-lg md:text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
            />
          )}

          {/* Stats */}
          {stats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-blue-100 text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Buttons */}
          {buttons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {buttons.map((button, index) => (
                <div key={index} className="w-full sm:w-auto">
                  {button.isQuoteButton ? (
                    <PublicQuoteRequest
                      buttonText={button.text}
                      className="btn-primary w-full sm:w-auto min-w-[200px]"
                    />
                  ) : (
                    <Button
                      asChild
                      className={button.variant === 'outline' ? 'btn-outline w-full sm:w-auto min-w-[200px]' : 'btn-primary w-full sm:w-auto min-w-[200px]'}
                    >
                      <a href={button.href || '#'}>
                        {button.text}
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ PERFORMANCE: CSS-only scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
});

export default UltraFastHero;
