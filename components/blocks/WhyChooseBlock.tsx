/**
 * Why Choose Block - Server Component
 * Displays why choose us section
 */

import { Award, CheckCircle } from 'lucide-react';
import { BaseBlockProps } from './types';

interface WhyChooseData {
  heading?: string;
  content: string;
}

export default function WhyChooseBlock({ data, className = '' }: BaseBlockProps) {
  const whyChooseData = data as WhyChooseData;
  
  return (
    <div className={className}>
      {whyChooseData.heading && (
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Award className="h-8 w-8 text-blue-600" />
          {whyChooseData.heading}
        </h2>
      )}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Design Team</h3>
            <p className="text-gray-600">Our experienced designers create stunning exhibition stands that capture attention and deliver results.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Materials</h3>
            <p className="text-gray-600">We use only premium materials to ensure your booth looks professional and lasts throughout your event.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">On-Time Delivery</h3>
            <p className="text-gray-600">We understand deadlines matter. Our team ensures your exhibition stand is ready when you need it.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Full Service</h3>
            <p className="text-gray-600">From concept to installation, we handle every aspect of your exhibition stand project.</p>
          </div>
        </div>
        {whyChooseData.content && (
          <div className="mt-6 pt-6 border-t border-blue-200">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {whyChooseData.content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
