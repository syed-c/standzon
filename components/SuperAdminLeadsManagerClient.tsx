'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Building, MapPin, DollarSign, Clock, Filter, Search, Send, Eye, 
  AlertCircle, CheckCircle, Star, Phone, Calendar, Target, TrendingUp, 
  Download, Bell, Settings, Mail, Activity, ArrowRight, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface Lead {
  _id: string;
  companyName: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  exhibitionName?: string;
  standSize?: number;
  budget?: string;
  timeline?: string;
  specialRequirements?: string;
  priority?: string;
  status: string;
  source: string;
  createdAt: number;
  countryName?: string;
  cityName?: string;
}

interface SuperAdminLeadsManagerClientProps {
  initialLeads: any[];
  initialQuoteRequests: any[];
}

export function SuperAdminLeadsManagerClient({ 
  initialLeads = [], 
  initialQuoteRequests = [] 
}: SuperAdminLeadsManagerClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all-leads');
  const [leads, setLeads] = useState<any[]>(initialLeads);
  const [quoteRequests, setQuoteRequests] = useState<any[]>(initialQuoteRequests);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate data fetching without Convex
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For now, we'll just use the initial data
        setLeads(initialLeads);
        setQuoteRequests(initialQuoteRequests);
      } catch (err) {
        console.error('Error fetching leads:', err);
        setError('Failed to load leads data');
        toast.error('Failed to load leads data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log('🎯 SuperAdminLeadsManagerClient - Raw leads data:', leads);
  console.log('🎯 SuperAdminLeadsManagerClient - Raw quote requests:', quoteRequests);

  // Handle the case where queries return null or empty arrays
  const safeLeads = Array.isArray(leads) ? leads : [];
  const safeQuoteRequests = Array.isArray(quoteRequests) ? quoteRequests : [];

  console.log('🎯 SuperAdminLeadsManagerClient - Safe leads:', safeLeads.length);
  console.log('🎯 SuperAdminLeadsManagerClient - Safe quote requests:', safeQuoteRequests.length);

  // Combine leads and quote requests
  const allLeads = [
    ...safeLeads.map(lead => ({
      ...lead,
      id: lead._id,
      contactName: lead.contactPerson || lead.companyName,
      tradeShowName: lead.exhibitionName || 'Not specified',
      city: lead.cityName || 'Not specified',
      country: lead.countryName || 'Not specified',
      standSize: lead.standSize ? `${lead.standSize} sqm` : 'Not specified',
      priority: (lead.priority || 'medium').toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH',
      leadScore: 75, // Default score
      estimatedValue: 25000, // Default estimated value
      targetBuilders: [],
      matchingBuilders: 0,
      notificationsSent: 0,
      emailsSent: 0,
      smsSent: 0,
      specialRequests: lead.specialRequirements || ''
    })),
    ...safeQuoteRequests.map(quote => ({
      ...quote,
      id: quote._id,
      contactName: quote.contactPerson || quote.companyName,
      tradeShowName: quote.tradeShow || quote.exhibitionName,
      city: 'Not specified',
      country: 'Not specified',
      standSize: quote.standSize ? `${quote.standSize} sqm` : 'Not specified',
      priority: (quote.priority || 'standard').toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH',
      leadScore: 80, // Default score for quote requests
      estimatedValue: 30000, // Default estimated value
      source: 'quote_request',
      targetBuilders: quote.matchedBuilders || [],
      matchingBuilders: (quote.matchedBuilders || []).length,
      notificationsSent: 0,
      emailsSent: 0,
      smsSent: 0,
      specialRequests: quote.specialRequests || ''
    }))
  ];

  console.log('🎯 SuperAdminLeadsManagerClient - Combined leads:', allLeads.length, allLeads);

  // Filter leads based on search and filters
  const filteredLeads = allLeads.filter(lead => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (!(
        lead.companyName?.toLowerCase().includes(searchLower) ||
        lead.contactName?.toLowerCase().includes(searchLower) ||
        lead.contactEmail?.toLowerCase().includes(searchLower) ||
        lead.tradeShowName?.toLowerCase().includes(searchLower) ||
        lead.city?.toLowerCase().includes(searchLower) ||
        lead.country?.toLowerCase().includes(searchLower)
      )) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== 'all' && lead.status !== statusFilter) {
      return false;
    }

    // Location filter
    if (locationFilter !== 'all') {
      const locationLower = locationFilter.toLowerCase();
      if (!(
        lead.country?.toLowerCase().includes(locationLower) ||
        lead.city?.toLowerCase().includes(locationLower)
      )) {
        return false;
      }
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      if (new Date(lead.createdAt) < filterDate) {
        return false;
      }
    }

    return true;
  });

  const exportLeads = () => {
    if (filteredLeads.length === 0) {
      toast.error('No leads to export');
      return;
    }

    const csvData = filteredLeads.map(lead => ({
      ID: lead.id,
      Company: lead.companyName,
      Contact: lead.contactName,
      Email: lead.contactEmail,
      Phone: lead.contactPhone || '',
      Exhibition: lead.tradeShowName,
      Location: `${lead.city}, ${lead.country}`,
      'Stand Size': lead.standSize,
      Budget: lead.budget || '',
      Priority: lead.priority,
      'Lead Score': lead.leadScore,
      'Estimated Value': lead.estimatedValue,
      Source: lead.source,
      'Created At': new Date(lead.createdAt).toLocaleDateString(),
      Status: lead.status,
      'Builders Notified': lead.notificationsSent,
      'Emails Sent': lead.emailsSent
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success(`Exported ${filteredLeads.length} leads`);
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For now, we'll just use the initial data
      setLeads([...initialLeads]);
      setQuoteRequests([...initialQuoteRequests]);
      
      toast.success('Data refreshed');
    } catch (err) {
      console.error('Error refreshing leads:', err);
      setError('Failed to refresh leads data');
      toast.error('Failed to refresh leads data');
    } finally {
      setLoading(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lead management dashboard...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refreshData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600 mt-1">
            Manage exhibition leads and quote requests ({allLeads.length} total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
          <Button onClick={exportLeads} disabled={filteredLeads.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-semibold text-gray-900">{allLeads.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Converted</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {allLeads.filter(lead => lead.status === 'converted').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {allLeads.filter(lead => lead.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {allLeads.filter(lead => lead.priority === 'HIGH').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all-leads">All Leads</TabsTrigger>
          <TabsTrigger value="quote-requests">Quote Requests</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-leads" className="mt-6">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search leads by company, contact, or exhibition..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-full md:w-32">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="dubai">Dubai</SelectItem>
                    <SelectItem value="abu-dhabi">Abu Dhabi</SelectItem>
                    <SelectItem value="sharjah">Sharjah</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full md:w-32">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Leads Table */}
          {filteredLeads.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'No leads found' : 'No leads yet'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Leads will appear here once they are generated'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLeads.map((lead) => (
                <Card key={lead.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold line-clamp-1">
                        {lead.companyName}
                      </CardTitle>
                      <Badge 
                        variant={
                          lead.priority === 'HIGH' ? 'destructive' : 
                          lead.priority === 'MEDIUM' ? 'default' : 'secondary'
                        }
                      >
                        {lead.priority}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center text-sm">
                      <Building className="w-4 h-4 mr-1" />
                      {lead.contactName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="truncate">{lead.contactEmail}</span>
                      </div>
                      
                      {lead.contactPhone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>{lead.contactPhone}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{lead.city}, {lead.country}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Target className="w-4 h-4 mr-2" />
                        <span>{lead.tradeShowName}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center text-sm">
                          <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                          <span className="font-medium">${lead.estimatedValue.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          <span>{lead.leadScore}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-3 border-t">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm">
                          <Send className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="quote-requests" className="mt-6">
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quote Requests</h3>
              <p className="text-gray-600 mb-4">
                Quote request management will be available here.
              </p>
              <Button variant="outline" onClick={refreshData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardContent className="py-12 text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600 mb-4">
                Lead analytics and insights will be displayed here.
              </p>
              <Button variant="outline" onClick={refreshData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}