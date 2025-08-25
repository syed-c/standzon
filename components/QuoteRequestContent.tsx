"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { tradeShows } from '@/lib/data/tradeShows';
import { realExhibitions } from '@/lib/data/realExhibitions';
import { GLOBAL_EXHIBITION_DATA } from '@/lib/data/globalCities';
import { exhibitionBuilders, BuilderMatchingService } from '@/lib/data/exhibitionBuilders';
import { FiCheckCircle, FiUsers, FiCalendar, FiMapPin, FiDollarSign, FiSend, FiStar, FiArrowRight, FiInfo, FiUpload, FiX, FiFile } from 'react-icons/fi';
import { COUNTRY_CODES } from '@/lib/data/countryCodes';

interface QuoteFormData {
  // Event Information
  country: string;
  city: string;
  tradeShow: string;
  customTradeShowName: string;
  isCustomTradeShow: boolean;
  standSize: number;
  budget: string;
  timeline: string;
  
  // Company Information
  companyName: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  countryCode: string; // Added country code field
  industry: string;
  
  // Requirements
  standType: string[];
  specialRequests: string;
  hasExistingDesign: boolean;
  needsStorageAfter: boolean;
  needsInstallation: boolean;
  needsTransportation: boolean;
  
  // Additional Services
  needsAVEquipment: boolean;
  needsLighting: boolean;
  needsFurniture: boolean;
  needsGraphics: boolean;

  // File uploads
  designFiles: File[];
}

export default function QuoteRequestContent() {
  console.log("Quote Request: Page loaded");

  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  const [formData, setFormData] = useState<QuoteFormData>({
    country: '',
    city: '',
    tradeShow: '',
    customTradeShowName: '',
    isCustomTradeShow: false,
    standSize: 50,
    budget: '',
    timeline: '',
    companyName: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    countryCode: '+1', // Default to US country code
    industry: '',
    standType: [],
    specialRequests: '',
    hasExistingDesign: false,
    needsStorageAfter: false,
    needsInstallation: true,
    needsTransportation: false,
    needsAVEquipment: false,
    needsLighting: true,
    needsFurniture: false,
    needsGraphics: true,
    designFiles: []
  });

  // Get matched builders based on current form data
  const matchedBuilders = useMemo(() => {
    if (!formData.tradeShow && !formData.isCustomTradeShow) return [];
    
    const selectedShow = realExhibitions.find(show => show.slug === formData.tradeShow);
    if (!selectedShow && !formData.isCustomTradeShow) return [];

    return BuilderMatchingService.matchBuildersForQuote({
      tradeShowSlug: formData.tradeShow,
      standSize: formData.standSize,
      budget: formData.budget
    });
  }, [formData.tradeShow, formData.isCustomTradeShow, formData.standSize, formData.budget]);

  // Get available cities based on selected country - FIXED LOGIC
  const getAvailableCities = useMemo(() => {
    if (!formData.country) return [];
    
    console.log('🌍 Getting cities for country:', formData.country);
    
    // Get cities from GLOBAL_EXHIBITION_DATA
    const citiesFromGlobalData = GLOBAL_EXHIBITION_DATA.cities.filter(
      city => city.country === formData.country
    );
    
    console.log('📍 Found cities from global data:', citiesFromGlobalData.length);
    
    // Get cities from exhibitions data as backup
    const citiesFromExhibitions = realExhibitions
      .filter(exhibition => exhibition.country === formData.country)
      .map(exhibition => exhibition.city);
    
    // Combine and deduplicate
    const allCityNames = [
      ...citiesFromGlobalData.map(city => city.name),
      ...citiesFromExhibitions
    ];
    
    const uniqueCities = Array.from(new Set(allCityNames)).sort();
    console.log('🏙️ Final unique cities:', uniqueCities);
    
    return uniqueCities;
  }, [formData.country]);

  // Get available trade shows based on selected city
  const getAvailableTradeShows = useMemo(() => {
    if (!formData.city) return [];
    
    return realExhibitions.filter(exhibition => 
      exhibition.city === formData.city && exhibition.country === formData.country
    );
  }, [formData.city, formData.country]);

  const updateFormData = (field: keyof QuoteFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayUpdate = (field: keyof QuoteFormData, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }));
  };

  const handleCountryChange = (value: string) => {
    console.log('🌍 Country changed to:', value);
    setFormData(prev => ({
      ...prev,
      country: value,
      city: '', // Reset city when country changes
      tradeShow: '', // Reset trade show when country changes
      customTradeShowName: '',
      isCustomTradeShow: false
    }));
  };

  const handleCityChange = (value: string) => {
    console.log('🏙️ City changed to:', value);
    setFormData(prev => ({
      ...prev,
      city: value,
      tradeShow: '', // Reset trade show when city changes
      customTradeShowName: '',
      isCustomTradeShow: false
    }));
  };

  const handleTradeShowChange = (value: string) => {
    if (value === 'not-listed') {
      setFormData(prev => ({
        ...prev,
        tradeShow: '',
        isCustomTradeShow: true,
        customTradeShowName: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        tradeShow: value,
        isCustomTradeShow: false,
        customTradeShowName: ''
      }));
    }
  };

  // File upload handling
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadError('');
    
    // Validate file types
    const allowedTypes = ['application/pdf', 'application/zip', 'image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB per file
    
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        setUploadError(`File ${file.name} is not supported. Please upload PDF, ZIP, JPG, or PNG files only.`);
        return false;
      }
      if (file.size > maxSize) {
        setUploadError(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        designFiles: [...prev.designFiles, ...validFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      designFiles: prev.designFiles.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    console.log("Submitting quote request:", formData);
    
    try {
      // Get trade show details for city and country
      const selectedShow = realExhibitions.find(show => show.slug === formData.tradeShow);
      const tradeShowName = formData.isCustomTradeShow ? 
        formData.customTradeShowName : 
        (selectedShow?.name || formData.tradeShow);
      
      // Prepare form data for submission
      const submissionData = {
        // Contact Information
        companyName: formData.companyName,
        contactPerson: formData.contactPerson,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        
        // Event Information  
        exhibitionName: tradeShowName,
        eventDate: selectedShow?.startDate,
        venue: selectedShow?.venue?.name || 'TBD',
        city: formData.city,
        country: formData.country,
        location: { city: formData.city, country: formData.country },
        isCustomTradeShow: formData.isCustomTradeShow,
        
        // Stand Requirements
        standSize: formData.standSize,
        budget: formData.budget, // This will now be properly saved
        timeline: formData.timeline,
        standType: formData.standType,
        
        // Additional Requirements
        message: formData.specialRequests,
        needsInstallation: formData.needsInstallation,
        needsTransportation: formData.needsTransportation,
        needsStorage: formData.needsStorageAfter,
        needsAVEquipment: formData.needsAVEquipment,
        needsLighting: formData.needsLighting,
        needsFurniture: formData.needsFurniture,
        needsGraphics: formData.needsGraphics,
        hasExistingDesign: formData.hasExistingDesign,
        
        // File attachments info
        designFilesCount: formData.designFiles.length,
        designFileNames: formData.designFiles.map(f => f.name),
        
        // Source tracking
        source: 'website_quote_form',
        utmSource: 'organic',
        utmMedium: 'website'
      };

      console.log('📤 Submitting enhanced quote data:', submissionData);
      
      // Submit to the API endpoint
      const response = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Quote submitted successfully:', result);
        setShowMatches(true);
      } else {
        throw new Error(result.message || 'Submission failed');
      }
      
    } catch (error) {
      console.error('❌ Quote submission failed:', error);
      alert('Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Test function for debugging
  const handleTestSubmit = async () => {
    console.log('🧪 Testing lead submission with sample data...');
    
    const testData = {
      companyName: 'Test Company Ltd',
      fullName: 'John Test',
      email: 'test@example.com',
      phone: '+1234567890',
      exhibitionName: 'Test Exhibition',
      city: 'Dubai',
      country: 'United Arab Emirates',
      boothSize: 50,
      projectBudget: '25k-50k',
      message: 'Test submission from location page',
      source: 'location_page_test'
    };

    try {
      const response = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      
      const result = await response.json();
      console.log('🧪 Test submission result:', result);
      
      if (result.success) {
        alert(`✅ Test successful! ${result.data.matchingBuilders} builders found for ${testData.city}, ${testData.country}`);
      } else {
        alert(`❌ Test failed: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Test submission error:', error);
      alert('Test submission failed');
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        const hasValidTradeShow = formData.tradeShow !== '' || 
          (formData.isCustomTradeShow && formData.customTradeShowName.trim() !== '');
        return formData.country !== '' && formData.city !== '' && 
               hasValidTradeShow && formData.standSize > 0 && formData.budget !== '';
      case 2:
        return formData.companyName !== '' && formData.contactPerson !== '' && 
               formData.contactEmail !== '' && formData.contactPhone !== '';
      case 3:
        return formData.standType.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (showMatches) {
    return (
      <div className="font-inter min-h-screen bg-gray-50">
        <Navigation />
        
        <section className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
                🎉 Quote Request Submitted Successfully!
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Your request has been sent to {matchedBuilders.length} verified exhibition stand builders in {formData.city}, {formData.country}. Here's what happens next:
              </p>
              
              <Card className="bg-blue-50 border-blue-200 mb-8">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4 text-center mb-6">
                      <div>
                        <FiCalendar className="w-6 h-6 text-blue-primary mx-auto mb-2" />
                        <div className="font-medium">Response Time</div>
                        <div className="text-sm text-gray-600">Within 24-48 hours</div>
                      </div>
                      <div>
                        <FiUsers className="w-6 h-6 text-blue-primary mx-auto mb-2" />
                        <div className="font-medium">{matchedBuilders.length} Builders Contacted</div>
                        <div className="text-sm text-gray-600">Best match for {formData.city}</div>
                      </div>
                      <div>
                        <FiDollarSign className="w-6 h-6 text-blue-primary mx-auto mb-2" />
                        <div className="font-medium">Free Quotes</div>
                        <div className="text-sm text-gray-600">No obligation</div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-3">📋 What Happens Next:</h3>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex items-start space-x-2">
                          <span className="text-blue-600 font-medium">1.</span>
                          <span>Builders receive an email notification about your request</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-blue-600 font-medium">2.</span>
                          <span>Interested builders will contact you directly via email or phone</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-blue-600 font-medium">3.</span>
                          <span>You'll receive 3-5 competitive quotes within 48 hours</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-blue-600 font-medium">4.</span>
                          <span>Compare proposals and choose the best builder for your needs</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-blue-600 font-medium">5.</span>
                          <span>Work directly with your chosen builder to create your perfect stand</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h3 className="font-semibold text-green-900 mb-2">✅ All quotes are completely FREE</h3>
                      <p className="text-sm text-green-700">No platform fees, no hidden charges. You pay your chosen builder directly.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6 mb-8">
              <h2 className="text-2xl font-bold text-navy-900">Your Matched Builders</h2>
              {matchedBuilders.map((builder) => (
                <Card key={builder.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-navy-900">{builder.companyName}</h3>
                          <div className="flex items-center gap-1">
                            <FiStar className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">{builder.rating}</span>
                            <span className="text-gray-500 text-sm">({builder.reviewCount})</span>
                          </div>
                          {builder.verified && (
                            <Badge className="bg-green-100 text-green-800">Verified</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <FiMapPin className="w-4 h-4" />
                            {builder.headquarters.city}, {builder.headquarters.country}
                          </div>
                          <div className="flex items-center gap-1">
                            <FiUsers className="w-4 h-4" />
                            {builder.projectsCompleted}+ projects
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{builder.companyDescription}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Response time: <span className="font-medium text-green-600">{builder.responseTime}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/builders/${builder.slug}`)}
                        >
                          View Profile
                        </Button>
                        <Button size="sm" className="bg-blue-primary hover:bg-blue-dark">
                          Contact Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                onClick={() => router.push('/trade-shows')}
                className="mr-4"
              >
                <FiArrowRight className="w-4 h-4 mr-2" />
                Browse More Shows
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => router.push('/builders')}
              >
                View All Builders
              </Button>
            </div>
          </div>
        </section>

        <Footer />
        <WhatsAppFloat />
      </div>
    );
  }

  return (
    <div className="font-inter min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-blue-primary to-blue-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Request Exhibition Stand Quote
            </h1>
            <p className="text-lg text-blue-light mb-6">
              Get matched with verified builders who specialize in your trade show and industry
            </p>
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep ? 'bg-white text-blue-primary' : 'bg-blue-dark text-blue-light'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-12 h-0.5 ${
                      step < currentStep ? 'bg-white' : 'bg-blue-dark'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <span className="text-blue-light">Step {currentStep} of 4</span>
            </div>
          </div>
        </div>
      </section>

      {/* Form Content */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8">
              {/* Step 1: Event Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-navy-900 mb-2">Event Information</h2>
                    <p className="text-gray-600">Tell us about your trade show location and requirements</p>
                  </div>

                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Select value={formData.country} onValueChange={handleCountryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the country where you want to exhibit" />
                      </SelectTrigger>
                      <SelectContent>
                        {GLOBAL_EXHIBITION_DATA.countries.map((country) => (
                          <SelectItem key={country.id} value={country.name}>
                            <div className="flex items-center gap-2">
                              <span>{country.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {country.countryCode}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.country && (
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Select value={formData.city} onValueChange={handleCityChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the city where you want to exhibit" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableCities.length === 0 ? (
                            <SelectItem value="" disabled>
                              No cities available for {formData.country}
                            </SelectItem>
                          ) : (
                            getAvailableCities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {getAvailableCities.length === 0 && (
                        <p className="text-sm text-amber-600 mt-1">
                          ℹ️ No specific cities listed for {formData.country}. You can still submit your request and we'll match you with builders in this country.
                        </p>
                      )}
                    </div>
                  )}

                  {(formData.city || (formData.country && getAvailableCities.length === 0)) && (
                    <div>
                      <Label htmlFor="tradeShow">Trade Show/Exhibition *</Label>
                      <Select 
                        value={formData.isCustomTradeShow ? 'not-listed' : formData.tradeShow} 
                        onValueChange={handleTradeShowChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your trade show" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableTradeShows.map((show) => (
                            <SelectItem key={show.slug} value={show.slug}>
                              {show.name} - {new Date(show.startDate).getFullYear()}
                            </SelectItem>
                          ))}
                          <SelectItem value="not-listed">
                            ❌ Not listed here - Enter custom event name
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {formData.isCustomTradeShow && (
                    <div>
                      <Label htmlFor="customTradeShowName">Enter Trade Show Name *</Label>
                      <Input
                        id="customTradeShowName"
                        value={formData.customTradeShowName}
                        onChange={(e) => updateFormData('customTradeShowName', e.target.value)}
                        placeholder="Enter the name of your trade show/event"
                        className="mt-1"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        We'll still match you with builders in {formData.city || formData.country}
                      </p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="standSize">Stand Size: {formData.standSize} sqm</Label>
                    <Slider
                      value={[formData.standSize]}
                      onValueChange={(value) => updateFormData('standSize', value[0])}
                      max={500}
                      min={9}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>9 sqm</span>
                      <span>500+ sqm</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="budget">Budget Range *</Label>
                    <Select value={formData.budget} onValueChange={(value) => updateFormData('budget', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Under $10,000">Under $10,000</SelectItem>
                        <SelectItem value="$10,000 - $25,000">$10,000 - $25,000</SelectItem>
                        <SelectItem value="$25,000 - $50,000">$25,000 - $50,000</SelectItem>
                        <SelectItem value="$50,000 - $100,000">$50,000 - $100,000</SelectItem>
                        <SelectItem value="$100,000 - $250,000">$100,000 - $250,000</SelectItem>
                        <SelectItem value="Over $250,000">Over $250,000</SelectItem>
                        <SelectItem value="To be discussed">To be discussed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timeline">Project Timeline</Label>
                    <Select value={formData.timeline} onValueChange={(value) => updateFormData('timeline', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="When do you need this completed?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">ASAP (Rush project)</SelectItem>
                        <SelectItem value="1-month">Within 1 month</SelectItem>
                        <SelectItem value="2-3-months">2-3 months</SelectItem>
                        <SelectItem value="3-6-months">3-6 months</SelectItem>
                        <SelectItem value="6-plus-months">6+ months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Company Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-navy-900 mb-2">Company Information</h2>
                    <p className="text-gray-600">Help us understand your business and contact details</p>
                  </div>

                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => updateFormData('companyName', e.target.value)}
                      placeholder="Your company name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactPerson">Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        value={formData.contactPerson}
                        onChange={(e) => updateFormData('contactPerson', e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Select value={formData.industry} onValueChange={(value) => updateFormData('industry', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="automotive">Automotive</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                          <SelectItem value="fashion">Fashion</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactEmail">Email Address *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => updateFormData('contactEmail', e.target.value)}
                        placeholder="your.email@company.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPhone">Phone Number *</Label>
                      <div className="flex">
                        <Select value={formData.countryCode} onValueChange={(value) => updateFormData('countryCode', value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {COUNTRY_CODES.map((country) => (
                              <SelectItem key={country.code} value={country.phoneCode}>
                                <div className="flex items-center gap-2">
                                  <span>{country.flag}</span>
                                  <span>{country.phoneCode}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          id="contactPhone"
                          type="tel"
                          value={formData.contactPhone}
                          onChange={(e) => updateFormData('contactPhone', e.target.value)}
                          placeholder="123 456 7890"
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Stand Requirements */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-navy-900 mb-2">Stand Requirements</h2>
                    <p className="text-gray-600">Specify your stand type and special requirements</p>
                  </div>

                  <div>
                    <Label className="mb-3 block">Stand Type * (Select all that apply)</Label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {['Custom Build', 'Modular System', 'Portable Display', 'Rental Solution'].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={formData.standType.includes(type)}
                            onCheckedChange={(checked) => handleArrayUpdate('standType', type, checked as boolean)}
                          />
                          <Label htmlFor={type} className="text-sm cursor-pointer">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasExistingDesign"
                        checked={formData.hasExistingDesign}
                        onCheckedChange={(checked) => updateFormData('hasExistingDesign', checked)}
                      />
                      <Label htmlFor="hasExistingDesign" className="text-sm cursor-pointer">
                        I have existing design/branding files
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="needsStorageAfter"
                        checked={formData.needsStorageAfter}
                        onCheckedChange={(checked) => updateFormData('needsStorageAfter', checked)}
                      />
                      <Label htmlFor="needsStorageAfter" className="text-sm cursor-pointer">
                        Need storage after event
                      </Label>
                    </div>
                  </div>

                  {/* File Upload Section */}
                  {formData.hasExistingDesign && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <Label htmlFor="file-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              Upload your design files
                            </span>
                            <span className="mt-1 block text-sm text-gray-500">
                              PDF, ZIP, JPG, PNG up to 10MB each
                            </span>
                          </Label>
                          <Input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept=".pdf,.zip,.jpg,.jpeg,.png"
                            onChange={handleFileUpload}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          <FiUpload className="w-4 h-4 mr-2" />
                          Choose Files
                        </Button>
                      </div>

                      {uploadError && (
                        <Alert className="mt-4 border-red-200 bg-red-50">
                          <AlertDescription className="text-red-800">
                            {uploadError}
                          </AlertDescription>
                        </Alert>
                      )}

                      {formData.designFiles.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Uploaded Files:</h4>
                          <div className="space-y-2">
                            {formData.designFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center">
                                  <FiFile className="w-4 h-4 text-gray-500 mr-2" />
                                  <span className="text-sm text-gray-700">{file.name}</span>
                                  <span className="text-xs text-gray-500 ml-2">
                                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                >
                                  <FiX className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="needsInstallation"
                        checked={formData.needsInstallation}
                        onCheckedChange={(checked) => updateFormData('needsInstallation', checked)}
                      />
                      <Label htmlFor="needsInstallation" className="text-sm cursor-pointer">
                        Installation & dismantling
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="needsTransportation"
                        checked={formData.needsTransportation}
                        onCheckedChange={(checked) => updateFormData('needsTransportation', checked)}
                      />
                      <Label htmlFor="needsTransportation" className="text-sm cursor-pointer">
                        Transportation services
                      </Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="specialRequests">Special Requirements</Label>
                    <Textarea
                      id="specialRequests"
                      value={formData.specialRequests}
                      onChange={(e) => updateFormData('specialRequests', e.target.value)}
                      placeholder="Any specific design requirements, technical needs, or special considerations..."
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Additional Services */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-navy-900 mb-2">Additional Services</h2>
                    <p className="text-gray-600">Select any additional services you might need</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="needsAVEquipment"
                        checked={formData.needsAVEquipment}
                        onCheckedChange={(checked) => updateFormData('needsAVEquipment', checked)}
                      />
                      <Label htmlFor="needsAVEquipment" className="text-sm cursor-pointer">
                        Audio/Visual Equipment
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="needsLighting"
                        checked={formData.needsLighting}
                        onCheckedChange={(checked) => updateFormData('needsLighting', checked)}
                      />
                      <Label htmlFor="needsLighting" className="text-sm cursor-pointer">
                        Professional Lighting
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="needsFurniture"
                        checked={formData.needsFurniture}
                        onCheckedChange={(checked) => updateFormData('needsFurniture', checked)}
                      />
                      <Label htmlFor="needsFurniture" className="text-sm cursor-pointer">
                        Furniture & Seating
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="needsGraphics"
                        checked={formData.needsGraphics}
                        onCheckedChange={(checked) => updateFormData('needsGraphics', checked)}
                      />
                      <Label htmlFor="needsGraphics" className="text-sm cursor-pointer">
                        Graphics & Printing
                      </Label>
                    </div>
                  </div>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <FiInfo className="w-5 h-5 text-blue-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-navy-900 mb-1">What happens next?</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• We'll match you with 3-5 builders who specialize in your requirements</li>
                            <li>• Builders will contact you within 24 hours with initial quotes</li>
                            <li>• You can compare proposals and choose the best fit</li>
                            <li>• All quotes are completely free with no obligation</li>
                            <li>• Your uploaded files will be shared only with matched builders</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                {currentStep < 4 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className="bg-blue-primary hover:bg-blue-dark"
                  >
                    Next Step
                    <FiArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !isStepValid(currentStep)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {isSubmitting ? (
                      'Submitting...'
                    ) : (
                      <>
                        <FiSend className="w-4 h-4 mr-2" />
                        Submit Quote Request
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}


