/**
 * CTA Block - Server Component
 * Displays final call-to-action section
 */

import { PublicQuoteRequest } from '@/components/client/PublicQuoteRequest';
import { Button } from '@/components/shared/button';
import Link from 'next/link';
import { BaseBlockProps } from './types';

interface CtaData {
  heading?: string;
  content?: string;
  buttonText?: string;
  location?: string;
  countryCode?: string;
}

export default function CtaBlock({ data, className = '' }: BaseBlockProps) {
  const ctaData = data as CtaData;
  
  return (
    <div className={`bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center ${className}`}>
      {ctaData.heading && (
        <h2 className="text-3xl font-bold mb-4">
          {ctaData.heading}
        </h2>
      )}
      {ctaData.content && (
        <p className="text-xl mb-8 opacity-90 text-white">
          {ctaData.content}
        </p>
      )}
      <div className="flex gap-4 justify-center">
        <PublicQuoteRequest
          location={ctaData.location}
          countryCode={ctaData.countryCode}
          buttonText={ctaData.buttonText || "Get Local Quotes"}
          className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
        />
        <Link href="/quote">
          <Button
            size="lg"
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
          >
            Browse All Options
          </Button>
        </Link>
      </div>
    </div>
  );
}
