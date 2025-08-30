'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Filter, 
  Bell, 
  BarChart3, 
  Users, 
  Building,
  Download,
  Upload,
  Search,
  Star,
  CheckCircle,
  TrendingUp,
  Globe,
  Calendar
} from 'lucide-react';
import AdvancedFilterPanel from '@/components/AdvancedFilterPanel';
import NotificationSystem from '@/components/NotificationSystem';
import AdvancedBulkOperations from '@/components/AdvancedBulkOperations';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';

export default function Phase2ShowcasePage() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Array<{id: string, name: string, type: 'builder' | 'lead' | 'exhibition' | 'country' | 'city', status?: string}>>([
    { id: '1', name: 'Demo Builder 1', type: 'builder' as const, status: 'verified' },
    { id: '2', name: 'Demo Builder 2', type: 'builder' as const, status: 'pending' }
  ]);

  const mockData = {
    countries: ['Germany', 'UAE', 'USA', 'UK', 'France'],
    cities: ['Berlin', 'Dubai', 'Las Vegas', 'London', 'Paris'],
    builders: [
      { id: '1', companyName: 'Demo Builder 1', verified: true, rating: 4.5 },
      { id: '2', companyName: 'Demo Builder 2', verified: false, rating: 4.2 },
      { id: '3', companyName: 'Demo Builder 3', verified: true, rating: 4.8 }
    ]
  };

  const phase2Features = [
    {
      title: 'Enhanced Filtering & Search',
      icon: Filter,
      description: 'Advanced filtering with real-time search suggestions, smart categorization, and dynamic filters.',
      status: 'complete',
      highlights: ['Real-time search suggestions', 'Multi-criteria filtering', 'Smart categorization', 'Auto-suggestions']
    },
    {
      title: 'Advanced Bulk Operations',
      icon: Upload,
      description: 'Comprehensive bulk management with progress tracking, CSV import/export, and batch processing.',
      status: 'complete',
      highlights: ['Bulk approve/reject', 'CSV import/export', 'Progress tracking', 'Error handling']
    },
    {
      title: 'Real-Time Notifications',
      icon: Bell,
      description: 'Live notification system with categorization, priority levels, and action buttons.',
      status: 'complete',
      highlights: ['Real-time updates', 'Priority categorization', 'Action buttons', 'Email templates']
    },
    {
      title: 'Advanced Analytics',
      icon: BarChart3,
      description: 'Comprehensive reporting with interactive charts, export capabilities, and AI insights.',
      status: 'complete',
      highlights: ['Interactive dashboards', 'Export to PDF/CSV', 'AI-powered insights', 'Geographic analysis']
    },
    {
      title: 'GMB API Integration',
      icon: Globe,
      description: 'Complete Google My Business API integration with auto-classification and location-based fetching.',
      status: 'enhanced',
      highlights: ['API key management', 'Auto-classification', 'Location filtering', 'Bulk import']
    },
    {
      title: 'Mobile Responsiveness',
      icon: Users,
      description: 'Fully responsive design optimized for mobile devices and touch interfaces.',
      status: 'complete',
      highlights: ['Mobile-first design', 'Touch optimization', 'Responsive layouts', 'Performance optimized']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Phase 2 Enhancement Showcase
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore the advanced features and enhancements delivered in Phase 2 of the Exhibition Platform Intelligence Center.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-claret-100 text-claret-800 px-4 py-2">
              ✅ Enhanced Filtering & Search
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              ✅ Advanced Bulk Operations
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
              ✅ Real-Time Notifications
            </Badge>
            <Badge className="bg-orange-100 text-orange-800 px-4 py-2">
              ✅ Advanced Analytics
            </Badge>
          </div>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phase2Features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    feature.status === 'complete' ? 'bg-claret-100' :
                    feature.status === 'enhanced' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <feature.icon className={`w-5 h-5 ${
                      feature.status === 'complete' ? 'text-claret-600' :
                      feature.status === 'enhanced' ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <Badge className={`text-xs ${
                      feature.status === 'complete' ? 'bg-claret-100 text-claret-800' :
                      feature.status === 'enhanced' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {feature.status === 'complete' ? 'Complete' : 
                       feature.status === 'enhanced' ? 'Enhanced' : 'In Progress'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 text-sm">Key Features:</h4>
                  <ul className="space-y-1">
                    {feature.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle className="w-3 h-3 text-claret-500" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Demos */}
        <Tabs defaultValue="filtering" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger value="filtering">Filtering</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Ops</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="filtering" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Enhanced Filtering & Search Demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdvancedFilterPanel
                  onFilterChange={(filters) => console.log('Filters applied:', filters)}
                  onClearFilters={() => console.log('Filters cleared')}
                  availableCountries={mockData.countries}
                  availableCities={mockData.cities}
                  resultCount={mockData.builders.length}
                  data={mockData.builders}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Real-Time Notification System Demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Button
                    onClick={() => setShowNotifications(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white relative"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Open Notification Center
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      3
                    </div>
                  </Button>
                  <p className="text-gray-600 mt-4">
                    Click to explore the real-time notification system with categorization, priorities, and action buttons.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Advanced Bulk Operations Demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdvancedBulkOperations
                  selectedItems={selectedItems}
                  onSelectionChange={(items) => setSelectedItems(items.map(item => ({...item, status: item.status || 'unknown'})))}
                  availableItems={mockData.builders.map(b => ({
                    id: b.id,
                    name: b.companyName,
                    type: 'builder' as const,
                    status: b.verified ? 'verified' : 'pending'
                  }))}
                  onOperationComplete={(operation) => {
                    console.log('Operation completed:', operation);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Advanced Analytics & Reporting Demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdvancedAnalytics 
                  dateRange="30d"
                  onDateRangeChange={(range) => console.log('Date range changed:', range)}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Implementation Summary */}
        <Card className="bg-gradient-to-r from-claret-50 to-blue-50 border-claret-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-claret-800">
              <CheckCircle className="w-6 h-6" />
              Phase 2 Implementation Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-claret-800 mb-3">✅ Completed Features</h4>
                <ul className="space-y-2 text-sm text-claret-700">
                  <li>• Enhanced filtering with real-time search and smart suggestions</li>
                  <li>• Advanced bulk operations with progress tracking and error handling</li>
                  <li>• Real-time notification system with categorization and priorities</li>
                  <li>• Comprehensive analytics dashboard with interactive charts</li>
                  <li>• Mobile-responsive design optimized for all devices</li>
                  <li>• GMB API integration enhancements with auto-classification</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-3">📊 Technical Improvements</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• TypeScript integration for better type safety</li>
                  <li>• Recharts integration for data visualization</li>
                  <li>• Enhanced component architecture with reusable modules</li>
                  <li>• Real-time data synchronization capabilities</li>
                  <li>• Improved error handling and user feedback</li>
                  <li>• Performance optimizations for mobile devices</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg border border-claret-200">
              <p className="text-sm text-gray-600">
                <strong>Phase 2 Status:</strong> Successfully completed all major objectives including enhanced filtering, 
                advanced bulk operations, real-time notifications, comprehensive analytics, and mobile responsiveness. 
                The platform now provides a sophisticated admin experience with AI-powered insights and streamlined workflows.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Explore the Platform</h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <a href="/admin/dashboard">Admin Dashboard</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/admin/gmb-integration">GMB Integration</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/">Main Platform</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Notification System */}
      <NotificationSystem
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        adminId="demo-admin"
      />
    </div>
  );
}