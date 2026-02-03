"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MapPin, 
  DollarSign, 
  Calendar,
  Target,
  Activity,
  Globe,
  Building2
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalBuilders: number;
    activeBuilders: number;
    totalQuotes: number;
    conversionRate: number;
    revenue: number;
    growth: number;
  };
  geographic: {
    topCountries: Array<{
      country: string;
      builders: number;
      quotes: number;
      revenue: number;
    }>;
    topCities: Array<{
      city: string;
      country: string;
      builders: number;
      quotes: number;
    }>;
  };
  performance: {
    quoteResponse: {
      averageTime: number;
      responseRate: number;
    };
    builderSatisfaction: number;
    clientSatisfaction: number;
    projectCompletion: number;
  };
  trends: {
    monthlyQuotes: Array<{
      month: string;
      quotes: number;
      revenue: number;
    }>;
    industryBreakdown: Array<{
      industry: string;
      percentage: number;
      growth: number;
    }>;
  };
}

export default function BusinessIntelligenceDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = async () => {
      setLoading(true);
      
      // Mock data - in production, this would come from your analytics API
      const mockData: AnalyticsData = {
        overview: {
          totalBuilders: 156,
          activeBuilders: 89,
          totalQuotes: 1247,
          conversionRate: 23.5,
          revenue: 2847500,
          growth: 18.2
        },
        geographic: {
          topCountries: [
            { country: 'Germany', builders: 34, quotes: 287, revenue: 645000 },
            { country: 'United States', builders: 28, quotes: 234, revenue: 578000 },
            { country: 'United Arab Emirates', builders: 22, quotes: 198, revenue: 489000 },
            { country: 'France', builders: 19, quotes: 156, revenue: 367000 },
            { country: 'Australia', builders: 15, quotes: 134, revenue: 298000 }
          ],
          topCities: [
            { city: 'Dubai', country: 'UAE', builders: 18, quotes: 167 },
            { city: 'Berlin', country: 'Germany', builders: 16, quotes: 145 },
            { city: 'Las Vegas', country: 'USA', builders: 14, quotes: 123 },
            { city: 'Paris', country: 'France', builders: 12, quotes: 98 },
            { city: 'Sydney', country: 'Australia', builders: 11, quotes: 87 }
          ]
        },
        performance: {
          quoteResponse: {
            averageTime: 4.2,
            responseRate: 87.3
          },
          builderSatisfaction: 4.6,
          clientSatisfaction: 4.4,
          projectCompletion: 94.2
        },
        trends: {
          monthlyQuotes: [
            { month: 'Jan', quotes: 89, revenue: 198000 },
            { month: 'Feb', quotes: 102, revenue: 234000 },
            { month: 'Mar', quotes: 118, revenue: 267000 },
            { month: 'Apr', quotes: 134, revenue: 298000 },
            { month: 'May', quotes: 156, revenue: 345000 },
            { month: 'Jun', quotes: 178, revenue: 389000 }
          ],
          industryBreakdown: [
            { industry: 'Technology', percentage: 28.5, growth: 15.2 },
            { industry: 'Healthcare', percentage: 18.7, growth: 22.1 },
            { industry: 'Automotive', percentage: 16.3, growth: 8.9 },
            { industry: 'Manufacturing', percentage: 14.2, growth: 12.4 },
            { industry: 'Finance', percentage: 12.8, growth: 19.7 },
            { industry: 'Other', percentage: 9.5, growth: 6.3 }
          ]
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData(mockData);
      setLoading(false);
    };

    loadAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Intelligence</h1>
          <p className="text-gray-600 mt-2">Comprehensive analytics and insights for StandsZone platform</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Builders</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalBuilders}</div>
            <p className="text-xs text-muted-foreground">
              {data.overview.activeBuilders} active builders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalQuotes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {data.overview.conversionRate}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(data.overview.revenue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-green-600">
              +{data.overview.growth}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.performance.clientSatisfaction}/5</div>
            <p className="text-xs text-muted-foreground">
              Client satisfaction score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="geographic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="geographic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Countries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Top Countries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.geographic.topCountries.map((country, index) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <div>
                          <p className="font-medium">{country.country}</p>
                          <p className="text-sm text-gray-600">{country.builders} builders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{country.quotes} quotes</p>
                        <p className="text-sm text-gray-600">
                          ${(country.revenue / 1000).toFixed(0)}K
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Cities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Top Cities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.geographic.topCities.map((city, index) => (
                    <div key={`${city.city}-${city.country}`} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <div>
                          <p className="font-medium">{city.city}</p>
                          <p className="text-sm text-gray-600">{city.country}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{city.builders} builders</p>
                        <p className="text-sm text-gray-600">{city.quotes} quotes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.performance.quoteResponse.averageTime}h</div>
                <p className="text-sm text-gray-600">Average response time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Response Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.performance.quoteResponse.responseRate}%</div>
                <p className="text-sm text-gray-600">Builder response rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Builder Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.performance.builderSatisfaction}/5</div>
                <p className="text-sm text-gray-600">Average builder rating</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.performance.projectCompletion}%</div>
                <p className="text-sm text-gray-600">Project completion rate</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Monthly Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.trends.monthlyQuotes.map((month) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <div className="font-medium">{month.month}</div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{month.quotes} quotes</p>
                          <p className="text-sm text-gray-600">
                            ${(month.revenue / 1000).toFixed(0)}K revenue
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Industry Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Industry Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.trends.industryBreakdown.map((industry) => (
                    <div key={industry.industry} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{industry.industry}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{industry.percentage}%</span>
                          <Badge 
                            variant={industry.growth > 10 ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            +{industry.growth}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${industry.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}