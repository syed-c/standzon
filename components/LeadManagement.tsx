'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Mail, 
  Users, 
  Building, 
  MapPin, 
  DollarSign, 
  Clock, 
  Filter,
  Search,
  Send,
  Eye,
  AlertCircle,
  CheckCircle,
  Star,
  Phone,
  Calendar,
  Target,
  TrendingUp,
  Activity,
  ArrowRight,
  Download,
  Bell,
  Settings
} from 'lucide-react';

interface LeadRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName: string;
  eventName: string;
  eventDate: string;
  city: string;
  country: string;
  standSize: string;
  budget: string;
  requirements: string;
  status: 'new' | 'sent' | 'responded' | 'closed';
  submittedAt: string;
  matchedBuilders: string[];
  responses: LeadResponse[];
  priority: 'low' | 'medium' | 'high';
  source: string;
}

interface LeadResponse {
  builderId: string;
  builderName: string;
  responseTime: string;
  status: 'viewed' | 'quoted' | 'declined';
  quoteAmount?: number;
  notes?: string;
}

interface Builder {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  serviceAreas: string[];
  specializations: string[];
  verified: boolean;
  subscriptionPlan: 'free' | 'professional' | 'enterprise';
  responseRate: number;
  averageQuoteTime: string;
  leadsReceived: number;
  leadsResponded: number;
  isActive: boolean;
}

interface LeadManagementProps {
  onSendNotification: (leadId: string, builderIds: string[]) => Promise<void>;
  onUpdateLeadStatus: (leadId: string, status: string) => Promise<void>;
}

export default function LeadManagement({ onSendNotification, onUpdateLeadStatus }: LeadManagementProps) {
  const [activeTab, setActiveTab] = useState('leads');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data - in production this would come from API
  const [leads, setLeads] = useState<LeadRequest[]>([
    {
      id: 'L001',
      clientName: 'Sarah Johnson',
      clientEmail: 'sarah@techcorp.com',
      clientPhone: '+1 555 0123',
      companyName: 'TechCorp Industries',
      eventName: 'CES 2025',
      eventDate: '2025-01-07',
      city: 'Las Vegas',
      country: 'United States',
      standSize: '400 sqm',
      budget: '$40,000 - $50,000',
      requirements: 'Custom tech display with LED walls and interactive demos. Need advanced AV setup.',
      status: 'new',
      submittedAt: '2024-12-19T10:30:00Z',
      matchedBuilders: ['B001', 'B002', 'B003'],
      responses: [],
      priority: 'high',
      source: 'website'
    },
    {
      id: 'L002',
      clientName: 'Klaus Mueller',
      clientEmail: 'klaus@automotive.de',
      clientPhone: '+49 30 123456',
      companyName: 'Automotive Solutions GmbH',
      eventName: 'Hannover Messe 2025',
      eventDate: '2025-04-14',
      city: 'Hannover',
      country: 'Germany',
      standSize: '300 sqm',
      budget: '$30,000 - $40,000',
      requirements: 'Industrial machinery showcase with meeting areas and product demonstration zones.',
      status: 'sent',
      submittedAt: '2024-12-18T14:15:00Z',
      matchedBuilders: ['B004', 'B005'],
      responses: [
        {
          builderId: 'B004',
          builderName: 'Expo Design Germany',
          responseTime: '4 hours',
          status: 'quoted',
          quoteAmount: 35000,
          notes: 'Comprehensive solution with installation'
        }
      ],
      priority: 'medium',
      source: 'referral'
    },
    {
      id: 'L003',
      clientName: 'Maria Rodriguez',
      clientEmail: 'maria@fashion.es',
      clientPhone: '+34 91 123456',
      companyName: 'Fashion Elite',
      eventName: 'Paris Fashion Week',
      eventDate: '2025-03-02',
      city: 'Paris',
      country: 'France',
      standSize: '200 sqm',
      budget: '$25,000 - $35,000',
      requirements: 'Elegant fashion showcase with runway area and VIP lounge.',
      status: 'responded',
      submittedAt: '2024-12-17T09:45:00Z',
      matchedBuilders: ['B006', 'B007', 'B008'],
      responses: [
        {
          builderId: 'B006',
          builderName: 'Creative Booth Co',
          responseTime: '2 hours',
          status: 'quoted',
          quoteAmount: 28000
        },
        {
          builderId: 'B007',
          builderName: 'Premium Exhibits France',
          responseTime: '6 hours',
          status: 'quoted',
          quoteAmount: 32000
        }
      ],
      priority: 'medium',
      source: 'website'
    }
  ]);

  const [builders, setBuilders] = useState<Builder[]>([
    {
      id: 'B001',
      companyName: 'Smart Spaces Design',
      email: 'info@smartspaces.com',
      phone: '+1 702 555 0123',
      city: 'Las Vegas',
      country: 'United States',
      serviceAreas: ['Las Vegas', 'Los Angeles', 'San Francisco'],
      specializations: ['Technology', 'Custom Design', 'Interactive Displays'],
      verified: true,
      subscriptionPlan: 'professional',
      responseRate: 92,
      averageQuoteTime: '4 hours',
      leadsReceived: 156,
      leadsResponded: 143,
      isActive: true
    },
    {
      id: 'B002',
      companyName: 'Tech Exhibition Pro',
      email: 'contact@techexhibition.com',
      phone: '+1 702 555 0456',
      city: 'Las Vegas',
      country: 'United States',
      serviceAreas: ['Las Vegas', 'Phoenix', 'Denver'],
      specializations: ['Technology', 'LED Displays', 'Modular Systems'],
      verified: true,
      subscriptionPlan: 'enterprise',
      responseRate: 88,
      averageQuoteTime: '3 hours',
      leadsReceived: 203,
      leadsResponded: 179,
      isActive: true
    }
  ]);

  console.log('LeadManagement: Component loaded');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesCity = cityFilter === 'all' || lead.city === cityFilter;
    
    return matchesSearch && matchesStatus && matchesCity;
  });

  const leadStats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    sent: leads.filter(l => l.status === 'sent').length,
    responded: leads.filter(l => l.status === 'responded').length,
    conversionRate: Math.round((leads.filter(l => l.status === 'responded').length / leads.length) * 100)
  };

  const handleSendToBuilders = async (leadId: string) => {
    setIsLoading(true);
    console.log('Sending lead to matched builders:', leadId);
    
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      try {
        await onSendNotification(leadId, lead.matchedBuilders);
        
        setLeads(prev => prev.map(l => 
          l.id === leadId ? { ...l, status: 'sent' } : l
        ));
        
        console.log('Lead sent successfully');
      } catch (error) {
        console.error('Error sending lead:', error);
      }
    }
    
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'responded': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Lead Management System</h2>
          <p className="text-gray-600">Manage quote requests and builder lead flow</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure Matching
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
                <p className="text-orange-100 text-sm font-medium">Sent to Builders</p>
                <p className="text-3xl font-bold">{leadStats.sent}</p>
              </div>
              <Send className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Responses</p>
                <p className="text-3xl font-bold">{leadStats.responded}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium">Conversion Rate</p>
                <p className="text-3xl font-bold">{leadStats.conversionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-teal-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leads">Quote Requests</TabsTrigger>
          <TabsTrigger value="builders">Builder Network</TabsTrigger>
          <TabsTrigger value="matching">Lead Routing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    <SelectItem value="sent">Sent to Builders</SelectItem>
                    <SelectItem value="responded">Responded</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    <SelectItem value="Las Vegas">Las Vegas</SelectItem>
                    <SelectItem value="Hannover">Hannover</SelectItem>
                    <SelectItem value="Paris">Paris</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Leads List */}
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{lead.clientName}</h3>
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status.toUpperCase()}
                        </Badge>
                        <Badge className={getPriorityColor(lead.priority)}>
                          {lead.priority.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-gray-500 font-medium">Company</p>
                          <p className="font-semibold">{lead.companyName}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">Event</p>
                          <p className="font-semibold">{lead.eventName}</p>
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
                            {lead.budget}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-gray-500 font-medium">Stand Size</p>
                          <p>{lead.standSize}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">Event Date</p>
                          <p className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(lead.eventDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">Submitted</p>
                          <p className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(lead.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-500 font-medium mb-1">Requirements</p>
                        <p className="text-sm text-gray-700">{lead.requirements}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-500 font-medium mb-2">Matched Builders ({lead.matchedBuilders.length})</p>
                        <div className="flex items-center gap-2">
                          {lead.matchedBuilders.map((builderId, index) => (
                            <Badge key={builderId} variant="outline" className="text-xs">
                              Builder {index + 1}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {lead.responses.length > 0 && (
                        <div className="border-t pt-4">
                          <p className="text-gray-500 font-medium mb-2">Builder Responses</p>
                          <div className="space-y-2">
                            {lead.responses.map((response, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <span className="font-medium">{response.builderName}</span>
                                  <Badge className={
                                    response.status === 'quoted' ? 'bg-green-100 text-green-800' :
                                    response.status === 'viewed' ? 'bg-blue-100 text-blue-800' :
                                    'bg-red-100 text-red-800'
                                  }>
                                    {response.status}
                                  </Badge>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {response.quoteAmount && (
                                    <span className="font-medium">${response.quoteAmount.toLocaleString()}</span>
                                  )}
                                  <span className="ml-2">Response: {response.responseTime}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="h-4 w-4" />
                      {lead.clientEmail}
                      <Phone className="h-4 w-4 ml-4" />
                      {lead.clientPhone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      {lead.status === 'new' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleSendToBuilders(lead.id)}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-blue-500 to-blue-600"
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send to Builders
                        </Button>
                      )}
                      {lead.status === 'sent' && (
                        <Button variant="outline" size="sm">
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Track Progress
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Builder Network Management</CardTitle>
              <CardDescription>
                Manage builder profiles, service areas, and lead routing preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {builders.map((builder) => (
                  <div key={builder.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{builder.companyName}</h4>
                        <Badge className={builder.verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {builder.verified ? 'Verified' : 'Pending'}
                        </Badge>
                        <Badge variant="outline">{builder.subscriptionPlan}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Location</p>
                          <p>{builder.city}, {builder.country}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Response Rate</p>
                          <p>{builder.responseRate}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Avg. Quote Time</p>
                          <p>{builder.averageQuoteTime}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Leads Received</p>
                          <p>{builder.leadsReceived} ({builder.leadsResponded} responded)</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-500 text-sm">Service Areas: {builder.serviceAreas.join(', ')}</p>
                        <p className="text-gray-500 text-sm">Specializations: {builder.specializations.join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={builder.isActive} />
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matching" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Routing Configuration</CardTitle>
              <CardDescription>
                Configure how leads are matched and distributed to builders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Matching Criteria</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Geographic proximity</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Specialization match</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Budget alignment</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Response time priority</span>
                      <Switch />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Distribution Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Max builders per lead</label>
                      <Select defaultValue="5">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 builders</SelectItem>
                          <SelectItem value="5">5 builders</SelectItem>
                          <SelectItem value="7">7 builders</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Lead priority scoring</label>
                      <Select defaultValue="budget">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="budget">Budget-based</SelectItem>
                          <SelectItem value="timeline">Timeline-based</SelectItem>
                          <SelectItem value="size">Project size</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Leads Received</span>
                    <span className="font-bold">{leadStats.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sent to Builders</span>
                    <span className="font-bold">{leadStats.sent}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Builder Responses</span>
                    <span className="font-bold">{leadStats.responded}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Conversion Rate</span>
                    <span className="font-bold text-green-600">{leadStats.conversionRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Avg. Response Time</span>
                    <span className="font-bold">4.2 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Builder Response Rate</span>
                    <span className="font-bold">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Quote Win Rate</span>
                    <span className="font-bold">34%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Avg. Quote Value</span>
                    <span className="font-bold">$31,500</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}