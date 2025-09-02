"use client";

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Shield, 
  Building, 
  UserPlus, 
  Users, 
  BarChart3, 
  MessageSquare, 
  CreditCard, 
  Settings,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function PlatformPage() {
  const [activeTab, setActiveTab] = useState('admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 backdrop-blur-md rounded-full border border-blue-400/20 text-blue-300 text-sm font-medium mb-8">
            <Shield className="w-4 h-4 mr-2" />
            Platform Management System
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Professional Platform
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Management Suite
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Complete business management system for exhibition stand builders and platform administrators. 
            Manage your business, track performance, and grow your reach globally.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            onClick={() => setActiveTab('admin')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'admin' 
                ? 'bg-red-600 text-white' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <Shield className="w-5 h-5 mr-2" />
            Super Admin Panel
          </Button>
          <Button
            onClick={() => setActiveTab('builder')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'builder' 
                ? 'bg-green-600 text-white' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <Building className="w-5 h-5 mr-2" />
            Builder Dashboard
          </Button>
        </div>

        {/* Admin Panel Features */}
        {activeTab === 'admin' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-6 h-6 mr-3 text-red-400" />
                  Analytics Dashboard
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Real-time platform metrics and performance insights
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Revenue tracking & trends
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    User activity monitoring
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Geographic performance
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-6 h-6 mr-3 text-red-400" />
                  User Management
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Complete control over builders and clients
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Builder verification
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Account approval workflow
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Suspension & moderation
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-6 h-6 mr-3 text-red-400" />
                  Platform Control
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Manage content, settings, and configurations
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Content management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    System configuration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Feature toggles
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Builder Panel Features */}
        {activeTab === 'builder' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Building className="w-6 h-6 mr-3 text-green-400" />
                  Business Profile
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Showcase your company and services professionally
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Portfolio management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Service offerings
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Coverage areas
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="w-6 h-6 mr-3 text-green-400" />
                  Quote Management
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Handle client inquiries and project requests
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Real-time notifications
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Response tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Conversion analytics
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="w-6 h-6 mr-3 text-green-400" />
                  Subscription Plans
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Flexible pricing options for your business needs
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Premium features
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Enhanced visibility
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-md border-red-400/20">
              <CardHeader className="text-center pb-4">
                <Shield className="w-12 h-12 mx-auto text-red-400 mb-4" />
                <CardTitle className="text-white text-2xl">Super Admin Access</CardTitle>
                <CardDescription className="text-gray-300">
                  Complete platform control and management
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  <Link href="/admin/dashboard">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3">
                      Access Admin Panel
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/auth/login?type=admin">
                    <Button variant="outline" className="w-full border-red-400/30 text-red-300 hover:bg-red-400/10">
                      Admin Login
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-md border-green-400/20">
              <CardHeader className="text-center pb-4">
                <Building className="w-12 h-12 mx-auto text-green-400 mb-4" />
                <CardTitle className="text-white text-2xl">Join as Builder</CardTitle>
                <CardDescription className="text-gray-300">
                  Start growing your exhibition stand business
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  <Link href="/auth/register?type=builder">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3">
                      Register Your Business
                      <UserPlus className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/auth/login?type=builder">
                    <Button variant="outline" className="w-full border-green-400/30 text-green-300 hover:bg-green-400/10">
                      Builder Login
                    </Button>
                  </Link>
                  <Link href="/builder/dashboard">
                    <Button variant="outline" className="w-full border-green-400/30 text-green-300 hover:bg-green-400/10">
                      View Dashboard Demo
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}