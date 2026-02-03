'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { smartDashboardAPI } from '@/lib/api/smartDashboard';
import {
  LayoutDashboard, Building, Plus, Upload, Calendar, MessageSquare, Search, Filter, Edit, 
  Trash2, Eye, CheckCircle, AlertCircle, Clock, Users, Globe, Star, Download, RefreshCw, 
  BarChart3, Zap, Shield, MapPin, DollarSign, TrendingUp, Activity, Mail, Bell, Brain, 
  Sparkles, Target, Lightbulb, Rocket, Wand2, Bot, Command, ArrowUp, Timer, Award, Crown,
  AlertTriangle, Info, MousePointer, Send
} from 'lucide-react';
import TradeShowManagement from './TradeShowManagement';
import IntelligentQuoteManager from './IntelligentQuoteManager';
import RealTimePlatformAnalytics from './RealTimePlatformAnalytics';

export default function SmartDashboardFinal() {
  console.log("Smart Dashboard Final: Component loaded");

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [smartData, setSmartData] = useState<any>({
    analytics: null,
    builderPerformance: [],
    leadIntelligence: [],
    eventIntelligence: [],
    platformIntelligence: null,
    aiInsights: []
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'builders', label: 'Smart Builders', icon: Users },
    { id: 'quote-matching', label: 'Quote Matching', icon: Zap },
    { id: 'tradeshows', label: 'Trade Shows', icon: Calendar },
    { id: 'content', label: 'Content Manager', icon: Edit },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Globe }
  ];

  // Load all smart dashboard data
  useEffect(() => {
    loadSmartDashboardData();
    
    // Subscribe to real-time updates
    const unsubscribe = smartDashboardAPI.subscribe((event: string, data: any) => {
      console.log('Smart dashboard real-time update:', event, data);
      if (event === 'data_updated') {
        loadSmartDashboardData();
      }
    });

    return unsubscribe;
  }, []);

  const loadSmartDashboardData = async () => {
    setLoading(true);
    try {
      console.log('Loading smart dashboard data...');
      
      const [analytics, builderPerformance, leadIntelligence, eventIntelligence, platformIntelligence, aiInsights] = await Promise.all([
        smartDashboardAPI.getSmartAnalytics(),
        smartDashboardAPI.getBuilderPerformance(),
        smartDashboardAPI.getLeadIntelligence(),
        smartDashboardAPI.getEventIntelligence(),
        smartDashboardAPI.getPlatformIntelligence(),
        smartDashboardAPI.getAIInsights()
      ]);

      setSmartData({
        analytics,
        builderPerformance,
        leadIntelligence,
        eventIntelligence,
        platformIntelligence,
        aiInsights
      });

      console.log('Smart dashboard data loaded successfully');
    } catch (error) {
      console.error('Error loading smart dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SmartOverview analytics={smartData.analytics} insights={smartData.aiInsights} onRefresh={loadSmartDashboardData} />;
      case 'builders':
        return <div className="text-center py-12"><Brain className="h-16 w-16 mx-auto text-blue-600 mb-4" /><h2 className="text-3xl font-bold text-gray-900 mb-2">Smart Builders</h2><p className="text-gray-600">Advanced builder management module</p></div>;
      case 'quote-matching':
        return <IntelligentQuoteManager adminMode={true} />;
      case 'tradeshows':
        return <TradeShowManagement />;
      case 'content':
        return <div className="text-center py-12"><Brain className="h-16 w-16 mx-auto text-blue-600 mb-4" /><h2 className="text-3xl font-bold text-gray-900 mb-2">Content Manager</h2><p className="text-gray-600">AI-powered content management</p></div>;
      case 'analytics':
        return <div className="text-center py-12"><Brain className="h-16 w-16 mx-auto text-blue-600 mb-4" /><h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h2><p className="text-gray-600">Advanced analytics dashboard</p></div>;
      case 'settings':
        return <div className="text-center py-12"><Brain className="h-16 w-16 mx-auto text-blue-600 mb-4" /><h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2><p className="text-gray-600">Platform configuration</p></div>;
      default:
        return <SmartOverview analytics={smartData.analytics} insights={smartData.aiInsights} onRefresh={loadSmartDashboardData} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Initializing Smart Dashboard...</p>
          <p className="text-sm text-gray-400">Loading AI insights and analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Smart Sidebar */}
      <div className="w-80 bg-white/95 backdrop-blur-lg shadow-2xl border-r border-gray-200/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="text-white">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Smart Admin AI
                </h1>
                <p className="text-gray-300 text-sm flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered Intelligence Center
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-4 space-y-1">
            {/* Smart Overview */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 group ${
                activeTab === 'overview' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700'
              }`}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              <span className="font-medium">Overview</span>
              <Badge className="ml-auto bg-blue-100 text-blue-800 text-xs">
                {smartData.analytics?.platformRevenue ? `$${Math.round(smartData.analytics.platformRevenue/1000)}K` : '$0'}
              </Badge>
            </button>

            {/* Builder Intelligence */}
            <div className="space-y-1 mt-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 mb-3">
                Builder Intelligence
              </p>
              
              <button
                onClick={() => setActiveTab('builders')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 ${
                  activeTab === 'builders' 
                    ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg shadow-green-500/25' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-teal-50'
                }`}
              >
                <Brain className="h-5 w-5 mr-3" />
                <span className="font-medium">Builder Intelligence</span>
                <Badge className="ml-auto bg-green-100 text-green-800 text-xs">{smartData.builderPerformance.length}</Badge>
              </button>

              <button
                onClick={() => setActiveTab('quote-matching')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 ${
                  activeTab === 'quote-matching' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50'
                }`}
              >
                <Zap className="h-5 w-5 mr-3" />
                <span className="font-medium">Quote Matching</span>
                <Badge className="ml-auto bg-purple-100 text-purple-800 text-xs">AI</Badge>
              </button>

              <button
                onClick={() => setActiveTab('smart-builders')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 ${
                  activeTab === 'smart-builders' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                }`}
              >
                <Target className="h-5 w-5 mr-3" />
                <span className="font-medium">Smart Builders</span>
                <Badge className="ml-auto bg-blue-100 text-blue-800 text-xs">{smartData.analytics?.activeBuilders || 0}</Badge>
              </button>

              <button
                onClick={() => setActiveTab('builder-analytics')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 ${
                  activeTab === 'builder-analytics' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50'
                }`}
              >
                <BarChart3 className="h-5 w-5 mr-3" />
                <span className="font-medium">Builder Analytics</span>
                <Sparkles className="h-4 w-4 ml-auto text-purple-400" />
              </button>

              <button
                onClick={() => setActiveTab('bulk-operations')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 ${
                  activeTab === 'bulk-operations' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50'
                }`}
              >
                <Upload className="h-5 w-5 mr-3" />
                <span className="font-medium">Bulk Operations</span>
                <Rocket className="h-4 w-4 ml-auto text-orange-400" />
              </button>
            </div>

            {/* Event Intelligence */}
            <div className="space-y-1 mt-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 mb-3">
                Event Intelligence
              </p>
              
              <button
                onClick={() => setActiveTab('event-intelligence')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 ${
                  activeTab === 'event-intelligence' 
                    ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/25' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50'
                }`}
              >
                <Calendar className="h-5 w-5 mr-3" />
                <span className="font-medium">Event Intelligence</span>
                <Badge className="ml-auto bg-indigo-100 text-indigo-800 text-xs">{smartData.eventIntelligence.length}</Badge>
              </button>

              <button
                onClick={() => setActiveTab('smart-events')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 ${
                  activeTab === 'smart-events' 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50'
                }`}
              >
                <Wand2 className="h-5 w-5 mr-3" />
                <span className="font-medium">Smart Events</span>
                <Bot className="h-4 w-4 ml-auto text-cyan-400" />
              </button>
            </div>

            {/* Platform Intelligence */}
            <div className="space-y-1 mt-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 mb-3">
                Platform Intelligence
              </p>
              
              <button
                onClick={() => setActiveTab('platform-intelligence')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 ${
                  activeTab === 'platform-intelligence' 
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50'
                }`}
              >
                <Globe className="h-5 w-5 mr-3" />
                <span className="font-medium">Platform Intelligence</span>
                <Badge className="ml-auto bg-violet-100 text-violet-800 text-xs">
                  {smartData.platformIntelligence?.totalUsers || 0}
                </Badge>
              </button>

              <button
                onClick={() => setActiveTab('ai-insights')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 ${
                  activeTab === 'ai-insights' 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50'
                }`}
              >
                <Brain className="h-5 w-5 mr-3" />
                <span className="font-medium">AI Insights</span>
                <div className="ml-auto flex items-center">
                  {smartData.aiInsights.filter((i: any) => !i.acknowledged).length > 0 && (
                    <Badge className="bg-red-100 text-red-800 text-xs mr-2">
                      {smartData.aiInsights.filter((i: any) => !i.acknowledged).length}
                    </Badge>
                  )}
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('smart-leads')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 ${
                  activeTab === 'smart-leads' 
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/25' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50'
                }`}
              >
                <Target className="h-5 w-5 mr-3" />
                <span className="font-medium">Smart Leads</span>
                <Badge className="ml-auto bg-teal-100 text-teal-800 text-xs">{smartData.leadIntelligence.length}</Badge>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {/* Header Bar */}
          <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-8 py-4 sticky top-0 z-40">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  {activeTab === 'overview' && <><Brain className="h-6 w-6 mr-2 text-blue-600" />Overview</>}
                  {activeTab === 'builders' && <><Target className="h-6 w-6 mr-2 text-green-600" />Builder Intelligence</>}
                  {activeTab === 'quote-matching' && <><Zap className="h-6 w-6 mr-2 text-purple-600" />Quote Matching System</>}
                  {activeTab === 'ai-insights' && <><Lightbulb className="h-6 w-6 mr-2 text-pink-600" />AI Insights</>}
                  {/* Add more tab titles */}
                </h1>
                <p className="text-gray-600 text-sm">Real-time AI-powered platform intelligence</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-700">AI Active</span>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    {smartData.analytics?.conversionRate?.toFixed(1) || 0}% CVR
                  </Badge>
                </div>
                
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Add
                </Button>
                
                <Button onClick={loadSmartDashboardData} size="sm" variant="outline">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            {/* Smart Overview */}
            {activeTab === 'overview' && (
              <SmartOverview 
                analytics={smartData.analytics} 
                insights={smartData.aiInsights} 
                onRefresh={loadSmartDashboardData}
              />
            )}
            
            {/* Other tabs would render appropriate components */}
            {activeTab !== 'overview' && (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 mx-auto text-blue-600 mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {activeTab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h2>
                <p className="text-gray-600">Advanced AI-powered module ready for implementation</p>
                <Button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600" onClick={loadSmartDashboardData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Load Module Data
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Smart Overview Component
function SmartOverview({ analytics, insights, onRefresh }: any) {
  const chartData = [
    { name: 'Jan', revenue: 12000, leads: 45, builders: 23 },
    { name: 'Feb', revenue: 19000, leads: 67, builders: 28 },
    { name: 'Mar', revenue: 23000, leads: 89, builders: 34 },
    { name: 'Apr', revenue: 27000, leads: 134, builders: 41 },
    { name: 'May', revenue: 35000, leads: 167, builders: 52 },
    { name: 'Jun', revenue: 42300, leads: 234, builders: 67 }
  ];

  return (
    <div className="space-y-8">
      {/* AI Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center">
                <Brain className="h-8 w-8 mr-3" />
                AI Platform Intelligence
              </h2>
              <p className="text-blue-100 text-lg">Real-time smart analytics and performance insights</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{analytics?.conversionRate?.toFixed(1) || 0}%</div>
              <div className="text-blue-200">Conversion Rate</div>
              <div className="flex items-center justify-end mt-2">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">+{((analytics?.conversionRate || 0) * 0.15).toFixed(1)}% vs last month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 shadow-xl">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Platform Revenue</p>
                <p className="text-3xl font-bold mt-1">${((analytics?.platformRevenue || 0) / 1000).toFixed(1)}K</p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="h-4 w-4 text-emerald-200 mr-1" />
                  <p className="text-emerald-100 text-xs">+15.3% vs last month</p>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-200" />
            </div>
            <div className="mt-4 bg-white/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full w-3/4 animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Builders</p>
                <p className="text-3xl font-bold mt-1">{analytics?.activeBuilders || 0}</p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="h-4 w-4 text-blue-200 mr-1" />
                  <p className="text-blue-100 text-xs">+12% growth rate</p>
                </div>
              </div>
              <Building className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0 shadow-xl">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Leads</p>
                <p className="text-3xl font-bold mt-1">{analytics?.totalLeads || 0}</p>
                <div className="flex items-center mt-2">
                  <Clock className="h-4 w-4 text-purple-200 mr-1" />
                  <p className="text-purple-100 text-xs">Avg. {analytics?.avgResponseTime?.toFixed(1) || 0}h response</p>
                </div>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-xl">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Top Countries</p>
                <p className="text-3xl font-bold mt-1">{analytics?.topCountries?.length || 0}</p>
                <div className="flex items-center mt-2">
                  <Globe className="h-4 w-4 text-orange-200 mr-1" />
                  <p className="text-orange-100 text-xs">Global coverage</p>
                </div>
              </div>
              <Globe className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Revenue Growth
            </CardTitle>
            <CardDescription>Monthly revenue performance with AI predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Insights Panel */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              AI-Generated Insights
            </CardTitle>
            <CardDescription>Real-time intelligent recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights?.slice(0, 3).map((insight: any) => (
                <div key={insight.id} className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className={`p-2 rounded-lg ${
                    insight.type === 'opportunity' ? 'bg-green-100' :
                    insight.type === 'performance' ? 'bg-blue-100' :
                    insight.type === 'warning' ? 'bg-red-100' : 'bg-purple-100'
                  }`}>
                    {insight.type === 'opportunity' && <Target className="h-5 w-5 text-green-600" />}
                    {insight.type === 'performance' && <TrendingUp className="h-5 w-5 text-blue-600" />}
                    {insight.type === 'warning' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                    {insight.type === 'trend' && <BarChart3 className="h-5 w-5 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <Badge className={`text-xs ${
                        insight.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        insight.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {insight.priority}
                      </Badge>
                      {insight.actionRequired && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">Action Required</Badge>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">
                    <MousePointer className="h-3 w-3 mr-1" />
                    Act
                  </Button>
                </div>
              )) || []}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity Feed */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-500" />
              Live Platform Activity
            </div>
            <Button size="sm" onClick={onRefresh} variant="outline">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
          <CardDescription>Real-time platform events and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics?.recentActivity?.map((activity: any, index: number) => (
              <div key={index} className={`flex items-start space-x-4 p-4 rounded-xl border ${
                activity.priority === 'high' ? 'bg-red-50 border-red-200' :
                activity.priority === 'medium' ? 'bg-blue-50 border-blue-200' :
                'bg-green-50 border-green-200'
              }`}>
                <div className={`p-2 rounded-lg ${
                  activity.type === 'builder_signup' ? 'bg-blue-100' :
                  activity.type === 'lead_converted' ? 'bg-green-100' :
                  activity.type === 'plan_upgrade' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  {activity.type === 'builder_signup' && <Plus className="h-5 w-5 text-blue-600" />}
                  {activity.type === 'lead_converted' && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {activity.type === 'plan_upgrade' && <Crown className="h-5 w-5 text-purple-600" />}
                  {activity.type === 'lead_received' && <MessageSquare className="h-5 w-5 text-orange-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
                <Badge className={`text-xs ${
                  activity.priority === 'high' ? 'bg-red-100 text-red-800' :
                  activity.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {activity.priority}
                </Badge>
              </div>
            )) || []}
          </div>
        </CardContent>
      </Card>

      {/* Smart Quick Actions */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Rocket className="h-6 w-6 mr-3" />
            AI-Recommended Actions
          </CardTitle>
          <CardDescription className="text-gray-300">Smart actions based on current platform intelligence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 h-auto p-4 flex flex-col items-center space-y-2">
              <Plus className="h-6 w-6" />
              <span className="font-medium">Add Builder</span>
              <span className="text-xs opacity-75">High demand detected</span>
            </Button>
            
            <Button className="bg-gradient-to-r from-green-500 to-green-600 h-auto p-4 flex flex-col items-center space-y-2">
              <Upload className="h-6 w-6" />
              <span className="font-medium">Bulk Import</span>
              <span className="text-xs opacity-75">Optimize workflow</span>
            </Button>
            
            <Button className="bg-gradient-to-r from-purple-500 to-purple-600 h-auto p-4 flex flex-col items-center space-y-2">
              <MessageSquare className="h-6 w-6" />
              <span className="font-medium">Review Leads</span>
              <span className="text-xs opacity-75">{analytics?.totalLeads || 0} pending</span>
            </Button>
            
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 h-auto p-4 flex flex-col items-center space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span className="font-medium">View Analytics</span>
              <span className="text-xs opacity-75">New insights available</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}