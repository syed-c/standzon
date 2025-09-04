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
import BuilderProfileTemplate from '@/components/BuilderProfileTemplate';
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

                  <Dialog open={showLeadModal} onOpenChange={setShowLeadModal}>
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

      <BuilderProfileTemplate
        builder={builder}
        isGmbImported={isGmbImported}
        displayServices={displayServices}
        onOpenQuote={() => setShowLeadModal(true)}
      />

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}