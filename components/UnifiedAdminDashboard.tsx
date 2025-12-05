'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { adminAPI } from '@/lib/api/admin';
import { ExhibitionBuilder } from '@/lib/data/exhibitionBuilders';
import {
  Users,
  Building,
  Globe,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  MapPin,
  Star,
  Eye,
  Settings,
  BarChart3,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface UnifiedAdminDashboardProps {
  adminId: string;
  permissions: string[];
}

export default function UnifiedAdminDashboard({ adminId, permissions }: UnifiedAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [builders, setBuilders] = useState<ExhibitionBuilder[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuilder, setSelectedBuilder] = useState<ExhibitionBuilder | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = adminAPI.subscribe((event: string, data: any) => {
      console.log('Real-time update:', event, data);
      
      switch (event) {
        case 'builder_created':
        case 'builder_updated':
          loadBuilders();
          loadStats();
          break;
        case 'builder_deleted':
          setBuilders(prev => prev.filter(b => b.id !== data.id));
          loadStats();
          break;
        case 'country_created':
          loadCountries();
          break;
        case 'city_created':
          loadCities();
          break;
      }
    });

    return unsubscribe;
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadBuilders(),
        loadCountries(),
        loadCities(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBuilders = async () => {
    const response = await adminAPI.getBuilders(1, 50);
    if (response.success && response.data) {
      setBuilders(response.data);
      console.log('Builders loaded:', response.data.length);
    }
  };

  const loadCountries = async () => {
    const response = await adminAPI.getCountries();
    if (response.success && response.data) {
      setCountries(response.data);
      console.log('Countries loaded:', response.data.length);
    }
  };

  const loadCities = async () => {
    const response = await adminAPI.getCities();
    if (response.success && response.data) {
      setCities(response.data);
      console.log('Cities loaded:', response.data.length);
    }
  };

  const loadStats = async () => {
    const response = await adminAPI.getStats();
    if (response.success && response.data) {
      setStats(response.data);
      console.log('Stats loaded:', response.data);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleEditBuilder = (builder: ExhibitionBuilder) => {
    setSelectedBuilder(builder);
    setIsEditing(true);
  };

  const handleSaveBuilder = async (updatedBuilder: ExhibitionBuilder) => {
    try {
      const response = await adminAPI.updateBuilder(updatedBuilder.id, updatedBuilder);
      if (response.success) {
        console.log('Builder updated successfully');
        setIsEditing(false);
        setSelectedBuilder(null);
      } else {
        console.error('Failed to update builder:', response.error);
      }
    } catch (error) {
      console.error('Error updating builder:', error);
    }
  };

  const handleDeleteBuilder = async (builderId: string) => {
    if (confirm('Are you sure you want to delete this builder?')) {
      try {
        const response = await adminAPI.deleteBuilder(builderId);
        if (response.success) {
          console.log('Builder deleted successfully');
        } else {
          console.error('Failed to delete builder:', response.error);
        }
      } catch (error) {
        console.error('Error deleting builder:', error);
      }
    }
  };

  const filteredBuilders = builders.filter(builder =>
    builder.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    builder.companyDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading unified dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Unified Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Real-time platform management and control center
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </Button>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Builders</CardTitle>
            <Building className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBuilders || 0}</div>
            <p className="text-xs opacity-90">{stats.verifiedBuilders || 0} verified</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Countries</CardTitle>
            <Globe className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCountries || 0}</div>
            <p className="text-xs opacity-90">Global coverage</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Cities</CardTitle>
            <MapPin className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCities || 0}</div>
            <p className="text-xs opacity-90">Active markets</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Avg Rating</CardTitle>
            <Star className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating?.toFixed(1) || '0.0'}</div>
            <p className="text-xs opacity-90">Platform quality</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Quote Requests</CardTitle>
            <BarChart3 className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuoteRequests || 0}</div>
            <p className="text-xs opacity-90">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="builders">Builders</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="builders" className="space-y-6">
          {/* Builders Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Builder Management</CardTitle>
                  <CardDescription>Manage all exhibition stand builders on the platform</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Bulk Import</span>
                  </Button>
                  <Button className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Builder</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search builders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </div>

              {/* Builders List */}
              <div className="space-y-4">
                {filteredBuilders.map((builder) => (
                  <div key={builder.id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{builder.companyName}</h4>
                        <p className="text-sm text-gray-500">
                          {builder.headquarters.city}, {builder.headquarters.country}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={builder.verified ? 'default' : 'secondary'}>
                            {builder.verified ? 'Verified' : 'Pending'}
                          </Badge>
                          <Badge variant="outline">
                            {builder.rating} ⭐ ({builder.reviewCount} reviews)
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditBuilder(builder)}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit</span>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteBuilder(builder.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredBuilders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No builders found matching your search.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Countries Management */}
            <Card>
              <CardHeader>
                <CardTitle>Countries</CardTitle>
                <CardDescription>Manage country listings and content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {countries.map((country) => (
                    <div key={country.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{country.name}</h4>
                        <p className="text-sm text-gray-500">{country.builderCount} builders</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Country
                </Button>
              </CardContent>
            </Card>

            {/* Cities Management */}
            <Card>
              <CardHeader>
                <CardTitle>Cities</CardTitle>
                <CardDescription>Manage city pages and local content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cities.map((city) => (
                    <div key={city.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{city.name}</h4>
                        <p className="text-sm text-gray-500">{city.country} • {city.builderCount} builders</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add City
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">New builder verified</p>
                      <p className="text-xs text-gray-500">Expo Design Germany - 2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">Quote request pending</p>
                      <p className="text-xs text-gray-500">CES 2025 Las Vegas - 5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Builder registration</p>
                      <p className="text-xs text-gray-500">Premium Exhibits USA - 1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Builder
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Import Data
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Platform Settings
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>Detailed performance metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Analytics dashboard coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure global platform settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Settings panel coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Builder Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Builder</DialogTitle>
            <DialogDescription>
              Update builder information and settings
            </DialogDescription>
          </DialogHeader>
          {selectedBuilder && (
            <BuilderEditForm 
              builder={selectedBuilder} 
              onSave={handleSaveBuilder}
              onCancel={() => setIsEditing(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Builder Edit Form Component
function BuilderEditForm({ 
  builder, 
  onSave, 
  onCancel 
}: { 
  builder: ExhibitionBuilder; 
  onSave: (builder: ExhibitionBuilder) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(builder);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="verified">Verification Status</Label>
          <Select 
            value={formData.verified ? 'verified' : 'pending'}
            onValueChange={(value) => setFormData({ ...formData, verified: value === 'verified' })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Company Description</Label>
        <Textarea
          id="description"
          value={formData.companyDescription}
          onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
}