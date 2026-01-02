'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import { Input } from '@/components/shared/input';
import { Textarea } from '@/components/shared/textarea';
import { Label } from '@/components/shared/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/tabs';
import { Badge } from '@/components/shared/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Globe, 
  FileText, 
  Link, 
  Save, 
  Eye, 
  Edit3,
  Plus,
  Trash2,
  ChevronRight,
  Home,
  Users,
  Building2,
  MapPin,
  Calendar,
  Archive,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface PageContent {
  id: string;
  pageName: string;
  route: string;
  title: string;
  description: string;
  heroTitle: string;
  heroDescription: string;
  primaryCTA: {
    text: string;
    link: string;
    style: 'primary' | 'secondary' | 'outline';
  };
  secondaryCTA?: {
    text: string;
    link: string;
    style: 'primary' | 'secondary' | 'outline';
  };
  sections: Array<{
    id: string;
    title: string;
    content: string;
    type: 'text' | 'list' | 'cards' | 'stats';
    order: number;
  }>;
  lastModified: string;
  status: 'published' | 'draft' | 'archived';
}

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
  submenu?: Array<{
    id: string;
    label: string;
    href: string;
    order: number;
  }>;
}

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState('pages');
  const [pages, setPages] = useState<PageContent[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(null);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize with sample data
  useEffect(() => {
    const initializeData = () => {
      const samplePages: PageContent[] = [
        {
          id: 'home',
          pageName: 'Homepage',
          route: '/',
          title: 'ExhibitBay - Global Exhibition Stand Builders',
          description: 'Connect with verified exhibition stand builders worldwide',
          heroTitle: 'We Build Your Stand in Any Corner of the World',
          heroDescription: 'Get competitive quotes from verified exhibition stand builders. We compare 500+ contractors in your city to find the perfect match.',
          primaryCTA: {
            text: 'Get Free Quote',
            link: '/quote',
            style: 'primary'
          },
          secondaryCTA: {
            text: 'Browse Locations',
            link: '/exhibition-stands',
            style: 'outline'
          },
          sections: [
            {
              id: 'intro',
              title: 'Start Your Exhibition Journey',
              content: 'Access our comprehensive global network of exhibition professionals',
              type: 'text',
              order: 1
            }
          ],
          lastModified: '2024-01-15',
          status: 'published'
        },
        {
          id: 'builders',
          pageName: 'Builders Directory',
          route: '/builders',
          title: 'Exhibition Stand Builders Directory',
          description: 'Connect with 2+ verified exhibition stand builders worldwide',
          heroTitle: 'Exhibition Stand Builders Directory',
          heroDescription: 'Find experienced contractors who specialize in your industry and location.',
          primaryCTA: {
            text: 'Get Free Quote',
            link: '/quote',
            style: 'primary'
          },
          sections: [],
          lastModified: '2024-01-10',
          status: 'published'
        },
        {
          id: 'locations',
          pageName: 'Locations',
          route: '/exhibition-stands',
          title: 'Exhibition Stand Builders by Location',
          description: 'Find exhibition stand builders in your city',
          heroTitle: 'Global Exhibition Directory',
          heroDescription: 'Discover 55+ exhibitions across 11 countries worldwide',
          primaryCTA: {
            text: 'Browse Locations',
            link: '/exhibition-stands',
            style: 'primary'
          },
          sections: [],
          lastModified: '2024-01-12',
          status: 'published'
        },
        {
          id: 'about',
          pageName: 'About Us',
          route: '/about',
          title: 'About ExhibitBay',
          description: 'Learn about our mission to connect exhibitors with builders',
          heroTitle: 'About ExhibitBay',
          heroDescription: 'We are the leading platform connecting exhibitors with professional stand builders worldwide.',
          primaryCTA: {
            text: 'Get Started',
            link: '/builders',
            style: 'primary'
          },
          sections: [
            {
              id: 'mission',
              title: 'Our Mission',
              content: 'To simplify the exhibition process by connecting businesses with trusted, verified exhibition stand builders around the world.',
              type: 'text',
              order: 1
            },
            {
              id: 'vision',
              title: 'Our Vision',
              content: 'To become the global standard for exhibition stand procurement, making trade shows accessible and successful for businesses of all sizes.',
              type: 'text',
              order: 2
            }
          ],
          lastModified: '2024-01-08',
          status: 'published'
        }
      ];

      const sampleNavigation: NavigationItem[] = [
        {
          id: 'home',
          label: 'Home',
          href: '/',
          order: 1
        },
        {
          id: 'builders',
          label: 'Find Builders',
          href: '/builders',
          order: 2,
          submenu: [
            { id: 'all-builders', label: 'All Builders', href: '/builders', order: 1 },
            { id: 'top-rated', label: 'Top Rated', href: '/builders?sort=rating', order: 2 },
            { id: 'by-location', label: 'By Location', href: '/exhibition-stands', order: 3 }
          ]
        },
        {
          id: 'locations',
          label: 'Locations',
          href: '/exhibition-stands',
          order: 3,
          submenu: [
            { id: 'all-countries', label: 'All Countries', href: '/exhibition-stands', order: 1 },
            { id: 'germany', label: 'Germany', href: '/exhibition-stands/germany', order: 2 },
            { id: 'usa', label: 'United States', href: '/exhibition-stands/united-states', order: 3 },
            { id: 'uae', label: 'UAE', href: '/exhibition-stands/uae', order: 4 }
          ]
        },
        {
          id: 'trade-shows',
          label: 'Trade Shows',
          href: '/trade-shows',
          order: 4
        },
        {
          id: 'about',
          label: 'About',
          href: '/about',
          order: 5
        }
      ];

      setPages(samplePages);
      setNavigationItems(sampleNavigation);
      setLoading(false);
    };

    initializeData();
  }, []);

  const handleSavePage = async (page: PageContent) => {
    try {
      // Update the page in the local state
      setPages(prev => prev.map(p => p.id === page.id ? page : p));
      
      toast({
        title: "Page Updated",
        description: `${page.pageName} has been saved successfully.`,
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving the page.",
        variant: "destructive",
      });
    }
  };

  const handleSaveNavigation = async () => {
    try {
      toast({
        title: "Navigation Updated",
        description: "Navigation menu has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving the navigation.",
        variant: "destructive",
      });
    }
  };

  const addNewSection = (pageId: string) => {
    setPages(prev => prev.map(page => {
      if (page.id === pageId) {
        const newSection = {
          id: `section-${Date.now()}`,
          title: 'New Section',
          content: 'Enter your content here...',
          type: 'text' as const,
          order: page.sections.length + 1
        };
        return { ...page, sections: [...page.sections, newSection] };
      }
      return page;
    }));
  };

  const removeSection = (pageId: string, sectionId: string) => {
    setPages(prev => prev.map(page => {
      if (page.id === pageId) {
        return { ...page, sections: page.sections.filter(s => s.id !== sectionId) };
      }
      return page;
    }));
  };

  const updateSection = (pageId: string, sectionId: string, updates: Partial<PageContent['sections'][0]>) => {
    setPages(prev => prev.map(page => {
      if (page.id === pageId) {
        return {
          ...page,
          sections: page.sections.map(section =>
            section.id === sectionId ? { ...section, ...updates } : section
          )
        };
      }
      return page;
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content management system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Management System</h1>
              <p className="mt-2 text-gray-600">
                Manage website content, navigation, and page settings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-4 h-4 mr-1" />
                System Active
              </Badge>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Page Content
            </TabsTrigger>
            <TabsTrigger value="navigation" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Navigation
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Global Settings
            </TabsTrigger>
          </TabsList>

          {/* Page Content Management */}
          <TabsContent value="pages" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Page List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Pages
                    </CardTitle>
                    <CardDescription>
                      Select a page to edit its content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {pages.map((page) => (
                      <div
                        key={page.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedPage?.id === page.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedPage(page)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{page.pageName}</h3>
                            <p className="text-sm text-gray-500">{page.route}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={page.status === 'published' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {page.status}
                            </Badge>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Page Editor */}
              <div className="lg:col-span-3">
                {selectedPage ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Edit3 className="w-5 h-5" />
                            Edit: {selectedPage.pageName}
                          </CardTitle>
                          <CardDescription>
                            Last modified: {selectedPage.lastModified}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                          >
                            {isEditing ? 'Cancel' : 'Edit'}
                          </Button>
                          {isEditing && (
                            <Button
                              size="sm"
                              onClick={() => handleSavePage(selectedPage)}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Basic Page Info */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="page-title">Page Title</Label>
                          <Input
                            id="page-title"
                            value={selectedPage.title}
                            onChange={(e) => setSelectedPage({
                              ...selectedPage,
                              title: e.target.value
                            })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="page-route">Route</Label>
                          <Input
                            id="page-route"
                            value={selectedPage.route}
                            onChange={(e) => setSelectedPage({
                              ...selectedPage,
                              route: e.target.value
                            })}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="page-description">Meta Description</Label>
                        <Textarea
                          id="page-description"
                          value={selectedPage.description}
                          onChange={(e) => setSelectedPage({
                            ...selectedPage,
                            description: e.target.value
                          })}
                          disabled={!isEditing}
                          rows={3}
                          enableRichTools={true}
                        />
                      </div>

                      {/* Hero Section */}
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="hero-title">Hero Title</Label>
                            <Input
                              id="hero-title"
                              value={selectedPage.heroTitle}
                              onChange={(e) => setSelectedPage({
                                ...selectedPage,
                                heroTitle: e.target.value
                              })}
                              disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <Label htmlFor="hero-description">Hero Description</Label>
                            <Textarea
                              id="hero-description"
                              value={selectedPage.heroDescription}
                              onChange={(e) => setSelectedPage({
                                ...selectedPage,
                                heroDescription: e.target.value
                              })}
                              disabled={!isEditing}
                              rows={3}
                              enableRichTools={true}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Call-to-Action Buttons */}
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Call-to-Action Buttons</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <Label>Primary CTA</Label>
                            <div className="space-y-2 mt-2">
                              <Input
                                placeholder="Button text"
                                value={selectedPage.primaryCTA.text}
                                onChange={(e) => setSelectedPage({
                                  ...selectedPage,
                                  primaryCTA: {
                                    ...selectedPage.primaryCTA,
                                    text: e.target.value
                                  }
                                })}
                                disabled={!isEditing}
                              />
                              <Input
                                placeholder="Button link"
                                value={selectedPage.primaryCTA.link}
                                onChange={(e) => setSelectedPage({
                                  ...selectedPage,
                                  primaryCTA: {
                                    ...selectedPage.primaryCTA,
                                    link: e.target.value
                                  }
                                })}
                                disabled={!isEditing}
                              />
                            </div>
                          </div>
                          
                          {selectedPage.secondaryCTA && (
                            <div>
                              <Label>Secondary CTA</Label>
                              <div className="space-y-2 mt-2">
                                <Input
                                  placeholder="Button text"
                                  value={selectedPage.secondaryCTA.text}
                                  onChange={(e) => setSelectedPage({
                                    ...selectedPage,
                                    secondaryCTA: {
                                      ...selectedPage.secondaryCTA!,
                                      text: e.target.value
                                    }
                                  })}
                                  disabled={!isEditing}
                                />
                                <Input
                                  placeholder="Button link"
                                  value={selectedPage.secondaryCTA.link}
                                  onChange={(e) => setSelectedPage({
                                    ...selectedPage,
                                    secondaryCTA: {
                                      ...selectedPage.secondaryCTA!,
                                      link: e.target.value
                                    }
                                  })}
                                  disabled={!isEditing}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content Sections */}
                      <div className="border-t pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Content Sections</h3>
                          {isEditing && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addNewSection(selectedPage.id)}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Section
                            </Button>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          {selectedPage.sections.map((section) => (
                            <Card key={section.id} className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 space-y-2">
                                  <Input
                                    placeholder="Section title"
                                    value={section.title}
                                    onChange={(e) => updateSection(selectedPage.id, section.id, { title: e.target.value })}
                                    disabled={!isEditing}
                                    className="font-medium"
                                  />
                                  <Textarea
                                    placeholder="Section content"
                                    value={section.content}
                                    onChange={(e) => updateSection(selectedPage.id, section.id, { content: e.target.value })}
                                    disabled={!isEditing}
                                    rows={3}
                                    enableRichTools={true}
                                  />
                                </div>
                                {isEditing && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeSection(selectedPage.id, section.id)}
                                    className="ml-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Select a page to edit
                        </h3>
                        <p className="text-gray-600">
                          Choose a page from the list to start editing its content
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Navigation Management */}
          <TabsContent value="navigation" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Navigation Menu
                    </CardTitle>
                    <CardDescription>
                      Manage the main navigation menu and submenus
                    </CardDescription>
                  </div>
                  <Button onClick={handleSaveNavigation}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Navigation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {navigationItems.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Menu Label</Label>
                            <Input
                              value={item.label}
                              onChange={(e) => setNavigationItems(prev =>
                                prev.map(nav => nav.id === item.id ? { ...nav, label: e.target.value } : nav)
                              )}
                            />
                          </div>
                          <div>
                            <Label>Menu Link</Label>
                            <Input
                              value={item.href}
                              onChange={(e) => setNavigationItems(prev =>
                                prev.map(nav => nav.id === item.id ? { ...nav, href: e.target.value } : nav)
                              )}
                            />
                          </div>
                        </div>
                        
                        {item.submenu && (
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">
                              Submenu Items
                            </Label>
                            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                              {item.submenu.map((subItem) => (
                                <div key={subItem.id} className="grid grid-cols-2 gap-2">
                                  <Input
                                    placeholder="Submenu label"
                                    value={subItem.label}
                                    onChange={(e) => setNavigationItems(prev =>
                                      prev.map(nav => nav.id === item.id ? {
                                        ...nav,
                                        submenu: nav.submenu?.map(sub => 
                                          sub.id === subItem.id ? { ...sub, label: e.target.value } : sub
                                        )
                                      } : nav)
                                    )}
                                  />
                                  <Input
                                    placeholder="Submenu link"
                                    value={subItem.href}
                                    onChange={(e) => setNavigationItems(prev =>
                                      prev.map(nav => nav.id === item.id ? {
                                        ...nav,
                                        submenu: nav.submenu?.map(sub => 
                                          sub.id === subItem.id ? { ...sub, href: e.target.value } : sub
                                        )
                                      } : nav)
                                    )}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Global Settings */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Site Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="site-title">Site Title</Label>
                    <Input id="site-title" defaultValue="ExhibitBay" />
                  </div>
                  <div>
                    <Label htmlFor="site-tagline">Site Tagline</Label>
                    <Input id="site-tagline" defaultValue="Global Exhibition Stand Builders" />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input id="contact-email" defaultValue="hello@exhibitbay.com" />
                  </div>
                  <div>
                    <Label htmlFor="contact-phone">Contact Phone</Label>
                    <Input id="contact-phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <Button>Save Settings</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Social Media
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="facebook">Facebook URL</Label>
                    <Input id="facebook" defaultValue="https://facebook.com/exhibitbay" />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter URL</Label>
                    <Input id="twitter" defaultValue="https://twitter.com/exhibitbay" />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input id="linkedin" defaultValue="https://linkedin.com/company/exhibitbay" />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram URL</Label>
                    <Input id="instagram" defaultValue="https://instagram.com/exhibitbay" />
                  </div>
                  <Button>Save Social Media</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}