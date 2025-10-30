'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Quote, Send, CheckCircle, Users, Shield, Globe, MapPin, Star, ArrowRight, ArrowLeft, Building, Calendar, DollarSign, Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface PublicQuoteRequestProps {
  location?: string;
  countryCode?: string;
  cityName?: string;
  builderId?: string;
  className?: string;
  buttonText?: string;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}

interface FormData {
  companyName: string;
  email: string;
  phone: string;
  exhibitionName: string;
  customExhibition: string;
  standSize: string;
  timeline: string;
  budget: string;
  message: string;
  hasDesign: boolean;
  confirmDetails: boolean;
  uploadedFiles: File[];
}

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

export function PublicQuoteRequest({ 
  location,
  countryCode,
  cityName,
  builderId,
  className = '',
  buttonText = 'Get Free Quote',
  size = 'lg'
}: PublicQuoteRequestProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [matchingBuildersCount, setMatchingBuildersCount] = useState<number | null>(null);
  const [countryBuildersCount, setCountryBuildersCount] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    email: '',
    phone: '',
    exhibitionName: '',
    customExhibition: '',
    standSize: '',
    timeline: '',
    budget: '',
    message: '',
    hasDesign: false,
    confirmDetails: false,
    uploadedFiles: []
  });
  const { toast } = useToast();

  // Determine if we should use default styling or custom className
  const useCustomStyle = className && className.includes('bg-');
  const buttonClassName = useCustomStyle 
    ? className 
    : `bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl ${className}`;

  // Get location-specific country code for exhibition filtering
  const getLocationCountryCode = (location?: string, countryCode?: string) => {
    if (countryCode) return countryCode;
    if (!location) return 'US'; // Default
    
    const locationLower = location.toLowerCase();
    if (locationLower.includes('dubai') || locationLower.includes('uae') || locationLower.includes('united arab emirates')) return 'AE';
    if (locationLower.includes('india')) return 'IN';
    if (locationLower.includes('germany') || locationLower.includes('berlin') || locationLower.includes('munich')) return 'DE';
    if (locationLower.includes('france') || locationLower.includes('paris')) return 'FR';
    if (locationLower.includes('uk') || locationLower.includes('london') || locationLower.includes('united kingdom')) return 'GB';
    if (locationLower.includes('spain') || locationLower.includes('barcelona') || locationLower.includes('madrid')) return 'ES';
    if (locationLower.includes('italy') || locationLower.includes('milan')) return 'IT';
    if (locationLower.includes('netherlands') || locationLower.includes('amsterdam')) return 'NL';
    if (locationLower.includes('switzerland') || locationLower.includes('geneva')) return 'CH';
    if (locationLower.includes('singapore')) return 'SG';
    if (locationLower.includes('china') || locationLower.includes('beijing')) return 'CN';
    if (locationLower.includes('turkey') || locationLower.includes('istanbul')) return 'TR';
    if (locationLower.includes('australia') || locationLower.includes('melbourne') || locationLower.includes('sydney')) return 'AU';
    if (locationLower.includes('canada') || locationLower.includes('toronto')) return 'CA';
    if (locationLower.includes('qatar') || locationLower.includes('doha')) return 'QA';
    if (locationLower.includes('saudi') || locationLower.includes('riyadh') || locationLower.includes('jeddah')) return 'SA';
    if (locationLower.includes('oman')) return 'OM';
    if (locationLower.includes('bahrain')) return 'BH';
    if (locationLower.includes('kuwait')) return 'KW';
    
    return 'US'; // Default fallback
  };

  const detectedCountryCode = getLocationCountryCode(location, countryCode);

  // Country normalization helpers
  const countryCodeToName: Record<string, string> = {
    US: 'United States',
    AE: 'United Arab Emirates',
    GB: 'United Kingdom',
    DE: 'Germany',
    FR: 'France',
    ES: 'Spain',
    IT: 'Italy',
    NL: 'Netherlands',
    CH: 'Switzerland',
    SG: 'Singapore',
    CN: 'China',
    TR: 'Turkey',
    AU: 'Australia',
    CA: 'Canada',
    QA: 'Qatar',
    SA: 'Saudi Arabia',
    OM: 'Oman',
    BH: 'Bahrain',
    KW: 'Kuwait',
    IN: 'India',
  };

  const normalize = (s: string) =>
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const countryAliases: Record<string, string[]> = {
    'united-states': ['united-states', 'usa', 'us', 'united-states-of-america', 'u-s-a'],
    'united-kingdom': ['united-kingdom', 'uk', 'u-k', 'great-britain', 'britain'],
    'united-arab-emirates': ['united-arab-emirates', 'uae', 'u-a-e', 'dubai', 'abu-dhabi'],
    'germany': ['germany', 'deutschland'],
    'france': ['france'],
    'spain': ['spain', 'españa', 'espana'],
    'italy': ['italy', 'italia'],
    'netherlands': ['netherlands', 'holland'],
    'switzerland': ['switzerland', 'schweiz', 'suisse', 'svizzera'],
    'qatar': ['qatar'],
    'saudi-arabia': ['saudi-arabia', 'ksa', 'kingdom-of-saudi-arabia'],
    'australia': ['australia'],
    'canada': ['canada'],
    'india': ['india', 'bharat'],
  };

  async function fetchCountryBuilderCount(preferredCountryName?: string): Promise<number | null> {
    try {
      // First try aggregated endpoint
      const countriesRes = await fetch('/api/admin/builders?action=countries');
      const countriesJson = await countriesRes.json();
      const targetName = (preferredCountryName || countryCodeToName[detectedCountryCode] || location || '').toString().trim();
      const wantedA = targetName.toLowerCase();
      const wantedB = normalize(targetName);
      const aliasList = countryAliases[wantedB] || [wantedB];
      if (countriesRes.ok && Array.isArray(countriesJson?.data)) {
        const found = countriesJson.data.find((c: any) => {
          const n = typeof c?.name === 'string' ? c.name : '';
          const nA = n.toLowerCase();
          const nB = normalize(n);
          return nA === wantedA || nB === wantedB || aliasList.includes(nB);
        });
        if (found && typeof found.builderCount === 'number') {
          return found.builderCount;
        }
      }

      // Fallback: fetch builders and count locally by country match
      const buildersRes = await fetch('/api/admin/builders?limit=1000&prioritize_real=true');
      const buildersJson = await buildersRes.json();
      const builders = buildersJson?.data?.builders || buildersJson?.builders || [];
      const count = builders.filter((b: any) => {
        const n = (b?.headquarters?.country || '').toString();
        const nb = normalize(n);
        return nb === wantedB || aliasList.includes(nb);
      }).length;
      return Number.isFinite(count) ? count : null;
    } catch {
      return null;
    }
  }
  
  // Query exhibitions from database based on location
  const exhibitionsFromDB = useQuery(api.exhibitions.getExhibitionsByCountry, { 
    countryCode: detectedCountryCode 
  });
  
  // City-specific exhibitions if cityName is provided
  const cityExhibitionsFromDB = cityName
    ? useQuery(api.exhibitions.getExhibitionsByCity as any, {
        countryCode: detectedCountryCode,
        cityName: cityName,
      })
    : null;
  
  // Fallback exhibitions if database is empty or loading
  const fallbackExhibitions = [
    'CES Las Vegas',
    'Mobile World Congress',
    'Hannover Messe',
    'GITEX Technology Week',
    'Arab Health',
    'India International Trade Fair',
    'ITB Berlin',
    'IFA Berlin',
    'Maison&Objet Paris',
    'Salone del Mobile',
    'Other Exhibition'
  ];

  // Combine database exhibitions with fallback, prioritizing city-specific ones
  const exhibitions = React.useMemo(() => {
    let dbExhibitions: string[] = [];
    
    // Prioritize city-specific exhibitions
    if (cityExhibitionsFromDB && cityExhibitionsFromDB.length > 0) {
      dbExhibitions = cityExhibitionsFromDB.map((ex: any) => ex.name);
      console.log(`🏙️ Found ${dbExhibitions.length} city-specific exhibitions for ${cityName}`);
    } else if (exhibitionsFromDB && exhibitionsFromDB.length > 0) {
      dbExhibitions = exhibitionsFromDB.map(ex => ex.name);
      console.log(`🌍 Found ${dbExhibitions.length} country-specific exhibitions for ${detectedCountryCode}`);
    }
    
    // Add fallback exhibitions if no database exhibitions found
    const finalExhibitions = dbExhibitions.length > 0 ? dbExhibitions : fallbackExhibitions;
    
    // Always ensure "Other Exhibition" is at the end
    const filtered = finalExhibitions.filter(ex => ex !== 'Other Exhibition');
    const result = [...filtered, 'Other Exhibition'];
    
    console.log(`📋 Final exhibitions list for ${cityName || location}:`, result);
    return result;
  }, [exhibitionsFromDB, cityExhibitionsFromDB, cityName, location, detectedCountryCode]);

  const totalSteps = 4; // Added file upload step

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/zip'];
    const maxSize = 10 * 1024 * 1024; // 10MB per file
    
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a supported file type. Please upload PDF, JPG, PNG, or ZIP files.`,
          variant: "destructive",
        });
        return false;
      }
      
      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} is too large. Please upload files smaller than 10MB.`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      console.log('➡️ Moving to step', currentStep + 1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      console.log('⬅️ Moving back to step', currentStep - 1);
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.companyName && formData.email;
      case 2:
        return formData.exhibitionName || formData.customExhibition;
      case 3:
        return true; // Optional fields
      case 4:
        // Require user confirmation on final step; if they indicate they have a design,
        // require at least one file uploaded
        if (formData.hasDesign && uploadedFiles.length === 0) return false;
        return !!formData.confirmDetails;
      default:
        return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('🚀 Submitting unified quote request...', formData);

      const finalExhibitionName = formData.exhibitionName === 'Other Exhibition' 
        ? formData.customExhibition 
        : formData.exhibitionName;

      const leadData = {
        id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        exhibitionName: finalExhibitionName,
        standSize: formData.standSize,
        timeline: formData.timeline,
        budget: formData.budget,
        message: formData.message,
        hasDesign: formData.hasDesign,
        uploadedFilesCount: uploadedFiles.length,
        builderId: builderId || 'public_request',
        builderName: 'Multiple Builders',
        builderLocation: location || cityName || 'Global',
        countryCode: detectedCountryCode,
        cityName: cityName,
        timestamp: new Date().toISOString(),
        status: 'new',
        source: 'unified_quote_request',
        urgency: formData.timeline.includes('1-2 months') ? 'high' : 
                formData.timeline.includes('3-6 months') ? 'medium' : 'low',
        leadScore: 85
      };

      const response = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit request');
      }

      console.log('✅ Unified quote request submitted:', result);
      // Capture number of matching builders from API
      const matched = typeof result?.data?.matchingBuilders === 'number'
        ? result.data.matchingBuilders
        : (typeof result?.notificationsSent === 'number' ? result.notificationsSent : null);
      setMatchingBuildersCount(matched);

      // Also fetch country-level builder count to display full availability
      let countryCount: number | null = null;
      countryCount = await fetchCountryBuilderCount();
      if (countryCount !== null) setCountryBuildersCount(countryCount);
      setIsSuccess(true);

      const locationText = cityName ? `${cityName}, ${location}` : location || 'your area';
      toast({
        title: "Quote Request Sent!",
        description: `You can expect quotations from ${countryCount ?? matched ?? 'multiple'} verified builders matching your criteria. They will contact you within 24 hours with competitive quotes.`,
        duration: 5000,
      });

    } catch (error) {
      console.error('❌ Error submitting quote request:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error sending your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setIsSuccess(false);
    setUploadedFiles([]);
    setFormData({
      companyName: '',
      email: '',
      phone: '',
      exhibitionName: '',
      customExhibition: '',
      standSize: '',
      timeline: '',
      budget: '',
      message: '',
      hasDesign: false,
      confirmDetails: false,
      uploadedFiles: []
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(resetForm, 300); // Reset after dialog closes
  };

  // Clean up file previews on unmount
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogTrigger asChild>
          <Button 
            className={buttonClassName}
            size={size}
          >
            <Quote className="w-4 h-4 mr-2" />
            {buttonText}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Request Sent Successfully!</h3>
            <p className="text-gray-600 mb-6">
              You can expect a quotation from {countryBuildersCount ?? matchingBuildersCount ?? 'multiple'} builders matching your requirements.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">What happens next:</h4>
              <ul className="text-sm text-blue-800 text-left space-y-1">
                <li>• Qualified builders will review your requirements</li>
                <li>• You'll receive detailed quotations within 24-48 hours</li>
                <li>• Compare proposals and choose the best fit</li>
                <li>• All quotes are completely free with no obligation</li>
              </ul>
            </div>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Prevent dialog from closing unless explicitly closed after submission
  const handleDialogOpenChange = (open: boolean) => {
    // Only allow closing the dialog if:
    // 1. User explicitly wants to open it (open === true)
    // 2. Form was successfully submitted (isSuccess === true)
    // 3. User is not currently submitting (isSubmitting === false)
    if (open) {
      console.log('🔓 Dialog opened');
      setIsOpen(true);
    } else if (isSuccess) {
      // Allow closing after success
      console.log('✅ Dialog closing after success');
      setIsOpen(false);
    } else if (!isSubmitting) {
      // Prevent accidental closes - user must use Cancel button
      console.log('⚠️ Dialog close prevented at step:', currentStep, '- Use Cancel button to close');
      toast({
        title: "Use Cancel Button",
        description: "To close this form, please use the Cancel button at the bottom.",
        duration: 2000,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button 
          className={`${buttonClassName} touch-active no-tap-highlight`}
          size={size}
        >
          <Quote className="w-4 h-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      
      <DialogContent 
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          // Prevent closing when clicking on Select dropdowns or other portaled elements
          const target = e.target as HTMLElement;
          const isSelectDropdown = target.closest('[role="listbox"]') || target.closest('[data-radix-select-viewport]');
          if (isSelectDropdown) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          // Prevent accidental Escape key closes
          if (!isSuccess) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Quote className="w-5 h-5 text-pink-600" />
            Get Free Exhibition Stand Quotes
          </DialogTitle>
          <DialogDescription>
            {location ? (
              <>Connect with verified builders in <strong>{cityName ? `${cityName}, ${location}` : location}</strong> - Step {currentStep} of {totalSteps}</>
            ) : (
              `Connect with verified builders worldwide - Step ${currentStep} of ${totalSteps}`
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-pink-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Company Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Building className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Company Information</h3>
                <p className="text-sm text-gray-600">Tell us about your company</p>
              </div>

              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Your company name"
                  required
                  className="mt-1 min-h-[44px]"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="mt-1 min-h-[44px]"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number (with country code) *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="mt-1 min-h-[44px]"
                />
                <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +1, +971, +44)</p>
              </div>
            </div>
          )}

          {/* Step 2: Exhibition Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Calendar className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Exhibition Details</h3>
                <p className="text-sm text-gray-600">
                  {cityName ? `Exhibitions in ${cityName}` : location ? `Exhibitions in ${location}` : 'Which exhibition are you attending?'}
                </p>
              </div>

              <div>
                <Label htmlFor="exhibition">Exhibition *</Label>
                <Select 
                  value={formData.exhibitionName} 
                  onValueChange={(value) => handleInputChange('exhibitionName', value)}
                >
                  <SelectTrigger className="mt-1 min-h-[44px]">
                    <SelectValue placeholder="Select exhibition" />
                  </SelectTrigger>
                  <SelectContent>
                    {exhibitions.map((exhibition) => (
                      <SelectItem key={exhibition} value={exhibition}>
                        {exhibition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.exhibitionName === 'Other Exhibition' && (
                <div>
                  <Label htmlFor="customExhibition">Exhibition Name *</Label>
                  <Input
                    id="customExhibition"
                    value={formData.customExhibition}
                    onChange={(e) => handleInputChange('customExhibition', e.target.value)}
                    placeholder="Enter exhibition name"
                    required
                    className="mt-1 min-h-[44px]"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="standSize">Stand Size</Label>
                <Select 
                  value={formData.standSize} 
                  onValueChange={(value) => handleInputChange('standSize', value)}
                >
                  <SelectTrigger className="mt-1 min-h-[44px]">
                    <SelectValue placeholder="Select stand size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Small (3x3m)">Small (3x3m)</SelectItem>
                    <SelectItem value="Medium (6x6m)">Medium (6x6m)</SelectItem>
                    <SelectItem value="Large (9x9m)">Large (9x9m)</SelectItem>
                    <SelectItem value="Extra Large (12x12m+)">Extra Large (12x12m+)</SelectItem>
                    <SelectItem value="Custom Size">Custom Size</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Select 
                  value={formData.timeline} 
                  onValueChange={(value) => handleInputChange('timeline', value)}
                >
                  <SelectTrigger className="mt-1 min-h-[44px]">
                    <SelectValue placeholder="When do you need this?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2 months">1-2 months</SelectItem>
                    <SelectItem value="3-6 months">3-6 months</SelectItem>
                    <SelectItem value="6+ months">6+ months</SelectItem>
                    <SelectItem value="Just exploring">Just exploring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Budget & Requirements */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <DollarSign className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Budget & Requirements</h3>
                <p className="text-sm text-gray-600">Help us match you with the right builders</p>
              </div>

              <div>
                <Label htmlFor="budget">Budget Range</Label>
                <Select 
                  value={formData.budget} 
                  onValueChange={(value) => handleInputChange('budget', value)}
                >
                  <SelectTrigger className="mt-1 min-h-[44px]">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$10,000 - $25,000">$10,000 - $25,000</SelectItem>
                    <SelectItem value="$25,000 - $50,000">$25,000 - $50,000</SelectItem>
                    <SelectItem value="$50,000 - $100,000">$50,000 - $100,000</SelectItem>
                    <SelectItem value="$100,000+">$100,000+</SelectItem>
                    <SelectItem value="To be discussed">To be discussed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Additional Requirements</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Brief description of your needs, design preferences, or special requirements..."
                  rows={3}
                  className="mt-1 min-h-[120px]"
                />
              </div>

              {/* Location Context */}
              {location && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      Builders in {cityName ? `${cityName}, ${location}` : location}
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      <Star className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Design Files Upload */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Upload className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Design Files (Optional)</h3>
                <p className="text-sm text-gray-600">Upload your existing designs or reference materials</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="hasDesign"
                    checked={formData.hasDesign}
                    onChange={(e) => handleInputChange('hasDesign', e.target.checked)}
                    className="mt-1 rounded h-5 w-5"
                  />
                  <Label htmlFor="hasDesign" className="text-base">I have existing designs or reference materials</Label>
                </div>

                {formData.hasDesign && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="fileUpload"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.zip"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Label htmlFor="fileUpload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Click to upload files or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, JPG, PNG, ZIP files up to 10MB each
                        </p>
                      </Label>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <Label>Uploaded Files ({uploadedFiles.length})</Label>
                        {uploadedFiles.map((uploadedFile) => (
                          <div key={uploadedFile.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              {uploadedFile.file.type.startsWith('image/') ? (
                                <ImageIcon className="w-4 h-4 text-blue-600" />
                              ) : (
                                <FileText className="w-4 h-4 text-red-600" />
                              )}
                              <span className="text-sm truncate max-w-[200px]">
                                {uploadedFile.file.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({(uploadedFile.file.size / 1024 / 1024).toFixed(1)}MB)
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(uploadedFile.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Required confirmation before submission */}
                <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <input
                    type="checkbox"
                    id="confirmDetails"
                    checked={formData.confirmDetails}
                    onChange={(e) => handleInputChange('confirmDetails', e.target.checked)}
                    className="mt-1 rounded h-5 w-5"
                  />
                  <Label htmlFor="confirmDetails" className="text-base text-yellow-900">
                    I confirm the details provided are accurate and I'm ready to submit my quote request.
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="text-gray-600 hover:text-gray-900 min-h-[44px] w-full sm:w-auto"
            >
              Cancel
            </Button>
            
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center gap-2 min-h-[44px] w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
            )}
            
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 min-h-[44px] w-full sm:w-auto"
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || !isStepValid()}
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 min-h-[44px] w-full sm:w-auto"
              >
                {isSubmitting ? (
                  'Sending Request...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Quote Request
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PublicQuoteRequest;



