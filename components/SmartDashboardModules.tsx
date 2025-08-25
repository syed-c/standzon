'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { BuilderPerformance, LeadIntelligence, type EventIntelligence, PlatformIntelligence, AIInsight, SmartAnalytics } from '@/lib/api/smartDashboard';
import {
  Building, Plus, Upload, Calendar, Search, Filter, Edit, Trash2, Eye, CheckCircle, AlertCircle,
  Clock, Users, Globe, Star, Download, RefreshCw, BarChart3, Zap, MapPin, DollarSign,
  TrendingUp, Activity, Bell, Brain, Sparkles, Target, Lightbulb, Rocket, Wand2, Bot,
  ArrowUp, ArrowDown, Award, Timer, Percent, Send, Archive, FileCheck, Briefcase,
  AlertTriangle, Info, PlayCircle, PauseCircle, StopCircle, TrendingDown, MousePointer,
  Crown, Mail, MessageSquare, Settings, Shield, Copy, Save, ExternalLink
} from 'lucide-react';

// Builder Intelligence Component
export function BuilderIntelligence({ 
  builderPerformance, 
  onUpdateBuilderStatus, 
  onRefresh 
}: { 
  builderPerformance: BuilderPerformance[]; 
  onUpdateBuilderStatus: (id: string, status: string) => Promise<void>;
  onRefresh: () => void;
}) {
  const [selectedBuilder, setSelectedBuilder] = useState<BuilderPerformance | null>(null);
  
  // Calculate performance insights
  const avgPerformanceScore = builderPerformance.reduce((sum, b) => sum + b.performanceScore, 0) / builderPerformance.length;
  const topPerformers = builderPerformance.filter(b => b.performanceScore >= 85).length;
  const needsAttention = builderPerformance.filter(b => b.flags.some(f => f.severity === 'critical')).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="h-8 w-8 mr-3 text-green-600" />
            Builder Intelligence Center
          </h2>
          <p className="text-gray-600 mt-1">AI-powered builder performance analysis and management</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button className="bg-gradient-to-r from-green-500 to-teal-600">
            <Brain className="h-4 w-4 mr-2" />
            AI Analyze
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Avg Performance</p>
                <p className="text-3xl font-bold">{avgPerformanceScore.toFixed(1)}%</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-blue-200 mr-1" />
                  <p className="text-blue-100 text-xs">+5.2% this month</p>
                </div>
              </div>
              <Award className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Top Performers</p>
                <p className="text-3xl font-bold">{topPerformers}</p>
                <p className="text-green-100 text-xs">85%+ score</p>
              </div>
              <Star className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Needs Attention</p>
                <p className="text-3xl font-bold">{needsAttention}</p>
                <p className="text-orange-100 text-xs">Critical issues</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Active Builders</p>
                <p className="text-3xl font-bold">{builderPerformance.filter(b => b.status === 'active').length}</p>
                <p className="text-purple-100 text-xs">Online now</p>
              </div>
              <Users className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Builder Performance List */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Builder Performance Analysis</span>
            <Badge className="bg-green-100 text-green-800">AI Powered</Badge>
          </CardTitle>
          <CardDescription>Real-time performance metrics and AI insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {builderPerformance.map((builder) => (
              <div 
                key={builder.id} 
                className="p-6 border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedBuilder(builder)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                        <Building className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
                        builder.status === 'active' ? 'bg-green-400' : 
                        builder.status === 'inactive' ? 'bg-red-400' : 'bg-yellow-400'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg">{builder.companyName}</h4>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{builder.performanceScore}% Score</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-blue-500 mr-1" />
                          <span className="text-sm">{builder.responseTime}h avg response</span>
                        </div>
                        <div className="flex items-center">
                          <Target className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-sm">{builder.acceptanceRate.toFixed(1)}% acceptance</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <Badge className={`text-xs ${
                          builder.planStatus === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                          builder.planStatus === 'professional' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {builder.planStatus}
                        </Badge>
                        {builder.flags.map((flag, index) => (
                          <Badge key={index} className={`text-xs ${
                            flag.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            flag.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {flag.type.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Leads</div>
                      <div className="font-semibold">{builder.leadsReceived}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Converted</div>
                      <div className="font-semibold text-green-600">{builder.leadsConverted}</div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Performance Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Performance Score</span>
                    <span className="text-sm font-medium">{builder.performanceScore}%</span>
                  </div>
                  <Progress value={builder.performanceScore} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Smart Builders Component
export function SmartBuilders({ 
  builderPerformance, 
  selectedBuilders, 
  setSelectedBuilders, 
  bulkAction, 
  setBulkAction, 
  onBulkAction, 
  searchTerm, 
  setSearchTerm 
}: any) {
  const handleSelectBuilder = (builderId: string) => {
    if (selectedBuilders.includes(builderId)) {
      setSelectedBuilders(selectedBuilders.filter((id: string) => id !== builderId));
    } else {
      setSelectedBuilders([...selectedBuilders, builderId]);
    }
  };

  const filteredBuilders = builderPerformance.filter((builder: BuilderPerformance) =>
    builder.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Target className="h-8 w-8 mr-3 text-blue-600" />
            Smart Builder Management
          </h2>
          <p className="text-gray-600 mt-1">AI-powered builder operations and bulk management</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
            <Brain className="h-4 w-4 mr-2" />
            AI Recommendations
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Builder
          </Button>
        </div>
      </div>

      {/* Smart Search and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="AI-powered smart search: name, location, services, performance..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-16 h-12 text-lg border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
              <Button size="sm" className="absolute right-2 top-2 bg-blue-500 hover:bg-blue-600">
                <Wand2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {selectedBuilders.length > 0 && (
                <div>
                  <Select value={bulkAction} onValueChange={setBulkAction}>
                    <SelectTrigger>
                      <SelectValue placeholder="Bulk Actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activate Selected</SelectItem>
                      <SelectItem value="inactive">Deactivate Selected</SelectItem>
                      <SelectItem value="suspended">Suspend Selected</SelectItem>
                      <SelectItem value="delete">Delete Selected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={onBulkAction} 
                    className="w-full mt-2 bg-gradient-to-r from-orange-500 to-red-600"
                    disabled={!bulkAction}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Apply to {selectedBuilders.length} builders
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Builders Grid */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Smart Builder Directory ({filteredBuilders.length})</span>
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-100 text-blue-800">AI Enhanced</Badge>
              {selectedBuilders.length > 0 && (
                <Badge className="bg-orange-100 text-orange-800">
                  {selectedBuilders.length} selected
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBuilders.map((builder: BuilderPerformance) => (
              <div 
                key={builder.id} 
                className="group p-6 border border-gray-100 rounded-xl hover:shadow-lg hover:border-blue-200 transition-all duration-300 bg-gradient-to-r hover:from-blue-50 hover:to-transparent"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedBuilders.includes(builder.id)}
                        onCheckedChange={() => handleSelectBuilder(builder.id)}
                      />
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
                          <Building className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
                          builder.status === 'active' ? 'bg-green-400' : 
                          builder.status === 'inactive' ? 'bg-red-400' : 'bg-yellow-400'
                        }`}></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
                        {builder.companyName}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                        <div>
                          <span className="text-gray-500">Performance:</span>
                          <div className="flex items-center">
                            <span className="font-medium text-green-600">{builder.performanceScore}%</span>
                            <Progress value={builder.performanceScore} className="h-1 w-16 ml-2" />
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Response:</span>
                          <span className="font-medium">{builder.responseTime}h</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Leads:</span>
                          <span className="font-medium">{builder.leadsReceived}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Converted:</span>
                          <span className="font-medium text-green-600">{builder.leadsConverted}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <Badge className={`text-xs ${
                          builder.planStatus === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                          builder.planStatus === 'professional' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {builder.planStatus}
                        </Badge>
                        <Badge className={`text-xs ${
                          builder.status === 'active' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {builder.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:border-blue-300">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="hover:bg-green-50 hover:border-green-300">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Builder Analytics Component
export function BuilderAnalytics({ builderPerformance, analytics }: { 
  builderPerformance: BuilderPerformance[]; 
  analytics: SmartAnalytics | null; 
}) {
  // Generate chart data
  const performanceData = builderPerformance.slice(0, 10).map(builder => ({
    name: builder.companyName.substring(0, 15) + '...',
    performance: builder.performanceScore,
    leads: builder.leadsReceived,
    conversion: builder.conversionRate
  }));

  const planDistribution = [
    { name: 'Free', value: builderPerformance.filter(b => b.planStatus === 'free').length, color: '#94a3b8' },
    { name: 'Professional', value: builderPerformance.filter(b => b.planStatus === 'professional').length, color: '#3b82f6' },
    { name: 'Enterprise', value: builderPerformance.filter(b => b.planStatus === 'enterprise').length, color: '#8b5cf6' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-purple-600" />
            Builder Analytics Intelligence
          </h2>
          <p className="text-gray-600 mt-1">Comprehensive performance analytics and insights</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-600">
            <Brain className="h-4 w-4 mr-2" />
            AI Insights
          </Button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Builder Performance Scores
            </CardTitle>
            <CardDescription>Top 10 builders by performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="performance" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-purple-600" />
              Plan Distribution
            </CardTitle>
            <CardDescription>Builder subscription plan breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Time Analysis */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-orange-600" />
              Response Time Analysis
            </CardTitle>
            <CardDescription>Builder response time performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { range: '< 2 hours', count: builderPerformance.filter(b => b.responseTime < 2).length, color: 'bg-green-500' },
                { range: '2-6 hours', count: builderPerformance.filter(b => b.responseTime >= 2 && b.responseTime <= 6).length, color: 'bg-yellow-500' },
                { range: '6-24 hours', count: builderPerformance.filter(b => b.responseTime > 6 && b.responseTime <= 24).length, color: 'bg-orange-500' },
                { range: '> 24 hours', count: builderPerformance.filter(b => b.responseTime > 24).length, color: 'bg-red-500' }
              ].map((item) => (
                <div key={item.range} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{item.range}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full`} 
                        style={{ width: `${(item.count / builderPerformance.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-purple-600" />
              AI Performance Insights
            </CardTitle>
            <CardDescription>Intelligent analysis and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  <strong>Top Insight:</strong> Builders with response times under 2 hours have 73% higher conversion rates.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  <strong>Growth Opportunity:</strong> Enterprise plan builders show 145% better performance metrics.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription>
                  <strong>Action Item:</strong> Consider implementing response time incentives for better platform performance.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// AI Insights Component
export function AIInsights({ 
  insights, 
  onAcknowledge, 
  analytics 
}: { 
  insights: AIInsight[]; 
  onAcknowledge: (id: string) => void; 
  analytics: SmartAnalytics | null; 
}) {
  const unacknowledgedInsights = insights.filter(i => !i.acknowledged);
  const criticalInsights = insights.filter(i => i.priority === 'critical');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="h-8 w-8 mr-3 text-pink-600" />
            AI Insights Engine
          </h2>
          <p className="text-gray-600 mt-1">Advanced AI-generated insights and actionable recommendations</p>
        </div>
        <div className="flex space-x-3">
          <Badge className="bg-pink-100 text-pink-800 px-3 py-1">
            {unacknowledgedInsights.length} New Insights
          </Badge>
          <Button className="bg-gradient-to-r from-pink-500 to-rose-600">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate New Insights
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalInsights.length > 0 && (
        <Card className="shadow-lg border-0 border-l-4 border-l-red-500 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-900">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Critical Insights Requiring Immediate Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalInsights.map((insight) => (
                <div key={insight.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <h4 className="font-semibold text-red-900">{insight.title}</h4>
                    <p className="text-sm text-red-700">{insight.description}</p>
                  </div>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                    <Send className="h-4 w-4 mr-2" />
                    Take Action
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight) => (
          <Card 
            key={insight.id} 
            className={`shadow-lg border-0 transition-all duration-300 ${
              insight.acknowledged 
                ? 'opacity-75 border-gray-200' 
                : 'shadow-xl hover:shadow-2xl'
            } ${
              insight.priority === 'critical' ? 'ring-2 ring-red-200' :
              insight.priority === 'high' ? 'ring-2 ring-orange-200' :
              insight.priority === 'medium' ? 'ring-2 ring-yellow-200' :
              'ring-2 ring-green-200'
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
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
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={`text-xs ${
                        insight.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        insight.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {insight.priority}
                      </Badge>
                      <Badge className={`text-xs ${
                        insight.type === 'opportunity' ? 'bg-green-100 text-green-800' :
                        insight.type === 'performance' ? 'bg-blue-100 text-blue-800' :
                        insight.type === 'warning' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {insight.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                {!insight.acknowledged && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onAcknowledge(insight.id)}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{insight.description}</p>
              
              {insight.actionRequired && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-900">Action Required</span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <MousePointer className="h-4 w-4 mr-2" />
                    Take Action
                  </Button>
                </div>
              )}
              
              <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
                <span>Generated: {new Date(insight.generatedAt).toLocaleDateString()}</span>
                {insight.acknowledged && (
                  <Badge className="bg-gray-100 text-gray-600">Acknowledged</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}