'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import { Input } from '@/components/shared/input';
import { Badge } from '@/components/shared/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/tabs';
import { 
  Users, Building, MapPin, DollarSign, Clock, Filter, Search, Send, Eye, 
  AlertCircle, CheckCircle, Star, Phone, Calendar, Target, TrendingUp, 
  Download, Bell, Settings, Mail, Activity, ArrowRight, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { getServerSupabase } from '@/lib/supabase';

interface Lead {
  id: string;
  company_name: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  trade_show_name?: string;
  stand_size?: number;
  budget?: string;
  timeline?: string;
  special_requests?: string;
  priority?: string;
  status: string;
  source: string;
  created_at: string;
  country?: string;
  city?: string;
}

interface QuoteRequest {
  id: string;
  company_name: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  trade_show?: string;
  stand_size?: number;
  budget?: string;
  timeline?: string;
  special_requests?: string;
  priority?: string;
  status: string;
  created_at: string;
  matched_builders?: string[];
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

  // Fetch real data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const supabase = getServerSupabase();
        if (!supabase) {
          throw new Error('Supabase client not initialized');
        }
        
        // Fetch leads from Supabase
        const { data: leadsData, error: leadsError } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (leadsError) {
          throw new Error(`Failed to fetch leads: ${leadsError.message}`);
        }
        
        // Fetch quote requests from Supabase
        const { data: quotesData, error: quotesError } = await supabase
          .from('quote_requests')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (quotesError) {
          throw new Error(`Failed to fetch quote requests: ${quotesError.message}`);
        }
        
        setLeads(leadsData || []);
        setQuoteRequests(quotesData || []);
      } catch (err) {
        console.error('Error fetching leads:', err);
        setError(err instanceof Error ? err.message : 'Failed to load leads data');
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
      id: lead.id,
      contactName: lead.contact_person || lead.company_name,
      tradeShowName: lead.trade_show_name || 'Not specified',
      city: lead.city || 'Not specified',
      country: lead.country || 'Not specified',
      standSize: lead.stand_size ? `${lead.stand_size} sqm` : 'Not specified',
      priority: (lead.priority || 'medium').toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH',
      leadScore: 75, // Default score
      estimatedValue: lead.budget ? parseInt(lead.budget.replace(/[^0-9]/g, '')) || 25000 : 25000,
      targetBuilders: [],
      matchingBuilders: 0,
      notificationsSent: 0,
      emailsSent: 0,
      smsSent: 0,
      specialRequests: lead.special_requests || '',
      createdAt: new Date(lead.created_at).getTime()
    })),
    ...safeQuoteRequests.map(quote => ({
      ...quote,
      id: quote.id,
      contactName: quote.contact_person || quote.company_name,
      tradeShowName: quote.trade_show || 'Not specified',
      city: 'Not specified',
      country: 'Not specified',
      standSize: quote.stand_size ? `${quote.stand_size} sqm` : 'Not specified',
      priority: (quote.priority || 'standard').toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH',
      leadScore: 80, // Default score for quote requests
      estimatedValue: quote.budget ? parseInt(quote.budget.replace(/[^0-9]/g, '')) || 30000 : 30000,
      source: 'quote_request',
      targetBuilders: quote.matched_builders || [],
      matchingBuilders: (quote.matched_builders || []).length,
      notificationsSent: 0,
      emailsSent: 0,
      smsSent: 0,
      specialRequests: quote.special_requests || '',
      createdAt: new Date(quote.created_at).getTime()
    }))
  ];

  console.log('🎯 SuperAdminLeadsManagerClient - Combined leads:', allLeads.length, allLeads);

  // Filter leads based on search and filters
  const filteredLeads = allLeads.filter(lead => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (!(
        lead.company_name?.toLowerCase().includes(searchLower) ||
        lead.contactName?.toLowerCase().includes(searchLower) ||
        lead.contact_email?.toLowerCase().includes(searchLower) ||
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
      Company: lead.company_name,
      Contact: lead.contactName,
      Email: lead.contact_email,
      Phone: lead.contact_phone || '',
      'Trade Show': lead.tradeShowName,
      'Stand Size': lead.standSize,
      Budget: lead.budget,
      Timeline: lead.timeline,
      Status: lead.status,
      Priority: lead.priority,
      'Created At': new Date(lead.createdAt).toLocaleString(),
      Country: lead.country,
      City: lead.city,
      'Special Requests': lead.specialRequests
    }));

    // Convert to CSV
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => 
      Object.values(row).map(field => 
        `"${String(field).replace(/"/g, '""')}"`
      ).join(',')
    );
    const csv = [headers, ...rows].join('\n');

    // Create download link
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
      
      const supabase = getServerSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }
      
      // Fetch leads from Supabase
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (leadsError) {
        throw new Error(`Failed to fetch leads: ${leadsError.message}`);
      }
      
      // Fetch quote requests from Supabase
      const { data: quotesData, error: quotesError } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (quotesError) {
        throw new Error(`Failed to fetch quote requests: ${quotesError.message}`);
      }
      
      setLeads(leadsData || []);
      setQuoteRequests(quotesData || []);
      toast.success('Data refreshed successfully');
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    
    switch (statusLower) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">New</Badge>;
      case 'assigned':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Assigned</Badge>;
      case 'contacted':
        return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Contacted</Badge>;
      case 'quoted':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Quoted</Badge>;
      case 'converted':
        return <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">Converted</Badge>;
      case 'lost':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Lost</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Cancelled</Badge>;
      case 'open':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Open</Badge>;
      case 'matched':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Matched</Badge>;
      case 'responded':
        return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Responded</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const priorityLower = priority.toLowerCase();
    
    switch (priorityLower) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>;
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Urgent</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{priority}</Badge>;
    }
  };

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

  if (error) {
    return (
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Error Loading Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refreshData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Leads & Quote Requests</h1>
          <p className="text-gray-600 mt-1">Manage all leads and quote requests in one place</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={exportLeads} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{safeLeads.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quote Requests</p>
                <p className="text-2xl font-bold text-gray-900">{safeQuoteRequests.length}</p>
              </div>
              <Send className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allLeads.filter(lead => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(lead.createdAt) > weekAgo;
                  }).length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {safeLeads.length > 0 
                    ? `${Math.round((safeLeads.filter(l => l.status === 'converted').length / safeLeads.length) * 100)}%` 
                    : '0%'}
                </p>
              </div>
              <Target className="h-8 w-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by company, contact, or event..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="matched">Matched</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {Array.from(new Set(allLeads.flatMap(lead => [lead.country, lead.city]).filter(Boolean)))
                  .slice(0, 20)
                  .map(location => (
                    <SelectItem key={location} value={location || ''}>
                      {location}
                    </SelectItem>
                  ))}
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all-leads">All ({allLeads.length})</TabsTrigger>
          <TabsTrigger value="leads">Leads ({safeLeads.length})</TabsTrigger>
          <TabsTrigger value="quotes">Quotes ({safeQuoteRequests.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-leads" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Leads & Quote Requests</CardTitle>
              <CardDescription>Recent leads and quote requests from clients</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredLeads.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No leads found</h3>
                  <p className="text-gray-500">Try adjusting your filters or check back later.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLeads.map((lead) => (
                    <div key={lead.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="bg-gray-100 rounded-full p-2">
                              <Building className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{lead.company_name || lead.contactName}</h3>
                              <p className="text-sm text-gray-600">{lead.contact_email} • {lead.contact_phone}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {lead.tradeShowName} • {lead.standSize} • {lead.budget}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          {getStatusBadge(lead.status)}
                          {getPriorityBadge(lead.priority)}
                          <span className="text-xs text-gray-500">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      {lead.specialRequests && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Special Requests:</span> {lead.specialRequests}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leads" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Leads</CardTitle>
              <CardDescription>Recent leads from clients</CardDescription>
            </CardHeader>
            <CardContent>
              {safeLeads.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No leads found</h3>
                  <p className="text-gray-500">There are currently no leads in the system.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {safeLeads
                    .filter(lead => {
                      if (searchTerm) {
                        const searchLower = searchTerm.toLowerCase();
                        return (
                          lead.company_name?.toLowerCase().includes(searchLower) ||
                          lead.contact_person?.toLowerCase().includes(searchLower) ||
                          lead.contact_email?.toLowerCase().includes(searchLower) ||
                          lead.trade_show_name?.toLowerCase().includes(searchLower) ||
                          lead.city?.toLowerCase().includes(searchLower) ||
                          lead.country?.toLowerCase().includes(searchLower)
                        );
                      }
                      return true;
                    })
                    .filter(lead => statusFilter === 'all' || lead.status === statusFilter)
                    .filter(lead => locationFilter === 'all' || 
                      (lead.country?.toLowerCase().includes(locationFilter.toLowerCase()) || 
                       lead.city?.toLowerCase().includes(locationFilter.toLowerCase())))
                    .filter(lead => {
                      if (dateFilter === 'all') return true;
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
                      
                      return new Date(lead.created_at) > filterDate;
                    })
                    .map((lead) => (
                      <div key={lead.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div className="bg-gray-100 rounded-full p-2">
                                <Building className="h-5 w-5 text-gray-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{lead.company_name}</h3>
                                <p className="text-sm text-gray-600">
                                  {lead.contact_person} • {lead.contact_email} • {lead.contact_phone}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {lead.trade_show_name} • {lead.stand_size ? `${lead.stand_size} sqm` : 'Size not specified'} • {lead.budget}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2">
                            {getStatusBadge(lead.status)}
                            {getPriorityBadge(lead.priority)}
                            <span className="text-xs text-gray-500">
                              {new Date(lead.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        {lead.special_requests && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Special Requests:</span> {lead.special_requests}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quotes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Quote Requests</CardTitle>
              <CardDescription>Recent quote requests from clients</CardDescription>
            </CardHeader>
            <CardContent>
              {safeQuoteRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No quote requests found</h3>
                  <p className="text-gray-500">There are currently no quote requests in the system.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {safeQuoteRequests
                    .filter(quote => {
                      if (searchTerm) {
                        const searchLower = searchTerm.toLowerCase();
                        return (
                          quote.company_name?.toLowerCase().includes(searchLower) ||
                          quote.contact_person?.toLowerCase().includes(searchLower) ||
                          quote.contact_email?.toLowerCase().includes(searchLower) ||
                          quote.trade_show?.toLowerCase().includes(searchLower)
                        );
                      }
                      return true;
                    })
                    .filter(quote => statusFilter === 'all' || quote.status === statusFilter)
                    .filter(quote => locationFilter === 'all' || 
                      quote.country?.toLowerCase().includes(locationFilter.toLowerCase()))
                    .filter(quote => {
                      if (dateFilter === 'all') return true;
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
                      
                      return new Date(quote.created_at) > filterDate;
                    })
                    .map((quote) => (
                      <div key={quote.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div className="bg-gray-100 rounded-full p-2">
                                <Send className="h-5 w-5 text-gray-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{quote.company_name}</h3>
                                <p className="text-sm text-gray-600">
                                  {quote.contact_person} • {quote.contact_email} • {quote.contact_phone}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {quote.trade_show} • {quote.stand_size ? `${quote.stand_size} sqm` : 'Size not specified'} • {quote.budget}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2">
                            {getStatusBadge(quote.status)}
                            {getPriorityBadge(quote.priority)}
                            <span className="text-xs text-gray-500">
                              {new Date(quote.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        {quote.special_requests && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Special Requests:</span> {quote.special_requests}
                            </p>
                          </div>
                        )}
                        
                        {quote.matched_builders && quote.matched_builders.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-500">
                              Matched with {quote.matched_builders.length} builder(s)
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}