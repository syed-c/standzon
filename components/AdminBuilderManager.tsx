'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Plus,
  FileText,
  AlertCircle
} from 'lucide-react';
import { exhibitionBuilders } from '@/lib/data/exhibitionBuilders';
import { tier1Countries as countries } from '@/lib/data/countries';
import { downloadCSVTemplate, parseBuilderCSV, validateBuilderData, exportBuildersToCSV } from '@/lib/utils/csvUtils';
import { toast } from 'sonner';

interface Builder {
  id: string;
  companyName: string;
  contactInfo: {
    contactPerson: string;
    primaryEmail: string;
    phone: string;
    website?: string;
  };
  headquarters: {
    city: string;
    country: string;
  };
  services: { name: string; id: string }[];
  description: string;
  status: 'active' | 'pending' | 'suspended';
  verified: boolean;
  rating: number;
  projectsCompleted: number;
  establishedYear: number;
  teamSize: number;
}

export default function AdminBuilderManager() {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [filteredBuilders, setFilteredBuilders] = useState<Builder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [selectedBuilder, setSelectedBuilder] = useState<Builder | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  console.log('Admin Builder Manager loaded');

  useEffect(() => {
    // Initialize with existing builders and add status/verification info
    const initBuilders = exhibitionBuilders.map(builder => ({
      ...builder,
      description: 'Professional exhibition stand builder with years of experience',
      status: (Math.random() > 0.7 ? 'pending' : 'active') as 'active' | 'pending' | 'suspended',
      verified: Math.random() > 0.3
    }));
    setBuilders(initBuilders);
    setFilteredBuilders(initBuilders);
    console.log('Loaded builders:', initBuilders.length);
  }, []);

  useEffect(() => {
    let filtered = builders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(builder =>
        builder.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        builder.headquarters.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        builder.headquarters.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        builder.contactInfo.primaryEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(builder => builder.status === statusFilter);
    }

    // Country filter
    if (countryFilter !== 'all') {
      filtered = filtered.filter(builder => builder.headquarters.country === countryFilter);
    }

    setFilteredBuilders(filtered);
    console.log('Filtered builders:', filtered.length);
  }, [builders, searchTerm, statusFilter, countryFilter]);

  const handleStatusChange = (builderId: string, newStatus: 'active' | 'pending' | 'suspended') => {
    setBuilders(prev => prev.map(builder =>
      builder.id === builderId ? { ...builder, status: newStatus } : builder
    ));
    console.log(`Updated builder ${builderId} status to:`, newStatus);
    toast.success(`Builder status updated to ${newStatus}`);
  };

  const handleVerificationToggle = (builderId: string) => {
    setBuilders(prev => prev.map(builder =>
      builder.id === builderId ? { ...builder, verified: !builder.verified } : builder
    ));
    console.log(`Toggled verification for builder:`, builderId);
    toast.success('Builder verification updated');
  };

  const handleDelete = (builderId: string) => {
    if (confirm('Are you sure you want to delete this builder?')) {
      setBuilders(prev => prev.filter(builder => builder.id !== builderId));
      console.log('Deleted builder:', builderId);
      toast.success('Builder deleted successfully');
    }
  };

  const handleEdit = (builder: Builder) => {
    setSelectedBuilder({ ...builder });
    setIsEditModalOpen(true);
    console.log('Editing builder:', builder.companyName);
  };

  const saveBuilderChanges = () => {
    if (!selectedBuilder) return;

    setBuilders(prev => prev.map(builder =>
      builder.id === selectedBuilder.id ? selectedBuilder : builder
    ));
    setIsEditModalOpen(false);
    setSelectedBuilder(null);
    console.log('Saved changes for builder:', selectedBuilder.companyName);
    toast.success('Builder updated successfully');
  };

  const handleBulkUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadErrors([]);
    console.log('Starting bulk upload:', file.name);

    try {
      const text = await file.text();
      setUploadProgress(20);

      const parsedBuilders = parseBuilderCSV(text);
      setUploadProgress(40);

      const validationErrors: string[] = [];
      const validBuilders: any[] = [];

      parsedBuilders.forEach((builder, index) => {
        const errors = validateBuilderData(builder);
        if (errors.length > 0) {
          validationErrors.push(`Row ${index + 2}: ${errors.join(', ')}`);
        } else {
          validBuilders.push({
            id: uuidv4(),
            companyName: builder.companyName,
            contactInfo: {
              contactPerson: builder.contactPerson,
              primaryEmail: builder.primaryEmail,
              phone: builder.phone,
              website: builder.website || undefined
            },
            headquarters: {
              city: builder.city,
              country: builder.country
            },
            services: builder.services.split(',').map(s => ({
              name: s.trim(),
              id: uuidv4()
            })),
            description: builder.specializations,
            status: 'active' as const,
            verified: false,
            rating: 0,
            projectsCompleted: 0,
            establishedYear: builder.establishedYear,
            teamSize: builder.teamSize
          });
        }
        setUploadProgress(40 + ((index / parsedBuilders.length) * 40));
      });

      if (validationErrors.length > 0) {
        setUploadErrors(validationErrors);
        toast.error(`Found ${validationErrors.length} validation errors`);
      } else {
        setBuilders(prev => [...prev, ...validBuilders]);
        setUploadProgress(100);
        console.log(`Successfully imported ${validBuilders.length} builders`);
        toast.success(`Successfully imported ${validBuilders.length} builders`);
        setTimeout(() => {
          setIsBulkUploadOpen(false);
          setUploadProgress(0);
        }, 2000);
      }
    } catch (error) {
      console.error('Bulk upload error:', error);
      toast.error('Failed to process upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleExport = () => {
    exportBuildersToCSV(builders);
    toast.success('Builder data exported successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'suspended': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Builder Management</h1>
          <p className="text-gray-600">Manage all exhibition stand builders and companies</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Bulk Upload Builders</DialogTitle>
                <DialogDescription>
                  Upload multiple builders using a CSV file
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Button onClick={downloadCSVTemplate} variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                  <p className="text-sm text-gray-600">
                    Download the CSV template and fill in your builder data
                  </p>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleBulkUpload(file);
                    }}
                    className="hidden"
                    id="csv-upload"
                    disabled={isUploading}
                  />
                  <Label htmlFor="csv-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900">
                      {isUploading ? 'Processing...' : 'Click to upload CSV file'}
                    </p>
                    <p className="text-sm text-gray-600">Supports CSV files up to 10MB</p>
                  </Label>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Processing upload...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}

                {uploadErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">Validation Errors:</h4>
                    <div className="max-h-40 overflow-y-auto">
                      {uploadErrors.map((error, index) => (
                        <p key={index} className="text-sm text-red-600">{error}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search builders, cities, countries, or emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map(country => (
                  <SelectItem key={country.code} value={country.name}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{builders.length}</p>
                <p className="text-sm text-gray-600">Total Builders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{builders.filter(b => b.status === 'active').length}</p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{builders.filter(b => b.status === 'pending').length}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{builders.filter(b => b.verified).length}</p>
                <p className="text-sm text-gray-600">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Builders List */}
      <Card>
        <CardHeader>
          <CardTitle>All Builders ({filteredBuilders.length})</CardTitle>
          <CardDescription>Manage and edit builder profiles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBuilders.map(builder => (
              <div key={builder.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="font-semibold text-lg">{builder.companyName}</h3>
                        <p className="text-gray-600">
                          {builder.headquarters.city}, {builder.headquarters.country}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(builder.status)}>
                          {getStatusIcon(builder.status)}
                          <span className="ml-1 capitalize">{builder.status}</span>
                        </Badge>
                        {builder.verified && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                      <span>{builder.contactInfo.primaryEmail}</span>
                      <span>{builder.contactInfo.phone}</span>
                      <span>{builder.projectsCompleted} projects</span>
                      <span>⭐ {builder.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select 
                      value={builder.status} 
                      onValueChange={(value: 'active' | 'pending' | 'suspended') => 
                        handleStatusChange(builder.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerificationToggle(builder.id)}
                    >
                      {builder.verified ? 'Unverify' : 'Verify'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(builder)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(builder.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Builder Profile</DialogTitle>
            <DialogDescription>Update builder information and settings</DialogDescription>
          </DialogHeader>
          {selectedBuilder && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Company Name</Label>
                  <Input
                    value={selectedBuilder.companyName}
                    onChange={(e) => setSelectedBuilder({
                      ...selectedBuilder,
                      companyName: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>Contact Person</Label>
                  <Input
                    value={selectedBuilder.contactInfo.contactPerson}
                    onChange={(e) => setSelectedBuilder({
                      ...selectedBuilder,
                      contactInfo: {
                        ...selectedBuilder.contactInfo,
                        contactPerson: e.target.value
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={selectedBuilder.contactInfo.primaryEmail}
                    onChange={(e) => setSelectedBuilder({
                      ...selectedBuilder,
                      contactInfo: {
                        ...selectedBuilder.contactInfo,
                        primaryEmail: e.target.value
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={selectedBuilder.contactInfo.phone}
                    onChange={(e) => setSelectedBuilder({
                      ...selectedBuilder,
                      contactInfo: {
                        ...selectedBuilder.contactInfo,
                        phone: e.target.value
                      }
                    })}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>City</Label>
                  <Input
                    value={selectedBuilder.headquarters.city}
                    onChange={(e) => setSelectedBuilder({
                      ...selectedBuilder,
                      headquarters: {
                        ...selectedBuilder.headquarters,
                        city: e.target.value
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input
                    value={selectedBuilder.headquarters.country}
                    onChange={(e) => setSelectedBuilder({
                      ...selectedBuilder,
                      headquarters: {
                        ...selectedBuilder.headquarters,
                        country: e.target.value
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Team Size</Label>
                  <Input
                    type="number"
                    value={selectedBuilder.teamSize}
                    onChange={(e) => setSelectedBuilder({
                      ...selectedBuilder,
                      teamSize: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <Label>Established Year</Label>
                  <Input
                    type="number"
                    value={selectedBuilder.establishedYear}
                    onChange={(e) => setSelectedBuilder({
                      ...selectedBuilder,
                      establishedYear: parseInt(e.target.value) || 2024
                    })}
                  />
                </div>
              </div>
              <div className="col-span-2 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveBuilderChanges} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
