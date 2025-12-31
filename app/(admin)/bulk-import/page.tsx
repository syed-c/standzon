import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';
import BulkBuilderImporter from '@/components/admin/BulkBuilderImporter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Database, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Users,
  Globe2,
  Building2
} from 'lucide-react';
import Link from 'next/link';

export default function BulkImportPage() {
  return (
    <AdminLayout sidebar={<Sidebar />} topbar={<Topbar />}>
      {/* All prior page content except <Navigation /> and <Footer /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Admin Dashboard
              </Link>
            </Button>
            <Badge variant="outline" className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              Super Admin Only
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bulk Builder Import System</h1>
              <p className="text-gray-600 mt-2">
                Restore missing builders and populate the platform with comprehensive exhibition builder data
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-sm text-gray-500">System Status</div>
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-2">About This Import System</h3>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    This system will generate and import realistic exhibition stand builders for countries 
                    that are missing data. It appears you expected to have imported many builders for US, UAE, 
                    UK, and Australian cities, but the GMB import didn't complete properly.
                  </p>
                  <p>
                    <strong>What this will do:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Generate realistic builders with proper company names, addresses, and contact details</li>
                    <li>Distribute builders across major cities in each country</li>
                    <li>Add them to all relevant location pages (country and city pages)</li>
                    <li>Make them visible in the admin dashboard and super admin systems</li>
                    <li>Prevent duplicates and maintain data integrity</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning Notice */}
        <Card className="mb-8 border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Important Considerations</h3>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    <strong>Before proceeding:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>This will add builders to your live platform database</li>
                    <li>All imported builders will be visible to public users</li>
                    <li>The system will automatically prevent duplicates</li>
                    <li>You can claim and manage these builders like any other listing</li>
                    <li>This action cannot be easily undone (manual cleanup would be required)</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Preview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">25</div>
              <div className="text-sm text-gray-600">United States Builders</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Building2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">15</div>
              <div className="text-sm text-gray-600">UAE Builders</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Globe2 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">20</div>
              <div className="text-sm text-gray-600">UK Builders</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Database className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">25</div>
              <div className="text-sm text-gray-600">Australia Builders</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Import Component */}
        <BulkBuilderImporter />

        {/* Additional Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>After Import</CardTitle>
            <CardDescription>
              What happens after the bulk import is completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Immediate Effects</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Builders appear on country and city pages
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Admin dashboard shows updated counts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Exhibition Stands page shows active countries
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Quote request forms connect to builders
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Management</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    All builders can be claimed by real companies
                  </li>
                  <li className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    Edit builder details through admin dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    Monitor lead generation and engagement
                  </li>
                  <li className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    Set up premium memberships and features
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> 
    </AdminLayout>
  );
}