import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { sanitizeHtml } from '@/lib/utils/html';
import { getFontClass } from '@/lib/utils/fonts';
import HeroSearchFilter from '@/components/HeroSearchFilter';

interface UltraFastHeroProps {
  headings: string[];
  subtitle?: string;
  description?: string;
  stats?: Array<{ value: string; label: string }>;
  buttons?: Array<{ text: string; href?: string; isQuoteButton?: boolean; variant?: 'outline' | 'default' }>;
  headingFont?: string;
  bgImage?: string;
  bgOpacity?: number;
  blurDataURL?: string;
}

export default function UltraFastHero({
  headings,
  subtitle = "",
  description = "",
  stats = [],
  buttons = [],
  headingFont = '',
  bgImage,
  bgOpacity = 0.25,
  blurDataURL,
}: UltraFastHeroProps) {
  const headingFontClass = headingFont ? getFontClass(headingFont as any) : undefined;

  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden bg-[#0f172a]">
      {/* Background image */}
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage}
            alt="Exhibition Stand Builder"
            fill
            priority
            decoding="async"
            className="object-cover"
            style={{ opacity: Math.max(0.3, Math.min(0.7, bgOpacity + 0.35)) }}
            sizes="100vw"
            quality={85}
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL}
          />
        </div>
      )}

      {/* Left-to-right gradient overlay (banner design style) */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(to right, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.6) 50%, rgba(15, 23, 42, 0.15) 100%)',
        }}
      />

      {/* Fallback gradient when no bgImage */}
      {!bgImage && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0f172a] via-[#1e3886] to-[#0f172a]" />
      )}

      {/* Content — Left-aligned */}
      <div className="relative z-10 h-full min-h-[60vh] max-w-7xl mx-auto px-6 flex flex-col justify-center py-20">
        {/* Accent label */}
        <span className="inline-block text-[#c0123d] font-bold uppercase tracking-[0.3em] mb-4 text-sm">
          Premier B2B Directory
        </span>

        {/* Headings */}
        <div className="mb-8">
          {headings.map((heading, index) => (
            <h1
              key={index}
              className={[
                'text-5xl md:text-6xl lg:text-8xl font-black text-white leading-tight tracking-tighter uppercase max-w-4xl',
                headingFontClass,
              ].filter(Boolean).join(' ')}
            >
              {heading}
            </h1>
          ))}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <h2 className="text-xl md:text-2xl text-slate-300 font-medium uppercase tracking-wide mb-6 max-w-2xl">
            {subtitle}
          </h2>
        )}

        {/* Description */}
        {description && (
          <div
            className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed font-light mb-10"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
          />
        )}

        {/* Dynamic search filter */}
        <HeroSearchFilter />

        {/* Stats row
        {stats.length > 0 && (
          <div className="flex flex-wrap gap-12 max-w-3xl">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl md:text-5xl font-black text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )} */}

        {/* Buttons */}
        {/* {buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            {buttons.map((button, index) => {
              const label = (button.text || '').replace(/[→»›⟶⟹➡️]/g, '').trim();
              const href = button.isQuoteButton ? '/quote' : (button.href || '#');
              return (
                <Link
                  key={index}
                  href={href}
                  prefetch={true}
                  className={
                    index === 0
                      ? "bg-[#c0123d] hover:bg-[#a0102f] text-white px-10 py-4 font-bold uppercase tracking-widest transition-all text-center text-sm"
                      : "border border-white/30 hover:border-white text-white px-10 py-4 font-bold uppercase tracking-widest transition-all text-center text-sm hover:bg-white/10"
                  }
                >
                  {label}
                </Link>
              );
            })}
          </div>
        )} */}
      </div>

      {/* Live activity banner at bottom */}
      <div className="relative z-10 bg-slate-50 border-y border-slate-200 py-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 whitespace-nowrap overflow-hidden">
          <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#c0123d] shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c0123d] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c0123d]"></span>
            </span>
            Live Activity
          </span>
          <div className="flex gap-12 items-center text-xs font-medium text-slate-500 overflow-hidden">
            <span>NEW QUOTE: Exhibition booth requested for GITEX Dubai</span>
            <span className="text-slate-300">|</span>
            <span>MATCHED: Builder secured contract for CES Vegas 2025</span>
            <span className="text-slate-300">|</span>
            <span>AUDIT COMPLETE: EuroStands Berlin re-certified (98% Score)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
