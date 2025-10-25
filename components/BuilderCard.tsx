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
  services: Array<{
    name: string;
    description: string;
  }>;
  specializations: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
  companyDescription: string;
  keyStrengths: string[];
  serviceLocations?: Array<{
    country: string;
    cities: string[];
  }>;
}

interface BuilderCardProps {
  builder: Builder;
  showLeadForm?: boolean;
  location?: string;
}

function getBuilderPlanBadge(planType: string, premiumMember: boolean) {
  if (premiumMember) {
    return (
      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900">
        <Award className="w-3 h-3 mr-1" />
        Premium
      </Badge>
    );
  }

  switch (planType) {
    case 'enterprise':
      return (
        <Badge className="bg-gradient-to-r from-purple-500 to-purple-700 text-white">
          <Zap className="w-3 h-3 mr-1" />
          Enterprise
        </Badge>
      );
    case 'professional':
      return (
        <Badge className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
          <Target className="w-3 h-3 mr-1" />
          Professional
        </Badge>
      );
    case 'basic':
      return (
        <Badge className="bg-gradient-to-r from-green-500 to-green-700 text-white">
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
  const verified = builder.verified;
  
  if (verified) {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Verified
      </Badge>
    );
  }
  
  if (claimed && claimStatus === 'verified') {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
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
      <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
        <AlertCircle className="w-3 h-3 mr-1" />
        Unclaimed
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
    <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-semibold">{(builder.rating || 4.5).toFixed(1)}</span>
              <span className="text-sm text-gray-500">({builder.reviewCount})</span>
            </div>
          </div>
          
          <div className="flex gap-1 flex-wrap">
            {builder.verified && !(builder as any).claimed && (
              <Badge className="bg-blue-100 text-blue-800 text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
            {getClaimStatusBadge(builder)}
          </div>
        </div>

        <CardTitle className="text-lg leading-tight">
          {builder.companyName}
        </CardTitle>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            <div className="flex flex-wrap gap-1">
              {builder.serviceLocations && builder.serviceLocations.length > 0 ? (
                builder.serviceLocations.map((location, index) => (
                  <span key={index} className="font-medium">
                    {location.country} ({location.cities.join(', ')})
                    {index < (builder.serviceLocations?.length || 0) - 1 && <span>, </span>}
                  </span>
                ))
              ) : (
                <span>{builder.headquarters.city}, {builder.headquarters.country}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3" />
            <span>{builder.projectsCompleted} projects completed</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>Response: {builder.responseTime}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {builder.companyDescription}
        </p>

        {/* Specializations */}
        <div className="flex flex-wrap gap-1 mb-4">
          {(builder.specializations || []).slice(0, 2).map((spec) => (
            <Badge 
              key={spec.id} 
              variant="secondary" 
              className="text-xs"
              style={{ backgroundColor: spec.color + '20', color: spec.color }}
            >
              {spec.icon} {spec.name}
            </Badge>
          ))}
          {(builder.specializations || []).length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{(builder.specializations || []).length - 2} more
            </Badge>
          )}
        </div>

        {/* Key Strengths */}
        {(builder.keyStrengths || []).length > 0 && (
          <div className="mb-4">
            <h5 className="font-medium text-gray-900 text-sm mb-2">Key Strengths:</h5>
            <ul className="text-xs text-gray-600 space-y-1">
              {(builder.keyStrengths || []).slice(0, 3).map((strength, index) => (
                <li key={index} className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact Controls */}
        {showLeadForm && (
          <BuilderContactControls builder={builder} location={location} />
        )}
      </CardContent>
    </Card>
  );
}

export default BuilderCard;

