'use client';

import React, { Suspense, useState, useEffect } from 'react';
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
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';
import { useBuilders } from '@/lib/hooks/useBuilders';

function BuildersManagementClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBuilderId, setEditingBuilderId] = useState<string | null>(null);
  const [editingBuilderData, setEditingBuilderData] = useState<Record<string, any>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const buildersPerPage = 10;
  const { 
    builders, 
    totalBuilders, 
    loading, 
    error, 
    deleteBuilder: deleteBuilderHook, 
    updateBuilder, 
    fetchBuilders, // Use the fetchBuilders function from the hook
    addBuilder
  } = useBuilders();

  // Fetch builders on initial load
  useEffect(() => {
    fetchBuilders(buildersPerPage, 0);
  }, []); // Empty dependency array - run only once on mount

  // Filter builders based on search term
  const filteredBuilders = builders.filter(builder =>
    builder.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    builder.headquarters_city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    builder.headquarters_country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination values
  const totalPages = Math.ceil(totalBuilders / buildersPerPage);
  
  // Handle search with pagination reset
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page change
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle first page
  const firstPage = () => {
    setCurrentPage(1);
  };

  // Handle last page
  const lastPage = () => {
    setCurrentPage(totalPages);
  };

  // Fetch builders when page changes
  useEffect(() => {
    // Fetch builders with the correct offset based on current page
    fetchBuilders(buildersPerPage, (currentPage - 1) * buildersPerPage);
  }, [currentPage]); // Only run when currentPage changes

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      try {
        setDeletingId(id);
        await deleteBuilderHook(id);
        // Refresh the current page after deletion
        fetchBuilders(buildersPerPage, (currentPage - 1) * buildersPerPage);
      } catch (error) {
        alert('Failed to delete builder. Please try again.');
      } finally {
        setDeletingId(null);
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
      // Refresh the current page after update
      fetchBuilders(buildersPerPage, (currentPage - 1) * buildersPerPage);
    } catch (error) {
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

  if (loading && builders.length === 0) {
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

  if (error && builders.length === 0) {
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
    <div className="px-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Builders Management</h1>
          <p className="text-gray-600 mt-2">
            Manage exhibition stand builders ({totalBuilders} total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => fetchBuilders(buildersPerPage, (currentPage - 1) * buildersPerPage)}
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </>
            )}
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
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Builders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredBuilders.map((builder) => (
          <Card key={builder.id} className="hover:shadow-lg transition-shadow">
            {editingBuilderId === builder.id ? (
              // Edit mode
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor={`company_name_${builder.id}`}>Company Name</Label>
                  <Input
                    id={`company_name_${builder.id}`}
                    value={editingBuilderData.company_name || ''}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`primary_email_${builder.id}`}>Email</Label>
                  <Input
                    id={`primary_email_${builder.id}`}
                    type="email"
                    value={editingBuilderData.primary_email || ''}
                    onChange={(e) => handleInputChange('primary_email', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`phone_${builder.id}`}>Phone</Label>
                  <Input
                    id={`phone_${builder.id}`}
                    value={editingBuilderData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`website_${builder.id}`}>Website</Label>
                  <Input
                    id={`website_${builder.id}`}
                    value={editingBuilderData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`headquarters_city_${builder.id}`}>City</Label>
                  <Input
                    id={`headquarters_city_${builder.id}`}
                    value={editingBuilderData.headquarters_city || ''}
                    onChange={(e) => handleInputChange('headquarters_city', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`headquarters_country_${builder.id}`}>Country</Label>
                  <Input
                    id={`headquarters_country_${builder.id}`}
                    value={editingBuilderData.headquarters_country || ''}
                    onChange={(e) => handleInputChange('headquarters_country', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`contact_person_${builder.id}`}>Contact Person</Label>
                  <Input
                    id={`contact_person_${builder.id}`}
                    value={editingBuilderData.contact_person || ''}
                    onChange={(e) => handleInputChange('contact_person', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`position_${builder.id}`}>Position</Label>
                  <Input
                    id={`position_${builder.id}`}
                    value={editingBuilderData.position || ''}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`team_size_${builder.id}`}>Team Size</Label>
                  <Input
                    id={`team_size_${builder.id}`}
                    type="number"
                    value={editingBuilderData.team_size || ''}
                    onChange={(e) => handleInputChange('team_size', e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`projects_completed_${builder.id}`}>Projects Completed</Label>
                  <Input
                    id={`projects_completed_${builder.id}`}
                    type="number"
                    value={editingBuilderData.projects_completed || ''}
                    onChange={(e) => handleInputChange('projects_completed', e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`rating_${builder.id}`}>Rating (0-5)</Label>
                  <Input
                    id={`rating_${builder.id}`}
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editingBuilderData.rating || ''}
                    onChange={(e) => handleInputChange('rating', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`company_description_${builder.id}`}>Description</Label>
                  <Textarea
                    id={`company_description_${builder.id}`}
                    value={editingBuilderData.company_description || ''}
                    onChange={(e) => handleInputChange('company_description', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor={`verified_${builder.id}`}>Verified</Label>
                  <Switch
                    id={`verified_${builder.id}`}
                    checked={editingBuilderData.verified || false}
                    onCheckedChange={(checked) => handleInputChange('verified', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor={`premium_member_${builder.id}`}>Premium Member</Label>
                  <Switch
                    id={`premium_member_${builder.id}`}
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
                      disabled={deletingId === builder.id}
                    >
                      {deletingId === builder.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </>
                      )}
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

      {/* Pagination */}
      {totalBuilders > buildersPerPage && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              onClick={prevPage}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <Button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * buildersPerPage + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * buildersPerPage, totalBuilders)}</span> of{' '}
                <span className="font-medium">{totalBuilders}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <Button
                  onClick={firstPage}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="rounded-l-md"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center px-3 py-2 text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  onClick={lastPage}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="rounded-r-md"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Loading component for Suspense fallback
function LoadingComponent() {
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

export default function BuildersManagementPage() {
  return (
    <AdminLayout sidebar={<Sidebar />} topbar={<Topbar />}>
      <Suspense fallback={<LoadingComponent />}>
        <BuildersManagementClient />
      </Suspense>
    </AdminLayout>
  );
}