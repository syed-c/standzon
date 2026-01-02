'use client';

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/select';
import { Input } from '@/components/shared/input';
import { Label } from '@/components/shared/label';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  label?: string;
  className?: string;
}

const COUNTRY_CODES = [
  // North America
  { code: '+1', country: 'US', flag: '🇺🇸', name: 'United States' },
  { code: '+1', country: 'CA', flag: '🇨🇦', name: 'Canada' },
  { code: '+52', country: 'MX', flag: '🇲🇽', name: 'Mexico' },
  
  // Europe
  { code: '+44', country: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', country: 'FR', flag: '🇫🇷', name: 'France' },
  { code: '+39', country: 'IT', flag: '🇮🇹', name: 'Italy' },
  { code: '+34', country: 'ES', flag: '🇪🇸', name: 'Spain' },
  { code: '+31', country: 'NL', flag: '🇳🇱', name: 'Netherlands' },
  { code: '+32', country: 'BE', flag: '🇧🇪', name: 'Belgium' },
  { code: '+41', country: 'CH', flag: '🇨🇭', name: 'Switzerland' },
  { code: '+43', country: 'AT', flag: '🇦🇹', name: 'Austria' },
  { code: '+48', country: 'PL', flag: '🇵🇱', name: 'Poland' },
  { code: '+420', country: 'CZ', flag: '🇨🇿', name: 'Czech Republic' },
  { code: '+421', country: 'SK', flag: '🇸🇰', name: 'Slovakia' },
  { code: '+36', country: 'HU', flag: '🇭🇺', name: 'Hungary' },
  { code: '+45', country: 'DK', flag: '🇩🇰', name: 'Denmark' },
  { code: '+46', country: 'SE', flag: '🇸🇪', name: 'Sweden' },
  { code: '+47', country: 'NO', flag: '🇳🇴', name: 'Norway' },
  { code: '+358', country: 'FI', flag: '🇫🇮', name: 'Finland' },
  { code: '+351', country: 'PT', flag: '🇵🇹', name: 'Portugal' },
  { code: '+353', country: 'IE', flag: '🇮🇪', name: 'Ireland' },
  { code: '+30', country: 'GR', flag: '🇬🇷', name: 'Greece' },
  { code: '+7', country: 'RU', flag: '🇷🇺', name: 'Russia' },
  { code: '+90', country: 'TR', flag: '🇹🇷', name: 'Turkey' },
  
  // Middle East & Gulf
  { code: '+971', country: 'AE', flag: '🇦🇪', name: 'United Arab Emirates' },
  { code: '+966', country: 'SA', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+974', country: 'QA', flag: '🇶🇦', name: 'Qatar' },
  { code: '+965', country: 'KW', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+973', country: 'BH', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+968', country: 'OM', flag: '🇴🇲', name: 'Oman' },
  { code: '+972', country: 'IL', flag: '🇮🇱', name: 'Israel' },
  { code: '+961', country: 'LB', flag: '🇱🇧', name: 'Lebanon' },
  { code: '+962', country: 'JO', flag: '🇯🇴', name: 'Jordan' },
  { code: '+20', country: 'EG', flag: '🇪🇬', name: 'Egypt' },
  
  // Asia Pacific
  { code: '+65', country: 'SG', flag: '🇸🇬', name: 'Singapore' },
  { code: '+852', country: 'HK', flag: '🇭🇰', name: 'Hong Kong' },
  { code: '+86', country: 'CN', flag: '🇨🇳', name: 'China' },
  { code: '+81', country: 'JP', flag: '🇯🇵', name: 'Japan' },
  { code: '+82', country: 'KR', flag: '🇰🇷', name: 'South Korea' },
  { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
  { code: '+60', country: 'MY', flag: '🇲🇾', name: 'Malaysia' },
  { code: '+66', country: 'TH', flag: '🇹🇭', name: 'Thailand' },
  { code: '+84', country: 'VN', flag: '🇻🇳', name: 'Vietnam' },
  { code: '+63', country: 'PH', flag: '🇵🇭', name: 'Philippines' },
  { code: '+62', country: 'ID', flag: '🇮🇩', name: 'Indonesia' },
  { code: '+61', country: 'AU', flag: '🇦🇺', name: 'Australia' },
  { code: '+64', country: 'NZ', flag: '🇳🇿', name: 'New Zealand' },
  
  // South America
  { code: '+55', country: 'BR', flag: '🇧🇷', name: 'Brazil' },
  { code: '+54', country: 'AR', flag: '🇦🇷', name: 'Argentina' },
  { code: '+56', country: 'CL', flag: '🇨🇱', name: 'Chile' },
  { code: '+57', country: 'CO', flag: '🇨🇴', name: 'Colombia' },
  { code: '+51', country: 'PE', flag: '🇵🇪', name: 'Peru' },
  { code: '+598', country: 'UY', flag: '🇺🇾', name: 'Uruguay' },
  
  // Africa
  { code: '+27', country: 'ZA', flag: '🇿🇦', name: 'South Africa' },
  { code: '+234', country: 'NG', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+254', country: 'KE', flag: '🇰🇪', name: 'Kenya' },
  { code: '+233', country: 'GH', flag: '🇬🇭', name: 'Ghana' },
  { code: '+212', country: 'MA', flag: '🇲🇦', name: 'Morocco' },
  { code: '+216', country: 'TN', flag: '🇹🇳', name: 'Tunisia' }
];

export function PhoneInput({ value, onChange, placeholder, required, label, className = '' }: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Detect user's locale and set default country code
  useEffect(() => {
    const detectCountryCode = () => {
      try {
        const locale = navigator.language || 'en-US';
        const countryFromLocale = locale.split('-')[1];
        
        const defaultCountry = COUNTRY_CODES.find(c => c.country === countryFromLocale);
        if (defaultCountry) {
          setCountryCode(defaultCountry.code);
          console.log(`📱 Auto-detected country code: ${defaultCountry.code} (${defaultCountry.name})`);
        }
      } catch (error) {
        console.log('📱 Using default country code (+1)');
      }
    };

    detectCountryCode();
  }, []);

  // Parse existing value if provided
  useEffect(() => {
    if (value && value.includes(' ')) {
      const parts = value.split(' ');
      const code = parts[0];
      const number = parts.slice(1).join(' ');
      
      if (COUNTRY_CODES.some(c => c.code === code)) {
        setCountryCode(code);
        setPhoneNumber(number);
      }
    } else if (value) {
      setPhoneNumber(value);
    }
  }, [value]);

  const handleCountryCodeChange = (newValue: string) => {
    // Extract just the code part (e.g., "+1" from "+1-US")
    const code = newValue.split('-')[0];
    setCountryCode(code);
    const fullNumber = phoneNumber ? `${code} ${phoneNumber}` : code;
    onChange(fullNumber);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value;
    setPhoneNumber(newNumber);
    const fullNumber = newNumber ? `${countryCode} ${newNumber}` : countryCode;
    onChange(fullNumber);
  };

  return (
    <div className={className}>
      {label && (
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          {label} {required && '*'}
        </Label>
      )}
      <div className="flex gap-2">
        <Select value={`${countryCode}-${COUNTRY_CODES.find(c => c.code === countryCode)?.country || 'US'}`} onValueChange={handleCountryCodeChange}>
          <SelectTrigger className="w-28">
            <SelectValue>
              <span className="flex items-center gap-1">
                {COUNTRY_CODES.find(c => c.code === countryCode)?.flag}
                {countryCode}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent position="popper" align="start" sideOffset={4} className="z-50">
            {COUNTRY_CODES.map((country, index) => (
              <SelectItem key={`${country.country}-${index}`} value={`${country.code}-${country.country}`}>
                <span className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span>{country.code}</span>
                  <span className="text-sm text-gray-500">{country.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder={placeholder || "123 456 7890"}
          required={required}
          className="flex-1"
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        International format with country code
      </p>
    </div>
  );
}

export default PhoneInput;