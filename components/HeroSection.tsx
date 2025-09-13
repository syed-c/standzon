'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PublicQuoteRequest from '@/components/PublicQuoteRequest';
import Link from 'next/link';
import {
  ArrowRight,
  Users,
  Building,
  CheckCircle
} from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden pt-20" style={{
      background: 'linear-gradient(135deg, #7c2d92 0%, #db2777 50%, #ec4899 100%)'
    }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-500/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-rose-500/30 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight" data-macaly="hero-title">
          We Build Your Stand in 
          <br />
          <span className="bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent">
            Any Corner of the World
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed" data-macaly="hero-description">
          Get competitive quotes from verified exhibition stand builders. We compare 500+ contractors 
          in your city to find the perfect match. Save 23% on average with free, instant quotes.
        </p>

        {/* Stats Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-white">45+</div>
            <div className="text-gray-300 text-sm">Cities Covered</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-white/20"></div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-white">10+</div>
            <div className="text-gray-300 text-sm">Countries Served</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-white/20"></div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-white">500+</div>
            <div className="text-gray-300 text-sm">Expert Builders</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <PublicQuoteRequest 
            buttonText="Get Free Quote →"
            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-8 py-4 text-lg font-semibold rounded-xl border-2 border-transparent transition-all duration-300 hover:shadow-2xl transform hover:scale-105 shadow-lg"
          />
          <Link href="/exhibition-stands">
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white bg-black/30 hover:bg-white/20 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-md transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Global Venues
            </Button>
          </Link>
          <Link href="/builders">
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white bg-black/30 hover:bg-white/20 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-md transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Find Builders
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}