import React from 'react';
import { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import EnhancedBuilderSignup from '@/components/EnhancedBuilderSignup';

export const metadata: Metadata = {
  title: 'Join as Exhibition Stand Builder - ExhibitBay',
  description: 'Launch your exhibition stand building profile and start receiving quote requests from clients worldwide.',
  keywords: 'exhibition stand builder registration, join platform, builder signup, exhibition contractor'
};

export default function BuilderRegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-russian-violet-600 to-russian-violet-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Launch Your Builder Profile
          </h1>
          <p className="text-lg text-russian-violet-100 mb-8">
            Connect with clients worldwide and grow your exhibition stand building business with our unified platform
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold mb-2">⚡</div>
              <div className="text-russian-violet-100">Instant Profile Launch</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold mb-2">🌍</div>
              <div className="text-russian-violet-100">Global Visibility</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold mb-2">📊</div>
              <div className="text-russian-violet-100">Unified Dashboard</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Signup Form */}
      <section className="py-12">
        <EnhancedBuilderSignup />
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Join Our Platform?
            </h2>
            <p className="text-lg text-gray-600">
              Get access to premium features and grow your business with us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-claret-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-claret-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Profile Launch</h3>
              <p className="text-gray-600">
                Your profile goes live immediately after registration - start receiving leads right away
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-claret-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-claret-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Unified Management</h3>
              <p className="text-gray-600">
                Manage services, locations, leads, and billing all from one comprehensive dashboard
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Sync</h3>
              <p className="text-gray-600">
                Profile changes sync instantly across all listing pages - your information is always current
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
              <p className="text-gray-600">
                Appear in location-based searches worldwide and expand your services to new markets
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Get dedicated support from our team to help you succeed on the platform
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">
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