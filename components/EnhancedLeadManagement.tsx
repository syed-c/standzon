'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Target, 
  Eye, 
  Lock, 
  Unlock, 
  DollarSign, 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  Phone,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Star,
  TrendingUp,
  FileText,
  Send,
  MessageSquare,
  Crown,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface Lead {
  id: string;
  projectName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventName: string;
  eventDate: string;
  city: string;
  country: string;
  venueName: string;
  standSize: string;
  budget: string;
  budgetCurrency: string;
  description: string;
  requirements: string[];
  urgency: 'low' | 'medium' | 'high';
  submittedAt: string;
  status: 'new' | 'viewed' | 'quoted' | 'accepted' | 'won' | 'lost';
  isUnlocked: boolean;
  unlockedAt?: string;
  quoteAmount?: number;
  quotedAt?: string;
  acceptedAt?: string;
  priority: number;
  builderResponse?: {
    responseTime: string;
    quoteAmount: number;
    message: string;
    attachments?: string[];
  };
  matchScore: number;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'free' | 'professional' | 'enterprise';
  monthlyLeadCredits: number;
  pricePerMonth: number;
  features: string[];
  unlimitedQuotes: boolean;
  premiumSupport: boolean;
  analyticsAccess: boolean;
}

interface EnhancedLeadManagementProps {
  builderId: string;
  builderEmail: string;
  currentPlan: 'free' | 'professional' | 'enterprise';
  leadCredits: number;
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    type: 'free',
    monthlyLeadCredits: 3,
    pricePerMonth: 0,
    features: ['3 lead unlocks per month', 'Basic profile', 'Standard support'],
    unlimitedQuotes: false,
    premiumSupport: false,
    analyticsAccess: false
  },
  {
    id: 'professional',
    name: 'Professional Plan',
    type: 'professional',
    monthlyLeadCredits: 25,
    pricePerMonth: 49,
    features: ['25 lead unlocks per month', 'Premium profile', 'Priority listing', 'Analytics dashboard'],
    unlimitedQuotes: true,
    premiumSupport: true,
    analyticsAccess: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    type: 'enterprise',
    monthlyLeadCredits: 100,
    pricePerMonth: 149,
    features: ['100 lead unlocks per month', 'Featured profile', 'Top listing priority', 'Advanced analytics', 'Custom support'],
    unlimitedQuotes: true,
    premiumSupport: true,
    analyticsAccess: true
  }
];

export default function EnhancedLeadManagement({ 
  builderId, 
  builderEmail, 
  currentPlan, 
  leadCredits 
}: EnhancedLeadManagementProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [unlockingLead, setUnlockingLead] = useState<string | null>(null);
  const [quotingLead, setQuotingLead] = useState<string | null>(null);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteMessage, setQuoteMessage] = useState('');

  // Load leads data
  useEffect(() => {
    loadLeads();
  }, [builderId, builderEmail]);

  const loadLeads = async () => {
    setLoading(true);
    console.log('🔍 Loading leads for builder:', { builderId, builderEmail });
    
    try {
      const response = await fetch(`/api/builders/leads?builderId=${builderId}&builderEmail=${encodeURIComponent(builderEmail)}`);
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Loaded ${result.data.leads.length} leads`);
        setLeads(result.data.leads);
      } else {
        console.error('❌ Failed to load leads:', result.error);
        // Create mock leads for demonstration
        setLeads(createMockLeads());
      }
    } catch (error) {
      console.error('❌ Error loading leads:', error);
      // Create mock leads for demonstration
      setLeads(createMockLeads());
    } finally {
      setLoading(false);
    }
  };

  const createMockLeads = (): Lead[] => {
    return [
      {
        id: 'lead-001',
        projectName: 'Technology Expo Booth',
        clientName: 'Sarah Johnson',
        clientEmail: 'sarah@techexpo.com',
        clientPhone: '+1-555-0123',
        eventName: 'CES Las Vegas 2024',
        eventDate: '2024-01-09',
        city: 'Las Vegas',
        country: 'United States',
        venueName: 'Las Vegas Convention Center',
        standSize: '6x6m',
        budget: '15000-25000',
        budgetCurrency: 'USD',
        description: 'Looking for a modern, technology-focused exhibition stand for our AI software company.',
        requirements: ['LED displays', 'Interactive demos', 'Meeting area', 'Storage'],
        urgency: 'high',
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'new',
        isUnlocked: false,
        priority: 95,
        matchScore: 92
      },
      {
        id: 'lead-002',
        projectName: 'Healthcare Summit Stand',
        clientName: 'Dr. Michael Chen',
        clientEmail: 'mchen@healthsummit.org',
        clientPhone: '+1-555-0456',
        eventName: 'Healthcare Innovation Summit',
        eventDate: '2024-02-15',
        city: 'Los Angeles',
        country: 'United States',
        venueName: 'LA Convention Center',
        standSize: '4x4m',
        budget: '8000-12000',
        budgetCurrency: 'USD',
        description: 'Need a clean, professional stand for medical device exhibition.',
        requirements: ['Product displays', 'Brochure holders', 'Seating area'],
        urgency: 'medium',
        submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'new',
        isUnlocked: false,
        priority: 87,
        matchScore: 85
      },
      {
        id: 'lead-003',
        projectName: 'Green Energy Showcase',
        clientName: 'Emma Thompson',
        clientEmail: 'emma@greenenergy.com',
        clientPhone: '+1-555-0789',
        eventName: 'Renewable Energy Expo',
        eventDate: '2024-03-20',
        city: 'San Francisco',
        country: 'United States',
        venueName: 'Moscone Center',
        standSize: '8x8m',
        budget: '20000-30000',
        budgetCurrency: 'USD',
        description: 'Sustainable exhibition stand showcasing solar panel technology.',
        requirements: ['Eco-friendly materials', 'Power displays', 'Information kiosks'],
        urgency: 'low',
        submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'viewed',
        isUnlocked: true,
        unlockedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        priority: 78,
        matchScore: 80
      }
    ];
  };

  const unlockLead = async (leadId: string) => {
    if (leadCredits <= 0) {
      toast.error('No lead credits remaining. Please upgrade your plan.');
      return;
    }

    setUnlockingLead(leadId);
    console.log('🔓 Unlocking lead:', leadId);

    try {
      const response = await fetch('/api/builders/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          action: 'unlock',
          builderId,
          builderEmail
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setLeads(prev => prev.map(lead => 
          lead.id === leadId 
            ? { ...lead, isUnlocked: true, unlockedAt: new Date().toISOString(), status: 'viewed' }
            : lead
        ));
        
        toast.success('Lead unlocked successfully! Full contact details are now available.');
        console.log('✅ Lead unlocked successfully');
      } else {
        toast.error(result.error || 'Failed to unlock lead');
      }
    } catch (error) {
      console.error('❌ Error unlocking lead:', error);
      toast.error('Failed to unlock lead. Please try again.');
    } finally {
      setUnlockingLead(null);
    }
  };

  const submitQuote = async (leadId: string) => {
    if (!quoteAmount || !quoteMessage) {
      toast.error('Please enter both quote amount and message');
      return;
    }

    setQuotingLead(leadId);
    console.log('💰 Submitting quote for lead:', leadId);

    try {
      const response = await fetch('/api/builders/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          action: 'quote',
          builderId,
          builderEmail,
          quoteData: {
            amount: parseFloat(quoteAmount),
            message: quoteMessage,
            submittedAt: new Date().toISOString()
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setLeads(prev => prev.map(lead => 
          lead.id === leadId 
            ? { 
                ...lead, 
                status: 'quoted', 
                quoteAmount: parseFloat(quoteAmount),
                quotedAt: new Date().toISOString(),
                builderResponse: {
                  responseTime: 'Just now',
                  quoteAmount: parseFloat(quoteAmount),
                  message: quoteMessage
                }
              }
            : lead
        ));
        
        setQuoteAmount('');
        setQuoteMessage('');
        setSelectedLead(null);
        
        toast.success('Quote submitted successfully! Client will be notified.');
        console.log('✅ Quote submitted successfully');
      } else {
        toast.error(result.error || 'Failed to submit quote');
      }
    } catch (error) {
      console.error('❌ Error submitting quote:', error);
      toast.error('Failed to submit quote. Please try again.');
    } finally {
      setQuotingLead(null);
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    const variants = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return variants[urgency as keyof typeof variants] || variants.medium;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      viewed: 'bg-purple-100 text-purple-800 border-purple-200',
      quoted: 'bg-orange-100 text-orange-800 border-orange-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      won: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      lost: 'bg-red-100 text-red-800 border-red-200'
    };
    return variants[status as keyof typeof variants] || variants.new;
  };

  const filterLeads = (status: string) => {
    switch (status) {
      case 'available':
        return leads.filter(lead => ['new', 'viewed'].includes(lead.status));
      case 'quoted':
        return leads.filter(lead => lead.status === 'quoted');
      case 'active':
        return leads.filter(lead => ['accepted', 'won'].includes(lead.status));
      case 'archived':
        return leads.filter(lead => lead.status === 'lost');
      default:
        return leads;
    }
  };

  const currentPlanData = SUBSCRIPTION_PLANS.find(plan => plan.type === currentPlan);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lead Credits & Plan Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Lead Credits</CardTitle>
            <Target className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadCredits}</div>
            <p className="text-xs opacity-90">Available this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Current Plan</CardTitle>
            <Crown className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPlanData?.name}</div>
            <p className="text-xs opacity-90">{currentPlanData?.monthlyLeadCredits} credits/month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs opacity-90">Above average</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Credits Warning */}
      {leadCredits <= 3 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="flex items-center justify-between">
              <span>
                <strong>Low on credits!</strong> Only {leadCredits} lead credits remaining this month.
              </span>
              <Button size="sm" className="ml-4">
                <CreditCard className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Leads Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Lead Management</span>
          </CardTitle>
          <CardDescription>
            Manage incoming leads and project requests from potential clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="available">
                Available ({filterLeads('available').length})
              </TabsTrigger>
              <TabsTrigger value="quoted">
                Quoted ({filterLeads('quoted').length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Active ({filterLeads('active').length})
              </TabsTrigger>
              <TabsTrigger value="archived">
                Archived ({filterLeads('archived').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-4">
              <div className="grid gap-4">
                {filterLeads('available').map((lead) => (
                  <Card key={lead.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="font-semibold text-lg">{lead.projectName}</h3>
                            <Badge className={getUrgencyBadge(lead.urgency)}>
                              {lead.urgency} priority
                            </Badge>
                            <Badge className={getStatusBadge(lead.status)}>
                              {lead.status}
                            </Badge>
                            <div className="flex items-center text-sm text-green-600">
                              <Star className="h-4 w-4 mr-1" />
                              {lead.matchScore}% match
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {new Date(lead.eventDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {lead.city}, {lead.country}
                            </div>
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-2" />
                              {lead.standSize}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2" />
                              ${lead.budget} {lead.budgetCurrency}
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4 line-clamp-2">{lead.description}</p>

                          {!lead.isUnlocked && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                              <div className="flex items-center text-gray-600 mb-2">
                                <Lock className="h-4 w-4 mr-2" />
                                <span className="font-medium">Full contact details locked</span>
                              </div>
                              <p className="text-sm text-gray-500">
                                Unlock to view client email, phone, and submit your quote
                              </p>
                            </div>
                          )}

                          {lead.isUnlocked && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-2 text-green-600" />
                                  <span>{lead.clientName}</span>
                                </div>
                                <div className="flex items-center">
                                  <Mail className="h-4 w-4 mr-2 text-green-600" />
                                  <span>{lead.clientEmail}</span>
                                </div>
                                <div className="flex items-center">
                                  <Phone className="h-4 w-4 mr-2 text-green-600" />
                                  <span>{lead.clientPhone}</span>
                                </div>
                                <div className="flex items-center">
                                  <Building className="h-4 w-4 mr-2 text-green-600" />
                                  <span>{lead.venueName}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col space-y-2 ml-6">
                          {!lead.isUnlocked ? (
                            <Button
                              onClick={() => unlockLead(lead.id)}
                              disabled={unlockingLead === lead.id || leadCredits <= 0}
                              size="sm"
                            >
                              {unlockingLead === lead.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Unlocking...
                                </>
                              ) : (
                                <>
                                  <Unlock className="h-4 w-4 mr-2" />
                                  Unlock Lead
                                </>
                              )}
                            </Button>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" onClick={() => setSelectedLead(lead)}>
                                  <Send className="h-4 w-4 mr-2" />
                                  Submit Quote
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Submit Quote - {lead.projectName}</DialogTitle>
                                  <DialogDescription>
                                    Provide your quote and message for {lead.clientName}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium">Quote Amount ({lead.budgetCurrency})</label>
                                    <Input
                                      type="number"
                                      placeholder="Enter your quote amount"
                                      value={quoteAmount}
                                      onChange={(e) => setQuoteAmount(e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium">Quote Message</label>
                                    <textarea
                                      className="w-full mt-1 p-3 border rounded-md resize-none"
                                      rows={4}
                                      placeholder="Introduce your company and explain your approach to this project..."
                                      value={quoteMessage}
                                      onChange={(e) => setQuoteMessage(e.target.value)}
                                    />
                                  </div>
                                  
                                  <Button
                                    onClick={() => submitQuote(lead.id)}
                                    disabled={quotingLead === lead.id}
                                    className="w-full"
                                  >
                                    {quotingLead === lead.id ? (
                                      <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Submitting Quote...
                                      </>
                                    ) : (
                                      <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Submit Quote
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          
                          <div className="text-xs text-gray-500 text-center">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {new Date(lead.submittedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filterLeads('available').length === 0 && (
                  <div className="text-center py-12">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No available leads at the moment</p>
                    <p className="text-sm text-gray-400">
                      New leads matching your service areas will appear here
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="quoted" className="space-y-4">
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Quoted leads will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Active projects will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="archived" className="space-y-4">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Archived leads will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Upgrade Plan Prompt */}
      {currentPlan === 'free' && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-purple-900 mb-2">Unlock More Opportunities</h3>
                <p className="text-purple-700 text-sm mb-2">
                  Upgrade to Professional plan for 25 monthly lead credits and priority listing
                </p>
                <div className="flex items-center space-x-4 text-sm text-purple-600">
                  <span className="flex items-center">
                    <Zap className="h-4 w-4 mr-1" />
                    25x more leads
                  </span>
                  <span className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Priority listing
                  </span>
                  <span className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Analytics dashboard
                  </span>
                </div>
              </div>
              <Button className="bg-purple-600">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}