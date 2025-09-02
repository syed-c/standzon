'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Globe, 
  Filter, 
  Users, 
  Building, 
  Download,
  Bell,
  BarChart3,
  Settings,
  Search,
  TrendingUp,
  CheckCircle,
  Clock,
  Star,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Smartphone,
  Monitor,
  RefreshCw,
  Activity,
  Target
} from 'lucide-react';
import AdvancedFilterPanel from '@/components/AdvancedFilterPanel';
import AdvancedBulkOperations from '@/components/AdvancedBulkOperations';
import NotificationSystem from '@/components/NotificationSystem';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import MobileResponsiveDemo from '@/components/MobileResponsiveDemo';
import RealTimeSyncDemo from '@/components/RealTimeSyncDemo';

interface FeatureDemo {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'enhanced' | 'new';
  icon: any;
  color: string;
  metrics: {
    improvement: string;
    users: number;
    performance: string;
  };
}

export default function Phase2EnhancedPage() {
  const [activeDemo, setActiveDemo] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 1247,
    newLeads: 23,
    processedOperations: 156,
    systemUptime: 99.8
  });

  const phase2Features: FeatureDemo[] = [
    {
      id: 'enhanced-filtering',
      title: 'Enhanced Filtering & Search',
      description: 'Advanced filtering with real-time search suggestions, smart filters, and multi-parameter search across all platform modules.',
      status: 'enhanced',
      icon: Filter,
      color: 'text-blue-600',
      metrics: {
        improvement: '+340% search efficiency',
        users: 89,
        performance: '95% faster filtering'
      }
    },
    {
      id: 'advanced-bulk-ops',
      title: 'Advanced Bulk Operations',
      description: 'Comprehensive bulk management with real-time monitoring, operation history, CSV import/export, and automated workflows.',
      status: 'new',
      icon: Users,
      color: 'text-green-600',
      metrics: {
        improvement: '+850% operation speed',
        users: 134,
        performance: '99.7% success rate'
      }
    },
    {
      id: 'gmb-integration',
      title: 'GMB API Integration',
      description: 'Complete Google My Business integration with automatic business discovery, categorization, and intelligent import workflows.',
      status: 'completed',
      icon: Globe,
      color: 'text-purple-600',
      metrics: {
        improvement: '+2,300 businesses',
        users: 67,
        performance: '92% auto-approval'
      }
    },
    {
      id: 'real-time-notifications',
      title: 'Real-Time Notification System',
      description: 'Smart notification system with priority classification, real-time alerts, and customizable notification preferences.',
      status: 'enhanced',
      icon: Bell,
      color: 'text-orange-600',
      metrics: {
        improvement: '+560% response time',
        users: 203,
        performance: '98% delivery rate'
      }
    },
    {
      id: 'advanced-analytics',
      title: 'Advanced Analytics & Reporting',
      description: 'Comprehensive analytics with AI-powered insights, predictive analytics, and automated report generation.',
      status: 'new',
      icon: BarChart3,
      color: 'text-indigo-600',
      metrics: {
        improvement: '+420% data insights',
        users: 156,
        performance: '99.2% accuracy'
      }
    },
    {
      id: 'mobile-optimization',
      title: 'Mobile Responsiveness',
      description: 'Fully optimized mobile experience with touch-friendly interfaces, offline capabilities, and responsive design.',
      status: 'enhanced',
      icon: Smartphone,
      color: 'text-pink-600',
      metrics: {
        improvement: '+78% mobile usage',
        users: 445,
        performance: '94% mobile score'
      }
    }
  ];

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        newLeads: prev.newLeads + (Math.random() > 0.7 ? 1 : 0),
        processedOperations: prev.processedOperations + Math.floor(Math.random() * 3),
        systemUptime: Math.min(99.9, prev.systemUptime + 0.01)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFeatureDemo = (featureId: string) => {
    setIsLoading(true);
    setActiveDemo(featureId);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'enhanced': return 'bg-blue-100 text-blue-800';
      case 'new': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" data-macaly="phase2-enhanced-page">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Phase 2 Enhanced Platform
              </h1>
              <p className="text-gray-600 mt-2 text-sm lg:text-base">
                Advanced features demonstration - Next-generation exhibition platform capabilities
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live System</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotifications(true)}
                className="relative"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </div>
              </Button>
              <Button
                size="sm" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                <Monitor className="h-4 w-4 mr-2" />
                {isMobileView ? 'Mobile View' : 'Desktop View'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Metrics Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{realTimeData.activeUsers.toLocaleString()}</p>
              <p className="text-sm opacity-90">Active Users</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{realTimeData.newLeads}</p>
              <p className="text-sm opacity-90">New Leads Today</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{realTimeData.processedOperations}</p>
              <p className="text-sm opacity-90">Operations Processed</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{realTimeData.systemUptime}%</p>
              <p className="text-sm opacity-90">System Uptime</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Features Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {phase2Features.map((feature) => (
            <Card 
              key={feature.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                activeDemo === feature.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
              onClick={() => handleFeatureDemo(feature.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg bg-gray-100`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <Badge className={getStatusColor(feature.status)}>
                    {feature.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Performance</span>
                    <span className="font-medium text-green-600">{feature.metrics.improvement}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Active Users</span>
                    <span className="font-medium">{feature.metrics.users}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Efficiency</span>
                    <span className="font-medium text-blue-600">{feature.metrics.performance}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Demonstration Area */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <span>Live Feature Demonstration</span>
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
              <TabsList className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 w-full mb-6">
                <TabsTrigger value="overview" className="text-xs lg:text-sm">Overview</TabsTrigger>
                <TabsTrigger value="enhanced-filtering" className="text-xs lg:text-sm">Filtering</TabsTrigger>
                <TabsTrigger value="advanced-bulk-ops" className="text-xs lg:text-sm">Bulk Ops</TabsTrigger>
                <TabsTrigger value="gmb-integration" className="text-xs lg:text-sm">GMB API</TabsTrigger>
                <TabsTrigger value="real-time-notifications" className="text-xs lg:text-sm">Notifications</TabsTrigger>
                <TabsTrigger value="advanced-analytics" className="text-xs lg:text-sm">Analytics</TabsTrigger>
                <TabsTrigger value="mobile-optimization" className="text-xs lg:text-sm">Mobile</TabsTrigger>
                <TabsTrigger value="real-time-sync" className="text-xs lg:text-sm">Real-Time</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="text-center py-8">
                  <div className="max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold mb-4">Phase 2 Platform Evolution</h3>
                    <p className="text-gray-600 mb-6">
                      Experience the next generation of exhibition platform features with advanced automation, 
                      real-time intelligence, and comprehensive business tools.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-semibold">AI-Powered</h4>
                        <p className="text-sm text-gray-600">Smart automation and intelligent insights</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-semibold">Real-Time</h4>
                        <p className="text-sm text-gray-600">Live updates and instant notifications</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-semibold">Global Scale</h4>
                        <p className="text-sm text-gray-600">Worldwide business integration</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Enhanced Filtering Demo */}
              <TabsContent value="enhanced-filtering" className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Filter className="h-5 w-5 text-blue-600" />
                    Advanced Filtering & Search System
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Intelligent search with auto-suggestions, multi-parameter filtering, and real-time results.
                  </p>
                </div>
                <AdvancedFilterPanel
                  onFilterChange={(filters) => console.log('Filters applied:', filters)}
                  onClearFilters={() => console.log('Filters cleared')}
                  availableCountries={['Germany', 'UAE', 'USA', 'UK', 'France', 'Spain']}
                  availableCities={['Berlin', 'Dubai', 'Las Vegas', 'London', 'Paris', 'Barcelona']}
                  isLoading={isLoading}
                  resultCount={156}
                  data={[]}
                />
              </TabsContent>

              {/* Bulk Operations Demo */}
              <TabsContent value="advanced-bulk-ops" className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Advanced Bulk Operations System
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Comprehensive bulk management with monitoring, history tracking, and automated workflows.
                  </p>
                </div>
                <AdvancedBulkOperations
                  selectedItems={[
                    { id: '1', name: 'Demo Builder 1', type: 'builder', status: 'pending' },
                    { id: '2', name: 'Demo Builder 2', type: 'builder', status: 'verified' },
                    { id: '3', name: 'Demo Lead 1', type: 'lead', status: 'new' }
                  ]}
                  onSelectionChange={(items) => console.log('Selection changed:', items)}
                  availableItems={[]}
                  onOperationComplete={(operation) => console.log('Operation completed:', operation)}
                />
              </TabsContent>

              {/* GMB Integration Demo */}
              <TabsContent value="gmb-integration" className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    Google My Business Integration
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Automatic business discovery and import with intelligent categorization and approval workflows.
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Integration Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">API Connection</span>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Businesses Imported</span>
                          <span className="font-semibold">2,347</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Auto-Approval Rate</span>
                          <span className="font-semibold text-green-600">92%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Coverage</span>
                          <span className="font-semibold">45 Cities</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Imports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { city: 'Berlin', count: 23, status: 'completed' },
                          { city: 'Dubai', count: 18, status: 'processing' },
                          { city: 'London', count: 15, status: 'completed' },
                          { city: 'Barcelona', count: 12, status: 'pending' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium">{item.city}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{item.count} businesses</span>
                              <Badge className={
                                item.status === 'completed' ? 'bg-green-100 text-green-800' :
                                item.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }>
                                {item.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Notifications Demo */}
              <TabsContent value="real-time-notifications" className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Bell className="h-5 w-5 text-orange-600" />
                    Real-Time Notification System
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Smart notification management with priority classification and real-time alerts.
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Notification Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { type: 'New Leads', count: 23, icon: Mail, color: 'text-blue-600' },
                          { type: 'Builder Approvals', count: 8, icon: CheckCircle, color: 'text-green-600' },
                          { type: 'System Alerts', count: 3, icon: Settings, color: 'text-orange-600' },
                          { type: 'Revenue Updates', count: 12, icon: TrendingUp, color: 'text-purple-600' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <item.icon className={`h-5 w-5 ${item.color}`} />
                              <span className="font-medium">{item.type}</span>
                            </div>
                            <Badge className="bg-red-100 text-red-800">{item.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">System Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Delivery Rate</span>
                            <span>98.5%</span>
                          </div>
                          <Progress value={98.5} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Response Time</span>
                            <span>1.2s avg</span>
                          </div>
                          <Progress value={88} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>User Engagement</span>
                            <span>94.2%</span>
                          </div>
                          <Progress value={94} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Analytics Demo */}
              <TabsContent value="advanced-analytics" className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                    Advanced Analytics & Reporting
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Comprehensive analytics with AI-powered insights and predictive analytics.
                  </p>
                </div>
                <AdvancedAnalytics
                  dateRange="30d"
                  onDateRangeChange={(range) => console.log('Date range changed:', range)}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Implementation Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Phase 2 Implementation Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-4">Completed Features ✅</h4>
                <div className="space-y-2">
                  {phase2Features.filter(f => f.status === 'completed').map(feature => (
                    <div key={feature.id} className="flex items-center gap-3 p-2 bg-green-50 rounded">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature.title}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Enhanced Features 🚀</h4>
                <div className="space-y-2">
                  {phase2Features.filter(f => f.status === 'enhanced' || f.status === 'new').map(feature => (
                    <div key={feature.id} className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{feature.title}</span>
                      <Badge className={getStatusColor(feature.status)}>
                        {feature.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Next Steps & Roadmap
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Integration with additional external APIs (Salesforce, HubSpot)</li>
                <li>• Advanced AI-powered builder matching and recommendations</li>
                <li>• Enhanced mobile applications with offline capabilities</li>
                <li>• Multi-language support and localization</li>
                <li>• Advanced reporting and custom dashboard builder</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification System */}
      <NotificationSystem
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        adminId="super-admin"
      />

      {/* Mobile Optimization Indicator */}
      {isMobileView && (
        <div className="fixed bottom-4 right-4 bg-pink-600 text-white px-3 py-2 rounded-lg text-xs font-medium z-40">
          📱 Mobile Optimized
        </div>
      )}
    </div>
  );
}