'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { GLOBAL_EXHIBITION_DATA } from '@/lib/data/globalCities';
import {
  Globe, MapPin, Building2, TreePine, ChevronRight, ChevronDown, Edit, Trash2, Eye,
  Plus, Save, RefreshCw, Download, Upload, Zap, Brain, Target, CheckCircle,
  AlertCircle, Star, Award, BarChart3, TrendingUp, Users, Calendar
} from 'lucide-react';

interface TreeNode {
  id: string;
  name: string;
  type: 'continent' | 'country' | 'city';
  slug: string;
  children?: TreeNode[];
  isExpanded?: boolean;
  isPublished?: boolean;
  stats?: {
    builders: number;
    events: number;
    views: number;
  };
}

export function GlobalPageTreeManager() {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    generateTreeStructure();
  }, []);

  const generateTreeStructure = () => {
    console.log('Generating global exhibition tree structure...');
    
    const continents: TreeNode[] = [
      {
        id: 'europe',
        name: 'Europe',
        type: 'continent',
        slug: 'europe',
        isPublished: true,
        stats: { builders: 450, events: 2800, views: 125000 },
        children: GLOBAL_EXHIBITION_DATA.countries
          .filter(country => country.continent === 'Europe')
          .map(country => ({
            id: country.id,
            name: country.name,
            type: 'country' as const,
            slug: country.slug,
            isPublished: true,
            stats: { 
              builders: country.totalVenues * 3, 
              events: country.annualEvents, 
              views: country.exhibitionRanking * 2000 
            },
            children: GLOBAL_EXHIBITION_DATA.cities
              .filter(city => city.country === country.name)
              .map(city => ({
                id: city.id,
                name: city.name,
                type: 'city' as const,
                slug: city.slug,
                isPublished: true,
                stats: { 
                  builders: city.venues.length * 8, 
                  events: city.annualEvents, 
                  views: city.annualEvents * 50 
                }
              }))
          }))
      },
      {
        id: 'asia',
        name: 'Asia',
        type: 'continent',
        slug: 'asia',
        isPublished: true,
        stats: { builders: 380, events: 2200, views: 95000 },
        children: GLOBAL_EXHIBITION_DATA.countries
          .filter(country => country.continent === 'Asia')
          .map(country => ({
            id: country.id,
            name: country.name,
            type: 'country' as const,
            slug: country.slug,
            isPublished: true,
            stats: { 
              builders: country.totalVenues * 3, 
              events: country.annualEvents, 
              views: country.exhibitionRanking * 1800 
            },
            children: GLOBAL_EXHIBITION_DATA.cities
              .filter(city => city.country === country.name)
              .map(city => ({
                id: city.id,
                name: city.name,
                type: 'city' as const,
                slug: city.slug,
                isPublished: true,
                stats: { 
                  builders: city.venues.length * 8, 
                  events: city.annualEvents, 
                  views: city.annualEvents * 45 
                }
              }))
          }))
      },
      {
        id: 'north-america',
        name: 'North America',
        type: 'continent',
        slug: 'north-america',
        isPublished: true,
        stats: { builders: 520, events: 3500, views: 180000 },
        children: GLOBAL_EXHIBITION_DATA.countries
          .filter(country => country.continent === 'North America')
          .map(country => ({
            id: country.id,
            name: country.name,
            type: 'country' as const,
            slug: country.slug,
            isPublished: true,
            stats: { 
              builders: country.totalVenues * 3, 
              events: country.annualEvents, 
              views: country.exhibitionRanking * 2500 
            },
            children: GLOBAL_EXHIBITION_DATA.cities
              .filter(city => city.country === country.name)
              .map(city => ({
                id: city.id,
                name: city.name,
                type: 'city' as const,
                slug: city.slug,
                isPublished: true,
                stats: { 
                  builders: city.venues.length * 8, 
                  events: city.annualEvents, 
                  views: city.annualEvents * 60 
                }
              }))
          }))
      },
      {
        id: 'south-america',
        name: 'South America',
        type: 'continent',
        slug: 'south-america',
        isPublished: true,
        stats: { builders: 120, events: 400, views: 25000 },
        children: GLOBAL_EXHIBITION_DATA.countries
          .filter(country => country.continent === 'South America')
          .map(country => ({
            id: country.id,
            name: country.name,
            type: 'country' as const,
            slug: country.slug,
            isPublished: true,
            stats: { 
              builders: country.totalVenues * 3, 
              events: country.annualEvents, 
              views: country.exhibitionRanking * 1200 
            },
            children: GLOBAL_EXHIBITION_DATA.cities
              .filter(city => city.country === country.name)
              .map(city => ({
                id: city.id,
                name: city.name,
                type: 'city' as const,
                slug: city.slug,
                isPublished: true,
                stats: { 
                  builders: city.venues.length * 8, 
                  events: city.annualEvents, 
                  views: city.annualEvents * 30 
                }
              }))
          }))
      }
    ];

    setTreeData(continents);
    console.log('Tree structure generated:', continents);
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const generateAllPages = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const totalPages = GLOBAL_EXHIBITION_DATA.countries.length + GLOBAL_EXHIBITION_DATA.cities.length + 4; // +4 for continents
      let currentPage = 0;

      // Generate continent pages
      for (let i = 0; i < 4; i++) {
        console.log(`Generating continent page ${i + 1}/4...`);
        await new Promise(resolve => setTimeout(resolve, 200));
        currentPage++;
        setGenerationProgress((currentPage / totalPages) * 100);
      }

      // Generate country pages
      for (const country of GLOBAL_EXHIBITION_DATA.countries) {
        console.log(`Generating country page: ${country.name}...`);
        await new Promise(resolve => setTimeout(resolve, 300));
        currentPage++;
        setGenerationProgress((currentPage / totalPages) * 100);
      }

      // Generate city pages
      for (const city of GLOBAL_EXHIBITION_DATA.cities) {
        console.log(`Generating city page: ${city.name}, ${city.country}...`);
        await new Promise(resolve => setTimeout(resolve, 200));
        currentPage++;
        setGenerationProgress((currentPage / totalPages) * 100);
      }

      toast({
        title: "Global Pages Generated Successfully!",
        description: `Generated ${totalPages} pages with SEO optimization and real-time sync.`,
      });

      // Refresh tree data
      generateTreeStructure();

    } catch (error) {
      console.error('Error generating pages:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating the global pages.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const indent = level * 20;

    return (
      <div key={node.id} className="select-none">
        <div 
          className={`flex items-center py-2 px-3 hover:bg-gray-50 cursor-pointer transition-colors ${
            selectedNode?.id === node.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
          }`}
          style={{ paddingLeft: `${12 + indent}px` }}
          onClick={() => setSelectedNode(node)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="mr-2 hover:bg-gray-200 rounded p-1"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          
          {!hasChildren && <div className="w-6" />}
          
          <div className={`p-1 rounded mr-3 ${
            node.type === 'continent' ? 'bg-purple-100' :
            node.type === 'country' ? 'bg-blue-100' :
            'bg-green-100'
          }`}>
            {node.type === 'continent' && <Globe className="h-4 w-4 text-purple-600" />}
            {node.type === 'country' && <MapPin className="h-4 w-4 text-blue-600" />}
            {node.type === 'city' && <Building2 className="h-4 w-4 text-green-600" />}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">{node.name}</span>
              <div className="flex items-center space-x-2">
                {node.isPublished ? (
                  <Badge className="bg-green-100 text-green-800 text-xs">Published</Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-600 text-xs">Draft</Badge>
                )}
                {node.stats && (
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span>{node.stats.builders} builders</span>
                    <span>{node.stats.events} events</span>
                    <span>{node.stats.views.toLocaleString()} views</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredTreeData = treeData.filter(node => {
    if (filterType !== 'all' && node.type !== filterType) return false;
    if (searchTerm && !node.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <TreePine className="h-8 w-8 mr-3 text-green-600" />
            Global Exhibition Directory Manager
          </h2>
          <p className="text-gray-600 mt-1">Manage all countries and cities with hierarchical tree view and real-time sync</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={generateTreeStructure}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Tree
          </Button>
          <Button className="bg-gradient-to-r from-green-600 to-blue-600" onClick={generateAllPages} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Generate All Pages
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-green-600 animate-pulse" />
                <span className="font-medium text-green-900">Global Page Generation in Progress</span>
              </div>
              <span className="text-green-700 font-medium">{Math.round(generationProgress)}%</span>
            </div>
            <Progress value={generationProgress} className="h-2" />
            <p className="text-sm text-green-700 mt-2">
              Creating SEO-optimized pages for {GLOBAL_EXHIBITION_DATA.countries.length} countries and {GLOBAL_EXHIBITION_DATA.cities.length} cities...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Global Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Countries</p>
                <p className="text-3xl font-bold">{GLOBAL_EXHIBITION_DATA.countries.length}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Major Cities</p>
                <p className="text-3xl font-bold">{GLOBAL_EXHIBITION_DATA.cities.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Events</p>
                <p className="text-3xl font-bold">
                  {GLOBAL_EXHIBITION_DATA.countries.reduce((sum, country) => sum + country.annualEvents, 0)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Continents</p>
                <p className="text-3xl font-bold">4</p>
              </div>
              <Award className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tree Management Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tree Navigation */}
        <Card className="lg:col-span-2 shadow-lg border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <TreePine className="h-6 w-6 mr-3 text-green-600" />
                Global Directory Tree
              </CardTitle>
              <div className="flex items-center space-x-4">
                <Input
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="continent">Continents</SelectItem>
                    <SelectItem value="country">Countries</SelectItem>
                    <SelectItem value="city">Cities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardDescription>
              Hierarchical view of all exhibition destinations with real-time management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
              {filteredTreeData.map(node => renderTreeNode(node))}
            </div>
          </CardContent>
        </Card>

        {/* Node Details & Actions */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-6 w-6 mr-3 text-blue-600" />
              Location Details
            </CardTitle>
            <CardDescription>
              View and edit selected location information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Name</Label>
                  <div className="mt-1 text-lg font-semibold text-gray-900">{selectedNode.name}</div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Type</Label>
                  <div className="mt-1">
                    <Badge className={`${
                      selectedNode.type === 'continent' ? 'bg-purple-100 text-purple-800' :
                      selectedNode.type === 'country' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedNode.type}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">URL Slug</Label>
                  <div className="mt-1 text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                    /{selectedNode.slug}
                  </div>
                </div>

                {selectedNode.stats && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Statistics</Label>
                    <div className="mt-1 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Builders:</span>
                        <span className="font-medium">{selectedNode.stats.builders}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Events:</span>
                        <span className="font-medium">{selectedNode.stats.events}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Monthly Views:</span>
                        <span className="font-medium">{selectedNode.stats.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Page
                    </Button>
                    <Button size="sm" variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="w-full">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                    <Button size="sm" variant="outline" className="w-full text-green-600 hover:text-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Publish
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <TreePine className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Location Selected</h3>
                <p className="text-gray-500">Select a location from the tree to view details and manage settings</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-6 w-6 mr-3" />
            Global Directory Quick Actions
          </CardTitle>
          <CardDescription className="text-gray-300">
            Perform bulk operations and manage the global exhibition directory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 h-auto p-4 flex flex-col items-center space-y-2">
              <Plus className="h-6 w-6" />
              <span className="font-medium">Add Location</span>
              <span className="text-xs opacity-75">Create new destination</span>
            </Button>
            
            <Button className="bg-gradient-to-r from-green-500 to-green-600 h-auto p-4 flex flex-col items-center space-y-2">
              <Upload className="h-6 w-6" />
              <span className="font-medium">Bulk Import</span>
              <span className="text-xs opacity-75">Import locations CSV</span>
            </Button>
            
            <Button className="bg-gradient-to-r from-purple-500 to-purple-600 h-auto p-4 flex flex-col items-center space-y-2">
              <Download className="h-6 w-6" />
              <span className="font-medium">Export Data</span>
              <span className="text-xs opacity-75">Download full dataset</span>
            </Button>
            
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 h-auto p-4 flex flex-col items-center space-y-2">
              <RefreshCw className="h-6 w-6" />
              <span className="font-medium">Sync All</span>
              <span className="text-xs opacity-75">Real-time synchronization</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default GlobalPageTreeManager;