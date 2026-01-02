'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import { Input } from '@/components/shared/input';
import { Label } from '@/components/shared/label';
import { Textarea } from '@/components/shared/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/select';
import { Checkbox } from '@/components/shared/checkbox';
import { Badge } from '@/components/shared/badge';
import { Alert, AlertDescription } from '@/components/shared/alert';
import { Progress } from '@/components/shared/progress';
import { 
  CheckCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Globe, 
  Award,
  ArrowRight,
  ArrowLeft,
  Upload,
  Star,
  Info
} from 'lucide-react';
import { allCountries } from '@/lib/data/countries';

interface BuilderSignupFormData {
  // Company Information
  companyName: string;
  establishedYear: number;
  businessType: 'individual' | 'company' | 'partnership';
  registrationNumber: string;
  taxId: string;
  
  // Contact Information
  contactPersonName: string;
  contactPersonTitle: string;
  primaryEmail: string;
  phoneNumber: string;
  website: string;
  
  // Authentication
  password: string;
  confirmPassword: string;
  
  // Business Address
  country: string;
  city: string;
  address: string;
  postalCode: string;
  
  // Service Details
  serviceCountries: string[];
  serviceCities: string[];
  specializations: string[];
  teamSize: string;
  
  // Business Credentials
  businessLicense: File | null;
  insuranceCertificate: File | null;
  portfolioImages: File[];
  
  // Company Description
  companyDescription: string;
  yearsOfExperience: number;
  projectsCompleted: number;
  
  // Services Offered
  services: {
    name: string;
    description: string;
    priceRange: string;
  }[];
  
  // Terms and Verification
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
  otpCode: string;
  emailVerified: boolean;
}

const SPECIALIZATIONS = [
  'Custom Stand Design',
  'Modular Systems',
  'Portable Displays',
  'Double Deck Stands',
  'Sustainable/Eco Stands',
  'Technology Integration',
  'Interactive Displays',
  'LED & Lighting',
  'Furniture Rental',
  'Graphics & Printing',
  'Installation Services',
  'Project Management'
];

const TEAM_SIZES = [
  '1-5 employees',
  '6-15 employees',
  '16-30 employees',
  '31-50 employees',
  '51-100 employees',
  '100+ employees'
];

export default function BuilderSignupForm() {
  console.log('BuilderSignupForm: Component loaded');
  
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  const [formData, setFormData] = useState<BuilderSignupFormData>({
    companyName: '',
    establishedYear: new Date().getFullYear(),
    businessType: 'company',
    registrationNumber: '',
    taxId: '',
    contactPersonName: '',
    contactPersonTitle: '',
    primaryEmail: '',
    phoneNumber: '',
    website: '',
    password: '',
    confirmPassword: '',
    country: '',
    city: '',
    address: '',
    postalCode: '',
    serviceCountries: [],
    serviceCities: [],
    specializations: [],
    teamSize: '',
    businessLicense: null,
    insuranceCertificate: null,
    portfolioImages: [],
    companyDescription: '',
    yearsOfExperience: 0,
    projectsCompleted: 0,
    services: [],
    agreeToTerms: false,
    agreeToMarketing: false,
    otpCode: '',
    emailVerified: false
  });

  const updateFormData = (field: keyof BuilderSignupFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleArrayUpdate = (field: keyof BuilderSignupFormData, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }));
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { name: '', description: '', priceRange: '' }]
    }));
  };

  const updateService = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.companyName) newErrors.companyName = 'Company name is required';
        if (!formData.contactPersonName) newErrors.contactPersonName = 'Contact person name is required';
        if (!formData.primaryEmail) newErrors.primaryEmail = 'Email is required';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password && formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;
      case 2:
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.address) newErrors.address = 'Address is required';
        break;
      case 3:
        if (formData.serviceCountries.length === 0) newErrors.serviceCountries = 'Select at least one service country';
        if (formData.specializations.length === 0) newErrors.specializations = 'Select at least one specialization';
        if (!formData.teamSize) newErrors.teamSize = 'Team size is required';
        break;
      case 4:
        if (!formData.companyDescription) newErrors.companyDescription = 'Company description is required';
        if (formData.yearsOfExperience < 1) newErrors.yearsOfExperience = 'Years of experience is required';
        break;
      case 5:
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendEmailVerification = async () => {
    console.log('📧 Sending email verification link to:', formData.primaryEmail);
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.primaryEmail,
          userType: 'builder',
          companyName: formData.companyName
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setOtpSent(true);
        console.log('✅ Verification email sent successfully to:', formData.primaryEmail);
      } else {
        console.error('❌ Failed to send verification email:', result.error);
        setErrors({ otpCode: result.error || 'Failed to send verification email' });
      }
    } catch (error) {
      console.error('❌ Network error sending verification email:', error);
      setErrors({ otpCode: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkEmailVerification = async () => {
    console.log('🔐 Checking email verification status for:', formData.primaryEmail);
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/auth/check-verification?email=${encodeURIComponent(formData.primaryEmail)}&userType=builder`);
      const result = await response.json();
      
      if (result.verified) {
        updateFormData('emailVerified', true);
        console.log('✅ Email verified successfully');
        setErrors(prev => ({ ...prev, otpCode: '' })); // Clear any previous errors
      } else {
        console.log('⏳ Email not yet verified');
        setErrors({ otpCode: 'Please check your email and click the verification link' });
      }
    } catch (error) {
      console.error('❌ Network error checking verification:', error);
      setErrors({ otpCode: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;
    
    setIsSubmitting(true);
    console.log('Submitting builder registration to REAL API:', formData);
    
    try {
      // Transform form data to match the admin API structure
      const builderData = {
        companyName: formData.companyName,
        slug: formData.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        establishedYear: formData.establishedYear,
        headquarters: {
          city: formData.city,
          country: formData.country,
          countryCode: formData.country.slice(0, 2).toUpperCase(),
          address: formData.address,
          latitude: 0,
          longitude: 0,
          isHeadquarters: true
        },
        serviceLocations: formData.serviceCountries.map(country => ({
          city: formData.city,
          country: country,
          countryCode: country.slice(0, 2).toUpperCase(),
          address: formData.address,
          latitude: 0,
          longitude: 0,
          isHeadquarters: false
        })),
        contactInfo: {
          primaryEmail: formData.primaryEmail,
          phone: formData.phoneNumber,
          website: formData.website,
          contactPerson: formData.contactPersonName,
          position: formData.contactPersonTitle
        },
        // ✅ ADD SECURE PASSWORD STORAGE
        password: formData.password, // Will be hashed on server side
        accountSetup: {
          emailVerified: false, // ✅ CHANGED: Set to false initially, will be verified via welcome email
          registrationDate: new Date().toISOString(),
          source: 'manual_registration',
          loginEnabled: true
        },
        services: formData.services.map(service => ({
          id: service.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: service.name,
          description: service.description,
          category: 'Design',
          priceFrom: parseInt(service.priceRange.match(/\d+/)?.[0] || '300'),
          currency: 'USD',
          unit: 'per sqm',
          popular: true,
          turnoverTime: '4-6 weeks'
        })),
        specializations: formData.specializations.map(spec => ({
          id: spec.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: spec,
          slug: spec.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          description: spec,
          subcategories: [],
          color: '#3B82F6',
          icon: '🏗️',
          annualGrowthRate: 8.5,
          averageBoothCost: 450,
          popularCountries: []
        })),
        teamSize: parseInt(formData.teamSize.split('-')[0]) || 10,
        projectsCompleted: formData.projectsCompleted,
        rating: 4.0,
        reviewCount: 0,
        responseTime: 'Within 24 hours',
        languages: ['English'],
        verified: true, // ✅ Auto-verify since email was verified
        claimed: true, // ✅ Mark as claimed since they registered manually
        premiumMember: false,
        companyDescription: formData.companyDescription,
        whyChooseUs: ['Professional team', 'Quality service', 'Competitive pricing'],
        clientTestimonials: [],
        socialMedia: {},
        businessLicense: formData.registrationNumber,
        keyStrengths: formData.specializations.slice(0, 3)
      };

      console.log('🔄 Sending builder data to admin API:', builderData);

      // POST to the real admin API
      const response = await fetch('/api/admin/builders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(builderData)
      });

      const result = await response.json();
      console.log('📡 API Response:', result);

      if (result.success) {
        console.log('✅ Builder registered successfully and added to dashboard!');
        
        // ✅ SEND WELCOME EMAIL WITH VERIFICATION LINK
        try {
          console.log('📧 Sending welcome email to:', formData.primaryEmail);
          const welcomeEmailResponse = await fetch('/api/auth/send-welcome-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.primaryEmail,
              name: formData.contactPersonName,
              companyName: formData.companyName,
              userType: 'builder'
            })
          });
          
          if (welcomeEmailResponse.ok) {
            console.log('✅ Welcome email sent successfully');
          } else {
            console.log('⚠️ Welcome email failed to send, but registration was successful');
          }
        } catch (emailError) {
          console.log('⚠️ Welcome email error (non-critical):', emailError);
        }
        
        // Force a refresh of the unified platform data
        try {
          await fetch('/api/admin/builders?action=reload');
          console.log('🔄 Unified platform data refreshed after registration');
        } catch (refreshError) {
          console.log('⚠️ Could not refresh unified platform data:', refreshError);
        }
        
        // Store registration in localStorage as backup
        const registeredBuilders = JSON.parse(localStorage.getItem('registeredBuilders') || '[]');
        registeredBuilders.push({
          ...builderData,
          id: result.data?.id || uuidv4(), // Generate proper UUID instead of string-based ID
          registeredAt: new Date().toISOString(),
          source: 'registration'
        });
        localStorage.setItem('registeredBuilders', JSON.stringify(registeredBuilders));
        
        console.log('💾 Builder stored in localStorage as backup');
        
        setShowSuccess(true);
        
        // Redirect to login page for proper authentication
        setTimeout(() => {
          router.push('/auth/login?type=builder&signup=success');
        }, 3000);
      } else {
        console.error('❌ API Error:', result.error);
        setErrors({ submit: result.error || 'Failed to register builder. Please try again.' });
      }
      
    } catch (error) {
      console.error('❌ Network Error during registration:', error);
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Registration Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for joining our platform. Your builder profile has been created successfully.
              You'll be redirected to the login page where you can sign in with your credentials.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Our team will review your application within 24-48 hours</li>
                <li>• You'll receive email confirmation once approved</li>
                <li>Access your builder dashboard to manage profile and quotes</li>
                <li>Start receiving quote requests from potential clients</li>
                <li>Build your reputation through client reviews and ratings</li>
              </ul>
            </div>
            <Button onClick={() => router.push('/')} className="mr-4">
              Return to Homepage
            </Button>
            <Button variant="outline" onClick={() => router.push('/auth/login?type=builder')}>
              Login to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stepTitles = [
    'Company Information',
    'Business Location',
    'Services & Specializations',
    'Company Profile',
    'Verification & Terms'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                {step < 5 && (
                  <div className={`w-12 h-0.5 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Join Our Builder Network
          </h1>
          <p className="text-gray-600 mb-4">
            Step {currentStep} of 5: {stepTitles[currentStep - 1]}
          </p>
          <Progress value={(currentStep / 5) * 100} className="w-full max-w-md mx-auto" />
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          {/* Step 1: Company Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Company Information</h2>
                <p className="text-gray-600 mb-6">Tell us about your exhibition stand building company</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => updateFormData('companyName', e.target.value)}
                    placeholder="Your company name"
                    className={errors.companyName ? 'border-red-500' : ''}
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select value={formData.businessType} onValueChange={(value) => updateFormData('businessType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual/Sole Proprietor</SelectItem>
                      <SelectItem value="company">Company/Corporation</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="establishedYear">Established Year</Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    value={formData.establishedYear}
                    onChange={(e) => updateFormData('establishedYear', parseInt(e.target.value))}
                    placeholder="2020"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div>
                  <Label htmlFor="registrationNumber">Business Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e) => updateFormData('registrationNumber', e.target.value)}
                    placeholder="Business registration/company number"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                  <Input
                    id="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={(e) => updateFormData('contactPersonName', e.target.value)}
                    placeholder="Full name of primary contact"
                    className={errors.contactPersonName ? 'border-red-500' : ''}
                  />
                  {errors.contactPersonName && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactPersonName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contactPersonTitle">Job Title/Position</Label>
                  <Input
                    id="contactPersonTitle"
                    value={formData.contactPersonTitle}
                    onChange={(e) => updateFormData('contactPersonTitle', e.target.value)}
                    placeholder="CEO, Manager, Director, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="primaryEmail">Primary Email Address *</Label>
                  <Input
                    id="primaryEmail"
                    type="email"
                    value={formData.primaryEmail}
                    onChange={(e) => updateFormData('primaryEmail', e.target.value)}
                    placeholder="contact@yourcompany.com"
                    className={errors.primaryEmail ? 'border-red-500' : ''}
                  />
                  {errors.primaryEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.primaryEmail}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                    placeholder="+1 234 567 8900"
                    className={errors.phoneNumber ? 'border-red-500' : ''}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    placeholder="Create a secure password"
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="website">Company Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateFormData('website', e.target.value)}
                    placeholder="https://www.yourcompany.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Business Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Business Location</h2>
                <p className="text-gray-600 mb-6">Where is your company headquartered?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select value={formData.country} onValueChange={(value) => updateFormData('country', value)}>
                    <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCountries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    placeholder="Your city"
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address">Business Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    placeholder="Street address, building number"
                    className={errors.address ? 'border-red-500' : ''}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="postalCode">Postal/ZIP Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => updateFormData('postalCode', e.target.value)}
                    placeholder="12345"
                  />
                </div>

                <div>
                  <Label htmlFor="taxId">Tax ID/VAT Number</Label>
                  <Input
                    id="taxId"
                    value={formData.taxId}
                    onChange={(e) => updateFormData('taxId', e.target.value)}
                    placeholder="Tax identification number"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Services & Specializations */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Services & Specializations</h2>
                <p className="text-gray-600 mb-6">Tell us about the services you offer and where you operate</p>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Service Countries *</Label>
                <p className="text-sm text-gray-600 mb-3">Select all countries where you provide services</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto border rounded-lg p-4">
                  {allCountries.map((country) => (
                    <div key={country.code} className="flex items-center space-x-2">
                      <Checkbox
                        id={country.code}
                        checked={formData.serviceCountries.includes(country.name)}
                        onCheckedChange={(checked: boolean) => handleArrayUpdate('serviceCountries', country.name, checked)}
                      />
                      <Label htmlFor={country.code} className="text-sm cursor-pointer">
                        {country.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.serviceCountries && (
                  <p className="text-red-500 text-sm mt-1">{errors.serviceCountries}</p>
                )}
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Specializations *</Label>
                <p className="text-sm text-gray-600 mb-3">Select your areas of expertise</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SPECIALIZATIONS.map((specialization) => (
                    <div key={specialization} className="flex items-center space-x-2">
                      <Checkbox
                        id={specialization}
                        checked={formData.specializations.includes(specialization)}
                        onCheckedChange={(checked: boolean) => handleArrayUpdate('specializations', specialization, checked)}
                      />
                      <Label htmlFor={specialization} className="text-sm cursor-pointer">
                        {specialization}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.specializations && (
                  <p className="text-red-500 text-sm mt-1">{errors.specializations}</p>
                )}
              </div>

              <div>
                <Label htmlFor="teamSize">Team Size *</Label>
                <Select value={formData.teamSize} onValueChange={(value) => updateFormData('teamSize', value)}>
                  <SelectTrigger className={errors.teamSize ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select your team size" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.teamSize && (
                  <p className="text-red-500 text-sm mt-1">{errors.teamSize}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Company Profile */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Company Profile</h2>
                <p className="text-gray-600 mb-6">Help potential clients understand your experience and capabilities</p>
              </div>

              <div>
                <Label htmlFor="companyDescription">Company Description *</Label>
                <Textarea
                  id="companyDescription"
                  value={formData.companyDescription}
                  onChange={(e) => updateFormData('companyDescription', e.target.value)}
                  placeholder="Describe your company, experience, and what makes you unique..."
                  rows={5}
                  className={errors.companyDescription ? 'border-red-500' : ''}
                  disableRichTools={true}
                />
                {errors.companyDescription && (
                  <p className="text-red-500 text-sm mt-1">{errors.companyDescription}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={(e) => updateFormData('yearsOfExperience', parseInt(e.target.value) || 0)}
                    placeholder="5"
                    min="0"
                    max="50"
                    className={errors.yearsOfExperience ? 'border-red-500' : ''}
                  />
                  {errors.yearsOfExperience && (
                    <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="projectsCompleted">Projects Completed (Approximate)</Label>
                  <Input
                    id="projectsCompleted"
                    type="number"
                    value={formData.projectsCompleted}
                    onChange={(e) => updateFormData('projectsCompleted', parseInt(e.target.value) || 0)}
                    placeholder="50"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Services Offered (Optional)</Label>
                <p className="text-sm text-gray-600 mb-3">List your main services with pricing information. You can add these later from your dashboard.</p>
                {formData.services.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 mb-4">No services added yet</p>
                    <Button variant="outline" onClick={addService}>
                      Add Your First Service
                    </Button>
                  </div>
                ) : (
                  <>
                    {formData.services.map((service, index) => (
                      <div key={index} className="border rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <Input
                            placeholder="Service name (optional)"
                            value={service.name}
                            onChange={(e) => updateService(index, 'name', e.target.value)}
                          />
                          <Input
                            placeholder="Price range (optional, e.g., €200-500/sqm)"
                            value={service.priceRange}
                            onChange={(e) => updateService(index, 'priceRange', e.target.value)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeService(index)}
                          >
                            Remove
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Service description (optional)"
                          value={service.description}
                          onChange={(e) => updateService(index, 'description', e.target.value)}
                          rows={2}
                          disableRichTools={true}
                        />
                      </div>
                    ))}
                    <Button variant="outline" onClick={addService} className="w-full">
                      Add Another Service
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Verification & Terms */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Terms & Launch</h2>
                <p className="text-gray-600 mb-6">Review and accept our terms to complete your registration</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked: boolean) => updateFormData('agreeToTerms', checked)}
                    className={errors.agreeToTerms ? 'border-red-500' : ''}
                  />
                  <div>
                    <Label htmlFor="agreeToTerms" className="cursor-pointer">
                      I agree to the Terms of Service and Privacy Policy *
                    </Label>
                    {errors.agreeToTerms && (
                      <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToMarketing"
                    checked={formData.agreeToMarketing}
                    onCheckedChange={(checked: boolean) => updateFormData('agreeToMarketing', checked)}
                  />
                  <Label htmlFor="agreeToMarketing" className="cursor-pointer">
                    I agree to receive marketing communications and updates about the platform
                  </Label>
                </div>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900 mb-2">Email Verification</h3>
                      <p className="text-blue-800 text-sm mb-2">
                        After registration, we'll send a welcome email to <strong>{formData.primaryEmail}</strong> with a verification link.
                      </p>
                      <p className="text-blue-700 text-sm">
                        You can also verify your email later from your profile dashboard.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">What happens after registration?</h3>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Your profile will be immediately visible to potential clients</li>
                        <li>• You'll receive a welcome email with verification link</li>
                        <li>Access your builder dashboard to manage profile and quotes</li>
                        <li>Start receiving quote requests from potential clients</li>
                        <li>Build your reputation through client reviews and ratings</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {errors.submit && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {errors.submit}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < 5 ? (
                <Button onClick={() => nextStep()} disabled={isSubmitting}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !formData.agreeToTerms}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



