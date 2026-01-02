'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/card';
import { Badge } from '@/components/shared/badge';
import { Button } from '@/components/shared/button';
import { Download, Building, MapPin, Star, ExternalLink, Eye } from 'lucide-react';

// Mock admin session
const mockAdmin = {
  id: 'admin-001',
  name: 'Super Admin',
  email: 'admin@exhibitbay.com'
};

export default function GMBListingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">ExhibitBay Admin</h1>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">GMB Fetched Listings</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => window.location.href = '/admin/dashboard'}
              className="bg-blue-600 text-white"
            >
              Back to Dashboard
            </Button>
            <span className="text-sm text-gray-600">Welcome, {mockAdmin.name}</span>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">SA</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">GMB Fetched Listings</h1>
              <p className="text-gray-600 mt-1">
                Manage builder profiles imported from Google My Business API
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">
                <Download className="w-3 h-3 mr-1" />
                Real GMB Data
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                Privacy Protected
              </Badge>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Fetched</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Unclaimed</p>
                    <p className="text-2xl font-bold text-orange-900">0</p>
                  </div>
                  <Star className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Claimed</p>
                    <p className="text-2xl font-bold text-green-900">0</p>
                  </div>
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Countries</p>
                    <p className="text-2xl font-bold text-purple-900">0</p>
                  </div>
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-green-600" />
                GMB Imported Builder Profiles
              </CardTitle>
              <CardDescription>
                All builder profiles imported from Google My Business API with claim status and visibility settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No GMB listings yet</h3>
                <p className="text-gray-500 mb-6">
                  Start by using the GMB Fetch Tool to import business listings from Google My Business API
                </p>
                <Button 
                  onClick={() => window.location.href = '/admin/dashboard'}
                  className="bg-green-600 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Go to GMB Fetch Tool
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>🔐 GMB Listing Claim Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">How Claims Work:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                    <li>All GMB-imported listings are marked as "Unclaimed" by default</li>
                    <li>Business owners can claim using any email with their website domain</li>
                    <li>Smart email system: user enters prefix (info, sales, etc.) + auto domain</li>
                    <li>Verified claims change status to "Claimed" and unlock profile customization</li>
                    <li>Claimed profiles appear prominently on location pages and builder directory</li>
                  </ol>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Privacy Protection:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                    <li>Contact details (phone, email, address) are hidden from public view</li>
                    <li>Only city and country are visible to users</li>
                    <li>Website URLs are hidden until claimed</li>
                    <li>Lead generation system protects business contact information</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}