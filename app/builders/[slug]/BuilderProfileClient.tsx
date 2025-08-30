'use client';

import { useState, useEffect, useMemo } from 'react';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { LeadInquiryForm } from '@/components/LeadInquiryForm';
import { ProfileClaimSystem } from '@/components/ProfileClaimSystem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, Star, Users, Clock, Phone, Mail, Globe, 
  Award, Shield, CheckCircle, Quote, MessageCircle,
  Building, Calendar, Target, Eye, Zap, Camera, Info
} from 'lucide-react';
import { exhibitionBuilders } from '@/lib/data/exhibitionBuilders';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

interface BuilderProfileClientProps {
  slug: string;
  initialBuilder: any;
}

export default function BuilderProfileClient({ slug, initialBuilder }: BuilderProfileClientProps) {
  const [builder, setBuilder] = useState<any>(initialBuilder);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Claim listing functionality  
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimStep, setClaimStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState('');

  // Check if this is a GMB imported builder (unclaimed)
  const isGmbImported = builder?.id?.startsWith('gmb_');
  const isUnclaimed = isGmbImported && !builder?.verified;

  // Enhanced service logic for unclaimed GMB profiles
  const [allAvailableServices] = useState([
    { id: 'custom-design', name: 'Custom Stand Design', category: 'Design', description: 'Bespoke exhibition stand design tailored to your brand' },
    { id: 'modular-systems', name: 'Modular Systems', category: 'Design', description: 'Flexible modular exhibition systems' },
    { id: 'portable-displays', name: 'Portable Displays', category: 'Display', description: 'Easy-to-transport portable exhibition displays' },
    { id: 'double-deck', name: 'Double Deck Stands', category: 'Construction', description: 'Multi-level exhibition stands for maximum impact' },
    { id: 'sustainable-eco', name: 'Sustainable/Eco Stands', category: 'Eco', description: 'Environmentally friendly exhibition solutions' },
    { id: 'tech-integration', name: 'Technology Integration', category: 'Technology', description: 'Smart displays with integrated technology' },
    { id: 'interactive-displays', name: 'Interactive Displays', category: 'Technology', description: 'Engaging interactive exhibition experiences' },
    { id: 'led-lighting', name: 'LED & Lighting', category: 'Lighting', description: 'Professional lighting solutions for exhibitions' },
    { id: 'furniture-rental', name: 'Furniture Rental', category: 'Rental', description: 'Premium furniture rental for exhibitions' },
    { id: 'graphics-printing', name: 'Graphics & Printing', category: 'Graphics', description: 'High-quality graphics and printing services' },
    { id: 'installation', name: 'Installation Services', category: 'Services', description: 'Professional installation and setup services' },
    { id: 'project-management', name: 'Project Management', category: 'Management', description: 'End-to-end project management services' }
  ]);

  // Determine which services to show
  const displayServices = useMemo(() => {
    if (isUnclaimed && isGmbImported) {
      // For unclaimed GMB profiles, show ALL available services to encourage discovery
      console.log('🔄 Showing all available services for unclaimed GMB profile');
      return allAvailableServices.map(service => ({
        ...service,
        priceFrom: 300,
        currency: 'USD',
        unit: 'per sqm',
        popular: true,
        turnoverTime: '4-6 weeks',
        autoAssigned: true // Mark as auto-assigned for styling
      }));
    } else {
      // For claimed profiles or manually registered builders, show only selected services
      return builder?.services || [];
    }
  }, [builder?.services, isUnclaimed, isGmbImported, allAvailableServices]);

  useEffect(() => {
    const loadBuilderData = async () => {
      // Try to find builder from unified platform first
      const unifiedBuilders = unifiedPlatformAPI.getBuilders();
      let foundBuilder = unifiedBuilders.find(b => b.slug === slug);
      
      // Try static data
      if (!foundBuilder) {
        foundBuilder = exhibitionBuilders.find(b => b.slug === slug);
      }
      
      // Try GMB imported builders
      if (!foundBuilder) {
        try {
          console.log('🔍 Client: Checking GMB imported builders for slug:', slug);
          const gmbResponse = await fetch('/api/admin/gmb-integration?type=builders');
          
          if (gmbResponse.ok) {
            const gmbData = await gmbResponse.json();
            
            if (gmbData.success && gmbData.data.builders.length > 0) {
              // Find builder in GMB data and convert to ExhibitionBuilder format
              const gmbBuilder = gmbData.data.builders.find((b: any) => {
                const generatedSlug = b.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                return generatedSlug === slug;
              });
              
              if (gmbBuilder) {
                console.log('✅ Client: Found builder in GMB data:', gmbBuilder.companyName);
                
                // Convert GMB data to ExhibitionBuilder format
                foundBuilder = {
                  id: gmbBuilder.id,
                  companyName: gmbBuilder.companyName,
                  slug: gmbBuilder.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                  logo: '/images/builders/default-logo.png',
                  establishedYear: 2020,
                  headquarters: {
                    city: gmbBuilder.city || '',
                    country: gmbBuilder.country || '',
                    countryCode: 'XX',
                    address: '',
                    latitude: 0,
                    longitude: 0,
                    isHeadquarters: true
                  },
                  serviceLocations: [{
                    city: gmbBuilder.city || '',
                    country: gmbBuilder.country || '',
                    countryCode: 'XX',
                    address: '',
                    latitude: 0,
                    longitude: 0,
                    isHeadquarters: false
                  }],
                  contactInfo: {
                    primaryEmail: gmbBuilder.email || '',
                    phone: gmbBuilder.phone || '',
                    website: gmbBuilder.website || '',
                    contactPerson: 'Contact Person',
                    position: 'Manager'
                  },
                  services: displayServices,
                  specializations: [{
                    id: 'general',
                    name: 'Exhibition Builder',
                    slug: 'general',
                    description: gmbBuilder.description || 'Professional services',
                    subcategories: [],
                    color: '#3B82F6',
                    icon: '🏗️',
                    annualGrowthRate: 8.5,
                    averageBoothCost: 450,
                    popularCountries: []
                  }],
                  certifications: [],
                  awards: [],
                  portfolio: [],
                  teamSize: 10,
                  projectsCompleted: gmbBuilder.projectsCompleted || 25,
                  rating: gmbBuilder.rating || 4.0,
                  reviewCount: 50,
                  responseTime: gmbBuilder.responseTime || 'Within 24 hours',
                  languages: ['English'],
                  verified: gmbBuilder.verified || false,
                  premiumMember: gmbBuilder.featured || false,
                  tradeshowExperience: [],
                  priceRange: {
                    basicStand: { min: 200, max: 300, currency: 'USD', unit: 'per sqm' },
                    customStand: { min: 400, max: 600, currency: 'USD', unit: 'per sqm' },
                    premiumStand: { min: 700, max: 1000, currency: 'USD', unit: 'per sqm' },
                    averageProject: 25000,
                    currency: 'USD'
                  },
                  companyDescription: gmbBuilder.description || 'Professional exhibition services provider',
                  whyChooseUs: ['Experienced team', 'Quality service', 'Competitive pricing'],
                  clientTestimonials: [],
                  socialMedia: {},
                  businessLicense: gmbBuilder.id,
                  insurance: {
                    liability: 1000000,
                    currency: 'USD',
                    validUntil: '2025-12-31',
                    insurer: 'Professional Insurance'
                  },
                  sustainability: {
                    certifications: [],
                    ecoFriendlyMaterials: false,
                    wasteReduction: false,
                    carbonNeutral: false,
                    sustainabilityScore: 50
                  },
                  keyStrengths: ['Professional Service', 'Quality Work', 'Local Expertise'],
                  recentProjects: []
                };
              }
            }
          }
        } catch (error) {
          console.log('ℹ️ Client: Error loading GMB builders:', error);
        }
      }

      if (!foundBuilder) {
        console.log('❌ Client: Builder not found with slug:', slug);
        notFound();
        return;
      }

      setBuilder(foundBuilder);
      setLoading(false);

      console.log('👤 Builder profile loaded:', foundBuilder.companyName);
    };

    // Only reload if we don't have initial builder data
    if (!initialBuilder) {
      loadBuilderData();
    }

    // Subscribe to real-time updates
    const unsubscribe = unifiedPlatformAPI.subscribe((event) => {
      if (event.type === 'builder_updated' && event.data?.slug === slug) {
        loadBuilderData();
      }
    });

    return unsubscribe;
  }, [slug, initialBuilder]);

  const handleLeadSuccess = (leadId: string) => {
    console.log('✅ Lead submitted successfully for builder:', builder.companyName, leadId);
    setShowLeadModal(false);
  };

  const handleClaimStatusChange = (status: string) => {
    console.log('🔄 Claim status changed:', status);
    // Update builder status in real-time
    setBuilder((prev: any) => ({
      ...prev,
      claimed: status === 'verified',
      claimStatus: status,
      verified: status === 'verified'
    }));
  };

  // Claim listing functions
  const handleClaimListing = async () => {
    if (claimStep === 'phone') {
      setClaimLoading(true);
      setClaimError('');
      
      try {
        // Get phone from GMB data - no user input needed
        const gmbPhone = builder.contactInfo?.phone;
        if (!gmbPhone) {
          throw new Error('No phone number found in business data');
        }
        
        // In a real implementation, send OTP to the GMB phone number
        console.log('📱 Sending OTP to GMB registered number:', gmbPhone);
        
        // Auto-advance to OTP step since we have the phone
        setClaimStep('otp');
      } catch (error) {
        setClaimError(error instanceof Error ? error.message : 'Phone verification failed');
      } finally {
        setClaimLoading(false);
      }
    } else if (claimStep === 'otp') {
      setClaimLoading(true);
      setClaimError('');
      
      try {
        // In a real implementation, verify OTP here
        if (otpCode !== '123456') { // Demo OTP
          throw new Error('Invalid OTP code');
        }
        
        console.log('✅ OTP verified, claiming listing for:', builder.companyName);
        setClaimStep('success');
        
        // Update builder as verified/claimed
        const updatedBuilder = { ...builder, verified: true };
        setBuilder(updatedBuilder);
        
      } catch (error) {
        setClaimError(error instanceof Error ? error.message : 'OTP verification failed');
      } finally {
        setClaimLoading(false);
      }
    }
  };

  // Format phone number for display (masking)
  const getMaskedPhone = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      const countryCode = cleaned.slice(0, -10);
      const areaCode = cleaned.slice(-10, -7);
      const middle = cleaned.slice(-7, -4);
      const last = cleaned.slice(-4);
      return `+${countryCode} ${areaCode}****${last}`;
    }
    return phone.slice(0, 3) + '****' + phone.slice(-3);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!builder) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <Building className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    {builder.companyName}
                  </h1>
                  <div className="flex items-center gap-4 text-blue-100">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{builder.headquarters.city}, {builder.headquarters.country}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-300" />
                      <span>{builder.rating} ({builder.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xl text-blue-100 mb-6 max-w-2xl">
                {builder.companyDescription}
              </p>

              <div className="flex flex-wrap gap-3">
                {builder.verified && (
                  <Badge className="bg-claret-500 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified Builder
                  </Badge>
                )}
                {isGmbImported && !builder.verified && (
                  <Badge className="bg-orange-500 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    GMB Imported
                  </Badge>
                )}
                {builder.premiumMember && (
                  <Badge className="bg-yellow-500 text-yellow-900">
                    <Award className="w-3 h-3 mr-1" />
                    Premium Member
                  </Badge>
                )}
                <Badge className="bg-blue-500 text-white">
                  <Users className="w-3 h-3 mr-1" />
                  {builder.projectsCompleted} Projects
                </Badge>
                <Badge className="bg-purple-500 text-white">
                  <Clock className="w-3 h-3 mr-1" />
                  {builder.responseTime}
                </Badge>
              </div>
            </div>

            {/* Lead Form Card */}
            <div className="lg:col-span-1">
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Quote className="w-5 h-5" />
                    Get Free Quote
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Connect with verified exhibition stand builders in {`${builder.headquarters.city}, ${builder.headquarters.country}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Response Time</span>
                      <Badge variant="outline" className="text-gray-900">{builder.responseTime}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Projects Completed</span>
                      <Badge variant="outline" className="text-gray-900">{builder.projectsCompleted}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Average Rating</span>
                      <Badge variant="outline" className="text-yellow-600">
                        <Star className="w-3 h-3 mr-1" />
                        {builder.rating}/5
                      </Badge>
                    </div>
                  </div>

                  <Dialog open={showLeadModal} onOpenChange={setShowLeadModal}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        <Quote className="w-4 h-4 mr-2" />
                        Request Quote
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Request Quote from {builder.companyName}</DialogTitle>
                        <DialogDescription>
                          Get a personalized quote for your exhibition stand requirements
                        </DialogDescription>
                      </DialogHeader>
                      <LeadInquiryForm
                        builderId={builder.id}
                        builderName={builder.companyName}
                        builderLocation={`${builder.headquarters.city}, ${builder.headquarters.country}`}
                        isModal={true}
                        onClose={() => setShowLeadModal(false)}
                        onSuccess={handleLeadSuccess}
                      />
                    </DialogContent>
                  </Dialog>

                  {/* Profile Claim System Component */}
                  <div className="mt-4">
                    <ProfileClaimSystem 
                      builder={{
                        id: builder.id,
                        companyName: builder.companyName,
                        contactInfo: builder.contactInfo,
                        headquarters: builder.headquarters,
                        verified: builder.verified,
                        claimed: builder.claimed,
                        claimStatus: builder.claimStatus || 'unclaimed',
                        planType: builder.planType || 'free'
                      }}
                      onClaimStatusChange={handleClaimStatusChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button variant="outline" size="sm" className="w-full text-gray-900">
                      <Eye className="w-3 h-3 mr-2" />
                      View Portfolio
                    </Button>
                  </div>

                  {/* Protected Contact Info */}
                  <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Your request will be sent to verified builders in this location
                    </div>
                    <div className="space-y-1 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        <span>Multiple builders will respond with quotes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3" />
                        <span>Compare offers from {builder.headquarters.city} experts</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Company Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">About Us</h4>
                        <p className="text-gray-700">{builder.companyDescription}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Strengths</h4>
                        <ul className="space-y-1">
                          {builder.keyStrengths.map((strength: string, index: number) => (
                            <li key={index} className="flex items-center gap-2 text-gray-700">
                              <CheckCircle className="w-4 h-4 text-claret-500" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Established</h4>
                        <p className="text-gray-700">{builder.establishedYear}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Specializations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {builder.specializations.map((spec: any) => (
                        <div 
                          key={spec.id}
                          className="flex items-center gap-3 p-3 rounded-lg border"
                          style={{ backgroundColor: spec.color + '10', borderColor: spec.color + '30' }}
                        >
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                            style={{ backgroundColor: spec.color + '20', color: spec.color }}
                          >
                            {spec.icon}
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{spec.name}</h5>
                            <p className="text-sm text-gray-600">{spec.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              {isUnclaimed && isGmbImported && (
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>All Services Available:</strong> This business offers comprehensive exhibition services. 
                    Once claimed, the owner can customize which specific services to highlight.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayServices.map((service: any, index: number) => (
                  <Card key={index} className={service.autoAssigned ? 'border-blue-200 bg-blue-50/50' : ''}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        {service.name}
                        {service.autoAssigned && (
                          <Badge variant="outline" className="text-blue-600 border-blue-300">
                            Available
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-3">{service.description}</p>
                      {service.priceFrom && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">From ${service.priceFrom}</span>
                          {service.unit && <span> {service.unit}</span>}
                        </div>
                      )}
                      {service.turnoverTime && (
                        <div className="text-xs text-gray-500 mt-2">
                          Typical delivery: {service.turnoverTime}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <div className="text-center py-12">
                <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">Portfolio Gallery</h3>
                <p className="text-gray-500 mb-4">
                  Request a quote to view {builder.companyName}'s complete portfolio and project gallery.
                </p>
                <Button onClick={() => setShowLeadModal(true)}>
                  <Quote className="w-4 h-4 mr-2" />
                  Request Portfolio Access
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="locations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Service Locations
                  </CardTitle>
                  <CardDescription>
                    Countries and cities where {builder.companyName} provides services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {builder.serviceLocations.map((location: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>{location.city}, {location.country}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">Client Reviews</h3>
                <p className="text-gray-500 mb-4">
                  View detailed client reviews and testimonials after requesting a quote.
                </p>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-2xl font-bold text-yellow-600">{builder.rating}/5</div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.floor(builder.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-gray-600">({builder.reviewCount} reviews)</div>
                </div>
                <Button onClick={() => setShowLeadModal(true)}>
                  <Quote className="w-4 h-4 mr-2" />
                  Request Quote to View Reviews
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}