'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Edit3, Save, Eye, Globe, FileText, Settings, Star, Award, 
  Calendar, Tag, Building, MapPin, Users, TrendingUp, X,
  Image, Type, Layout, Palette, Monitor, Smartphone
} from 'lucide-react';

interface PageContent {
  id: string;
  type: 'country' | 'city';
  location: {
    name: string;
    country?: string;
    slug: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    backgroundImage?: string;
    ctaText: string;
  };
  content: {
    introduction: string;
    whyChooseSection: string;
    industryOverview: string;
    venueInformation: string;
    builderAdvantages: string;
    conclusion: string;
  };
  design: {
    primaryColor: string;
    accentColor: string;
    layout: 'modern' | 'classic' | 'minimal';
    showStats: boolean;
    showMap: boolean;
  };
}

interface LocationPageEditorProps {
  pageData: PageContent;
  isVisible: boolean;
  onClose: () => void;
  onSave: (data: PageContent) => Promise<void>;
}

export function LocationPageEditor({ pageData, isVisible, onClose, onSave }: LocationPageEditorProps) {
  // Provide safe defaults to prevent undefined errors
  const safePageData: PageContent = {
    id: pageData?.id || '',
    type: pageData?.type || 'country',
    location: {
      name: pageData?.location?.name || '',
      country: pageData?.location?.country || '',
      slug: pageData?.location?.slug || ''
    },
    seo: {
      metaTitle: pageData?.seo?.metaTitle || '',
      metaDescription: pageData?.seo?.metaDescription || '',
      keywords: pageData?.seo?.keywords || [],
      canonicalUrl: pageData?.seo?.canonicalUrl || ''
    },
    hero: {
      title: pageData?.hero?.title || '',
      subtitle: pageData?.hero?.subtitle || '',
      description: pageData?.hero?.description || '',
      backgroundImage: pageData?.hero?.backgroundImage || '',
      ctaText: pageData?.hero?.ctaText || 'Get Free Quote'
    },
    content: {
      introduction: pageData?.content?.introduction || '',
      whyChooseSection: pageData?.content?.whyChooseSection || '',
      industryOverview: pageData?.content?.industryOverview || '',
      venueInformation: pageData?.content?.venueInformation || '',
      builderAdvantages: pageData?.content?.builderAdvantages || '',
      conclusion: pageData?.content?.conclusion || ''
    },
    design: {
      primaryColor: pageData?.design?.primaryColor || '#ec4899',
      accentColor: pageData?.design?.accentColor || '#f97316',
      layout: pageData?.design?.layout || 'modern',
      showStats: pageData?.design?.showStats ?? true,
      showMap: pageData?.design?.showMap ?? true
    }
  };

  const [content, setContent] = useState<PageContent>(safePageData);
  const [activeTab, setActiveTab] = useState('seo');
  const [isSaving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const { toast } = useToast();

  useEffect(() => {
    setContent(safePageData);
  }, [pageData]);

  if (!isVisible) return null;

  // Guard clause: if pageData is completely missing, don't render
  if (!pageData) {
    console.warn('LocationPageEditor: pageData is undefined');
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(content);
      toast({
        title: "Content Saved",
        description: "Page content has been successfully updated.",
      });
      onClose();
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving the content.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateContent = (section: keyof PageContent, field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateNestedContent = (section: keyof PageContent, subsection: string, field: string, value: any) => {
    setContent(prev => {
      if (section === 'seo' && subsection === 'seo') {
        return {
          ...prev,
          seo: {
            ...prev.seo,
            [field]: value
          }
        };
      }
      if (section === 'hero' && subsection === 'hero') {
        return {
          ...prev,
          hero: {
            ...prev.hero,
            [field]: value
          }
        };
      }
      if (section === 'content' && subsection === 'content') {
        return {
          ...prev,
          content: {
            ...prev.content,
            [field]: value
          }
        };
      }
      if (section === 'design' && subsection === 'design') {
        return {
          ...prev,
          design: {
            ...prev.design,
            [field]: value
          }
        };
      }
      return prev;
    });
  };

  const addKeyword = (keyword: string) => {
    if (keyword.trim() && !(content?.seo?.keywords || []).includes(keyword.trim())) {
      setContent(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...(prev?.seo?.keywords || []), keyword.trim()]
        }
      }));
    }
  };

  const removeKeyword = (index: number) => {
    setContent(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: (prev?.seo?.keywords || []).filter((_, i) => i !== index)
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Edit {content.type === 'country' ? 'Country' : 'City'} Page
            </h2>
            <p className="text-gray-600 mt-1">
              {content.location.name}{content.location.country && `, ${content.location.country}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-lg">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
                className="rounded-r-none"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
                className="rounded-l-none"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={onClose} variant="outline" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar with tabs */}
          <div className="w-80 border-r border-gray-200 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
              <TabsList className="grid w-full grid-cols-1 gap-1 h-auto p-4 bg-transparent">
                <TabsTrigger 
                  value="seo" 
                  className="w-full justify-start gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
                >
                  <Globe className="w-4 h-4" />
                  SEO & Meta
                </TabsTrigger>
                <TabsTrigger 
                  value="hero" 
                  className="w-full justify-start gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
                >
                  <Star className="w-4 h-4" />
                  Hero Section
                </TabsTrigger>
                <TabsTrigger 
                  value="content" 
                  className="w-full justify-start gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900"
                >
                  <FileText className="w-4 h-4" />
                  Page Content
                </TabsTrigger>
                <TabsTrigger 
                  value="design" 
                  className="w-full justify-start gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900"
                >
                  <Palette className="w-4 h-4" />
                  Design & Layout
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Main content area */}
          <div className="flex-1 overflow-y-auto p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* SEO & Meta Tab */}
              <TabsContent value="seo" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      SEO Settings
                    </CardTitle>
                    <CardDescription>
                      Optimize your page for search engines and social media
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input
                        id="metaTitle"
                        value={content.seo.metaTitle}
                        onChange={(e) => updateNestedContent('seo', 'seo', 'metaTitle', e.target.value)}
                        placeholder="SEO-optimized page title..."
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {(content?.seo?.metaTitle || '').length}/60 characters
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        value={content.seo.metaDescription}
                        onChange={(e) => updateNestedContent('seo', 'seo', 'metaDescription', e.target.value)}
                        placeholder="Compelling description for search results..."
                        rows={3}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {(content?.seo?.metaDescription || '').length}/160 characters
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="canonicalUrl">Canonical URL</Label>
                      <Input
                        id="canonicalUrl"
                        value={content.seo.canonicalUrl}
                        onChange={(e) => updateNestedContent('seo', 'seo', 'canonicalUrl', e.target.value)}
                        placeholder="/exhibition-stands/country/city"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>SEO Keywords</Label>
                      <div className="flex flex-wrap gap-2 mt-2 mb-2">
                        {(content?.seo?.keywords || []).map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {keyword}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => removeKeyword(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add keyword..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addKeyword((e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addKeyword(input.value);
                            input.value = '';
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Hero Section Tab */}
              <TabsContent value="hero" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-green-600" />
                      Hero Section Content
                    </CardTitle>
                    <CardDescription>
                      Create an engaging hero section with quotation form
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="heroTitle">Hero Title</Label>
                      <Input
                        id="heroTitle"
                        value={content.hero.title}
                        onChange={(e) => updateNestedContent('hero', 'hero', 'title', e.target.value)}
                        placeholder="Exhibition Stand Builders in..."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                      <Input
                        id="heroSubtitle"
                        value={content.hero.subtitle}
                        onChange={(e) => updateNestedContent('hero', 'hero', 'subtitle', e.target.value)}
                        placeholder="Professional booth design and construction"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="heroDescription">Hero Description</Label>
                      <Textarea
                        id="heroDescription"
                        value={content.hero.description}
                        onChange={(e) => updateNestedContent('hero', 'hero', 'description', e.target.value)}
                        placeholder="Compelling description for your location..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="ctaText">Call-to-Action Text</Label>
                      <Input
                        id="ctaText"
                        value={content.hero.ctaText}
                        onChange={(e) => updateNestedContent('hero', 'hero', 'ctaText', e.target.value)}
                        placeholder="Get Free Quote"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="backgroundImage">Background Image URL</Label>
                      <Input
                        id="backgroundImage"
                        value={content.hero.backgroundImage || ''}
                        onChange={(e) => updateNestedContent('hero', 'hero', 'backgroundImage', e.target.value)}
                        placeholder="https://example.com/hero-image.jpg"
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Page Content Tab */}
              <TabsContent value="content" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      Page Content Blocks
                    </CardTitle>
                    <CardDescription>
                      Edit the main content sections of your page
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="introduction">Introduction</Label>
                      <Textarea
                        id="introduction"
                        value={content.content.introduction}
                        onChange={(e) => updateNestedContent('content', 'content', 'introduction', e.target.value)}
                        placeholder="Introduce the location and its exhibition industry..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="whyChoose">Why Choose This Location</Label>
                      <Textarea
                        id="whyChoose"
                        value={content.content.whyChooseSection}
                        onChange={(e) => updateNestedContent('content', 'content', 'whyChooseSection', e.target.value)}
                        placeholder="Explain the advantages of choosing this location..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="industryOverview">Industry Overview</Label>
                      <Textarea
                        id="industryOverview"
                        value={content.content.industryOverview}
                        onChange={(e) => updateNestedContent('content', 'content', 'industryOverview', e.target.value)}
                        placeholder="Describe the key industries and trade shows..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="venueInfo">Venue Information</Label>
                      <Textarea
                        id="venueInfo"
                        value={content.content.venueInformation}
                        onChange={(e) => updateNestedContent('content', 'content', 'venueInformation', e.target.value)}
                        placeholder="Information about major exhibition venues..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="builderAdvantages">Local Builder Advantages</Label>
                      <Textarea
                        id="builderAdvantages"
                        value={content.content.builderAdvantages}
                        onChange={(e) => updateNestedContent('content', 'content', 'builderAdvantages', e.target.value)}
                        placeholder="Benefits of working with local builders..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="conclusion">Conclusion</Label>
                      <Textarea
                        id="conclusion"
                        value={content.content.conclusion}
                        onChange={(e) => updateNestedContent('content', 'content', 'conclusion', e.target.value)}
                        placeholder="Compelling conclusion and call-to-action..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Design & Layout Tab */}
              <TabsContent value="design" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-orange-600" />
                      Design & Layout Settings
                    </CardTitle>
                    <CardDescription>
                      Customize the visual appearance and layout
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="primaryColor"
                            type="color"
                            value={content.design.primaryColor}
                            onChange={(e) => updateNestedContent('design', 'design', 'primaryColor', e.target.value)}
                            className="w-16 h-10 p-1 border rounded"
                          />
                          <Input
                            value={content.design.primaryColor}
                            onChange={(e) => updateNestedContent('design', 'design', 'primaryColor', e.target.value)}
                            placeholder="#FF0000"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="accentColor">Accent Color</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="accentColor"
                            type="color"
                            value={content.design.accentColor}
                            onChange={(e) => updateNestedContent('design', 'design', 'accentColor', e.target.value)}
                            className="w-16 h-10 p-1 border rounded"
                          />
                          <Input
                            value={content.design.accentColor}
                            onChange={(e) => updateNestedContent('design', 'design', 'accentColor', e.target.value)}
                            placeholder="#00FF00"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="layout">Page Layout Style</Label>
                      <Select
                        value={content.design.layout}
                        onValueChange={(value: 'modern' | 'classic' | 'minimal') => 
                          updateNestedContent('design', 'design', 'layout', value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modern">Modern - Bold and contemporary</SelectItem>
                          <SelectItem value="classic">Classic - Traditional and elegant</SelectItem>
                          <SelectItem value="minimal">Minimal - Clean and simple</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Statistics Section</Label>
                        <p className="text-sm text-gray-500">Display builder counts and ratings</p>
                      </div>
                      <Button
                        variant={content.design.showStats ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateNestedContent('design', 'design', 'showStats', !content.design.showStats)}
                      >
                        {content.design.showStats ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Interactive Map</Label>
                        <p className="text-sm text-gray-500">Include location map for cities</p>
                      </div>
                      <Button
                        variant={content.design.showMap ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateNestedContent('design', 'design', 'showMap', !content.design.showMap)}
                      >
                        {content.design.showMap ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Badge variant="outline">
              Last modified: {new Date().toLocaleDateString()}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
      </div>
    </div>
  );
}

export default LocationPageEditor;
