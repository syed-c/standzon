'use client';

import React, { memo } from 'react';
import { sanitizeHtml } from '@/lib/utils/html';
import { Button } from '@/components/ui/button';
import PublicQuoteRequest from '@/components/PublicQuoteRequest';
import { getFontClass } from '@/lib/utils/fonts';

interface UltraFastHeroProps {
  headings: string[];
  subtitle?: string;
  description?: string;
  stats?: Array<{ value: string; label: string }>;
  buttons?: Array<{ text: string; href?: string; isQuoteButton?: boolean; variant?: 'outline' | 'default' }>;
  headingFont?: string; // tailwind key: arial | helvetica | trebuchet | poppins | ''
  bgImage?: string;
  bgOpacity?: number;
}

// ✅ PERFORMANCE: Memoized component to prevent unnecessary re-renders
const UltraFastHero = memo(function UltraFastHero({
  headings,
  subtitle = "",
  description = "",
  stats = [],
  buttons = [],
  headingFont = '',
  bgImage,
  bgOpacity = 0.25
}: UltraFastHeroProps) {
  // Map CMS value to static Tailwind classes so they are not purged
  const headingFontClass = headingFont ? getFontClass(headingFont as any) : undefined;
  const heroBtnClass = "inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold border border-white/80 rounded-full bg-gradient-to-r from-[#E11D74] to-[#F1558E] hover:from-[#F1558E] hover:to-[#E11D74] hover:scale-105 active:from-[#C31860] active:to-[#E44080] transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-300";
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* ✅ PERFORMANCE: CSS-only gradient background (no images) */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Background image with low opacity, blended over gradient */}
      {bgImage && (
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${bgImage})`, opacity: Math.max(0, Math.min(1, bgOpacity)) }}
          aria-hidden="true"
        />
      )}
      {/* Subtle dark overlay to ensure text contrast */}
      <div className="absolute inset-0 bg-black/30" />
      
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        {/* Content container with white border and dark translucent background */}
        <div className="mx-auto max-w-6xl rounded-2xl shadow-lg">
          <div className="text-center px-4 sm:px-8 md:px-12 py-8 md:py-12 space-y-8">
          {/* Headings */}
          <div className="space-y-4">
            {headings.map((heading, index) => (
              <h1 
                key={index}
                className={[
                  'text-4xl md:text-6xl lg:text-6xl font-bold text-white leading-tight',
                  headingFontClass,
                ].filter(Boolean).join(' ')}
                style={{ 
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
              {buttons.map((button, index) => {
                const label = (button.text || '').replace(/[→»›⟶⟹➡️]/g, '').trim();
                const href = button.isQuoteButton ? '/quote' : (button.href || '#');
                return (
                  <div key={index} className="w-full sm:w-auto">
                    <a href={href} className={`${heroBtnClass} w-full sm:w-auto min-w-[200px]`}>
                      {label}
                    </a>
                  </div>
                );
              })}
            </div>
          )}
          </div>
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
