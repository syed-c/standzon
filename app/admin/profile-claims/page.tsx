"use client";

import AdminClaimsManager from '@/components/AdminClaimsManager';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, TrendingUp, AlertCircle } from 'lucide-react';

export default function ProfileClaimsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white p-8 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Profile Claims Management</h1>
                  <p className="text-blue-100 mt-2">
                    Manage builder profile claims, verification status, and business ownership verification.
                    Monitor OTP verification, email confirmations, and upgrade tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Profiles</p>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Verified Claims</p>
                    <p className="text-2xl font-bold text-gray-900">342</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Claims</p>
                    <p className="text-2xl font-bold text-gray-900">28</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Claim Rate</p>
                    <p className="text-2xl font-bold text-gray-900">27.4%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">OTP Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">
                  Phone and email verification with auto-country code detection and privacy masking
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Email Scanning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">
                  Automatic website scanning for mailto: links and email extraction
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Bulk Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">
                  Mass email notifications, claim invitations, and upgrade offers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Audit Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">
                  Complete audit trail of claims, verifications, and status changes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Claims Manager */}
          <AdminClaimsManager 
            adminId="admin-001"
            permissions={['claims.manage', 'builders.manage', 'notifications.send']}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}