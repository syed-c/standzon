'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import PhoneInput from '@/components/PhoneInput';
import { 
  Send, MapPin, Users, Building2, Star, Award, 
  Calendar, TrendingUp, Phone, Mail, User, Building
} from 'lucide-react';

interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage?: string;
  ctaText: string;
}

interface LocationStats {
  totalBuilders: number;
  verifiedBuilders: number;
  averageRating: number;
  totalProjects: number;
}

interface Exhibition {
  id: string;
  name: string;
  date: string;
  venue: string;
}

interface EnhancedHeroWithQuoteProps {
  locationName: string;
  locationType: 'country' | 'city';
  heroData: HeroData;
  stats: LocationStats;
  exhibitions?: Exhibition[];
  primaryColor?: string;
  accentColor?: string;
  backgroundImage?: string;
}

interface QuoteFormData {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  selectedExhibition: string;
  projectBudget: string;
  message: string;
}

export function EnhancedHeroWithQuote({
  locationName,
  locationType,
  heroData,
  stats,
  exhibitions = [],
  primaryColor = '#ec4899',
  accentColor = '#f97316',
  backgroundImage
}: EnhancedHeroWithQuoteProps) {
  const [formData, setFormData] = useState<QuoteFormData>({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    selectedExhibition: '',
    projectBudget: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomExhibition, setShowCustomExhibition] = useState(false);
  const [customExhibitionName, setCustomExhibitionName] = useState('');
  const { toast } = useToast();

  const budgetRanges = [
    '$5,000 - $15,000',
    '$15,000 - $30,000', 
    '$30,000 - $50,000',
    '$50,000 - $100,000',
    '$100,000+'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('🚀 Submitting quote form to API:', formData);
      
      // Submit to the actual API endpoint
      const response = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          selectedExhibition: formData.selectedExhibition,
          projectBudget: formData.projectBudget,
          message: formData.message,
          location: {
            country: locationName.includes(',') ? locationName.split(',')[1].trim() : locationName,
            city: locationName.includes(',') ? locationName.split(',')[0].trim() : ''
          },
          urgency: 'medium',
          source: 'hero_form'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Quote form submitted successfully:', result);
        
        toast({
          title: "Quote Request Sent!",
          description: `Your request has been sent to ${result.data.matchingBuilders} verified builders. You'll receive quotes within 24 hours.`,
        });

        // Reset form
        setFormData({
          fullName: '',
          companyName: '',
          email: '',
          phone: '',
          selectedExhibition: '',
          projectBudget: '',
          message: ''
        });
      } else {
        throw new Error(result.error || 'Failed to submit quote request');
      }
    } catch (error) {
      console.error('❌ Quote form submission error:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof QuoteFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExhibitionChange = (value: string) => {
    if (value === 'other-not-listed') {
      setShowCustomExhibition(true);
      setFormData(prev => ({ ...prev, selectedExhibition: '' }));
    } else {
      setShowCustomExhibition(false);
      setCustomExhibitionName('');
      setFormData(prev => ({ ...prev, selectedExhibition: value }));
    }
  };

  const handleCustomExhibitionChange = (value: string) => {
    setCustomExhibitionName(value);
    setFormData(prev => ({ ...prev, selectedExhibition: value }));
  };

  const heroStyle = {
    background: backgroundImage 
      ? `linear-gradient(135deg, ${primaryColor}e6 0%, ${accentColor}e6 100%), url('${backgroundImage}') center/cover`
      : `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
  };

  return (
    <section className="relative overflow-hidden" style={heroStyle}>
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)',
          backgroundSize: '24px 24px'
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Hero content */}
          <div className="text-white space-y-8">
            {/* Location badge */}
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <MapPin className="w-3 h-3 mr-1" />
                {locationType === 'city' ? 'City' : 'Country'} Page
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Users className="w-3 h-3 mr-1" />
                {stats.totalBuilders} Builders
              </Badge>
            </div>

            {/* Main hero content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {heroData.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 font-medium">
                {heroData.subtitle}
              </p>
              
              <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
                {heroData.description}
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {stats.totalBuilders}
                </div>
                <div className="text-white/70 text-sm">Total Builders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {stats.verifiedBuilders}
                </div>
                <div className="text-white/70 text-sm">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center gap-1">
                  {stats.averageRating.toFixed(1)}
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div className="text-white/70 text-sm">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {stats.totalProjects.toLocaleString()}
                </div>
                <div className="text-white/70 text-sm">Projects</div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-white/80">
                <Award className="w-4 h-4" />
                <span className="text-sm">Verified Professionals</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">24-Hour Response</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Competitive Pricing</span>
              </div>
            </div>
          </div>

          {/* Right side - Quote form */}
          <div className="lg:mt-8">
            <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-pink-600" />
                  Get Free Quote from {locationName} Builders
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  Connect with verified exhibition stand builders and get competitive quotes
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateFormData('fullName', e.target.value)}
                        className="mt-1"
                        placeholder="John Smith"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                        Company Name *
                      </Label>
                      <Input
                        id="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => updateFormData('companyName', e.target.value)}
                        className="mt-1"
                        placeholder="Your Company Ltd"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className="mt-1"
                        placeholder="john@company.com"
                        required
                      />
                    </div>
                    <div>
                      <PhoneInput
                        value={formData.phone}
                        onChange={(value) => updateFormData('phone', value)}
                        label="Phone Number"
                        placeholder="123 456 7890"
                        required
                      />
                    </div>
                  </div>

                  {exhibitions.length > 0 && (
                    <div>
                      <Label htmlFor="exhibition" className="text-sm font-medium text-gray-700">
                        Select Exhibition (Optional)
                      </Label>
                      <Select 
                        value={showCustomExhibition ? 'other-not-listed' : formData.selectedExhibition} 
                        onValueChange={handleExhibitionChange}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose an exhibition..." />
                        </SelectTrigger>
                        <SelectContent position="popper" align="start" sideOffset={4} className="z-50">
                          {exhibitions.map((exhibition) => (
                            <SelectItem key={exhibition.id} value={exhibition.id}>
                              {exhibition.name} - {exhibition.date}
                            </SelectItem>
                          ))}
                          <SelectItem value="other-not-listed">
                            Other - not listed
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {showCustomExhibition && (
                        <div className="mt-2">
                          <Input
                            value={customExhibitionName}
                            onChange={(e) => handleCustomExhibitionChange(e.target.value)}
                            placeholder="Enter exhibition name..."
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="budget" className="text-sm font-medium text-gray-700">
                      Project Budget *
                    </Label>
                    <Select value={formData.projectBudget} onValueChange={(value) => updateFormData('projectBudget', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select budget range..." />
                      </SelectTrigger>
                      <SelectContent position="popper" align="start" sideOffset={4} className="z-50">
                        {budgetRanges.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                      Project Details
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => updateFormData('message', e.target.value)}
                      className="mt-1"
                      rows={3}
                      placeholder="Tell us about your exhibition stand requirements, size, location, timeline, etc."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending Request...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {heroData.ctaText || 'Get Free Quote'}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-2">
                    By submitting this form, you agree to be contacted by verified builders. 
                    No spam, unsubscribe anytime.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EnhancedHeroWithQuote;