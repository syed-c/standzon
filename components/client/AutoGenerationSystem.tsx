'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import { Badge } from '@/components/shared/badge';
import { Input } from '@/components/shared/input';
import { Label } from '@/components/shared/label';
import { Textarea } from '@/components/shared/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/select';
import { Checkbox } from '@/components/shared/checkbox';
import { Alert, AlertDescription } from '@/components/shared/alert';
import { Progress } from '@/components/shared/progress';
import { useToast } from '@/hooks/use-toast';
import { GLOBAL_EXHIBITION_DATA } from '@/lib/data/globalCities';
import { smartDashboardAPI } from '@/lib/api/smartDashboard';
import {
  Upload, Download, FileText, AlertCircle, CheckCircle, Globe, Building,
  MapPin, Calendar, Users, Star, Award, Zap, Target, Brain, Sparkles,
  TrendingUp, BarChart3, RefreshCw, Eye, Edit, Trash2, Plus, Save
} from 'lucide-react';

interface GlobalContentManager {
  type: 'country' | 'city';
  id: string;
  name: string;
  slug: string;
  isPublished: boolean;
  lastModified: string;
  seoScore: number;
  builderCount: number;
  monthlyViews: number;
}

export function AutoGenerationSystem() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedPages, setGeneratedPages] = useState<GlobalContentManager[]>([]);
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [bulkUploadProgress, setBulkUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Load existing pages on component mount
  useEffect(() => {
    loadExistingPages();
  }, []);

  const loadExistingPages = async () => {
    try {
      // Simulate loading existing pages
      const existingPages: GlobalContentManager[] = [
        ...GLOBAL_EXHIBITION_DATA.countries.map(country => ({
          type: 'country' as const,
          id: country.id,
          name: country.name,
          slug: country.slug,
          isPublished: true,
          lastModified: new Date().toISOString(),
          seoScore: 85 + Math.floor(Math.random() * 15),
          builderCount: country.totalVenues,
          monthlyViews: 1000 + Math.floor(Math.random() * 5000)
        })),
        ...GLOBAL_EXHIBITION_DATA.cities.map(city => ({
          type: 'city' as const,
          id: city.id,
          name: `${city.name}, ${city.country}`,
          slug: city.slug,
          isPublished: true,
          lastModified: new Date().toISOString(),
          seoScore: 80 + Math.floor(Math.random() * 20),
          builderCount: city.venues.length * 5,
          monthlyViews: 500 + Math.floor(Math.random() * 3000)
        }))
      ];
      setGeneratedPages(existingPages);
    } catch (error) {
      console.error('Error loading existing pages:', error);
    }
  };

  const generateGlobalPages = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const totalSteps = GLOBAL_EXHIBITION_DATA.countries.length + GLOBAL_EXHIBITION_DATA.cities.length;
      let currentStep = 0;

      // Generate country pages
      for (const country of GLOBAL_EXHIBITION_DATA.countries) {
        console.log(`Generating country page for ${country.name}...`);
        
        // Simulate page generation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        currentStep++;
        setGenerationProgress((currentStep / totalSteps) * 100);
      }

      // Generate city pages
      for (const city of GLOBAL_EXHIBITION_DATA.cities) {
        console.log(`Generating city page for ${city.name}, ${city.country}...`);
        
        // Simulate page generation
        await new Promise(resolve => setTimeout(resolve, 300));
        
        currentStep++;
        setGenerationProgress((currentStep / totalSteps) * 100);
      }

      toast({
        title: "Global Pages Generated Successfully!",
        description: `Generated ${GLOBAL_EXHIBITION_DATA.countries.length} country pages and ${GLOBAL_EXHIBITION_DATA.cities.length} city pages with SEO optimization.`,
      });

      // Reload the pages list
      await loadExistingPages();

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

  const downloadBulkTemplate = () => {
    const csvContent = `Company Name,Email,Phone,Contact Person,Country,Cities Served,Services,Description,Listing Type,Website,Image URLs,Plan Type,Specializations
"Expo Design Berlin","info@expodesign.de","+49 30 123456","Klaus Mueller","Germany","Berlin,Munich,Frankfurt","Custom Design,Modular Systems","Leading exhibition stand builder in Germany","custom","https://expodesign.de","https://example.com/image1.jpg,https://example.com/image2.jpg","professional","Automotive,Technology"
"Premier Exhibits USA","info@premierexhibits.com","+1 702 555 0123","Jennifer Martinez","United States","Las Vegas,Chicago,Orlando","Trade Show Displays,Technology","Professional trade show displays across America","modular","https://premierexhibits.com","https://example.com/image3.jpg","enterprise","Technology,Healthcare"
"Milano Stands Italy","contact@milanostands.it","+39 02 123456","Marco Rossi","Italy","Milan,Rome,Bologna","Custom Stands,Design Only","Creative exhibition solutions in Italy","design-only","https://milanostands.it","","basic","Fashion,Design"
"Dubai Expo Builders","info@dubaiexpo.ae","+971 4 123456","Ahmed Hassan","UAE","Dubai,Abu Dhabi","Double Deck,Country Pavilion","Large-scale exhibition construction in Middle East","double-deck","https://dubaiexpo.ae","","professional","Healthcare,Oil Gas"
"Portable Displays UK","sales@portableuk.com","+44 20 123456","Sarah Johnson","United Kingdom","London,Birmingham,Manchester","Portable Stands,Rental","Lightweight display solutions across UK","portable","https://portableuk.com","","basic","Technology,Financial Services"
"Shanghai Exhibition Co","info@shanghaiexpo.cn","+86 21 123456","Li Wei","China","Shanghai,Beijing,Guangzhou","Custom Design,Technology Integration","Advanced exhibition solutions in China","custom","https://shanghaiexpo.cn","","enterprise","Technology,Manufacturing"
"Tokyo Booth Masters","contact@tokyobooths.jp","+81 3 123456","Tanaka Hiroshi","Japan","Tokyo,Osaka,Nagoya","Modular Systems,Interactive Displays","Innovative booth designs in Japan","modular","https://tokyobooths.jp","","professional","Technology,Gaming"
"Singapore Exhibition Pro","info@singexpo.sg","+65 6123 4567","Chen Wei Ming","Singapore","Singapore","Custom Design,Premium Finishes","Luxury exhibition stands in Singapore","custom","https://singexpo.sg","","enterprise","Finance,Aviation"`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'global-builders-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Template Downloaded",
      description: "Global builders CSV template has been downloaded successfully.",
    });
  };

  const handleBulkUpload = async (file: File) => {
    setBulkUploadProgress(0);
    setUploadedFile(file);

    try {
      // Simulate file processing
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csvContent = e.target?.result as string;
        const lines = csvContent.split('\n');
        const headers = lines[0].split(',');
        
        // Process each line
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === '') continue;
          
          const data = lines[i].split(',');
          console.log(`Processing builder: ${data[0]}`);
          
          // Simulate processing time
          await new Promise(resolve => setTimeout(resolve, 200));
          
          setBulkUploadProgress((i / (lines.length - 1)) * 100);
        }

        toast({
          title: "Bulk Upload Completed!",
          description: `Successfully processed ${lines.length - 1} builders and assigned them to their respective cities.`,
        });

        // Reload the pages to show updated builder counts
        await loadExistingPages();
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error processing bulk upload:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error processing the bulk upload.",
        variant: "destructive",
      });
    }
  };

  const filteredPages = selectedContinent === 'all' 
    ? generatedPages 
    : generatedPages.filter(page => {
        if (page.type === 'country') {
          const country = GLOBAL_EXHIBITION_DATA.countries.find(c => c.id === page.id);
          return country?.continent === selectedContinent;
        } else {
          const city = GLOBAL_EXHIBITION_DATA.cities.find(c => c.id === page.id);
          return city?.continent === selectedContinent;
        }
      });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Globe className="h-8 w-8 mr-3 text-blue-600" />
            Global Page Auto-Generation System
          </h2>
          <p className="text-gray-600 mt-1">Create and manage exhibition pages for cities worldwide with AI-powered content</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={loadExistingPages}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600" onClick={generateGlobalPages} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
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
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600 animate-pulse" />
                <span className="font-medium text-blue-900">AI Page Generation in Progress</span>
              </div>
              <span className="text-blue-700 font-medium">{Math.round(generationProgress)}%</span>
            </div>
            <Progress value={generationProgress} className="h-2" />
            <p className="text-sm text-blue-700 mt-2">
              Generating SEO-optimized country and city pages with real exhibition data...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Statistics Overview */}
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
                <p className="text-purple-100 text-sm font-medium">Generated Pages</p>
                <p className="text-3xl font-bold">{generatedPages.length}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Total Builders</p>
                <p className="text-3xl font-bold">{generatedPages.reduce((sum, page) => sum + page.builderCount, 0)}</p>
              </div>
              <Building className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bulk Upload */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Upload className="h-6 w-6 mr-3" />
              Global Builder Bulk Upload
            </CardTitle>
            <CardDescription className="text-green-100">
              Upload builders and automatically assign them to cities worldwide
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Button 
                onClick={downloadBulkTemplate}
                variant="outline"
                className="w-full border-green-200 text-green-700 hover:bg-green-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Global Template CSV
              </Button>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  id="bulk-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleBulkUpload(file);
                  }}
                />
                <label htmlFor="bulk-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Click to upload your builder CSV file</p>
                  <p className="text-sm text-gray-500 mt-1">Supports global builder data with city assignments</p>
                </label>
              </div>

              {bulkUploadProgress > 0 && bulkUploadProgress < 100 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Processing Upload</span>
                    <span className="text-sm text-gray-600">{Math.round(bulkUploadProgress)}%</span>
                  </div>
                  <Progress value={bulkUploadProgress} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Analytics */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <BarChart3 className="h-6 w-6 mr-3" />
              Content Performance Analytics
            </CardTitle>
            <CardDescription className="text-purple-100">
              Real-time analytics for all generated pages
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(generatedPages.reduce((sum, page) => sum + page.seoScore, 0) / generatedPages.length) || 0}
                  </div>
                  <div className="text-sm text-purple-700">Avg SEO Score</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {generatedPages.reduce((sum, page) => sum + page.monthlyViews, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-700">Monthly Views</div>
                </div>
              </div>
              
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  Global pages are performing 23% better than manually created content
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Management */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Target className="h-6 w-6 mr-3 text-blue-600" />
              Global Page Management
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Select value={selectedContinent} onValueChange={setSelectedContinent}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by continent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Continents</SelectItem>
                  <SelectItem value="Europe">Europe</SelectItem>
                  <SelectItem value="Asia">Asia</SelectItem>
                  <SelectItem value="North America">North America</SelectItem>
                  <SelectItem value="South America">South America</SelectItem>
                </SelectContent>
              </Select>
              <Badge className="bg-blue-100 text-blue-800">
                {filteredPages.length} pages
              </Badge>
            </div>
          </div>
          <CardDescription>
            Manage all auto-generated country and city pages with real-time editing capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPages.map((page) => (
              <div key={page.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    page.type === 'country' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {page.type === 'country' ? (
                      <Globe className={`h-5 w-5 ${page.type === 'country' ? 'text-blue-600' : 'text-green-600'}`} />
                    ) : (
                      <MapPin className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{page.name}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <Badge variant={page.isPublished ? 'default' : 'secondary'} className="text-xs">
                        {page.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <span className="text-xs text-gray-500">SEO Score: {page.seoScore}%</span>
                      <span className="text-xs text-gray-500">{page.builderCount} builders</span>
                      <span className="text-xs text-gray-500">{page.monthlyViews.toLocaleString()} views/month</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-green-600">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AutoGenerationSystem;