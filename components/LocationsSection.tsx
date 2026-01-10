"use client";

import { useState } from 'react';
import { FiGlobe, FiUsers, FiStar, FiMapPin, FiArrowRight, FiExternalLink } from 'react-icons/fi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type SectionText = { heading?: string; paragraph?: string } | undefined;

export default function LocationsSection({
  globalPresence,
  moreCountries,
  expandingMarkets,
}: {
  globalPresence?: SectionText;
  moreCountries?: SectionText;
  expandingMarkets?: SectionText;
}) {
  const [activeTab, setActiveTab] = useState('North America');

  const continents = {
    'North America': {
      icon: '🌎',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      countries: [
        {
          name: 'United States',
          flag: '🇺🇸',
          cities: ['New York', 'Las Vegas', 'Chicago', 'Miami', 'Atlanta', 'Los Angeles', 'Boston', 'Detroit'],
          builders: 145,
          rating: 4.8,
          projects: 500,
          href: '/exhibition-stands/united-states'
        },
        {
          name: 'Canada',
          flag: '🇨🇦',
          cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton'],
          builders: 45,
          rating: 4.7,
          projects: 200,
          href: '/exhibition-stands/canada'
        },
        {
          name: 'Mexico',
          flag: '🇲🇽',
          cities: ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana'],
          builders: 35,
          rating: 4.6,
          projects: 150,
          href: '/exhibition-stands/mexico',

        }
      ],
      interlinkingCountries: [
        'Brazil', 'Argentina', 'Chile', 'Colombia', 'Costa Rica', 'Panama', 'Guatemala', 'Ecuador'
      ]
    },
    'Europe': {
      icon: '🌍',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'from-purple-50 to-indigo-50',
      countries: [
        {
          name: 'Germany',
          flag: '🇩🇪',
          cities: ['Berlin', 'Frankfurt', 'Munich', 'Hamburg', 'Cologne', 'Stuttgart', 'Dusseldorf'],
          builders: 180,
          rating: 4.9,
          projects: 750,
          href: '/exhibition-stands/germany',

        },
        {
          name: 'United Kingdom',
          flag: '🇬🇧',
          cities: ['London', 'Birmingham', 'Manchester', 'Edinburgh', 'Glasgow', 'Leeds'],
          builders: 120,
          rating: 4.8,
          projects: 400,
          href: '/exhibition-stands/united-kingdom',

        },
        {
          name: 'France',
          flag: '🇫🇷',
          cities: ['Paris', 'Lyon', 'Marseille', 'Nice', 'Toulouse', 'Bordeaux'],
          builders: 95,
          rating: 4.7,
          projects: 350,
          href: '/exhibition-stands/france',

        },
        {
          name: 'Italy',
          flag: '🇮🇹',
          cities: ['Milan', 'Rome', 'Bologna', 'Turin', 'Florence', 'Venice'],
          builders: 85,
          rating: 4.6,
          projects: 280,
          href: '/exhibition-stands/italy',

        },
        {
          name: 'Spain',
          flag: '🇪🇸',
          cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao'],
          builders: 78,
          rating: 4.5,
          projects: 240,
          href: '/exhibition-stands/spain',

        },
        {
          name: 'Netherlands',
          flag: '🇳🇱',
          cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht'],
          builders: 65,
          rating: 4.8,
          projects: 200,
          href: '/exhibition-stands/netherlands',

        }
      ],
      interlinkingCountries: [
        'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland', 'Czech Republic', 'Portugal', 'Greece', 'Turkey'
      ]
    },
    'Asia Pacific': {
      icon: '🌏',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      countries: [
        {
          name: 'China',
          flag: '🇨🇳',
          cities: ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou'],
          builders: 250,
          rating: 4.7,
          projects: 600,
          href: '/exhibition-stands/china',

        },
        {
          name: 'Japan',
          flag: '🇯🇵',
          cities: ['Tokyo', 'Osaka', 'Chiba'],
          builders: 140,
          rating: 4.8,
          projects: 450,
          href: '/exhibition-stands/japan',

        },
        {
          name: 'Singapore',
          flag: '🇸🇬',
          cities: ['Singapore'],
          builders: 55,
          rating: 4.9,
          projects: 200,
          href: '/exhibition-stands/singapore',

        },
        {
          name: 'India',
          flag: '🇮🇳',
          cities: ['Mumbai', 'New Delhi', 'Bangalore', 'Hyderabad', 'Kolkata'],
          builders: 180,
          rating: 4.6,
          projects: 350,
          href: '/exhibition-stands/india',

        },
        {
          name: 'South Korea',
          flag: '🇰🇷',
          cities: ['Seoul', 'Busan', 'Incheon', 'Daegu'],
          builders: 95,
          rating: 4.7,
          projects: 280,
          href: '/exhibition-stands/south-korea',

        }
      ],
      interlinkingCountries: [
        'Australia', 'Thailand', 'Malaysia', 'Indonesia', 'Philippines', 'Vietnam', 'Taiwan', 'Hong Kong', 'New Zealand'
      ]
    },
    'Middle East': {
      icon: '🏛️',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      countries: [
        {
          name: 'United Arab Emirates',
          flag: '🇦🇪',
          cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'],
          builders: 120,
          rating: 4.8,
          projects: 400,
          href: '/exhibition-stands/united-arab-emirates',

        },
        {
          name: 'Saudi Arabia',
          flag: '🇸🇦',
          cities: ['Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Mecca', 'Medina'],
          builders: 85,
          rating: 4.7,
          projects: 300,
          href: '/exhibition-stands/saudi-arabia',

        },
        {
          name: 'Qatar',
          flag: '🇶🇦',
          cities: ['Doha', 'Al Rayyan', 'Al Wakrah'],
          builders: 45,
          rating: 4.6,
          projects: 150,
          href: '/exhibition-stands/qatar',

        },
        {
          name: 'Kuwait',
          flag: '🇰🇼',
          cities: ['Kuwait City', 'Al Ahmadi', 'Hawalli'],
          builders: 35,
          rating: 4.5,
          projects: 120,
          href: '/exhibition-stands/kuwait',

        },
        {
          name: 'Oman',
          flag: '🇴🇲',
          cities: ['Mascat', 'Salalah', 'Sohar'],
          builders: 28,
          rating: 4.4,
          projects: 90,
          href: '/exhibition-stands/oman',

        }
      ],
      interlinkingCountries: [
        'Bahrain', 'Jordan', 'Lebanon', 'Egypt', 'Israel', 'Iran', 'Iraq'
      ]
    }
  };

  const currentContinent = continents[activeTab as keyof typeof continents];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-rose-100 px-4 py-2 rounded-full">
              <FiGlobe className="w-5 h-5 text-pink-600" />
              <span className="text-sm font-semibold text-pink-800">Global Network</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {globalPresence?.heading || (
              <>
                Global Presence,{' '}
                <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent">
                  Local Expertise
                </span>
              </>
            )}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {globalPresence?.paragraph || 'With operations spanning five continents, we deliver world-class exhibition solutions while maintaining deep local market knowledge and cultural understanding.'}
          </p>

          {/* Global Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">50+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">2000+</div>
              <div className="text-gray-600">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">500+</div>
              <div className="text-gray-600">Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">15</div>
              <div className="text-gray-600">Years</div>
            </div>
          </div>
        </div>

        {/* Continent Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(continents).map(([continent, data]) => (
            <button
              key={continent}
              onClick={() => setActiveTab(continent)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-gray-900 ${activeTab === continent
                  ? `bg-gradient-to-r ${data.color} text-white shadow-lg transform scale-105`
                  : 'bg-white text-black hover:bg-gray-50 border border-gray-200 hover:border-pink-300'
                } touch-active no-tap-highlight`}
            >
              <span className="text-xl">{data.icon}</span>
              <span>{continent}</span>
            </button>
          ))}
        </div>

        {/* Countries Grid */}
        <div className={`bg-gradient-to-br ${currentContinent.bgColor} rounded-3xl p-8 mb-8`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentContinent.countries.map((country) => (
              <Card key={country.name} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:bg-white overflow-hidden">
                <CardContent className="p-6 sm:p-8">
                  {/* Country Header with Flag */}
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300 text-black">
                      {country.flag}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{country.name}</h3>
                    <Badge className={`bg-gradient-to-r ${currentContinent.color} text-white border-0 px-4 py-1`}>
                      {country.builders} Builders Available
                    </Badge>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-center space-x-6 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-bold text-gray-900">{country.rating}</span>
                      </div>
                      <div className="text-xs text-gray-500">{country.projects} projects</div>
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <FiMapPin className="w-4 h-4 text-gray-500" />
                        <span className="font-bold text-gray-900">{country.cities.length}</span>
                      </div>
                      <div className="text-xs text-gray-500">cities</div>
                    </div>
                  </div>

                  {/* Cities */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {country.cities.slice(0, 4).map((city) => (
                      <Badge key={city} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                        {city}
                      </Badge>
                    ))}
                    {country.cities.length > 4 && (
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        +{country.cities.length - 4} more
                      </Badge>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link href={country.href}>
                    <Button className={`w-full bg-gradient-to-r ${currentContinent.color} text-white group transform transition-all duration-300 border-0 shadow-md font-semibold touch-active no-tap-highlight`}>
                      <FiUsers className="w-4 h-4 mr-2" />
                      View All Builders
                      <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* New Interlinking Countries Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {(moreCountries?.heading ? (moreCountries.heading as string) : 'More Countries in {country}').replace(/\{country\}/ig, activeTab)}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {moreCountries?.paragraph || 'Discover exhibition stand builders across all major markets in this region. Click on any country to explore local professionals and get instant quotes.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {currentContinent.interlinkingCountries.map((country, index) => (
              <Link
                key={country}
                href={`/exhibition-stands/${country.toLowerCase().replace(/\s+/g, '-')}`}
                className="group"
              >
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-pink-50 hover:to-rose-50 border border-gray-200 hover:border-pink-300 rounded-xl p-4 text-center transition-all duration-300 hover:shadow-md hover:scale-105">
                  <div className="text-sm font-semibold text-gray-700 group-hover:text-pink-600 mb-2">
                    {country}
                  </div>
                  <div className="flex items-center justify-center">
                    <FiExternalLink className="w-3 h-3 text-gray-400 group-hover:text-pink-500 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/exhibition-stands">
              <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-xl font-semibold border-0 shadow-lg touch-active no-tap-highlight">
                Browse All Locations
                <FiArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Expanding CTA */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 rounded-full">
                <FiGlobe className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {expandingMarkets?.heading || 'Expanding to New Markets?'}
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              {expandingMarkets?.paragraph || "We're continuously growing our global network. If you don't see your location listed, contact us to discuss how we can support your exhibition needs."}
            </p>
            <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 text-lg font-semibold rounded-xl touch-active no-tap-highlight">
              Contact Global Team
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}