'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import { Input } from '@/components/shared/input';
import { Label } from '@/components/shared/label';
import { Badge } from '@/components/shared/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/select';
import { Checkbox } from '@/components/shared/checkbox';
import { Slider } from '@/components/shared/slider';
import { 
  Search, 
  Filter, 
  X, 
  MapPin, 
  Building, 
  Star,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap
} from 'lucide-react';

interface FilterOptions {
  searchQuery: string;
  serviceTypes: string[];
  countries: string[];
  cities: string[];
  verificationStatus: string[];
  ratingRange: [number, number];
  projectRange: [number, number];
  dateRange: string;
  capacity: string[];
  specializations: string[];
}

interface AdvancedFilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  availableCountries: string[];
  availableCities: string[];
  isLoading?: boolean;
  resultCount?: number;
  data?: any[];
}

export default function AdvancedFilterPanel({
  onFilterChange,
  onClearFilters,
  availableCountries,
  availableCities,
  isLoading = false,
  resultCount = 0,
  data = []
}: AdvancedFilterPanelProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    serviceTypes: [],
    countries: [],
    cities: [],
    verificationStatus: [],
    ratingRange: [0, 5],
    projectRange: [0, 1000],
    dateRange: 'all',
    capacity: [],
    specializations: []
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const serviceTypes = [
    'Exhibition Stand Design',
    'Booth Construction', 
    'Custom Displays',
    'Modular Systems',
    'Event Planning',
    'Installation Services',
    'Graphics & Printing',
    'Audio Visual',
    'Lighting Design',
    'Project Management'
  ];

  const capacityRanges = [
    'Small (1-50 sqm)',
    'Medium (51-200 sqm)', 
    'Large (201-500 sqm)',
    'Extra Large (500+ sqm)'
  ];

  const specializations = [
    'Technology & Innovation',
    'Healthcare & Medical',
    'Automotive',
    'Fashion & Lifestyle',
    'Food & Beverage',
    'Industrial & Manufacturing',
    'Consumer Electronics',
    'Real Estate',
    'Education',
    'Financial Services'
  ];

  // Real-time search suggestions
  useEffect(() => {
    if (filters.searchQuery.length > 2) {
      const suggestions = [
        ...data.filter(item => 
          item.companyName?.toLowerCase().includes(filters.searchQuery.toLowerCase())
        ).map(item => item.companyName).slice(0, 3),
        ...availableCountries.filter(country => 
          country.toLowerCase().includes(filters.searchQuery.toLowerCase())
        ).slice(0, 2),
        ...availableCities.filter(city => 
          city.toLowerCase().includes(filters.searchQuery.toLowerCase())
        ).slice(0, 2)
      ];
      
      setSearchSuggestions(Array.from(new Set(suggestions)));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [filters.searchQuery, data, availableCountries, availableCities]);

  // Apply filters whenever they change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: (prev[key] as string[]).includes(value)
        ? (prev[key] as string[]).filter(item => item !== value)
        : [...(prev[key] as string[]), value]
    }));
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterOptions = {
      searchQuery: '',
      serviceTypes: [],
      countries: [],
      cities: [],
      verificationStatus: [],
      ratingRange: [0, 5],
      projectRange: [0, 1000],
      dateRange: 'all',
      capacity: [],
      specializations: []
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const activeFilterCount = 
    filters.serviceTypes.length +
    filters.countries.length + 
    filters.cities.length +
    filters.verificationStatus.length +
    filters.capacity.length +
    filters.specializations.length +
    (filters.searchQuery ? 1 : 0) +
    (filters.dateRange !== 'all' ? 1 : 0);

  return (
    <Card className="w-full" data-macaly="advanced-filter-panel">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <span>Advanced Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {activeFilterCount} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {isLoading ? 'Searching...' : `${resultCount} results`}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search with Suggestions */}
        <div className="relative">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search builders, locations, services..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="pl-10"
              data-macaly="search-input"
            />
            {filters.searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFilter('searchQuery', '')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Search Suggestions */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    updateFilter('searchQuery', suggestion);
                    setShowSuggestions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                >
                  <Search className="inline h-3 w-3 mr-2 text-gray-400" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.verificationStatus.includes('verified') ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleArrayFilter('verificationStatus', 'verified')}
            className="h-8"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified Only
          </Button>
          <Button
            variant={filters.ratingRange[0] >= 4 ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilter('ratingRange', filters.ratingRange[0] >= 4 ? [0, 5] : [4, 5])}
            className="h-8"
          >
            <Star className="h-3 w-3 mr-1" />
            4+ Stars
          </Button>
          <Button
            variant={filters.capacity.includes('Large (201-500 sqm)') || filters.capacity.includes('Extra Large (500+ sqm)') ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              const hasLarge = filters.capacity.includes('Large (201-500 sqm)') || filters.capacity.includes('Extra Large (500+ sqm)');
              if (hasLarge) {
                updateFilter('capacity', filters.capacity.filter(c => !c.includes('Large')));
              } else {
                updateFilter('capacity', [...filters.capacity, 'Large (201-500 sqm)', 'Extra Large (500+ sqm)']);
              }
            }}
            className="h-8"
          >
            <Building className="h-3 w-3 mr-1" />
            Large Scale
          </Button>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-6 border-t pt-6">
            {/* Location Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Countries</Label>
                <Select 
                  value={filters.countries[0] || ''}
                  onValueChange={(value) => {
                    if (value && !filters.countries.includes(value)) {
                      updateFilter('countries', [...filters.countries, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select countries" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCountries.map((country, index) => (
                      <SelectItem key={`country-${country}-${index}`} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-1 mt-2">
                  {filters.countries.map((country, index) => (
                    <Badge key={`country-badge-${country}-${index}`} variant="secondary" className="text-xs">
                      {country}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleArrayFilter('countries', country)}
                        className="ml-1 p-0 h-4 w-4"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Cities</Label>
                <Select 
                  value={filters.cities[0] || ''}
                  onValueChange={(value) => {
                    if (value && !filters.cities.includes(value)) {
                      updateFilter('cities', [...filters.cities, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cities" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.map((city, index) => (
                      <SelectItem key={`city-${city}-${index}`} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-1 mt-2">
                  {filters.cities.map((city, index) => (
                    <Badge key={`city-badge-${city}-${index}`} variant="secondary" className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      {city}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleArrayFilter('cities', city)}
                        className="ml-1 p-0 h-4 w-4"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Service Types */}
            <div>
              <Label>Service Types</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {serviceTypes.map(service => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={filters.serviceTypes.includes(service)}
                      onCheckedChange={() => toggleArrayFilter('serviceTypes', service)}
                    />
                    <label htmlFor={service} className="text-sm cursor-pointer">
                      {service}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Range */}
            <div>
              <Label>Rating Range: {filters.ratingRange[0]} - {filters.ratingRange[1]} stars</Label>
              <Slider
                value={filters.ratingRange}
                onValueChange={(value) => updateFilter('ratingRange', value)}
                max={5}
                min={0}
                step={0.5}
                className="mt-2"
              />
            </div>

            {/* Project Capacity */}
            <div>
              <Label>Project Capacity</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {capacityRanges.map(range => (
                  <div key={range} className="flex items-center space-x-2">
                    <Checkbox
                      id={range}
                      checked={filters.capacity.includes(range)}
                      onCheckedChange={() => toggleArrayFilter('capacity', range)}
                    />
                    <label htmlFor={range} className="text-sm cursor-pointer">
                      {range}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Industry Specializations */}
            <div>
              <Label>Industry Specializations</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {specializations.map(spec => (
                  <div key={spec} className="flex items-center space-x-2">
                    <Checkbox
                      id={spec}
                      checked={filters.specializations.includes(spec)}
                      onCheckedChange={() => toggleArrayFilter('specializations', spec)}
                    />
                    <label htmlFor={spec} className="text-sm cursor-pointer">
                      {spec}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Status */}
            <div>
              <Label>Verification Status</Label>
              <div className="flex gap-4 mt-2">
                {[
                  { value: 'verified', label: 'Verified', icon: CheckCircle, color: 'text-green-600' },
                  { value: 'pending', label: 'Pending Review', icon: Clock, color: 'text-yellow-600' },
                  { value: 'unverified', label: 'Unverified', icon: AlertCircle, color: 'text-red-600' }
                ].map(({ value, label, icon: Icon, color }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={value}
                      checked={filters.verificationStatus.includes(value)}
                      onCheckedChange={() => toggleArrayFilter('verificationStatus', value)}
                    />
                    <label htmlFor={value} className={`text-sm cursor-pointer flex items-center gap-1 ${color}`}>
                      <Icon className="h-3 w-3" />
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filter Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-600">Smart filtering enabled</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              disabled={activeFilterCount === 0}
            >
              Clear All
            </Button>
            <Button
              size="sm"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                  Applying...
                </>
              ) : (
                <>
                  Apply Filters
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}