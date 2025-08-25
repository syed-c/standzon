'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import LocationSelector from '@/components/LocationSelector';
import LocationDisplay from '@/components/LocationDisplay';
import PhoneInput from '@/components/PhoneInput';
import type { LocationSelection } from '@/lib/utils/globalLocationManager';
import { 
  Building, MapPin, Mail, Phone, User, Calendar, 
  Ruler, DollarSign, MessageSquare, Send, CheckCircle,
  Shield, Star, Award
} from 'lucide-react';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

interface LeadFormData {
  companyName: string;
  email: string;
  phone: string;
  exhibitionName: string;
  boothSize: string;
  location: LocationSelection;
  budget: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
}

interface LeadFormProps {
  builderId?: string;
  builderName?: string;
  builderLocation?: string;
  isModal?: boolean;
  onClose?: () => void;
  onSuccess?: (leadId: string) => void;
}

const EXHIBITION_OPTIONS = [
  'CES 2025', 'Hannover Messe', 'SIAL Paris', 'Bauma Munich', 'Drupa Düsseldorf',
  'K Fair Düsseldorf', 'ISH Frankfurt', 'Automechanika Frankfurt', 'ITB Berlin',
  'MEDICA Düsseldorf', 'Euroshop Düsseldorf', 'Art Basel', 'FIBO Cologne',
  'IFA Berlin', 'Mobile World Congress', 'NAB Show Las Vegas', 'Other - not listed'
];

const BOOTH_SIZE_OPTIONS = [
  'Small (3x3m)', 'Medium (6x6m)', 'Large (9x9m)', 'Extra Large (12x12m)',
  'Island Booth (15x15m)', 'Peninsula Booth', 'Custom Size'
];

const BUDGET_RANGES = [
  'Under $10,000', '$10,000 - $25,000', '$25,000 - $50,000', 
  '$50,000 - $100,000', '$100,000 - $250,000', 'Over $250,000', 'To be discussed'
];

export function LeadInquiryForm({ 
  builderId, 
  builderName, 
  builderLocation, 
  isModal = false, 
  onClose, 
  onSuccess 
}: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    companyName: '',
    email: '',
    phone: '',
    exhibitionName: '',
    boothSize: '',
    location: {},
    budget: '',
    message: '',
    urgency: 'medium'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [customExhibitionName, setCustomExhibitionName] = useState('');
  const [showCustomExhibition, setShowCustomExhibition] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof LeadFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExhibitionChange = (value: string) => {
    if (value === 'Other - not listed') {
      setShowCustomExhibition(true);
      setFormData(prev => ({ ...prev, exhibitionName: '' }));
    } else {
      setShowCustomExhibition(false);
      setCustomExhibitionName('');
      setFormData(prev => ({ ...prev, exhibitionName: value }));
    }
  };

  const handleCustomExhibitionChange = (value: string) => {
    setCustomExhibitionName(value);
    setFormData(prev => ({ ...prev, exhibitionName: value }));
  };

  const generateLeadId = () => {
    return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('🚀 Submitting lead inquiry...', formData);

      // Generate unique lead ID
      const leadId = generateLeadId();

      // Create lead object
      const leadData = {
        id: leadId,
        ...formData,
        builderId: builderId || 'general',
        builderName: builderName || 'General Inquiry',
        builderLocation: builderLocation || 'Multiple Locations',
        country: formData.location.country || '',
        city: formData.location.city || '',
        continent: formData.location.continent || '',
        timestamp: new Date().toISOString(),
        status: 'new',
        source: 'website_form',
        leadScore: calculateLeadScore(formData),
        estimatedValue: extractBudgetValue(formData.budget)
      };

      // Submit to unified platform API
      const result = await submitLead(leadData);
      
      console.log('✅ Lead submitted successfully:', result);

      // Show success state
      setIsSuccess(true);
      
      toast({
        title: "Request Sent Successfully!",
        description: `Your request has been sent to verified builders in ${builderLocation || 'your target location'}. You'll receive multiple quotes within 24 hours.`,
        duration: 5000,
      });

      // Call success callback
      if (onSuccess) {
        onSuccess(leadId);
      }

      // Auto-close modal after 3 seconds
      if (isModal && onClose) {
        setTimeout(() => {
          onClose();
        }, 3000);
      }

    } catch (error) {
      console.error('❌ Error submitting lead:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error sending your inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateLeadScore = (data: LeadFormData): number => {
    let score = 50; // Base score

    // Budget impact
    if (data.budget.includes('Over $250,000')) score += 40;
    else if (data.budget.includes('$100,000 - $250,000')) score += 30;
    else if (data.budget.includes('$50,000 - $100,000')) score += 20;
    else if (data.budget.includes('$25,000 - $50,000')) score += 15;
    else if (data.budget.includes('$10,000 - $25,000')) score += 10;

    // Urgency impact
    if (data.urgency === 'high') score += 20;
    else if (data.urgency === 'medium') score += 10;

    // Booth size impact
    if (data.boothSize.includes('Island') || data.boothSize.includes('Extra Large')) score += 15;
    else if (data.boothSize.includes('Large')) score += 10;
    else if (data.boothSize.includes('Medium')) score += 5;

    // Company details completeness
    if (data.companyName && data.email && data.phone) score += 15;
    if (data.message.length > 50) score += 10;

    return Math.min(score, 100);
  };

  const extractBudgetValue = (budget: string): number => {
    if (budget.includes('Over $250,000')) return 300000;
    if (budget.includes('$100,000 - $250,000')) return 175000;
    if (budget.includes('$50,000 - $100,000')) return 75000;
    if (budget.includes('$25,000 - $50,000')) return 37500;
    if (budget.includes('$10,000 - $25,000')) return 17500;
    if (budget.includes('Under $10,000')) return 5000;
    return 0;
  };

  const submitLead = async (leadData: any) => {
    console.log('🚀 Submitting lead to API:', leadData);
    
    const response = await fetch('/api/leads/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit lead');
    }
    
    return result;
  };

  if (isSuccess) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Inquiry Sent Successfully!</h3>
          <p className="text-gray-600 mb-4">
            Thank you for your interest. {builderLocation ? `Verified builders in ${builderLocation}` : 'Our verified builders'} will review your requirements and the best matches will contact you within 24 hours.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center text-green-800 text-sm">
              <Shield className="w-4 h-4 mr-2" />
              Your request will be sent to multiple qualified builders who can serve your location and requirements.
            </div>
          </div>
          {isModal && onClose && (
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Request Exhibition Stand Quote
        </CardTitle>
        <CardDescription className="text-blue-100">
          {builderId ? (
            <>Connect with verified exhibition stand builders in <strong>{builderLocation}</strong></>
          ) : (
            'Connect with verified exhibition stand builders worldwide'
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Info (if specified) */}
          {builderId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Builders in {builderLocation}</h4>
                    <p className="text-sm text-blue-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Multiple verified builders available
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Badge className="bg-green-100 text-green-800">
                    <Star className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800">
                    <Award className="w-3 h-3 mr-1" />
                    Local Experts
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Company Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Company Name *
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Your company name"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number *
            </Label>
            <PhoneInput
              value={formData.phone}
              onChange={(value) => handleInputChange('phone', value)}
              label="Phone Number"
              placeholder="123 456 7890"
              required
              className="mt-4"
            />
          </div>

          {/* Exhibition Details */}
          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Exhibition Details
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exhibitionName">Exhibition Name *</Label>
                <Select 
                  value={showCustomExhibition ? 'Other - not listed' : formData.exhibitionName} 
                  onValueChange={handleExhibitionChange}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select exhibition" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXHIBITION_OPTIONS.map((exhibition) => (
                      <SelectItem key={exhibition} value={exhibition}>
                        {exhibition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {showCustomExhibition && (
                  <div className="mt-2">
                    <Input
                      value={customExhibitionName}
                      onChange={(e) => handleCustomExhibitionChange(e.target.value)}
                      placeholder="Enter exhibition name..."
                      className="w-full"
                      required
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="boothSize" className="flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Booth Size *
                </Label>
                <Select value={formData.boothSize} onValueChange={(value) => handleInputChange('boothSize', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select booth size" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOOTH_SIZE_OPTIONS.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="location">Event Location *</Label>
              <LocationSelector
                onLocationChange={(location) => setFormData(prev => ({ ...prev, location }))}
                value={formData.location}
                mode="full"
                placeholder="Select event location..."
              />
            </div>

            {(formData.location.country || formData.location.city) && (
              <div className="mt-4">
                <LocationDisplay
                  country={formData.location.country}
                  city={formData.location.city}
                  mode="detailed"
                  showStats
                  showBuilders
                />
              </div>
            )}
          </div>

          {/* Budget & Requirements */}
          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Budget & Requirements
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Budget Range</Label>
                <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select budget range" />
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

              <div>
                <Label htmlFor="urgency">Project Urgency</Label>
                <Select value={formData.urgency} onValueChange={(value: 'low' | 'medium' | 'high') => handleInputChange('urgency', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Planning ahead</SelectItem>
                    <SelectItem value="medium">Medium - Within 3-6 months</SelectItem>
                    <SelectItem value="high">High - Urgent (within 1-3 months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="message" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Additional Requirements
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Describe your specific requirements, design preferences, or any special needs for your exhibition stand..."
                rows={4}
                className="mt-1"
              />
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">Privacy & Smart Matching</p>
                <p>Your request will be sent to qualified builders who match your location, budget, and requirements. Only verified builders in your target area will receive your details.</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Inquiry
                </>
              )}
            </Button>
            
            {isModal && onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default LeadInquiryForm;