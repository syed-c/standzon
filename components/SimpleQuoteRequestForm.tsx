'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, Upload, FileText, CheckCircle, AlertCircle, 
  Calendar, MapPin, Building, Users, Mail, Phone, User
} from 'lucide-react';
import { toast } from 'sonner';

interface SimpleQuoteRequestFormProps {
  defaultCountry?: string;
  defaultCity?: string;
  showFileUpload?: boolean;
  onSubmit?: (data: any) => void;
  className?: string;
}

export default function SimpleQuoteRequestForm({ 
  defaultCountry, 
  defaultCity, 
  showFileUpload = true,
  onSubmit,
  className = ""
}: SimpleQuoteRequestFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: defaultCountry || '',
    city: defaultCity || '',
    exhibition: '',
    standSize: '',
    budget: '',
    timeline: '',
    requirements: '',
    hasDesign: false,
    designFiles: [] as File[]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const countries = [
    'United States', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 
    'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'China', 'Japan', 
    'Singapore', 'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'India',
    'Australia', 'Canada', 'Brazil', 'Mexico', 'South Africa', 'Egypt'
  ];

  const standSizes = [
    '9 sqm (3x3m)', '18 sqm (3x6m)', '36 sqm (6x6m)', '54 sqm (6x9m)',
    '72 sqm (8x9m)', '100 sqm (10x10m)', '200+ sqm', 'Custom Size'
  ];

  const budgetRanges = [
    'Under $5,000', '$5,000 - $15,000', '$15,000 - $30,000', 
    '$30,000 - $50,000', '$50,000 - $100,000', 'Over $100,000'
  ];

  const timelines = [
    'Less than 1 month', '1-2 months', '2-3 months', 
    '3-6 months', 'More than 6 months'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/zip', 'application/x-rar-compressed'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type`);
        return false;
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      
      return true;
    });
    
    setFormData(prev => ({
      ...prev,
      designFiles: [...prev.designFiles, ...validFiles]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      designFiles: prev.designFiles.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.country) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'designFiles') {
          submitData.append(key, value.toString());
        }
      });
      
      // Add files
      formData.designFiles.forEach((file, index) => {
        submitData.append(`designFile_${index}`, file);
      });

      const response = await fetch('/api/leads/submit', {
        method: 'POST',
        body: submitData
      });

      if (!response.ok) {
        throw new Error('Failed to submit quote request');
      }

      const result = await response.json();
      
      if (result.success) {
        setIsSubmitted(true);
        toast.success('Quote request submitted successfully!');
        
        if (onSubmit) {
          onSubmit(formData);
        }
      } else {
        throw new Error(result.error || 'Failed to submit quote request');
      }
      
    } catch (error) {
      console.error('❌ Error submitting quote request:', error);
      toast.error('Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quote Request Submitted!
              </h3>
              <p className="text-gray-600 mb-4">
                You can expect a quotation from 3 to 5 builders matching your requirements.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>What happens next?</strong><br/>
                  • Our system will match you with qualified builders in {formData.country}<br/>
                  • Selected builders will review your requirements<br/>
                  • You'll receive detailed quotations within 24-48 hours<br/>
                  • Compare proposals and choose the best fit for your project
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Request Quote
        </CardTitle>
        <CardDescription>
          Get free quotes from professional exhibition stand builders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Enter your company name"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Exhibition Location</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter city name"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Project Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exhibition/Trade Show
                </label>
                <Input
                  type="text"
                  value={formData.exhibition}
                  onChange={(e) => handleInputChange('exhibition', e.target.value)}
                  placeholder="e.g., CES 2024, Hannover Messe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stand Size
                </label>
                <Select value={formData.standSize} onValueChange={(value) => handleInputChange('standSize', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stand size" />
                  </SelectTrigger>
                  <SelectContent>
                    {standSizes.map(size => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map(budget => (
                      <SelectItem key={budget} value={budget}>{budget}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline
                </label>
                <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {timelines.map(timeline => (
                      <SelectItem key={timeline} value={timeline}>{timeline}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Additional Requirements</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description
              </label>
              <Textarea
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                placeholder="Describe your exhibition stand requirements, special features, branding needs, etc."
                rows={4}
              />
            </div>
          </div>

          {/* File Upload */}
          {showFileUpload && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="hasDesign"
                  checked={formData.hasDesign}
                  onChange={(e) => handleInputChange('hasDesign', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="hasDesign" className="text-sm font-medium text-gray-700">
                  I have the design ready
                </label>
              </div>
              
              {formData.hasDesign && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Design Files
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload your design files (PDF, JPG, PNG, ZIP, RAR)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.zip,.rar"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="fileUpload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('fileUpload')?.click()}
                    >
                      Choose Files
                    </Button>
                  </div>
                  
                  {formData.designFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
                      {formData.designFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {(file.size / 1024 / 1024).toFixed(1)} MB
                            </Badge>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting Request...
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2 text-white" />
                  Submit Quote Request
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            By submitting this form, you agree to be contacted by qualified exhibition stand builders.
          </div>
        </form>
      </CardContent>
    </Card>
  );
}