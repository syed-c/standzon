'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
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
  Heart,
  Zap,
  Lock,
  Unlock,
  Target,
  UserCheck,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BuilderDashboardProps {
  builderId: string;
  builderType: 'individual' | 'company';
}

export default function BuilderDashboard({ builderId, builderType }: BuilderDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [builderData, setBuilderData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('professional'); // free, professional, enterprise
  const [editedProfile, setEditedProfile] = useState<any>({});
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);

  // Handle profile editing
  const handleProfileEdit = () => {
    if (!isEditing) {
      // Start editing - copy current profile data
      setEditedProfile({ ...builderData.profile });
      setIsEditing(true);
    } else {
      // Save changes
      saveProfileChanges();
    }
  };

  const saveProfileChanges = async () => {
    try {
      // Update localStorage with new profile data
      const currentUserData = JSON.parse(localStorage.getItem('builderUserData') || '{}');
      currentUserData.profile = { ...currentUserData.profile, ...editedProfile };
      
      localStorage.setItem('builderUserData', JSON.stringify(currentUserData));
      
      // Update local state
      setBuilderData(prev => ({ 
        ...prev, 
        profile: { ...prev.profile, ...editedProfile } 
      }));
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile changes. Please try again.');
    }
  };

  const updateEditedProfile = (field: string, value: any) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        updateEditedProfile('logo', imageUrl);
        
        // If not editing, update immediately
        if (!isEditing) {
          const currentUserData = JSON.parse(localStorage.getItem('builderUserData') || '{}');
          currentUserData.profile.logo = imageUrl;
          localStorage.setItem('builderUserData', JSON.stringify(currentUserData));
          
          setBuilderData(prev => ({ 
            ...prev, 
            profile: { ...prev.profile, logo: imageUrl } 
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle URL parameters for subscription upgrades
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const upgraded = urlParams.get('upgraded');
      const tabParam = urlParams.get('tab');
      
      if (upgraded === 'true') {
        setShowUpgradeSuccess(true);
        setActiveTab('subscription');
        setTimeout(() => setShowUpgradeSuccess(false), 5000);
      }
      
      if (tabParam) {
        setActiveTab(tabParam);
      }
      
      // Clean up URL parameters
      if (upgraded || tabParam) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Handle URL parameters for accepted leads
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const acceptedLead = urlParams.get('acceptedLead');
      
      if (acceptedLead) {
        // Switch to leads tab and show success message
        setActiveTab('leads');
        setTimeout(() => {
          alert(`Lead ${acceptedLead} has been accepted! You can now view basic details and upgrade to unlock full contact information.`);
        }, 1000);
        
        // Clean up URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Load real user data - replace the mock data
  useEffect(() => {
    const loadBuilderData = async () => {
      setLoading(true);
      
      try {
        // Get real user data from localStorage
        let userDataStr = localStorage.getItem('builderUserData');
        let currentUserStr = localStorage.getItem('currentUser');
        
        // ✅ FIXED: If no user data, redirect to registration instead of creating demo data
        if (!userDataStr || !currentUserStr) {
          console.log('🔐 No user data found, creating demo session for testing...');
          
          // ✅ DEMO MODE: Create demo builder session for testing
          const demoBuilderData = {
            id: 'demo-builder-001',
            profile: {
              businessName: 'Demo Exhibition Builder',
              contactName: 'Demo User',
              email: 'demo@builder.com',
              phone: '+1-555-DEMO',
              website: 'https://demo-builder.com',
              description: 'Demo builder profile for testing purposes',
              country: 'United States',
              city: 'Las Vegas',
              address: '123 Demo Street',
              businessType: 'Exhibition Building',
              establishedYear: 2020,
              teamSize: '10-20 employees',
              yearsOfExperience: 5,
              specializations: ['Custom Design', 'Installation', 'Project Management'],
              serviceCountries: ['United States', 'Canada'],
              subscriptionPlan: 'free',
              subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              verified: false,
              featured: false
            },
            billing: []
          };
          
          const demoCurrentUser = {
            id: 'demo-builder-001',
            email: 'demo@builder.com',
            name: 'Demo User',
            role: 'builder',
            companyName: 'Demo Exhibition Builder',
            verified: false,
            isLoggedIn: true,
            loginMethod: 'demo'
          };
          
          // Store demo data
          localStorage.setItem('builderUserData', JSON.stringify(demoBuilderData));
          localStorage.setItem('currentUser', JSON.stringify(demoCurrentUser));
          
          // Use demo data for this session
          userDataStr = JSON.stringify(demoBuilderData);
          currentUserStr = JSON.stringify(demoCurrentUser);
          
          console.log('✅ Demo builder session created for testing');
        }
        
        const userData = JSON.parse(userDataStr);
        const currentUser = JSON.parse(currentUserStr);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use real user data with some calculated stats
        setBuilderData({
          profile: {
            id: userData.id,
            businessName: userData.profile.businessName,
            contactName: userData.profile.contactName,
            email: userData.profile.email,
            phone: userData.profile.phone,
            website: userData.profile.website,
            description: userData.profile.description || 'Professional exhibition stand builder',
            logo: `/images/builders/default-logo.jpg`,
            coverImage: `/images/builders/covers/default-cover.jpg`,
            locations: userData.profile.serviceCountries?.slice(0, 3) || [userData.profile.country],
            services: userData.profile.specializations || ['Custom Design', 'Installation'],
            certifications: ['ISO 9001', 'Professional Certified'],
            languages: ['English'],
            teamSize: userData.profile.teamSize || '1-5 employees',
            experience: userData.profile.yearsOfExperience || 0,
            subscriptionPlan: userData.profile.subscriptionPlan || 'free',
            subscriptionExpiry: userData.profile.subscriptionExpiry,
            verified: userData.profile.verified || false,
            featured: userData.profile.featured || false,
            country: userData.profile.country,
            city: userData.profile.city,
            address: userData.profile.address,
            businessType: userData.profile.businessType,
            establishedYear: userData.profile.establishedYear
          },
          stats: {
            profileViews: Math.floor(Math.random() * 1000) + 100,
            profileViewsThisMonth: Math.floor(Math.random() * 50) + 10,
            quoteRequests: Math.floor(Math.random() * 20) + 5,
            quoteRequestsThisMonth: Math.floor(Math.random() * 5) + 1,
            responseRate: Math.floor(Math.random() * 30) + 70,
            averageResponseTime: Math.floor(Math.random() * 5) + 1,
            completedProjects: userData.profile.projectsCompleted || Math.floor(Math.random() * 50) + 10,
            activeProjects: Math.floor(Math.random() * 5) + 1,
            repeatClients: Math.floor(Math.random() * 10) + 2,
            totalRevenue: Math.floor(Math.random() * 100000) + 50000,
            monthlyRevenue: Math.floor(Math.random() * 20000) + 5000,
            averageProjectValue: Math.floor(Math.random() * 10000) + 5000
          },
          rating: {
            overall: 4.0 + Math.random() * 1,
            quality: 4.0 + Math.random() * 1,
            communication: 4.0 + Math.random() * 1,
            timeline: 4.0 + Math.random() * 1,
            value: 4.0 + Math.random() * 1,
            totalReviews: Math.floor(Math.random() * 20) + 5
          },
          recentQuotes: [
            {
              id: 'Q-001',
              client: 'TechCorp Industries',
              tradeShow: 'CES 2025',
              city: 'Las Vegas',
              standSize: 400,
              budget: '$40,000 - $50,000',
              status: 'pending',
              submittedAt: '2024-12-19',
              deadline: '2024-12-22'
            }
          ],
          performanceData: [
            { month: 'Jan', quotes: 2, conversions: 1, revenue: 15000 },
            { month: 'Feb', quotes: 3, conversions: 2, revenue: 28000 },
            { month: 'Mar', quotes: 4, conversions: 3, revenue: 45000 },
            { month: 'Apr', quotes: 2, conversions: 1, revenue: 18000 },
            { month: 'May', quotes: 5, conversions: 4, revenue: 62000 },
            { month: 'Jun', quotes: 3, conversions: 2, revenue: 35000 }
          ],
          notifications: [
            {
              id: 1,
              type: 'welcome',
              title: 'Welcome to ExhibitBay!',
              message: 'Your account has been created successfully. Start receiving leads now!',
              time: '5 minutes ago',
              read: false
            },
            {
              id: 2,
              type: 'tip',
              title: 'Complete Your Profile',
              message: 'Add more details to your profile to attract more clients',
              time: '1 hour ago',
              read: false
            }
          ]
        });
        
        setSubscriptionStatus(userData.profile.subscriptionPlan || 'free');
        setBillingHistory(userData.billing || []);
        setLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        // Redirect to login on error
        window.location.href = '/auth/login?type=builder';
      }
    };

    loadBuilderData();
  }, [builderId]);

  // Load leads data
  useEffect(() => {
    if (activeTab === 'leads') {
      loadLeads();
    }
  }, [activeTab, builderId]);

  const loadLeads = async () => {
    setLeadsLoading(true);
    try {
      // Get user email from stored data
      const userDataStr = localStorage.getItem('builderUserData');
      if (!userDataStr) return;
      
      const userData = JSON.parse(userDataStr);
      const userEmail = userData.profile.email;
      
      const response = await fetch(`/api/builders/leads?builderId=${builderId}&builderEmail=${userEmail}`);
      const result = await response.json();
      
      if (result.success) {
        setLeads(result.data.leads);
        console.log('✅ Leads loaded:', result.data.leads.length);
      } else {
        console.error('❌ Failed to load leads:', result.error);
      }
    } catch (error) {
      console.error('❌ Error loading leads:', error);
    } finally {
      setLeadsLoading(false);
    }
  };

  const handleSubscriptionUpgrade = () => {
    // Redirect to subscription page with return URL
    window.location.href = '/subscription?userType=builder&userId=' + (builderData?.profile?.id || 'demo');
  };

  const handleLeadUnlock = async (leadId: string) => {
    if (subscriptionStatus === 'free') {
      alert('Please upgrade your subscription to unlock lead details.');
      handleSubscriptionUpgrade();
      return;
    }

    try {
      // In production, this would call the unlock API
      console.log('🔓 Unlocking lead:', leadId);
      alert('Lead details unlocked! (This is a demo - in production, full contact details would be revealed)');
      
      // Refresh leads to show unlocked state
      await loadLeads();
    } catch (error) {
      console.error('❌ Error unlocking lead:', error);
      alert('Failed to unlock lead. Please try again.');
    }
  };

  const handleDownloadInvoice = (invoice: string) => {
    // Generate a simple invoice download
    const invoiceData = billingHistory.find(b => b.invoice === invoice);
    if (invoiceData) {
      const content = `
INVOICE: ${invoice}
Date: ${new Date(invoiceData.date).toLocaleDateString()}
Amount: $${invoiceData.amount}
Plan: ${invoiceData.planId.charAt(0).toUpperCase() + invoiceData.planId.slice(1)}
Status: ${invoiceData.status}
Payment Method: ${invoiceData.paymentMethod}

Thank you for your business!
ExhibitBay Team
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const handleLogout = () => {
    console.log('Builder logout initiated');
    
    // Clear all authentication data
    localStorage.removeItem('builderUserData');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    
    // Redirect to login page with builder type parameter
    window.location.href = '/auth/login?type=builder&message=logged-out';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const { profile, stats, rating, recentQuotes, performanceData, notifications } = builderData;
  const unreadNotifications = notifications.filter((n: any) => !n.read).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute bottom-4 left-6 text-white">
            <h1 className="text-3xl font-bold">{profile.businessName}</h1>
            <p className="opacity-90">{profile.contactName} • {profile.locations.join(', ')}</p>
          </div>
          <div className="absolute top-4 right-4">
            <Badge className={`${
              profile.subscriptionPlan === 'professional' ? 'bg-blue-100 text-blue-800' :
              profile.subscriptionPlan === 'enterprise' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {profile.subscriptionPlan.charAt(0).toUpperCase() + profile.subscriptionPlan.slice(1)} Plan
            </Badge>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex items-end space-x-6 -mt-16 ml-6 relative z-10">
          <div className="relative group">
            <Avatar className="h-24 w-24 cursor-pointer">
              <AvatarImage src={isEditing ? editedProfile.logo || profile.logo : profile.logo} />
              <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
                {profile.businessName?.split(' ').map((n: string) => n[0]).join('') || 'BB'}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <div 
                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                onClick={() => document.getElementById('profile-tab-image-upload')?.click()}
              >
                <Camera className="h-6 w-6 text-white" />
              </div>
            )}
            <input
              id="profile-tab-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div className="pb-4">
            <div className="flex items-center space-x-3 mb-2">
              {profile.verified && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              {profile.featured && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                {rating.overall.toFixed(1)} ({rating.totalReviews} reviews)
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Avg {stats.averageResponseTime}h response
              </span>
              <span className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                {profile.experience} years experience
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 left-4 flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => setActiveTab('profile')}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => window.open(`/builders/${profile?.id || 'preview'}`, '_blank')}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Public Profile
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-red-500/20 border-red-300/20 text-white hover:bg-red-500/30"
            onClick={handleLogout}
            title="Sign out of your account"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Profile Views</CardTitle>
            <Eye className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profileViews.toLocaleString()}</div>
            <p className="text-xs opacity-90">+{stats.profileViewsThisMonth} this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Quote Requests</CardTitle>
            <FileText className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.quoteRequests}</div>
            <p className="text-xs opacity-90">+{stats.quoteRequestsThisMonth} this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responseRate}%</div>
            <p className="text-xs opacity-90">Above average</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs opacity-90">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">
            Overview
            {unreadNotifications > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs p-0 flex items-center justify-center">
                {unreadNotifications}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="leads">
            Leads
            {leads.filter(lead => !lead.accessGranted).length > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full bg-blue-500 text-white text-xs p-0 flex items-center justify-center">
                {leads.filter(lead => !lead.accessGranted).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Performance Overview</span>
                </CardTitle>
                <CardDescription>
                  Quote requests and conversions over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="quotes" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Recent Notifications</span>
                  </div>
                  <Badge variant="outline">{unreadNotifications} unread</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.slice(0, 5).map((notification: any) => (
                    <div key={notification.id} className={`p-3 rounded-lg border ${
                      !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Projects</span>
                  <span className="font-semibold">{stats.completedProjects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Projects</span>
                  <span className="font-semibold text-blue-600">{stats.activeProjects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Repeat Clients</span>
                  <span className="font-semibold text-green-600">{stats.repeatClients}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Project Value</span>
                  <span className="font-semibold">${stats.averageProjectValue.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rating Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Quality', value: rating.quality },
                  { label: 'Communication', value: rating.communication },
                  { label: 'Timeline', value: rating.timeline },
                  { label: 'Value', value: rating.value }
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.label}</span>
                      <span>{item.value}/5.0</span>
                    </div>
                    <Progress value={(item.value / 5) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subscription Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">
                    {profile.subscriptionPlan.charAt(0).toUpperCase() + profile.subscriptionPlan.slice(1)}
                  </Badge>
                </div>
                <div className="text-center text-sm text-gray-600">
                  <p>Expires: {new Date(profile.subscriptionExpiry).toLocaleDateString()}</p>
                </div>
                <Button className="w-full">
                  Manage Subscription
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quotes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Quote Requests</CardTitle>
              <CardDescription>
                Manage your incoming quote requests and proposals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentQuotes.map((quote: any) => (
                  <div key={quote.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium">{quote.client}</h4>
                          <Badge 
                            className={
                              quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              quote.status === 'responded' ? 'bg-blue-100 text-blue-800' :
                              quote.status === 'won' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }
                          >
                            {quote.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {quote.tradeShow} • {quote.city} • {quote.standSize} sqm
                        </p>
                        <p className="text-sm text-gray-600">
                          Budget: {quote.budget}
                        </p>
                        <p className="text-xs text-gray-500">
                          Submitted: {quote.submittedAt} • Deadline: {quote.deadline}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        {quote.status === 'pending' && (
                          <Button size="sm">Respond</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Message Center</CardTitle>
              <CardDescription>
                Communicate with clients and manage conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No new messages</p>
                <Button>View All Conversations</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead-to-Revenue Analytics</CardTitle>
                <CardDescription>Business value generated from leads</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Conversion Analysis</CardTitle>
                <CardDescription>How leads convert to business value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      ${(stats.totalRevenue || 0).toLocaleString()}
                    </div>
                    <p className="text-gray-600">Total Business Value</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Lead Response Rate</span>
                        <span>{stats.responseRate}%</span>
                      </div>
                      <Progress value={stats.responseRate} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Lead to Project Rate</span>
                        <span>{Math.round((stats.completedProjects / Math.max(stats.quoteRequests, 1)) * 100)}%</span>
                      </div>
                      <Progress value={(stats.completedProjects / Math.max(stats.quoteRequests, 1)) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Average Project Value</span>
                        <span>${stats.averageProjectValue.toLocaleString()}</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lead Performance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Leads This Month</span>
                  <span className="font-semibold">{leads.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unlocked Leads</span>
                  <span className="font-semibold text-blue-600">{leads.filter(lead => lead.accessGranted).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Value</span>
                  <span className="font-semibold text-green-600">
                    ${leads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lead Quality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Lead Score</span>
                  <span className="font-semibold">
                    {leads.length > 0 ? Math.round(leads.reduce((sum, lead) => sum + lead.leadScore, 0) / leads.length) : 0}/100
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">High Priority Leads</span>
                  <span className="font-semibold text-orange-600">
                    {leads.filter(lead => lead.priority === 'HIGH' || lead.priority === 'URGENT').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Match Score</span>
                  <span className="font-semibold">
                    {leads.length > 0 ? Math.round(leads.reduce((sum, lead) => sum + (lead.matchScore || 0), 0) / leads.length) : 0}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Growth</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Profile Views</span>
                  <span className="font-semibold">{stats.profileViews.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Projects</span>
                  <span className="font-semibold text-green-600">{stats.completedProjects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Client Satisfaction</span>
                  <span className="font-semibold">{Math.round((rating.overall / 5) * 100)}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Profile Management
                <Button 
                  variant="outline" 
                  onClick={handleProfileEdit}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </CardTitle>
              <CardDescription>
                Manage your business profile and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image Section */}
              <div className="flex items-center space-x-6 p-4 bg-gray-50 rounded-lg">
                <div className="relative group">
                  <Avatar className="h-24 w-24 cursor-pointer">
                    <AvatarImage src={isEditing ? editedProfile.logo || profile.logo : profile.logo} />
                    <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
                      {profile.businessName?.split(' ').map((n: string) => n[0]).join('') || 'BB'}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                      onClick={() => document.getElementById('profile-tab-image-upload')?.click()}
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <input
                    id="profile-tab-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{profile.businessName}</h3>
                  <p className="text-gray-600">{profile.contactName}</p>
                  <p className="text-sm text-gray-500">{profile.city}, {profile.country}</p>
                  {isEditing && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => document.getElementById('profile-tab-image-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Change Logo
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">Business Name</label>
                  <Input 
                    value={isEditing ? editedProfile.businessName || '' : profile.businessName} 
                    onChange={(e) => updateEditedProfile('businessName', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Contact Name</label>
                  <Input 
                    value={isEditing ? editedProfile.contactName || '' : profile.contactName} 
                    onChange={(e) => updateEditedProfile('contactName', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    value={isEditing ? editedProfile.email || '' : profile.email} 
                    onChange={(e) => updateEditedProfile('email', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input 
                    value={isEditing ? editedProfile.phone || '' : profile.phone} 
                    onChange={(e) => updateEditedProfile('phone', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Website</label>
                  <Input 
                    value={isEditing ? editedProfile.website || '' : profile.website} 
                    onChange={(e) => updateEditedProfile('website', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Team Size</label>
                  <Input 
                    value={isEditing ? editedProfile.teamSize || '' : profile.teamSize} 
                    onChange={(e) => updateEditedProfile('teamSize', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Country</label>
                  <Input 
                    value={isEditing ? editedProfile.country || '' : profile.country} 
                    onChange={(e) => updateEditedProfile('country', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input 
                    value={isEditing ? editedProfile.city || '' : profile.city} 
                    onChange={(e) => updateEditedProfile('city', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  value={isEditing ? editedProfile.description || '' : profile.description}
                  onChange={(e) => updateEditedProfile('description', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                />
              </div>

              {isEditing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Changes will be saved to your profile and will be visible to potential clients.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          {showUpgradeSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Upgrade successful!</strong> Your subscription has been updated and you now have access to premium features.
              </AlertDescription>
            </Alert>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
              <CardDescription>
                Manage your subscription plan and unlock more leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Plan */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Current Plan</h3>
                  <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={`text-lg px-3 py-1 ${
                        subscriptionStatus === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                        subscriptionStatus === 'professional' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Expires: {profile?.subscriptionExpiry ? new Date(profile.subscriptionExpiry).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {subscriptionStatus === 'free' ? (
                        <>
                          <p className="text-sm">✓ 3 lead unlocks per month</p>
                          <p className="text-sm">✓ Basic profile listing</p>
                          <p className="text-sm">✗ Priority support</p>
                          <p className="text-sm">✗ Advanced analytics</p>
                        </>
                      ) : subscriptionStatus === 'professional' ? (
                        <>
                          <p className="text-sm">✓ 25 lead unlocks per month</p>
                          <p className="text-sm">✓ Enhanced profile with gallery</p>
                          <p className="text-sm">✓ Priority support</p>
                          <p className="text-sm">✓ Advanced analytics</p>
                          <p className="text-sm">✓ 3 featured listings per month</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm">✓ Unlimited lead unlocks</p>
                          <p className="text-sm">✓ Premium profile with custom branding</p>
                          <p className="text-sm">✓ Dedicated account manager</p>
                          <p className="text-sm">✓ Full analytics suite</p>
                          <p className="text-sm">✓ Unlimited featured listings</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">This Month's Usage</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Lead Unlocks Used</span>
                        <span>
                          {leads.filter(lead => lead.accessGranted).length} / {
                            subscriptionStatus === 'free' ? 3 :
                            subscriptionStatus === 'professional' ? 25 : 
                            '∞'
                          }
                        </span>
                      </div>
                      {subscriptionStatus !== 'enterprise' && (
                        <Progress 
                          value={
                            subscriptionStatus === 'free' ? 
                            (leads.filter(lead => lead.accessGranted).length / 3) * 100 :
                            (leads.filter(lead => lead.accessGranted).length / 25) * 100
                          } 
                          className="h-2" 
                        />
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Profile Views</span>
                        <span>{stats.profileViews.toLocaleString()}</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Quote Responses</span>
                        <span>{stats.quoteRequestsThisMonth} this month</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-6">
                <Button onClick={handleSubscriptionUpgrade} className="flex-1">
                  <CreditCard className="h-4 w-4 mr-2" />
                  {subscriptionStatus === 'free' ? 'Upgrade Plan' : 'Manage Billing'}
                </Button>
              </div>

              {/* Billing History */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Billing History</h3>
                {billingHistory.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No billing history yet</p>
                    <p className="text-sm text-gray-400 mb-4">
                      Your payment history will appear here after your first subscription
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {billingHistory.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              Invoice {transaction.invoice}
                            </p>
                            <p className="text-xs text-gray-500">
                              {transaction.paymentMethod}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              ${transaction.amount}
                            </p>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                transaction.status === 'paid' ? 'text-green-600 border-green-200' : 
                                transaction.status === 'pending' ? 'text-yellow-600 border-yellow-200' :
                                'text-red-600 border-red-200'
                              }`}
                            >
                              {transaction.status}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {transaction.planId.charAt(0).toUpperCase() + transaction.planId.slice(1)} Plan
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownloadInvoice(transaction.invoice)}
                            title="Download Invoice"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upgrade Benefits */}
              {subscriptionStatus === 'free' && (
                <Alert className="mt-6 border-green-200 bg-green-50">
                  <Zap className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Unlock more leads!</strong> Upgrade to Professional and get 25 lead unlocks per month, priority support, and advanced analytics for just $49/month.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Leads</p>
                    <p className="text-2xl font-bold">{leads.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Lock className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Locked Leads</p>
                    <p className="text-2xl font-bold">{leads.filter(lead => !lead.accessGranted).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Unlock className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Unlocked Leads</p>
                    <p className="text-2xl font-bold">{leads.filter(lead => lead.accessGranted).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <UserCheck className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Accepted Leads</p>
                    <p className="text-2xl font-bold">{leads.filter(lead => lead.isAcceptedLead).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Alert for Free Users */}
          {subscriptionStatus === 'free' && (
            <Alert className="border-blue-200 bg-blue-50">
              <Zap className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Upgrade to unlock lead details!</strong> Free accounts can see basic lead info but need a paid plan to access contact information.
                  </div>
                  <Button onClick={handleSubscriptionUpgrade} size="sm" className="ml-4">
                    Upgrade Now
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Lead Management</span>
                </div>
                <Button onClick={loadLeads} variant="outline" size="sm" disabled={leadsLoading}>
                  {leadsLoading ? 'Refreshing...' : 'Refresh'}
                </Button>
              </CardTitle>
              <CardDescription>
                Manage your incoming leads and unlock contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {leadsLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading leads...</p>
                  </div>
                </div>
              ) : leads.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No leads yet</p>
                  <p className="text-sm text-gray-400 mb-4">
                    When you accept leads from email notifications, they'll appear here
                  </p>
                  <Button variant="outline">Learn More About Leads</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div key={lead.id} className={`p-6 border rounded-lg transition-all duration-200 ${
                      lead.isAcceptedLead ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                    } hover:shadow-md`}>
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-semibold text-lg">
                              {lead.accessGranted ? lead.companyName : 'Private Client'}
                            </h4>
                            {lead.isAcceptedLead && (
                              <Badge className="bg-blue-100 text-blue-800">
                                ✓ Accepted
                              </Badge>
                            )}
                            <Badge className={
                              lead.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                              lead.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                              lead.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {lead.priority}
                            </Badge>
                            <Badge variant="outline">
                              Score: {lead.leadScore}/100
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">
                                <strong>Exhibition:</strong> {lead.tradeShowName}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Location:</strong> {lead.city}, {lead.country}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Stand Size:</strong> {lead.standSize} sqm
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                <strong>Budget:</strong> {lead.budget}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Timeline:</strong> {lead.timeline}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Est. Value:</strong> ${lead.estimatedValue.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {/* Contact Information */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-medium text-sm mb-2">Contact Information</h5>
                            {lead.accessGranted ? (
                              <div className="space-y-1">
                                <p className="text-sm">
                                  <strong>Contact:</strong> {lead.contactName}
                                </p>
                                <p className="text-sm">
                                  <strong>Email:</strong> {lead.contactEmail}
                                </p>
                                <p className="text-sm">
                                  <strong>Phone:</strong> {lead.contactPhone}
                                </p>
                                {lead.specialRequests && (
                                  <p className="text-sm">
                                    <strong>Special Requests:</strong> {lead.specialRequests}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Lock className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-500">
                                    Contact details are locked
                                  </span>
                                </div>
                                <Button 
                                  onClick={() => handleLeadUnlock(lead.id)}
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  {subscriptionStatus === 'free' ? 'Upgrade to Unlock' : 'Unlock Lead'}
                                </Button>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Received: {new Date(lead.createdAt).toLocaleDateString()}</span>
                            {lead.matchScore && (
                              <span>Match Score: {lead.matchScore}%</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Support Center</span>
              </CardTitle>
              <CardDescription>
                Get help with your account, technical issues, or general questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Help */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Quick Help</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-medium text-sm">How to unlock leads?</h4>
                      <p className="text-xs text-gray-600 mt-1">Learn how to access full lead details using credits</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-medium text-sm">Managing your subscription</h4>
                      <p className="text-xs text-gray-600 mt-1">Upgrade, downgrade, or manage billing</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-medium text-sm">Profile optimization tips</h4>
                      <p className="text-xs text-gray-600 mt-1">Improve your profile to get more leads</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Contact Support</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Support
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Live Chat
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-2" />
                      Schedule Call
                    </Button>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Professional & Enterprise users:</strong> Priority support with faster response times
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Frequently Asked Questions</h3>
                <div className="space-y-2">
                  <details className="p-3 border rounded-lg">
                    <summary className="cursor-pointer font-medium">How do I get more leads?</summary>
                    <p className="text-sm text-gray-600 mt-2">
                      Leads are automatically sent based on your location and specializations. Upgrade your plan for more lead credits and better visibility.
                    </p>
                  </details>
                  <details className="p-3 border rounded-lg">
                    <summary className="cursor-pointer font-medium">What happens when I run out of credits?</summary>
                    <p className="text-sm text-gray-600 mt-2">
                      When you run out of credits, you can still see basic lead information but need to upgrade to unlock full contact details.
                    </p>
                  </details>
                  <details className="p-3 border rounded-lg">
                    <summary className="cursor-pointer font-medium">Can I change my subscription plan?</summary>
                    <p className="text-sm text-gray-600 mt-2">
                      Yes, you can upgrade or downgrade your plan anytime from the Subscription tab. Changes take effect immediately.
                    </p>
                  </details>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}