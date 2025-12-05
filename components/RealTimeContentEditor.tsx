'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  RefreshCw, 
  Eye, 
  Globe, 
  MapPin, 
  Calendar, 
  Search, 
  Edit, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  FileText,
  Settings,
  Users,
  Building
} from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'country' | 'city' | 'tradeshow' | 'builder';
  name: string;
  slug: string;
  status: 'published' | 'draft' | 'pending';
  lastModified: string;
  modifiedBy: string;
}

interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

interface ContentData {
  id: string;
  type: string;
  name: string;
  slug: string;
  description: string;
  content: string;
  seo: SEOData;
  published: boolean;
  featured: boolean;
  lastModified: string;
}

interface RealTimeContentEditorProps {
  userRole: 'admin' | 'moderator' | 'editor';
  canPublish: boolean;
}

export default function RealTimeContentEditor({ userRole, canPublish }: RealTimeContentEditorProps) {
  console.log('RealTimeContentEditor: Component loaded for role:', userRole);
  
  const [activeTab, setActiveTab] = useState('content');
  const [selectedContent, setSelectedContent] = useState<ContentData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [autoSave, setAutoSave] = useState(true);

  const [contentList, setContentList] = useState<ContentItem[]>([
    {
      id: 'country-germany',
      type: 'country',
      name: 'Germany',
      slug: 'germany',
      status: 'published',
      lastModified: '2024-12-19T10:30:00Z',
      modifiedBy: 'admin@example.com'
    },
    {
      id: 'city-berlin',
      type: 'city',
      name: 'Berlin',
      slug: 'berlin',
      status: 'published',
      lastModified: '2024-12-19T09:15:00Z',
      modifiedBy: 'editor@example.com'
    },
    {
      id: 'show-ces-2025',
      type: 'tradeshow',
      name: 'CES 2025',
      slug: 'ces-2025',
      status: 'published',
      lastModified: '2024-12-18T16:45:00Z',
      modifiedBy: 'admin@example.com'
    },
    {
      id: 'builder-expo-design',
      type: 'builder',
      name: 'Expo Design Germany',
      slug: 'expo-design-germany',
      status: 'published',
      lastModified: '2024-12-18T14:20:00Z',
      modifiedBy: 'moderator@example.com'
    }
  ]);

  const [editingContent, setEditingContent] = useState<ContentData>({
    id: '',
    type: '',
    name: '',
    slug: '',
    description: '',
    content: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      canonicalUrl: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: ''
    },
    published: false,
    featured: false,
    lastModified: ''
  });

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !hasUnsavedChanges || !selectedContent) return;

    const autoSaveTimer = setTimeout(() => {
      handleSave(false); // Auto-save without publishing
    }, 3000);

    return () => clearTimeout(autoSaveTimer);
  }, [editingContent, autoSave, hasUnsavedChanges]);

  // Real-time sync simulation
  useEffect(() => {
    const syncInterval = setInterval(() => {
      console.log('Real-time content sync triggered');
      // In production, this would sync with other editors
    }, 30000);

    return () => clearInterval(syncInterval);
  }, []);

  const loadContent = async (item: ContentItem) => {
    console.log('Loading content for:', item.name);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockContent: ContentData = {
      id: item.id,
      type: item.type,
      name: item.name,
      slug: item.slug,
      description: getDefaultDescription(item),
      content: getDefaultContent(item),
      seo: {
        metaTitle: `${item.name} - Exhibition Stands | ExhibitBay`,
        metaDescription: `Find the best exhibition stand builders in ${item.name}. Compare quotes, view portfolios, and book verified contractors for your next trade show.`,
        keywords: ['exhibition stands', item.name.toLowerCase(), 'trade shows', 'builders'],
        canonicalUrl: `https://exhibitbay.com/${item.type}/${item.slug}`,
        ogTitle: `${item.name} Exhibition Stands`,
        ogDescription: `Professional exhibition stand builders and services in ${item.name}`,
        ogImage: `https://exhibitbay.com/images/og/${item.slug}.jpg`
      },
      published: item.status === 'published',
      featured: false,
      lastModified: item.lastModified
    };
    
    setSelectedContent(mockContent);
    setEditingContent(mockContent);
    setIsEditing(true);
    setHasUnsavedChanges(false);
  };

  const getDefaultDescription = (item: ContentItem): string => {
    switch (item.type) {
      case 'country':
        return `${item.name} is a major destination for international trade shows and exhibitions, offering world-class venues and experienced exhibition stand builders.`;
      case 'city':
        return `${item.name} hosts numerous international trade shows throughout the year, providing excellent opportunities for businesses to showcase their products and services.`;
      case 'tradeshow':
        return `${item.name} is a leading industry event that brings together professionals from around the world to showcase innovations and build business relationships.`;
      case 'builder':
        return `${item.name} is a professional exhibition stand builder with years of experience creating stunning displays for trade shows and events.`;
      default:
        return '';
    }
  };

  const getDefaultContent = (item: ContentItem): string => {
    switch (item.type) {
      case 'country':
        return `# Exhibition Stands in ${item.name}\n\n${item.name} is home to some of the world's most prestigious trade shows and exhibitions. Our network of verified exhibition stand builders in ${item.name} offers comprehensive services including:\n\n## Services Available\n- Custom stand design and construction\n- Modular exhibition systems\n- Installation and dismantling\n- Project management\n- Storage solutions\n\n## Why Choose ${item.name}?\n- World-class exhibition venues\n- Experienced local builders\n- Competitive pricing\n- Excellent logistics infrastructure`;
      case 'city':
        return `# Exhibition Stand Builders in ${item.name}\n\n${item.name} is a key destination for international trade shows, offering modern venues and professional exhibition services.\n\n## Available Services\n- Stand design and build\n- Furniture and equipment rental\n- Graphics and signage\n- Technical services\n- Local project management\n\n## Upcoming Events\nStay updated with the latest trade shows and exhibitions happening in ${item.name}.`;
      case 'tradeshow':
        return `# ${item.name}\n\nProfessional exhibition stand builders for ${item.name}. Get quotes from verified contractors who specialize in creating impactful displays for this event.\n\n## Event Highlights\n- Industry-leading exhibition\n- International audience\n- Networking opportunities\n- Latest innovations showcase\n\n## Our Builders\nConnect with experienced builders who understand the specific requirements of ${item.name}.`;
      default:
        return '';
    }
  };

  const updateContent = (field: keyof ContentData, value: any) => {
    setEditingContent(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const updateSEO = (field: keyof SEOData, value: any) => {
    setEditingContent(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async (publish: boolean = false) => {
    setIsSaving(true);
    
    try {
      console.log('Saving content:', editingContent.name, publish ? '(publishing)' : '(draft)');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedContent = {
        ...editingContent,
        published: publish || editingContent.published,
        lastModified: new Date().toISOString()
      };
      
      setEditingContent(updatedContent);
      setSelectedContent(updatedContent);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      // Update content list
      setContentList(prev => prev.map(item => 
        item.id === editingContent.id 
          ? { 
              ...item, 
              status: updatedContent.published ? 'published' : 'draft',
              lastModified: updatedContent.lastModified 
            }
          : item
      ));
      
      console.log('Content saved successfully');
      
    } catch (error) {
      console.error('Failed to save content:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const filteredContent = contentList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'country': return <Globe className="w-4 h-4" />;
      case 'city': return <MapPin className="w-4 h-4" />;
      case 'tradeshow': return <Calendar className="w-4 h-4" />;
      case 'builder': return <Building className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Content List Sidebar */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Content Manager</span>
              </div>
              <Badge variant="outline">{filteredContent.length} items</Badge>
            </CardTitle>
            <CardDescription>
              Manage all platform content with real-time editing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="country">Countries</SelectItem>
                    <SelectItem value="city">Cities</SelectItem>
                    <SelectItem value="tradeshow">Trade Shows</SelectItem>
                    <SelectItem value="builder">Builders</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Content List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredContent.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedContent?.id === item.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => loadContent(item)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(item.type)}
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    Modified {new Date(item.lastModified).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>

            {filteredContent.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No content found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Content Editor */}
      <div className="lg:col-span-2">
        {!selectedContent ? (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center py-12">
              <Edit className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select Content to Edit</h3>
              <p className="text-gray-500">Choose an item from the list to start editing</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    {getTypeIcon(editingContent.type)}
                    <span>{editingContent.name}</span>
                    {hasUnsavedChanges && (
                      <Badge variant="outline" className="text-orange-600">
                        Unsaved
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-4 mt-1">
                    <span>/{editingContent.type}/{editingContent.slug}</span>
                    {lastSaved && (
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Saved {lastSaved.toLocaleTimeString()}</span>
                      </span>
                    )}
                  </CardDescription>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="auto-save" className="text-sm">Auto-save</Label>
                    <Switch
                      id="auto-save"
                      checked={autoSave}
                      onCheckedChange={setAutoSave}
                    />
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  
                  <Button 
                    onClick={() => handleSave(false)}
                    disabled={isSaving || !hasUnsavedChanges}
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                  
                  {canPublish && (
                    <Button 
                      onClick={() => handleSave(true)}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      Publish
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editingContent.name}
                        onChange={(e) => updateContent('name', e.target.value)}
                        placeholder="Content name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        value={editingContent.slug}
                        onChange={(e) => updateContent('slug', e.target.value)}
                        placeholder="url-friendly-slug"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editingContent.description}
                      onChange={(e) => updateContent('description', e.target.value)}
                      placeholder="Brief description..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Content (Markdown)</Label>
                    <Textarea
                      id="content"
                      value={editingContent.content}
                      onChange={(e) => updateContent('content', e.target.value)}
                      placeholder="Write your content in Markdown..."
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-6 mt-6">
                  <div>
                    <Label htmlFor="meta-title">Meta Title</Label>
                    <Input
                      id="meta-title"
                      value={editingContent.seo.metaTitle}
                      onChange={(e) => updateSEO('metaTitle', e.target.value)}
                      placeholder="SEO optimized title"
                      maxLength={60}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {editingContent.seo.metaTitle.length}/60 characters
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="meta-description">Meta Description</Label>
                    <Textarea
                      id="meta-description"
                      value={editingContent.seo.metaDescription}
                      onChange={(e) => updateSEO('metaDescription', e.target.value)}
                      placeholder="SEO meta description"
                      rows={3}
                      maxLength={160}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {editingContent.seo.metaDescription.length}/160 characters
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                    <Input
                      id="keywords"
                      value={editingContent.seo.keywords.join(', ')}
                      onChange={(e) => updateSEO('keywords', e.target.value.split(',').map(k => k.trim()))}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>

                  <div>
                    <Label htmlFor="canonical-url">Canonical URL</Label>
                    <Input
                      id="canonical-url"
                      value={editingContent.seo.canonicalUrl}
                      onChange={(e) => updateSEO('canonicalUrl', e.target.value)}
                      placeholder="https://example.com/page"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Open Graph (Social Media)</h4>
                    
                    <div>
                      <Label htmlFor="og-title">OG Title</Label>
                      <Input
                        id="og-title"
                        value={editingContent.seo.ogTitle}
                        onChange={(e) => updateSEO('ogTitle', e.target.value)}
                        placeholder="Social media title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="og-description">OG Description</Label>
                      <Textarea
                        id="og-description"
                        value={editingContent.seo.ogDescription}
                        onChange={(e) => updateSEO('ogDescription', e.target.value)}
                        placeholder="Social media description"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="og-image">OG Image URL</Label>
                      <Input
                        id="og-image"
                        value={editingContent.seo.ogImage}
                        onChange={(e) => updateSEO('ogImage', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Published</Label>
                        <p className="text-sm text-gray-600">Make this content visible to users</p>
                      </div>
                      <Switch
                        checked={editingContent.published}
                        onCheckedChange={(checked) => updateContent('published', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Featured</Label>
                        <p className="text-sm text-gray-600">Highlight this content</p>
                      </div>
                      <Switch
                        checked={editingContent.featured}
                        onCheckedChange={(checked) => updateContent('featured', checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Content Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <span className="ml-2 font-medium">{editingContent.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <Badge className={`ml-2 ${getStatusColor(editingContent.published ? 'published' : 'draft')}`}>
                          {editingContent.published ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Modified:</span>
                        <span className="ml-2">{new Date(editingContent.lastModified).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Character Count:</span>
                        <span className="ml-2">{editingContent.content.length}</span>
                      </div>
                    </div>
                  </div>

                  {hasUnsavedChanges && (
                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-orange-800">
                        You have unsaved changes. {autoSave ? 'Auto-save is enabled.' : 'Remember to save your work.'}
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}