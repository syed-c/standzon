"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FiMapPin, FiCalendar, FiUsers, FiEye } from 'react-icons/fi';

export default function PortfolioSection() {
  console.log("PortfolioSection: Component rendered");
  
  const [activeFilter, setActiveFilter] = useState('all');

  const portfolioItems = [
    {
      id: 1,
      title: "Tech Innovation Expo",
      location: "Las Vegas, USA",
      category: "technology",
      year: "2024",
      size: "500 sqm",
      visitors: "15,000+",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      description: "A cutting-edge technology exhibition featuring interactive displays and immersive experiences."
    },
    {
      id: 2,
      title: "Luxury Automotive Show",
      location: "Frankfurt, Germany",
      category: "automotive",
      year: "2024",
      size: "750 sqm",
      visitors: "25,000+",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      description: "Premium automotive exhibition with sophisticated lighting and luxury vehicle displays."
    },
    {
      id: 3,
      title: "Healthcare Innovation",
      location: "London, UK",
      category: "healthcare",
      year: "2024",
      size: "400 sqm",
      visitors: "12,000+",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      description: "Modern healthcare exhibition showcasing medical innovations and patient care solutions."
    },
    {
      id: 4,
      title: "Sustainable Energy Expo",
      location: "Dubai, UAE",
      category: "energy",
      year: "2023",
      size: "600 sqm",
      visitors: "20,000+",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      description: "Eco-friendly exhibition design promoting renewable energy solutions and sustainability."
    },
    {
      id: 5,
      title: "Fashion Week Pavilion",
      location: "Milan, Italy",
      category: "fashion",
      year: "2023",
      size: "300 sqm",
      visitors: "8,000+",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      description: "Elegant fashion exhibition with runway integration and luxury retail displays."
    },
    {
      id: 6,
      title: "Food & Beverage Expo",
      location: "Tokyo, Japan",
      category: "food",
      year: "2023",
      size: "450 sqm",
      visitors: "18,000+",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      description: "Interactive culinary exhibition with tasting stations and chef demonstration areas."
    }
  ];

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'technology', label: 'Technology' },
    { id: 'automotive', label: 'Automotive' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'energy', label: 'Energy' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'food', label: 'Food & Beverage' }
  ];

  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <section id="portfolio" className="py-20 lg:py-32 bg-gradient-to-br from-white via-blue-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 mb-6 font-inter">
            Award-Winning
            <br />
            <span className="text-blue-primary">Portfolio</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our diverse collection of exhibition stands that have captivated audiences 
            and delivered exceptional results across various industries worldwide.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeFilter === category.id
                  ? 'bg-blue-primary text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-blue-100 bg-gradient-to-br from-white to-blue-50/20 hover:border-blue-300 premium-shadow"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-primary text-white">
                      {item.category}
                    </Badge>
                    <FiEye className="w-5 h-5" />
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-navy-900 mb-3 font-inter">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {item.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <FiMapPin className="w-4 h-4 mr-2" />
                    {item.location}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiCalendar className="w-4 h-4 mr-2" />
                      {item.year}
                    </div>
                    <div className="flex items-center">
                      <FiUsers className="w-4 h-4 mr-2" />
                      {item.visitors}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Stand Size</span>
                    <span className="text-sm font-semibold text-navy-900">{item.size}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <button className="bg-blue-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-dark transition-colors shadow-lg">
            View Complete Portfolio
          </button>
        </div>
      </div>
    </section>
  );
}