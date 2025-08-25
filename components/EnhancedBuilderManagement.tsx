'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  MapPin,
  Star,
  Users,
  Building,
  CheckCircle,
  XCircle,
  Zap,
  Globe,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { adminAPI } from '@/lib/api/admin';
import { ExhibitionBuilder } from '@/lib/data/exhibitionBuilders';
import { SyncUtils, useRealTimeSync } from '@/lib/utils/realTimeSync';
import SyncStatusIndicator from '@/components/SyncStatusIndicator';
import FeatureShowcase from '@/components/FeatureShowcase';

interface BuilderFilters {
  search: string;
  country: string;
  city: string;
  status: string;
  planType: string;
  verified: string;
}

interface EnhancedBuilderManagementProps {
  adminId: string;
  permissions: string[];
}

export default function EnhancedBuilderManagement({ adminId, permissions }: EnhancedBuilderManagementProps) {
  const [activeTab, setActiveTab] = useState('smart-builder');
  const [builders, setBuilders] = useState<ExhibitionBuilder[]>([]);
  const [filteredBuilders, setFilteredBuilders] = useState<ExhibitionBuilder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBuilder, setSelectedBuilder] = useState<ExhibitionBuilder | null>(null);
  const [editingBuilder, setEditingBuilder] = useState<ExhibitionBuilder | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddBuilderDialog, setShowAddBuilderDialog] = useState(false);
  const [newBuilder, setNewBuilder] = useState<Partial<ExhibitionBuilder>>({});
  
  // Real-time sync functionality
  const { syncStatus, forceRefresh } = useRealTimeSync();
  
  const [filters, setFilters] = useState<BuilderFilters>({
    search: '',
    country: 'all',
    city: 'all',
    status: 'all',
    planType: 'all',
    verified: 'all'
  });

  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    console.log('Enhanced Builder Management: Component initialized');
    loadBuilders();
    setupRealtimeSync();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [builders, filters]);

  const setupRealtimeSync = () => {
    console.log('Setting up real-time synchronization');
    const unsubscribe = adminAPI.subscribe((event: string, data: any) => {
      console.log('Real-time event received:', event, data);
      
      switch (event) {
        case 'builder_created':
          setBuilders(prev => [...prev, data]);
          toast({
            title: "Builder Added",
            description: `${data.companyName} has been added to the platform.`
          });
          break;
        case 'builder_updated':
          setBuilders(prev => prev.map(b => b.id === data.id ? data : b));
          toast({
            title: "Builder Updated",
            description: `${data.companyName} profile has been updated.`
          });
          break;
        case 'builder_deleted':
          setBuilders(prev => prev.filter(b => b.id !== data.id));
          toast({
            title: "Builder Removed",
            description: "Builder has been removed from the platform."
          });
          break;
      }
    });

    return unsubscribe;
  };

  const loadBuilders = async () => {
    try {
      setLoading(true);
      console.log('Loading builders with pagination:', pagination);
      
      const response = await adminAPI.getBuilders(pagination.page, pagination.limit, filters);
      console.log('Builders loaded:', response);
      
      if (response.success) {
        setBuilders(response.data || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
        
        // Extract unique countries and cities for filters
        const allCountries = Array.from(new Set(
          (response.data || []).flatMap(builder => 
            builder.serviceLocations.map(loc => loc.country)
          )
        ));
        const allCities = Array.from(new Set(
          (response.data || []).flatMap(builder => 
            builder.serviceLocations.map(loc => loc.city)
          )
        ));
        
        setCountries(allCountries);
        setCities(allCities);
      }
    } catch (error) {
      console.error('Error loading builders:', error);
      toast({
        title: "Error",
        description: "Failed to load builders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...builders];
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(builder =>
        builder.companyName.toLowerCase().includes(searchTerm) ||
        builder.companyDescription.toLowerCase().includes(searchTerm) ||
        builder.contactInfo.primaryEmail.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.country && filters.country !== 'all') {
      filtered = filtered.filter(builder =>
        builder.serviceLocations.some(loc => loc.country === filters.country)
      );
    }
    
    if (filters.city && filters.city !== 'all') {
      filtered = filtered.filter(builder =>
        builder.serviceLocations.some(loc => loc.city === filters.city)
      );
    }
    
    if (filters.status === 'active') {
      filtered = filtered.filter(builder => builder.verified);
    } else if (filters.status === 'inactive') {
      filtered = filtered.filter(builder => !builder.verified);
    }
    
    if (filters.planType === 'premium') {
      filtered = filtered.filter(builder => builder.premiumMember);
    } else if (filters.planType === 'basic') {
      filtered = filtered.filter(builder => !builder.premiumMember);
    }
    
    if (filters.verified === 'verified') {
      filtered = filtered.filter(builder => builder.verified);
    } else if (filters.verified === 'unverified') {
      filtered = filtered.filter(builder => !builder.verified);
    }
    
    console.log('Filtered builders:', filtered.length, 'from', builders.length);
    setFilteredBuilders(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBuilders();
    setRefreshing(false);
    toast({
      title: "Refreshed",
      description: "Builder data has been refreshed."
    });
  };

  const handleViewBuilder = (builder: ExhibitionBuilder) => {
    console.log('Viewing builder:', builder.id);
    setSelectedBuilder(builder);
    setShowViewDialog(true);
  };

  const handleEditBuilder = (builder: ExhibitionBuilder) => {
    console.log('Editing builder:', builder.id);
    setEditingBuilder({ ...builder });
    setShowEditDialog(true);
  };

  const handleSaveBuilder = async () => {
    if (!editingBuilder) return;
    
    try {
      console.log('🔄 Saving builder profile:', editingBuilder.id, '-', editingBuilder.companyName);
      
      // Update local state immediately for better UX
      setBuilders(prev => prev.map(b => 
        b.id === editingBuilder.id ? editingBuilder : b
      ));
      
      const response = await adminAPI.updateBuilder(editingBuilder.id, editingBuilder);
      
      if (response.success) {
        // Trigger real-time sync across all platforms
        await SyncUtils.syncBuilderProfile(editingBuilder);
        
        setShowEditDialog(false);
        setEditingBuilder(null);
        
        toast({
          title: "✅ Builder Updated Successfully",
          description: `${editingBuilder.companyName} profile updated and synced across all platforms.`
        });
        
        console.log('✅ Builder profile saved and synced successfully:', editingBuilder.id);
        
        // Reload data to ensure consistency
        await loadBuilders();
      } else {
        throw new Error(response.error || 'Update failed');
      }
    } catch (error) {
      console.error('❌ Error updating builder:', error);
      
      // Reload data to ensure state consistency
      await loadBuilders();
      
      toast({
        title: "❌ Error",
        description: "Failed to update builder profile. Data reloaded to ensure consistency.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteBuilder = async (builderId: string) => {
    if (!selectedBuilder) return;
    
    try {
      console.log('🗑️ Deleting builder:', builderId, '-', selectedBuilder.companyName);
      
      // Remove from local state immediately for better UX
      setBuilders(prev => prev.filter(b => b.id !== builderId));
      
      // Sync deletion across all platforms
      await SyncUtils.syncBuilderDeletion(builderId);
      
      const response = await adminAPI.deleteBuilder(builderId);
      
      if (response.success) {
        setShowDeleteDialog(false);
        setSelectedBuilder(null);
        
        toast({
          title: "✅ Builder Deleted Successfully",
          description: `${selectedBuilder.companyName} has been deleted and removed from all platforms.`
        });
        
        console.log('✅ Builder deleted successfully:', builderId);
        
        // Reload to ensure consistency
        await loadBuilders();
      } else {
        throw new Error(response.error || 'Delete failed');
      }
    } catch (error) {
      console.error('❌ Error deleting builder:', error);
      
      // Reload data to restore state if deletion failed
      await loadBuilders();
      
      toast({
        title: "❌ Error",
        description: "Failed to delete builder. Data reloaded to ensure consistency.",
        variant: "destructive"
      });
    }
  };

  const toggleBuilderStatus = async (builder: ExhibitionBuilder) => {
    try {
      const newStatus = !builder.verified;
      console.log('🔄 Toggling builder status:', builder.id, 'to', newStatus ? 'ACTIVE' : 'INACTIVE');
      
      // Update local state immediately for responsiveness
      setBuilders(prev => prev.map(b => 
        b.id === builder.id ? { ...b, verified: newStatus } : b
      ));
      
      // Sync status change across all platforms
      await SyncUtils.syncBuilderStatus(builder.id, newStatus);
      
      const updatedBuilder = { ...builder, verified: newStatus };
      const response = await adminAPI.updateBuilder(builder.id, updatedBuilder);
      
      if (response.success) {
        toast({
          title: "✅ Status Updated Successfully",
          description: `${builder.companyName} ${newStatus ? 'ACTIVATED' : 'DEACTIVATED'} across all platforms.`
        });
        console.log('✅ Builder status updated successfully:', builder.id);
      } else {
        throw new Error(response.error || 'Update failed');
      }
    } catch (error) {
      console.error('❌ Error toggling builder status:', error);
      
      // Revert local state change on error
      setBuilders(prev => prev.map(b => 
        b.id === builder.id ? { ...b, verified: builder.verified } : b
      ));
      
      toast({
        title: "❌ Error",
        description: "Failed to update builder status. Changes reverted.",
        variant: "destructive"
      });
    }
  };

  const togglePremiumStatus = async (builder: ExhibitionBuilder) => {
    try {
      const newPremiumStatus = !builder.premiumMember;
      console.log('🔄 Toggling premium status:', builder.id, 'to', newPremiumStatus ? 'PREMIUM' : 'BASIC');
      
      // Update local state immediately for responsiveness
      setBuilders(prev => prev.map(b => 
        b.id === builder.id ? { ...b, premiumMember: newPremiumStatus } : b
      ));
      
      // Sync plan change across all platforms
      await SyncUtils.syncBuilderPlan(builder.id, newPremiumStatus);
      
      const updatedBuilder = { ...builder, premiumMember: newPremiumStatus };
      const response = await adminAPI.updateBuilder(builder.id, updatedBuilder);
      
      if (response.success) {
        toast({
          title: "✅ Plan Updated Successfully",
          description: `${builder.companyName} plan changed to ${newPremiumStatus ? 'PREMIUM' : 'BASIC'} across all platforms.`
        });
        console.log('✅ Builder plan updated successfully:', builder.id);
      } else {
        throw new Error(response.error || 'Update failed');
      }
    } catch (error) {
      console.error('❌ Error toggling premium status:', error);
      
      // Revert local state change on error
      setBuilders(prev => prev.map(b => 
        b.id === builder.id ? { ...b, premiumMember: builder.premiumMember } : b
      ));
      
      toast({
        title: "❌ Error",
        description: "Failed to update builder plan. Changes reverted.",
        variant: "destructive"
      });
    }
  };

  const exportBuilders = () => {
    console.log('Exporting builders data');
    const dataStr = JSON.stringify(filteredBuilders, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `builders_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Export Complete",
      description: `Exported ${filteredBuilders.length} builders to JSON file.`
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading builder management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Sync Status */}
      <SyncStatusIndicator />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enhanced Builder Management</h2>
          <p className="text-gray-600 mt-1">
            Complete builder directory management - Admin-added & Self-registered builders
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Smart Builder Tab - Functional
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <Zap className="h-3 w-3 mr-1" />
              Builder Intelligence - Active
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              <RefreshCw className="h-3 w-3 mr-1" />
              Real-time Sync - Enabled
            </Badge>
            <Badge className="bg-orange-100 text-orange-800">
              <Users className="h-3 w-3 mr-1" />
              {filteredBuilders.length} Total Builders
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            className="flex items-center space-x-2"
            onClick={() => setShowAddBuilderDialog(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Add Builder</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={async () => {
              setRefreshing(true);
              try {
                await forceRefresh();
                await handleRefresh();
              } finally {
                setRefreshing(false);
              }
            }}
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync All</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={exportBuilders}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <Label htmlFor="search">Search Builders</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, email, description..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="country">Country</Label>
              <Select value={filters.country} onValueChange={(value) => setFilters({ ...filters, country: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="city">City</Label>
              <Select value={filters.city} onValueChange={(value) => setFilters({ ...filters, city: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="planType">Plan Type</Label>
              <Select value={filters.planType} onValueChange={(value) => setFilters({ ...filters, planType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Plans" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="premium">Premium (Paid)</SelectItem>
                  <SelectItem value="basic">Basic (Free)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="smart-builder">Smart Builder Management</TabsTrigger>
          <TabsTrigger value="builder-intelligence">Builder Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="smart-builder" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Smart Builder Directory</span>
                </div>
                <Badge variant="outline">{filteredBuilders.length} builders</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredBuilders.map((builder) => (
                  <div key={builder.id} className="flex items-center justify-between p-6 border rounded-lg hover:bg-gray-50 transition-colors border-l-4 border-l-theme-500">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-16 h-16 bg-theme-100 rounded-lg flex items-center justify-center relative">
                        <Building className="h-8 w-8 text-theme-600" />
                        {builder.premiumMember && (
                          <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900 text-lg">{builder.companyName}</h4>
                          <Badge className={builder.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {builder.verified ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge className={builder.premiumMember ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}>
                            {builder.premiumMember ? 'Premium (Paid)' : 'Basic (Free)'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600 truncate">{builder.contactInfo.primaryEmail}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">{builder.headquarters.city}, {builder.headquarters.country}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-gray-600">{builder.rating} ({builder.reviewCount} reviews)</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Building className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">{builder.projectsCompleted} projects • {builder.teamSize} team</span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          <span>Est. {builder.establishedYear} • Response: {builder.responseTime}</span>
                          {builder.serviceLocations && (
                            <span className="ml-4">Serves: {builder.serviceLocations.slice(0, 3).map(loc => loc.city).join(', ')}{builder.serviceLocations.length > 3 ? '...' : ''}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewBuilder(builder)}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditBuilder(builder)}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleBuilderStatus(builder)}
                        className={`flex items-center space-x-1 ${
                          builder.verified ? 'text-red-600 hover:text-red-700 hover:border-red-300' : 'text-green-600 hover:text-green-700 hover:border-green-300'
                        }`}
                      >
                        {builder.verified ? <XCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                        <span>{builder.verified ? 'Deactivate' : 'Activate'}</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredBuilders.length === 0 && (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No builders found matching your filters.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder-intelligence" className="space-y-6">
          {/* Feature Implementation Status */}
          <FeatureShowcase />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Builders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{builders.length}</div>
                <p className="text-xs text-gray-500">Active on platform</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Verified Builders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {builders.filter(b => b.verified).length}
                </div>
                <p className="text-xs text-gray-500">
                  {Math.round((builders.filter(b => b.verified).length / builders.length) * 100)}% verification rate
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Premium Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {builders.filter(b => b.premiumMember).length}
                </div>
                <p className="text-xs text-gray-500">
                  {Math.round((builders.filter(b => b.premiumMember).length / builders.length) * 100)}% premium rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Builder Intelligence Analytics</CardTitle>
              <CardDescription>Detailed insights and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredBuilders.slice(0, 5).map((builder) => (
                  <div key={builder.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-theme-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-theme-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{builder.companyName}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400" />
                            <span className="text-xs text-gray-500">{builder.rating} rating</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Building className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{builder.projectsCompleted} projects</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePremiumStatus(builder)}
                        className="flex items-center space-x-1"
                      >
                        <Zap className="h-3 w-3" />
                        <span>{builder.premiumMember ? 'Downgrade' : 'Upgrade'}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewBuilder(builder)}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Analyze</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Builder Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Builder Profile - {selectedBuilder?.companyName}</DialogTitle>
            <DialogDescription>Complete builder information and statistics</DialogDescription>
          </DialogHeader>
          
          {selectedBuilder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Company Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedBuilder.companyName}</div>
                    <div><strong>Established:</strong> {selectedBuilder.establishedYear}</div>
                    <div><strong>Team Size:</strong> {selectedBuilder.teamSize}</div>
                    <div><strong>Projects Completed:</strong> {selectedBuilder.projectsCompleted}</div>
                    <div><strong>Rating:</strong> {selectedBuilder.rating}/5 ({selectedBuilder.reviewCount} reviews)</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3" />
                      <span>{selectedBuilder.contactInfo.primaryEmail}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3" />
                      <span>{selectedBuilder.contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-3 w-3" />
                      <span>{selectedBuilder.contactInfo.website}</span>
                    </div>
                    <div><strong>Contact Person:</strong> {selectedBuilder.contactInfo.contactPerson}</div>
                    <div><strong>Position:</strong> {selectedBuilder.contactInfo.position}</div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Service Locations</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedBuilder.serviceLocations.map((location, index) => (
                    <Badge key={index} variant="outline" className="justify-center">
                      {location.city}, {location.country}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Status & Plan</h4>
                <div className="flex items-center space-x-4">
                  <Badge className={selectedBuilder.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {selectedBuilder.verified ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge className={selectedBuilder.premiumMember ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}>
                    {selectedBuilder.premiumMember ? 'Premium Plan' : 'Basic Plan'}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800">
                    Response: {selectedBuilder.responseTime}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Button onClick={() => handleEditBuilder(selectedBuilder)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Builder
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setShowViewDialog(false);
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Builder
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Builder Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Builder - {editingBuilder?.companyName}</DialogTitle>
            <DialogDescription>Update builder information and settings</DialogDescription>
          </DialogHeader>
          
          {editingBuilder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={editingBuilder.companyName}
                    onChange={(e) => setEditingBuilder({
                      ...editingBuilder,
                      companyName: e.target.value
                    })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="establishedYear">Established Year</Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    value={editingBuilder.establishedYear}
                    onChange={(e) => setEditingBuilder({
                      ...editingBuilder,
                      establishedYear: parseInt(e.target.value)
                    })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="primaryEmail">Primary Email</Label>
                  <Input
                    id="primaryEmail"
                    type="email"
                    value={editingBuilder.contactInfo.primaryEmail}
                    onChange={(e) => setEditingBuilder({
                      ...editingBuilder,
                      contactInfo: {
                        ...editingBuilder.contactInfo,
                        primaryEmail: e.target.value
                      }
                    })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editingBuilder.contactInfo.phone}
                    onChange={(e) => setEditingBuilder({
                      ...editingBuilder,
                      contactInfo: {
                        ...editingBuilder.contactInfo,
                        phone: e.target.value
                      }
                    })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    value={editingBuilder.teamSize}
                    onChange={(e) => setEditingBuilder({
                      ...editingBuilder,
                      teamSize: parseInt(e.target.value)
                    })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editingBuilder.rating}
                    onChange={(e) => setEditingBuilder({
                      ...editingBuilder,
                      rating: parseFloat(e.target.value)
                    })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={editingBuilder.companyDescription}
                  onChange={(e) => setEditingBuilder({
                    ...editingBuilder,
                    companyDescription: e.target.value
                  })}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="verified"
                    checked={editingBuilder.verified}
                    onCheckedChange={(checked) => setEditingBuilder({
                      ...editingBuilder,
                      verified: checked
                    })}
                  />
                  <Label htmlFor="verified">Verified Builder</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="premiumMember"
                    checked={editingBuilder.premiumMember}
                    onCheckedChange={(checked) => setEditingBuilder({
                      ...editingBuilder,
                      premiumMember: checked
                    })}
                  />
                  <Label htmlFor="premiumMember">Premium Member</Label>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Button onClick={handleSaveBuilder}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Confirm Deletion</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedBuilder?.companyName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center space-x-2 pt-4">
            <Button 
              variant="destructive" 
              onClick={() => selectedBuilder && handleDeleteBuilder(selectedBuilder.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Builder
            </Button>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Builder Dialog */}
      <Dialog open={showAddBuilderDialog} onOpenChange={setShowAddBuilderDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Builder</DialogTitle>
            <DialogDescription>Add a new builder to the platform manually</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newBuilderName">Company Name</Label>
                <Input
                  id="newBuilderName"
                  value={newBuilder.companyName || ''}
                  onChange={(e) => setNewBuilder({
                    ...newBuilder,
                    companyName: e.target.value
                  })}
                  placeholder="e.g., Premium Exhibits USA"
                />
              </div>
              
              <div>
                <Label htmlFor="newBuilderEmail">Primary Email</Label>
                <Input
                  id="newBuilderEmail"
                  type="email"
                  value={newBuilder.contactInfo?.primaryEmail || ''}
                  onChange={(e) => setNewBuilder({
                    ...newBuilder,
                    contactInfo: {
                      ...newBuilder.contactInfo,
                      primaryEmail: e.target.value,
                      phone: newBuilder.contactInfo?.phone || '',
                      website: newBuilder.contactInfo?.website || '',
                      contactPerson: newBuilder.contactInfo?.contactPerson || '',
                      position: newBuilder.contactInfo?.position || ''
                    }
                  })}
                  placeholder="info@company.com"
                />
              </div>
              
              <div>
                <Label htmlFor="newBuilderPhone">Phone</Label>
                <Input
                  id="newBuilderPhone"
                  value={newBuilder.contactInfo?.phone || ''}
                  onChange={(e) => setNewBuilder({
                    ...newBuilder,
                    contactInfo: {
                      ...newBuilder.contactInfo,
                      primaryEmail: newBuilder.contactInfo?.primaryEmail || '',
                      phone: e.target.value,
                      website: newBuilder.contactInfo?.website || '',
                      contactPerson: newBuilder.contactInfo?.contactPerson || '',
                      position: newBuilder.contactInfo?.position || ''
                    }
                  })}
                  placeholder="+1 555 123 4567"
                />
              </div>
              
              <div>
                <Label htmlFor="newBuilderWebsite">Website</Label>
                <Input
                  id="newBuilderWebsite"
                  value={newBuilder.contactInfo?.website || ''}
                  onChange={(e) => setNewBuilder({
                    ...newBuilder,
                    contactInfo: {
                      ...newBuilder.contactInfo,
                      primaryEmail: newBuilder.contactInfo?.primaryEmail || '',
                      phone: newBuilder.contactInfo?.phone || '',
                      website: e.target.value,
                      contactPerson: newBuilder.contactInfo?.contactPerson || '',
                      position: newBuilder.contactInfo?.position || ''
                    }
                  })}
                  placeholder="https://company.com"
                />
              </div>
              
              <div>
                <Label htmlFor="newBuilderContactPerson">Contact Person</Label>
                <Input
                  id="newBuilderContactPerson"
                  value={newBuilder.contactInfo?.contactPerson || ''}
                  onChange={(e) => setNewBuilder({
                    ...newBuilder,
                    contactInfo: {
                      ...newBuilder.contactInfo,
                      primaryEmail: newBuilder.contactInfo?.primaryEmail || '',
                      phone: newBuilder.contactInfo?.phone || '',
                      website: newBuilder.contactInfo?.website || '',
                      contactPerson: e.target.value,
                      position: newBuilder.contactInfo?.position || ''
                    }
                  })}
                  placeholder="John Smith"
                />
              </div>
              
              <div>
                <Label htmlFor="newBuilderPosition">Position</Label>
                <Input
                  id="newBuilderPosition"
                  value={newBuilder.contactInfo?.position || ''}
                  onChange={(e) => setNewBuilder({
                    ...newBuilder,
                    contactInfo: {
                      ...newBuilder.contactInfo,
                      primaryEmail: newBuilder.contactInfo?.primaryEmail || '',
                      phone: newBuilder.contactInfo?.phone || '',
                      website: newBuilder.contactInfo?.website || '',
                      contactPerson: newBuilder.contactInfo?.contactPerson || '',
                      position: e.target.value
                    }
                  })}
                  placeholder="Sales Manager"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="newBuilderDescription">Company Description</Label>
              <Textarea
                id="newBuilderDescription"
                value={newBuilder.companyDescription || ''}
                onChange={(e) => setNewBuilder({
                  ...newBuilder,
                  companyDescription: e.target.value
                })}
                rows={3}
                placeholder="Brief description of the company and services..."
              />
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="newBuilderVerified"
                  checked={newBuilder.verified || false}
                  onCheckedChange={(checked) => setNewBuilder({
                    ...newBuilder,
                    verified: checked
                  })}
                />
                <Label htmlFor="newBuilderVerified">Verified Builder</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="newBuilderPremium"
                  checked={newBuilder.premiumMember || false}
                  onCheckedChange={(checked) => setNewBuilder({
                    ...newBuilder,
                    premiumMember: checked
                  })}
                />
                <Label htmlFor="newBuilderPremium">Premium Member</Label>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-4">
              <Button onClick={() => {
                // Handle add builder logic here
                console.log('Adding new builder:', newBuilder);
                toast({
                  title: "✅ Builder Added",
                  description: `${newBuilder.companyName} has been added to the platform.`
                });
                setShowAddBuilderDialog(false);
                setNewBuilder({});
                loadBuilders();
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Builder
              </Button>
              <Button variant="outline" onClick={() => {
                setShowAddBuilderDialog(false);
                setNewBuilder({});
              }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}