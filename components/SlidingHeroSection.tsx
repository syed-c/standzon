'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PublicQuoteRequest from '@/components/PublicQuoteRequest';
import Link from 'next/link';

interface SlidingHeroSectionProps {
  headings: string[];
  subtitle: string;
  description: string;
  stats?: {
    value: string;
    label: string;
  }[];
  buttons?: {
    text: string;
    href?: string;
    isQuoteButton?: boolean;
    variant?: 'default' | 'outline';
    className?: string;
  }[];
  backgroundGradient?: string;
  location?: string;
  className?: string;
}

export function SlidingHeroSection({
  headings,
  subtitle,
  description,
  stats,
  buttons = [],
  backgroundGradient = 'linear-gradient(135deg, #0B0033 0%, #370031 50%, #832232 100%)',
  location,
  className = ''
}: SlidingHeroSectionProps) {
  const [currentHeadingIndex, setCurrentHeadingIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (headings.length <= 1) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentHeadingIndex((prev) => (prev + 1) % headings.length);
        setIsVisible(true);
      }, 500); // Half second for fade out
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [headings.length]);

  return (
    <section 
      className={`relative min-h-[70vh] md:min-h-[78vh] flex items-center justify-center overflow-hidden pt-16 md:pt-20 pb-16 md:pb-20 ${className}`} 
      style={{ background: backgroundGradient }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-500/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-rose-500/30 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
        {/* Sliding Main Heading */}
        <div className="min-h-[120px] md:min-h-[160px] flex items-center justify-center mb-6 md:mb-8">
          <h1 
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight transition-all duration-500 ${ 
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
            data-macaly="hero-title"
          >
            {headings[currentHeadingIndex]}
            <br />
            <span className="bg-gradient-to-r from-persian-orange to-claret bg-clip-text text-transparent">
              {subtitle}
            </span>
          </h1>
        </div>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 mb-6 md:mb-10 max-w-4xl mx-auto leading-relaxed px-4" data-macaly="hero-description">
          {description}
        </p>

        {/* Stats Section */}
        {stats && stats.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center items-center mb-8 md:mb-12">
            {stats.map((stat, index) => (
              <React.Fragment key={index}>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">{stat.value}</div>
                  <div className="text-gray-300 text-sm md:text-base">{stat.label}</div>
                </div>
                {index < stats.length - 1 && (
                  <div className="hidden sm:block w-px h-12 bg-white/20"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* CTA Buttons - Fixed spacing and visibility with more bottom margin */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center max-w-4xl mx-auto px-4 mb-16 md:mb-24">
          {buttons.map((button, index) => (
            button.isQuoteButton ? (
              <PublicQuoteRequest 
                key={index}
                buttonText={button.text}
                location={location}
                className={button.className || "bg-gradient-to-r from-claret to-russian-violet hover:from-dark-purple hover:to-claret text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl border-2 border-transparent transition-all duration-300 hover:shadow-2xl transform hover:scale-105 shadow-lg w-full sm:w-auto min-h-[56px] flex items-center justify-center opacity-100 visible"}
              />
            ) : button.href ? (
              <Link key={index} href={button.href}>
                <Button 
                  variant={button.variant || "outline"}
                  size="lg"
                  className={button.className || "border-2 border-white text-white bg-white/20 hover:bg-white hover:text-gray-900 backdrop-blur-md px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto min-w-[160px] min-h-[56px] flex items-center justify-center opacity-100 visible"}
                >
                  <span className="text-current opacity-100 visible">{button.text}</span>
                </Button>
              </Link>
            ) : (
              <Button 
                key={index}
                variant={button.variant || "outline"}
                size="lg"
                className={button.className || "border-2 border-white text-white bg-white/20 hover:bg-white hover:text-gray-900 backdrop-blur-md px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto min-w-[160px] min-h-[56px] flex items-center justify-center opacity-100 visible"}
              >
                <span className="text-current opacity-100 visible">{button.text}</span>
              </Button>
            )
          ))}
        </div>
      </div>
    </section>
  );
}

export default SlidingHeroSection;


