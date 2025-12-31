'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Building, 
  Edit, 
  Eye, 
  Calendar,
  MapPin,
  Star,
  Shield,
  Award,
  Settings,
  UserCheck,
  X,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  Globe,
  CreditCard,
  Plus,
  Minus,
  Crown,
  DollarSign,
  MessageSquare,
  BarChart3,
  Send,
  TestTube,
  Database,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

interface EnhancedSuperAdminControlsProps {
  adminId: string;
  permissions: string[];
  data?: any;
}

export default function EnhancedSuperAdminControls({ adminId, permissions, data }: EnhancedSuperAdminControlsProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [systemStats, setSystemStats] = useState<any>({});
  const [selectedBuilders, setSelectedBuilders] = useState<string[]>([]);
  const [notificationForm, setNotificationForm] = useState({
    message: '',
    method: 'email',
    priority: 'MEDIUM',
    schedule: ''
  });
  const [planForm, setPlanForm] = useState({
    builderId: '',
    planType: 'basic',
    duration: '1'
  });
  const [claimOverride, setClaimOverride] = useState({
    builderId: '',
    contact: '',
    method: 'email',
    reason: ''
  });
  const [selectedBuilderForServices, setSelectedBuilderForServices] = useState<string | null>(null);
  const [availableServices] = useState([
    { id: 'custom-design', name: 'Custom Stand Design', category: 'Design' },
    { id: 'modular-systems', name: 'Modular Systems', category: 'Design' },
    { id: 'portable-displays', name: 'Portable Displays', category: 'Display' },
    { id: 'double-deck', name: 'Double Deck Stands', category: 'Construction' },
    { id: 'sustainable-eco', name: 'Sustainable/Eco Stands', category: 'Eco' },
    { id: 'tech-integration', name: 'Technology Integration', category: 'Technology' },
    { id: 'interactive-displays', name: 'Interactive Displays', category: 'Technology' },
    { id: 'led-lighting', name: 'LED & Lighting', category: 'Lighting' },
    { id: 'furniture-rental', name: 'Furniture Rental', category: 'Rental' },
    { id: 'graphics-printing', name: 'Graphics & Printing', category: 'Graphics' },
    { id: 'installation', name: 'Installation Services', category: 'Services' },
    { id: 'project-management', name: 'Project Management', category: 'Management' }
  ]);

  useEffect(() => {
    loadSystemStats();
  }, []);

  const loadSystemStats = async () => {
    setLoading(true);
    try {
      console.log('📊 Loading enhanced system statistics...');
      
      // Load comprehensive system data
      const responses = await Promise.all([
        fetch('/api/admin/builders'),
        fetch('/api/plans/manage?action=plans'),
        fetch('/api/notifications/manage?action=delivery_stats'),
        fetch('/api/builders/verify-claim?action=logs')
      ]);
      
      const [buildersData, plansData, notificationData, claimData] = await Promise.all(
        responses.map(r => r.json())
      );
      
      // Ensure builders is always an array
      const builders = Array.isArray(buildersData?.data) ? buildersData.data : 
                      Array.isArray(buildersData) ? buildersData : [];
      
      console.log('📊 Builders data loaded:', builders.length, 'builders found');
      
      setSystemStats({
        builders: {
          total: builders.length,
          claimed: builders.filter((b: any) => b.claimed).length,
          verified: builders.filter((b: any) => b.verified).length,
          premium: builders.filter((b: any) => b.premiumMember).length,
          gmbImported: builders.filter((b: any) => b.gmbImported).length
        },
        plans: {
          starter: builders.filter((b: any) => (b.planType || 'starter') === 'starter').length,
          basic: builders.filter((b: any) => b.planType === 'basic').length,
          growth: builders.filter((b: any) => b.planType === 'growth').length,
          pro: builders.filter((b: any) => b.planType === 'pro').length
        },
        notifications: notificationData?.stats || {
          totalSent: 0,
          deliveryRate: 95,
          openRate: 68,
          responseRate: 23
        },
        claims: {
          total: claimData?.total || 0,
          successful: builders.filter((b: any) => b.claimed).length,
          pending: builders.filter((b: any) => !b.claimed && (b.contactInfo?.primaryEmail || b.contactInfo?.phone)).length
        },
        revenue: {
          monthly: builders.filter((b: any) => b.planType && b.planType !== 'starter').length * 200,
          annual: builders.filter((b: any) => b.planType && b.planType !== 'starter').length * 200 * 12,
          conversion: builders.length > 0 ? Math.round((builders.filter((b: any) => b.planType && b.planType !== 'starter').length / builders.length) * 100) : 0
        }
      });
      
      console.log('✅ Enhanced system statistics loaded');
      
    } catch (error) {
      console.error('❌ Error loading system stats:', error);
      toast.error('Failed to load system statistics');
      
      // Set default empty stats on error
      setSystemStats({
        builders: { total: 0, claimed: 0, verified: 0, premium: 0, gmbImported: 0 },
        plans: { starter: 0, basic: 0, growth: 0, pro: 0 },
        notifications: { totalSent: 0, deliveryRate: 0, openRate: 0, responseRate: 0 },
        claims: { total: 0, successful: 0, pending: 0 },
        revenue: { monthly: 0, annual: 0, conversion: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkNotification = async () => {
    if (selectedBuilders.length === 0) {
      toast.error('Please select builders to notify');
      return;
    }
    
    setLoading(true);
    try {
      console.log(`📢 Sending bulk notification to ${selectedBuilders.length} builders`);
      
      const response = await fetch('/api/notifications/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bulk_notify',
          adminId,
          filters: { builderIds: selectedBuilders },
          message: notificationForm.message,
          methods: [notificationForm.method],
          priority: notificationForm.priority,
          scheduleAt: notificationForm.schedule || null
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(`✅ Bulk notification sent to ${result.summary?.successful || 0} builders`);
        setNotificationForm({ message: '', method: 'email', priority: 'MEDIUM', schedule: '' });
        setSelectedBuilders([]);
      } else {
        toast.error(`❌ Bulk notification failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error('❌ Bulk notification error:', error);
      toast.error('Bulk notification failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanAssignment = async () => {
    if (!planForm.builderId) {
      toast.error('Please select a builder');
      return;
    }
    
    setLoading(true);
    try {
      console.log(`💳 Assigning ${planForm.planType} plan to builder ${planForm.builderId}`);
      
      const response = await fetch('/api/plans/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'admin_override',
          builderId: planForm.builderId,
          planType: planForm.planType,
          adminId,
          duration: planForm.duration
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(
          <div className="space-y-2">
            <div className="font-semibold text-green-800">
              🎉 Demo Plan Assigned Successfully!
            </div>
            <div className="text-sm text-green-700">
              {result.planDetails?.name} ({result.valueProvided}) granted to builder {planForm.builderId}
            </div>
            <div className="text-xs text-green-600">
              All features activated • No payment required • Ready to receive leads
            </div>
          </div>
        );
        setPlanForm({ builderId: '', planType: 'basic', duration: '1' });
        await loadSystemStats();
      } else {
        toast.error(`❌ Demo assignment failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error('❌ Plan assignment error:', error);
      toast.error('Plan assignment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimOverride = async () => {
    if (!claimOverride.builderId || !claimOverride.contact) {
      toast.error('Please provide builder and contact information');
      return;
    }
    
    setLoading(true);
    try {
      console.log(`👨‍💼 Processing claim override for builder ${claimOverride.builderId}`);
      
      const response = await fetch('/api/builders/verify-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          builderId: claimOverride.builderId,
          otp: '000000',
          method: claimOverride.method,
          contact: claimOverride.contact,
          adminOverride: true,
          adminId,
          reason: claimOverride.reason
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('✅ Claim override completed successfully');
        setClaimOverride({ builderId: '', contact: '', method: 'email', reason: '' });
        await loadSystemStats();
      } else {
        toast.error(`❌ Claim override failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error('❌ Claim override error:', error);
      toast.error('Claim override failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async (method: string) => {
    const testContact = method === 'email' ? 'admin@test.com' : '+1234567890';
    
    setLoading(true);
    try {
      const response = await fetch('/api/notifications/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_notification',
          adminId,
          testType: 'lead_notification',
          recipient: testContact,
          method,
          customMessage: 'This is a test notification from the admin panel.'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(`✅ Test ${method} notification sent successfully`);
      } else {
        toast.error(`❌ Test notification failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error('❌ Test notification error:', error);
      toast.error('Test notification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceAssignment = async (builderId: string, serviceIds: string[]) => {
    try {
      console.log('🔧 Assigning services to builder:', builderId, serviceIds);
      
      const services = serviceIds.map(id => {
        const service = availableServices.find(s => s.id === id);
        return service ? {
          id: service.id,
          name: service.name,
          description: service.name,
          category: service.category,
          priceFrom: 300,
          currency: 'USD',
          unit: 'per sqm',
          popular: true,
          turnoverTime: '4-6 weeks'
        } : null;
      }).filter(Boolean);
      
      const response = await fetch('/api/admin/builders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          builderId,
          updates: {
            services: services,
            servicesAssignedBy: 'superadmin',
            servicesAssignedAt: new Date().toISOString()
          }
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(`✅ Services assigned successfully to builder`);
        setSelectedBuilderForServices(null);
        // Refresh data - simplified approach
        window.location.reload();
      } else {
        toast.error('❌ Failed to assign services: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Service assignment error:', error);
      toast.error('❌ Failed to assign services');
    }
  };

  const handleAutoAssignServices = async (builderId: string) => {
    try {
      console.log('🤖 Auto-assigning all services to GMB builder:', builderId);
      
      const allServiceIds = availableServices.map(s => s.id);
      await handleServiceAssignment(builderId, allServiceIds);
      
      toast.success('🎉 All services auto-assigned to unclaimed profile');
    } catch (error) {
      console.error('❌ Auto-assignment error:', error);
      toast.error('❌ Failed to auto-assign services');
    }
  };

  const handleManualClaimAssignment = async (builderId: string) => {
    try {
      console.log('🔐 Manually claiming builder profile:', builderId);
      
      const response = await fetch('/api/builders/update-claim-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          builderId,
          claimed: true,
          claimStatus: 'verified',
          claimedBy: 'superadmin',
          claimedAt: new Date().toISOString(),
          verificationData: {
            method: 'manual',
            verifiedBy: 'superadmin',
            verificationTimestamp: new Date().toISOString()
          }
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('✅ Builder profile manually claimed');
        // Refresh data - simplified approach
        window.location.reload();
      } else {
        toast.error('❌ Failed to claim profile: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Manual claim error:', error);
      toast.error('❌ Failed to claim profile');
    }
  };

  if (loading && Object.keys(systemStats).length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading enhanced admin controls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Enhanced Super Admin Controls</h1>
                <p className="text-blue-100">Complete system management and control panel</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">All Systems Operational</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Builders</p>
                <p className="text-3xl font-bold text-blue-900">{systemStats.builders?.total || 0}</p>
                <div className="text-xs text-blue-700 mt-1">
                  {systemStats.builders?.claimed || 0} claimed • {systemStats.builders?.verified || 0} verified
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Revenue (Monthly)</p>
                <p className="text-3xl font-bold text-green-900">${systemStats.revenue?.monthly?.toLocaleString() || 0}</p>
                <div className="text-xs text-green-700 mt-1">
                  {systemStats.revenue?.conversion || 0}% conversion rate
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Paid Plans</p>
                <p className="text-3xl font-bold text-purple-900">
                  {(systemStats.plans?.basic || 0) + (systemStats.plans?.growth || 0) + (systemStats.plans?.pro || 0)}
                </p>
                <div className="text-xs text-purple-700 mt-1">
                  {systemStats.plans?.starter || 0} on free plan
                </div>
              </div>
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Notification Rate</p>
                <p className="text-3xl font-bold text-orange-900">{systemStats.notifications?.deliveryRate || 0}%</p>
                <div className="text-xs text-orange-700 mt-1">
                  {systemStats.notifications?.openRate || 0}% open rate
                </div>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Control Tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="plans">Plan Management</TabsTrigger>
          <TabsTrigger value="claims">Claim Override</TabsTrigger>
          <TabsTrigger value="system">System Tools</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>Plan Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Starter (Free)</span>
                    <Badge className="bg-gray-100 text-gray-800">{systemStats.plans?.starter || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Basic ($200/mo)</span>
                    <Badge className="bg-blue-100 text-blue-800">{systemStats.plans?.basic || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Growth ($800/mo)</span>
                    <Badge className="bg-green-100 text-green-800">{systemStats.plans?.growth || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pro ($1400/mo)</span>
                    <Badge className="bg-purple-100 text-purple-800">{systemStats.plans?.pro || 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>Verification Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Claimed Profiles</span>
                    <Badge className="bg-green-100 text-green-800">{systemStats.builders?.claimed || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Verified Builders</span>
                    <Badge className="bg-blue-100 text-blue-800">{systemStats.builders?.verified || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">GMB Imported</span>
                    <Badge className="bg-purple-100 text-purple-800">{systemStats.builders?.gmbImported || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending Claims</span>
                    <Badge className="bg-orange-100 text-orange-800">{systemStats.claims?.pending || 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span>Bulk Notification System</span>
              </CardTitle>
              <CardDescription>
                Send notifications to multiple builders with admin control
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Notification Message</label>
                  <Textarea
                    value={notificationForm.message}
                    onChange={(e) => setNotificationForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Enter notification message..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Delivery Method</label>
                    <Select 
                      value={notificationForm.method} 
                      onValueChange={(value) => setNotificationForm(prev => ({ ...prev, method: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="dashboard">Dashboard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Priority</label>
                    <Select 
                      value={notificationForm.priority} 
                      onValueChange={(value) => setNotificationForm(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleBulkNotification}
                  disabled={loading || !notificationForm.message}
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Bulk Notification
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleTestNotification(notificationForm.method)}
                  disabled={loading}
                  className="text-gray-900"
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plan Management Tab */}
        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                <span>Plan Assignment & Demo Access</span>
              </CardTitle>
              <CardDescription>
                Assign paid subscriptions to any user for FREE - Perfect for demos, trials, and special cases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Demo Assignment Notice */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="font-semibold text-green-800">Free Demo Assignment</span>
                </div>
                <p className="text-sm text-green-700">
                  This assigns paid subscription features to any builder account without charging them. 
                  Perfect for demos, trials, or special promotions. No payment processing required.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Builder ID</label>
                  <Input
                    value={planForm.builderId}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, builderId: e.target.value }))}
                    placeholder="Enter builder ID..."
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">The builder's unique identifier</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Plan Type</label>
                  <Select 
                    value={planForm.planType} 
                    onValueChange={(value) => setPlanForm(prev => ({ ...prev, planType: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter (Free) - 0 leads</SelectItem>
                      <SelectItem value="basic">🎯 Basic ($200/mo) - 10 leads</SelectItem>
                      <SelectItem value="growth">📈 Growth ($800/mo) - 50 leads</SelectItem>
                      <SelectItem value="pro">👑 Pro ($1400/mo) - 100 leads</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">Regular price shown - but assigned for FREE</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Demo Duration</label>
                  <Select 
                    value={planForm.duration} 
                    onValueChange={(value) => setPlanForm(prev => ({ ...prev, duration: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Month Demo</SelectItem>
                      <SelectItem value="3">3 Months Demo</SelectItem>
                      <SelectItem value="6">6 Months Demo</SelectItem>
                      <SelectItem value="12">12 Months Demo</SelectItem>
                      <SelectItem value="unlimited">Unlimited Demo</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">How long the demo access lasts</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">💳</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900">What happens when assigned:</h4>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• ✅ Instant access to all plan features</li>
                    <li>• ✅ Full lead quota activated immediately</li>
                    <li>• ✅ No payment processing or billing</li>
                    <li>• ✅ Admin action logged for audit trail</li>
                    <li>• ✅ Builder can start receiving leads right away</li>
                  </ul>
                </div>
              </div>
              
              <Button 
                onClick={handlePlanAssignment}
                disabled={loading || !planForm.builderId}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {loading ? 'Assigning...' : '🎯 Assign Plan for FREE (Demo Access)'}
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                This action bypasses all payment processing and immediately grants full access to the selected plan.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Claims Override Tab */}
        <TabsContent value="claims" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Manual Claim Override</span>
              </CardTitle>
              <CardDescription>
                Manually claim builder profiles without OTP verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Builder ID</label>
                  <Input
                    value={claimOverride.builderId}
                    onChange={(e) => setClaimOverride(prev => ({ ...prev, builderId: e.target.value }))}
                    placeholder="Enter builder ID..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Contact Method</label>
                  <Select 
                    value={claimOverride.method} 
                    onValueChange={(value) => setClaimOverride(prev => ({ ...prev, method: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Contact Information</label>
                  <Input
                    value={claimOverride.contact}
                    onChange={(e) => setClaimOverride(prev => ({ ...prev, contact: e.target.value }))}
                    placeholder={claimOverride.method === 'email' ? 'email@domain.com' : '+1234567890'}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Override Reason</label>
                  <Input
                    value={claimOverride.reason}
                    onChange={(e) => setClaimOverride(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Reason for manual claim..."
                    className="mt-1"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleClaimOverride}
                disabled={loading || !claimOverride.builderId || !claimOverride.contact}
                className="w-full"
              >
                <Shield className="h-4 w-4 mr-2" />
                Override Claim (Manual Verification)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tools Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <span>System Operations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  onClick={loadSystemStats}
                  disabled={loading}
                  className="w-full justify-start text-gray-900"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh System Stats
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-gray-900"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-gray-900"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  onClick={() => handleTestNotification('email')}
                  disabled={loading}
                  className="w-full justify-start text-gray-900"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Test Email System
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleTestNotification('sms')}
                  disabled={loading}
                  className="w-full justify-start text-gray-900"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Test SMS System
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-gray-900"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View System Logs
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Service Assignment Dialog */}
        {selectedBuilderForServices && (
          <Dialog open={!!selectedBuilderForServices} onOpenChange={() => setSelectedBuilderForServices(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Assign Services to Builder</DialogTitle>
                <DialogDescription>
                  Select services to assign to this builder profile
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {Object.entries(availableServices.reduce((acc, service) => {
                  if (!acc[service.category]) acc[service.category] = [];
                  acc[service.category].push(service);
                  return acc;
                }, {} as Record<string, typeof availableServices>)).map(([category, services]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-medium text-gray-900">{category}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {services.map(service => {
                        const allBuilders = data?.builders || [];
                        const builder = allBuilders.find((b: any) => b.id === selectedBuilderForServices);
                        const isAssigned = builder?.services?.some((s: any) => s.id === service.id);
                        
                        return (
                          <div key={service.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={service.id}
                              checked={isAssigned}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  const currentServices = builder?.services || [];
                                  const newService = {
                                    id: service.id,
                                    name: service.name,
                                    description: service.name,
                                    category: service.category,
                                    priceFrom: 300,
                                    currency: 'USD',
                                    unit: 'per sqm',
                                    popular: true,
                                    turnoverTime: '4-6 weeks'
                                  };
                                  handleServiceAssignment(selectedBuilderForServices, [...currentServices.map((s: any) => s.id), service.id]);
                                } else {
                                  const currentServices = builder?.services || [];
                                  const filteredServices = currentServices.filter((s: any) => s.id !== service.id);
                                  handleServiceAssignment(selectedBuilderForServices, filteredServices.map((s: any) => s.id));
                                }
                              }}
                            />
                            <Label htmlFor={service.id} className="text-sm cursor-pointer">
                              {service.name}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    const allServiceIds = availableServices.map(s => s.id);
                    handleServiceAssignment(selectedBuilderForServices, allServiceIds);
                  }}
                  className="text-blue-600"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Assign All Services
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleServiceAssignment(selectedBuilderForServices, [])}
                  className="text-red-600"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All Services
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </Tabs>
    </div>
  );
}
