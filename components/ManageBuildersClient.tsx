'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Building2, ArrowLeft, Edit, Trash2, CheckCircle, XCircle, 
  Star, Mail, Phone, Globe, MapPin, Users, Calendar,
  Plus, Save, X, Eye, ExternalLink, Award, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExhibitionBuilder } from '@/lib/data/exhibitionBuilders';
import { tier1Countries } from '@/lib/data/countries';

interface ManageBuildersClientProps {
  initialBuilders: ExhibitionBuilder[];
}

export default function ManageBuildersClient({ initialBuilders }: ManageBuildersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const builderId = searchParams?.get('id');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBuilder, setSelectedBuilder] = useState<ExhibitionBuilder | null>(null);
  const [editingBuilder, setEditingBuilder] = useState<ExhibitionBuilder | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [builders, setBuilders] = useState<ExhibitionBuilder[]>(initialBuilders);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Load builder for editing when builderId changes
  useEffect(() => {
    if (builderId) {
      loadBuilderForEditing(builderId);
    }
  }, [builderId]);

  const loadBuilders = async () => {
    try {
      const response = await fetch('/api/admin/builders?prioritize_real=true');
      const data = await response.json();
      
      if (data.success && data.data?.builders) {
        // Filter to show only Supabase-added providers (real data)
        const realBuilders = data.data.builders.filter((builder: any) => 
          builder.source === 'google_places_api' || 
          builder.gmbImported || 
          builder.importedFromGMB ||
          (builder.id && builder.id.startsWith('gmb_'))
        );
        setBuilders(realBuilders);
        console.log('Loaded real builders:', realBuilders.length);
      } else {
        setBuilders([]);
        console.log('No real builders found');
      }
    } catch (error) {
      console.error('Error loading builders:', error);
      setBuilders([]);
    }
  };

  const loadBuilderForEditing = async (id: string) => {
    try {
      const response = await fetch(`/api/builders/${id}`);
      const result = await response.json();
      
      if (result.data) {
        setEditingBuilder(result.data);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error loading builder for editing:', error);
    }
  };

  // Filter builders
  const filteredBuilders = builders.filter(builder => {
    const matchesSearch = builder.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         builder.contactInfo?.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCountry = filterCountry === 'all' || 
                          builder.serviceLocations?.some(loc => loc.country === filterCountry);
    
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'verified' && builder.verified) ||
                         (filterStatus === 'pending' && !builder.verified) ||
                         (filterStatus === 'premium' && builder.premiumMember);
    
    return matchesSearch && matchesCountry && matchesStatus;
  });

  const handleEditBuilder = (builder: ExhibitionBuilder) => {
    setEditingBuilder({ ...builder });
    setIsEditing(true);
    console.log('Editing builder:', builder.companyName);
  };

  const handleSaveBuilder = async () => {
    if (!editingBuilder) return;
    
    try {
      setSaving(true);
      console.log('Saving builder changes:', editingBuilder.companyName);
      
      const response = await fetch('/api/admin/builders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          builderId: editingBuilder.id,
          updates: editingBuilder
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setBuilders(prev => prev.map(b => b.id === editingBuilder.id ? editingBuilder : b));
        setIsEditing(false);
        setEditingBuilder(null);
        console.log('Builder updated successfully!');
      } else {
        console.error('Failed to update builder: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving builder:', error);
      console.error('Failed to update builder. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBuilder = async (builderId: string) => {
    try {
      setDeleting(builderId);
      console.log('Deleting builder:', builderId);
      
      const response = await fetch('/api/admin/builders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ builderId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove from local state
        setBuilders(prev => prev.filter(b => b.id !== builderId));
        console.log('Builder deleted successfully!');
      } else {
        console.error('Failed to delete builder: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting builder:', error);
      console.error('Failed to delete builder. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const toggleBuilderStatus = async (builder: ExhibitionBuilder, field: 'verified' | 'premiumMember') => {
    try {
      setSaving(true);
      console.log(`Toggling ${field} for builder:`, builder.companyName);
      
      const updates = { [field]: !builder[field] };
      
      const response = await fetch('/api/admin/builders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          builderId: builder.id,
          updates
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setBuilders(prev => prev.map(b => 
          b.id === builder.id ? { ...b, [field]: !b[field] } : b
        ));
        alert(`Builder ${field} status updated!`);
      } else {
        alert('Failed to update builder status: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating builder status:', error);
      alert('Failed to update builder status. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/advanced">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Exhibition Builders</h1>
              <p className="text-gray-600">Edit, verify, and manage all exhibition stand builders</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800">
              <Building2 className="w-3 h-3 mr-1" />
              {filteredBuilders.length} Builders
            </Badge>
            <Link href="/admin/builders/add">
              <Button className="bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Add New Builder
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Builders</Label>
                <Input
                  id="search"
                  placeholder="Search by company or contact person..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Filter by Country</Label>
                <Select value={filterCountry} onValueChange={setFilterCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {tier1Countries.map(country => (
                      <SelectItem key={country.code} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Filter by Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified Only</SelectItem>
                    <SelectItem value="pending">Pending Only</SelectItem>
                    <SelectItem value="premium">Premium Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Builders List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBuilders.map((builder) => (
            <Card key={builder.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={builder.logo} alt={builder.companyName} />
                      <AvatarFallback>
                        {builder.companyName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{builder.companyName}</h3>
                      <p className="text-sm text-gray-500">Est. {builder.establishedYear}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {builder.verified && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {builder.premiumMember && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Information */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{builder.contactInfo.primaryEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{builder.contactInfo.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{builder.headquarters.city}, {builder.headquarters.country}</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="font-semibold text-sm">{builder.rating}</div>
                    <div className="text-xs text-gray-600">Rating</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="font-semibold text-sm">{builder.projectsCompleted}</div>
                    <div className="text-xs text-gray-600">Projects</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="font-semibold text-sm">{builder.teamSize}</div>
                    <div className="text-xs text-gray-600">Team Size</div>
                  </div>
                </div>

                {/* Service Locations */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Service Locations:</h4>
                  <div className="flex flex-wrap gap-1">
                    {builder.serviceLocations.slice(0, 3).map((location, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {location.city}
                      </Badge>
                    ))}
                    {builder.serviceLocations.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{builder.serviceLocations.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedBuilder(builder)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <Link href={`/builders/${builder.slug}`} target="_blank">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Profile
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleEditBuilder(builder)}
                    disabled={saving}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleBuilderStatus(builder, 'verified')}
                    className={builder.verified ? 'text-red-600' : 'text-green-600'}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : (builder.verified ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />)}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        disabled={deleting === builder.id}
                      >
                        {deleting === builder.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Provider</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete <strong>{builder.companyName}</strong>? 
                          This action cannot be undone and will permanently remove the provider from the database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteBuilder(builder.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete Provider
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBuilders.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {builders.length === 0 ? 'No Supabase providers found' : 'No providers match your filters'}
              </h3>
              <p className="text-gray-600 mb-4">
                {builders.length === 0 
                  ? 'No providers have been added from Supabase yet. Add providers through the GMB integration or bulk import.'
                  : 'No providers match your current filters. Try adjusting your search criteria.'
                }
              </p>
              {builders.length > 0 && (
                <Button onClick={() => {
                  setSearchQuery('');
                  setFilterCountry('all');
                  setFilterStatus('all');
                }}>
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Builder Modal */}
      {selectedBuilder && (
        <Dialog open={!!selectedBuilder} onOpenChange={() => setSelectedBuilder(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>{selectedBuilder.companyName}</span>
                {selectedBuilder.verified && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Company Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contact Person:</span>
                      <span>{selectedBuilder.contactInfo.contactPerson}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span>{selectedBuilder.contactInfo.primaryEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span>{selectedBuilder.contactInfo.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Website:</span>
                      <a href={selectedBuilder.contactInfo.website} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:underline flex items-center">
                        <span className="truncate max-w-32">{selectedBuilder.contactInfo.website}</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Established:</span>
                      <span>{selectedBuilder.establishedYear}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Performance Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rating:</span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {selectedBuilder.rating} ({selectedBuilder.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Projects Completed:</span>
                      <span>{selectedBuilder.projectsCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Team Size:</span>
                      <span>{selectedBuilder.teamSize} employees</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Response Time:</span>
                      <span>{selectedBuilder.responseTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Service Locations</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBuilder.serviceLocations.map((location, index) => (
                    <Badge key={index} variant="outline">
                      {location.city}, {location.country}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Services Offered</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedBuilder.services.map((service, index) => (
                    <div key={index} className="text-sm p-2 border rounded">
                      <div className="font-medium">{service.name}</div>
                      <div className="text-gray-500">
                        From {service.priceFrom} {service.currency} {service.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedBuilder(null)}>
                  Close
                </Button>
                <Button onClick={() => handleEditBuilder(selectedBuilder)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Builder
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Builder Modal */}
      {isEditing && editingBuilder && (
        <Dialog open={isEditing} onOpenChange={() => setIsEditing(false)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Edit className="w-5 h-5" />
                <span>Edit {editingBuilder.companyName}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Company Information */}
              <div className="space-y-4">
                <h4 className="font-medium">Company Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={editingBuilder.companyName}
                      onChange={(e) => setEditingBuilder({
                        ...editingBuilder,
                        companyName: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="established-year">Established Year</Label>
                    <Input
                      id="established-year"
                      type="number"
                      value={editingBuilder.establishedYear}
                      onChange={(e) => setEditingBuilder({
                        ...editingBuilder,
                        establishedYear: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team-size">Team Size</Label>
                    <Input
                      id="team-size"
                      type="number"
                      value={editingBuilder.teamSize}
                      onChange={(e) => setEditingBuilder({
                        ...editingBuilder,
                        teamSize: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projects-completed">Projects Completed</Label>
                    <Input
                      id="projects-completed"
                      type="number"
                      value={editingBuilder.projectsCompleted}
                      onChange={(e) => setEditingBuilder({
                        ...editingBuilder,
                        projectsCompleted: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="font-medium">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-person">Contact Person</Label>
                    <Input
                      id="contact-person"
                      value={editingBuilder.contactInfo.contactPerson}
                      onChange={(e) => setEditingBuilder({
                        ...editingBuilder,
                        contactInfo: {
                          ...editingBuilder.contactInfo,
                          contactPerson: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editingBuilder.contactInfo.primaryEmail}
                      onChange={(e) => setEditingBuilder({
                        ...editingBuilder,
                        contactInfo: {
                          ...editingBuilder.contactInfo,
                          primaryEmail: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editingBuilder.contactInfo.phone}
                      onChange={(e) => setEditingBuilder({
                        ...editingBuilder,
                        contactInfo: {
                          ...editingBuilder.contactInfo,
                          phone: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editingBuilder.contactInfo.website}
                      onChange={(e) => setEditingBuilder({
                        ...editingBuilder,
                        contactInfo: {
                          ...editingBuilder.contactInfo,
                          website: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Company Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={editingBuilder.companyDescription}
                  onChange={(e) => setEditingBuilder({
                    ...editingBuilder,
                    companyDescription: e.target.value
                  })}
                  rows={4}
                />
              </div>

              {/* Status Toggles */}
              <div className="space-y-4">
                <h4 className="font-medium">Status Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="verified">Verified Builder</Label>
                      <p className="text-sm text-gray-500">Mark this builder as verified</p>
                    </div>
                    <Switch
                      id="verified"
                      checked={editingBuilder.verified}
                      onCheckedChange={(checked) => setEditingBuilder({
                        ...editingBuilder,
                        verified: checked
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="premium">Premium Member</Label>
                      <p className="text-sm text-gray-500">Mark this builder as premium member</p>
                    </div>
                    <Switch
                      id="premium"
                      checked={editingBuilder.premiumMember}
                      onCheckedChange={(checked) => setEditingBuilder({
                        ...editingBuilder,
                        premiumMember: checked
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveBuilder} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}