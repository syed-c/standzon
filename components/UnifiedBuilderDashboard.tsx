'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { 
  User,
  Building,
  TrendingUp,
  DollarSign,
  MessageSquare,
  Star,
  Eye,
  FileText,
  Calendar,
  Settings,
  Upload,
  Camera,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Save,
  Bell,
  CreditCard,
  BarChart3,
  Users,
  MessageCircle,
  Target,
  UserCheck,
  ExternalLink,
  LogOut,
  Plus,
  Trash2,
  RefreshCw,
  Shield,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { tier1Countries, allCountries } from '@/lib/data/countries';
import EnhancedLeadManagement from './EnhancedLeadManagement';
import SubscriptionManager from './SubscriptionManager';

interface UnifiedBuilderProfile {
  id: string;
  companyName: string;
  slug: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  description: string;
  logo: string;
  
  // Business Details
  establishedYear: number;
  businessType: 'individual' | 'company' | 'partnership';
  teamSize: string;
  yearsOfExperience: number;
  projectsCompleted: number;

  // Location Information
  headquarters: {
    country: string;
    city: string;
    address: string;
    postalCode: string;
  };
  
  // Services & Locations
  services: {
    id: string;
    name: string;
    description: string;
    priceRange: string;
  }[];
  
  serviceLocations: {
    country: string;
    cities: string[];
  }[];
  
  specializations: string[];
  
  // Account Status
  verified: boolean;
  claimed: boolean;
  subscriptionPlan: 'free' | 'professional' | 'enterprise';
  subscriptionExpiry: string;
  
  // Real-time Stats
  profileViews: number;
  leadCount: number;
  responseRate: number;
  rating: number;
  reviewCount: number;
  
  // Meta
  createdAt: string;
  lastUpdated: string;
  source: 'registration' | 'gmb_claim' | 'admin_import';
}

interface UnifiedBuilderDashboardProps {
  builderId?: string;
}

const SPECIALIZATIONS = [
  'Custom Stand Design',
  'Modular Systems', 
  'Portable Displays',
  'Double Deck Stands',
  'Sustainable/Eco Stands',
  'Technology Integration',
  'Interactive Displays',
  'LED & Lighting',
  'Furniture Rental',
  'Graphics & Printing',
  'Installation Services',
  'Project Management'
];

const TEAM_SIZES = [
  '1-5 employees',
  '6-15 employees', 
  '16-30 employees',
  '31-50 employees',
  '51-100 employees',
  '100+ employees'
];

export default function UnifiedBuilderDashboard({ builderId }: UnifiedBuilderDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UnifiedBuilderProfile | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');

  // Load unified profile data
  useEffect(() => {
    loadUnifiedProfile();
  }, [builderId]);

  const loadUnifiedProfile = async () => {
    setLoading(true);
    console.log('🔄 Loading unified builder profile...');
    
    try {
      // Try to get real user data from various sources
      let userData = null;
      let currentUser = null;
      
      // Check localStorage first
      const storedUserData = localStorage.getItem('builderUserData');
      const storedCurrentUser = localStorage.getItem('currentUser');
      
      if (storedUserData && storedCurrentUser) {
        userData = JSON.parse(storedUserData);
        currentUser = JSON.parse(storedCurrentUser);
        console.log('✅ Found user data in localStorage');
      }
      
      // If no stored data, check URL parameters for new signups
      const urlParams = new URLSearchParams(window.location.search);
      const signupSuccess = urlParams.get('signup');
      const newUserId = urlParams.get('id');
      
      if (signupSuccess === 'success' && newUserId) {
        console.log('🎉 New signup detected, loading profile data...');
        // In production, fetch from API using the new user ID
        // For now, create a basic profile structure
      }
      
      // Load real profile data from API if available
      if (builderId || newUserId) {
        try {
          const response = await fetch(`/api/builders/${builderId || newUserId}`);
          const result = await response.json();
          
          if (result.success) {
            userData = result.data;
            console.log('✅ Loaded profile from API');
          }
        } catch (apiError) {
          console.log('⚠️ Could not load from API, using stored data');
        }
      }
      
      // Create unified profile structure
      if (userData) {
        const unifiedProfile: UnifiedBuilderProfile = {
          id: userData.id || newUserId || 'unified-builder-001',
          companyName: userData.profile?.businessName || userData.companyName || 'My Exhibition Company',
          slug: (userData.profile?.businessName || userData.companyName || 'my-exhibition-company').toLowerCase().replace(/[^a-z0-9]/g, '-'),
          contactName: userData.profile?.contactName || userData.contactPersonName || 'Business Owner',
          email: userData.profile?.email || userData.primaryEmail || 'contact@example.com',
          phone: userData.profile?.phone || userData.phoneNumber || '+1-555-0123',
          website: userData.profile?.website || userData.website || '',
          description: userData.profile?.description || userData.companyDescription || 'Professional exhibition stand builder',
          logo: userData.profile?.logo || '/images/builders/default-logo.png',
          
          establishedYear: userData.establishedYear || new Date().getFullYear() - 5,
          businessType: userData.businessType || 'company',
          teamSize: userData.profile?.teamSize || userData.teamSize || '1-5 employees',
          yearsOfExperience: userData.profile?.yearsOfExperience || userData.yearsOfExperience || 5,
          projectsCompleted: userData.profile?.projectsCompleted || userData.projectsCompleted || 25,
          
          headquarters: {
            country: userData.profile?.country || userData.country || 'United States',
            city: userData.profile?.city || userData.city || 'Las Vegas',
            address: userData.profile?.address || userData.address || '123 Business Street',
            postalCode: userData.profile?.postalCode || userData.postalCode || '12345'
          },
          
          services: userData.services || userData.profile?.services || [
            {
              id: 'service-1',
              name: 'Exhibition Stand Design',
              description: 'Custom designed exhibition stands',
              priceRange: '$300-500/sqm'
            }
          ],
          
          serviceLocations: userData.profile?.serviceLocations || userData.serviceCountries?.map((country: string) => ({
            country,
            cities: [userData.profile?.city || userData.city || 'Las Vegas']
          })) || [
            {
              country: 'United States',
              cities: ['Las Vegas', 'Los Angeles']
            }
          ],
          
          specializations: userData.profile?.specializations || userData.specializations || ['Custom Stand Design'],
          
          verified: userData.profile?.verified || userData.emailVerified || false,
          claimed: userData.profile?.claimed || true,
          subscriptionPlan: userData.profile?.subscriptionPlan || 'free',
          subscriptionExpiry: userData.profile?.subscriptionExpiry || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          
          profileViews: Math.floor(Math.random() * 500) + 100,
          leadCount: Math.floor(Math.random() * 10) + 2,
          responseRate: Math.floor(Math.random() * 30) + 70,
          rating: 4.0 + Math.random() * 1,
          reviewCount: Math.floor(Math.random() * 50) + 10,
          
          createdAt: userData.registeredAt || new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          source: userData.source || 'registration'
        };
        
        setProfile(unifiedProfile);
        console.log('✅ Unified profile loaded:', unifiedProfile.companyName);
      } else {
        // Create demo profile for testing
        console.log('⚠️ No user data found, creating demo profile for testing');
        createDemoProfile();
      }
      
    } catch (error) {
      console.error('❌ Error loading profile:', error);
      createDemoProfile();
    } finally {
      setLoading(false);
    }
  };

  const createDemoProfile = () => {
    const demoProfile: UnifiedBuilderProfile = {
      id: 'demo-builder-001',
      companyName: 'Demo Exhibition Builders',
      slug: 'demo-exhibition-builders',
      contactName: 'Demo User',
      email: 'demo@builder.com',
      phone: '+1-555-DEMO',
      website: 'https://demo-builder.com',
      description: 'Demo profile for testing the unified builder dashboard system',
      logo: '/images/builders/default-logo.png',
      
      establishedYear: 2020,
      businessType: 'company',
      teamSize: '10-20 employees',
      yearsOfExperience: 5,
      projectsCompleted: 50,
      
      headquarters: {
        country: 'United States',
        city: 'Las Vegas',
        address: '123 Demo Street',
        postalCode: '89101'
      },
      
      services: [
        {
          id: 'service-1',
          name: 'Custom Exhibition Stands',
          description: 'Fully customized exhibition stands',
          priceRange: '$400-600/sqm'
        }
      ],
      
      serviceLocations: [
        {
          country: 'United States',
          cities: ['Las Vegas', 'Los Angeles', 'New York']
        }
      ],
      
      specializations: ['Custom Stand Design', 'Technology Integration'],
      
      verified: false,
      claimed: true,
      subscriptionPlan: 'free',
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      
      profileViews: 250,
      leadCount: 5,
      responseRate: 85,
      rating: 4.2,
      reviewCount: 18,
      
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      source: 'registration'
    };
    
    setProfile(demoProfile);
  };

  const updateProfile = async (field: keyof UnifiedBuilderProfile, value: any) => {
    if (!profile) return;
    
    setSaving(true);
    setSyncStatus('syncing');
    
    try {
      const updatedProfile = {
        ...profile,
        [field]: value,
        lastUpdated: new Date().toISOString()
      };
      
      setProfile(updatedProfile);
      
      // Save to localStorage
      const builderData = {
        id: updatedProfile.id,
        profile: updatedProfile
      };
      localStorage.setItem('builderUserData', JSON.stringify(builderData));
      
      // Sync to API
      const response = await fetch('/api/admin/builders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          builderId: profile.id,
          updates: { [field]: value }
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSyncStatus('synced');
        toast.success('Profile updated successfully');
        
        // Trigger public profile refresh
        await refreshPublicListing();
      } else {
        console.error('❌ Error updating profile:', result.error);
        setSyncStatus('error');
        toast.error(`Failed to update profile: ${result.error || 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      setSyncStatus('error');
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const refreshPublicListing = async () => {
    try {
      // Force refresh of public listing pages
      await fetch('/api/admin/builders?action=reload');
      console.log('✅ Public listings refreshed');
    } catch (error) {
      console.log('⚠️ Could not refresh public listings:', error);
    }
  };

  const addService = () => {
    if (!profile) return;
    
    const newService = {
      id: `service-${Date.now()}`,
      name: '',
      description: '',
      priceRange: ''
    };
    
    updateProfile('services', [...profile.services, newService]);
  };

  const updateService = (index: number, field: string, value: string) => {
    if (!profile) return;
    
    const updatedServices = profile.services.map((service, i) => 
      i === index ? { ...service, [field]: value } : service
    );
    
    updateProfile('services', updatedServices);
  };

  const removeService = (index: number) => {
    if (!profile) return;
    
    const updatedServices = profile.services.filter((_, i) => i !== index);
    updateProfile('services', updatedServices);
  };

  const addServiceLocation = () => {
    if (!profile) return;
    
    const newLocation = {
      country: '',
      cities: []
    };
    
    updateProfile('serviceLocations', [...profile.serviceLocations, newLocation]);
  };

  const updateServiceLocation = (index: number, field: string, value: any) => {
    if (!profile) return;
    
    const updatedLocations = profile.serviceLocations.map((location, i) => 
      i === index ? { ...location, [field]: value } : location
    );
    
    updateProfile('serviceLocations', updatedLocations);
  };

  const removeServiceLocation = (index: number) => {
    if (!profile) return;
    
    const updatedLocations = profile.serviceLocations.filter((_, i) => i !== index);
    updateProfile('serviceLocations', updatedLocations);
  };

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('builderUserData');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    window.location.href = '/auth/login?type=builder&message=logged-out';
  };

  const getProfileCompleteness = () => {
    if (!profile) return 0;
    
    const checks = [
      !!profile.companyName,
      !!profile.description,
      !!profile.phone,
      !!profile.email,
      !!profile.website,
      profile.services.length > 0,
      profile.serviceLocations.length > 0,
      profile.specializations.length > 0,
      !!profile.headquarters.address,
      profile.verified
    ];
    
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your unified dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
        <p className="text-gray-600 mb-4">Could not load your builder profile.</p>
        <Button onClick={() => window.location.href = '/builder/register'}>
          Create New Profile
        </Button>
      </div>
    );
  }

  const completeness = getProfileCompleteness();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        {/* Cover Section */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          
          {/* Sync Status Indicator */}
          <div className="absolute top-4 left-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              syncStatus === 'synced' ? 'bg-green-100 text-green-800' :
              syncStatus === 'syncing' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {syncStatus === 'synced' && <CheckCircle className="h-3 w-3" />}
              {syncStatus === 'syncing' && <RefreshCw className="h-3 w-3 animate-spin" />}
              {syncStatus === 'error' && <AlertCircle className="h-3 w-3" />}
              <span className="capitalize">{syncStatus}</span>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="absolute bottom-4 left-6 text-white">
            <h1 className="text-3xl font-bold">{profile.companyName}</h1>
            <p className="opacity-90">{profile.contactName} • {profile.headquarters.city}, {profile.headquarters.country}</p>
          </div>
          
          {/* Plan Badge */}
          <div className="absolute top-4 right-4">
            <Badge className={`text-lg px-3 py-1 ${
              profile.subscriptionPlan === 'enterprise' ? 'bg-purple-100 text-purple-800' :
              profile.subscriptionPlan === 'professional' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {profile.subscriptionPlan.charAt(0).toUpperCase() + profile.subscriptionPlan.slice(1)} Plan
            </Badge>
          </div>
          
          {/* Quick Actions */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => window.open(`/builders/${profile.slug}`, '_blank')}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Public Profile
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-red-500/20 border-red-300/20 text-white hover:bg-red-500/30"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Profile Avatar & Status */}
        <div className="flex items-end space-x-6 -mt-16 ml-6 relative z-10">
          <Avatar className="h-24 w-24 border-4 border-white">
            <AvatarImage src={profile.logo} />
            <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
              {profile.companyName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="pb-4">
            <div className="flex items-center space-x-3 mb-2">
              {profile.verified && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              {profile.claimed && (
                <Badge className="bg-blue-100 text-blue-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Claimed
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                {profile.rating.toFixed(1)} ({profile.reviewCount} reviews)
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {profile.responseRate}% response rate
              </span>
              <span className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                {profile.yearsOfExperience} years experience
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completeness Alert */}
      {completeness < 80 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>Complete your profile ({completeness}%)</strong> - Add missing information to attract more clients and improve your search ranking.
              </div>
              <Button 
                size="sm" 
                onClick={() => setActiveTab('profile')}
                className="ml-4"
              >
                Complete Profile
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Profile Views</CardTitle>
            <Eye className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.profileViews.toLocaleString()}</div>
            <p className="text-xs opacity-90">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Active Leads</CardTitle>
            <Target className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.leadCount}</div>
            <p className="text-xs opacity-90">Available now</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Projects Completed</CardTitle>
            <Award className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.projectsCompleted}</div>
            <p className="text-xs opacity-90">Total projects</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.responseRate}%</div>
            <p className="text-xs opacity-90">Above average</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Completeness */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Completeness</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Profile Completion</span>
                    <span>{completeness}%</span>
                  </div>
                  <Progress value={completeness} className="h-2" />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className={`flex items-center space-x-2 ${profile.companyName ? 'text-green-600' : 'text-gray-500'}`}>
                    {profile.companyName ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <span>Company Information</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${profile.services.length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                    {profile.services.length > 0 ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <span>Services ({profile.services.length})</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${profile.serviceLocations.length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                    {profile.serviceLocations.length > 0 ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <span>Service Locations ({profile.serviceLocations.length})</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${profile.verified ? 'text-green-600' : 'text-gray-500'}`}>
                    {profile.verified ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <span>Email Verification</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Profile updated</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">New lead received</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Profile viewed 15 times</p>
                      <p className="text-xs text-gray-500">Today</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Company Profile</span>
                <Button 
                  variant="outline"
                  onClick={() => setEditMode(editMode === 'basic' ? null : 'basic')}
                  disabled={saving}
                >
                  {editMode === 'basic' ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={profile.companyName}
                    onChange={(e) => updateProfile('companyName', e.target.value)}
                    disabled={editMode !== 'basic'}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    value={profile.contactName}
                    onChange={(e) => updateProfile('contactName', e.target.value)}
                    disabled={editMode !== 'basic'}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateProfile('email', e.target.value)}
                    disabled={editMode !== 'basic'}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => updateProfile('phone', e.target.value)}
                    disabled={editMode !== 'basic'}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) => updateProfile('website', e.target.value)}
                    disabled={editMode !== 'basic'}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Select 
                    value={profile.teamSize} 
                    onValueChange={(value) => updateProfile('teamSize', value)}
                    disabled={editMode !== 'basic'}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEAM_SIZES.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Company Description *</Label>
                <Textarea
                  id="description"
                  value={profile.description}
                  onChange={(e) => updateProfile('description', e.target.value)}
                  disabled={editMode !== 'basic'}
                  rows={4}
                  className="mt-1"
                  placeholder="Describe your company, experience, and what makes you unique..."
                />
              </div>
              
              <div>
                <Label>Specializations</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {SPECIALIZATIONS.map((spec) => (
                    <div key={spec} className="flex items-center space-x-2">
                      <Checkbox
                        id={spec}
                        checked={profile.specializations.includes(spec)}
                        onCheckedChange={(checked) => {
                          const updated = checked
                            ? [...profile.specializations, spec]
                            : profile.specializations.filter(s => s !== spec);
                          updateProfile('specializations', updated);
                        }}
                        disabled={editMode !== 'basic'}
                      />
                      <Label htmlFor={spec} className="text-sm cursor-pointer">
                        {spec}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Services Offered</span>
                <Button onClick={addService} disabled={saving}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </CardTitle>
              <CardDescription>
                Define the services you offer to help clients find you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.services.map((service, index) => (
                <div key={`service-${index}`} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <Input
                      placeholder="Service name (e.g., Custom Stand Design)"
                      value={service.name}
                      onChange={(e) => updateService(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="Price range (e.g., $300-500/sqm)"
                      value={service.priceRange}
                      onChange={(e) => updateService(index, 'priceRange', e.target.value)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeService(index)}
                      disabled={profile.services.length === 1}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Service description"
                    value={service.description}
                    onChange={(e) => updateService(index, 'description', e.target.value)}
                    rows={2}
                  />
                </div>
              ))}
              
              {profile.services.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No services added yet</p>
                  <p className="text-sm">Add your first service to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Service Locations</span>
                <Button onClick={addServiceLocation} disabled={saving}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </CardTitle>
              <CardDescription>
                Specify where you provide services to appear in local searches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.serviceLocations.map((location, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <Label>Country</Label>
                      <Select
                        value={location.country}
                        onValueChange={(value) => updateServiceLocation(index, 'country', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {allCountries.map((country) => (
                            <SelectItem key={country.code} value={country.name}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Cities (comma-separated)</Label>
                      <Input
                        placeholder="Las Vegas, Los Angeles, New York"
                        value={location.cities.join(', ')}
                        onChange={(e) => updateServiceLocation(index, 'cities', e.target.value.split(',').map(c => c.trim()))}
                        className="mt-1"
                      />
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeServiceLocation(index)}
                      disabled={profile.serviceLocations.length === 1}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              
              {profile.serviceLocations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No service locations added yet</p>
                  <p className="text-sm">Add locations where you provide services</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Lead Management</span>
              </CardTitle>
              <CardDescription>
                Manage incoming leads and upgrade your plan for more access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No leads available</p>
                <p className="text-sm text-gray-400 mb-4">
                  Leads will appear here when clients request quotes from your service areas
                </p>
                <Button variant="outline">Learn More About Leads</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
              <CardDescription>
                Manage your subscription plan and access to leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{profile.subscriptionPlan.charAt(0).toUpperCase() + profile.subscriptionPlan.slice(1)} Plan</h3>
                    <p className="text-sm text-gray-600">
                      Expires: {new Date(profile.subscriptionExpiry).toLocaleDateString()}
                    </p>
                  </div>
                  <Button>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Button>
                </div>
                 
                <Alert className="border-blue-200 bg-blue-50">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Upgrade to unlock more leads!</strong> Professional plans get 25 lead unlocks per month and priority listing placement.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

