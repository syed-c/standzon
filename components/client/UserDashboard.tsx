'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import { Badge } from '@/components/shared/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shared/avatar';
import { Progress } from '@/components/shared/progress';
import { 
  User, 
  MessageSquare, 
  Star, 
  Calendar, 
  TrendingUp, 
  Settings,
  Heart,
  FileText,
  DollarSign,
  Award,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  Globe,
  Search,
  Filter,
  Building2,
  Users,
  Eye,
  Plus,
  ExternalLink
} from 'lucide-react';
import { exhibitions, ExhibitionMatchingService, Exhibition } from '@/lib/data/exhibitions';
import { realExhibitions } from '@/lib/data/realExhibitions';
import { Input } from '@/components/shared/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shared/dialog';
import { Textarea } from '@/components/shared/textarea';
import { toast } from '@/hooks/use-toast';

interface DashboardProps {
  userType: 'client' | 'builder';
  userId: string;
}

interface QuoteRequest {
  id: string;
  tradeShow: string;
  city: string;
  country: string;
  createdAt: string;
  status: 'pending' | 'responded' | 'accepted' | 'completed';
  responsesCount: number;
  estimatedBudget: number;
  standSize: number;
}

interface BuilderLead {
  id: string;
  clientName: string;
  tradeShow: string;
  standSize: number;
  budget: string;
  timeline: string;
  status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
  createdAt: string;
  estimatedValue: number;
}

export default function UserDashboard({ userType, userId }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [builderLeads, setBuilderLeads] = useState<BuilderLead[]>([]);
  const [loading, setLoading] = useState(true);

  // Exhibitions state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [showAddExhibition, setShowAddExhibition] = useState(false);

  console.log('UserDashboard loaded with exhibitions:', {
    totalExhibitions: exhibitions.length + realExhibitions.length,
    searchQuery,
    selectedCountry,
    selectedIndustry
  });

  // Combine all exhibitions
  const allExhibitions = useMemo(() => {
    return [...exhibitions, ...realExhibitions];
  }, []);

  // Get unique countries for filtering
  const uniqueCountries = useMemo(() => {
    return Array.from(new Set(allExhibitions.map(ex => ex.country))).sort();
  }, [allExhibitions]);

  // Get unique industries for filtering  
  const uniqueIndustries = useMemo(() => {
    return Array.from(new Set(allExhibitions.map(ex => ex.industry.name))).sort();
  }, [allExhibitions]);

  // Filter exhibitions based on search and filters
  const filteredExhibitions = useMemo(() => {
    let filtered = allExhibitions;

    // Search filter
    if (searchQuery) {
      const searchTerm = searchQuery.toLowerCase();
      filtered = allExhibitions.filter(ex =>
        ex.name.toLowerCase().includes(searchTerm) ||
        ex.description.toLowerCase().includes(searchTerm) ||
        ex.industry.name.toLowerCase().includes(searchTerm) ||
        ex.city.toLowerCase().includes(searchTerm) ||
        ex.country.toLowerCase().includes(searchTerm) ||
        ex.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Country filter
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(ex => ex.country === selectedCountry);
    }

    // Industry filter
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(ex => ex.industry.name === selectedIndustry);
    }

    return filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [allExhibitions, searchQuery, selectedCountry, selectedIndustry]);

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric' 
    };
    
    if (startDate.getFullYear() === endDate.getFullYear()) {
      return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}, ${startDate.getFullYear()}`;
    } else {
      return `${startDate.toLocaleDateString('en-US', { ...options, year: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { ...options, year: 'numeric' })}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'text-green-800 bg-green-100';
      case 'Live': return 'text-red-800 bg-red-100';
      case 'Completed': return 'text-gray-800 bg-gray-100';
      case 'Cancelled': return 'text-red-800 bg-red-100';
      case 'Postponed': return 'text-yellow-800 bg-yellow-100';
      default: return 'text-gray-800 bg-gray-100';
    }
  };

  // Mock data - In production, this would come from API calls
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (userType === 'client') {
        setQuoteRequests([
          {
            id: '1',
            tradeShow: 'CES 2025',
            city: 'Las Vegas',
            country: 'United States',
            createdAt: '2024-12-15',
            status: 'responded',
            responsesCount: 3,
            estimatedBudget: 45000,
            standSize: 400
          },
          {
            id: '2',
            tradeShow: 'Hannover Messe 2025',
            city: 'Hannover',
            country: 'Germany',
            createdAt: '2024-12-10',
            status: 'pending',
            responsesCount: 1,
            estimatedBudget: 35000,
            standSize: 300
          },
          {
            id: '3',
            tradeShow: 'Mobile World Congress 2025',
            city: 'Barcelona',
            country: 'Spain',
            createdAt: '2024-12-08',
            status: 'completed',
            responsesCount: 5,
            estimatedBudget: 55000,
            standSize: 500
          }
        ]);
      } else {
        setBuilderLeads([
          {
            id: '1',
            clientName: 'TechCorp Industries',
            tradeShow: 'CES 2025',
            standSize: 400,
            budget: '$40,000 - $50,000',
            timeline: '8 weeks',
            status: 'quoted',
            createdAt: '2024-12-15',
            estimatedValue: 45000
          },
          {
            id: '2',
            clientName: 'Global Manufacturing Ltd',
            tradeShow: 'Hannover Messe 2025',
            standSize: 300,
            budget: '$30,000 - $40,000',
            timeline: '10 weeks',
            status: 'new',
            createdAt: '2024-12-14',
            estimatedValue: 35000
          },
          {
            id: '3',
            clientName: 'Innovation Dynamics',
            tradeShow: 'Mobile World Congress 2025',
            standSize: 500,
            budget: '$50,000 - $60,000',
            timeline: '12 weeks',
            status: 'won',
            createdAt: '2024-12-12',
            estimatedValue: 55000
          }
        ]);
      }
      
      setLoading(false);
    };

    loadDashboardData();
  }, [userType, userId]);

  const ClientDashboard = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-theme-200/50 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quoteRequests.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-theme-200/50 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Quotes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quoteRequests.filter(q => q.status === 'responded').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting your review</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-theme-200/50 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$55,000</div>
            <p className="text-xs text-muted-foreground">Across 1 completed project</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-theme-200/50 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Builders</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Your favorite contractors</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Quote Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Quote Requests</CardTitle>
          <CardDescription>
            Track your exhibition stand quotes and responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quoteRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">{request.tradeShow}</h4>
                    <p className="text-sm text-gray-500">
                      {request.city}, {request.country} • {request.standSize} sqm
                    </p>
                    <p className="text-xs text-gray-400">
                      Created {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${request.estimatedBudget.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {request.responsesCount} response{request.responsesCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-theme-200 text-theme-700 hover:bg-theme-50 hover:text-theme-800 hover:border-theme-300"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const BuilderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-theme-200/50 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {builderLeads.filter(l => l.status === 'new').length}
            </div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-theme-200/50 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-theme-200/50 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won Projects</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {builderLeads.filter(l => l.status === 'won').length}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-theme-200/50 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Pipeline</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${builderLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Potential value</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>
            New project inquiries and quote requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {builderLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {lead.clientName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{lead.clientName}</h4>
                    <p className="text-sm text-gray-500">
                      {lead.tradeShow} • {lead.standSize} sqm
                    </p>
                    <p className="text-xs text-gray-400">
                      Budget: {lead.budget} • Timeline: {lead.timeline}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${lead.estimatedValue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-theme-200 text-theme-700 hover:bg-theme-50 hover:text-theme-800 hover:border-theme-300"
                  >
                    Respond
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ExhibitionsTab = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Exhibition Directory
          </CardTitle>
          <CardDescription>
            Discover exhibitions worldwide and find relevant opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search exhibitions by name, industry, city, or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {uniqueCountries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {uniqueIndustries.map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={showAddExhibition} onOpenChange={setShowAddExhibition}>
              <DialogTrigger asChild>
                <Button className="bg-theme-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exhibition
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Exhibition</DialogTitle>
                  <DialogDescription>
                    Add a new exhibition to the directory. We'll check for duplicates before adding.
                  </DialogDescription>
                </DialogHeader>
                <AddExhibitionForm onClose={() => setShowAddExhibition(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
            <span>
              Showing {filteredExhibitions.length} of {allExhibitions.length} exhibitions
              {searchQuery && ` for "${searchQuery}"`}
            </span>
            <Button variant="outline" size="sm" asChild>
              <a href="/exhibitions" target="_blank">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Full Directory
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exhibitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExhibitions.slice(0, 12).map((exhibition) => (
          <Card key={exhibition.id} className="hover:shadow-lg transition-all duration-300 group border-0 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                    {exhibition.name}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {exhibition.city}, {exhibition.country}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className={getStatusColor(exhibition.status)}>
                    {exhibition.status}
                  </Badge>
                  {exhibition.featured && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">
                <p className="line-clamp-2">{exhibition.shortDescription}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-xs">{formatDateRange(exhibition.startDate, exhibition.endDate)}</span>
                </div>
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-xs">{exhibition.industry.name}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-purple-500 mr-2" />
                  <span className="text-xs">{exhibition.expectedAttendees.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-orange-500 mr-2" />
                  <span className="text-xs">{exhibition.expectedExhibitors.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Venue:</span>
                  <span className="font-medium text-right">{exhibition.venue.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Organizer:</span>
                  <div className="flex items-center">
                    <span className="font-medium">{exhibition.organizer.rating}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-current ml-1" />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex gap-2">
                  <Button asChild size="sm" className="flex-1">
                    <a href={`/exhibitions/${exhibition.slug}`} target="_blank">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </a>
                  </Button>
                  <Button size="sm" variant="outline">
                    <Building2 className="h-4 w-4 mr-2" />
                    Find Builders
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExhibitions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exhibitions found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCountry('all');
              setSelectedIndustry('all');
            }}>
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {filteredExhibitions.length > 12 && (
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-gray-600 mb-4">
              Showing 12 of {filteredExhibitions.length} exhibitions
            </p>
            <Button asChild variant="outline">
              <a href="/exhibitions" target="_blank">
                <ExternalLink className="h-4 w-4 mr-2" />
                View All {filteredExhibitions.length} Exhibitions
              </a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const AddExhibitionForm = ({ onClose }: { onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: '',
      city: '',
      country: '',
      startDate: '',
      endDate: '',
      venue: '',
      website: '',
      description: '',
      industry: '',
      expectedAttendees: '',
      expectedExhibitors: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Adding new exhibition:', formData);

      // Check for duplicates
      const duplicateCheck = allExhibitions.find(ex => 
        ex.name.toLowerCase() === formData.name.toLowerCase() &&
        ex.city.toLowerCase() === formData.city.toLowerCase() &&
        ex.country.toLowerCase() === formData.country.toLowerCase()
      );

      if (duplicateCheck) {
        toast({
          title: "Duplicate Exhibition Found",
          description: `An exhibition with this name already exists in ${formData.city}, ${formData.country}. Please check the existing listings.`,
          variant: "destructive"
        });
        return;
      }

      // Here you would normally send to an API
      toast({
        title: "Exhibition Added Successfully",
        description: `${formData.name} has been submitted for review and will be added to the directory.`,
      });

      onClose();
    };

    const handleInputChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Exhibition Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., CES 2025"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Industry *</label>
            <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                {uniqueIndustries.map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">City *</label>
            <Input
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="e.g., Las Vegas"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Country *</label>
            <Input
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder="e.g., United States"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Start Date *</label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">End Date *</label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Venue *</label>
          <Input
            value={formData.venue}
            onChange={(e) => handleInputChange('venue', e.target.value)}
            placeholder="e.g., Las Vegas Convention Center"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Website</label>
          <Input
            type="url"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Expected Attendees</label>
            <Input
              type="number"
              value={formData.expectedAttendees}
              onChange={(e) => handleInputChange('expectedAttendees', e.target.value)}
              placeholder="50000"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Expected Exhibitors</label>
            <Input
              type="number"
              value={formData.expectedExhibitors}
              onChange={(e) => handleInputChange('expectedExhibitors', e.target.value)}
              placeholder="2000"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of the exhibition..."
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1 bg-theme-600 text-white">
            Add Exhibition
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {userType === 'client' ? 'Client Dashboard' : 'Builder Dashboard'}
        </h1>
        <p className="text-gray-600 mt-2">
          {userType === 'client' 
            ? 'Manage your exhibition stand projects and quotes' 
            : 'Track leads, manage projects, and grow your business'
          }
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-theme-700 data-[state=active]:shadow-sm">Overview</TabsTrigger>
          <TabsTrigger value="exhibitions" className="data-[state=active]:bg-white data-[state=active]:text-theme-700 data-[state=active]:shadow-sm">Exhibitions</TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-white data-[state=active]:text-theme-700 data-[state=active]:shadow-sm">Messages</TabsTrigger>
          <TabsTrigger value="reviews" className="data-[state=active]:bg-white data-[state=active]:text-theme-700 data-[state=active]:shadow-sm">Reviews</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-theme-700 data-[state=active]:shadow-sm">Analytics</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-theme-700 data-[state=active]:shadow-sm">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {userType === 'client' ? <ClientDashboard /> : <BuilderDashboard />}
        </TabsContent>

        <TabsContent value="exhibitions">
          <ExhibitionsTab />
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>
                Communicate with {userType === 'client' ? 'builders' : 'clients'} and manage conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No messages yet</p>
                <Button className="mt-4 bg-theme-600 text-white">Start a conversation</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Reviews & Ratings</CardTitle>
              <CardDescription>
                {userType === 'client' 
                  ? 'Reviews you\'ve given to builders' 
                  : 'Reviews from your clients'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No reviews yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Performance insights and metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Analytics coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your profile and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Settings panel coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}