// Script to update CMS data for countries and cities
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateCountriesWithoutCities() {
  console.log('Updating countries without city sections...');
  
  // Countries that should not display city sections
  const countriesWithoutCities = ['tw', 'hk', 'nz', 'vn', 'id', 'ph', 'in', 'au', 'es', 'ch', 'at', 'se', 'no', 'dk', 'fi'];
  
  // Update each country in the CMS
  for (const countryCode of countriesWithoutCities) {
    try {
      // Find the country in the CMS
      const { data: country, error: findError } = await supabase
        .from('countries')
        .select('*')
        .eq('code', countryCode)
        .single();
      
      if (findError) {
        console.error(`Error finding country ${countryCode}:`, findError);
        continue;
      }
      
      if (!country) {
        console.log(`Country ${countryCode} not found in CMS`);
        continue;
      }
      
      // Update the country to hide city sections
      const { error: updateError } = await supabase
        .from('countries')
        .update({ hide_cities_section: true })
        .eq('code', countryCode);
      
      if (updateError) {
        console.error(`Error updating country ${countryCode}:`, updateError);
      } else {
        console.log(`Successfully updated ${countryCode} to hide city sections`);
      }
    } catch (error) {
      console.error(`Unexpected error for country ${countryCode}:`, error);
    }
  }
}

async function addNewCityPages() {
  console.log('Adding new city pages...');
  
  const newCities = [
    { country_code: 'jp', city_code: 'chiba', city_name: 'Chiba', active: true },
    { country_code: 'be', city_code: 'kortrijk', city_name: 'Kortrijk', active: true },
    { country_code: 'th', city_code: 'khon-kaen', city_name: 'Khon Kaen', active: true },
    { country_code: 'fr', city_code: 'strasbourg', city_name: 'Strasbourg', active: true },
    { country_code: 'nl', city_code: 'maastricht', city_name: 'Maastricht', active: true },
    { country_code: 'nl', city_code: 'rotterdam', city_name: 'Rotterdam', active: true },
    { country_code: 'nl', city_code: 'vijfhuizen', city_name: 'Vijfhuizen', active: true }
  ];
  
  for (const city of newCities) {
    try {
      // Check if city already exists
      const { data: existingCity, error: findError } = await supabase
        .from('cities')
        .select('*')
        .eq('country_code', city.country_code)
        .eq('city_code', city.city_code)
        .single();
      
      if (findError && findError.code !== 'PGRST116') { // PGRST116 is "not found" which is expected
        console.error(`Error checking for existing city ${city.city_name}:`, findError);
        continue;
      }
      
      if (existingCity) {
        // Update existing city to ensure it's active
        const { error: updateError } = await supabase
          .from('cities')
          .update({ active: true })
          .eq('id', existingCity.id);
        
        if (updateError) {
          console.error(`Error updating city ${city.city_name}:`, updateError);
        } else {
          console.log(`Successfully updated ${city.city_name} to be active`);
        }
      } else {
        // Insert new city
        const { error: insertError } = await supabase
          .from('cities')
          .insert([city]);
        
        if (insertError) {
          console.error(`Error inserting city ${city.city_name}:`, insertError);
        } else {
          console.log(`Successfully added new city: ${city.city_name}`);
        }
      }
    } catch (error) {
      console.error(`Unexpected error for city ${city.city_name}:`, error);
    }
  }
}

async function removeCityPages() {
  console.log('Removing specified city pages...');
  
  const citiesToRemove = [
    { country_code: 'us', city_code: 'las-vegas' },
    { country_code: 'us', city_code: 'orlando' },
    { country_code: 'de', city_code: 'hamburg' },
    { country_code: 'gb', city_code: 'manchester' },
    { country_code: 'it', city_code: 'milan' },
    { country_code: 'es', city_code: 'barcelona' },
    { country_code: 'cn', city_code: 'shanghai' },
    { country_code: 'ae', city_code: 'abu-dhabi' },
    { country_code: 'br', city_code: 'sao-paulo' },
    { country_code: 'ca', city_code: 'toronto' },
    { country_code: 'au', city_code: 'sydney' },
    { country_code: 'sg', city_code: 'singapore-city' },
    { country_code: 'kr', city_code: 'seoul' },
    { country_code: 'tr', city_code: 'istanbul' },
    { country_code: 'ru', city_code: 'moscow' },
    { country_code: 'in', city_code: 'new-delhi' },
    { country_code: 'mx', city_code: 'mexico-city' },
    { country_code: 'za', city_code: 'johannesburg' }
  ];
  
  for (const city of citiesToRemove) {
    try {
      // Find the city in the CMS
      const { data: existingCity, error: findError } = await supabase
        .from('cities')
        .select('*')
        .eq('country_code', city.country_code)
        .eq('city_code', city.city_code)
        .single();
      
      if (findError && findError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error(`Error finding city ${city.country_code}/${city.city_code}:`, findError);
        continue;
      }
      
      if (!existingCity) {
        console.log(`City ${city.country_code}/${city.city_code} not found in CMS`);
        continue;
      }
      
      // Set the city to inactive instead of deleting to prevent issues
      const { error: updateError } = await supabase
        .from('cities')
        .update({ active: false })
        .eq('id', existingCity.id);
      
      if (updateError) {
        console.error(`Error deactivating city ${city.country_code}/${city.city_code}:`, updateError);
      } else {
        console.log(`Successfully deactivated city: ${city.country_code}/${city.city_code}`);
      }
    } catch (error) {
      console.error(`Unexpected error for city ${city.country_code}/${city.city_code}:`, error);
    }
  }
}

async function main() {
  try {
    await updateCountriesWithoutCities();
    await addNewCityPages();
    await removeCityPages();
    console.log('CMS data update completed successfully!');
  } catch (error) {
    console.error('Error updating CMS data:', error);
  }
}

main();