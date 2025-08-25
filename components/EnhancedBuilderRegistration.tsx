'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import LocationSelector from '@/components/LocationSelector';
import LocationDisplay from '@/components/LocationDisplay';
import type { LocationSelection } from '@/lib/utils/globalLocationManager';
import { 
  Building, MapPin, Mail, Phone, User, Globe, 
  Award, DollarSign, Package, Send, CheckCircle,
  Shield, Star, Plus, X, Briefcase, Camera
} from 'lucide-react';

interface BuilderRegistrationData {
  // Company Information
  companyName: string;
  businessType: string;
  establishedYear: string;
  website: string;
  
  // Contact Information
  contactName: string;
  contactTitle: string;
  email: string;
  phone: string;
  
  // Business Details
  description: string;
  specializations: string[];
  certifications: string[];
  
  // Service Locations
  serviceLocations: LocationSelection[];
  
  // Capabilities
  minStandSize: string;
  maxStandSize: string;
  budgetRange: string;
  servicesOffered: string[];
  
  // Portfolio
  portfolioHighlights: string;
  recentProjects: string;
  
  // Verification
  businessLicense: string;
  insuranceDetails: string;
  references: string;
}

const BUSINESS_TYPES = [
  'Exhibition Stand Builder',
  'Design & Build Company',
  'Full-Service Event Agency',
  'Rental & Modular Systems',
  'Custom Fabrication',
  'Technology Integration',
  'Specialized Contractor'
];

const SPECIALIZATION_OPTIONS = [
  'Custom Build Stands',
  'Modular Systems',
  'Technology Integration',
  'Sustainable Materials',
  'Large Scale Installations',
  'Interactive Displays',
  'Automotive Exhibitions',
  'Healthcare & Medical',
  'Technology & Software',
  'Fashion & Retail',
  'Food & Beverage',
  'Industrial & Manufacturing',
  'Luxury & High-End',
  'Startups & SMEs'
];

const SERVICES_OFFERED = [
  'Stand Design',
  'Stand Construction',
  'Project Management',
  'Installation Services',
  'Transportation',
  'Storage Solutions',
  'AV Equipment',
  'Lighting Design',
  'Furniture Rental',
  'Graphics & Printing',
  'Flooring',
  'Catering Services',
  '3D Visualization',
  'Virtual Reality'
];

const BUDGET_RANGES = [
  'Under $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000 - $250,000',
  'Over $250,000'
];

export function EnhancedBuilderRegistration() {
  const [formData, setFormData] = useState<BuilderRegistrationData>({
    companyName: '',
    businessType: '',
    establishedYear: '',
    website: '',
    contactName: '',
    contactTitle: '',
    email: '',
    phone: '',
    description: '',
    specializations: [],
    certifications: [],
    serviceLocations: [],
    minStandSize: '',
    maxStandSize: '',
    budgetRange: '',
    servicesOffered: [],
    portfolioHighlights: '',
    recentProjects: '',
    businessLicense: '',
    insuranceDetails: '',
    references: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof BuilderRegistrationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecializationToggle = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      servicesOffered: prev.servicesOffered.includes(service)
        ? prev.servicesOffered.filter(s => s !== service)
        : [...prev.servicesOffered, service]
    }));
  };

  const addServiceLocation = () => {
    setFormData(prev => ({
      ...prev,
      serviceLocations: [...prev.serviceLocations, {}]
    }));
  };

  const updateServiceLocation = (index: number, location: LocationSelection) => {
    setFormData(prev => ({
      ...prev,
      serviceLocations: prev.serviceLocations.map((loc, i) => 
        i === index ? location : loc
      )
    }));
  };

  const removeServiceLocation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      serviceLocations: prev.serviceLocations.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('🏗️ Submitting builder registration...', formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsSuccess(true);
      toast({
        title: "Registration Submitted Successfully!",
        description: "Your builder profile is under review. You'll receive confirmation within 24-48 hours.",
        duration: 5000,
      });

    } catch (error) {
      console.error('❌ Error submitting registration:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Registration Submitted!</h3>
          <p className="text-gray-600 mb-6">
            Thank you for registering as an exhibition stand builder. Our team will review your application
            and contact you within 24-48 hours with next steps.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center text-blue-800 text-sm">
              <Shield className="w-4 h-4 mr-2" />
              Your information is secure and will only be used for verification purposes.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Builder Registration</h2>
            <Badge variant="outline">Step {currentStep} of 4</Badge>
          </div>
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded ${
                  step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Company Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Company Information
              </CardTitle>
              <CardDescription>
                Tell us about your exhibition stand building company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Your company name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="establishedYear">Established Year</Label>
                  <Input
                    id="establishedYear"
                    value={formData.establishedYear}
                    onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                    placeholder="e.g., 2010"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://yourcompany.com"
                    type="url"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Company Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your company, experience, and what makes you unique..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactName">Primary Contact Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    placeholder="Full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactTitle">Contact Title</Label>
                  <Input
                    id="contactTitle"
                    value={formData.contactTitle}
                    onChange={(e) => handleInputChange('contactTitle', e.target.value)}
                    placeholder="e.g., CEO, Sales Director"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Business Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contact@company.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Business Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Service Locations */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Service Locations
              </CardTitle>
              <CardDescription>
                Select all countries and cities where you provide exhibition stand building services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.serviceLocations.map((location, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Service Location {index + 1}</h4>
                    {formData.serviceLocations.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeServiceLocation(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <LocationSelector
                    onLocationChange={(location) => {
                      setFormData(prev => ({
                        ...prev,
                        serviceLocations: [
                          {
                            city: location.city || '',
                            country: location.country || '',
                            countryCode: location.countryCode || '',
                            address: '',
                            isHeadquarters: false
                          }
                        ]
                      }));
                    }}
                    mode="full"
                    placeholder="Select service locations..."
                  />
                  
                  {(location.country || location.city) && (
                    <LocationDisplay
                      country={location.country}
                      city={location.city}
                      mode="compact"
                      showStats
                    />
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addServiceLocation}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service Location
              </Button>
              
              {formData.serviceLocations.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No service locations added yet</p>
                  <Button type="button" onClick={addServiceLocation}>
                    Add Your First Service Location
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Capabilities & Services */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Capabilities & Services
              </CardTitle>
              <CardDescription>
                Define your specializations, services offered, and project capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">Specializations</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SPECIALIZATION_OPTIONS.map((spec) => (
                    <div key={spec} className="flex items-center space-x-2">
                      <Checkbox
                        id={spec}
                        checked={formData.specializations.includes(spec)}
                        onCheckedChange={() => handleSpecializationToggle(spec)}
                      />
                      <Label htmlFor={spec} className="text-sm">{spec}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-base font-medium mb-4 block">Services Offered</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SERVICES_OFFERED.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={service}
                        checked={formData.servicesOffered.includes(service)}
                        onCheckedChange={() => handleServiceToggle(service)}
                      />
                      <Label htmlFor={service} className="text-sm">{service}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="minStandSize">Min Stand Size (sqm)</Label>
                  <Input
                    id="minStandSize"
                    value={formData.minStandSize}
                    onChange={(e) => handleInputChange('minStandSize', e.target.value)}
                    placeholder="e.g., 9"
                    type="number"
                  />
                </div>
                <div>
                  <Label htmlFor="maxStandSize">Max Stand Size (sqm)</Label>
                  <Input
                    id="maxStandSize"
                    value={formData.maxStandSize}
                    onChange={(e) => handleInputChange('maxStandSize', e.target.value)}
                    placeholder="e.g., 1000"
                    type="number"
                  />
                </div>
                <div>
                  <Label htmlFor="budgetRange">Typical Budget Range</Label>
                  <Select value={formData.budgetRange} onValueChange={(value) => handleInputChange('budgetRange', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGET_RANGES.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Portfolio & Verification */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Portfolio & Verification
              </CardTitle>
              <CardDescription>
                Showcase your work and provide verification details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="portfolioHighlights">Portfolio Highlights</Label>
                <Textarea
                  id="portfolioHighlights"
                  value={formData.portfolioHighlights}
                  onChange={(e) => handleInputChange('portfolioHighlights', e.target.value)}
                  placeholder="Describe your best projects, notable clients, or unique achievements..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="recentProjects">Recent Major Projects (Optional)</Label>
                <Textarea
                  id="recentProjects"
                  value={formData.recentProjects}
                  onChange={(e) => handleInputChange('recentProjects', e.target.value)}
                  placeholder="List 3-5 recent major projects with client names, exhibition details, and stand sizes..."
                  rows={4}
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="businessLicense">Business License/Registration Number</Label>
                <Input
                  id="businessLicense"
                  value={formData.businessLicense}
                  onChange={(e) => handleInputChange('businessLicense', e.target.value)}
                  placeholder="Enter your business registration number"
                />
              </div>

              <div>
                <Label htmlFor="insuranceDetails">Insurance Details</Label>
                <Textarea
                  id="insuranceDetails"
                  value={formData.insuranceDetails}
                  onChange={(e) => handleInputChange('insuranceDetails', e.target.value)}
                  placeholder="Provide details about your liability insurance, coverage amounts, etc..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="references">Professional References</Label>
                <Textarea
                  id="references"
                  value={formData.references}
                  onChange={(e) => handleInputChange('references', e.target.value)}
                  placeholder="Provide 2-3 professional references with contact information..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Next Step
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Registration
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

export default EnhancedBuilderRegistration;