"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FiMapPin, FiSearch, FiArrowRight, FiUsers, FiClock, FiShield } from 'react-icons/fi';
import Link from 'next/link';

const popularCities = [
  { name: "Las Vegas", country: "USA", slug: "united-states/las-vegas", builders: 120 },
  { name: "Berlin", country: "Germany", slug: "germany/berlin", builders: 85 },
  { name: "Dubai", country: "UAE", slug: "united-arab-emirates/dubai", builders: 95 },
  { name: "Paris", country: "France", slug: "france/paris", builders: 110 },
  { name: "Barcelona", country: "Spain", slug: "spain/barcelona", builders: 75 },
  { name: "Milan", country: "Italy", slug: "italy/milan", builders: 90 },
  { name: "London", country: "UK", slug: "united-kingdom/london", builders: 135 },
  { name: "Amsterdam", country: "Netherlands", slug: "netherlands/amsterdam", builders: 65 },
  { name: "Sydney", country: "Australia", slug: "australia/sydney", builders: 78 },
  { name: "Melbourne", country: "Australia", slug: "australia/melbourne", builders: 65 },
  { name: "Mumbai", country: "India", slug: "india/mumbai", builders: 89 },
  { name: "Shanghai", country: "China", slug: "china/shanghai", builders: 112 },
  { name: "Tokyo", country: "Japan", slug: "japan/tokyo", builders: 95 },
  { name: "São Paulo", country: "Brazil", slug: "brazil/sao-paulo", builders: 67 },
  { name: "Toronto", country: "Canada", slug: "canada/toronto", builders: 58 },
  { name: "Mexico City", country: "Mexico", slug: "mexico/mexico-city", builders: 45 }
];

const benefits = [
  {
    icon: <FiShield className="w-6 h-6 text-blue-primary" />,
    title: "Verified Builders",
    description: "All contractors pre-screened and verified"
  },
  {
    icon: <FiClock className="w-6 h-6 text-blue-primary" />,
    title: "Free & Fast",
    description: "Get quotes in minutes, completely free"
  },
  {
    icon: <FiUsers className="w-6 h-6 text-blue-primary" />,
    title: "Best Match",
    description: "Algorithm finds your perfect contractor"
  }
];

export default function CitySelector() {
  const [selectedCity, setSelectedCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  console.log("CitySelector: Component rendered");

  const filteredCities = popularCities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Quote Form */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
            In Which City Do You Need the Stand?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We compare more than 500 builders in each city to get you the top 5 matches
          </p>
          
          <Card className="max-w-2xl mx-auto shadow-xl bg-white/90 backdrop-blur-sm border-blue-200/50">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for your city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-primary focus:border-blue-primary"
                  />
                </div>
                
                {searchQuery && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    {filteredCities.map((city) => (
                      <button
                        key={city.slug}
                        onClick={() => setSelectedCity(city.slug)}
                        className={`p-3 text-left rounded-lg border transition-all hover:shadow-md ${
                          selectedCity === city.slug 
                            ? 'border-blue-primary bg-blue-50 text-blue-primary' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{city.name}</div>
                        <div className="text-sm text-gray-500">{city.country}</div>
                        <div className="text-xs text-blue-primary">{city.builders} builders</div>
                      </button>
                    ))}
                  </div>
                )}
                
                <Link href={selectedCity ? `/exhibition-stands/${selectedCity}` : "/exhibition-stands"}>
                  <Button 
                    className="w-full bg-blue-primary hover:bg-blue-dark text-white py-4 text-lg"
                    disabled={!selectedCity}
                  >
                    Get Free Quotes <FiArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Cities Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center text-navy-900 mb-8">
            Popular Exhibition Cities
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {popularCities.map((city) => (
              <Link
                key={city.slug}
                href={`/exhibition-stands/${city.slug}`}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50/50 border-blue-100 hover:border-blue-300">
                  <CardContent className="p-4 text-center">
                    <FiMapPin className="w-6 h-6 text-blue-primary mx-auto mb-2" />
                    <h4 className="font-semibold text-navy-900 text-sm">{city.name}</h4>
                    <p className="text-xs text-gray-500">{city.country}</p>
                    <p className="text-xs text-blue-primary font-medium">{city.builders} builders</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}