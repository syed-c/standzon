'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/tabs';
import { Button } from '@/components/shared/button';
import { Badge } from '@/components/shared/badge';
import { 
  Building2, FileText, Calendar, Upload, Download, Plus, Settings,
  Database, Globe, Users, MapPin, Zap, BarChart3
} from 'lucide-react';
import Link from 'next/link';

interface AdvancedAdminDashboardProps {
  adminId: string;
  permissions: string[];
}

const AdvancedAdminDashboard: React.FC<AdvancedAdminDashboardProps> = ({ adminId, permissions }) => {
  const [activeTab, setActiveTab] = useState('overview');

  console.log('Advanced Admin Dashboard loaded for admin:', adminId);

  const managementModules = [
    {
      id: 'builders',
      title: 'Builder Management',
      description: 'Add, edit, and manage exhibition stand builders',
      icon: Building2,
      actions: [
        { label: 'Add New Builder', href: '/admin/builders/add', color: 'bg-blue-500' },
        { label: 'Bulk Import Builders', href: '/admin/builders/bulk-import', color: 'bg-green-500' },
        { label: 'Edit Existing Builders', href: '/admin/builders/manage', color: 'bg-orange-500' },
        { label: 'Export Builder Database', href: '/admin/builders/export', color: 'bg-purple-500' }
      ],
      stats: { total: 2, pending: 0, verified: 2 }
    },
    {
      id: 'content',
      title: 'Content Management',
      description: 'Manage countries, cities, and all platform content',
      icon: Globe,
      actions: [
        { label: 'Manage Countries', href: '/admin/content/countries', color: 'bg-blue-500' },
        { label: 'Manage Cities', href: '/admin/content/cities', color: 'bg-green-500' },
        { label: 'Add Global Cities', href: '/admin/content/cities/bulk-add', color: 'bg-orange-500' },
        { label: 'Content Editor', href: '/admin/content/editor', color: 'bg-purple-500' }
      ],
      stats: { countries: 10, cities: 25, pages: 150 }
    },
    {
      id: 'tradeshows',
      title: 'Trade Shows Database',
      description: 'Comprehensive trade show and exhibition management',
      icon: Calendar,
      actions: [
        { label: 'Add New Trade Show', href: '/admin/tradeshows/add', color: 'bg-blue-500' },
        { label: 'Bulk Import Shows', href: '/admin/tradeshows/bulk-import', color: 'bg-green-500' },
        { label: 'Manage Existing Shows', href: '/admin/tradeshows/manage', color: 'bg-orange-500' },
        { label: 'Industry Categories', href: '/admin/tradeshows/categories', color: 'bg-purple-500' }
      ],
      stats: { total: 300, upcoming: 125, active: 89 }
    },
    {
      id: 'locations',
      title: 'Global Locations',
      description: 'Worldwide exhibition venues and locations',
      icon: MapPin,
      actions: [
        { label: 'Add Exhibition Venues', href: '/admin/locations/venues', color: 'bg-blue-500' },
        { label: 'City Database Manager', href: '/admin/locations/cities', color: 'bg-green-500' },
        { label: 'Import Global Data', href: '/admin/locations/import', color: 'bg-orange-500' },
        { label: 'Venue Categories', href: '/admin/locations/categories', color: 'bg-purple-500' }
      ],
      stats: { venues: 450, cities: 250, countries: 50 }
    },
    {
      id: 'users',
      title: 'User Management',
      description: 'Platform users, permissions, and access control',
      icon: Users,
      actions: [
        { label: 'User Accounts', href: '/admin/users/accounts', color: 'bg-blue-500' },
        { label: 'Role Management', href: '/admin/users/roles', color: 'bg-green-500' },
        { label: 'Bulk User Import', href: '/admin/users/import', color: 'bg-orange-500' },
        { label: 'Access Logs', href: '/admin/users/logs', color: 'bg-purple-500' }
      ],
      stats: { total: 1547, active: 1205, pending: 67 }
    },
    {
      id: 'system',
      title: 'System Administration',
      description: 'Advanced system settings and configuration',
      icon: Settings,
      actions: [
        { label: 'Database Management', href: '/admin/system/database', color: 'bg-blue-500' },
        { label: 'API Configuration', href: '/admin/system/api', color: 'bg-green-500' },
        { label: 'Performance Monitor', href: '/admin/system/performance', color: 'bg-orange-500' },
        { label: 'Backup & Security', href: '/admin/system/security', color: 'bg-purple-500' }
      ],
      stats: { uptime: '99.8%', requests: '1.2M', storage: '85%' }
    }
  ];

  const ModuleCard = ({ module }: any) => (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <module.icon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{module.title}</h3>
            <p className="text-sm text-gray-500 font-normal">{module.description}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(module.stats).map(([key, value]) => (
            <Badge key={key} variant="outline" className="text-xs">
              {key}: {String(value)}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-2">
          {module.actions.map((action: any, index: number) => (
            <Link key={index} href={action.href}>
              <Button 
                className={`w-full justify-start text-white hover:opacity-90 ${action.color}`}
                size="sm"
              >
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advanced Admin Control Center</h1>
            <p className="text-gray-600 mt-1">Complete platform administration and management tools</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-100 text-green-800">
              <Zap className="w-3 h-3 mr-1" />
              System Operational
            </Badge>
            <Link href="/admin/dashboard">
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Main Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white p-1 shadow-sm">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Management Hub</span>
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Bulk Operations</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Content System</span>
            </TabsTrigger>
            <TabsTrigger value="global" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Global Database</span>
            </TabsTrigger>
          </TabsList>

          {/* Management Hub */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {managementModules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </TabsContent>

          {/* Bulk Operations */}
          <TabsContent value="bulk" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5" />
                    <span>Bulk Builder Operations</span>
                  </CardTitle>
                  <CardDescription>Import, export, and manage builders in bulk</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/admin/builders/bulk-import">
                    <Button className="w-full bg-blue-600 text-white">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Builders (CSV)
                    </Button>
                  </Link>
                  <Link href="/admin/builders/export">
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Export All Builders
                    </Button>
                  </Link>
                  <Link href="/admin/builders/manage">
                    <Button variant="outline" className="w-full">
                      <Building2 className="w-4 h-4 mr-2" />
                      Manage All Builders
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Bulk Trade Show Operations</span>
                  </CardTitle>
                  <CardDescription>Import and manage trade shows globally</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/admin/tradeshows/bulk-import">
                    <Button className="w-full bg-green-600 text-white">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Trade Shows (CSV)
                    </Button>
                  </Link>
                  <Link href="/admin/tradeshows/export">
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Export All Shows
                    </Button>
                  </Link>
                  <Link href="/admin/tradeshows/manage">
                    <Button variant="outline" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Manage All Shows
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>Global Content Operations</span>
                  </CardTitle>
                  <CardDescription>Manage countries, cities, and locations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/admin/content/cities/bulk-add">
                    <Button className="w-full bg-orange-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Global Cities
                    </Button>
                  </Link>
                  <Link href="/admin/locations/import">
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Locations
                    </Button>
                  </Link>
                  <Link href="/admin/content/editor">
                    <Button variant="outline" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Content Editor
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content System */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                  <CardDescription>Edit all platform content and pages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/admin/content/editor">
                    <Button className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Platform Content Editor
                    </Button>
                  </Link>
                  <Link href="/admin/content/countries">
                    <Button variant="outline" className="w-full justify-start">
                      <Globe className="w-4 h-4 mr-2" />
                      Country Pages
                    </Button>
                  </Link>
                  <Link href="/admin/content/cities">
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="w-4 h-4 mr-2" />
                      City Pages
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO Management</CardTitle>
                  <CardDescription>Meta titles, descriptions, and URLs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/admin/seo/meta">
                    <Button className="w-full justify-start">
                      Meta Data Editor
                    </Button>
                  </Link>
                  <Link href="/admin/seo/urls">
                    <Button variant="outline" className="w-full justify-start">
                      URL Structure
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Media Management</CardTitle>
                  <CardDescription>Images, videos, and assets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/admin/media/upload">
                    <Button className="w-full justify-start">
                      Upload Media
                    </Button>
                  </Link>
                  <Link href="/admin/media/gallery">
                    <Button variant="outline" className="w-full justify-start">
                      Media Gallery
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Global Database */}
          <TabsContent value="global" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>Global Exhibition Cities</span>
                  </CardTitle>
                  <CardDescription>Comprehensive database of worldwide exhibition locations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-gray-50 rounded">
                      <strong>Countries:</strong> 50+
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <strong>Cities:</strong> 250+
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <strong>Venues:</strong> 450+
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <strong>Shows:</strong> 300+
                    </div>
                  </div>
                  <Link href="/admin/locations/cities">
                    <Button className="w-full">
                      <MapPin className="w-4 h-4 mr-2" />
                      Manage Global Cities
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="w-5 h-5" />
                    <span>Database Operations</span>
                  </CardTitle>
                  <CardDescription>Advanced database management tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/admin/system/database">
                    <Button className="w-full">
                      <Database className="w-4 h-4 mr-2" />
                      Database Manager
                    </Button>
                  </Link>
                  <Link href="/admin/system/backup">
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Backup & Restore
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvancedAdminDashboard;