"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GLOBAL_COUNTRIES, getCitiesByCountry, getCountryBySlug, getCityBySlug } from '@/lib/data/globalExhibitionDatabase';
import type { GlobalCountry, GlobalCity } from '@/lib/data/globalExhibitionDatabase';

// Pre-sorted top countries by builder count for initial dropdown
const TOP_COUNTRIES = [...GLOBAL_COUNTRIES]
  .sort((a, b) => b.builderCount - a.builderCount)
  .slice(0, 5);

interface HeroSearchFilterProps {
  defaultCountrySlug?: string;
  defaultCitySlug?: string;
}

export default function HeroSearchFilter({ defaultCountrySlug, defaultCitySlug }: HeroSearchFilterProps) {
  const router = useRouter();

  // Country state
  const [countryQuery, setCountryQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<GlobalCountry | null>(null);
  const [countryResults, setCountryResults] = useState<GlobalCountry[]>([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);

  // City state
  const [cityQuery, setCityQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<GlobalCity | null>(null);
  const [cityResults, setCityResults] = useState<GlobalCity[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [countryCities, setCountryCities] = useState<GlobalCity[]>([]);
  const cityRef = useRef<HTMLDivElement>(null);

  // Initialize defaults from props
  useEffect(() => {
    if (defaultCountrySlug) {
      const country = getCountryBySlug(defaultCountrySlug);
      if (country) {
        setSelectedCountry(country);
        setCountryQuery(country.name);

        if (defaultCitySlug) {
          const city = getCityBySlug(defaultCountrySlug, defaultCitySlug);
          if (city) {
            setSelectedCity(city);
            setCityQuery(city.name);
          }
        }
      }
    }
  }, [defaultCountrySlug, defaultCitySlug]);

  // Load cities when a country is selected
  useEffect(() => {
    if (selectedCountry) {
      const cities = getCitiesByCountry(selectedCountry.slug);
      setCountryCities(cities);
    } else {
      setCountryCities([]);
    }
  }, [selectedCountry]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setShowCountryDropdown(false);
      }
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Country search
  const handleCountryInput = useCallback((value: string) => {
    setCountryQuery(value);
    setSelectedCountry(null);
    setCityQuery('');
    setSelectedCity(null);

    if (value.trim() === '') {
      setCountryResults(TOP_COUNTRIES);
    } else {
      const term = value.toLowerCase();
      const matches = GLOBAL_COUNTRIES
        .filter(c => c.name.toLowerCase().includes(term))
        .sort((a, b) => {
          const aStarts = a.name.toLowerCase().startsWith(term) ? 0 : 1;
          const bStarts = b.name.toLowerCase().startsWith(term) ? 0 : 1;
          if (aStarts !== bStarts) return aStarts - bStarts;
          return b.builderCount - a.builderCount;
        })
        .slice(0, 5);
      setCountryResults(matches);
    }
    setShowCountryDropdown(true);
  }, []);

  // City search
  const handleCityInput = useCallback((value: string) => {
    setCityQuery(value);
    setSelectedCity(null);

    if (value.trim() === '') {
      setCityResults(
        [...countryCities]
          .sort((a, b) => b.builderCount - a.builderCount)
          .slice(0, 5)
      );
    } else {
      const term = value.toLowerCase();
      const matches = countryCities
        .filter(c => c.name.toLowerCase().includes(term))
        .sort((a, b) => {
          const aStarts = a.name.toLowerCase().startsWith(term) ? 0 : 1;
          const bStarts = b.name.toLowerCase().startsWith(term) ? 0 : 1;
          if (aStarts !== bStarts) return aStarts - bStarts;
          return b.builderCount - a.builderCount;
        })
        .slice(0, 5);
      setCityResults(matches);
    }
    setShowCityDropdown(true);
  }, [countryCities]);

  // Select handlers
  const selectCountry = (country: GlobalCountry) => {
    setSelectedCountry(country);
    setCountryQuery(country.name);
    setShowCountryDropdown(false);
    setCityQuery('');
    setSelectedCity(null);
  };

  const selectCity = (city: GlobalCity) => {
    setSelectedCity(city);
    setCityQuery(city.name);
    setShowCityDropdown(false);
  };

  // Search / navigate
  const handleSearch = () => {
    if (selectedCountry && selectedCity) {
      router.push(`/exhibition-stands/${selectedCountry.slug}/${selectedCity.slug}`);
    } else if (selectedCountry) {
      router.push(`/exhibition-stands/${selectedCountry.slug}`);
    }
  };

  return (
    <div className="max-w-3xl w-full bg-white p-2 shadow-2xl flex flex-col md:flex-row gap-2 mb-12 relative z-[100]">
      {/* Country input */}
      <div ref={countryRef} className="flex-1 relative border-b md:border-b-0 md:border-r border-slate-100">
        <div className="flex items-center px-4 gap-3 py-3">
          <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <input
            className="w-full border-none focus:ring-0 text-[#0f172a] text-sm font-medium placeholder:text-slate-400 bg-transparent outline-none"
            placeholder="Select Country..."
            type="text"
            value={countryQuery}
            onChange={(e) => handleCountryInput(e.target.value)}
            onFocus={() => {
              if (countryQuery.trim() === '' && !selectedCountry) {
                setCountryResults(TOP_COUNTRIES);
              }
              setShowCountryDropdown(true);
            }}
            autoComplete="off"
          />
          {selectedCountry && (
            <button
              onClick={() => {
                setSelectedCountry(null);
                setCountryQuery('');
                setCityQuery('');
                setSelectedCity(null);
                setCountryResults(TOP_COUNTRIES);
                setShowCountryDropdown(true);
              }}
              className="text-slate-400 hover:text-slate-600 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        {/* Country dropdown */}
        {showCountryDropdown && countryResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-xl z-[9999] max-h-60 overflow-y-auto">
            {countryResults.map((country) => (
              <button
                key={country.id}
                onClick={() => selectCountry(country)}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 border-b border-slate-50 last:border-b-0"
              >
                <div>
                  <span className="text-sm font-bold text-[#0f172a]">{country.name}</span>
                  <span className="text-[10px] text-slate-400 ml-2 uppercase tracking-widest">{country.region}</span>
                </div>
                <span className="text-[10px] font-bold text-[#1e3886] uppercase tracking-widest whitespace-nowrap">{country.builderCount} builders</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* City input */}
      <div ref={cityRef} className="flex-1 relative">
        <div className="flex items-center px-4 gap-3 py-3">
          <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <input
            className={`w-full border-none focus:ring-0 text-sm font-medium bg-transparent outline-none ${
              selectedCountry ? 'text-[#0f172a] placeholder:text-slate-400' : 'text-slate-300 placeholder:text-slate-300 cursor-not-allowed'
            }`}
            placeholder={selectedCountry ? `Search cities in ${selectedCountry.name}...` : 'Select a country first...'}
            type="text"
            value={cityQuery}
            onChange={(e) => handleCityInput(e.target.value)}
            onFocus={() => {
              if (selectedCountry) {
                if (cityQuery.trim() === '' && !selectedCity) {
                  setCityResults(
                    [...countryCities]
                      .sort((a, b) => b.builderCount - a.builderCount)
                      .slice(0, 5)
                  );
                }
                setShowCityDropdown(true);
              }
            }}
            disabled={!selectedCountry}
            autoComplete="off"
          />
          {selectedCity && (
            <button
              onClick={() => {
                setSelectedCity(null);
                setCityQuery('');
                setCityResults(
                  [...countryCities]
                    .sort((a, b) => b.builderCount - a.builderCount)
                    .slice(0, 5)
                );
                setShowCityDropdown(true);
              }}
              className="text-slate-400 hover:text-slate-600 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        {/* City dropdown */}
        {showCityDropdown && cityResults.length > 0 && selectedCountry && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-xl z-[9999] max-h-60 overflow-y-auto">
            {cityResults.map((city) => (
              <button
                key={city.id}
                onClick={() => selectCity(city)}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 border-b border-slate-50 last:border-b-0"
              >
                <div>
                  <span className="text-sm font-bold text-[#0f172a]">{city.name}</span>
                  <span className="text-[10px] text-slate-400 ml-2 uppercase tracking-widest">{city.region}</span>
                </div>
                <span className="text-[10px] font-bold text-[#1e3886] uppercase tracking-widest whitespace-nowrap">{city.builderCount} builders</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search button */}
      <button
        onClick={handleSearch}
        disabled={!selectedCountry}
        className={`px-10 py-4 font-bold uppercase tracking-widest transition-colors text-center text-sm ${
          selectedCountry
            ? 'bg-[#c0123d] hover:bg-[#0f172a] text-white cursor-pointer'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        Search
      </button>
    </div>
  );
}
