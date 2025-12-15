import { COUNTRY_CODES } from '@/lib/data/countryCodes';

/**
 * Get country code by country name
 * @param countryName - Full country name (e.g. "United States", "Germany")
 * @returns Country code (e.g. "US", "DE") or undefined if not found
 */
export function getCountryCodeByName(countryName: string): string | undefined {
  const country = COUNTRY_CODES.find(
    c => c.name.toLowerCase() === countryName.toLowerCase()
  );
  return country?.code;
}

/**
 * Get country name by country code
 * @param countryCode - Country code (e.g. "US", "DE")
 * @returns Full country name (e.g. "United States", "Germany") or undefined if not found
 */
export function getCountryNameByCode(countryCode: string): string | undefined {
  const country = COUNTRY_CODES.find(
    c => c.code.toLowerCase() === countryCode.toLowerCase()
  );
  return country?.name;
}