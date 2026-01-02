'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import { Badge } from '@/components/shared/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/select';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, 
  ScatterChart, Scatter, ComposedChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Calendar,
  Globe,
  Users,
  Building,
  DollarSign,
  Star,
  Activity,
  Filter,
  RefreshCw,
  FileText,
  Target,
  Zap,
  AlertTriangle
} from 'lucide-react';

interface AnalyticsData {
  revenue: any[];
  builders: any[];
  leads: any[];
  geographic: any[];
  performance: any[];
  trends: any[];
}

interface AdvancedAnalyticsProps {
  data?: AnalyticsData;
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
}

export default function AdvancedAnalytics({ 
  data,
  dateRange = '7d',
  onDateRangeChange 
}: AdvancedAnalyticsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    revenue: [],
    builders: [],
    leads: [],
    geographic: [],
    performance: [],
    trends: []
  });

  // Mock analytics data
  const mockData: AnalyticsData = {
    revenue: [
      { month: 'Jan', revenue: 15000, subscriptions: 45, leads: 120, conversion: 12.5 },
      { month: 'Feb', revenue: 18000, subscriptions: 52, leads: 145, conversion: 14.2 },
      { month: 'Mar', revenue: 16500, subscriptions: 48, leads: 132, conversion: 13.1 },
      { month: 'Apr', revenue: 22000, subscriptions: 61, leads: 178, conversion: 15.8 },
      { month: 'May', revenue: 19500, subscriptions: 55, leads: 156, conversion: 14.6 },
      { month: 'Jun', revenue: 25000, subscriptions: 68, leads: 195, conversion: 16.9 },
      { month: 'Jul', revenue: 28000, subscriptions: 72, leads: 210, conversion: 18.2 }
    ],
    builders: [
      { country: 'Germany', builders: 45, verified: 38, pending: 7, revenue: 85000 },
      { country: 'UAE', builders: 32, verified: 28, pending: 4, revenue: 72000 },
      { country: 'USA', builders: 28, verified: 24, pending: 4, revenue: 68000 },
      { country: 'UK', builders: 22, verified: 19, pending: 3, revenue: 45000 },
      { country: 'France', builders: 18, verified: 15, pending: 3, revenue: 38000 },
      { country: 'Spain', builders: 15, verified: 12, pending: 3, revenue: 32000 }
    ],
    leads: [
      { date: '2024-07-01', leads: 12, converted: 3, value: 15000, source: 'organic' },
      { date: '2024-07-02', leads: 8, converted: 2, value: 12000, source: 'paid' },
      { date: '2024-07-03', leads: 15, converted: 4, value: 18000, source: 'referral' },
      { date: '2024-07-04', leads: 10, converted: 2, value: 9000, source: 'organic' },
      { date: '2024-07-05', leads: 18, converted: 5, value: 22000, source: 'paid' },
      { date: '2024-07-06', leads: 14, converted: 3, value: 16000, source: 'organic' },
      { date: '2024-07-07', leads: 20, converted: 6, value: 28000, source: 'referral' }
    ],
    geographic: [
      { city: 'Berlin', leads: 45, builders: 15, revenue: 32000, growth: 12.5 },
      { city: 'Dubai', leads: 38, builders: 12, revenue: 28000, growth: 18.2 },
      { city: 'Las Vegas', leads: 32, builders: 10, revenue: 25000, growth: 8.7 },
      { city: 'London', leads: 28, builders: 8, revenue: 22000, growth: 15.3 },
      { city: 'Frankfurt', leads: 25, builders: 9, revenue: 20000, growth: 6.9 },
      { city: 'Barcelona', leads: 22, builders: 7, revenue: 18000, growth: 22.1 }
    ],
    performance: [
      { metric: 'Lead Response Time', current: 2.3, target: 2.0, trend: -0.2 },
      { metric: 'Builder Verification Time', current: 4.5, target: 3.0, trend: -0.8 },
      { metric: 'Platform Uptime', current: 99.8, target: 99.5, trend: 0.1 },
      { metric: 'Customer Satisfaction', current: 4.7, target: 4.5, trend: 0.3 },
      { metric: 'Conversion Rate', current: 16.8, target: 15.0, trend: 1.2 }
    ],
    trends: [
      { week: 'W1', searches: 450, bookings: 78, revenue: 12000 },
      { week: 'W2', searches: 520, bookings: 89, revenue: 15000 },
      { week: 'W3', searches: 480, bookings: 82, revenue: 13500 },
      { week: 'W4', searches: 590, bookings: 102, revenue: 18000 }
    ]
  };

  useEffect(() => {
    setAnalyticsData(data || mockData);
  }, [data]);

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    setIsLoading(true);
    // Simulate export
    setTimeout(() => {
      setIsLoading(false);
      console.log(`Exporting analytics data as ${format}`);
    }, 2000);
  };

  const calculateGrowth = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const kpis = [
    {
      title: 'Total Revenue',
      value: '$284,000',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Builders',
      value: '160',
      change: '+8.2%',
      trend: 'up',
      icon: Building,
      color: 'text-blue-600'
    },
    {
      title: 'Lead Conversion',
      value: '16.8%',
      change: '+2.3%',
      trend: 'up',
      icon: Target,
      color: 'text-purple-600'
    },
    {
      title: 'Platform Rating',
      value: '4.7/5',
      change: '+0.3',
      trend: 'up',
      icon: Star,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="w-full space-y-6" data-macaly="advanced-analytics">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Advanced Analytics & Reporting</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={dateRange} onValueChange={onDateRangeChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('pdf')}
                disabled={isLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, index) => (
              <div key={index} className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gray-100`}>
                      <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{kpi.title}</p>
                      <p className="text-2xl font-bold">{kpi.value}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${
                      kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="text-sm font-medium">{kpi.change}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Analytics Tabs */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="builders">Builders</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Platform Activity Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="searches" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="bookings" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Geographic Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.builders}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="builders"
                      nameKey="country"
                    >
                      {analyticsData.builders.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Monthly Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={analyticsData.revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" name="Revenue ($)" />
                  <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="#EF4444" strokeWidth={3} name="Conversion Rate (%)" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.revenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Country</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.builders.map((country, index) => (
                    <div key={country.country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{country.country}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${country.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{country.builders} builders</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Builders Tab */}
        <TabsContent value="builders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Builder Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.builders}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="verified" stackId="a" fill="#10B981" name="Verified" />
                    <Bar dataKey="pending" stackId="a" fill="#F59E0B" name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Builder Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.performance.map((metric, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{metric.metric}</h4>
                        <div className={`flex items-center gap-1 ${
                          metric.trend > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.trend > 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span className="text-sm">{metric.trend > 0 ? '+' : ''}{metric.trend}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Current: <strong>{metric.current}</strong></span>
                        <span>Target: <strong>{metric.target}</strong></span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            metric.current >= metric.target ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${Math.min((metric.current / metric.target) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Cities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">City</th>
                      <th className="text-right py-2">Leads</th>
                      <th className="text-right py-2">Builders</th>
                      <th className="text-right py-2">Revenue</th>
                      <th className="text-right py-2">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.geographic.map((city, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-medium">{city.city}</td>
                        <td className="text-right py-3">{city.leads}</td>
                        <td className="text-right py-3">{city.builders}</td>
                        <td className="text-right py-3">${city.revenue.toLocaleString()}</td>
                        <td className="text-right py-3">
                          <Badge className={`${
                            city.growth > 15 ? 'bg-green-100 text-green-800' :
                            city.growth > 10 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            +{city.growth}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Performance vs Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.performance.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{metric.metric}</span>
                        <span className="text-sm">
                          {metric.current} / {metric.target}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            metric.current >= metric.target ? 'bg-green-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${Math.min((metric.current / metric.target) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  AI-Powered Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Optimization Opportunity</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          UAE region shows 22% growth potential. Consider increasing marketing spend.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-800">Strong Performance</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Builder verification time improved by 35% this quarter.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Action Required</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Lead response time in Germany region needs attention.
                        </p>
                      </div>
                    </div>
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