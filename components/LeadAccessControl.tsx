'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, Calendar, MapPin, Star, TrendingUp, 
  DollarSign, Target, AlertCircle, CheckCircle,
  Eye, EyeOff, Settings, Bell, CreditCard, 
  Mail, Phone, Globe, Lock, Unlock
} from 'lucide-react';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

interface Lead {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  exhibitionName: string;
  boothSize: string;
  country: string;
  city: string;
  budget: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
  builderId: string;
  builderName: string;
  timestamp: string;
  status: 'new' | 'viewed' | 'contacted' | 'quoted' | 'won' | 'lost';
  leadScore: number;
  estimatedValue: number;
  accessLevel: 'basic' | 'full';
}

interface LeadAccessControlProps {
  builderId: string;
  builderName: string;
  planType: 'free' | 'basic' | 'professional' | 'enterprise';
  isActive: boolean;
}

function getAccessLevelForPlan(planType: string) {
  switch (planType) {
    case 'enterprise':
      return { leadsPerMonth: 'Unlimited', dataAccess: 'Full', responseTime: 'Instant', priority: 'Highest' };
    case 'professional':
      return { leadsPerMonth: '50', dataAccess: 'Full', responseTime: '< 1 hour', priority: 'High' };
    case 'basic':
      return { leadsPerMonth: '10', dataAccess: 'Limited', responseTime: '< 4 hours', priority: 'Medium' };
    case 'free':
      return { leadsPerMonth: '3', dataAccess: 'Basic only', responseTime: '< 24 hours', priority: 'Low' };
    default:
      return { leadsPerMonth: '0', dataAccess: 'None', responseTime: 'None', priority: 'None' };
  }
}

function LeadCard({ lead, builderPlan, isActive }: { 
  lead: Lead; 
  builderPlan: string; 
  isActive: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [leadStatus, setLeadStatus] = useState(lead.status);
  const { toast } = useToast();

  const canAccessFullData = isActive && ['professional', 'enterprise'].includes(builderPlan);
  const canAccessBasicData = isActive && ['basic', 'professional', 'enterprise'].includes(builderPlan);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      console.log('🔄 Updating lead status:', lead.id, newStatus);
      setLeadStatus(newStatus as any);
      
      toast({
        title: "Status Updated",
        description: `Lead status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('❌ Error updating lead status:', error);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'viewed': return 'bg-purple-100 text-purple-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'quoted': return 'bg-orange-100 text-orange-800';
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!canAccessBasicData) {
    return (
      <Card className="border-dashed border-gray-300 bg-gray-50">
        <CardContent className="p-6 text-center">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-600 mb-2">Lead Available</h3>
          <p className="text-sm text-gray-500 mb-4">
            Upgrade your plan to access lead details and contact information
          </p>
          <Button size="sm" className="bg-blue-600">
            <CreditCard className="w-4 h-4 mr-2" />
            Upgrade Plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`transition-all duration-200 ${leadStatus === 'new' ? 'border-blue-500 shadow-md' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={getUrgencyColor(lead.urgency)}>
                {lead.urgency} priority
              </Badge>
              <Badge className={getStatusColor(leadStatus)}>
                {leadStatus}
              </Badge>
              <Badge variant="outline" className="text-green-600">
                Score: {lead.leadScore}/100
              </Badge>
            </div>
            
            <CardTitle className="text-lg">
              {canAccessFullData ? lead.companyName : '••••••• Company'}
            </CardTitle>
            
            <CardDescription>
              {lead.exhibitionName} • {lead.boothSize} • {lead.country}
            </CardDescription>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-green-600">
              ${lead.estimatedValue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(lead.timestamp).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Basic Information (available to all paid plans) */}
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>{lead.exhibitionName}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{lead.city}, {lead.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-500" />
              <span>{lead.boothSize}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span>{lead.budget}</span>
            </div>
          </div>
        </div>

        {/* Contact Information (full access only) */}
        {canAccessFullData ? (
          <div className="border-t pt-4 mb-4">
            <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Unlock className="w-4 h-4 text-green-500" />
              Contact Information
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                  {lead.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                  {lead.phone}
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-t pt-4 mb-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-yellow-800 text-sm">
                <Lock className="w-4 h-4" />
                <span>Contact details available with Professional or Enterprise plan</span>
              </div>
            </div>
          </div>
        )}

        {/* Message (truncated for basic plans) */}
        {lead.message && (
          <div className="border-t pt-4 mb-4">
            <h5 className="font-medium text-gray-900 mb-2">Requirements</h5>
            <p className="text-sm text-gray-700">
              {canAccessFullData || lead.message.length <= 100 ? 
                lead.message : 
                `${lead.message.substring(0, 100)}... `
              }
              {!canAccessFullData && lead.message.length > 100 && (
                <span className="text-blue-600 font-medium">
                  (Upgrade to read full message)
                </span>
              )}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          {canAccessFullData ? (
            <>
              <Button size="sm" className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Send Quote
              </Button>
              <Button size="sm" variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
              <Select value={leadStatus} onValueChange={handleStatusUpdate}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="viewed">Viewed</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="quoted">Quoted</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </>
          ) : (
            <Button size="sm" className="flex-1 bg-blue-600">
              <CreditCard className="w-4 h-4 mr-2" />
              Upgrade to Contact
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function LeadAccessControl({ builderId, builderName, planType, isActive }: LeadAccessControlProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [planDetails, setPlanDetails] = useState(getAccessLevelForPlan(planType));
  const { toast } = useToast();

  useEffect(() => {
    const loadLeads = async () => {
      try {
        console.log('📋 Loading leads for builder:', builderId);
        
        // Simulate API call to fetch leads for this builder
        const mockLeads: Lead[] = [
          {
            id: 'lead_001',
            companyName: 'TechCorp Solutions',
            email: 'john.doe@techcorp.com',
            phone: '+1 (555) 123-4567',
            exhibitionName: 'CES 2025',
            boothSize: 'Large (9x9m)',
            country: 'United States',
            city: 'Las Vegas',
            budget: '$50,000 - $100,000',
            message: 'Looking for a modern, tech-focused exhibition stand with interactive displays and LED walls. Need delivery by January 2025.',
            urgency: 'high',
            builderId,
            builderName,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            status: 'new',
            leadScore: 85,
            estimatedValue: 75000,
            accessLevel: isActive && ['professional', 'enterprise'].includes(planType) ? 'full' : 'basic'
          },
          {
            id: 'lead_002',
            companyName: 'Global Innovations Ltd',
            email: 'sarah.smith@globalinnovations.com',
            phone: '+44 20 7123 4567',
            exhibitionName: 'Hannover Messe',
            boothSize: 'Medium (6x6m)',
            country: 'Germany',
            city: 'Hannover',
            budget: '$25,000 - $50,000',
            message: 'Need a professional booth for industrial machinery showcase. Prefer minimalist design with product display areas.',
            urgency: 'medium',
            builderId,
            builderName,
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            status: 'viewed',
            leadScore: 72,
            estimatedValue: 37500,
            accessLevel: isActive && ['professional', 'enterprise'].includes(planType) ? 'full' : 'basic'
          }
        ];

        setLeads(mockLeads);
        setPlanDetails(getAccessLevelForPlan(planType));
        
      } catch (error) {
        console.error('❌ Error loading leads:', error);
        toast({
          title: "Error Loading Leads",
          description: "There was an error loading your leads. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, [builderId, planType, isActive, toast]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plan Status Header */}
      <Card className={`${isActive ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isActive ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            Lead Access Status - {planType.charAt(0).toUpperCase() + planType.slice(1)} Plan
          </CardTitle>
          <CardDescription>
            {isActive ? 
              `Your plan allows ${planDetails.leadsPerMonth} leads per month with ${planDetails.dataAccess.toLowerCase()} data access` :
              'Your plan is inactive. Activate to start receiving leads.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{planDetails.leadsPerMonth}</div>
              <div className="text-sm text-gray-600">Leads/Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{planDetails.dataAccess}</div>
              <div className="text-sm text-gray-600">Data Access</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{planDetails.responseTime}</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{planDetails.priority}</div>
              <div className="text-sm text-gray-600">Priority</div>
            </div>
          </div>
          
          {!isActive && (
            <div className="mt-4 pt-4 border-t">
              <Button className="bg-blue-600">
                <CreditCard className="w-4 h-4 mr-2" />
                Activate Plan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leads List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Leads ({leads.length})</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {leads.length > 0 ? (
          <div className="space-y-4">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                builderPlan={planType}
                isActive={isActive}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No leads yet</h3>
              <p className="text-gray-500 mb-4">
                {isActive ? 
                  'Leads will appear here as customers submit inquiries.' :
                  'Activate your plan to start receiving leads.'
                }
              </p>
              {!isActive && (
                <Button className="bg-blue-600">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Activate Plan
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default LeadAccessControl;