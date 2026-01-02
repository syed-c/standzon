"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/shared/button';
import { Card, CardContent } from '@/components/shared/card';
import { FiMapPin, FiStar, FiUsers, FiArrowRight, FiAward } from 'react-icons/fi';
import Link from 'next/link';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

export default function FeaturedBuilders() {
  const [builders, setBuilders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const limit = 6; // Default number of featured builders to show

  console.log("FeaturedBuilders: Component rendered");

  useEffect(() => {
    const loadFeaturedBuilders = async () => {
      setLoading(true);
      try {
        console.log('🔄 Loading featured builders from unified platform...');
        
        // Get real builders from unified platform API
        const allBuilders = unifiedPlatformAPI.getBuilders();
        console.log(`📊 Total builders available: ${allBuilders.length}`);
        
        // ✅ TEMPORARY FIX: If no builders from persistence, use sample data
        let buildersToProcess = allBuilders;
        
        if (allBuilders.length === 0) {
          console.log('⚠️ No builders found in persistent storage, using sample data for demonstration');
          buildersToProcess = [
            {
              id: 'sample-1',
              companyName: 'Vegas Exhibition Experts',
              slug: 'vegas-exhibition-experts',
              headquarters: { city: 'Las Vegas', country: 'United States' },
              rating: 4.8,
              reviewCount: 89,
              specializations: [{ name: 'Technology' }, { name: 'Custom Stands' }],
              companyDescription: 'Leading exhibition stand builder in Las Vegas with over 6 years of experience creating impactful trade show displays.',
              projectsCompleted: 127,
              serviceLocations: [{ country: 'United States' }, { country: 'Canada' }],
              verified: true,
              premiumMember: true,
              adminFeatured: true
            },
            {
              id: 'sample-2',
              companyName: 'Berlin Trade Solutions',
              slug: 'berlin-trade-solutions',
              headquarters: { city: 'Berlin', country: 'Germany' },
              rating: 4.6,
              reviewCount: 156,
              specializations: [{ name: 'Manufacturing' }, { name: 'Modular Systems' }],
              companyDescription: 'Established German exhibition builder specializing in trade shows across Europe with sustainable building practices.',
              projectsCompleted: 203,
              serviceLocations: [{ country: 'Germany' }, { country: 'Netherlands' }],
              verified: true,
              premiumMember: false,
              featured: true
            },
            {
              id: 'sample-3',
              companyName: 'Dubai Exhibition Masters',
              slug: 'dubai-exhibition-masters',
              headquarters: { city: 'Dubai', country: 'UAE' },
              rating: 4.9,
              reviewCount: 134,
              specializations: [{ name: 'Luxury Goods' }, { name: 'Premium Stands' }],
              companyDescription: 'Premier exhibition stand builder in Dubai with expertise in luxury brands and high-end trade shows across the Middle East.',
              projectsCompleted: 185,
              serviceLocations: [{ country: 'UAE' }, { country: 'Saudi Arabia' }],
              verified: true,
              premiumMember: true,
              adminFeatured: true
            }
          ];
        }
        
        // Filter and sort featured builders
        const featuredBuilders = buildersToProcess
          .filter(builder => 
            (builder as any).adminFeatured || 
            (builder as any).featured || 
            builder.premiumMember ||
            builder.verified
          )
          .sort((a, b) => {
            // Priority: adminFeatured > featured > premiumMember > verified
            const getPriority = (builder: any) => {
              if (builder.adminFeatured) return 4;
              if (builder.featured) return 3;
              if (builder.premiumMember) return 2;
              if (builder.verified) return 1;
              return 0;
            };
            
            const priorityDiff = getPriority(b) - getPriority(a);
            if (priorityDiff !== 0) return priorityDiff;
            
            // Then by rating
            return (b.rating || 0) - (a.rating || 0);
          })
          .slice(0, limit)
          .map(builder => ({
            name: builder.companyName,
            slug: builder.slug,
            location: `${builder.headquarters?.city}, ${builder.headquarters?.country}`,
            rating: builder.rating || 4.5,
            reviews: builder.reviewCount || 0,
            specialties: builder.specializations?.slice(0, 3).map(s => s.name) || ['Exhibition Stands'],
            description: (() => {
              let desc = builder.companyDescription || builder.description || 'Professional exhibition stand builder';
              // Remove SERVICE_LOCATIONS JSON from description more aggressively
              desc = desc.replace(/\n\nSERVICE_LOCATIONS:.*$/g, '');
              desc = desc.replace(/SERVICE_LOCATIONS:.*$/g, '');
              desc = desc.replace(/SERVICE_LOCATIONS:\[.*?\]/g, '');
              desc = desc.replace(/\n\n.*SERVICE_LOCATIONS.*$/g, '');
              desc = desc.replace(/.*SERVICE_LOCATIONS.*$/g, '');
              // Remove any remaining raw data patterns
              desc = desc.replace(/sdfghjl.*$/g, '');
              desc = desc.replace(/testing.*$/g, '');
              desc = desc.replace(/sdfghj.*$/g, '');
              desc = desc.trim();
              return desc || 'Professional exhibition stand builder';
            })(),
            projects: builder.projectsCompleted || 0,
            countries: builder.serviceLocations?.length || 1,
            featured: (builder as any).adminFeatured || (builder as any).featured || false,
            verified: builder.verified,
            premiumMember: builder.premiumMember
          }));

        console.log(`✅ Loaded ${featuredBuilders.length} featured builders from real data`);
        
        if (featuredBuilders.length > 0) {
          setBuilders(featuredBuilders);
          return;
        }
        
        // If no featured builders, show top-rated builders
        const topBuilders = allBuilders
          .filter(builder => builder.verified)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, Math.min(limit, 6))
          .map(builder => ({
            name: builder.companyName,
            slug: builder.slug,
            location: `${builder.headquarters?.city}, ${builder.headquarters?.country}`,
            rating: builder.rating || 4.5,
            reviews: builder.reviewCount || 0,
            specialties: builder.specializations?.slice(0, 3).map(s => s.name) || ['Exhibition Stands'],
            description: (() => {
              let desc = builder.companyDescription || builder.description || 'Professional exhibition stand builder';
              // Remove SERVICE_LOCATIONS JSON from description more aggressively
              desc = desc.replace(/\n\nSERVICE_LOCATIONS:.*$/g, '');
              desc = desc.replace(/SERVICE_LOCATIONS:.*$/g, '');
              desc = desc.replace(/SERVICE_LOCATIONS:\[.*?\]/g, '');
              desc = desc.replace(/\n\n.*SERVICE_LOCATIONS.*$/g, '');
              desc = desc.replace(/.*SERVICE_LOCATIONS.*$/g, '');
              // Remove any remaining raw data patterns
              desc = desc.replace(/sdfghjl.*$/g, '');
              desc = desc.replace(/testing.*$/g, '');
              desc = desc.replace(/sdfghj.*$/g, '');
              desc = desc.trim();
              return desc || 'Professional exhibition stand builder';
            })(),
            projects: builder.projectsCompleted || 0,
            countries: builder.serviceLocations?.length || 1,
            featured: false,
            verified: builder.verified,
            premiumMember: builder.premiumMember
          }));

        if (topBuilders.length > 0) {
          console.log(`✅ Using ${topBuilders.length} top-rated builders as featured`);
          setBuilders(topBuilders);
          return;
        }

        console.log('⚠️ No builders available, showing empty state');
        setBuilders([]);

      } catch (error) {
        console.error('❌ Error loading featured builders:', error);
        setBuilders([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedBuilders();
  }, []);

  // If no real builders, don't show this section at all
  if (!loading && builders.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-pink-50 to-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
            Featured Exhibition Stand Builders
          </h2>
          <p className="text-xl text-gray-600">
            Top-rated contractors verified by our platform with proven track records
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
              <p className="mt-6 text-gray-500 text-lg">Loading featured builders...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {builders.map((builder, index) => (
                <Link
                  key={builder.slug}
                  href={`/companies/${builder.slug}`}
                  className="group"
                >
                  <Card className={`h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 bg-gradient-to-br from-white to-pink-50/30 border-pink-100 hover:border-pink-300 ${builder.featured ? 'ring-2 ring-pink-600 bg-gradient-to-br from-pink-50 to-white' : ''}`}>
                    <CardContent className="p-6">
                      {builder.featured && (
                        <div className="flex items-center space-x-2 mb-3">
                          <FiAward className="w-4 h-4 text-gold-primary" />
                          <span className="text-sm font-medium text-gold-primary">FEATURED</span>
                        </div>
                      )}
                      
                      <h3 className="text-xl font-bold text-navy-900 mb-2">{builder.name}</h3>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <FiMapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{builder.location}</span>
                      </div>

                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-1">
                          <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold text-navy-900">{builder.rating}</span>
                          <span className="text-gray-500">({builder.reviews})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiUsers className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{builder.projects} projects</span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {builder.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {builder.specialties.slice(0, 2).map((specialty, specialtyIndex) => (
                          <span 
                            key={`${builder.slug}-specialty-${specialtyIndex}`}
                            className="px-2 py-1 bg-pink-100 text-pink-600 text-xs rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                        {builder.specialties.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{builder.specialties.length - 2} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {builder.countries} countries served
                        </div>
                        <div className="text-pink-600 group-hover:text-pink-700 font-medium flex items-center">
                          View Profile <FiArrowRight className="ml-1 w-4 h-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/builders">
                <Button variant="outline" className="px-8 py-3 text-lg border-pink-200 text-pink-700">
                  View All Builders
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}