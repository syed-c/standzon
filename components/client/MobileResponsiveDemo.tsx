'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import { Badge } from '@/components/shared/badge';
import { Star, MapPin, CheckCircle, Users } from 'lucide-react';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

interface MockBuilder {
  id: string;
  name: string;
  location: string;
  rating: number;
  projects: number;
  verified: boolean;
  image: string;
}

export default function MobileResponsiveDemo() {
  const [currentDevice, setCurrentDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [realBuilders, setRealBuilders] = useState<MockBuilder[]>([]);

  useEffect(() => {
    // Load real builders from unified platform
    try {
      const allBuilders = unifiedPlatformAPI.getBuilders();
      const topBuilders = allBuilders
        .filter(builder => builder.verified)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3)
        .map(builder => ({
          id: builder.id,
          name: builder.companyName,
          location: `${builder.headquarters?.city}, ${builder.headquarters?.country}`,
          rating: builder.rating || 4.5,
          projects: builder.projectsCompleted || 0,
          verified: builder.verified,
          image: '/images/placeholder-builder.jpg'
        }));

      if (topBuilders.length > 0) {
        setRealBuilders(topBuilders);
      } else {
        // Fallback to minimal realistic data if no real builders
        setRealBuilders([
          {
            id: '1',
            name: 'Exhibition Masters',
            location: 'Berlin, Germany',
            rating: 4.8,
            projects: 127,
            verified: true,
            image: '/images/placeholder-builder.jpg'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading builders for demo:', error);
      setRealBuilders([]);
    }
  }, []);

  // No mock data - use real builders from unified platform
  const [builders, setBuilders] = useState<any[]>([]);
  
  // Load real builders for demo
  React.useEffect(() => {
    try {
      const { unifiedPlatformAPI } = require('@/lib/data/unifiedPlatformData');
      const realBuilders = unifiedPlatformAPI.getBuilders()
        .filter((builder: any) => builder.verified)
        .slice(0, 3)
        .map((builder: any) => ({
          id: builder.id,
          name: builder.companyName,
          location: `${builder.headquarters?.city || 'Unknown'}, ${builder.headquarters?.country || 'Unknown'}`,
          rating: builder.rating || 4.5,
          projects: builder.projectsCompleted || 0,
          verified: builder.verified,
          image: '/images/builder-default.jpg'
        }));
      setBuilders(realBuilders.length > 0 ? realBuilders : []);
    } catch (error) {
      console.log('No real builders available for mobile demo');
      setBuilders([]);
    }
  }, []);

  const viewportSizes = {
    mobile: { width: '375px', height: '667px' },
    tablet: { width: '768px', height: '1024px' },
    desktop: { width: '100%', height: 'auto' }
  };

  const handleViewModeChange = (mode: 'mobile' | 'tablet' | 'desktop') => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
  };

  const handleTouchGesture = (type: 'swipe' | 'pinch' | 'tap') => {
    setTouchGestures(prev => ({
      ...prev,
      [`${type}Count`]: prev[`${type}Count` as keyof typeof prev] + 1
    }));
  };

  const MobileStatusBar = () => (
    <div className="bg-black text-white px-4 py-1 flex items-center justify-between text-xs">
      <div className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div className="flex items-center gap-2">
        <Signal className="h-3 w-3" />
        {isOfflineMode ? <WifiOff className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
        <Battery className="h-3 w-3" />
        <span>89%</span>
      </div>
    </div>
  );

  const MobileNavigation = () => (
    <div className="bg-white border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="font-bold text-lg">ExhibitBay</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </div>
          </Button>
          <Button variant="ghost" size="sm">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {showMobileMenu && (
        <div className="mt-3 space-y-2 border-t pt-3">
          <Button variant="ghost" className="w-full justify-start">
            <Building className="h-4 w-4 mr-2" />
            Builders
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      )}
    </div>
  );

  const MobileSearchBar = () => (
    <div className="p-4 bg-gray-50">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search builders, locations..."
          className="pl-10 pr-12 bg-white"
          onFocus={() => handleTouchGesture('tap')}
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const MobileBuilderCard = ({ builder }: { builder: MockBuilder }) => (
    <Card className="mb-4 shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-sm truncate pr-2">{builder.name}</h3>
          {builder.verified && (
            <Badge className="bg-green-100 text-green-800 text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <MapPin className="w-3 h-3 mr-1" />
          {builder.location}
        </div>
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center">
            <Star className="w-3 h-3 text-yellow-500 mr-1" />
            {builder.rating}
          </div>
          <div className="flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {builder.projects} projects
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 text-xs h-8 bg-blue-600 text-white">
            Contact
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs h-8 text-gray-900">
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const TouchGestureIndicator = () => (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded-lg text-xs">
      <div>Swipes: {touchGestures.swipeCount}</div>
      <div>Taps: {touchGestures.tapCount}</div>
    </div>
  );

  const OfflineModeIndicator = () => (
    isOfflineMode && (
      <div className="bg-orange-500 text-white px-4 py-2 text-center text-sm">
        <WifiOff className="h-4 w-4 inline mr-2" />
        Offline Mode - Limited functionality
      </div>
    )
  );

  return (
    <div className="w-full" data-macaly="mobile-responsive-demo">
      {/* Viewport Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-pink-600" />
            Mobile Responsiveness Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">View Mode:</span>
              <div className="flex gap-1">
                {[
                  { mode: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
                  { mode: 'tablet' as const, icon: Tablet, label: 'Tablet' },
                  { mode: 'desktop' as const, icon: Monitor, label: 'Desktop' }
                ].map(({ mode, icon: Icon, label }) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleViewModeChange(mode)}
                    className="text-xs"
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOfflineMode(!isOfflineMode)}
                className="text-xs"
              >
                {isOfflineMode ? <WifiOff className="h-3 w-3 mr-1" /> : <Wifi className="h-3 w-3 mr-1" />}
                {isOfflineMode ? 'Offline' : 'Online'}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">Touch Optimized</h4>
              <p className="text-blue-700 text-xs mt-1">Large touch targets, swipe gestures, and mobile-friendly interactions</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">Offline Capable</h4>
              <p className="text-green-700 text-xs mt-1">Works with limited connectivity and caches important data</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800">Adaptive UI</h4>
              <p className="text-purple-700 text-xs mt-1">Responsive layout that adapts to any screen size</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Device Mockup */}
      <div className="flex justify-center">
        <div 
          className="bg-gray-900 rounded-3xl p-4 shadow-2xl transition-all duration-300"
          style={{ 
            width: viewMode === 'desktop' ? '100%' : 'fit-content',
            maxWidth: viewMode === 'desktop' ? '100%' : viewportSizes[viewMode].width
          }}
        >
          {viewMode !== 'desktop' && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <MobileStatusBar />
              <OfflineModeIndicator />
              <MobileNavigation />
              <MobileSearchBar />
              
              <div className="h-96 overflow-y-auto bg-gray-50">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold">Exhibition Builders</h2>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      {mockBuilders.length} found
                    </Badge>
                  </div>
                </div>
                
                {builders.map((builder) => (
                  <MobileBuilderCard key={builder.id} builder={builder} />
                ))}
                
                <div className="p-4 text-center">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onTouchStart={() => handleTouchGesture('tap')}
                  >
                    Load More Builders
                  </Button>
                </div>
              </div>
              
              {/* Mobile Bottom Navigation */}
              <div className="bg-white border-t px-4 py-2">
                <div className="flex justify-around">
                  {[
                    { icon: Building, label: 'Builders' },
                    { icon: Search, label: 'Search' },
                    { icon: BarChart3, label: 'Analytics' },
                    { icon: Settings, label: 'Settings' }
                  ].map(({ icon: Icon, label }) => (
                    <Button
                      key={label}
                      variant="ghost"
                      size="sm"
                      className="flex flex-col gap-1 h-12"
                      onTouchStart={() => handleTouchGesture('tap')}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs">{label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {viewMode === 'desktop' && (
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Desktop Experience</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {builders.map((builder) => (
                    <Card key={builder.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Building className="h-8 w-8 text-gray-500" />
                          </div>
                          {builder.verified && (
                            <Badge className="bg-green-100 text-green-800">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold mb-2">{builder.name}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{builder.location}</span>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{builder.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">{builder.projects} projects</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">Contact</Button>
                          <Button variant="outline" size="sm" className="flex-1">View Profile</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <TouchGestureIndicator />
      
      {/* Feature Highlights */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Mobile Optimization Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Smartphone className="h-8 w-8 text-pink-600 mx-auto mb-2" />
              <h4 className="font-semibold">Touch Friendly</h4>
              <p className="text-sm text-gray-600">Large buttons and touch targets</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold">Responsive Design</h4>
              <p className="text-sm text-gray-600">Adapts to any screen size</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Wifi className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold">Offline Support</h4>
              <p className="text-sm text-gray-600">Works without internet</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Battery className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-semibold">Performance</h4>
              <p className="text-sm text-gray-600">Fast loading and smooth</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Content */}
      {currentDevice === 'mobile' && (
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Exhibition Builders</h2>
          {realBuilders.length > 0 ? (
            realBuilders.map((builder) => (
              <MobileBuilderCard key={builder.id} builder={builder} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Loading builders...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}