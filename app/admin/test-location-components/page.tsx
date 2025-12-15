'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CountryCityPage from '@/components/CountryCityPage';
import EnhancedLocationPage from '@/components/EnhancedLocationPage';

export default function TestLocationComponents() {
  const [country, setCountry] = useState('Germany');
  const [city, setCity] = useState('Berlin');
  const [testType, setTestType] = useState('country');
  const [showTest, setShowTest] = useState(false);

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
          <CardTitle>Location Page Components Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Enter country name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Test Type</label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="country">Country Page</option>
                  <option value="city">City Page</option>
                </select>
              </div>
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
                  country={country}
                  initialBuilders={[]}
                  isEditable={true}
                />
              ) : (
                <EnhancedLocationPage
                  country={country}
                  city={city}
                  initialBuilders={[]}
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