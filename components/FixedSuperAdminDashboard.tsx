'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, Building, TrendingUp, DollarSign, MessageSquare, Star, Globe, Calendar,
  AlertTriangle, CheckCircle, Clock, Eye, UserPlus, Activity, FileText, CreditCard,
  Settings, Shield, Bell, Search, Filter, Download, RefreshCw, BarChart3, MapPin,
  Zap, Trash2, Upload, Edit, Plus, Save, ExternalLink, Database, HardDrive,
  UserCheck, Mail, Target, CheckSquare, User, ChevronDown, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import WorkingGlobalPagesManager from '@/components/admin/WorkingGlobalPagesManager';

interface FixedSuperAdminDashboardProps {
  adminId: string;
  permissions: string[];
}

export default function FixedSuperAdminDashboard({ adminId, permissions }: FixedSuperAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [builders, setBuilders] = useState<any[]>([]);
  const [globalPagesStats, setGlobalPagesStats] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Website Settings State
  const [websiteSettings, setWebsiteSettings] = useState({
    businessName: 'ExhibitBay',
    logo: '/logo.png',
    email: 'info@exhibitbay.com',
    supportEmail: 'support@exhibitbay.com',
    phone: '+1-555-0123',
    address: '123 Business Street, City, Country',
    socialMedia: {
      facebook: 'https://facebook.com/exhibitbay',
      twitter: 'https://twitter.com/exhibitbay',
      linkedin: 'https://linkedin.com/company/exhibitbay',
      instagram: 'https://instagram.com/exhibitbay'
    }
  });

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setRefreshing(true);
    try {
      // Load builders
      const buildersResponse = await fetch('/api/admin/builders');
      if (buildersResponse.ok) {
        const buildersData = await buildersResponse.json();
        if (buildersData.success) {
          setBuilders(buildersData.data.builders || []);
        }
      }

      // Load global pages stats
      const globalPagesResponse = await fetch('/api/admin/global-pages?action=statistics');
      if (globalPagesResponse.ok) {
        const globalPagesData = await globalPagesResponse.json();
        if (globalPagesData.success) {
          setGlobalPagesStats(globalPagesData.data);
        }
      }

      console.log('✅ Dashboard data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleSaveWebsiteSettings = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would save to your database
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-website-settings',
          settings: websiteSettings
        })
      });

      if (response.ok) {
        toast.success('Website settings saved successfully!');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('❌ Error saving website settings:', error);
      toast.error('Failed to save website settings');
    } finally {
      setLoading(false);
    }
  };

  const handleNotifyBuilder = async (builderId: string, leadId: string) => {
    try {
      const response = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'notify-builder',
          builderId,
          leadId
        })
      });

      if (response.ok) {
        toast.success('Builder notified successfully!');
      } else {
        throw new Error('Failed to notify builder');
      }
    } catch (error) {
      console.error('❌ Error notifying builder:', error);
      toast.error('Failed to notify builder');
    }
  };

  return (
    <div className="flex bg-gray-50 h-screen w-screen">
      {/* Left Sidebar */}
      <div className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl border-r border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Super Admin</h1>
              <p className="text-sm text-slate-300">Control Center</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">System Active</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-4 bg-slate-900 overflow-y-auto">
          {/* Dashboard Overview */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-3">
              DASHBOARD
            </h3>
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === 'overview' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Overview</span>
              </div>
              <Badge className="bg-green-500/20 text-green-300 text-xs border-green-400/30">
                Live
              </Badge>
            </button>
          </div>

          {/* Builder Management */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-3">
              BUILDERS
            </h3>
            
            <button
              onClick={() => setActiveTab('builders')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'builders' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5" />
                <span className="font-medium">Builders</span>
              </div>
              <Badge className="bg-blue-500/20 text-blue-300 text-xs border-blue-400/30">
                {builders.length}
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab('leads-management')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'leads-management' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5" />
                <span className="font-medium">Leads Management</span>
              </div>
              <Badge className="bg-green-500/20 text-green-300 text-xs border-green-400/30">
                New
              </Badge>
            </button>
          </div>

          {/* Platform Management */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-3">
              PLATFORM
            </h3>
            
            <button
              onClick={() => setActiveTab('global-pages')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'global-pages' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5" />
                <span className="font-medium">Global Pages</span>
              </div>
              <Badge className="bg-purple-500/20 text-purple-300 text-xs border-purple-400/30">
                {globalPagesStats?.totalPages || 0}
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab('website-settings')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'website-settings' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5" />
                <span className="font-medium">Website Settings</span>
              </div>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-900">
          <div className="text-center">
            <p className="text-sm text-slate-400">Super Admin Panel</p>
            <p className="text-xs text-slate-500">v2.0</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Building className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {activeTab === 'overview' && 'Dashboard Overview'}
                    {activeTab === 'builders' && 'Builder Management'}
                    {activeTab === 'leads-management' && 'Leads Management'}
                    {activeTab === 'global-pages' && 'Global Pages Manager'}
                    {activeTab === 'website-settings' && 'Website Settings'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {activeTab === 'overview' && 'Platform overview and key metrics'}
                    {activeTab === 'builders' && 'Manage exhibition stand builders'}
                    {activeTab === 'leads-management' && 'Track and manage lead submissions'}
                    {activeTab === 'global-pages' && 'Manage country and city pages'}
                    {activeTab === 'website-settings' && 'Configure website settings and branding'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 text-gray-900"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Total Builders</CardTitle>
                    <Building className="h-4 w-4 opacity-90" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{builders.length}</div>
                    <p className="text-xs opacity-90">Active builders</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Global Pages</CardTitle>
                    <Globe className="h-4 w-4 opacity-90" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{globalPagesStats?.totalPages || 0}</div>
                    <p className="text-xs opacity-90">{globalPagesStats?.countryPages || 0} countries, {globalPagesStats?.cityPages || 0} cities</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Pages with Builders</CardTitle>
                    <CheckCircle className="h-4 w-4 opacity-90" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{globalPagesStats?.pagesWithBuilders || 0}</div>
                    <p className="text-xs opacity-90">Active locations</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Total Builder Listings</CardTitle>
                    <Users className="h-4 w-4 opacity-90" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{globalPagesStats?.totalBuilders || 0}</div>
                    <p className="text-xs opacity-90">Across all locations</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Current platform status and health</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">All Systems Operational</p>
                          <p className="text-sm text-green-700">Platform running smoothly</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-900">Database Connected</p>
                          <p className="text-sm text-blue-700">All data services active</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Connected</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Builders Tab */}
          {activeTab === 'builders' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Builder Management</CardTitle>
                  <CardDescription>Manage exhibition stand builders across all locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {builders.length > 0 ? (
                      <div className="grid gap-4">
                        {builders.slice(0, 10).map((builder, index) => (
                          <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{builder.name}</h3>
                                <p className="text-sm text-gray-600">
                                  {builder.headquarters?.city}, {builder.headquarters?.country}
                                </p>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge variant={builder.verified ? 'default' : 'secondary'}>
                                    {builder.verified ? 'Verified' : 'Unverified'}
                                  </Badge>
                                  <Badge variant="outline">
                                    {builder.source || 'Manual'}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Building className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <p>No builders found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Leads Management Tab */}
          {activeTab === 'leads-management' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Management System</CardTitle>
                  <CardDescription>Track and manage all lead submissions with builder notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-900">Lead Management Features</p>
                          <p className="text-sm text-blue-700">
                            • Track quote requests from hero forms and contact forms<br/>
                            • Manually notify builders if automatic notifications fail<br/>
                            • Monitor builder response rates and lead conversion<br/>
                            • Manage lead routing based on location and builder availability
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Total Leads</p>
                              <p className="text-2xl font-bold text-blue-600">0</p>
                            </div>
                            <MessageSquare className="h-8 w-8 text-blue-600" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Pending Notifications</p>
                              <p className="text-2xl font-bold text-orange-600">0</p>
                            </div>
                            <Bell className="h-8 w-8 text-orange-600" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Responded</p>
                              <p className="text-2xl font-bold text-green-600">0</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p>No leads found</p>
                      <p className="text-sm">Leads will appear here when users submit quote requests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Global Pages Tab */}
          {activeTab === 'global-pages' && (
            <div className="space-y-6">
              <WorkingGlobalPagesManager />
            </div>
          )}

          {/* Website Settings Tab */}
          {activeTab === 'website-settings' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Website Settings</CardTitle>
                  <CardDescription>Configure website branding, contact information, and social media links</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Business Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Business Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                        <Input
                          value={websiteSettings.businessName}
                          onChange={(e) => setWebsiteSettings({...websiteSettings, businessName: e.target.value})}
                          placeholder="Enter business name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                        <Input
                          value={websiteSettings.logo}
                          onChange={(e) => setWebsiteSettings({...websiteSettings, logo: e.target.value})}
                          placeholder="Enter logo URL"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <Input
                          type="email"
                          value={websiteSettings.email}
                          onChange={(e) => setWebsiteSettings({...websiteSettings, email: e.target.value})}
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                        <Input
                          type="email"
                          value={websiteSettings.supportEmail}
                          onChange={(e) => setWebsiteSettings({...websiteSettings, supportEmail: e.target.value})}
                          placeholder="Enter support email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <Input
                          value={websiteSettings.phone}
                          onChange={(e) => setWebsiteSettings({...websiteSettings, phone: e.target.value})}
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <Textarea
                        value={websiteSettings.address}
                        onChange={(e) => setWebsiteSettings({...websiteSettings, address: e.target.value})}
                        placeholder="Enter business address"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Social Media Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                        <Input
                          value={websiteSettings.socialMedia.facebook}
                          onChange={(e) => setWebsiteSettings({
                            ...websiteSettings, 
                            socialMedia: {...websiteSettings.socialMedia, facebook: e.target.value}
                          })}
                          placeholder="Facebook URL"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                        <Input
                          value={websiteSettings.socialMedia.twitter}
                          onChange={(e) => setWebsiteSettings({
                            ...websiteSettings, 
                            socialMedia: {...websiteSettings.socialMedia, twitter: e.target.value}
                          })}
                          placeholder="Twitter URL"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                        <Input
                          value={websiteSettings.socialMedia.linkedin}
                          onChange={(e) => setWebsiteSettings({
                            ...websiteSettings, 
                            socialMedia: {...websiteSettings.socialMedia, linkedin: e.target.value}
                          })}
                          placeholder="LinkedIn URL"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                        <Input
                          value={websiteSettings.socialMedia.instagram}
                          onChange={(e) => setWebsiteSettings({
                            ...websiteSettings, 
                            socialMedia: {...websiteSettings.socialMedia, instagram: e.target.value}
                          })}
                          placeholder="Instagram URL"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <Button onClick={handleSaveWebsiteSettings} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

