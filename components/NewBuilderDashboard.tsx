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
  Settings
} from 'lucide-react';
import { getAllCountries, getCitiesForCountry } from '@/lib/data/countriesWithCities';

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
  status: 'pending' | 'approved' | 'rejected';
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
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [upgrading, setUpgrading] = useState(false);

  // Load builder profile
  useEffect(() => {
    loadBuilderProfile();
    loadLeads();
    loadServices();
  }, [builderId]);

  const loadBuilderProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/builder/dashboard?builderId=${builderId}&t=${Date.now()}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        console.log('Loaded profile data:', data.data);
        setProfile(data.data);
        setLeads(data.data.leads || []);
      }
    } catch (error) {
      console.error('Error loading builder profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeads = async () => {
    try {
      const response = await fetch(`/api/builder/leads?builderId=${builderId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setLeads(data.data);
      }
    } catch (error) {
      console.error('Error loading leads:', error);
    }
  };

  const loadServices = async () => {
    try {
      const response = await fetch(`/api/builder/services?builderId=${builderId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setServices(data.data);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const handleAddService = async () => {
    try {
      const response = await fetch('/api/builder/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          builderId: builderId,
          ...newService,
          priceFrom: newService.priceFrom ? parseFloat(newService.priceFrom) : null
        })
      });

      const result = await response.json();

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
    setAvailableCities(getCitiesForCountry(country));
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
        // Force reload the profile to get updated data
        setLoading(true);
        // Small delay to ensure database is updated
        await new Promise(resolve => setTimeout(resolve, 500));
        await loadBuilderProfile();
        setLoading(false);
        console.log('Profile reloaded, new profile:', profile);
        alert('Profile updated successfully!');
      } else {
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
            <div className="flex-shrink-0">
              <img
                src={profile.logo || '/images/builders/default-logo.png'}
                alt={profile.companyName}
                className="h-20 w-20 rounded-lg object-cover bg-white p-2"
              />
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
              <Eye className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.projectsCompleted * 2 || 0}</div>
              <p className="text-xs text-red-100">This month</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
              <Target className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.filter(l => l.status === 'pending').length}</div>
              <p className="text-xs text-green-100">Available now</p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects Completed</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.projectsCompleted}</div>
              <p className="text-xs text-blue-100">Total projects</p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.length > 0 ? Math.round((leads.filter(l => l.status === 'approved').length / leads.length) * 100) : 0}%</div>
              <p className="text-xs text-purple-100">Above average</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="locations">Locations</TabsTrigger>
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
                              {getAllCountries().map(country => (
                                <SelectItem key={country} value={country}>
                                  {country}
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
                                <Badge variant={lead.status === 'pending' ? 'default' : lead.status === 'approved' ? 'secondary' : 'destructive'}>
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
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
      </div>
    </div>
  );
}
