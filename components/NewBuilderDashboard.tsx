'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building, 
  MapPin, 
  Target, 
  CreditCard, 
  Edit, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Eye,
  Star,
  Users,
  TrendingUp,
  Globe,
  Phone,
  Mail,
  Globe as Website,
  Calendar,
  DollarSign,
  MapPin as Location,
  Settings,
  Camera
} from 'lucide-react';
import { GLOBAL_EXHIBITION_DATA } from '@/lib/data/globalCities';

interface BuilderProfile {
  id: string;
  companyName: string;
  slug: string;
  logo: string;
  description: string;
  establishedYear: number;
  teamSize: number;
  projectsCompleted: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  claimed: boolean;
  headquarters: {
    city: string;
    country: string;
    address: string;
  };
  contactInfo: {
    primaryEmail: string;
    phone: string;
    website: string;
    contactPerson: string;
    position: string;
  };
  serviceLocations: {
    country: string;
    cities: string[];
  }[];
  services: {
    id: string;
    name: string;
    description: string;
    priceRange: string;
    locations: string[];
  }[];
  subscriptionPlan?: 'free' | 'professional' | 'enterprise';
  subscriptionExpiry?: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  projectDetails: string;
  budget: string;
  timeline: string;
  location: string;
  source: 'form' | 'direct';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
}

interface NewBuilderDashboardProps {
  builderId?: string;
}

export default function NewBuilderDashboard({ builderId }: NewBuilderDashboardProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<BuilderProfile | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category: 'CUSTOM_DESIGN',
    priceFrom: '',
    currency: 'USD',
    unit: 'per project'
  });
  const [newLocation, setNewLocation] = useState({
    country: '',
    cities: [] as string[]
  });
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [showPortfolioUpload, setShowPortfolioUpload] = useState(false);
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: '',
    description: '',
    imageUrl: '',
    projectYear: new Date().getFullYear(),
    tradeShow: '',
    client: '',
    standSize: 0
  });
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [upgrading, setUpgrading] = useState(false);
  const [currentBuilderId, setCurrentBuilderId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [profileViews, setProfileViews] = useState(0);
  const [monthlyViews, setMonthlyViews] = useState(0);

  // Get builder ID from authenticated user
  useEffect(() => {
    const getBuilderId = () => {
      try {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          console.log('🔍 Authenticated user data:', userData);
          
          if (userData.role === 'builder' && userData.id) {
            console.log('✅ Builder ID found in localStorage:', userData.id);
            setCurrentBuilderId(userData.id);
            return userData.id;
          }
        }
      } catch (error) {
        console.error('❌ Error getting builder ID from localStorage:', error);
      }
      
      // Fallback to prop if provided
      if (builderId) {
        console.log('⚠️ Using fallback builder ID from prop:', builderId);
        setCurrentBuilderId(builderId);
        return builderId;
      }
      
      console.error('❌ No builder ID found in localStorage or props');
      return null;
    };

    const id = getBuilderId();
             if (id) {
               console.log('🚀 Loading dashboard data for builder ID:', id);
               loadBuilderProfile(id);
               loadLeads(id);
               loadServices(id);
               loadAnalytics(id);
             } else {
      console.error('❌ Cannot load dashboard without builder ID');
      setLoading(false);
    }
  }, [builderId]);

  const loadBuilderProfile = async (id?: string) => {
    const builderIdToUse = id || currentBuilderId;
    if (!builderIdToUse) {
      console.error('❌ No builder ID available for loading profile');
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Loading profile for builder:', builderIdToUse);
      setLoading(true);
      const response = await fetch(`/api/builder/dashboard?builderId=${builderIdToUse}&t=${Date.now()}`);
      const data = await response.json();
      
      console.log('📊 Profile API response:', data);
      
      if (data.success && data.data) {
        console.log('✅ Profile data loaded successfully:', data.data);
        setProfile(data.data);
        setLeads(data.data.leads || []);
        setPortfolio(data.data.portfolio || []);
      } else {
        console.log('⚠️ No profile data in response:', data);
      }
    } catch (error) {
      console.error('❌ Error loading builder profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeads = async (id?: string) => {
    const builderIdToUse = id || currentBuilderId;
    if (!builderIdToUse) {
      console.error('❌ No builder ID available for loading leads');
      return;
    }

    try {
      const response = await fetch(`/api/builder/leads?builderId=${builderIdToUse}`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        setLeads(data.data);
      } else {
        // Generate sample leads for demonstration
        const sampleLeads = [
          {
            id: '1',
            name: 'John Smith',
            email: 'john@example.com',
            phone: '+1-555-0123',
            company: 'Tech Corp',
            projectDetails: 'Exhibition stand for tech conference',
            budget: '$10,000 - $15,000',
            timeline: '2-3 months',
            location: 'New York',
            source: 'form' as const,
            status: 'pending' as const,
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            phone: '+1-555-0456',
            company: 'Marketing Inc',
            projectDetails: 'Custom booth design for trade show',
            budget: '$5,000 - $8,000',
            timeline: '1 month',
            location: 'Los Angeles',
            source: 'direct' as const,
            status: 'approved' as const,
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '3',
            name: 'Mike Wilson',
            email: 'mike@example.com',
            phone: '+1-555-0789',
            company: 'StartupXYZ',
            projectDetails: 'Modular exhibition system',
            budget: '$3,000 - $5,000',
            timeline: '3 weeks',
            location: 'Chicago',
            source: 'form' as const,
            status: 'completed' as const,
            createdAt: new Date(Date.now() - 172800000).toISOString()
          }
        ];
        setLeads(sampleLeads);
      }
    } catch (error) {
      console.error('Error loading leads:', error);
    }
  };

  const loadServices = async (id?: string) => {
    const builderIdToUse = id || currentBuilderId;
    if (!builderIdToUse) {
      console.error('❌ No builder ID available for loading services');
      return;
    }

    try {
      console.log('🔄 Loading services for builder:', builderIdToUse);
      const response = await fetch(`/api/builder/services?builderId=${builderIdToUse}&t=${Date.now()}`);
      const data = await response.json();
      
      console.log('📊 Services API response:', data);
      
      if (data.success && data.data) {
        console.log('✅ Services loaded successfully:', data.data);
        setServices(data.data);
      } else {
        console.log('⚠️ No services data in response:', data);
        setServices([]);
      }
    } catch (error) {
      console.error('❌ Error loading services:', error);
    }
  };

  const loadAnalytics = async (id?: string) => {
    const builderIdToUse = id || currentBuilderId;
    if (!builderIdToUse) {
      console.log('❌ No builder ID for analytics');
      return;
    }

    try {
      console.log('📊 Loading analytics for builder:', builderIdToUse);
      
      // Fetch real profile view data
      const response = await fetch(`/api/analytics/profile-view?builderId=${builderIdToUse}&t=${Date.now()}`);
      console.log('📊 Analytics API response status:', response.status);
      
      const data = await response.json();
      console.log('📊 Analytics API response data:', data);
      
      if (data.success && data.data) {
        setProfileViews(data.data.totalViews || 0);
        setMonthlyViews(data.data.monthlyViews || 0);
        console.log('✅ Real analytics loaded:', data.data);
      } else {
        console.log('⚠️ No analytics data, using fallback');
        setProfileViews(0);
        setMonthlyViews(0);
      }
    } catch (error) {
      console.error('❌ Error loading analytics:', error);
      setProfileViews(0);
      setMonthlyViews(0);
    }
  };

  // Function to refresh analytics (can be called manually)
  const refreshAnalytics = () => {
    if (currentBuilderId) {
      console.log('🔄 Refreshing analytics...');
      loadAnalytics(currentBuilderId);
    }
  };

  const handleAddService = async () => {
    if (!currentBuilderId) {
      console.error('❌ No builder ID available for adding service');
      return;
    }

    console.log('🛠️ Adding service with builder ID:', currentBuilderId);
    console.log('🛠️ Service data:', newService);

    try {
      const response = await fetch('/api/builder/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          builderId: currentBuilderId,
          ...newService,
          priceFrom: newService.priceFrom ? parseFloat(newService.priceFrom) : null
        })
      });

      const result = await response.json();
      console.log('📊 Add service response:', result);

      if (result.success) {
        setShowAddService(false);
        setNewService({
          name: '',
          description: '',
          category: 'CUSTOM_DESIGN',
          priceFrom: '',
          currency: 'USD',
          unit: 'per project'
        });
        console.log('🔄 Reloading services after successful add...');
        await loadServices();
        alert('Service added successfully!');
      } else {
        alert('Failed to add service: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Failed to add service. Please try again.');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/builder/services?serviceId=${serviceId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        await loadServices();
        alert('Service deleted successfully!');
      } else {
        alert('Failed to delete service: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service. Please try again.');
    }
  };

  const handleCountryChange = (country: string) => {
    setNewLocation({ country, cities: [] });
    // Get cities from the website's available data
    const cities = GLOBAL_EXHIBITION_DATA.cities
      .filter(city => city.country === country)
      .map(city => city.name)
      .sort();
    setAvailableCities(cities);
  };

  const handleCityToggle = (city: string) => {
    setNewLocation(prev => ({
      ...prev,
      cities: prev.cities.includes(city) 
        ? prev.cities.filter(c => c !== city)
        : [...prev.cities, city]
    }));
  };

  const handleAddLocation = async () => {
    try {
      if (!newLocation.country || newLocation.cities.length === 0) {
        alert('Please select both country and at least one city');
        return;
      }

      const updatedLocations = [...(profile?.serviceLocations || [])];
      const existingCountryIndex = updatedLocations.findIndex(loc => loc.country === newLocation.country);
      
      if (existingCountryIndex >= 0) {
        // Add cities to existing country
        const existingCities = updatedLocations[existingCountryIndex].cities;
        const newCities = [...new Set([...existingCities, ...newLocation.cities])];
        updatedLocations[existingCountryIndex].cities = newCities;
      } else {
        // Add new country
        updatedLocations.push({
          country: newLocation.country,
          cities: newLocation.cities
        });
      }

      const updates = {
        serviceLocations: updatedLocations
      };

      const response = await fetch('/api/admin/builders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          builderId: profile?.id,
          updates: updates
        })
      });

      const result = await response.json();

      if (result.success) {
        setShowAddLocation(false);
        setNewLocation({
          country: '',
          cities: []
        });
        setAvailableCities([]);
        await loadBuilderProfile();
        alert('Location added successfully!');
      } else {
        alert('Failed to add location: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding location:', error);
      alert('Failed to add location. Please try again.');
    }
  };

  const handleDeleteLocation = async (country: string) => {
    if (!confirm(`Are you sure you want to delete ${country} from your service locations?`)) return;

    try {
      const updatedLocations = (profile?.serviceLocations || []).filter(loc => loc.country !== country);
      
      const updates = {
        serviceLocations: updatedLocations
      };

      const response = await fetch('/api/admin/builders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          builderId: profile?.id,
          updates: updates
        })
      });

      const result = await response.json();

      if (result.success) {
        await loadBuilderProfile();
        alert('Location deleted successfully!');
      } else {
        alert('Failed to delete location: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Failed to delete location. Please try again.');
    }
  };

  // Portfolio management functions
  const addPortfolioItem = async () => {
    if (!profile || !newPortfolioItem.title.trim()) {
      alert('Please fill in the project title');
      return;
    }

    try {
      const portfolioItem = {
        id: `portfolio-${Date.now()}`,
        title: newPortfolioItem.title,
        description: newPortfolioItem.description,
        imageUrl: newPortfolioItem.imageUrl || '/images/portfolio/placeholder.jpg',
        projectYear: newPortfolioItem.projectYear,
        tradeShow: newPortfolioItem.tradeShow,
        client: newPortfolioItem.client,
        standSize: newPortfolioItem.standSize,
        createdAt: new Date().toISOString()
      };

      const updatedPortfolio = [...portfolio, portfolioItem];
      setPortfolio(updatedPortfolio);

      // Save to database
      const response = await fetch('/api/admin/builders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          builderId: profile.id,
          updates: { portfolio: updatedPortfolio }
        })
      });

      const result = await response.json();
      if (result.success) {
        setNewPortfolioItem({
          title: '',
          description: '',
          imageUrl: '',
          projectYear: new Date().getFullYear(),
          tradeShow: '',
          client: '',
          standSize: 0
        });
        setShowPortfolioUpload(false);
        alert('Portfolio item added successfully!');
      } else {
        alert('Failed to save portfolio item: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      alert('Failed to add portfolio item. Please try again.');
    }
  };

  const deletePortfolioItem = async (index: number) => {
    if (!profile) return;

    try {
      const updatedPortfolio = portfolio.filter((_, i) => i !== index);
      setPortfolio(updatedPortfolio);

      const response = await fetch('/api/admin/builders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          builderId: profile.id,
          updates: { portfolio: updatedPortfolio }
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Portfolio item deleted successfully!');
      } else {
        alert('Failed to delete portfolio item: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      alert('Failed to delete portfolio item. Please try again.');
    }
  };

  // Image upload handler for portfolio
  const handlePortfolioImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'portfolio');

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Portfolio image uploaded successfully:', result.data.url);
        setNewPortfolioItem({...newPortfolioItem, imageUrl: result.data.url});
        setImagePreview(result.data.url);
        alert('Image uploaded successfully!');
      } else {
        console.error('❌ Portfolio image upload failed:', result.error);
        alert('Failed to upload image: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading portfolio image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubscriptionUpgrade = async (planId: string) => {
    if (!profile) return;

    try {
      setUpgrading(true);
      
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          builderId: profile.id,
          builderEmail: profile.contactInfo.primaryEmail,
          planId: planId
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('Subscription upgraded successfully!');
        await loadBuilderProfile();
      } else {
        alert('Failed to upgrade subscription: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      alert('Failed to upgrade subscription. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🖼️ Image upload triggered');
    const file = event.target.files?.[0];
    console.log('📁 Selected file:', file);
    console.log('🆔 Current builder ID:', currentBuilderId);
    
    if (!file || !currentBuilderId) {
      console.log('❌ Missing file or builder ID');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }

    try {
      setUploadingImage(true);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('builderId', currentBuilderId);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Image uploaded successfully:', result.data.url);
        
        // Update profile with new image URL
        if (profile) {
          const updatedProfile = { ...profile, logo: result.data.url };
          setProfile(updatedProfile);
          
          // Also update in database
          await fetch('/api/admin/builders', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              builderId: currentBuilderId,
              updates: { logo: result.data.url }
            })
          });
          
          alert('Profile picture updated successfully!');
        }
      } else {
        console.error('❌ Image upload failed:', result.error);
        alert('Failed to upload image: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    try {
      setSaving(true);
      
      // Map the profile data to the format expected by the API
      const updates = {
        companyName: profile.companyName,
        description: profile.description,
        phone: profile.contactInfo.phone,
        email: profile.contactInfo.primaryEmail,
        website: profile.contactInfo.website,
        contactName: profile.contactInfo.contactPerson,
        establishedYear: profile.establishedYear,
        teamSize: profile.teamSize,
        serviceLocations: profile.serviceLocations
      };

      const response = await fetch('/api/admin/builders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          builderId: profile.id,
          updates: updates
        })
      });

      const result = await response.json();
      console.log('Profile update result:', result);

      if (result.success) {
        setEditing(false);
        console.log('✅ Profile update successful, reloading data...');
        
        // Force reload the profile to get updated data
        setLoading(true);
        // Small delay to ensure database is updated
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Reload profile with cache busting
        await loadBuilderProfile();
        
        console.log('✅ Profile reloaded successfully');
        alert('Profile updated successfully!');
      } else {
        console.error('❌ Profile update failed:', result.error);
        alert('Failed to update profile: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleApproveLead = async (leadId: string) => {
    try {
      const response = await fetch('/api/builder/leads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId,
          status: 'approved'
        })
      });

      if (response.ok) {
        setLeads(prev => prev.map(lead => 
          lead.id === leadId ? { ...lead, status: 'approved' as const } : lead
        ));
      }
    } catch (error) {
      console.error('Error approving lead:', error);
    }
  };

  const handleCompleteLead = async (leadId: string) => {
    try {
      const response = await fetch('/api/builder/leads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId,
          status: 'completed'
        })
      });

      if (response.ok) {
        setLeads(prev => prev.map(lead => 
          lead.id === leadId ? { ...lead, status: 'completed' as const } : lead
        ));
        console.log('✅ Lead marked as completed:', leadId);
      }
    } catch (error) {
      console.error('Error completing lead:', error);
    }
  };

  const handleRejectLead = async (leadId: string) => {
    try {
      const response = await fetch('/api/builder/leads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId,
          status: 'rejected'
        })
      });

      if (response.ok) {
        setLeads(prev => prev.map(lead => 
          lead.id === leadId ? { ...lead, status: 'rejected' as const } : lead
        ));
      }
    } catch (error) {
      console.error('Error rejecting lead:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Builder profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0 relative group">
              <img
                src={imagePreview || profile.logo || '/images/builders/default-logo.png'}
                alt={profile.companyName}
                className="h-20 w-20 rounded-lg object-cover bg-white p-2"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <label htmlFor="profile-image-upload" className="cursor-pointer text-white text-xs font-medium" onClick={() => console.log('🖱️ Label clicked')}>
                  {uploadingImage ? (
                    <div className="flex items-center space-x-1">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg className="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Change Photo</span>
                    </div>
                  )}
                </label>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
                {/* Temporary test button */}
                <button 
                  onClick={() => {
                    console.log('🧪 Test button clicked');
                    document.getElementById('profile-image-upload')?.click();
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                >
                  Test
                </button>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{profile.companyName}</h1>
              <p className="text-blue-100 mt-2">{profile.description || 'No description available'}</p>
              {profile.serviceLocations && profile.serviceLocations.length > 0 && (
                <div className="mt-3">
                  <p className="text-blue-100 text-sm">
                    <strong>Service Locations:</strong> {
                      profile.serviceLocations.map(loc => 
                        `${loc.country} (${loc.cities.join(', ')})`
                      ).join(' • ')
                    }
                  </p>
                </div>
              )}
              <div className="flex items-center space-x-4 mt-4">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {profile.verified ? 'Verified' : 'Unverified'}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {profile.subscriptionPlan ? profile.subscriptionPlan.charAt(0).toUpperCase() + profile.subscriptionPlan.slice(1) : 'Free'}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{profile.rating.toFixed(1)} ({profile.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-red-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyViews || 0}</div>
              <p className="text-xs text-red-100">This month</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
              <Target className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.filter(l => l.status === 'approved').length}</div>
              <p className="text-xs text-green-100">Approved leads</p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects Completed</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.filter(l => l.status === 'completed').length}</div>
              <p className="text-xs text-blue-100">Completed projects</p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leads.length > 0 
                  ? Math.round((leads.filter(l => l.status === 'approved').length / leads.length) * 100)
                  : 0
                }%
              </div>
              <p className="text-xs text-purple-100">Approved leads</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="locations">Locations</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="leads">Leads</TabsTrigger>
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
              </TabsList>


              {/* Profile Tab */}
              <TabsContent value="profile" className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Company Information</h3>
                    <Button
                      variant={editing ? "default" : "outline"}
                      onClick={() => setEditing(!editing)}
                    >
                      {editing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>

                  {editing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="companyName">Company Name</Label>
                          <Input
                            id="companyName"
                            value={profile.companyName}
                            onChange={(e) => setProfile({...profile, companyName: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="establishedYear">Established Year</Label>
                          <Input
                            id="establishedYear"
                            type="number"
                            value={profile.establishedYear}
                            onChange={(e) => setProfile({...profile, establishedYear: parseInt(e.target.value)})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="teamSize">Team Size</Label>
                          <Input
                            id="teamSize"
                            type="number"
                            value={profile.teamSize}
                            onChange={(e) => setProfile({...profile, teamSize: parseInt(e.target.value)})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={profile.contactInfo.phone}
                            onChange={(e) => setProfile({
                              ...profile, 
                              contactInfo: {...profile.contactInfo, phone: e.target.value}
                            })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={profile.description}
                          onChange={(e) => setProfile({...profile, description: e.target.value})}
                          rows={4}
                          disableRichTools={true}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleSaveProfile} disabled={saving}>
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button variant="outline" onClick={() => setEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Company Name</Label>
                          <p className="text-lg">{profile.companyName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Established</Label>
                          <p className="text-lg">{profile.establishedYear}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Team Size</Label>
                          <p className="text-lg">{profile.teamSize} employees</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Phone</Label>
                          <p className="text-lg">{profile.contactInfo.phone}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Email</Label>
                          <p className="text-lg">{profile.contactInfo.primaryEmail}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Website</Label>
                          <p className="text-lg">{profile.contactInfo.website || 'Not provided'}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Description</Label>
                        <p className="text-lg">{profile.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Services</h3>
                    <Button onClick={() => setShowAddService(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Service
                    </Button>
                  </div>
                  
                  {/* Add Service Dialog */}
                  <Dialog open={showAddService} onOpenChange={setShowAddService}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Service</DialogTitle>
                        <DialogDescription>
                          Add a new service to your portfolio
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="serviceName">Service Name</Label>
                          <Input
                            id="serviceName"
                            value={newService.name}
                            onChange={(e) => setNewService({...newService, name: e.target.value})}
                            placeholder="e.g., Custom Exhibition Stand Design"
                          />
                        </div>
                        <div>
                          <Label htmlFor="serviceDescription">Description</Label>
                          <Textarea
                            id="serviceDescription"
                            value={newService.description}
                            onChange={(e) => setNewService({...newService, description: e.target.value})}
                            placeholder="Describe your service..."
                            rows={3}
                            disableRichTools={true}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="serviceCategory">Category</Label>
                            <Select value={newService.category} onValueChange={(value) => setNewService({...newService, category: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CUSTOM_DESIGN">Custom Design</SelectItem>
                                <SelectItem value="MODULAR_SYSTEMS">Modular Systems</SelectItem>
                                <SelectItem value="PORTABLE_DISPLAYS">Portable Displays</SelectItem>
                                <SelectItem value="INSTALLATION">Installation</SelectItem>
                                <SelectItem value="TRANSPORTATION">Transportation</SelectItem>
                                <SelectItem value="STORAGE">Storage</SelectItem>
                                <SelectItem value="GRAPHICS">Graphics</SelectItem>
                                <SelectItem value="LIGHTING">Lighting</SelectItem>
                                <SelectItem value="FURNITURE">Furniture</SelectItem>
                                <SelectItem value="AV_EQUIPMENT">AV Equipment</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="servicePrice">Starting Price</Label>
                            <Input
                              id="servicePrice"
                              type="number"
                              value={newService.priceFrom}
                              onChange={(e) => setNewService({...newService, priceFrom: e.target.value})}
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleAddService} disabled={!newService.name}>
                            Add Service
                          </Button>
                          <Button variant="outline" onClick={() => setShowAddService(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <div className="space-y-4">
                    {services.length > 0 ? services.map((service) => (
                      <Card key={service.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold">{service.name}</h4>
                              <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm text-gray-500">
                                  <Badge variant="outline">{service.category}</Badge>
                                </span>
                                {service.price_from && (
                                  <span className="text-sm text-gray-500">
                                    <DollarSign className="h-4 w-4 inline mr-1" />
                                    From {service.price_from} {service.currency} {service.unit}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteService(service.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No services added yet. Click "Add Service" to get started.</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Locations Tab */}
              <TabsContent value="locations" className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Service Locations</h3>
                    <Button onClick={() => setShowAddLocation(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Location
                    </Button>
                  </div>
                  
                  {/* Add Location Dialog */}
                  <Dialog open={showAddLocation} onOpenChange={setShowAddLocation}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Service Location</DialogTitle>
                        <DialogDescription>
                          Add a new country and cities where you provide services
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="locationCountry">Country</Label>
                          <Select value={newLocation.country} onValueChange={handleCountryChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                            <SelectContent>
                              {GLOBAL_EXHIBITION_DATA.countries.map((country, index) => (
                                <SelectItem key={`${country.name}-${index}`} value={country.name}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {newLocation.country && (
                          <div>
                            <Label>Cities</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                              {availableCities.map(city => (
                                <div key={city} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`city-${city}`}
                                    checked={newLocation.cities.includes(city)}
                                    onChange={() => handleCityToggle(city)}
                                    className="rounded"
                                  />
                                  <label htmlFor={`city-${city}`} className="text-sm">
                                    {city}
                                  </label>
                                </div>
                              ))}
                            </div>
                            {newLocation.cities.length > 0 && (
                              <p className="text-sm text-gray-500 mt-2">
                                Selected: {newLocation.cities.join(', ')}
                              </p>
                            )}
                          </div>
                        )}
                        <div className="flex space-x-2">
                          <Button 
                            onClick={handleAddLocation} 
                            disabled={!newLocation.country || newLocation.cities.length === 0}
                          >
                            Add Location
                          </Button>
                          <Button variant="outline" onClick={() => setShowAddLocation(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <div className="space-y-4">
                    {profile.serviceLocations && profile.serviceLocations.length > 0 ? profile.serviceLocations.map((location, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold">{location.country}</h4>
                              <p className="text-gray-600 text-sm">
                                Cities: {location.cities.join(', ')}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteLocation(location.country)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No service locations added yet. Click "Add Location" to get started.</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Leads Tab */}
              <TabsContent value="leads" className="p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Incoming Leads</h3>
                  
                  <div className="space-y-4">
                    {leads.map((lead) => (
                      <Card key={lead.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold">{lead.name}</h4>
                                <Badge variant={
                                  lead.status === 'pending' ? 'default' : 
                                  lead.status === 'approved' ? 'secondary' : 
                                  lead.status === 'completed' ? 'outline' : 
                                  'destructive'
                                }>
                                  {lead.status}
                                </Badge>
                                <Badge variant="outline">{lead.source}</Badge>
                              </div>
                              <p className="text-gray-600 text-sm mb-2">{lead.company}</p>
                              <p className="text-sm text-gray-500 mb-2">{lead.projectDetails}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span><Mail className="h-4 w-4 inline mr-1" />{lead.email}</span>
                                <span><Phone className="h-4 w-4 inline mr-1" />{lead.phone}</span>
                                <span><DollarSign className="h-4 w-4 inline mr-1" />{lead.budget}</span>
                                <span><Calendar className="h-4 w-4 inline mr-1" />{lead.timeline}</span>
                              </div>
                            </div>
                            {lead.status === 'pending' && (
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleApproveLead(lead.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleRejectLead(lead.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                            {lead.status === 'approved' && (
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleCompleteLead(lead.id)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Mark Complete
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Portfolio Tab */}
              <TabsContent value="portfolio" className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Portfolio Gallery</h3>
                    <Button onClick={() => setShowPortfolioUpload(true)} className="bg-red-600 text-white hover:bg-red-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </div>

                  {portfolio.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {portfolio.map((item, index) => (
                        <Card key={item.id} className="overflow-hidden">
                          <div className="aspect-video bg-gray-100">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Camera className="w-12 h-12" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                            {item.description && (
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                            )}
                            <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                              <div>
                                {item.projectYear && <span>{item.projectYear}</span>}
                                {item.tradeShow && <span> • {item.tradeShow}</span>}
                              </div>
                              {item.standSize && item.standSize > 0 && (
                                <span>{item.standSize} sqm</span>
                              )}
                            </div>
                            {item.client && (
                              <div className="text-xs text-gray-500 mb-2">
                                Client: {item.client}
                              </div>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deletePortfolioItem(index)}
                              className="w-full"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-600 mb-2">No Portfolio Items</h3>
                      <p className="text-gray-500 mb-4">Showcase your best work to attract more clients</p>
                      <Button onClick={() => setShowPortfolioUpload(true)} className="bg-red-600 text-white hover:bg-red-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Project
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Subscription Tab */}
              <TabsContent value="subscription" className="p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Subscription Plan</h3>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-xl font-semibold capitalize">{profile.subscriptionPlan || 'Free'} Plan</h4>
                          <p className="text-gray-600">Expires: {profile.subscriptionExpiry ? new Date(profile.subscriptionExpiry).toLocaleDateString() : 'No expiry date'}</p>
                        </div>
                        <div className="text-right">
                          <Button 
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleSubscriptionUpgrade('professional')}
                            disabled={upgrading || profile.subscriptionPlan === 'professional' || profile.subscriptionPlan === 'enterprise'}
                          >
                            {upgrading ? 'Upgrading...' : 'Upgrade Plan'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Available Plans */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className={profile.subscriptionPlan === 'free' ? 'ring-2 ring-blue-500' : ''}>
                      <CardHeader>
                        <CardTitle className="text-lg">Free Plan</CardTitle>
                        <CardDescription>Basic features</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">$0</div>
                        <div className="text-sm text-gray-500">per month</div>
                        <ul className="mt-4 space-y-2 text-sm">
                          <li>• Basic profile listing</li>
                          <li>• Up to 5 service locations</li>
                          <li>• Basic lead management</li>
                          <li>• Email support</li>
                        </ul>
                        {profile.subscriptionPlan === 'free' && (
                          <Badge className="mt-4">Current Plan</Badge>
                        )}
                      </CardContent>
                    </Card>

                    <Card className={profile.subscriptionPlan === 'professional' ? 'ring-2 ring-blue-500' : ''}>
                      <CardHeader>
                        <CardTitle className="text-lg">Professional</CardTitle>
                        <CardDescription>Advanced features</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">$29</div>
                        <div className="text-sm text-gray-500">per month</div>
                        <ul className="mt-4 space-y-2 text-sm">
                          <li>• Everything in Free</li>
                          <li>• Unlimited service locations</li>
                          <li>• Priority lead notifications</li>
                          <li>• Advanced analytics</li>
                          <li>• Phone support</li>
                        </ul>
                        <Button 
                          className="w-full mt-4"
                          onClick={() => handleSubscriptionUpgrade('professional')}
                          disabled={upgrading || profile.subscriptionPlan === 'professional'}
                        >
                          {profile.subscriptionPlan === 'professional' ? 'Current Plan' : 'Upgrade'}
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className={profile.subscriptionPlan === 'enterprise' ? 'ring-2 ring-blue-500' : ''}>
                      <CardHeader>
                        <CardTitle className="text-lg">Enterprise</CardTitle>
                        <CardDescription>Full features</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">$99</div>
                        <div className="text-sm text-gray-500">per month</div>
                        <ul className="mt-4 space-y-2 text-sm">
                          <li>• Everything in Professional</li>
                          <li>• Custom integrations</li>
                          <li>• Dedicated account manager</li>
                          <li>• White-label options</li>
                          <li>• 24/7 priority support</li>
                        </ul>
                        <Button 
                          className="w-full mt-4"
                          onClick={() => handleSubscriptionUpgrade('enterprise')}
                          disabled={upgrading || profile.subscriptionPlan === 'enterprise'}
                        >
                          {profile.subscriptionPlan === 'enterprise' ? 'Current Plan' : 'Upgrade'}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Portfolio Upload Modal */}
        {showPortfolioUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add Portfolio Project</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPortfolioUpload(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={newPortfolioItem.title}
                    onChange={(e) => setNewPortfolioItem({...newPortfolioItem, title: e.target.value})}
                    placeholder="Enter project title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    value={newPortfolioItem.description}
                    onChange={(e) => setNewPortfolioItem({...newPortfolioItem, description: e.target.value})}
                    placeholder="Describe the project, challenges, and results..."
                    rows={3}
                    disableRichTools={true}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">Project Year</Label>
                    <Input
                      id="year"
                      type="number"
                      min="2000"
                      max={new Date().getFullYear()}
                      value={newPortfolioItem.projectYear}
                      onChange={(e) => setNewPortfolioItem({...newPortfolioItem, projectYear: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="standSize">Stand Size (sqm)</Label>
                    <Input
                      id="standSize"
                      type="number"
                      min="0"
                      value={newPortfolioItem.standSize}
                      onChange={(e) => setNewPortfolioItem({...newPortfolioItem, standSize: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tradeShow">Trade Show</Label>
                  <Input
                    id="tradeShow"
                    value={newPortfolioItem.tradeShow}
                    onChange={(e) => setNewPortfolioItem({...newPortfolioItem, tradeShow: e.target.value})}
                    placeholder="e.g., ISE Barcelona"
                  />
                </div>

                <div>
                  <Label htmlFor="client">Client</Label>
                  <Input
                    id="client"
                    value={newPortfolioItem.client}
                    onChange={(e) => setNewPortfolioItem({...newPortfolioItem, client: e.target.value})}
                    placeholder="Client company name"
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrl">Project Image</Label>
                  <div className="space-y-3">
                    {/* Image Upload */}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePortfolioImageUpload}
                        className="hidden"
                        id="portfolio-image-upload"
                        disabled={uploadingImage}
                      />
                      <label
                        htmlFor="portfolio-image-upload"
                        className={`inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors ${
                          uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {uploadingImage ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Camera className="w-4 h-4 mr-2" />
                            Upload Image
                          </>
                        )}
                      </label>
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-md border"
                        />
                      </div>
                    )}

                    {/* Or URL Input */}
                    <div className="text-sm text-gray-500 text-center">OR</div>
                    <Input
                      id="imageUrl"
                      value={newPortfolioItem.imageUrl}
                      onChange={(e) => {
                        setNewPortfolioItem({...newPortfolioItem, imageUrl: e.target.value});
                        setImagePreview(e.target.value);
                      }}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowPortfolioUpload(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={addPortfolioItem}
                  disabled={saving || !newPortfolioItem.title.trim()}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  {saving ? 'Adding...' : 'Add Project'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
