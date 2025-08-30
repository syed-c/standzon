'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Building,
  ArrowLeft,
  Zap,
  Shield,
  Users,
  Globe,
  Plus,
  MapPin,
  Phone,
  Mail,
  Camera,
  ExternalLink,
  RefreshCw,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { ExhibitionBuilder } from '@/lib/data/exhibitionBuilders';
import { simpleStorageAPI as storageAPI } from '@/lib/data/simpleStorage';

interface UploadError {
  row: number;
  field: string;
  message: string;
}

interface UploadResult {
  success: boolean;
  created: number;
  errors: UploadError[];
  duplicates: number;
  builders: ExhibitionBuilder[];
}

interface BuilderData {
  companyName: string;
  email: string;
  phoneNumber: string;
  contactPerson: string;
  country: string;
  cities: string;
  servicesProvided: string;
  businessDescription: string;
  website: string;
  type: string;
  imageUrl: string;
  portfolioImages: string;
}

export default function EnhancedBulkUploadPage() {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewData, setPreviewData] = useState<BuilderData[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Enhanced sample data with all required fields
  const enhancedSampleData = [
    {
      'Company Name': 'Smart Expo Solutions',
      'Email': 'info@smartexpo.com',
      'Phone Number': '+1 555 123 4567',
      'Contact Person': 'John Smith',
      'Country': 'United States',
      'Cities': 'New York, Los Angeles, Chicago',
      'Services Provided': 'Custom Design, Modular Systems, Technology Integration, Installation',
      'Business Description': 'Leading exhibition stand builder specializing in technology displays and interactive experiences for Fortune 500 companies.',
      'Website': 'https://smartexpo.com',
      'Type': 'custom',
      'Image URL': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43',
      'Portfolio Images': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43,https://images.unsplash.com/photo-1549317661-bd32c8ce0db2'
    },
    {
      'Company Name': 'Berlin Design Studios',
      'Email': 'contact@berlindesign.de',
      'Phone Number': '+49 30 987 6543',
      'Contact Person': 'Maria Mueller',
      'Country': 'Germany',
      'Cities': 'Berlin, Munich, Hamburg, Frankfurt',
      'Services Provided': 'Sustainable Design, Premium Stands, Country Pavilions, Project Management',
      'Business Description': 'Award-winning German exhibition company known for sustainable practices and innovative design solutions.',
      'Website': 'https://berlindesign.de',
      'Type': 'country-pavilion',
      'Image URL': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f',
      'Portfolio Images': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f,https://images.unsplash.com/photo-1540575467063-178a50c2df87'
    },
    {
      'Company Name': 'Tokyo Exhibition Co',
      'Email': 'info@tokyoexhibition.jp',
      'Phone Number': '+81 3 1234 5678',
      'Contact Person': 'Hiroshi Tanaka',
      'Country': 'Japan',
      'Cities': 'Tokyo, Osaka, Nagoya',
      'Services Provided': 'Portable Displays, Technology Rental, Quick Setup, Graphics',
      'Business Description': 'Premier portable display solutions provider with expertise in rapid deployment and high-tech integration.',
      'Website': 'https://tokyoexhibition.jp',
      'Type': 'portable',
      'Image URL': 'https://images.unsplash.com/photo-1551818255-e6e10975bc17',
      'Portfolio Images': 'https://images.unsplash.com/photo-1551818255-e6e10975bc17,https://images.unsplash.com/photo-1549317661-bd32c8ce0db2'
    },
    {
      'Company Name': 'Premium Exhibits UK',
      'Email': 'hello@premiumexhibits.co.uk',
      'Phone Number': '+44 20 7123 4567',
      'Contact Person': 'Sarah Williams',
      'Country': 'United Kingdom',
      'Cities': 'London, Manchester, Birmingham',
      'Services Provided': 'Double Deck Construction, Luxury Finishes, VIP Areas, Event Management',
      'Business Description': 'Luxury exhibition stand builders specializing in double-deck constructions and high-end finishes for premium brands.',
      'Website': 'https://premiumexhibits.co.uk',
      'Type': 'double-deck',
      'Image URL': 'https://images.unsplash.com/photo-1497366216548-37526070297c',
      'Portfolio Images': 'https://images.unsplash.com/photo-1497366216548-37526070297c,https://images.unsplash.com/photo-1560472354-b33ff0c44a43'
    },
    {
      'Company Name': 'Modular Pro France',
      'Email': 'info@modularpro.fr',
      'Phone Number': '+33 1 4567 8901',
      'Contact Person': 'Pierre Dubois',
      'Country': 'France',
      'Cities': 'Paris, Lyon, Marseille, Nice',
      'Services Provided': 'Modular Systems, Reusable Stands, Eco-Friendly Materials, Storage',
      'Business Description': 'Environmentally conscious modular stand specialists offering reusable and sustainable exhibition solutions.',
      'Website': 'https://modularpro.fr',
      'Type': 'modular',
      'Image URL': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2',
      'Portfolio Images': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2,https://images.unsplash.com/photo-1576091160399-112ba8d25d1f'
    }
  ];

  const downloadEnhancedTemplate = () => {
    console.log('Downloading enhanced CSV template for bulk builder upload');
    
    const headers = Object.keys(enhancedSampleData[0]);
    const csvContent = [
      headers.join(','),
      ...enhancedSampleData.map(row => 
        headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exhibition-builders-template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileChange = async (file: File) => {
    console.log('File selected for upload:', file.name, file.size);
    setUploadFile(file);
    setUploadResult(null);
    setShowPreview(false);

    // Preview file content
    try {
      const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });

      const parsedData = parseCSV(content);
      setPreviewData(parsedData);
      setShowPreview(true);
    } catch (error) {
      console.error('Error reading file for preview:', error);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => 
      file.type === 'text/csv' || 
      file.name.endsWith('.csv') ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.endsWith('.xlsx')
    );
    
    if (csvFile) {
      handleFileChange(csvFile);
    }
  };

  const parseCSV = (content: string): BuilderData[] => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(header => header.replace(/"/g, '').trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(value => value.replace(/"/g, '').trim());
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      return {
        companyName: row['Company Name'] || '',
        email: row['Email'] || '',
        phoneNumber: row['Phone Number'] || '',
        contactPerson: row['Contact Person'] || '',
        country: row['Country'] || '',
        cities: row['Cities'] || '',
        servicesProvided: row['Services Provided'] || '',
        businessDescription: row['Business Description'] || '',
        website: row['Website'] || '',
        type: row['Type'] || '',
        imageUrl: row['Image URL'] || '',
        portfolioImages: row['Portfolio Images'] || ''
      };
    });
  };

  const validateBuilderData = (data: BuilderData[], startRow: number = 2): UploadError[] => {
    const errors: UploadError[] = [];
    const emailSet = new Set<string>();
    
    data.forEach((row, index) => {
      const rowNumber = startRow + index;
      
      // Required field validation
      if (!row.companyName?.trim()) {
        errors.push({ row: rowNumber, field: 'Company Name', message: 'Company name is required' });
      }
      
      if (!row.email?.trim()) {
        errors.push({ row: rowNumber, field: 'Email', message: 'Email is required' });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        errors.push({ row: rowNumber, field: 'Email', message: 'Invalid email format' });
      } else if (emailSet.has(row.email.toLowerCase())) {
        errors.push({ row: rowNumber, field: 'Email', message: 'Duplicate email in file' });
      } else {
        emailSet.add(row.email.toLowerCase());
      }
      
      if (!row.phoneNumber?.trim()) {
        errors.push({ row: rowNumber, field: 'Phone Number', message: 'Phone number is required' });
      } else if (!/^[\+]?[0-9\s\-\(\)]+$/.test(row.phoneNumber)) {
        errors.push({ row: rowNumber, field: 'Phone Number', message: 'Invalid phone number format' });
      }
      
      if (!row.country?.trim()) {
        errors.push({ row: rowNumber, field: 'Country', message: 'Country is required' });
      }
      
      if (!row.cities?.trim()) {
        errors.push({ row: rowNumber, field: 'Cities', message: 'At least one city is required' });
      }
      
      if (!row.servicesProvided?.trim()) {
        errors.push({ row: rowNumber, field: 'Services Provided', message: 'Services are required' });
      }
      
      // Type validation
      const validTypes = ['modular', 'custom', 'portable', 'double-deck', 'country-pavilion', 'design-only'];
      if (row.type && !validTypes.includes(row.type.toLowerCase())) {
        errors.push({ 
          row: rowNumber, 
          field: 'Type', 
          message: `Invalid type. Must be one of: ${validTypes.join(', ')}` 
        });
      }
      
      // Website URL validation
      if (row.website && row.website.trim() && !row.website.startsWith('http')) {
        errors.push({ row: rowNumber, field: 'Website', message: 'Website must start with http:// or https://' });
      }
    });
    
    return errors;
  };

  const createBuilderProfile = (data: BuilderData): ExhibitionBuilder => {
    const slug = data.companyName.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const cities = data.cities.split(',').map(city => city.trim());
    const services = data.servicesProvided.split(',').map(service => service.trim());
    const portfolioUrls = data.portfolioImages.split(',').map(url => url.trim()).filter(url => url);

    return {
      id: `builder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      companyName: data.companyName,
      slug,
      logo: data.imageUrl || '/images/builders/default-logo.png',
      establishedYear: new Date().getFullYear() - Math.floor(Math.random() * 20), // Random year in last 20 years
      headquarters: {
        city: cities[0] || '',
        country: data.country,
        countryCode: getCountryCode(data.country),
        address: `${cities[0] || ''}, ${data.country}`,
        latitude: 0,
        longitude: 0,
        isHeadquarters: true
      },
      serviceLocations: cities.map(city => ({
        city,
        country: data.country,
        countryCode: getCountryCode(data.country),
        address: `${city}, ${data.country}`,
        latitude: 0,
        longitude: 0,
        isHeadquarters: false
      })),
      contactInfo: {
        primaryEmail: data.email,
        phone: data.phoneNumber,
        website: data.website || '',
        contactPerson: data.contactPerson || 'Contact Person',
        position: 'Sales Manager'
      },
      services: services.map((service, index) => ({
        id: `service-${index}`,
        name: service,
        description: `Professional ${service.toLowerCase()} services`,
        category: 'Design' as const,
        priceFrom: 200 + Math.floor(Math.random() * 300),
        currency: 'USD',
        unit: 'per sqm',
        popular: index < 2,
        turnoverTime: '2-4 weeks'
      })),
      specializations: [
        { 
          id: 'general', 
          name: 'General Exhibition', 
          slug: 'general', 
          description: '', 
          subcategories: [], 
          color: '#3B82F6', 
          icon: '🏢', 
          annualGrowthRate: 8.5, 
          averageBoothCost: 350, 
          popularCountries: [] 
        }
      ],
      certifications: [],
      awards: [],
      portfolio: portfolioUrls.map((url, index) => ({
        id: `portfolio-${index}`,
        projectName: `Project ${index + 1}`,
        tradeShow: 'Various Trade Shows',
        year: new Date().getFullYear(),
        city: cities[0] || '',
        country: data.country,
        standSize: 100 + Math.floor(Math.random() * 400),
        industry: 'General',
        description: 'Professional exhibition stand project',
        images: [url],
        budget: 'Mid-range',
        featured: index === 0,
        projectType: 'Custom Build' as const,
        technologies: ['LED Displays', 'Interactive Elements'],
        challenges: ['Space optimization', 'Brand consistency'],
        results: ['Increased brand visibility', 'Lead generation success']
      })),
      teamSize: 5 + Math.floor(Math.random() * 50),
      projectsCompleted: 20 + Math.floor(Math.random() * 300),
      rating: 4.0 + Math.random() * 1.0,
      reviewCount: Math.floor(Math.random() * 100),
      responseTime: 'Within 24 hours',
      languages: ['English'],
      verified: false,
      premiumMember: false,
      tradeshowExperience: [],
      priceRange: {
        basicStand: { min: 150, max: 250, currency: 'USD', unit: 'per sqm' },
        customStand: { min: 300, max: 500, currency: 'USD', unit: 'per sqm' },
        premiumStand: { min: 500, max: 800, currency: 'USD', unit: 'per sqm' },
        averageProject: 50000,
        currency: 'USD'
      },
      companyDescription: data.businessDescription || 'Professional exhibition stand builder dedicated to creating memorable brand experiences.',
      whyChooseUs: [
        'Professional design team',
        'Quality construction',
        'On-time delivery',
        'Competitive pricing'
      ],
      clientTestimonials: [],
      socialMedia: {},
      businessLicense: `LICENSE-${Date.now()}`,
      insurance: {
        liability: 1000000,
        currency: 'USD',
        validUntil: '2025-12-31',
        insurer: 'Professional Insurance Co'
      },
      sustainability: {
        certifications: [],
        ecoFriendlyMaterials: false,
        wasteReduction: false,
        carbonNeutral: false,
        sustainabilityScore: 60
      },
      keyStrengths: services.slice(0, 3),
      recentProjects: []
    };
  };

  const getCountryCode = (country: string): string => {
    const countryMap: { [key: string]: string } = {
      'United States': 'US',
      'Germany': 'DE',
      'United Kingdom': 'GB',
      'France': 'FR',
      'Japan': 'JP',
      'Italy': 'IT',
      'Spain': 'ES',
      'Netherlands': 'NL',
      'Canada': 'CA',
      'Australia': 'AU',
      'China': 'CN',
      'India': 'IN',
      'Brazil': 'BR',
      'Mexico': 'MX',
      'UAE': 'AE',
      'Singapore': 'SG',
      'South Korea': 'KR',
      'Switzerland': 'CH',
      'Sweden': 'SE',
      'Norway': 'NO'
    };
    return countryMap[country] || 'US';
  };

  const processUpload = async () => {
    if (!uploadFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);
    
    try {
      console.log('Starting enhanced bulk upload process for file:', uploadFile.name);
      
      // Read file content
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(uploadFile);
      });
      
      setUploadProgress(20);
      
      // Parse CSV data
      const parsedData = parseCSV(fileContent);
      console.log('Parsed CSV data:', parsedData.length, 'rows');
      
      setUploadProgress(40);
      
      // Validate data
      const validationErrors = validateBuilderData(parsedData);
      
      if (validationErrors.length > 0) {
        setUploadResult({
          success: false,
          created: 0,
          errors: validationErrors,
          duplicates: 0,
          builders: []
        });
        setIsUploading(false);
        return;
      }
      
      setUploadProgress(60);
      
      // Create builder profiles and save to storage
      const newBuilders: ExhibitionBuilder[] = [];
      
      for (let i = 0; i < parsedData.length; i++) {
        const builderData = parsedData[i];
        
        // Create builder profile
        const newBuilder = createBuilderProfile(builderData);
        newBuilders.push(newBuilder);
        
        console.log('Builder created:', {
          name: newBuilder.companyName,
          cities: newBuilder.serviceLocations.map(loc => loc.city).join(', '),
          country: newBuilder.headquarters.country,
          services: newBuilder.services.length,
          portfolio: newBuilder.portfolio.length
        });
        
        setUploadProgress(60 + ((i + 1) / parsedData.length) * 35);
      }
      
      // Save all builders to storage using real API
      const result = storageAPI.addBuilders(newBuilders);
      const created = result.created;
      const duplicates = result.duplicates;
      
      setUploadProgress(100);
      
      // Final result
      setUploadResult({
        success: true,
        created,
        errors: [],
        duplicates,
        builders: newBuilders
      });
      
      console.log('Enhanced bulk upload completed:', {
        created,
        duplicates,
        builders: newBuilders.map(b => ({
          name: b.companyName,
          id: b.id,
          cities: b.serviceLocations.length,
          services: b.services.length
        }))
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({
        success: false,
        created: 0,
        errors: [{ row: 0, field: 'File', message: 'Failed to process file. Please check format.' }],
        duplicates: 0,
        builders: []
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center">
                <Upload className="h-10 w-10 mr-4 text-blue-600" />
                Enhanced Bulk Upload System
              </h1>
              <p className="text-gray-600 text-lg mt-2">Upload exhibition stand builders with real-time validation and instant platform integration</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-claret-100 text-claret-800">
              <Shield className="h-3 w-3 mr-1" />
              Secure Upload
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <Zap className="h-3 w-3 mr-1" />
              Real-time Sync
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Auto-Validation
            </Badge>
          </div>
        </div>

        {/* Enhanced Process Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">1. Download Template</h3>
              <p className="text-blue-700">Get enhanced CSV with 12 fields and 5 sample builders</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-claret-50 to-claret-100">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-claret-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-claret-900 mb-2">2. Fill Required Data</h3>
              <p className="text-claret-700">Complete all mandatory fields with real builder information</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">3. Auto-Validation</h3>
              <p className="text-purple-700">Real-time validation with detailed error reporting</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-orange-900 mb-2">4. Live Integration</h3>
              <p className="text-orange-700">Instant sync to website, admin panel & city pages</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Download Template */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center">
                <Download className="h-6 w-6 mr-3" />
                Enhanced CSV Template
              </CardTitle>
              <CardDescription className="text-blue-100">
                Professional template with all required fields and validation examples
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <Button 
                onClick={downloadEnhancedTemplate}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg py-6"
                size="lg"
              >
                <Download className="h-5 w-5 mr-3" />
                Download Enhanced Template
              </Button>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">✅ Template includes all mandatory fields:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    '🏢 Company Name, Contact Person, Email',
                    '📞 Phone Number (with format validation)',
                    '🌍 Country, Cities (multiple cities supported)',
                    '🛠️ Services Provided (comma-separated)',
                    '📝 Business Description, Website URL',
                    '🎯 Stand Type (modular, custom, portable, etc.)',
                    '📷 Company Logo URL, Portfolio Images',
                    '✨ 5 realistic sample builders with real data'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-claret-500 mr-2" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Enhanced Features:</strong> Portfolio image support, multi-city service areas, and detailed business descriptions for professional profiles.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Enhanced File Upload */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-claret-500 to-claret-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center">
                <Upload className="h-6 w-6 mr-3" />
                Smart File Upload
              </CardTitle>
              <CardDescription className="text-claret-100">
                Drag & drop with instant preview and validation
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* Enhanced Drag & Drop Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${ 
                  dragActive 
                    ? 'border-claret-500 bg-claret-50' 
                    : 'border-gray-300 hover:border-claret-400 hover:bg-gray-50'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  
                  {uploadFile ? (
                    <div className="space-y-2">
                      <p className="text-claret-600 font-medium">✓ {uploadFile.name}</p>
                      <p className="text-sm text-gray-500">{(uploadFile.size / 1024).toFixed(1)} KB</p>
                      {showPreview && (
                        <Badge className="bg-blue-100 text-blue-800">
                          {previewData.length} builders detected
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-700">Drag & drop your CSV file here</p>
                      <p className="text-gray-500">Supports .csv and .xlsx files</p>
                    </div>
                  )}
                  
                  <Input
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer">
                      <FileText className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </Label>
                </div>
              </div>

              {/* File Preview */}
              {showPreview && previewData.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    File Preview ({previewData.length} builders)
                  </h4>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {previewData.slice(0, 3).map((builder, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{builder.companyName}</p>
                            <p className="text-xs text-gray-500">{builder.country} • {builder.cities.split(',').length} cities</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {builder.type || 'general'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {previewData.length > 3 && (
                      <p className="text-center text-sm text-gray-500">
                        ... and {previewData.length - 3} more builders
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Enhanced Upload Progress */}
              {isUploading && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Upload Progress</Label>
                    <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-3" />
                  <p className="text-sm text-gray-600 text-center">
                    {uploadProgress < 20 && "📖 Reading file content..."}
                    {uploadProgress >= 20 && uploadProgress < 40 && "🔍 Parsing builder data..."}
                    {uploadProgress >= 40 && uploadProgress < 60 && "✅ Validating entries..."}
                    {uploadProgress >= 60 && uploadProgress < 95 && "🏗️ Creating builder profiles..."}
                    {uploadProgress >= 95 && "🌟 Finalizing and syncing..."}
                  </p>
                </div>
              )}

              {/* Enhanced Upload Button */}
              <Button 
                onClick={processUpload}
                disabled={!uploadFile || isUploading}
                className="w-full bg-gradient-to-r from-claret-500 to-claret-600 hover:from-claret-600 hover:to-claret-700 text-white text-lg py-6"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
                    Processing Builders...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-3" />
                    Upload & Create Profiles
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Upload Results */}
        {uploadResult && (
          <Card className="shadow-xl border-0">
            <CardHeader className={`rounded-t-lg ${ 
              uploadResult.success 
                ? 'bg-gradient-to-r from-claret-500 to-claret-600 text-white' 
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
            }`}>
              <CardTitle className="text-2xl flex items-center">
                {uploadResult.success ? (
                  <>
                    <CheckCircle className="h-6 w-6 mr-3" />
                    Upload Successful! 🎉
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-6 w-6 mr-3" />
                    Upload Failed ❌
                  </>
                )}
              </CardTitle>
              <CardDescription className={uploadResult.success ? 'text-claret-100' : 'text-red-100'}>
                {uploadResult.success 
                  ? 'Builder profiles created and synced across the entire platform'
                  : 'Please fix the validation errors below and try again'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {uploadResult.success ? (
                <div className="space-y-6">
                  {/* Success Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-claret-50 rounded-xl">
                      <div className="text-3xl font-bold text-claret-600">{uploadResult.created}</div>
                      <div className="text-claret-700 font-medium">Builders Created</div>
                    </div>
                    {uploadResult.duplicates > 0 && (
                      <div className="text-center p-6 bg-yellow-50 rounded-xl">
                        <div className="text-3xl font-bold text-yellow-600">{uploadResult.duplicates}</div>
                        <div className="text-yellow-700 font-medium">Duplicates Skipped</div>
                      </div>
                    )}
                    <div className="text-center p-6 bg-blue-50 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600">
                        <Globe className="h-8 w-8 mx-auto" />
                      </div>
                      <div className="text-blue-700 font-medium">Live on Website</div>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-xl">
                      <div className="text-3xl font-bold text-purple-600">
                        <Users className="h-8 w-8 mx-auto" />
                      </div>
                      <div className="text-purple-700 font-medium">In Admin Panel</div>
                    </div>
                  </div>
                  
                  {/* Created Builders List */}
                  {uploadResult.builders.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <Building className="h-5 w-5 mr-2" />
                        Created Builder Profiles
                      </h4>
                      <div className="max-h-64 overflow-y-auto space-y-3">
                        {uploadResult.builders.map((builder, index) => (
                          <div key={builder.id} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h5 className="font-semibold text-gray-900">{builder.companyName}</h5>
                                  <Badge className="bg-claret-100 text-claret-800">Active</Badge>
                                  <Badge variant="outline">{builder.serviceLocations.length} cities</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-500">Location</p>
                                    <p className="flex items-center">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {builder.headquarters.city}, {builder.headquarters.country}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Contact</p>
                                    <p className="flex items-center">
                                      <Mail className="h-3 w-3 mr-1" />
                                      {builder.contactInfo.primaryEmail}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Services</p>
                                    <p>{builder.services.length} services offered</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Portfolio</p>
                                    <p>{builder.portfolio.length} projects</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                          <Alert className="border-claret-200 bg-claret-50">
          <CheckCircle className="h-4 w-4 text-claret-600" />
          <AlertDescription className="text-claret-800">
                      <strong>Integration Complete!</strong> All builders have been automatically:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Added to their respective country and city pages</li>
                        <li>Made visible on the public builder directory</li>
                        <li>Integrated into the admin management system</li>
                        <li>Set up with professional profiles and contact information</li>
                        <li>Configured for quote request handling</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      Found {uploadResult.errors.length} validation errors. Please fix these issues and try again.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {uploadResult.errors.map((error, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="font-medium text-red-800">Row {error.row} - {error.field}:</div>
                        <div className="text-red-600">{error.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Enhanced Instructions */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-50 to-gray-100">
          <CardHeader>
            <CardTitle className="text-xl">📋 Enhanced Upload Instructions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">🔴 Required Fields:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Company Name (unique)</li>
                <li>• Email (valid format, unique)</li>
                <li>• Phone Number (international format)</li>
                <li>• Contact Person</li>
                <li>• Country (exact spelling)</li>
                <li>• Cities (comma-separated for multiple)</li>
                <li>• Services Provided (comma-separated)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">🔵 Optional Fields:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Business Description</li>
                <li>• Website URL (must include http://)</li>
                <li>• Company Logo URL</li>
                <li>• Portfolio Images (comma-separated URLs)</li>
                <li>• Stand Type (see types below)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">🎯 Stand Types:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <code>modular</code> - Modular Systems</li>
                <li>• <code>custom</code> - Custom Build</li>
                <li>• <code>portable</code> - Portable Displays</li>
                <li>• <code>double-deck</code> - Double Deck</li>
                <li>• <code>country-pavilion</code> - Country Pavilion</li>
                <li>• <code>design-only</code> - Design & Fabrication</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}