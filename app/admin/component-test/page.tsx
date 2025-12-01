'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CountryCityPage } from '@/components/CountryCityPage';
import { EnhancedLocationPage } from '@/components/EnhancedLocationPage';

export default function ComponentTest() {
  const [testType, setTestType] = useState<'country' | 'city'>('country');
  const [showTest, setShowTest] = useState(false);

  // Sample builder data
  const sampleBuilders: any[] = [
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
      companyDescription: 'Leading exhibition stand builder in Germany'
    },
    {
      id: '2',
      companyName: 'Another Builder Ltd',
      slug: 'another-builder-ltd',
      headquarters: {
        city: 'Munich',
        country: 'Germany'
      },
      serviceLocations: [
        { city: 'Munich', country: 'Germany' },
        { city: 'Frankfurt', country: 'Germany' }
      ],
      rating: 4.5,
      projectsCompleted: 85,
      verified: true,
      premiumMember: false,
      reviewCount: 18,
      responseTime: 'Within 24 hours',
      services: [{ name: 'Modular Stands', description: 'Flexible modular solutions' }],
      specializations: [{ id: '2', name: 'Corporate Events', icon: '🏢', color: 'green' }],
      companyDescription: 'Specialized in corporate event displays'
    }
  ];

  const runTest = () => {
    setShowTest(true);
  };

  const resetTest = () => {
    setShowTest(false);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Component Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Test Type</label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value as 'country' | 'city')}
                className="w-full p-2 border rounded"
              >
                <option value="country">Country Page</option>
                <option value="city">City Page</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={runTest}>
                Run Test
              </Button>
              <Button variant="outline" onClick={resetTest}>
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showTest && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4">
              {testType === 'country' ? (
                <CountryCityPage 
                  country="Germany"
                  initialBuilders={sampleBuilders}
                  isEditable={true}
                />
              ) : (
                <EnhancedLocationPage
                  country="Germany"
                  city="Berlin"
                  initialBuilders={sampleBuilders}
                  isEditable={true}
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}