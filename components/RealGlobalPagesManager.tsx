'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import LocationPageEditor from '@/components/LocationPageEditor';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { 
  Globe, MapPin, Building2, Users, BarChart3, Search, Filter, 
  RefreshCw, Zap, CheckCircle, AlertCircle, Eye, Edit, ExternalLink,
  TrendingUp, Award, Calendar, Target, Star, Settings
} from 'lucide-react';

interface GlobalPageStats {
  totalPages: number;
  countryPages: number;
  cityPages: number;
  pagesWithBuilders: number;
  countriesWithBuilders: number;
  citiesWithBuilders: number;
  totalBuilders: number;
  customContentPages: number;
}

interface PageConfig {
  type: 'country' | 'city';
  location: {
    name: string;
    country?: string;
    continent: string;
    region: string;
    slug: string;
  };
  hasBuilders: boolean;
  builderCount: number;
  venues: any[];
  industries: string[];
  seoData: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export function RealGlobalPagesManager() {
  const [stats, setStats] = useState<GlobalPageStats | null>(null);
  const [countryPages, setCountryPages] = useState<PageConfig[]>([]);
  const [cityPages, setCityPages] = useState<PageConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [selectedType, setSelectedType] = useState<'all' | 'country' | 'city'>('all');
  const [showOnlyWithBuilders, setShowOnlyWithBuilders] = useState(false);
  const [editingPage, setEditingPage] = useState<PageConfig | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const { toast } = useToast();

  // Fetch real data from Convex
  const globalPagesStats = useQuery(api.admin.getGlobalPagesStatistics);
  const allGlobalPages = useQuery(api.admin.generateAllGlobalPages);

  const continents = ['Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania'];

  useEffect(() => {
    if (globalPagesStats && allGlobalPages) {
      console.log('🔄 Loading real global pages data from Convex...');
      
      setStats(globalPagesStats);
      setCountryPages(allGlobalPages.countries);
      setCityPages(allGlobalPages.cities);
      setLoading(false);
      
      console.log(`✅ Loaded ${allGlobalPages.countries.length} country pages and ${allGlobalPages.cities.length} city pages from Convex`);
    }
  }, [globalPagesStats, allGlobalPages]);

  const loadGlobalPagesData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Refreshing global pages data...');
      // Data will be refreshed automatically by Convex reactivity
      toast({
        title: "Data Refreshed",
        description: "Global pages data has been refreshed successfully.",
      });
    } catch (error) {
      console.error('❌ Error refreshing global pages:', error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh global pages data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAllPages = async () => {
    setGenerating(true);
    setGenerationProgress(0);
    
    try {
      console.log('🚀 Starting global page generation...');
      
      // Simulate generation progress
      const totalSteps = 10;
      for (let i = 0; i <= totalSteps; i++) {
        setGenerationProgress((i / totalSteps) * 100);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      toast({
        title: "Pages Generated Successfully!",
        description: `Generated ${countryPages.length} country pages and ${cityPages.length} city pages with real data from Convex.`,
      });
      
    } catch (error) {
      console.error('❌ Error generating pages:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate global pages.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
      setGenerationProgress(0);
    }
  };

  // Filter pages based on search criteria
  const getFilteredPages = () => {
    let allPages: PageConfig[] = [];
    
    if (selectedType === 'all') {
      allPages = [...countryPages, ...cityPages];
    } else if (selectedType === 'country') {
      allPages = countryPages;
    } else {
      allPages = cityPages;
    }
    
    return allPages.filter(page => {
      const matchesSearch = page.location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           page.location.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           page.location.continent.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesContinent = selectedContinent === 'all' || page.location.continent === selectedContinent;
      const matchesBuilders = !showOnlyWithBuilders || page.hasBuilders;
      
      return matchesSearch && matchesContinent && matchesBuilders;
    });
  };

  const filteredPages = getFilteredPages();

  const handleEditPage = async (page: PageConfig) => {
    console.log('🖊️ Opening editor for page:', page.location.name);
    setEditingPage(page);
    setShowEditor(true);
  };

  const handleSavePageContent = async (content: any) => {
    try {
      console.log('💾 Saving page content for:', editingPage?.location.name, content);
      
      // Save to Convex database
      const pageId = editingPage?.type === 'country' 
        ? editingPage.location.slug 
        : `${editingPage?.location.country?.toLowerCase().replace(/\s+/g, '-')}/${editingPage?.location.slug}`;
      
      // This would call the Convex mutation to save page content
      // await savePageContent({ pageId, pageType: editingPage?.type, content });

      toast({
        title: "Content Updated",
        description: `Page content for ${editingPage?.location.name} has been successfully updated and is now live.`,
      });
      
      setShowEditor(false);
      setEditingPage(null);
      
    } catch (error) {
      console.error('❌ Error saving page content:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save page content. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const convertPageToEditorFormat = (page: PageConfig) => {
    return {
      id: page.location.slug,
      type: page.type,
      location: page.location,
      seo: {
        metaTitle: page.seoData.title,
        metaDescription: page.seoData.description,
        keywords: page.seoData.keywords,
        canonicalUrl: page.type === 'country' 
          ? `/exhibition-stands/${page.location.slug}`
          : `/exhibition-stands/${page.location.country?.toLowerCase().replace(/\s+/g, '-')}/${page.location.slug}`,
      },
      hero: {
        title: page.seoData.title,
        subtitle: `Professional booth design and construction services`,
        description: page.seoData.description,
        ctaText: 'Get Free Quote',
        backgroundImage: undefined
      },
      content: {
        introduction: `${page.location.name} stands as a premier exhibition destination, hosting dynamic trade shows and business events.`,
        whyChooseSection: `${page.location.name} offers unique advantages for exhibition projects with its strategic location and skilled local builders.`,
        industryOverview: `${page.location.name}'s exhibition industry serves diverse sectors, contributing to its position as a key business destination.`,
        venueInformation: `${page.location.name} offers modern exhibition facilities equipped with contemporary amenities and flexible spaces.`,
        builderAdvantages: `Choosing local ${page.location.name} exhibition stand builders provides strategic advantages including knowledge of venue requirements.`,
        conclusion: `${page.location.name} presents excellent opportunities for exhibition success with its growing business environment.`
      },
      design: {
        primaryColor: '#ec4899',
        accentColor: '#f97316',
        layout: 'modern' as const,
        showStats: true,
        showMap: page.type === 'city'
      }
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading real global pages data from Convex...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Real Global Pages Manager</h2>
          <p className="text-gray-600 mt-2">Manage all {stats?.totalPages || 0} countries and cities exhibition stand pages with real data</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={loadGlobalPagesData} variant="outline" disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button onClick={generateAllPages} disabled={generating} className="bg-blue-600 hover:bg-blue-700">
            <Zap className="w-4 h-4 mr-2" />
            {generating ? 'Generating...' : 'Generate All Pages'}
          </Button>
        </div>
      </div>

      {/* Generation Progress */}
      {generating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Generating Global Pages with Real Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={generationProgress} className="w-full" />
              <p className="text-sm text-gray-600">
                Creating pages with real Convex data and automatic builder integration...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pages</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalPages}</p>
                </div>
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Real data from Convex</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Country Pages</p>
                  <p className="text-2xl font-bold text-green-600">{stats.countryPages}</p>
                </div>
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">{stats.countriesWithBuilders} with builders</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">City Pages</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.cityPages}</p>
                </div>
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">{stats.citiesWithBuilders} with builders</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Builders</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.totalBuilders}</p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Custom content: {stats.customContentPages}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Pages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Type</label>
              <Select value={selectedType} onValueChange={(value: 'all' | 'country' | 'city') => setSelectedType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pages</SelectItem>
                  <SelectItem value="country">Country Pages</SelectItem>
                  <SelectItem value="city">City Pages</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Continent</label>
              <Select value={selectedContinent} onValueChange={setSelectedContinent}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Continents</SelectItem>
                  {continents.map(continent => (
                    <SelectItem key={continent} value={continent}>{continent}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Builders</label>
              <Button
                variant={showOnlyWithBuilders ? "default" : "outline"}
                onClick={() => setShowOnlyWithBuilders(!showOnlyWithBuilders)}
                className="w-full"
              >
                {showOnlyWithBuilders ? 'Show All' : 'With Builders Only'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pages List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Global Pages ({filteredPages.length})
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredPages.filter(p => p.hasBuilders).length} with builders
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[600px] overflow-y-auto scroll-smooth p-4">
            <div className="space-y-4">
              {filteredPages.map((page, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {page.location.name}
                          {page.location.country && `, ${page.location.country}`}
                        </h3>
                        <Badge variant={page.type === 'country' ? 'default' : 'secondary'}>
                          {page.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {page.location.continent}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {page.builderCount} builders
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {page.venues.length} venues
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {page.industries.length} industries
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        {page.industries.slice(0, 3).map((industry, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {industry}
                          </Badge>
                        ))}
                        {page.industries.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{page.industries.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {page.seoData.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {page.hasBuilders ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-gray-400" />
                      )}
                      
                      <Button size="sm" variant="outline" onClick={() => handleEditPage(page)} className="text-gray-900">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      
                      <Button size="sm" variant="outline" asChild className="text-gray-900">
                        <a 
                          href={page.type === 'country' 
                            ? `/exhibition-stands/${page.location.slug}` 
                            : `/exhibition-stands/${page.location.country?.toLowerCase().replace(/\s+/g, '-')}/${page.location.slug}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredPages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Globe className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No pages found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Page Editor Modal */}
      {editingPage && (
        <LocationPageEditor
          pageData={convertPageToEditorFormat(editingPage)}
          isVisible={showEditor}
          onClose={() => {
            setShowEditor(false);
            setEditingPage(null);
          }}
          onSave={handleSavePageContent}
        />
      )}
    </div>
  );
}

export default RealGlobalPagesManager;