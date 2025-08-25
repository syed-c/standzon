"use client";

// Intelligent Quote Management Dashboard - Phase 4 Implementation
// Real-time quote processing with advanced builder matching

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

import { 
  FiUsers, FiMapPin, FiCalendar, FiDollarSign, FiTrendingUp, 
  FiSettings, FiFilter, FiBarChart, FiTarget, FiZap, FiClock,
  FiAlertCircle, FiSearch, FiRefreshCw, FiEye, FiStar, 
  FiCheckCircle, FiSend, FiHeart
} from 'react-icons/fi';

import { ExhibitionBuilder, QuoteRequest, QuoteResponse } from '@/lib/data/exhibitionBuilders';
import IntelligentQuoteMatchingEngine, { BuilderMatch, MatchingPreferences } from '@/lib/services/intelligentQuoteMatching';
import { TradeShow } from '@/lib/data/tradeShows';

interface QuoteManagerProps {
  adminMode?: boolean;
  clientView?: boolean;
}

// Mock data for demonstration
const mockQuoteRequests: QuoteRequest[] = [
  {
    id: 'quote-001',
    userId: 'user-123',
    tradeShow: 'CES 2025',
    tradeShowSlug: 'ces-2025',
    standSize: 100,
    budget: 'Mid-range',
    timeline: '3 months',
    requirements: ['Custom Design', 'Technology Integration', 'LED Displays'],
    companyName: 'TechNova Inc.',
    contactEmail: 'sarah@technova.com',
    contactPhone: '+1 555 0123',
    contactPerson: 'Sarah Johnson',
    specialRequests: 'Need VR demonstration area and meeting rooms',
    createdAt: '2024-12-20T10:00:00Z',
    status: 'Open',
    matchedBuilders: [],
    responses: [],
    priority: 'High'
  },
  {
    id: 'quote-002',
    userId: 'user-456',
    tradeShow: 'Hannover Messe 2025',
    tradeShowSlug: 'hannover-messe-2025',
    standSize: 200,
    budget: 'Premium',
    timeline: '4 months',
    requirements: ['Industrial Design', 'Heavy Machinery Display', 'Safety Compliance'],
    companyName: 'Industrial Solutions GmbH',
    contactEmail: 'mueller@industrial-solutions.de',
    contactPhone: '+49 30 1234567',
    contactPerson: 'Hans Mueller',
    specialRequests: 'Crane access required for machinery installation',
    createdAt: '2024-12-19T14:30:00Z',
    status: 'Matched',
    matchedBuilders: ['expo-design-germany'],
    responses: [],
    priority: 'Standard'
  },
  {
    id: 'quote-003',
    userId: 'user-789',
    tradeShow: 'MEDICA 2025',
    tradeShowSlug: 'medica-2025',
    standSize: 75,
    budget: 'Budget-friendly',
    timeline: '2 months',
    requirements: ['Medical Compliance', 'Clean Room Setup', 'Product Displays'],
    companyName: 'MedTech Innovations',
    contactEmail: 'info@medtech-innovations.com',
    contactPhone: '+1 555 0456',
    contactPerson: 'Dr. Emily Chen',
    specialRequests: 'FDA compliance documentation needed',
    createdAt: '2024-12-18T09:15:00Z',
    status: 'Responded',
    matchedBuilders: ['new-york-exhibition-masters'],
    responses: [
      {
        builderId: 'new-york-exhibition-masters',
        builderName: 'New York Exhibition Masters',
        responseDate: '2024-12-19T11:00:00Z',
        estimatedCost: 45000,
        currency: 'USD',
        timeline: '8 weeks',
        proposal: 'Complete medical exhibition solution with FDA compliance',
        inclusions: ['Design & Build', 'FDA Documentation', 'Installation', 'Support'],
        status: 'Pending',
        viewedByClient: false
      }
    ],
    priority: 'Urgent'
  }
];

export default function IntelligentQuoteManager({ adminMode = false, clientView = false }: QuoteManagerProps) {
  console.log('IntelligentQuoteManager loaded:', { adminMode, clientView });

  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>(mockQuoteRequests);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [builderMatches, setBuilderMatches] = useState<BuilderMatch[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [matchingPreferences, setMatchingPreferences] = useState<MatchingPreferences>({
    prioritizeExperience: true,
    prioritizeCost: false,
    prioritizeSustainability: false,
    prioritizeLocalBuilders: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Filter quote requests
  const filteredQuotes = useMemo(() => {
    return quoteRequests.filter(quote => {
      const matchesSearch = searchTerm === '' || 
        quote.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.tradeShow.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || quote.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [quoteRequests, searchTerm, statusFilter, priorityFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = quoteRequests.length;
    const open = quoteRequests.filter(q => q.status === 'Open').length;
    const matched = quoteRequests.filter(q => q.status === 'Matched').length;
    const responded = quoteRequests.filter(q => q.status === 'Responded').length;
    const urgent = quoteRequests.filter(q => q.priority === 'Urgent').length;
    
    const avgResponseTime = '4.2 hours'; // Mock data
    const matchSuccess = Math.round((matched + responded) / total * 100);

    return {
      total,
      open,
      matched,
      responded,
      urgent,
      avgResponseTime,
      matchSuccess
    };
  }, [quoteRequests]);

  // Handle intelligent matching
  const handleIntelligentMatching = async (quote: QuoteRequest) => {
    console.log('Starting intelligent matching for quote:', quote.id);
    setIsMatching(true);
    setSelectedQuote(quote);

    try {
      // Simulate API call to intelligent matching engine
      // In real implementation, this would call the backend
      const mockMatches: BuilderMatch[] = [
        {
          builder: {
            id: 'expo-design-germany',
            companyName: 'Expo Design Germany',
            slug: 'expo-design-germany',
            rating: 4.8,
            reviewCount: 127,
            headquarters: { city: 'Berlin', country: 'Germany', countryCode: 'DE' },
            serviceLocations: [
              { city: 'Berlin', country: 'Germany', countryCode: 'DE' },
              { city: 'Munich', country: 'Germany', countryCode: 'DE' }
            ],
            verified: true,
            premiumMember: true,
            responseTime: 'Within 2 hours',
            keyStrengths: ['Technology Integration', 'Award-Winning Design', 'Fast Response'],
            priceRange: {
              basicStand: { min: 180, max: 280, currency: 'EUR', unit: 'per sqm' },
              customStand: { min: 450, max: 850, currency: 'EUR', unit: 'per sqm' },
              premiumStand: { min: 850, max: 1200, currency: 'EUR', unit: 'per sqm' },
              averageProject: 75000,
              currency: 'EUR'
            }
          } as ExhibitionBuilder,
          matchScore: 94,
          matchBreakdown: {
            geographicProximity: 85,
            experienceLevel: 95,
            qualityMetrics: 98,
            availabilityScore: 90,
            serviceFit: 92,
            responseTime: 100,
            priceAlignment: 88,
            sustainabilityMatch: 85
          },
          estimatedCost: 67500,
          recommendationReasons: [
            'Extensive experience with technology exhibitions',
            'Local presence in Germany with fast response time',
            'Award-winning design team with 15+ years experience',
            'Premium certified builder with excellent ratings'
          ],
          riskFactors: [],
          timeToCompletion: 42,
          confidence: 'High'
        },
        {
          builder: {
            id: 'premier-exhibits-usa',
            companyName: 'Premier Exhibits USA',
            slug: 'premier-exhibits-usa',
            rating: 4.7,
            reviewCount: 89,
            headquarters: { city: 'Las Vegas', country: 'United States', countryCode: 'US' },
            serviceLocations: [
              { city: 'Las Vegas', country: 'United States', countryCode: 'US' },
              { city: 'Los Angeles', country: 'United States', countryCode: 'US' }
            ],
            verified: true,
            premiumMember: true,
            responseTime: 'Within 4 hours',
            keyStrengths: ['CES Specialists', 'Technology Integration', 'Experiential Marketing'],
            priceRange: {
              basicStand: { min: 8, max: 15, currency: 'USD', unit: 'per sqft' },
              customStand: { min: 25, max: 50, currency: 'USD', unit: 'per sqft' },
              premiumStand: { min: 50, max: 85, currency: 'USD', unit: 'per sqft' },
              averageProject: 95000,
              currency: 'USD'
            }
          } as ExhibitionBuilder,
          matchScore: 89,
          matchBreakdown: {
            geographicProximity: 100,
            experienceLevel: 88,
            qualityMetrics: 85,
            availabilityScore: 88,
            serviceFit: 95,
            responseTime: 90,
            priceAlignment: 82,
            sustainabilityMatch: 78
          },
          estimatedCost: 75000,
          recommendationReasons: [
            'CES exhibition specialists with 10+ years experience',
            'Located in Las Vegas with immediate local support',
            'Advanced technology integration capabilities',
            'Proven track record with major tech companies'
          ],
          riskFactors: [
            'Slightly higher cost due to premium location'
          ],
          timeToCompletion: 35,
          confidence: 'High'
        },
        {
          builder: {
            id: 'london-premium-stands',
            companyName: 'London Premium Stands',
            slug: 'london-premium-stands',
            rating: 4.9,
            reviewCount: 78,
            headquarters: { city: 'London', country: 'United Kingdom', countryCode: 'UK' },
            serviceLocations: [
              { city: 'London', country: 'United Kingdom', countryCode: 'UK' },
              { city: 'Birmingham', country: 'United Kingdom', countryCode: 'UK' }
            ],
            verified: true,
            premiumMember: true,
            responseTime: 'Within 3 hours',
            keyStrengths: ['Luxury Standards', 'Technology Integration', 'Sustainable Design'],
            priceRange: {
              basicStand: { min: 220, max: 280, currency: 'GBP', unit: 'per sqm' },
              customStand: { min: 380, max: 650, currency: 'GBP', unit: 'per sqm' },
              premiumStand: { min: 650, max: 900, currency: 'GBP', unit: 'per sqm' },
              averageProject: 55000,
              currency: 'GBP'
            }
          } as ExhibitionBuilder,
          matchScore: 82,
          matchBreakdown: {
            geographicProximity: 70,
            experienceLevel: 85,
            qualityMetrics: 95,
            availabilityScore: 85,
            serviceFit: 88,
            responseTime: 95,
            priceAlignment: 75,
            sustainabilityMatch: 92
          },
          estimatedCost: 58000,
          recommendationReasons: [
            'Highest customer rating (4.9/5) with premium service',
            'Award-winning luxury exhibition specialists',
            'Industry leader in sustainable design practices',
            'Fast response time with European coverage'
          ],
          riskFactors: [
            'International builder may have higher logistics costs',
            'Limited direct experience with CES specifically'
          ],
          timeToCompletion: 49,
          confidence: 'Medium'
        }
      ];

      setTimeout(() => {
        setBuilderMatches(mockMatches);
        setIsMatching(false);
        
        // Update quote status
        setQuoteRequests(prev => prev.map(q => 
          q.id === quote.id 
            ? { ...q, status: 'Matched', matchedBuilders: mockMatches.map(m => m.builder.id) }
            : q
        ));
      }, 2000);

    } catch (error) {
      console.error('Error in intelligent matching:', error);
      setIsMatching(false);
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Matched': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Responded': return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Standard': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 p-6 bg-background-gray min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-deep-navy">Intelligent Quote Manager</h1>
          <p className="text-gray-600 mt-1">
            AI-powered quote matching with real-time builder recommendations
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white">
            <FiSettings className="w-4 h-4 mr-2" />
            Preferences
          </Button>
          <Button className="bg-primary-blue hover:bg-blue-dark text-white">
            <FiZap className="w-4 h-4 mr-2" />
            Auto-Match All
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Quotes</p>
                <p className="text-2xl font-bold text-deep-navy">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-primary-blue/10 rounded-full flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-primary-blue" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-green-600 font-medium">+12%</span> from last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Match Success</p>
                <p className="text-2xl font-bold text-deep-navy">{stats.matchSuccess}%</p>
              </div>
              <div className="w-12 h-12 bg-industry-green/10 rounded-full flex items-center justify-center">
                <FiTarget className="w-6 h-6 text-industry-green" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-green-600 font-medium">+5%</span> improvement
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold text-deep-navy">{stats.avgResponseTime}</p>
              </div>
              <div className="w-12 h-12 bg-warning-orange/10 rounded-full flex items-center justify-center">
                <FiClock className="w-6 h-6 text-warning-orange" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-green-600 font-medium">-0.8h</span> faster
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent Quotes</p>
                <p className="text-2xl font-bold text-deep-navy">{stats.urgent}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                <FiAlertCircle className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Requires immediate attention
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search quotes by company, trade show, or contact..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Matched">Matched</SelectItem>
                  <SelectItem value="Responded">Responded</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.location.reload()}>
                <FiRefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quote Requests Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiBarChart className="w-5 h-5 text-primary-blue" />
            Quote Requests ({filteredQuotes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <div key={quote.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg text-deep-navy">{quote.companyName}</h3>
                    <Badge className={`text-xs ${getStatusBadgeColor(quote.status)}`}>
                      {quote.status}
                    </Badge>
                    <Badge className={`text-xs ${getPriorityBadgeColor(quote.priority)}`}>
                      {quote.priority}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleIntelligentMatching(quote)}
                      disabled={isMatching}
                      className="border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white"
                    >
                      {isMatching && selectedQuote?.id === quote.id ? (
                        <>
                          <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Matching...
                        </>
                      ) : (
                        <>
                          <FiZap className="w-4 h-4 mr-2" />
                          Smart Match
                        </>
                      )}
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-primary-blue hover:bg-blue-dark text-white">
                          <FiEye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Quote Request Details - {quote.companyName}</DialogTitle>
                        </DialogHeader>
                        <QuoteDetailView quote={quote} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4 text-primary-blue" />
                    <span className="font-medium">{quote.tradeShow}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUsers className="w-4 h-4 text-primary-blue" />
                    <span>{quote.standSize} sqm • {quote.budget}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4 text-primary-blue" />
                    <span>{quote.timeline} • {new Date(quote.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">Contact:</span> {quote.contactPerson} • {quote.contactEmail}
                </div>

                {quote.specialRequests && (
                  <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                    <span className="font-medium">Special Requirements:</span> {quote.specialRequests}
                  </div>
                )}

                {quote.responses.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm font-medium text-green-600 mb-2">
                      {quote.responses.length} Builder Response(s) Received
                    </div>
                    <div className="space-y-2">
                      {quote.responses.map((response, index) => (
                        <div key={index} className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-green-800">{response.builderName}</div>
                              <div className="text-green-700">
                                {response.currency} {response.estimatedCost.toLocaleString()} • {response.timeline}
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              {response.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredQuotes.length === 0 && (
              <div className="text-center py-12">
                <FiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No quotes found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Builder Matches Modal */}
      {selectedQuote && builderMatches.length > 0 && (
        <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Intelligent Builder Matches for {selectedQuote.companyName}
              </DialogTitle>
            </DialogHeader>
            <BuilderMatchesView matches={builderMatches} quote={selectedQuote} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Quote Detail View Component
function QuoteDetailView({ quote }: { quote: QuoteRequest }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-lg mb-3">Company Information</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Company:</span> {quote.companyName}</div>
            <div><span className="font-medium">Contact:</span> {quote.contactPerson}</div>
            <div><span className="font-medium">Email:</span> {quote.contactEmail}</div>
            <div><span className="font-medium">Phone:</span> {quote.contactPhone}</div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-lg mb-3">Exhibition Details</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Trade Show:</span> {quote.tradeShow}</div>
            <div><span className="font-medium">Stand Size:</span> {quote.standSize} sqm</div>
            <div><span className="font-medium">Budget:</span> {quote.budget}</div>
            <div><span className="font-medium">Timeline:</span> {quote.timeline}</div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-3">Requirements</h4>
        <div className="flex flex-wrap gap-2 mb-3">
          {quote.requirements.map((req, index) => (
            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {req}
            </Badge>
          ))}
        </div>
        {quote.specialRequests && (
          <div className="bg-gray-50 p-3 rounded border">
            <div className="font-medium text-sm mb-1">Special Requests:</div>
            <div className="text-sm text-gray-700">{quote.specialRequests}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{quote.status}</div>
          <div className="text-sm text-blue-700">Current Status</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">{quote.priority}</div>
          <div className="text-sm text-orange-700">Priority Level</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{quote.responses.length}</div>
          <div className="text-sm text-green-700">Builder Responses</div>
        </div>
      </div>
    </div>
  );
}

// Builder Matches View Component
function BuilderMatchesView({ matches, quote }: { matches: BuilderMatch[]; quote: QuoteRequest }) {
  return (
    <div className="space-y-6">
      <Alert>
        <FiZap className="h-4 w-4" />
        <AlertDescription>
          Found {matches.length} intelligent matches using AI-powered algorithms. 
          Matches are ranked by compatibility score based on location, experience, quality, and availability.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {matches.map((match, index) => (
          <Card key={match.builder.id} className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-deep-navy">{match.builder.companyName}</h3>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {match.matchScore}% Match
                    </Badge>
                    <Badge className={`${
                      match.confidence === 'High' ? 'bg-green-100 text-green-800 border-green-200' :
                      match.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-gray-100 text-gray-800 border-gray-200'
                    }`}>
                      {match.confidence} Confidence
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiMapPin className="w-4 h-4" />
                      {match.builder.headquarters.city}, {match.builder.headquarters.country}
                    </div>
                    <div className="flex items-center gap-1">
                      <FiStar className="w-4 h-4 text-yellow-500" />
                      {match.builder.rating}/5 ({match.builder.reviewCount} reviews)
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      {match.builder.responseTime}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-blue">
                    ${match.estimatedCost.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">{match.timeToCompletion} days</div>
                </div>
              </div>

              {/* Match Breakdown */}
              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-3">Match Analysis</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Location</span>
                      <span>{match.matchBreakdown.geographicProximity}%</span>
                    </div>
                    <Progress value={match.matchBreakdown.geographicProximity} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Experience</span>
                      <span>{match.matchBreakdown.experienceLevel}%</span>
                    </div>
                    <Progress value={match.matchBreakdown.experienceLevel} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Quality</span>
                      <span>{match.matchBreakdown.qualityMetrics}%</span>
                    </div>
                    <Progress value={match.matchBreakdown.qualityMetrics} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Service Fit</span>
                      <span>{match.matchBreakdown.serviceFit}%</span>
                    </div>
                    <Progress value={match.matchBreakdown.serviceFit} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Recommendation Reasons */}
              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2">Why We Recommend This Builder</h4>
                <div className="space-y-1">
                  {match.recommendationReasons.map((reason, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-green-700">
                      <FiCheckCircle className="w-4 h-4 text-green-500" />
                      {reason}
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              {match.riskFactors.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">Considerations</h4>
                  <div className="space-y-1">
                    {match.riskFactors.map((risk, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-orange-700">
                        <FiAlertCircle className="w-4 h-4 text-orange-500" />
                        {risk}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Strengths */}
              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2">Key Strengths</h4>
                <div className="flex flex-wrap gap-2">
                  {match.builder.keyStrengths.map((strength, i) => (
                    <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Link href={`/builders/${match.builder.slug}`}>
                  <Button variant="outline" size="sm">
                    <FiEye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                </Link>
                <Button size="sm" className="bg-primary-blue hover:bg-blue-dark text-white">
                  <FiSend className="w-4 h-4 mr-2" />
                  Send Quote Request
                </Button>
                <Button variant="outline" size="sm">
                  <FiHeart className="w-4 h-4 mr-2" />
                  Add to Favorites
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}