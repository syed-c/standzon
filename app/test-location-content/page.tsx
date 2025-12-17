'use client';

import React from 'react';
import CountryCityPage from '@/components/CountryCityPage';

export default function TestLocationContent() {
  // Sample builder data
  const sampleBuilders = [
    {
      id: '1',
      companyName: 'Test Builder GmbH',
      slug: 'test-builder-gmbh',
      headquarters: {
        city: 'Berlin',
        country: 'Germany'
      },
      serviceLocations: [
        { city: 'Berlin', country: 'Germany' },
        { city: 'Hamburg', country: 'Germany' }
      ],
      rating: 4.8,
      projectsCompleted: 120,
      verified: true,
      premiumMember: true,
      reviewCount: 24,
      responseTime: 'Within 2 hours',
      services: [{ name: 'Custom Booth Design', description: 'Unique booth designs' }],
      specializations: [{ id: '1', name: 'Trade Shows', icon: '🎪', color: 'blue' }],
      companyDescription: 'Leading exhibition stand builder in Germany',
      keyStrengths: ['Quality Craftsmanship', 'Timely Delivery', 'Creative Designs']
    }  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Location Content Test</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <CountryCityPage 
            country="Germany"
            initialBuilders={sampleBuilders}
            isEditable={true}
          />
        </div>
      </div>
    </div>
  );
}