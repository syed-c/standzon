
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, Users, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function TestDebugBuildersPage() {
  const [directTestResult, setDirectTestResult] = useState<any>(null);
  const [isTestingDirect, setIsTestingDirect] = useState(false);

  // Try using Convex React hooks
  const buildersCount = useQuery(api.debug.countBuilders);
  const recentBuilders = useQuery(api.debug.getRecentBuilders, { limit: 10 });
  const gmbBuilders = useQuery(api.debug.getGMBImportedBuilders);
  const allBuildersDebug = useQuery(api.debug.getAllBuildersDebug);

  // Direct test function
  const testDirectConnection = async () => {
    setIsTestingDirect(true);
    try {
      console.log('🔄 Testing direct Convex connection...');
      
      const { ConvexHttpClient } = await import("convex/browser");
      const convex = new ConvexHttpClient("https://tame-labrador-80.convex.cloud");
      
      console.log('📊 Running direct queries...');
      const count = await convex.query("debug:countBuilders");
      const debugData = await convex.query("debug:getAllBuildersDebug");
      
      setDirectTestResult({
        success: true,
        count,
        debugData,
        timestamp: new Date().toISOString()
      });
      
      console.log('✅ Direct test successful:', { count, debugData });
    } catch (error) {
      console.error('❌ Direct test failed:', error);
      setDirectTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsTestingDirect(false);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Debug: Builders Database</h1>
            <p className="text-gray-600 mt-2">Real-time debugging of Convex builders database</p>
            <p className="text-sm text-gray-500 mt-1">
              Convex URL: https://tame-labrador-80.convex.cloud
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={testDirectConnection} disabled={isTestingDirect} className="bg-purple-600 hover:bg-purple-700">
              {isTestingDirect ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Test Direct Connection
                </>
              )}
            </Button>
            <Button onClick={refreshPage} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Direct Test Results */}
        {directTestResult && (
          <Card className={directTestResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${directTestResult.success ? "text-green-800" : "text-red-800"}`}>
                {directTestResult.success ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                Direct Connection Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {directTestResult.success ? (
                <div className="space-y-2">
                  <p className="text-green-700">✅ Connection successful!</p>
                  <p className="text-green-700">Total builders: {directTestResult.count}</p>
                  <p className="text-green-700">GMB imported: {directTestResult.debugData?.gmbImported}</p>
                  <p className="text-green-700">Verified: {directTestResult.debugData?.verified}</p>
                  <p className="text-xs text-green-600">Tested at: {directTestResult.timestamp}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-red-700">❌ Connection failed</p>
                  <p className="text-red-700">Error: {directTestResult.error}</p>
                  <p className="text-xs text-red-600">Tested at: {directTestResult.timestamp}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Builders (React Hook)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Database className="h-8 w-8 text-blue-600 mr-3" />
                <span className="text-3xl font-bold text-gray-900">
                  {buildersCount !== undefined ? buildersCount : "Loading..."}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">GMB Imported (React Hook)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600 mr-3" />
                <span className="text-3xl font-bold text-gray-900">
                  {gmbBuilders !== undefined ? gmbBuilders.length : "Loading..."}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Verified (React Hook)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <span className="text-3xl font-bold text-gray-900">
                  {allBuildersDebug !== undefined ? allBuildersDebug.verified : "Loading..."}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Connection Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {buildersCount !== undefined ? (
                  <span className="text-green-600 font-medium">✅ React Hooks Connected</span>
                ) : (
                  <span className="text-red-600 font-medium">❌ React Hooks Loading</span>
                )}
                <br />
                {directTestResult?.success ? (
                  <span className="text-green-600 font-medium">✅ Direct Connection OK</span>
                ) : directTestResult?.success === false ? (
                  <span className="text-red-600 font-medium">❌ Direct Connection Failed</span>
                ) : (
                  <span className="text-gray-600 font-medium">⏳ Direct Not Tested</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Builders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Builders (Last 10)</CardTitle>
          </CardHeader>
          <CardContent>
            {recentBuilders === undefined ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading recent builders...</p>
              </div>
            ) : recentBuilders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No builders found in database</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBuilders.map((builder, index) => (
                  <div key={builder._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{builder.companyName}</h3>
                      <p className="text-sm text-gray-600">
                        {builder.headquartersCity}, {builder.headquartersCountry}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(builder.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {builder.gmbImported && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          GMB
                        </span>
                      )}
                      {builder.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* GMB Builders */}
        <Card>
          <CardHeader>
            <CardTitle>GMB Imported Builders</CardTitle>
          </CardHeader>
          <CardContent>
            {gmbBuilders === undefined ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading GMB builders...</p>
              </div>
            ) : gmbBuilders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No GMB imported builders found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {gmbBuilders.map((builder, index) => (
                  <div key={builder._id} className="flex items-center justify-between p-4 border border-purple-200 rounded-lg bg-purple-50">
                    <div>
                      <h3 className="font-medium text-gray-900">{builder.companyName}</h3>
                      <p className="text-sm text-gray-600">
                        {builder.headquartersCity}, {builder.headquartersCountry}
                      </p>
                      <p className="text-xs text-gray-500">
                        Source: {builder.source} | Imported: {builder.importedAt ? new Date(builder.importedAt).toLocaleString() : 'Unknown'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                        GMB Import
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Full Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle>Full Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            {allBuildersDebug === undefined ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading debug information...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Builders</p>
                    <p className="text-2xl font-bold text-gray-900">{allBuildersDebug.total}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">GMB Imported</p>
                    <p className="text-2xl font-bold text-purple-600">{allBuildersDebug.gmbImported}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Verified</p>
                    <p className="text-2xl font-bold text-green-600">{allBuildersDebug.verified}</p>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-x-auto">
                    {JSON.stringify(allBuildersDebug.builders?.slice(0, 5), null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
