'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PublicQuoteRequest from './PublicQuoteRequest';
import { ProfileClaimSystem } from './ProfileClaimSystem';
import { 
  Quote, Star, MapPin, Users, Clock, 
  Shield, Award, CheckCircle2,
  ArrowRight, Zap, Target, AlertCircle
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Builder {
  id: string;
  companyName: string;
  slug: string;
  headquarters: {
    city: string;
    country: string;
  };
  rating: number;
  reviewCount: number;
  projectsCompleted: number;
  responseTime: string;
  verified: boolean;
  premiumMember: boolean;
  planType: 'free' | 'basic' | 'professional' | 'enterprise';
  services: Array<string>;
  specializations: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
  companyDescription: string;
  keyStrengths: string[];
  logo?: string;
  companyLogo?: string;
  location?: string;
  experience?: string;
  projects?: string;
  description?: string;
}

interface BuilderCardProps {
  builder: Builder;
  showLeadForm?: boolean;
  location?: string;
}

function getBuilderPlanBadge(planType: string, premiumMember: boolean) {
  if (premiumMember) {
    return (
      <Badge className="bg-gradient-to-r from-russian-violet-500 to-dark-purple-500 text-white">
        <Award className="w-3 h-3 mr-1" />
        Premium
      </Badge>
    );
  }

  switch (planType) {
    case 'enterprise':
      return (
        <Badge className="bg-gradient-to-r from-claret-500 to-persian-orange-500 text-white">
          <Zap className="w-3 h-3 mr-1" />
          Enterprise
        </Badge>
      );
    case 'professional':
      return (
        <Badge className="bg-gradient-to-r from-russian-violet-500 to-russian-violet-700 text-white">
          <Target className="w-3 h-3 mr-1" />
          Professional
        </Badge>
      );
    case 'basic':
      return (
        <Badge className="bg-gradient-to-r from-claret-500 to-persian-orange-700 text-white">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Basic
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-gray-600">
          Free Plan
        </Badge>
      );
  }
}

function getClaimStatusBadge(builder: any) {
  const claimed = (builder as any).claimed;
  const claimStatus = (builder as any).claimStatus || 'unclaimed';
  
  if (claimed && claimStatus === 'verified') {
    return (
      <Badge className="bg-claret-100 text-claret-800 border-claret-200 text-xs">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Claimed & Verified
      </Badge>
    );
  }
  
  if (claimStatus === 'pending') {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
        <Clock className="w-3 h-3 mr-1" />
        Verification Pending
      </Badge>
    );
  }
  
  if (!claimed || claimStatus === 'unclaimed') {
    return (
      <Badge className="bg-russian-violet-100 text-russian-violet-800 text-xs">
        <AlertCircle className="w-3 h-3 mr-1" />
        Unclaimed
      </Badge>
    );
  }
  
  return null;
}

function getMembershipBadge(premiumMember: boolean) {
  if (premiumMember) {
    return (
      <Badge className="bg-gradient-to-r from-russian-violet-500 to-dark-purple-500 text-white">
        <Award className="w-3 h-3 mr-1" />
        Premium
      </Badge>
    );
  }
  return null;
}

function BuilderContactControls({ builder, location }: { builder: Builder; location?: string }) {
  const handleClaimStatusChange = (status: string) => {
    console.log('🔄 Claim status changed for builder:', builder.id, status);
    // In a real app, you might want to update the builder data
  };

  // Privacy-protected contact info - only pass safe data
  const safeContactInfo = {
    primaryEmail: '', // Hidden for privacy
    phone: '', // Hidden for privacy
    website: (builder as any).contactInfo?.website || '' // Only for claiming, not display
  };

  return (
    <div className="space-y-3">
      {/* Primary CTA - Request Quote */}
      <PublicQuoteRequest 
        builderId={builder.id}
        location={`${builder.headquarters.city}, ${builder.headquarters.country}`}
        buttonText="Request Quote"
        className="w-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:via-rose-700 hover:to-pink-800 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
      />

      {/* Profile Claim System - Now with privacy protection */}
      <ProfileClaimSystem 
        builder={{
          id: builder.id,
          companyName: builder.companyName,
          contactInfo: safeContactInfo, // Privacy-protected contact info
          headquarters: builder.headquarters,
          verified: builder.verified,
          claimed: (builder as any).claimed,
          claimStatus: (builder as any).claimStatus || 'unclaimed',
          planType: builder.planType
        }}
        onClaimStatusChange={handleClaimStatusChange}
      />

      {/* View Profile Button */}
      <Link href={`/builders/${builder.slug}`} className="block">
        <Button variant="outline" size="sm" className="w-full text-gray-900 border-gray-300 hover:bg-gray-50">
          <ArrowRight className="w-3 h-3 mr-2" />
          View Profile
        </Button>
      </Link>
    </div>
  );
}

export function BuilderCard({ builder, showLeadForm = true, location }: BuilderCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
      <CardContent className="p-4">
        {/* Header with Company Info */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={builder.logo || builder.companyLogo} alt={builder.companyName} />
              <AvatarFallback className="bg-russian-violet-100 text-russian-violet-800 font-semibold">
                {builder.companyName?.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || 'BB'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-russian-violet-600 transition-colors line-clamp-1">
                {builder.companyName}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-1">{builder.location}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            {getMembershipBadge(builder.premiumMember)}
            {getClaimStatusBadge(builder)}
          </div>
        </div>

        {/* Company Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {builder.description || builder.companyDescription || "Professional exhibition stand builder with years of experience in creating stunning displays."}
        </p>

        {/* Key Information */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">{builder.experience || '5'}+</div>
            <div className="text-xs text-gray-600">Years</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">{builder.projects || '50'}+</div>
            <div className="text-xs text-gray-600">Projects</div>
          </div>
        </div>

        {/* Services */}
        {builder.services && builder.services.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {builder.services.slice(0, 3).map((service: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs bg-russian-violet-50 text-russian-violet-700">
                  {service}
                </Badge>
              ))}
              {builder.services.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                  +{builder.services.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Key Strengths */}
        {builder.keyStrengths && builder.keyStrengths.length > 0 && (
          <div className="mb-3">
            <ul className="space-y-1">
              {builder.keyStrengths.slice(0, 3).map((strength, index) => (
                <li key={index} className="flex items-center gap-1 text-xs text-gray-600">
                  <CheckCircle2 className="w-3 h-3 text-claret-500 flex-shrink-0" />
                  <span className="line-clamp-1">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {builder.verified && !(builder as any).claimed && (
              <Badge className="bg-russian-violet-100 text-russian-violet-800 text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
            {builder.rating && (
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span>{builder.rating}</span>
              </div>
            )}
          </div>
          <Button size="sm" className="bg-russian-violet-600 hover:bg-russian-violet-700 text-white">
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default BuilderCard;

