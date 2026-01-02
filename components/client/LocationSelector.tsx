'use client';

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/select';
import { Badge } from '@/components/shared/badge';
import { Input } from '@/components/shared/input';
import { Button } from '@/components/shared/button';
import { GLOBAL_EXHIBITION_DATA } from '@/lib/data/globalCities';
import { Search, MapPin, Globe, Building } from 'lucide-react';

interface LocationSelectorProps {
  onLocationChange?: (location: {
    continent?: string;
    country?: string;
    city?: string;
    countryCode?: string;
  }) => void;
  value?: {
    continent?: string;
    country?: string;
    city?: string;
  };
  mode?: 'country-only' | 'city-only' | 'full';
  placeholder?: string;
  allowClear?: boolean;
}

export default function LocationSelector({
  onLocationChange,
  value,
  mode = 'full',
  placeholder = 'Select location...',
  allowClear = true
}: LocationSelectorProps) {
  const [selectedContinent, setSelectedContinent] = useState(value?.continent || '');
  const [selectedCountry, setSelectedCountry] = useState(value?.country || '');
  const [selectedCity, setSelectedCity] = useState(value?.city || '');
  const [searchTerm, setSearchTerm] = useState('');

  console.log('🌍 LocationSelector: Using comprehensive global data', {
    totalCountries: GLOBAL_EXHIBITION_DATA.countries.length,
    totalCities: GLOBAL_EXHIBITION_DATA.cities?.length || 0,
    continents: GLOBAL_EXHIBITION_DATA.continents.length
  });

  // Get filtered countries based on continent
  const availableCountries = GLOBAL_EXHIBITION_DATA.countries.filter(country => 
    !selectedContinent || country.continent === selectedContinent
  );

  // Get filtered cities based on country
  const availableCities = GLOBAL_EXHIBITION_DATA.cities?.filter(city => 
    !selectedCountry || city.country === selectedCountry
  ) || [];

  // Search functionality
  const filteredCountries = availableCountries.filter(country =>
    !searchTerm || country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCities = availableCities.filter(city =>
    !searchTerm || city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLocationChange = (type: 'continent' | 'country' | 'city', value: string) => {
    // Convert "all" back to empty string for internal logic
    const actualValue = value === 'all' ? '' : value;
    
    let newLocation: {
      continent: string;
      country: string;
      city: string;
      countryCode?: string;
    } = {
      continent: selectedContinent,
      country: selectedCountry,
      city: selectedCity
    };

    switch (type) {
      case 'continent':
        setSelectedContinent(actualValue);
        setSelectedCountry(''); // Reset country when continent changes
        setSelectedCity(''); // Reset city when continent changes
        newLocation = { continent: actualValue, country: '', city: '' };
        break;
      case 'country':
        const country = GLOBAL_EXHIBITION_DATA.countries.find(c => c.name === actualValue);
        setSelectedCountry(actualValue);
        setSelectedCity(''); // Reset city when country changes
        newLocation = { 
          continent: selectedContinent, 
          country: actualValue, 
          city: '',
          countryCode: country?.countryCode
        };
        break;
      case 'city':
        const city = GLOBAL_EXHIBITION_DATA.cities?.find(c => c.name === actualValue);
        setSelectedCity(actualValue);
        newLocation = { 
          continent: selectedContinent, 
          country: selectedCountry, 
          city: actualValue,
          countryCode: city?.countryCode
        };
        break;
    }

    onLocationChange?.(newLocation);
  };

  const handleClear = () => {
    setSelectedContinent('');
    setSelectedCountry('');
    setSelectedCity('');
    setSearchTerm('');
    onLocationChange?.({});
  };

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedContinent(value.continent || '');
      setSelectedCountry(value.country || '');
      setSelectedCity(value.city || '');
    }
  }, [value]);

  if (mode === 'country-only') {
    return (
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCountry} onValueChange={(value) => handleLocationChange('country', value)}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {allowClear && (
              <SelectItem value="all">All Countries</SelectItem>
            )}
            {filteredCountries.map((country) => (
              <SelectItem key={country.id} value={country.name}>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>{country.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {country.countryCode}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (mode === 'city-only') {
    return (
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCity} onValueChange={(value) => handleLocationChange('city', value)}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {allowClear && (
              <SelectItem value="all">All Cities</SelectItem>
            )}
            {filteredCities.map((city) => (
              <SelectItem key={city.id} value={city.name}>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>{city.name}</span>
                  <span className="text-gray-500">({city.country})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Continent Selection */}
      <Select value={selectedContinent} onValueChange={(value) => handleLocationChange('continent', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select continent..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Continents</SelectItem>
          {GLOBAL_EXHIBITION_DATA.continents.map((continent) => (
            <SelectItem key={continent} value={continent}>
              {continent}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Country Selection */}
      <Select 
        value={selectedCountry} 
        onValueChange={(value) => handleLocationChange('country', value)}
        disabled={!selectedContinent}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select country..." />
        </SelectTrigger>
        <SelectContent>
          {allowClear && (
            <SelectItem value="all">All Countries</SelectItem>
          )}
          {filteredCountries.map((country, index) => (
            <SelectItem key={`country-${country.id}-${index}`} value={country.name}>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>{country.name}</span>
                <Badge variant="outline" className="text-xs">
                  {country.countryCode}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* City Selection */}
      <Select 
        value={selectedCity} 
        onValueChange={(value) => handleLocationChange('city', value)}
        disabled={!selectedCountry}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select city..." />
        </SelectTrigger>
        <SelectContent>
          {allowClear && (
            <SelectItem value="all">All Cities</SelectItem>
          )}
          {filteredCities.map((city, index) => (
            <SelectItem key={`city-${city.id}-${index}`} value={city.name}>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                <span>{city.name}</span>
                {city.isCapital && (
                  <Badge variant="default" className="text-xs">Capital</Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Selected Location Display */}
      {(selectedContinent || selectedCountry || selectedCity) && (
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-sm">
              {[selectedContinent, selectedCountry, selectedCity].filter(Boolean).join(' → ')}
            </span>
          </div>
          {allowClear && (
            <Button variant="ghost" size="sm" onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

