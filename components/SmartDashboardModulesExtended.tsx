'use client';

// Additional Smart Dashboard Modules - Event Intelligence, Smart Events, Platform Intelligence, Smart Leads, Bulk Operations

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { type EventIntelligence as EventIntelligenceType, PlatformIntelligence, LeadIntelligence, SmartAnalytics } from '@/lib/api/smartDashboard';
import {
  Calendar, Globe, Target, Upload, Download, Brain, Sparkles, TrendingUp, TrendingDown,
  Users, DollarSign, Clock, Star, MapPin, Building, MessageSquare, CheckCircle, AlertTriangle,
  FileText, Send, Archive, Zap, Rocket, Plus, Eye, Edit, Trash2, Filter, Search, Wand2,
  BarChart3, PieChart as PieChartIcon, Activity, Mail, Phone, ExternalLink, Copy, Save,
  PlayCircle, PauseCircle, Settings, Shield, Award, Crown, Timer, Percent, Info
} from 'lucide-react';

// Event Intelligence Component
export function EventIntelligence({ 
  eventIntelligence, 
  analytics 
}: { 
  eventIntelligence: EventIntelligenceType[]; 
  analytics: SmartAnalytics | null; 
}) {
  const [selectedEvent, setSelectedEvent] = useState<EventIntelligenceType | null>(null);

  // Calculate event metrics
  const totalLeadsFromEvents = eventIntelligence.reduce((sum, event) => sum + event.leadsGenerated, 0);
  const avgEventValue = eventIntelligence.reduce((sum, event) => sum + event.totalValue, 0) / eventIntelligence.length;
  const trendingEvents = eventIntelligence.filter(event => event.trend === 'growing');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-8 w-8 mr-3 text-indigo-600" />
            Event Intelligence Center
          </h2>
          <p className="text-gray-600 mt-1">AI-powered event analytics and market intelligence</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-indigo-500 to-blue-600">
            <Brain className="h-4 w-4 mr-2" />
            AI Predictions
          </Button>
        </div>
      </div>

      {/* Event Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Total Events</p>
                <p className="text-3xl font-bold">{eventIntelligence.length}</p>
                <div className="flex items-center mt-2">
                  <Calendar className="h-4 w-4 text-indigo-200 mr-1" />
                  <p className="text-indigo-100 text-xs">Active tracking</p>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-indigo-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Leads</p>
                <p className="text-3xl font-bold">{totalLeadsFromEvents}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-200 mr-1" />
                  <p className="text-green-100 text-xs">From events</p>
                </div>
              </div>
              <Target className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Avg Event Value</p>
                <p className="text-3xl font-bold">${(avgEventValue / 1000).toFixed(0)}K</p>
                <div className="flex items-center mt-2">
                  <DollarSign className="h-4 w-4 text-purple-200 mr-1" />
                  <p className="text-purple-100 text-xs">Per event</p>
                </div>
              </div>
              <Award className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Trending Events</p>
                <p className="text-3xl font-bold">{trendingEvents.length}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-orange-200 mr-1" />
                  <p className="text-orange-100 text-xs">Growing demand</p>
                </div>
              </div>
              <Rocket className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
              Event Lead Generation
            </CardTitle>
            <CardDescription>Leads generated by major events</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventIntelligence}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leadsGenerated" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Event Value Analysis
            </CardTitle>
            <CardDescription>Total value generated by events</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={eventIntelligence}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="totalValue" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Event List */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Event Intelligence Dashboard</span>
            <Badge className="bg-indigo-100 text-indigo-800">AI Enhanced</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {eventIntelligence.map((event) => (
              <div 
                key={event.id} 
                className="p-6 border border-gray-100 rounded-xl hover:shadow-lg hover:border-indigo-200 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      event.trend === 'growing' ? 'bg-green-100' :
                      event.trend === 'stable' ? 'bg-blue-100' : 'bg-orange-100'
                    }`}>
                      <Calendar className={`h-8 w-8 ${
                        event.trend === 'growing' ? 'text-green-600' :
                        event.trend === 'stable' ? 'text-blue-600' : 'text-orange-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg">{event.name}</h4>
                      <p className="text-gray-600 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.city}, {event.country}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge className={`text-xs ${
                          event.trend === 'growing' ? 'bg-green-100 text-green-800' :
                          event.trend === 'stable' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {event.trend}
                        </Badge>
                        <span className="text-sm text-gray-500">{event.industry}</span>
                        <span className="text-sm text-gray-500">{event.startDate} - {event.endDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Leads</span>
                        <div className="font-semibold text-lg">{event.leadsGenerated}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Value</span>
                        <div className="font-semibold text-lg text-green-600">${(event.totalValue / 1000).toFixed(0)}K</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Builders</span>
                        <div className="font-semibold">{event.builderParticipation}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Avg Size</span>
                        <div className="font-semibold">{event.avgStandSize}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* AI Insights for this event */}
                {event.aiInsights && event.aiInsights.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center mb-2">
                      <Brain className="h-4 w-4 text-purple-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">AI Insights</span>
                    </div>
                    <div className="space-y-1">
                      {event.aiInsights.slice(0, 2).map((insight, index) => (
                        <p key={index} className="text-xs text-gray-600 bg-purple-50 p-2 rounded">
                          • {insight}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Smart Events Component
export function SmartEvents({ eventIntelligence }: { eventIntelligence: EventIntelligenceType[] }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    city: '',
    country: '',
    industry: '',
    startDate: '',
    endDate: '',
    venue: ''
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Wand2 className="h-8 w-8 mr-3 text-cyan-600" />
            Smart Event Management
          </h2>
          <p className="text-gray-600 mt-1">AI-powered event creation and optimization</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-cyan-200 text-cyan-700 hover:bg-cyan-50">
            <Brain className="h-4 w-4 mr-2" />
            AI Suggest Events
          </Button>
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Smart Event
          </Button>
        </div>
      </div>

      {/* AI Event Creation Assistant */}
      {isCreating && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-cyan-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-cyan-600" />
              AI Event Creation Assistant
            </CardTitle>
            <CardDescription>Let AI help you create optimized events based on market data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Event Name</label>
                  <Input 
                    placeholder="e.g., Tech Expo 2025"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">City</label>
                    <Input 
                      placeholder="Las Vegas"
                      value={newEvent.city}
                      onChange={(e) => setNewEvent({...newEvent, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Country</label>
                    <Input 
                      placeholder="United States"
                      value={newEvent.country}
                      onChange={(e) => setNewEvent({...newEvent, country: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Industry</label>
                  <Select value={newEvent.industry} onValueChange={(value) => setNewEvent({...newEvent, industry: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                    <Input 
                      type="date"
                      value={newEvent.startDate}
                      onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">End Date</label>
                    <Input 
                      type="date"
                      value={newEvent.endDate}
                      onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Venue</label>
                  <Input 
                    placeholder="Convention Center Name"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})}
                  />
                </div>
                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    <strong>AI Suggestion:</strong> Based on market data, {newEvent.city || 'this location'} shows high demand for {newEvent.industry || 'technology'} events. Expected ROI: 340%.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600">
                <Sparkles className="h-4 w-4 mr-2" />
                Create with AI Optimization
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Recommendations */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-600" />
            AI Event Recommendations
          </CardTitle>
          <CardDescription>Smart suggestions based on market intelligence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-green-900">High Demand Market</h4>
                <Badge className="bg-green-100 text-green-800">Hot</Badge>
              </div>
              <p className="text-sm text-green-700 mb-3">AI Expo Chicago 2025 - Technology sector shows 230% growth potential</p>
              <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-blue-900">Emerging Opportunity</h4>
                <Badge className="bg-blue-100 text-blue-800">Rising</Badge>
              </div>
              <p className="text-sm text-blue-700 mb-3">Healthcare Innovation Summit - Austin market expanding rapidly</p>
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Target className="h-4 w-4 mr-2" />
                Explore Market
              </Button>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-purple-900">Seasonal Peak</h4>
                <Badge className="bg-purple-100 text-purple-800">Timing</Badge>
              </div>
              <p className="text-sm text-purple-700 mb-3">Q2 Fashion Week - Perfect timing for luxury brand exhibitions</p>
              <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Event
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Platform Intelligence Component  
export function PlatformIntelligenceTab({ 
  platformIntelligence, 
  analytics 
}: { 
  platformIntelligence: PlatformIntelligence | null; 
  analytics: SmartAnalytics | null; 
}) {
  if (!platformIntelligence) return null;

  const chartData = [
    { month: 'Jan', users: 1200, revenue: 45000, engagement: 72 },
    { month: 'Feb', users: 1350, revenue: 52000, engagement: 75 },
    { month: 'Mar', users: 1500, revenue: 61000, engagement: 78 },
    { month: 'Apr', users: 1680, revenue: 69000, engagement: 81 },
    { month: 'May', users: 1750, revenue: 78000, engagement: 79 },
    { month: 'Jun', users: 1847, revenue: 89000, engagement: 77 }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Globe className="h-8 w-8 mr-3 text-violet-600" />
            Platform Intelligence Center
          </h2>
          <p className="text-gray-600 mt-1">Global platform analytics and performance insights</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Platform Report
          </Button>
          <Button className="bg-gradient-to-r from-violet-500 to-purple-600">
            <Brain className="h-4 w-4 mr-2" />
            Predictive Analysis
          </Button>
        </div>
      </div>

      {/* Platform Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-100 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold">{platformIntelligence.totalUsers.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-violet-200 mr-1" />
                  <p className="text-violet-100 text-xs">+{platformIntelligence.userGrowthRate}% growth</p>
                </div>
              </div>
              <Users className="h-8 w-8 text-violet-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Monthly Revenue</p>
                <p className="text-3xl font-bold">${(platformIntelligence.revenueMetrics.monthly / 1000).toFixed(0)}K</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-emerald-200 mr-1" />
                  <p className="text-emerald-100 text-xs">+{platformIntelligence.revenueMetrics.growth}% growth</p>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Engagement Rate</p>
                <p className="text-3xl font-bold">{platformIntelligence.engagementRate}%</p>
                <div className="flex items-center mt-2">
                  <Activity className="h-4 w-4 text-blue-200 mr-1" />
                  <p className="text-blue-100 text-xs">High engagement</p>
                </div>
              </div>
              <Activity className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">System Uptime</p>
                <p className="text-3xl font-bold">{platformIntelligence.performanceMetrics.uptime}%</p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="h-4 w-4 text-orange-200 mr-1" />
                  <p className="text-orange-100 text-xs">Excellent reliability</p>
                </div>
              </div>
              <Shield className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Revenue Growth Trend
            </CardTitle>
            <CardDescription>Monthly revenue and user growth correlation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Engagement Analytics
            </CardTitle>
            <CardDescription>User engagement and activity patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="engagement" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-violet-600" />
            Platform Performance Metrics
          </CardTitle>
          <CardDescription>Technical performance and reliability indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Timer className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Load Time</h3>
              <p className="text-3xl font-bold text-green-600">{platformIntelligence.performanceMetrics.avgLoadTime}s</p>
              <p className="text-sm text-gray-600">Average response time</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Uptime</h3>
              <p className="text-3xl font-bold text-blue-600">{platformIntelligence.performanceMetrics.uptime}%</p>
              <p className="text-sm text-gray-600">System availability</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Error Rate</h3>
              <p className="text-3xl font-bold text-purple-600">{(platformIntelligence.performanceMetrics.errorRate * 100).toFixed(2)}%</p>
              <p className="text-sm text-gray-600">Platform errors</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Smart Leads Component
export function SmartLeads({ 
  leadIntelligence, 
  builderPerformance 
}: { 
  leadIntelligence: LeadIntelligence[]; 
  builderPerformance: any[]; 
}) {
  const [selectedLead, setSelectedLead] = useState<LeadIntelligence | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Calculate lead metrics
  const highPriorityLeads = leadIntelligence.filter(lead => lead.priority === 'high').length;
  const avgAIScore = leadIntelligence.reduce((sum, lead) => sum + lead.aiScore, 0) / leadIntelligence.length;
  const totalEstimatedValue = leadIntelligence.reduce((sum, lead) => sum + lead.estimatedValue, 0);

  // Filter leads
  const filteredLeads = leadIntelligence.filter(lead => {
    if (filterPriority !== 'all' && lead.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && lead.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Target className="h-8 w-8 mr-3 text-teal-600" />
            Smart Lead Intelligence
          </h2>
          <p className="text-gray-600 mt-1">AI-powered lead scoring and management system</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Leads
          </Button>
          <Button className="bg-gradient-to-r from-teal-500 to-cyan-600">
            <Brain className="h-4 w-4 mr-2" />
            AI Optimize
          </Button>
        </div>
      </div>

      {/* Lead Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium">Total Leads</p>
                <p className="text-3xl font-bold">{leadIntelligence.length}</p>
                <div className="flex items-center mt-2">
                  <Target className="h-4 w-4 text-teal-200 mr-1" />
                  <p className="text-teal-100 text-xs">Active tracking</p>
                </div>
              </div>
              <Target className="h-8 w-8 text-teal-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">High Priority</p>
                <p className="text-3xl font-bold">{highPriorityLeads}</p>
                <div className="flex items-center mt-2">
                  <AlertTriangle className="h-4 w-4 text-orange-200 mr-1" />
                  <p className="text-orange-100 text-xs">Need attention</p>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Avg AI Score</p>
                <p className="text-3xl font-bold">{avgAIScore.toFixed(0)}</p>
                <div className="flex items-center mt-2">
                  <Brain className="h-4 w-4 text-purple-200 mr-1" />
                  <p className="text-purple-100 text-xs">AI analysis</p>
                </div>
              </div>
              <Brain className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Est. Value</p>
                <p className="text-3xl font-bold">${(totalEstimatedValue / 1000).toFixed(0)}K</p>
                <div className="flex items-center mt-2">
                  <DollarSign className="h-4 w-4 text-green-200 mr-1" />
                  <p className="text-green-100 text-xs">Total potential</p>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-teal-50 to-cyan-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Priority Filter</label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status Filter</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge className="bg-teal-100 text-teal-800">
              {filteredLeads.length} leads shown
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Smart Lead Dashboard</span>
            <Badge className="bg-teal-100 text-teal-800">AI Scored</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div 
                key={lead.id} 
                className={`p-6 border rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  lead.priority === 'high' ? 'border-red-200 bg-red-50 hover:border-red-300' :
                  lead.priority === 'medium' ? 'border-yellow-200 bg-yellow-50 hover:border-yellow-300' :
                  'border-gray-100 hover:border-teal-200'
                }`}
                onClick={() => setSelectedLead(lead)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      lead.priority === 'high' ? 'bg-red-100' :
                      lead.priority === 'medium' ? 'bg-yellow-100' : 'bg-teal-100'
                    }`}>
                      <Target className={`h-8 w-8 ${
                        lead.priority === 'high' ? 'text-red-600' :
                        lead.priority === 'medium' ? 'text-yellow-600' : 'text-teal-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg">{lead.clientName}</h4>
                      <p className="text-gray-600">{lead.eventName}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {lead.city}, {lead.country}
                        </span>
                        <span className="text-sm text-gray-500">{lead.standSize}</span>
                        <span className="text-sm text-gray-500">{lead.budget}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <Badge className={`text-xs ${
                          lead.priority === 'high' ? 'bg-red-100 text-red-800' :
                          lead.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {lead.priority} priority
                        </Badge>
                        <Badge className={`text-xs ${
                          lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                          lead.status === 'responded' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.status}
                        </Badge>
                        <div className="flex items-center">
                          <Brain className="h-4 w-4 text-purple-600 mr-1" />
                          <span className="text-sm font-medium">AI Score: {lead.aiScore}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Est. Value</span>
                        <div className="font-semibold text-lg text-green-600">
                          ${(lead.estimatedValue / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Matched</span>
                        <div className="font-semibold">{lead.matchedBuilders} builders</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Responses</span>
                        <div className="font-semibold">{lead.responseCount}/{lead.matchedBuilders}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* AI Score Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">AI Lead Score</span>
                    <span className="text-sm font-medium">{lead.aiScore}%</span>
                  </div>
                  <Progress value={lead.aiScore} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}