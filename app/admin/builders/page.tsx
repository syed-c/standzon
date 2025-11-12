"use client";

import { useBuilders } from '@/lib/hooks/useBuilders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Star, 
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Save,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';

export default function BuildersManagementPage() {
  const { builders, loading, error, deleteBuilder, updateBuilder, refreshBuilders } = useBuilders();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBuilderId, setEditingBuilderId] = useState<string | null>(null);
  const [editingBuilderData, setEditingBuilderData] = useState<Record<string, any>>({});

  const filteredBuilders = builders.filter(builder =>
    builder.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    builder.headquarters_city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    builder.headquarters_country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      try {
        await deleteBuilder(id);
        console.log(`Builder ${name} deleted successfully`);
      } catch (error) {
        console.error('Failed to delete builder:', error);
        alert('Failed to delete builder. Please try again.');
      }
    }
  };

  const startEditing = (builder: any) => {
    setEditingBuilderId(builder.id);
    setEditingBuilderData({ ...builder });
  };

  const cancelEditing = () => {
    setEditingBuilderId(null);
    setEditingBuilderData({});
  };

  const saveEditing = async () => {
    if (!editingBuilderId) return;
    
    try {
      await updateBuilder(editingBuilderId, editingBuilderData);
      setEditingBuilderId(null);
      setEditingBuilderData({});
      console.log('Builder updated successfully');
    } catch (error) {
      console.error('Failed to update builder:', error);
      alert('Failed to update builder. Please try again.');
    }
  };

  const handleInputChange = (field: string, value: string | boolean | number | undefined) => {
    if (value === undefined) {
      // Remove the field from the object if value is undefined
      setEditingBuilderData(prev => {
        const newData = { ...prev };
        delete newData[field];
        return newData;
      });
    } else {
      setEditingBuilderData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Builders</h1>
            <p className="text-gray-600">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout sidebar={<Sidebar />} topbar={<Topbar />}>
      <div className="px-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Builders Management</h1>
            <p className="text-gray-600 mt-2">
              Manage exhibition stand builders ({builders.length} total)
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={refreshBuilders}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Link href="/admin/builders/add">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Builder
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search builders by name, city, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Builders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuilders.map((builder) => (
            <Card key={builder.id} className="hover:shadow-lg transition-shadow">
              {editingBuilderId === builder.id ? (
                // Edit mode
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={editingBuilderData.company_name || ''}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primary_email">Email</Label>
                    <Input
                      id="primary_email"
                      type="email"
                      value={editingBuilderData.primary_email || ''}
                      onChange={(e) => handleInputChange('primary_email', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editingBuilderData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editingBuilderData.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="headquarters_city">City</Label>
                    <Input
                      id="headquarters_city"
                      value={editingBuilderData.headquarters_city || ''}
                      onChange={(e) => handleInputChange('headquarters_city', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="headquarters_country">Country</Label>
                    <Input
                      id="headquarters_country"
                      value={editingBuilderData.headquarters_country || ''}
                      onChange={(e) => handleInputChange('headquarters_country', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact_person">Contact Person</Label>
                    <Input
                      id="contact_person"
                      value={editingBuilderData.contact_person || ''}
                      onChange={(e) => handleInputChange('contact_person', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={editingBuilderData.position || ''}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="team_size">Team Size</Label>
                    <Input
                      id="team_size"
                      type="number"
                      value={editingBuilderData.team_size || ''}
                      onChange={(e) => handleInputChange('team_size', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="projects_completed">Projects Completed</Label>
                    <Input
                      id="projects_completed"
                      type="number"
                      value={editingBuilderData.projects_completed || ''}
                      onChange={(e) => handleInputChange('projects_completed', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (0-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={editingBuilderData.rating || ''}
                      onChange={(e) => handleInputChange('rating', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company_description">Description</Label>
                    <Textarea
                      id="company_description"
                      value={editingBuilderData.company_description || ''}
                      onChange={(e) => handleInputChange('company_description', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="verified">Verified</Label>
                    <Switch
                      id="verified"
                      checked={editingBuilderData.verified || false}
                      onCheckedChange={(checked) => handleInputChange('verified', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="premium_member">Premium Member</Label>
                    <Switch
                      id="premium_member"
                      checked={editingBuilderData.premium_member || false}
                      onCheckedChange={(checked) => handleInputChange('premium_member', checked)}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={cancelEditing}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={saveEditing}
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </CardContent>
              ) : (
                // View mode
                <>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold">
                        {builder.company_name}
                      </CardTitle>
                      <div className="flex gap-1">
                        {builder.verified && (
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        )}
                        {builder.premium_member && (
                          <Badge variant="default" className="text-xs">Premium</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Location */}
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>
                        {builder.headquarters_city || 'Unknown City'}, {builder.headquarters_country || 'Unknown Country'}
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="truncate">{builder.primary_email}</span>
                    </div>

                    {builder.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{builder.phone}</span>
                      </div>
                    )}

                    {builder.website && (
                      <div className="flex items-center text-gray-600">
                        <Globe className="w-4 h-4 mr-2" />
                        <a 
                          href={builder.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {builder.website}
                        </a>
                      </div>
                    )}

                    {/* Rating */}
                    {builder.rating && (
                      <div className="flex items-center text-gray-600">
                        <Star className="w-4 h-4 mr-2 text-yellow-500" />
                        <span>{builder.rating}/5.0</span>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex gap-4 text-sm text-gray-500">
                      {builder.team_size && (
                        <span>{builder.team_size} team members</span>
                      )}
                      {builder.projects_completed && (
                        <span>{builder.projects_completed} projects</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/builders/${builder.slug}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => startEditing(builder)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDelete(builder.id, builder.company_name)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredBuilders.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No builders found' : 'No builders yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first builder'
              }
            </p>
            {!searchTerm && (
              <Link href="/admin/builders/add">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Builder
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}