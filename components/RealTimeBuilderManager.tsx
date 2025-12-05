'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { adminAPI } from '@/lib/api/admin';
import { ExhibitionBuilder } from '@/lib/data/exhibitionBuilders';
import {
  Upload,
  Download,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  Filter,
  FileText,
  Users,
  Building,
  MapPin,
  Star,
  Eye,
  RefreshCw
} from 'lucide-react';

interface RealTimeBuilderManagerProps {
  onBuilderUpdate?: (builders: ExhibitionBuilder[]) => void;
}

export default function RealTimeBuilderManager({ onBuilderUpdate }: RealTimeBuilderManagerProps) {
  const [builders, setBuilders] = useState<ExhibitionBuilder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [isAddingBuilder, setIsAddingBuilder] = useState(false);
  const [editingBuilder, setEditingBuilder] = useState<ExhibitionBuilder | null>(null);
  const [bulkUploadProgress, setBulkUploadProgress] = useState(0);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Load builders on component mount
  useEffect(() => {
    loadBuilders();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = adminAPI.subscribe((event: string, data: any) => {
      console.log('Real-time builder update:', event, data);
      
      switch (event) {
        case 'builder_created':
          setBuilders(prev => [...prev, data]);
          break;
        case 'builder_updated':
          setBuilders(prev => prev.map(b => b.id === data.id ? data : b));
          break;
        case 'builder_deleted':
          setBuilders(prev => prev.filter(b => b.id !== data.id));
          break;
      }
    });

    return unsubscribe;
  }, []);

  // Notify parent component of builder updates
  useEffect(() => {
    if (onBuilderUpdate) {
      onBuilderUpdate(builders);
    }
  }, [builders, onBuilderUpdate]);

  const loadBuilders = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getBuilders(1, 100);
      if (response.success && response.data) {
        setBuilders(response.data);
        console.log('Builders loaded:', response.data.length);
      }
    } catch (error) {
      console.error('Error loading builders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBuilder = async (builderData: Partial<ExhibitionBuilder>) => {
    try {
      const response = await adminAPI.createBuilder(builderData);
      if (response.success) {
        console.log('Builder added successfully');
        setIsAddingBuilder(false);
      } else {
        console.error('Failed to add builder:', response.error);
      }
    } catch (error) {
      console.error('Error adding builder:', error);
    }
  };

  const handleEditBuilder = async (builderId: string, updates: Partial<ExhibitionBuilder>) => {
    try {
      const response = await adminAPI.updateBuilder(builderId, updates);
      if (response.success) {
        console.log('Builder updated successfully');
        setEditingBuilder(null);
      } else {
        console.error('Failed to update builder:', response.error);
      }
    } catch (error) {
      console.error('Error updating builder:', error);
    }
  };

  const handleDeleteBuilder = async (builderId: string) => {
    if (confirm('Are you sure you want to delete this builder?')) {
      try {
        const response = await adminAPI.deleteBuilder(builderId);
        if (response.success) {
          console.log('Builder deleted successfully');
        } else {
          console.error('Failed to delete builder:', response.error);
        }
      } catch (error) {
        console.error('Error deleting builder:', error);
      }
    }
  };

  const handleBulkUpload = async () => {
    if (!uploadFile) return;

    setIsUploading(true);
    setBulkUploadProgress(0);

    try {
      // Simulate file processing
      const text = await uploadFile.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      const buildersData: Partial<ExhibitionBuilder>[] = [];

      // Parse CSV data
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',');
          const builderData: any = {};
          
          headers.forEach((header, index) => {
            const key = header.trim().toLowerCase();
            const value = values[index]?.trim();
            
            switch (key) {
              case 'company name':
              case 'companyname':
                builderData.companyName = value;
                builderData.slug = value?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                break;
              case 'email':
                builderData.contactInfo = { ...builderData.contactInfo, primaryEmail: value };
                break;
              case 'phone':
                builderData.contactInfo = { ...builderData.contactInfo, phone: value };
                break;
              case 'city':
                builderData.headquarters = { ...builderData.headquarters, city: value };
                break;
              case 'country':
                builderData.headquarters = { ...builderData.headquarters, country: value };
                break;
              case 'description':
                builderData.companyDescription = value;
                break;
            }
          });

          // Set defaults
          builderData.id = uuidv4(); // Generate proper UUID instead of string-based ID
          builderData.establishedYear = 2020;
          builderData.teamSize = 10;
          builderData.projectsCompleted = 50;
          builderData.rating = 4.5;
          builderData.reviewCount = 25;
          builderData.responseTime = 'Within 24 hours';
          builderData.languages = ['English'];
          builderData.verified = false;
          builderData.premiumMember = false;
          builderData.tradeshowExperience = [];
          builderData.specializations = [];
          builderData.certifications = [];
          builderData.awards = [];
          builderData.portfolio = [];
          builderData.services = [];
          builderData.whyChooseUs = [];
          builderData.clientTestimonials = [];
          builderData.socialMedia = {};
          builderData.keyStrengths = [];
          builderData.recentProjects = [];
          builderData.priceRange = {
            basicStand: { min: 100, max: 200, currency: 'USD', unit: 'per sqm' },
            customStand: { min: 300, max: 500, currency: 'USD', unit: 'per sqm' },
            premiumStand: { min: 600, max: 1000, currency: 'USD', unit: 'per sqm' },
            averageProject: 50000,
            currency: 'USD'
          };

          if (builderData.companyName) {
            buildersData.push(builderData);
          }
        }

        // Update progress
        setBulkUploadProgress((i / lines.length) * 100);
      }

      // Upload builders in bulk
      const response = await adminAPI.bulkCreateBuilders(buildersData);
      if (response.success) {
        console.log('Bulk upload completed:', response.data?.length, 'builders created');
        setBulkUploadProgress(100);
        setUploadFile(null);
        
        // Reset upload state after a delay
        setTimeout(() => {
          setIsUploading(false);
          setBulkUploadProgress(0);
        }, 2000);
      } else {
        console.error('Bulk upload failed:', response.error);
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Error processing bulk upload:', error);
      setIsUploading(false);
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = `Company Name,Email,Phone,City,Country,Description
Expo Design Germany,info@expodesign.de,+49 30 123456,Berlin,Germany,Leading exhibition stand builder
Premier Exhibits USA,info@premierexhibits.com,+1 702 555 0123,Las Vegas,United States,Professional trade show displays
Milano Stands Italy,contact@milanostands.it,+39 02 123456,Milan,Italy,Creative exhibition solutions`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'builders-sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Filter builders based on search and filters
  const filteredBuilders = builders.filter(builder => {
    const matchesSearch = builder.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         builder.companyDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = selectedCountry === 'all' || 
                          builder.headquarters.country.toLowerCase() === selectedCountry.toLowerCase();
    
    const matchesVerification = verificationFilter === 'all' ||
                               (verificationFilter === 'verified' && builder.verified) ||
                               (verificationFilter === 'pending' && !builder.verified);

    return matchesSearch && matchesCountry && matchesVerification;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading builders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Builder Management</h2>
          <p className="text-gray-600">Manage exhibition stand builders with real-time updates</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={downloadSampleCSV}>
            <Download className="h-4 w-4 mr-2" />
            Sample CSV
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Import Builders</DialogTitle>
                <DialogDescription>
                  Upload a CSV file to import multiple builders at once
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csvFile">CSV File</Label>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  />
                </div>
                {isUploading && (
                  <div>
                    <Label>Upload Progress</Label>
                    <Progress value={bulkUploadProgress} className="w-full" />
                    <p className="text-sm text-gray-500 mt-1">
                      {Math.round(bulkUploadProgress)}% complete
                    </p>
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={downloadSampleCSV}>
                    Download Sample
                  </Button>
                  <Button 
                    onClick={handleBulkUpload} 
                    disabled={!uploadFile || isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Builders'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={() => setIsAddingBuilder(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Builder
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search builders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="germany">Germany</SelectItem>
                <SelectItem value="united states">United States</SelectItem>
                <SelectItem value="united kingdom">United Kingdom</SelectItem>
                <SelectItem value="france">France</SelectItem>
                <SelectItem value="italy">Italy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={verificationFilter} onValueChange={setVerificationFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadBuilders}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Builders List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Builders ({filteredBuilders.length})</span>
            <Badge variant="outline">
              {builders.filter(b => b.verified).length} verified
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBuilders.map((builder) => (
              <div key={builder.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{builder.companyName}</h4>
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {builder.headquarters.city}, {builder.headquarters.country}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={builder.verified ? 'default' : 'secondary'}>
                        {builder.verified ? (
                          <><CheckCircle className="h-3 w-3 mr-1" />Verified</>
                        ) : (
                          <><Clock className="h-3 w-3 mr-1" />Pending</>
                        )}
                      </Badge>
                      <Badge variant="outline" className="flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        {builder.rating} ({builder.reviewCount})
                      </Badge>
                      {builder.premiumMember && (
                        <Badge className="bg-gold-100 text-gold-800">Premium</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingBuilder(builder)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteBuilder(builder.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredBuilders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No builders found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsAddingBuilder(true)}
              >
                Add First Builder
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Builder Dialog */}
      <Dialog open={isAddingBuilder} onOpenChange={setIsAddingBuilder}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Builder</DialogTitle>
            <DialogDescription>
              Create a new exhibition stand builder profile
            </DialogDescription>
          </DialogHeader>
          <BuilderForm 
            onSave={handleAddBuilder}
            onCancel={() => setIsAddingBuilder(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Builder Dialog */}
      <Dialog open={!!editingBuilder} onOpenChange={() => setEditingBuilder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Builder</DialogTitle>
            <DialogDescription>
              Update builder information and settings
            </DialogDescription>
          </DialogHeader>
          {editingBuilder && (
            <BuilderForm 
              builder={editingBuilder}
              onSave={(data) => handleEditBuilder(editingBuilder.id, data)}
              onCancel={() => setEditingBuilder(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Builder Form Component
function BuilderForm({ 
  builder,
  onSave, 
  onCancel 
}: { 
  builder?: ExhibitionBuilder;
  onSave: (data: Partial<ExhibitionBuilder>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<any>(builder || {
    companyName: '',
    companyDescription: '',
    headquarters: { city: '', country: '', countryCode: '' },
    contactInfo: { primaryEmail: '', phone: '', contactPerson: '', position: '' },
    verified: false,
    premiumMember: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Company Name</Label>
          <Input
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Contact Person</Label>
          <Input
            value={formData.contactInfo?.contactPerson || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              contactInfo: { ...formData.contactInfo, contactPerson: e.target.value }
            })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.contactInfo?.primaryEmail || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              contactInfo: { ...formData.contactInfo, primaryEmail: e.target.value }
            })}
            required
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            value={formData.contactInfo?.phone || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              contactInfo: { ...formData.contactInfo, phone: e.target.value }
            })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>City</Label>
          <Input
            value={formData.headquarters?.city || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              headquarters: { ...formData.headquarters, city: e.target.value }
            })}
            required
          />
        </div>
        <div>
          <Label>Country</Label>
          <Input
            value={formData.headquarters?.country || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              headquarters: { ...formData.headquarters, country: e.target.value }
            })}
            required
          />
        </div>
      </div>

      <div>
        <Label>Company Description</Label>
        <Textarea
          value={formData.companyDescription}
          onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Verification Status</Label>
          <Select 
            value={formData.verified ? 'verified' : 'pending'}
            onValueChange={(value) => setFormData({ ...formData, verified: value === 'verified' })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Membership Type</Label>
          <Select 
            value={formData.premiumMember ? 'premium' : 'standard'}
            onValueChange={(value) => setFormData({ ...formData, premiumMember: value === 'premium' })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {builder ? 'Update Builder' : 'Add Builder'}
        </Button>
      </div>
    </form>
  );
}