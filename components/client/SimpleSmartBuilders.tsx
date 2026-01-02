'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import { Badge } from '@/components/shared/badge';
import { Building, RefreshCw, Globe, Shield, Star } from 'lucide-react';

export default function SimpleSmartBuilders() {
  const [builders, setBuilders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBuilders = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading builders...');
      
      const response = await fetch('/api/admin/builders');
      console.log('📡 Response:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 Data received:', data);
      
      if (data.success && data.data && Array.isArray(data.data.builders)) {
        setBuilders(data.data.builders);
        console.log('✅ Successfully loaded builders:', data.data.builders.length);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('❌ Error loading builders:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuilders();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-lg font-medium">Loading builders...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Builders</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <Button onClick={loadBuilders} className="bg-red-600 text-white">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const gmbBuilders = builders.filter(b => b.id?.startsWith('gmb_') || b.gmbImported);
  const verifiedBuilders = builders.filter(b => b.verified);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Builders Manager</h1>
          <p className="text-gray-600 mt-1">
            Manage {builders.length} exhibition builders across your platform
            {gmbBuilders.length > 0 && (
              <span className="text-purple-600 font-medium"> 
                ({gmbBuilders.length} from GMB import)
              </span>
            )}
          </p>
        </div>
        <Button onClick={loadBuilders} variant="outline" className="text-gray-700 border-gray-300">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Builders</p>
                <p className="text-2xl font-bold text-gray-900">{builders.length}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">{verifiedBuilders.length}</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">GMB Imported</p>
                <p className="text-2xl font-bold text-purple-600">{gmbBuilders.length}</p>
              </div>
              <Globe className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {builders.length > 0 ? (builders.reduce((sum, b) => sum + (b.rating || 0), 0) / builders.length).toFixed(1) : '0.0'}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Builders List */}
      <Card>
        <CardHeader>
          <CardTitle>Builders ({builders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {builders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No builders found</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {builders.map((builder, index) => (
                <div key={builder.id || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Building className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{builder.companyName}</h3>
                        <p className="text-gray-600">
                          {builder.headquarters?.city || 'Unknown'}, {builder.headquarters?.country || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {builder.contactInfo?.primaryEmail || 'No email'}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          {builder.verified && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Verified
                            </Badge>
                          )}
                          {(builder.id?.startsWith('gmb_') || builder.gmbImported) && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              GMB Imported
                            </Badge>
                          )}
                          {builder.premiumMember && (
                            <Badge className="bg-purple-100 text-purple-800 text-xs">
                              Premium
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{(builder.rating || 0).toFixed(1)}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {builder.projectsCompleted || 0} projects
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}