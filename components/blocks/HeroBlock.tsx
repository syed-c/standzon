/**
 * Hero Block - Server Component
 * Displays the main hero section with title, description, and CTA
 */

import { PublicQuoteRequest } from '@/components/client/PublicQuoteRequest';
import { Button } from '@/components/shared/button';
import { BaseBlockProps } from './types';

interface HeroData {
  title: string;
  description: string;
  subtitle?: string;
  ctaText?: string;
}

export default function HeroBlock({ data, className = '' }: BaseBlockProps) {
  const heroData = data as HeroData;
  
  return (
    <div className={`bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {heroData.title}
          </h1>
          {heroData.subtitle && (
            <p className="text-xl md:text-2xl mb-6 opacity-90">
              {heroData.subtitle}
            </p>
          )}
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            {heroData.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PublicQuoteRequest
              buttonText={heroData.ctaText || "Get Free Quote"}
              className="text-lg px-8 py-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
