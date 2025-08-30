'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import DataCompletenessDashboard from '@/components/DataCompletenessDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Globe, MapPin, Flag, TrendingUp, Clock, Database,
  CheckCircle, AlertTriangle, Activity, BarChart3,
  ExternalLink, Eye, Target, Sparkles, Crown
} from 'lucide-react';

export default function DataStatusPage() {
  console.log('📊 Loading Data Status Public Page');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Globe className="h-16 w-16 text-blue-300 mr-4" />
              <div>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Global Coverage Status
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 mt-4">
                  Real-time data completeness across our worldwide exhibition marketplace
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">200+</div>
                <div className="text-blue-200">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">500+</div>
                <div className="text-blue-200">Cities</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">85%</div>
                <div className="text-blue-200">Coverage</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">24/7</div>
                <div className="text-blue-200">Updates</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Status Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platform Coverage Status
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're continuously expanding our global coverage of exhibition stand builders 
              and trade show venues. Here's our current progress across the world.
            </p>
          </div>

          {/* Main Dashboard */}
          <DataCompletenessDashboard />
        </div>
      </section>

      {/* Coming Soon Regions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Expanding Coverage
            </h2>
            <p className="text-xl text-gray-600">
              New regions and cities being added weekly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Priority Regions */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Crown className="h-6 w-6 text-yellow-600 mr-2" />
                    Priority Markets
                  </CardTitle>
                  <Badge className="bg-yellow-500 text-white">High Priority</Badge>
                </div>
                <CardDescription>
                  Major exhibition markets being added first
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-white/60 rounded">
                    <span className="font-medium">South Korea</span>
                    <Badge className="bg-claret-100 text-claret-800">90% Complete</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/60 rounded">
                    <span className="font-medium">Mexico</span>
                    <Badge className="bg-yellow-100 text-yellow-800">75% Complete</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/60 rounded">
                    <span className="font-medium">Brazil</span>
                    <Badge className="bg-blue-100 text-blue-800">60% Complete</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emerging Markets */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-claret-50 to-claret-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-6 w-6 text-claret-600 mr-2" />
                    Emerging Markets
                  </CardTitle>
                  <Badge className="bg-claret-500 text-white">Growing</Badge>
                </div>
                <CardDescription>
                  Fast-growing exhibition markets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-white/60 rounded">
                    <span className="font-medium">Vietnam</span>
                    <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/60 rounded">
                    <span className="font-medium">Indonesia</span>
                    <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/60 rounded">
                    <span className="font-medium">Poland</span>
                    <Badge className="bg-yellow-100 text-yellow-800">50% Complete</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Regions */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Clock className="h-6 w-6 text-purple-600 mr-2" />
                    Coming Soon
                  </CardTitle>
                  <Badge className="bg-purple-500 text-white">Planned</Badge>
                </div>
                <CardDescription>
                  Regions scheduled for upcoming expansion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-white/60 rounded">
                    <span className="font-medium">Africa Markets</span>
                    <Badge variant="outline">Q2 2024</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/60 rounded">
                    <span className="font-medium">Eastern Europe</span>
                    <Badge variant="outline">Q3 2024</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/60 rounded">
                    <span className="font-medium">Central Asia</span>
                    <Badge variant="outline">Q4 2024</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Updates */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Live Updates
            </h2>
            <p className="text-xl text-blue-100">
              Real-time progress on our global expansion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-claret-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold mb-2">24</div>
              <div className="text-blue-200">Pages Added Today</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold mb-2">156</div>
              <div className="text-blue-200">This Week</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold mb-2">89%</div>
              <div className="text-blue-200">Target Progress</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold mb-2">12</div>
              <div className="text-blue-200">New Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Can't Find Your Location?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We're expanding rapidly. Let us know where you need exhibition stand builders 
            and we'll prioritize adding that region to our platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <MapPin className="h-5 w-5 mr-2" />
              Request New Location
            </Button>
            <Button size="lg" variant="outline" className="text-gray-900 border-gray-300">
              <Eye className="h-5 w-5 mr-2" />
              Browse Available Locations
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}