'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Download,
  Filter,
  Search,
  Calendar,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { RegistrationService, NotificationService, type BuilderRegistration } from '@/lib/utils/registrationSync';

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<BuilderRegistration[]>([]);
  const [pendingRegistrations, setPendingRegistrations] = useState<BuilderRegistration[]>([]);
  const [stats, setStats] = useState<any>({});
  const [selectedReg, setSelectedReg] = useState<BuilderRegistration | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  console.log('Admin registrations page loaded');

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      setIsLoading(true);
      console.log('Loading registrations data...');

      const [allRegs, pendingRegs, regStats] = await Promise.all([
        RegistrationService.getAllRegistrations(),
        RegistrationService.getPendingRegistrations(),
        RegistrationService.getRegistrationStats()
      ]);

      setRegistrations(allRegs);
      setPendingRegistrations(pendingRegs);
      setStats(regStats);

      console.log('Registrations loaded:', {
        total: allRegs.length,
        pending: pendingRegs.length,
        stats: regStats
      });

    } catch (error: any) {
      console.error('Error loading registrations:', error);
      toast.error('Failed to load registrations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (registrationId: string) => {
    try {
      console.log('Approving registration:', registrationId);

      await RegistrationService.approveRegistration(
        registrationId, 
        'admin-001', 
        reviewNotes
      );

      toast.success('Registration approved successfully!');
      await loadRegistrations();
      setSelectedReg(null);
      setReviewNotes('');

    } catch (error: any) {
      console.error('Error approving registration:', error);
      toast.error('Failed to approve registration');
    }
  };

  const handleReject = async (registrationId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      console.log('Rejecting registration:', registrationId);

      await RegistrationService.rejectRegistration(
        registrationId,
        rejectionReason,
        'admin-001'
      );

      toast.success('Registration rejected');
      await loadRegistrations();
      setSelectedReg(null);
      setRejectionReason('');

    } catch (error: any) {
      console.error('Error rejecting registration:', error);
      toast.error('Failed to reject registration');
    }
  };

  const exportRegistrations = () => {
    const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(
      'ID,Company,Contact,Email,Status,Date\n' +
      registrations.map(reg => 
        `${reg.id},${reg.companyName},${reg.fullName},${reg.email},${reg.status},${reg.registrationDate}`
      ).join('\n')
    )}`;

    const link = document.createElement('a');
    link.href = csvContent;
    link.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    console.log('Registrations exported');
    toast.success('Registrations exported successfully');
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { variant: 'outline' as const, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
      approved: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
      rejected: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
      suspended: { variant: 'secondary' as const, icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-50' }
    };

    const { variant, icon: Icon } = config[status as keyof typeof config] || config.pending;

    return (
      <Badge variant={variant} className="flex items-center space-x-1">
        <Icon className="w-3 h-3" />
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading registrations...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Builder Registrations</h1>
            <p className="text-gray-600 mt-1">Review and manage builder registration applications</p>
          </div>
          <Button onClick={exportRegistrations} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Registrations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Approved Today</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.todayRegistrations || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Live Builders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by company name, email, or contact person..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Registrations ({registrations.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending Review ({pendingRegistrations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredRegistrations.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No registrations found matching your criteria</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredRegistrations.map(registration => (
                  <Card key={registration.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {registration.companyName}
                              </h3>
                              <p className="text-sm text-gray-600">{registration.fullName}</p>
                            </div>
                            {getStatusBadge(registration.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span>{registration.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>{registration.city}, {registration.country}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(registration.registrationDate).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {registration.services.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {registration.services.slice(0, 3).map(service => (
                                <Badge key={service} variant="secondary" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                              {registration.services.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{registration.services.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="ml-6">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedReg(registration)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Registration Review - {registration.companyName}</DialogTitle>
                              </DialogHeader>
                              
                              {selectedReg && (
                                <div className="space-y-6">
                                  {/* Company Details */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Company Name</label>
                                      <p className="text-gray-900">{selectedReg.companyName}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Contact Person</label>
                                      <p className="text-gray-900">{selectedReg.fullName}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Email</label>
                                      <p className="text-gray-900">{selectedReg.email}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Phone</label>
                                      <p className="text-gray-900">{selectedReg.mobile}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Location</label>
                                      <p className="text-gray-900">{selectedReg.city}, {selectedReg.country}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Website</label>
                                      <p className="text-gray-900">{selectedReg.website || 'Not provided'}</p>
                                    </div>
                                  </div>

                                  {/* Services */}
                                  <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Services</label>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedReg.services.map(service => (
                                        <Badge key={service} variant="secondary">{service}</Badge>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Description */}
                                  <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Company Description</label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedReg.description}</p>
                                  </div>

                                  {selectedReg.status === 'pending' && (
                                    <div className="space-y-4 border-t pt-4">
                                      <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Admin Notes</label>
                                        <Textarea
                                          placeholder="Add notes about this registration..."
                                          value={reviewNotes}
                                          onChange={(e) => setReviewNotes(e.target.value)}
                                          rows={3}
                                        />
                                      </div>
                                      
                                      <div className="flex space-x-3">
                                        <Button 
                                          onClick={() => handleApprove(selectedReg.id)}
                                          className="bg-green-600 hover:bg-green-700 flex-1"
                                        >
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Approve Registration
                                        </Button>
                                        
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button variant="destructive" className="flex-1">
                                              <XCircle className="w-4 h-4 mr-2" />
                                              Reject
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>Reject Registration</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                              <p className="text-sm text-gray-600">
                                                Please provide a reason for rejecting this registration:
                                              </p>
                                              <Textarea
                                                placeholder="Reason for rejection..."
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                rows={3}
                                              />
                                              <div className="flex space-x-3">
                                                <Button 
                                                  variant="destructive" 
                                                  onClick={() => handleReject(selectedReg.id)}
                                                  className="flex-1"
                                                >
                                                  Confirm Rejection
                                                </Button>
                                              </div>
                                            </div>
                                          </DialogContent>
                                        </Dialog>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingRegistrations.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No pending registrations to review</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingRegistrations.map(registration => (
                  <Card key={registration.id} className="border-l-4 border-l-yellow-400">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {registration.companyName}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span>{registration.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>{registration.city}, {registration.country}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(registration.registrationDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-6 flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApprove(registration.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Quick Review - {registration.companyName}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <strong>Contact:</strong> {registration.fullName}
                                  </div>
                                  <div>
                                    <strong>Email:</strong> {registration.email}
                                  </div>
                                  <div>
                                    <strong>Location:</strong> {registration.city}, {registration.country}
                                  </div>
                                  <div>
                                    <strong>Services:</strong> {registration.services.length} selected
                                  </div>
                                </div>
                                <div>
                                  <strong>Description:</strong>
                                  <p className="text-gray-600 mt-1">{registration.description}</p>
                                </div>
                                <div className="flex space-x-3 pt-4">
                                  <Button 
                                    onClick={() => handleApprove(registration.id)}
                                    className="bg-green-600 hover:bg-green-700 flex-1"
                                  >
                                    Approve
                                  </Button>
                                  <Button variant="outline" className="flex-1">
                                    Need More Info
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}