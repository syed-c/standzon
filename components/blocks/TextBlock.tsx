/**
 * Text Block - Server Component
 * Displays text content with optional heading
 */

import { BaseBlockProps } from './types';

interface TextData {
  heading?: string;
  content: string;
}

export default function TextBlock({ data, className = '' }: BaseBlockProps) {
  const textData = data as TextData;
  
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      {textData.heading && (
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {textData.heading}
        </h2>
      )}
      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
        {textData.content}
      </p>
    </div>
  );
}
