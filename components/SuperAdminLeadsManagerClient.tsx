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
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

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

  // Load leads from Convex
  const leads = useQuery(api.admin.getAllLeads) || initialLeads;
  const quoteRequests = useQuery(api.admin.getAllQuoteRequests) || initialQuoteRequests;

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
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Leads exported successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      case 'quoted': return 'bg-orange-100 text-orange-800';
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'standard': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const leadStats = {
    total: allLeads.length,
    new: allLeads.filter(l => l.status === 'new' || l.status === 'Open').length,
    inProgress: allLeads.filter(l => ['assigned', 'contacted', 'Matched', 'Responded'].includes(l.status)).length,
    totalValue: allLeads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0),
    avgScore: allLeads.length > 0 ? Math.round(allLeads.reduce((sum, lead) => sum + lead.leadScore, 0) / allLeads.length) : 0
  };

  if (leads === undefined || quoteRequests === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading leads from Convex...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SuperAdmin Lead Management</h1>
          <p className="text-gray-600">Real-time lead tracking from Convex database - {allLeads.length} total leads</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportLeads}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600">
            <Bell className="h-4 w-4 mr-2" />
            Send Notifications
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Leads</p>
                <p className="text-3xl font-bold">{leadStats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">New Leads</p>
                <p className="text-3xl font-bold">{leadStats.new}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold">{leadStats.inProgress}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Value</p>
                <p className="text-3xl font-bold">${(leadStats.totalValue / 1000).toFixed(0)}K</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium">Avg Score</p>
                <p className="text-3xl font-bold">{leadStats.avgScore}</p>
              </div>
              <Star className="h-8 w-8 text-teal-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="germany">Germany</SelectItem>
                <SelectItem value="uae">UAE</SelectItem>
                <SelectItem value="united states">United States</SelectItem>
                <SelectItem value="france">France</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scrollable Leads List Container */}
      <div className="flex-1 min-h-0">
        <div className="h-full max-h-[calc(100vh-500px)] overflow-y-auto pr-2">
          <div className="space-y-4">
            {filteredLeads.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
                  <p className="text-gray-600">
                    {allLeads.length === 0 
                      ? "No leads have been submitted yet. Leads will appear here when users submit quote requests."
                      : "Try adjusting your filters or search terms."
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredLeads.map((lead) => (
                <Card key={lead.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{lead.contactName}</h3>
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status.toUpperCase()}
                          </Badge>
                          <Badge className={getPriorityColor(lead.priority)}>
                            {lead.priority}
                          </Badge>
                          <Badge variant="outline">
                            Score: {lead.leadScore}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-gray-500 font-medium">Company</p>
                            <p className="font-semibold">{lead.companyName}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 font-medium">Exhibition</p>
                            <p className="font-semibold">{lead.tradeShowName}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 font-medium">Location</p>
                            <p className="font-semibold flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {lead.city}, {lead.country}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 font-medium">Budget</p>
                            <p className="font-semibold flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {lead.budget || 'Not specified'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-gray-500 font-medium">Stand Size</p>
                            <p>{lead.standSize}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 font-medium">Timeline</p>
                            <p className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {lead.timeline || 'Not specified'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 font-medium">Submitted</p>
                            <p className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {lead.specialRequests && (
                          <div className="mb-4">
                            <p className="text-gray-500 font-medium mb-1">Requirements</p>
                            <p className="text-sm text-gray-700">{lead.specialRequests}</p>
                          </div>
                        )}

                        <div className="mb-4">
                          <p className="text-gray-500 font-medium mb-2">Builder Notifications</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center">
                              <Building className="h-4 w-4 mr-1" />
                              {lead.matchingBuilders} Matched
                            </span>
                            <span className="flex items-center">
                              <Send className="h-4 w-4 mr-1" />
                              {lead.notificationsSent} Notified
                            </span>
                            <span className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {lead.emailsSent} Emails
                            </span>
                            <span className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {lead.smsSent} SMS
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="h-4 w-4" />
                        {lead.contactEmail}
                        {lead.contactPhone && (
                          <>
                            <Phone className="h-4 w-4 ml-4" />
                            {lead.contactPhone}
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // Show detailed lead information
                            alert(`Lead Details:

Company: ${lead.companyName}
Contact: ${lead.contactName}
Email: ${lead.contactEmail}
Phone: ${lead.contactPhone || 'Not provided'}
Exhibition: ${lead.tradeShowName}
Location: ${lead.city}, ${lead.country}
Stand Size: ${lead.standSize}
Budget: ${lead.budget || 'Not specified'}
Timeline: ${lead.timeline || 'Not specified'}
Requirements: ${lead.specialRequests || 'None'}
Submitted: ${new Date(lead.createdAt).toLocaleString()}`);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-blue-500 to-blue-600"
                          onClick={async () => {
                            try {
                              console.log('🔔 Managing lead:', lead.id, 'Location:', `${lead.city}, ${lead.country}`);
                              
                              const response = await fetch('/api/leads/manage', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  leadId: lead.id,
                                  leadData: {
                                    companyName: lead.companyName,
                                    contactName: lead.contactName,
                                    contactEmail: lead.contactEmail,
                                    contactPhone: lead.contactPhone,
                                    exhibitionName: lead.tradeShowName,
                                    location: `${lead.city}, ${lead.country}`,
                                    city: lead.city,
                                    country: lead.country,
                                    standSize: lead.standSize,
                                    budget: lead.budget,
                                    timeline: lead.timeline,
                                    specialRequirements: lead.specialRequests,
                                    priority: lead.priority,
                                    source: lead.source
                                  }
                                })
                              });
                              
                              const result = await response.json();
                              
                              if (result.success) {
                                toast.success(`✅ Successfully notified ${result.buildersNotified || 0} builders in ${lead.city}, ${lead.country}`);
                                console.log('✅ Lead management successful:', result);
                              } else {
                                toast.error(`❌ Failed to manage lead: ${result.error || 'Unknown error'}`);
                                console.error('❌ Lead management failed:', result);
                              }
                            } catch (error) {
                              console.error('❌ Error managing lead:', error);
                              toast.error('❌ Network error while managing lead');
                            }
                          }}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Manage Lead
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}