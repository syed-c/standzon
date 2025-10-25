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
  console.log('🚀 UnifiedBuilderDashboard component rendered! builderId:', builderId);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UnifiedBuilderProfile | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  const [availableCitiesByCountry, setAvailableCitiesByCountry] = useState<Record<string, string[]>>({});

  // Load unified profile data
  useEffect(() => {
    console.log('🔍 UnifiedBuilderDashboard: Component mounted');
    console.log('🔍 builderId in useEffect:', builderId);
    
    // Check authentication with multiple attempts
    const checkAuth = (attempt = 1) => {
      console.log(`🔍 Auth check attempt ${attempt}`);
      
      // Check if user is authenticated
      const currentUser = localStorage.getItem('currentUser');
      console.log('🔍 Debug - currentUser in localStorage:', currentUser);
      
      if (!currentUser) {
        if (attempt < 3) {
          console.log(`⏳ No user data found, retrying in 200ms (attempt ${attempt}/3)`);
          setTimeout(() => checkAuth(attempt + 1), 200);
          return;
        }
        console.log('❌ No authenticated user found after 3 attempts, redirecting to login');
        window.location.href = '/auth/login';
        return;
      }
      
      try {
        const userData = JSON.parse(currentUser);
        console.log('✅ Authenticated user found:', userData);
        console.log('👤 User role:', userData.role);
        console.log('🏢 Company:', userData.companyName);
        console.log('🔐 Is logged in:', userData.isLoggedIn);
        
        // More lenient authentication check
        if (userData.role === 'builder') {
          console.log('✅ Builder user authenticated, loading profile');
          console.log('🚀 About to call loadUnifiedProfile...');
          loadUnifiedProfile();
        } else {
          console.log('❌ Invalid user role, redirecting to login');
          window.location.href = '/auth/login';
        }
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
        if (attempt < 3) {
          console.log(`⏳ Error parsing user data, retrying in 200ms (attempt ${attempt}/3)`);
          setTimeout(() => checkAuth(attempt + 1), 200);
          return;
        }
        window.location.href = '/auth/login';
        return;
      }
    };
    
    // Start authentication check
    checkAuth();
  }, [builderId]);

  // Load country->cities map for selector
  useEffect(() => {
    const loadCities = async () => {
      try {
        const res = await fetch('/api/admin/initialize-locations');
        if (res.ok) {
          const data = await res.json();
          if (data?.success && Array.isArray(data?.data?.countries)) {
            const map: Record<string, string[]> = {};
            for (const c of data.data.countries) {
              const key = c.name || c.countryName || c.country || c.code;
              const list = (c.cities || []).map((x: any) => x.name || x.cityName || x).filter(Boolean);
              if (key) map[key] = list;
            }
            setAvailableCitiesByCountry(map);
          }
        }
      } catch {}
    };
    loadCities();
  }, []);

  const loadUnifiedProfile = async () => {
    console.log('🚀 loadUnifiedProfile function called!');
    setLoading(true);
    console.log('🔄 Loading unified builder profile...');
    
    try {
      // Try to get real user data from various sources
      let userData = null;
      let currentUser = null;
      
      // Check localStorage first
      const storedUserData = localStorage.getItem('builderUserData');
      const storedCurrentUser = localStorage.getItem('currentUser');
      
      if (storedCurrentUser) {
        currentUser = JSON.parse(storedCurrentUser);
        // Use currentUser data as the primary source
        userData = currentUser;
        console.log('✅ Found user data in localStorage (currentUser)');
      } else if (storedUserData) {
        userData = JSON.parse(storedUserData);
        console.log('✅ Found user data in localStorage (builderUserData)');
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
          // Use the admin builders API instead of the individual builder API
          const response = await fetch(`/api/admin/builders?limit=100&prioritize_real=true`);
          const result = await response.json();
          
          if (result.success && result.data?.builders) {
            // Find the builder with matching ID
            const builder = result.data.builders.find((b: any) => b.id === (builderId || newUserId));
            if (builder) {
              userData = builder;
              console.log('✅ Loaded profile from API');
            }
          }
        } catch (apiError) {
          console.log('⚠️ Could not load from API, using stored data');
        }
      }
      
      // Create unified profile structure using real Supabase data
      console.log('🔍 Debug - userData:', userData);
      console.log('🔍 Debug - currentUser:', currentUser);
      
      // Load real data from Supabase
      let supabaseData = null;
      if (userData?.id) {
        try {
          // Use the admin builders API to get real data
          const response = await fetch(`/api/admin/builders?limit=100&prioritize_real=true`);
          const result = await response.json();
          if (result.success && result.data?.builders) {
            // Find the builder with matching ID
            const builder = result.data.builders.find((b: any) => b.id === userData.id);
            if (builder) {
              supabaseData = builder;
              console.log('✅ Loaded real data from Supabase:', supabaseData);
              console.log('🔍 Debug - supabaseData.companyDescription:', supabaseData.companyDescription);
              console.log('🔍 Debug - supabaseData.id:', supabaseData.id);
            } else {
              console.log('❌ Builder not found in Supabase data');
            }
          } else {
            console.log('❌ Failed to load builders from API');
          }
        } catch (error) {
          console.log('⚠️ Could not load from Supabase API:', error);
        }
      } else {
        console.log('❌ No userData.id found:', userData);
      }
      
      if (userData) {
        const unifiedProfile: UnifiedBuilderProfile = {
          id: userData.id || newUserId || 'unified-builder-001',
          companyName: userData.companyName || supabaseData?.company_name || 'My Exhibition Company',
          slug: (userData.companyName || supabaseData?.slug || 'my-exhibition-company').toLowerCase().replace(/[^a-z0-9]/g, '-'),
          contactName: userData.name || supabaseData?.contact_person || 'Business Owner',
          email: userData.email || supabaseData?.primary_email || 'contact@example.com',
          phone: supabaseData?.phone || '+1-555-0123',
          website: supabaseData?.website || '',
          description: (() => {
            let desc = supabaseData?.company_description || 'Professional exhibition stand builder';
            // Remove SERVICE_LOCATIONS JSON from description
            desc = desc.replace(/\n\nSERVICE_LOCATIONS:.*$/g, '');
            desc = desc.replace(/SERVICE_LOCATIONS:.*$/g, '');
            desc = desc.replace(/SERVICE_LOCATIONS:\[.*?\]/g, '');
            desc = desc.replace(/\n\n.*SERVICE_LOCATIONS.*$/g, '');
            desc = desc.replace(/.*SERVICE_LOCATIONS.*$/g, '');
            // Remove any remaining raw data patterns
            desc = desc.replace(/sdfghjl.*$/g, '');
            desc = desc.replace(/testing.*$/g, '');
            desc = desc.replace(/sdfghj.*$/g, '');
            desc = desc.trim();
            return desc || 'Professional exhibition stand builder';
          })(),
          logo: userData.profile?.logo || '/images/builders/default-logo.png',
          
          establishedYear: supabaseData?.established_year || new Date().getFullYear() - 5,
          businessType: 'company',
          teamSize: supabaseData?.team_size || '1-5 employees',
          yearsOfExperience: 5,
          projectsCompleted: supabaseData?.projects_completed || 0,
          
          headquarters: {
            country: supabaseData?.headquarters_country || 'Unknown',
            city: supabaseData?.headquarters_city || 'Unknown',
            address: supabaseData?.headquarters_address || '',
            postalCode: ''
          },
          
          services: userData.services || userData.profile?.services || [
            {
              id: 'service-1',
              name: 'Exhibition Stand Design',
              description: 'Custom designed exhibition stands',
              priceRange: '$300-500/sqm'
            }
          ],
          
          serviceLocations: userData.profile?.serviceLocations || supabaseData?.serviceLocations || (userData.serviceCountries?.map((country: string) => ({
            country,
            cities: userData.serviceCities && userData.serviceCities.length ? userData.serviceCities : (userData.city ? [userData.city] : [])
          })) || []).length > 0 ? (userData.serviceCountries?.map((country: string) => ({
            country,
            cities: userData.serviceCities && userData.serviceCities.length ? userData.serviceCities : (userData.city ? [userData.city] : [])
          })) || []) : (() => {
            // Try to parse from companyDescription field - get the latest entry (fallback)
            if (supabaseData?.companyDescription) {
              console.log('🔍 Debug - companyDescription:', supabaseData.companyDescription);
              const serviceLocationsMatches = supabaseData.companyDescription.match(/SERVICE_LOCATIONS:(\[.*?\])/g);
              console.log('🔍 Debug - serviceLocationsMatches:', serviceLocationsMatches);
              if (serviceLocationsMatches && serviceLocationsMatches.length > 0) {
                // Get the last (most recent) service locations entry
                const lastMatch = serviceLocationsMatches[serviceLocationsMatches.length - 1];
                console.log('🔍 Debug - lastMatch:', lastMatch);
                const jsonMatch = lastMatch.match(/SERVICE_LOCATIONS:(\[.*?\])/);
                if (jsonMatch) {
                  try {
                    const parsed = JSON.parse(jsonMatch[1]);
                    console.log('📍 Loaded service locations from Supabase description:', parsed);
                    return parsed;
                  } catch (e) {
                    console.warn('Failed to parse service locations from description:', e);
                  }
                }
              }
            }
            // Fallback to headquarters
            return [{
              country: supabaseData?.headquarters?.country || 'Unknown',
              cities: supabaseData?.headquarters?.city ? [supabaseData.headquarters.city] : []
            }];
          })(),
          
          specializations: userData.profile?.specializations || userData.specializations || ['Custom Stand Design'],
          
          verified: userData.profile?.verified || userData.emailVerified || false,
          claimed: userData.profile?.claimed || true,
          subscriptionPlan: userData.profile?.subscriptionPlan || 'free',
          subscriptionExpiry: userData.profile?.subscriptionExpiry || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          
          profileViews: supabaseData?.profile_views || 0,
          leadCount: supabaseData?.active_leads || 0,
          responseRate: supabaseData?.response_rate || 0,
          rating: supabaseData?.rating || 0,
          reviewCount: supabaseData?.review_count || 0,
          
          createdAt: userData.registeredAt || new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          source: userData.source || 'registration'
        };
        
        console.log('🔍 Debug - Final unifiedProfile.serviceLocations:', unifiedProfile.serviceLocations);
        console.log('🔍 Debug - Final unifiedProfile:', unifiedProfile);
        
        setProfile(unifiedProfile);
        console.log('✅ Unified profile loaded:', unifiedProfile.companyName);
      } else {
        // Create demo profile for testing
        console.log('⚠️ No user data found. Showing empty profile shell without demo data');
        setProfile({
          id: 'new-builder',
          companyName: '',
          slug: '',
          contactName: '',
          email: '',
          phone: '',
          website: '',
          description: '',
          logo: '/images/builders/default-logo.png',
          establishedYear: new Date().getFullYear(),
          businessType: 'company',
          teamSize: '',
          yearsOfExperience: 0,
          projectsCompleted: 0,
          headquarters: { country: 'Unknown', city: 'Unknown', address: '', postalCode: '' },
          services: [],
          serviceLocations: [],
          specializations: [],
          verified: false,
          claimed: true,
          subscriptionPlan: 'free',
          subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          profileViews: 0,
          leadCount: 0,
          responseRate: 0,
          rating: 0,
          reviewCount: 0,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          source: 'registration'
        });
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
        <Button onClick={() => window.location.href = '/builder/register'} className="bg-red-600 text-white hover:bg-red-700 font-medium">
          Create New Profile
        </Button>
      </div>
    );
  }

  const completeness = getProfileCompleteness();

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative">
        {/* Cover Section */}
        <div className="h-64 bg-gradient-to-r from-red-600 to-red-800 rounded-xl relative overflow-hidden shadow-lg mb-8">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          
          {/* Sync Status Indicator */}
          <div className="absolute top-6 left-6">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
              syncStatus === 'synced' ? 'bg-green-500 text-white' :
              syncStatus === 'syncing' ? 'bg-yellow-500 text-white' :
              'bg-red-500 text-white'
            }`}>
              {syncStatus === 'synced' && <CheckCircle className="h-4 w-4" />}
              {syncStatus === 'syncing' && <RefreshCw className="h-4 w-4 animate-spin" />}
              {syncStatus === 'error' && <AlertCircle className="h-4 w-4" />}
              <span className="capitalize">{syncStatus}</span>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="absolute bottom-6 left-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{profile.companyName}</h1>
            <p className="text-lg opacity-90">{profile.contactName} • {profile.headquarters.city}, {profile.headquarters.country}</p>
          </div>
          
          {/* Plan Badge */}
          <div className="absolute top-6 right-6">
            <Badge className={`text-lg px-4 py-2 font-medium ${
              profile.subscriptionPlan === 'enterprise' ? 'bg-purple-500 text-white' :
              profile.subscriptionPlan === 'professional' ? 'bg-blue-500 text-white' :
              'bg-gray-500 text-white'
            }`}>
              {profile.subscriptionPlan.charAt(0).toUpperCase() + profile.subscriptionPlan.slice(1)} Plan
            </Badge>
          </div>
          
          {/* Quick Actions */}
          <div className="absolute bottom-6 right-6 flex space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white text-red-600 border-white hover:bg-gray-100 font-medium px-4 py-2"
              onClick={() => {
                const publicUrl = `/builders/${profile.slug}`;
                console.log('🔗 Opening public profile:', publicUrl);
                window.open(publicUrl, '_blank');
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Public Profile
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-red-500 text-white border-red-500 hover:bg-red-600 font-medium px-4 py-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Profile Avatar & Status */}
        <div className="flex items-end space-x-6 -mt-20 ml-8 relative z-10 mb-8">
          <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
            <AvatarImage src={profile.logo} />
            <AvatarFallback className="text-4xl bg-red-100 text-red-600 font-bold">
              {profile.companyName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="pb-6">
            <div className="flex items-center space-x-4 mb-4">
              {profile.verified && (
                <Badge className="bg-green-500 text-white px-4 py-2 font-medium text-sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verified
                </Badge>
              )}
              {profile.claimed && (
                <Badge className="bg-blue-500 text-white px-4 py-2 font-medium text-sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Claimed
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-700 font-medium">
              <span className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                {profile.rating.toFixed(1)} ({profile.reviewCount} reviews)
              </span>
              <span className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                {profile.responseRate}% response rate
              </span>
              <span className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                {profile.yearsOfExperience} years experience
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completeness Alert */}
      {completeness < 80 && (
        <Alert className="border-orange-300 bg-orange-100 mb-8">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="flex items-center justify-between">
              <div className="font-medium">
                <strong>Complete your profile ({completeness}%)</strong> - Add missing information to attract more clients and improve your search ranking.
              </div>
              <Button 
                size="sm" 
                onClick={() => setActiveTab('profile')}
                className="ml-4 bg-orange-500 text-white hover:bg-orange-600 font-medium"
              >
                Complete Profile
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Profile Views</CardTitle>
            <Eye className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.profileViews.toLocaleString()}</div>
            <p className="text-xs opacity-90">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Active Leads</CardTitle>
            <Target className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.leadCount}</div>
            <p className="text-xs opacity-90">Available now</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Projects Completed</CardTitle>
            <Award className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.projectsCompleted}</div>
            <p className="text-xs opacity-90">Total projects</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow">
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
        <TabsList className="grid w-full grid-cols-6 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Profile</TabsTrigger>
          <TabsTrigger value="services" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Services</TabsTrigger>
          <TabsTrigger value="locations" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Locations</TabsTrigger>
          <TabsTrigger value="leads" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Leads</TabsTrigger>
          <TabsTrigger value="subscription" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Subscription</TabsTrigger>
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
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
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
                <Button onClick={addService} disabled={saving} className="bg-red-600 text-white hover:bg-red-700 font-medium">
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
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
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
                <Button onClick={addServiceLocation} disabled={saving} className="bg-red-600 text-white hover:bg-red-700 font-medium">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </CardTitle>
              <CardDescription>
                Specify where you provide services to appear in local searches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Show headquarters location from registration */}
              {profile.headquarters.country !== 'Unknown' && (
                <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-800">Headquarters Location</h4>
                    <Badge className="bg-blue-500 text-white">From Registration</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Country</Label>
                      <p className="text-gray-700">{profile.headquarters.country}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">City</Label>
                      <p className="text-gray-700">{profile.headquarters.city}</p>
                    </div>
                  </div>
                </div>
              )}
              
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
                      <Label>Cities</Label>
                      <Select onValueChange={(value) => {
                        const arr = Array.isArray(location.cities) ? [...location.cities] : [];
                        if (!arr.includes(value)) {
                          arr.push(value);
                          updateServiceLocation(index, 'cities', arr);
                        }
                      }}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select city to add" />
                        </SelectTrigger>
                        <SelectContent>
                          {(availableCitiesByCountry[location.country] || []).map((c: string) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {Array.isArray(location.cities) && location.cities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {location.cities.map((c: string) => (
                            <Badge key={c} variant="secondary" className="cursor-pointer" onClick={() => updateServiceLocation(index, 'cities', location.cities.filter((x: string) => x !== c))}>
                              {c} ×
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeServiceLocation(index)}
                      disabled={profile.serviceLocations.length === 1}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
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
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">Learn More About Leads</Button>
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
                {/* Current Plan */}
                <div className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-lg bg-gray-50">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {profile.subscriptionPlan.charAt(0).toUpperCase() + profile.subscriptionPlan.slice(1)} Plan
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Expires: {new Date(profile.subscriptionExpiry).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {profile.subscriptionPlan === 'free' ? 'Limited access to leads' : 'Full access to all features'}
                    </p>
                  </div>
                  <Button 
                    onClick={async () => {
                      try {
                        setSaving(true);
                        const res = await fetch('/api/subscription/upgrade', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            builderId: profile.id, 
                            builderEmail: profile.email, 
                            planId: 'professional' 
                          })
                        });
                        const data = await res.json();
                        if (data?.success) {
                          setProfile({ ...profile, subscriptionPlan: 'professional' });
                          toast.success('Subscription upgraded successfully!');
                        } else {
                          console.error('Upgrade failed', data);
                          toast.error('Failed to upgrade subscription');
                        }
                      } catch (e) {
                        console.error('Upgrade error', e);
                        toast.error('Error upgrading subscription');
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving || profile.subscriptionPlan === 'professional'}
                    className="bg-red-600 text-white hover:bg-red-700 font-medium px-6 py-2"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {saving ? 'Upgrading...' : 'Upgrade Plan'}
                  </Button>
                </div>
                 
                {/* Upgrade Benefits */}
                <Alert className="border-blue-200 bg-blue-50">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <div className="font-medium mb-2">Upgrade to unlock more leads!</div>
                    <ul className="text-sm space-y-1">
                      <li>• Professional plans get 25 lead unlocks per month</li>
                      <li>• Priority listing placement in search results</li>
                      <li>• Advanced analytics and reporting</li>
                      <li>• Direct client communication tools</li>
                    </ul>
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

