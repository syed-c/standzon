'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, ArrowLeft, Save, Edit, Globe, MapPin, Calendar,
  Building2, Search, Plus, Eye, RefreshCw, Upload, Download
} from 'lucide-react';
import Link from 'next/link';
import { tier1Countries } from '@/lib/data/countries';
import { tradeShows } from '@/lib/data/tradeShows';

export default function ContentEditorPage() {
  const [activeTab, setActiveTab] = useState('countries');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  console.log('Content Editor page loaded');

  // Generate all platform pages
  const allPages = [
    // Country pages
    ...tier1Countries.map(country => ({
      id: `country-${country.code}`,
      type: 'country',
      title: `Exhibition Stands in ${country.name}`,
      slug: `/exhibition-stands/${country.name.toLowerCase().replace(/\s+/g, '-')}`,
      description: `Leading exhibition stand builders in ${country.name}. Professional booth design and construction services.`,
      content: `Discover top exhibition stand builders in ${country.name}. With ${country.builderCount} verified contractors and ${country.annualTradeShows} annual trade shows, we connect you with the best professionals for your next exhibition.`,
      metaTitle: `Exhibition Stand Builders in ${country.name} | ExhibitBay`,
      metaDescription: `Find verified exhibition stand builders in ${country.name}. Custom booth design, construction & installation services. Get free quotes from top contractors.`,
      lastModified: '2024-12-19',
      status: 'published',
      data: country
    })),
    
    // City pages
    ...tier1Countries.flatMap(country => 
      country.majorCities.map(city => ({
        id: `city-${country.code}-${city.slug}`,
        type: 'city',
        title: `Exhibition Stand Builders in ${city.name}, ${country.name}`,
        slug: `/exhibition-stands/${country.name.toLowerCase().replace(/\s+/g, '-')}/${city.slug}`,
        description: `Professional exhibition stand builders in ${city.name}. Custom booth design and construction services.`,
        content: `Find the best exhibition stand builders in ${city.name}, ${country.name}. Our ${city.builderCount} verified contractors specialize in creating stunning trade show displays for ${city.upcomingShows} upcoming shows.`,
        metaTitle: `Exhibition Stand Builders in ${city.name} | ExhibitBay`,
        metaDescription: `Top exhibition stand builders in ${city.name}, ${country.name}. Custom booth design, rental & construction services. Average cost: €${city.averageStandCost}/sqm.`,
        lastModified: '2024-12-19',
        status: 'published',
        data: { city, country }
      }))
    ),
    
    // Trade show pages
    ...tradeShows.map(show => ({
      id: `tradeshow-${show.id}`,
      type: 'tradeshow',
      title: `Exhibition Stands for ${show.name}`,
      slug: `/trade-shows/${show.slug}`,
      description: `Professional exhibition stand builders for ${show.name} in ${show.city}, ${show.country}.`,
      content: `Get custom exhibition stands for ${show.name}. Running from ${new Date(show.startDate).toLocaleDateString()} to ${new Date(show.endDate).toLocaleDateString()} in ${show.city}, this ${show.industries[0]?.name || 'exhibition'} event attracts thousands of visitors.`,
      metaTitle: `${show.name} Exhibition Stands | ExhibitBay`,
      metaDescription: `Custom exhibition stands for ${show.name} in ${show.city}. Professional booth design and construction services for ${show.industries[0]?.name || 'trade show'} exhibitions.`,
      lastModified: '2024-12-19',
      status: 'published',
      data: show
    }))
  ];

  // Filter pages
  const filteredPages = allPages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         page.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || page.type === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const handleEditPage = (page: any) => {
    setSelectedItem({ ...page });
    setIsEditing(true);
    console.log('Editing page:', page.title);
  };

  const handleSavePage = () => {
    if (!selectedItem) return;
    
    console.log('Saving page changes:', selectedItem.title);
    // In a real app, this would make an API call to save changes
    
    // Update the page in the local array (for demo purposes)
    const index = allPages.findIndex(p => p.id === selectedItem.id);
    if (index !== -1) {
      Object.assign(allPages[index], selectedItem);
    }
    
    setIsEditing(false);
    setSelectedItem(null);
    alert('Page updated successfully!');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'country': return <Globe className="w-4 h-4" />;
      case 'city': return <MapPin className="w-4 h-4" />;
      case 'tradeshow': return <Calendar className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'country': return 'bg-blue-100 text-blue-800';
      case 'city': return 'bg-green-100 text-green-800';
      case 'tradeshow': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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
              <h1 className="text-2xl font-bold text-gray-900">Platform Content Editor</h1>
              <p className="text-gray-600">Edit all website content, SEO metadata, and page structure</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800">
            <FileText className="w-3 h-3 mr-1" />
            {filteredPages.length} Pages
          </Badge>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search pages by title or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Content
              </Button>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Bulk Import
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Content Management</CardTitle>
            <CardDescription>Manage all website pages, content, and SEO metadata</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="countries" className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>Countries</span>
                </TabsTrigger>
                <TabsTrigger value="city" className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Cities</span>
                </TabsTrigger>
                <TabsTrigger value="tradeshow" className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Trade Shows</span>
                </TabsTrigger>
                <TabsTrigger value="all" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>All Pages</span>
                </TabsTrigger>
              </TabsList>

              {/* Pages List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredPages.map((page) => (
                  <div key={page.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getTypeColor(page.type)}>
                            {getTypeIcon(page.type)}
                            <span className="ml-1 capitalize">{page.type}</span>
                          </Badge>
                          <Badge variant="outline">{page.status}</Badge>
                        </div>
                        <h4 className="font-medium text-base mb-1">{page.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{page.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>URL: {page.slug}</span>
                          <span>Modified: {page.lastModified}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => setSelectedItem(page)}>
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" onClick={() => handleEditPage(page)}>
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPages.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No pages found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria.</p>
                </div>
              )}
            </Tabs>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{allPages.filter(p => p.type === 'country').length}</div>
                  <div className="text-sm text-gray-600">Country Pages</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{allPages.filter(p => p.type === 'city').length}</div>
                  <div className="text-sm text-gray-600">City Pages</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{allPages.filter(p => p.type === 'tradeshow').length}</div>
                  <div className="text-sm text-gray-600">Trade Show Pages</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">{allPages.length}</div>
                  <div className="text-sm text-gray-600">Total Pages</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <Edit className="w-5 h-5" />
                <span>Edit {selectedItem.title}</span>
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-medium">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Page Title</Label>
                    <Input
                      id="title"
                      value={selectedItem.title}
                      onChange={(e) => setSelectedItem({
                        ...selectedItem,
                        title: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={selectedItem.slug}
                      onChange={(e) => setSelectedItem({
                        ...selectedItem,
                        slug: e.target.value
                      })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={selectedItem.description}
                    onChange={(e) => setSelectedItem({
                      ...selectedItem,
                      description: e.target.value
                    })}
                    rows={3}
                  />
                </div>
              </div>

              {/* SEO Settings */}
              <div className="space-y-4">
                <h3 className="font-medium">SEO Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta-title">Meta Title</Label>
                    <Input
                      id="meta-title"
                      value={selectedItem.metaTitle}
                      onChange={(e) => setSelectedItem({
                        ...selectedItem,
                        metaTitle: e.target.value
                      })}
                    />
                    <p className="text-xs text-gray-500">
                      Recommended: 50-60 characters ({selectedItem.metaTitle?.length || 0}/60)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta-description">Meta Description</Label>
                    <Textarea
                      id="meta-description"
                      value={selectedItem.metaDescription}
                      onChange={(e) => setSelectedItem({
                        ...selectedItem,
                        metaDescription: e.target.value
                      })}
                      rows={3}
                    />
                    <p className="text-xs text-gray-500">
                      Recommended: 150-160 characters ({selectedItem.metaDescription?.length || 0}/160)
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="font-medium">Page Content</h3>
                <div className="space-y-2">
                  <Label htmlFor="content">Main Content</Label>
                  <Textarea
                    id="content"
                    value={selectedItem.content}
                    onChange={(e) => setSelectedItem({
                      ...selectedItem,
                      content: e.target.value
                    })}
                    rows={8}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={selectedItem.status} 
                  onValueChange={(value) => setSelectedItem({
                    ...selectedItem,
                    status: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePage}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedItem && !isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>{selectedItem.title}</span>
                <Badge className={getTypeColor(selectedItem.type)}>
                  {getTypeIcon(selectedItem.type)}
                  <span className="ml-1 capitalize">{selectedItem.type}</span>
                </Badge>
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-medium mb-2">URL</h4>
                <p className="text-sm text-blue-600">{selectedItem.slug}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm">{selectedItem.description}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Meta Title</h4>
                <p className="text-sm">{selectedItem.metaTitle}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Meta Description</h4>
                <p className="text-sm">{selectedItem.metaDescription}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Content</h4>
                <p className="text-sm whitespace-pre-wrap">{selectedItem.content}</p>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
              <Button onClick={() => handleEditPage(selectedItem)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Page
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}