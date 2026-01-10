'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Monitor,
  Smartphone,
  Save,
  Eye,
  Edit3,
  Palette,
  Type,
  Image,
  Link,
  RefreshCw,
  Plus,
  Trash2,
  Move,
  Copy,
  Settings,
  Layout,
  Globe
} from 'lucide-react';

interface WebsiteSection {
  id: string;
  name: string;
  type: 'hero' | 'about' | 'services' | 'testimonials' | 'footer' | 'header';
  isEnabled: boolean;
  order: number;
  content: any;
  lastModified: string;
}

interface WebsiteCustomizationProps {
  onSave: (sections: WebsiteSection[]) => Promise<void>;
}

export default function WebsiteCustomization({ onSave }: WebsiteCustomizationProps) {
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [activeSection, setActiveSection] = useState<string>('header');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sections, setSections] = useState<WebsiteSection[]>([
    {
      id: 'header',
      name: 'Header Section',
      type: 'header',
      isEnabled: true,
      order: 1,
      content: {
        logo: 'ExhibitBay',
        logoType: 'text', // 'text' | 'image'
        logoImage: '',
        navItems: [
          { label: 'Home', href: '/', isEnabled: true },
          { label: 'Builders', href: '/builders', isEnabled: true },
          { label: 'Trade Shows', href: '/trade-shows', isEnabled: true },
          { label: 'Platform', href: '/platform', isEnabled: true },
          { label: 'Contact', href: '/contact', isEnabled: true }
        ],
        ctaButton: {
          text: 'Get Quote',
          href: '/quote',
          isEnabled: true,
          style: 'primary'
        },
        backgroundColor: '#ffffff',
        textColor: '#1a202c',
        isSticky: true,
        showSearchBar: false
      },
      lastModified: new Date().toISOString()
    },
    {
      id: 'hero',
      name: 'Hero Section',
      type: 'hero',
      isEnabled: true,
      order: 2,
      content: {
        headline: 'We Build Your Stand in Any Corner of the World',
        subheadline: 'Get competitive quotes from verified exhibition stand builders. We compare 500+ contractors in your city to find the perfect match.',
        backgroundType: 'gradient', // 'gradient' | 'image' | 'video'
        backgroundImage: '',
        backgroundVideo: '',
        primaryButton: {
          text: 'Get Free Quote',
          href: '/quote',
          isEnabled: true
        },
        secondaryButton: {
          text: 'Find Builders',
          href: '/builders',
          isEnabled: true
        },
        stats: [
          { value: '250,000+', label: 'Quotes Compared', isEnabled: true },
          { value: '1,852', label: 'Cities Covered', isEnabled: true },
          { value: '23%', label: 'Average Savings', isEnabled: true }
        ],
        badge: {
          text: '500+ Builders in Every City',
          isEnabled: true
        }
      },
      lastModified: new Date().toISOString()
    },
    {
      id: 'about',
      name: 'About Section',
      type: 'about',
      isEnabled: true,
      order: 3,
      content: {
        headline: 'Global Exhibition Stand Solutions',
        description: 'We connect you with the world\'s best exhibition stand builders, ensuring quality, reliability, and competitive pricing for your next trade show.',
        features: [
          { icon: '🏗️', title: 'Expert Builders', description: 'Verified contractors worldwide' },
          { icon: '💰', title: 'Best Prices', description: 'Competitive quotes guaranteed' },
          { icon: '🌍', title: 'Global Reach', description: '1,852 cities covered' },
          { icon: '⚡', title: 'Fast Response', description: '24-hour quote delivery' }
        ],
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
        backgroundColor: '#f8fafc'
      },
      lastModified: new Date().toISOString()
    },
    {
      id: 'footer',
      name: 'Footer Section',
      type: 'footer',
      isEnabled: true,
      order: 10,
      content: {
        companyInfo: {
          name: 'ExhibitBay',
          description: 'Creating extraordinary exhibition experiences that captivate audiences and drive business results across 50+ countries worldwide.',
          phone: '+1 (555) 123-4567',
          email: 'hello@exhibitbay.com',
          address: '123 Exhibition Ave, NYC'
        },
        links: {
          services: [
            'Custom Stand Design',
            'Build & Installation',
            'Global Services',
            'Event Management'
          ],
          locations: [
            'United States',
            'Germany',
            'United Kingdom',
            'UAE'
          ],
          resources: [
            'Portfolio',
            'Case Studies',
            'Industry Insights',
            'Contact Us'
          ]
        },
        newsletter: {
          isEnabled: true,
          headline: 'Stay Updated',
          description: 'Get the latest exhibition trends, industry insights, and project showcases.',
          buttonText: 'Subscribe'
        },
        social: {
          linkedin: '#',
          twitter: '#',
          instagram: '#',
          facebook: '#'
        },
        copyright: '© 2026 ExhibitBay. All rights reserved.',
        backgroundColor: '#1a202c',
        textColor: '#ffffff'
      },
      lastModified: new Date().toISOString()
    }
  ]);

  console.log('WebsiteCustomization: Component loaded');

  const handleSectionUpdate = (sectionId: string, field: string, value: any) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? {
          ...section,
          content: { ...section.content, [field]: value },
          lastModified: new Date().toISOString()
        }
        : section
    ));
  };

  const handleNestedUpdate = (sectionId: string, path: string[], value: any) => {
    setSections(prev => prev.map(section => {
      if (section.id !== sectionId) return section;

      const newContent = { ...section.content };
      let current = newContent;

      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;

      return {
        ...section,
        content: newContent,
        lastModified: new Date().toISOString()
      };
    }));
  };

  const toggleSection = (sectionId: string) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, isEnabled: !section.isEnabled }
        : section
    ));
  };

  const saveChanges = async () => {
    setIsSaving(true);
    console.log('Saving website customization changes:', sections);

    try {
      await onSave(sections);
      console.log('Changes saved successfully');
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Website Customization</h2>
          <p className="text-gray-600">Customize your website content, layout, and design in real-time</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Device Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={activeDevice === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveDevice('desktop')}
              className="px-3"
            >
              <Monitor className="h-4 w-4 mr-1" />
              Desktop
            </Button>
            <Button
              variant={activeDevice === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveDevice('mobile')}
              className="px-3"
            >
              <Smartphone className="h-4 w-4 mr-1" />
              Mobile
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
          </Button>

          <Button
            onClick={saveChanges}
            disabled={isSaving}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Layout className="h-5 w-5 mr-2" />
              Website Sections
            </CardTitle>
            <CardDescription>
              Select a section to edit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${activeSection === section.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={section.isEnabled}
                        onCheckedChange={() => toggleSection(section.id)}
                      />
                      <span className="font-medium text-sm">{section.name}</span>
                    </div>
                    <Badge variant={section.isEnabled ? 'default' : 'secondary'}>
                      {section.isEnabled ? 'Active' : 'Hidden'}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Modified: {new Date(section.lastModified).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section Editor */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Edit3 className="h-5 w-5 mr-2" />
                {currentSection?.name}
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                {activeDevice} View
              </Badge>
            </CardTitle>
            <CardDescription>
              Customize content and settings for this section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentSection && (
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-6">
                  {/* Header Section Content */}
                  {currentSection.type === 'header' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Logo</label>
                        <div className="flex items-center space-x-4">
                          <Input
                            value={currentSection.content.logo}
                            onChange={(e) => handleSectionUpdate('header', 'logo', e.target.value)}
                            placeholder="Company name or logo text"
                          />
                          <Button variant="outline" size="sm">
                            <Image className="h-4 w-4 mr-1" />
                            Upload Logo
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Navigation Items</label>
                        <div className="space-y-2">
                          {currentSection.content.navItems.map((item: any, index: number) => (
                            <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                              <Input
                                value={item.label}
                                onChange={(e) => {
                                  const newNavItems = [...currentSection.content.navItems];
                                  newNavItems[index].label = e.target.value;
                                  handleSectionUpdate('header', 'navItems', newNavItems);
                                }}
                                className="flex-1"
                              />
                              <Input
                                value={item.href}
                                onChange={(e) => {
                                  const newNavItems = [...currentSection.content.navItems];
                                  newNavItems[index].href = e.target.value;
                                  handleSectionUpdate('header', 'navItems', newNavItems);
                                }}
                                className="flex-1"
                                placeholder="/link"
                              />
                              <Switch
                                checked={item.isEnabled}
                                onCheckedChange={(checked) => {
                                  const newNavItems = [...currentSection.content.navItems];
                                  newNavItems[index].isEnabled = checked;
                                  handleSectionUpdate('header', 'navItems', newNavItems);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">CTA Button</label>
                        <div className="flex items-center space-x-2">
                          <Input
                            value={currentSection.content.ctaButton.text}
                            onChange={(e) => handleNestedUpdate('header', ['ctaButton', 'text'], e.target.value)}
                            placeholder="Button text"
                          />
                          <Input
                            value={currentSection.content.ctaButton.href}
                            onChange={(e) => handleNestedUpdate('header', ['ctaButton', 'href'], e.target.value)}
                            placeholder="Button link"
                          />
                          <Switch
                            checked={currentSection.content.ctaButton.isEnabled}
                            onCheckedChange={(checked) => handleNestedUpdate('header', ['ctaButton', 'isEnabled'], checked)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hero Section Content */}
                  {currentSection.type === 'hero' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Headline</label>
                        <Input
                          value={currentSection.content.headline}
                          onChange={(e) => handleSectionUpdate('hero', 'headline', e.target.value)}
                          className="text-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Subheadline</label>
                        <Textarea
                          value={currentSection.content.subheadline}
                          onChange={(e) => handleSectionUpdate('hero', 'subheadline', e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Primary Button</label>
                          <Input
                            value={currentSection.content.primaryButton.text}
                            onChange={(e) => handleNestedUpdate('hero', ['primaryButton', 'text'], e.target.value)}
                            placeholder="Button text"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Secondary Button</label>
                          <Input
                            value={currentSection.content.secondaryButton.text}
                            onChange={(e) => handleNestedUpdate('hero', ['secondaryButton', 'text'], e.target.value)}
                            placeholder="Button text"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Statistics</label>
                        <div className="space-y-2">
                          {currentSection.content.stats.map((stat: any, index: number) => (
                            <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                              <Input
                                value={stat.value}
                                onChange={(e) => {
                                  const newStats = [...currentSection.content.stats];
                                  newStats[index].value = e.target.value;
                                  handleSectionUpdate('hero', 'stats', newStats);
                                }}
                                placeholder="Value"
                                className="w-24"
                              />
                              <Input
                                value={stat.label}
                                onChange={(e) => {
                                  const newStats = [...currentSection.content.stats];
                                  newStats[index].label = e.target.value;
                                  handleSectionUpdate('hero', 'stats', newStats);
                                }}
                                placeholder="Label"
                                className="flex-1"
                              />
                              <Switch
                                checked={stat.isEnabled}
                                onCheckedChange={(checked) => {
                                  const newStats = [...currentSection.content.stats];
                                  newStats[index].isEnabled = checked;
                                  handleSectionUpdate('hero', 'stats', newStats);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer Section Content */}
                  {currentSection.type === 'footer' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Company Information</label>
                        <div className="space-y-2">
                          <Input
                            value={currentSection.content.companyInfo.name}
                            onChange={(e) => handleNestedUpdate('footer', ['companyInfo', 'name'], e.target.value)}
                            placeholder="Company name"
                          />
                          <Textarea
                            value={currentSection.content.companyInfo.description}
                            onChange={(e) => handleNestedUpdate('footer', ['companyInfo', 'description'], e.target.value)}
                            placeholder="Company description"
                            rows={3}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              value={currentSection.content.companyInfo.phone}
                              onChange={(e) => handleNestedUpdate('footer', ['companyInfo', 'phone'], e.target.value)}
                              placeholder="Phone number"
                            />
                            <Input
                              value={currentSection.content.companyInfo.email}
                              onChange={(e) => handleNestedUpdate('footer', ['companyInfo', 'email'], e.target.value)}
                              placeholder="Email address"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Newsletter Section</label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={currentSection.content.newsletter.isEnabled}
                              onCheckedChange={(checked) => handleNestedUpdate('footer', ['newsletter', 'isEnabled'], checked)}
                            />
                            <span className="text-sm">Enable newsletter signup</span>
                          </div>
                          <Input
                            value={currentSection.content.newsletter.headline}
                            onChange={(e) => handleNestedUpdate('footer', ['newsletter', 'headline'], e.target.value)}
                            placeholder="Newsletter headline"
                          />
                          <Textarea
                            value={currentSection.content.newsletter.description}
                            onChange={(e) => handleNestedUpdate('footer', ['newsletter', 'description'], e.target.value)}
                            placeholder="Newsletter description"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="design" className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Background Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={currentSection.content.backgroundColor || '#ffffff'}
                          onChange={(e) => handleSectionUpdate(currentSection.id, 'backgroundColor', e.target.value)}
                          className="w-12 h-10 rounded border"
                        />
                        <Input
                          value={currentSection.content.backgroundColor || '#ffffff'}
                          onChange={(e) => handleSectionUpdate(currentSection.id, 'backgroundColor', e.target.value)}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Text Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={currentSection.content.textColor || '#000000'}
                          onChange={(e) => handleSectionUpdate(currentSection.id, 'textColor', e.target.value)}
                          className="w-12 h-10 rounded border"
                        />
                        <Input
                          value={currentSection.content.textColor || '#000000'}
                          onChange={(e) => handleSectionUpdate(currentSection.id, 'textColor', e.target.value)}
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </div>

                  {currentSection.type === 'hero' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Background Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['gradient', 'image', 'video'].map((type) => (
                          <Button
                            key={type}
                            variant={currentSection.content.backgroundType === type ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleSectionUpdate('hero', 'backgroundType', type)}
                            className="capitalize"
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Section Visibility</p>
                        <p className="text-sm text-gray-500">Show this section on the website</p>
                      </div>
                      <Switch
                        checked={currentSection.isEnabled}
                        onCheckedChange={() => toggleSection(currentSection.id)}
                      />
                    </div>

                    {currentSection.type === 'header' && (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Sticky Header</p>
                            <p className="text-sm text-gray-500">Keep header visible when scrolling</p>
                          </div>
                          <Switch
                            checked={currentSection.content.isSticky}
                            onCheckedChange={(checked) => handleSectionUpdate('header', 'isSticky', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Search Bar</p>
                            <p className="text-sm text-gray-500">Show search functionality in header</p>
                          </div>
                          <Switch
                            checked={currentSection.content.showSearchBar}
                            onCheckedChange={(checked) => handleSectionUpdate('header', 'showSearchBar', checked)}
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-2">Device-Specific Settings</label>
                      <p className="text-sm text-gray-500 mb-3">Configure how this section appears on different devices</p>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium mb-2">Currently editing: {activeDevice}</p>
                        <p className="text-xs text-gray-600">Changes will apply to {activeDevice} view only</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Global Website Settings
          </CardTitle>
          <CardDescription>
            Settings that affect the entire website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">SEO Settings</h4>
              <Input placeholder="Site title" />
              <Textarea placeholder="Site description" rows={3} />
              <Input placeholder="Keywords (comma separated)" />
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Analytics</h4>
              <Input placeholder="Google Analytics ID" />
              <Input placeholder="Facebook Pixel ID" />
              <div className="flex items-center space-x-2">
                <Switch />
                <span className="text-sm">Enable tracking</span>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Performance</h4>
              <div className="flex items-center justify-between">
                <span className="text-sm">Enable caching</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Compress images</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Lazy loading</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}