import React from 'react';
import { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import EnhancedBuilderSignup from '@/components/EnhancedBuilderSignup';

export const metadata: Metadata = {
  title: 'Join as an Exhibition Stand Builder | StandsZone',
  description: 'List your exhibition stand building company on StandsZone and start receiving matched quote requests from exhibitors worldwide.',
  keywords: 'exhibition stand builder registration, join platform, builder signup, exhibition contractor'
};

export default function BuilderRegisterPage() {
  return (
    <div className="min-h-screen bg-[#F5F6F7]">
      <Navigation />
      
      {/* Hero Section with Gradient Banner - Matching Location Pages */}
      <section className="relative bg-[#252525] text-white pt-24">
        {/* Decorative background overlay - subtle accent gradient */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-[#E03A3A]/10 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Launch Your Builder Profile
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-3xl mx-auto leading-relaxed">
              Connect with clients worldwide and grow your exhibition stand building business with our unified platform
            </p>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="font-semibold text-lg mb-2">Instant Launch</h3>
                <p className="text-sm text-white/70">Go live immediately</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl mb-3">🌍</div>
                <h3 className="font-semibold text-lg mb-2">Global Reach</h3>
                <p className="text-sm text-white/70">Worldwide visibility</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-semibold text-lg mb-2">Unified Dashboard</h3>
                <p className="text-sm text-white/70">All-in-one management</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EnhancedBuilderSignup />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#252525] mb-4">
              Why Join Our Platform?
            </h2>
            <p className="text-lg md:text-xl text-[#5B5C5D] max-w-2xl mx-auto">
              Get access to premium features and grow your business with us
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Instant Profile Launch */}
            <div className="group text-center p-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FDE3E3] to-[#FAC5C5] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-[#E03A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#252525]">Instant Profile Launch</h3>
              <p className="text-[#5B5C5D] leading-relaxed">
                Your profile goes live immediately after registration - start receiving leads right away
              </p>
            </div>

            {/* Unified Management */}
            <div className="group text-center p-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#252525]">Unified Management</h3>
              <p className="text-[#5B5C5D] leading-relaxed">
                Manage services, locations, leads, and billing all from one comprehensive dashboard
              </p>
            </div>

            {/* Real-Time Sync */}
            <div className="group text-center p-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FDE3E3] to-[#FAC5C5] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-[#E03A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#252525]">Real-Time Sync</h3>
              <p className="text-[#5B5C5D] leading-relaxed">
                Profile changes appear across every listing page straight away, so your information is always current.
              </p>
            </div>

            {/* Global Reach */}
            <div className="group text-center p-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FDE3E3] to-[#FAC5C5] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-[#E03A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#252525]">Global Reach</h3>
              <p className="text-[#5B5C5D] leading-relaxed">
                Appear in location-based searches worldwide and expand your services to new markets
              </p>
            </div>

            {/* 24/7 Support */}
            <div className="group text-center p-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FDE3E3] to-[#FAC5C5] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-[#E03A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#252525]">24/7 Support</h3>
              <p className="text-[#5B5C5D] leading-relaxed">
                Get dedicated support from our team to help you succeed on the platform
              </p>
            </div>

            {/* Advanced Analytics */}
            <div className="group text-center p-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FDE3E3] to-[#FAC5C5] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-[#E03A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#252525]">Advanced Analytics</h3>
              <p className="text-[#5B5C5D] leading-relaxed">
                Track profile performance, quote conversion rates, and business growth metrics
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}