/**
 * Simple Supabase Migration Script
 * 
 * This script migrates data from existing systems to Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

class SimpleMigration {
  constructor() {
    this.stats = {
      countries: 0,
      cities: 0,
      builders: 0,
      exhibitions: 0,
      siteSettings: 0,
      errors: []
    };
  }

  async migrate() {
    console.log('🚀 Starting Supabase Migration...');
    console.log('=====================================');
    
    try {
      // 1. Migrate Countries
      await this.migrateCountries();
      
      // 2. Migrate Cities
      await this.migrateCities();
      
      // 3. Migrate Builders
      await this.migrateBuilders();
      
      // 4. Migrate Exhibitions
      await this.migrateExhibitions();
      
      // 5. Migrate Site Settings
      await this.migrateSiteSettings();
      
      // 6. Migrate File Data
      await this.migrateFileData();
      
      // 7. Generate Report
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      this.stats.errors.push(`Migration failed: ${error.message}`);
    }
  }

  async migrateCountries() {
    console.log('🌍 Migrating countries...');
    
    const countries = [
      { countryName: 'United States', countryCode: 'US', countrySlug: 'united-states', continent: 'North America', currency: 'USD', timezone: 'America/New_York', language: 'en', active: true },
      { countryName: 'Germany', countryCode: 'DE', countrySlug: 'germany', continent: 'Europe', currency: 'EUR', timezone: 'Europe/Berlin', language: 'de', active: true },
      { countryName: 'United Kingdom', countryCode: 'GB', countrySlug: 'united-kingdom', continent: 'Europe', currency: 'GBP', timezone: 'Europe/London', language: 'en', active: true },
      { countryName: 'France', countryCode: 'FR', countrySlug: 'france', continent: 'Europe', currency: 'EUR', timezone: 'Europe/Paris', language: 'fr', active: true },
      { countryName: 'Italy', countryCode: 'IT', countrySlug: 'italy', continent: 'Europe', currency: 'EUR', timezone: 'Europe/Rome', language: 'it', active: true },
      { countryName: 'Spain', countryCode: 'ES', countrySlug: 'spain', continent: 'Europe', currency: 'EUR', timezone: 'Europe/Madrid', language: 'es', active: true },
      { countryName: 'Netherlands', countryCode: 'NL', countrySlug: 'netherlands', continent: 'Europe', currency: 'EUR', timezone: 'Europe/Amsterdam', language: 'nl', active: true },
      { countryName: 'China', countryCode: 'CN', countrySlug: 'china', continent: 'Asia', currency: 'CNY', timezone: 'Asia/Shanghai', language: 'zh', active: true },
      { countryName: 'Japan', countryCode: 'JP', countrySlug: 'japan', continent: 'Asia', currency: 'JPY', timezone: 'Asia/Tokyo', language: 'ja', active: true },
      { countryName: 'Canada', countryCode: 'CA', countrySlug: 'canada', continent: 'North America', currency: 'CAD', timezone: 'America/Toronto', language: 'en', active: true }
    ];

    for (const country of countries) {
      try {
        const { data, error } = await supabase
          .from('countries')
          .insert({
            country_name: country.countryName,
            country_code: country.countryCode,
            country_slug: country.countrySlug,
            continent: country.continent,
            currency: country.currency,
            timezone: country.timezone,
            language: country.language,
            active: country.active,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error(`Error upserting country ${country.countryName}:`, error);
          this.stats.errors.push(`Country ${country.countryName}: ${error.message}`);
        } else {
          this.stats.countries++;
        }
      } catch (error) {
        console.error(`Error processing country ${country.countryName}:`, error);
        this.stats.errors.push(`Country ${country.countryName}: ${error.message}`);
      }
    }

    console.log(`✅ Migrated ${this.stats.countries} countries`);
  }

  async migrateCities() {
    console.log('🏙️ Migrating cities...');
    
    const cities = [
      { cityName: 'New York', citySlug: 'new-york', countryCode: 'US', countryName: 'United States', state: 'NY', timezone: 'America/New_York', latitude: 40.7128, longitude: -74.0060, population: 8336817 },
      { cityName: 'Los Angeles', citySlug: 'los-angeles', countryCode: 'US', countryName: 'United States', state: 'CA', timezone: 'America/Los_Angeles', latitude: 34.0522, longitude: -118.2437, population: 3979576 },
      { cityName: 'Chicago', citySlug: 'chicago', countryCode: 'US', countryName: 'United States', state: 'IL', timezone: 'America/Chicago', latitude: 41.8781, longitude: -87.6298, population: 2693976 },
      { cityName: 'Berlin', citySlug: 'berlin', countryCode: 'DE', countryName: 'Germany', timezone: 'Europe/Berlin', latitude: 52.5200, longitude: 13.4050, population: 3669491 },
      { cityName: 'Munich', citySlug: 'munich', countryCode: 'DE', countryName: 'Germany', timezone: 'Europe/Berlin', latitude: 48.1351, longitude: 11.5820, population: 1484226 },
      { cityName: 'London', citySlug: 'london', countryCode: 'GB', countryName: 'United Kingdom', timezone: 'Europe/London', latitude: 51.5074, longitude: -0.1278, population: 8982000 },
      { cityName: 'Paris', citySlug: 'paris', countryCode: 'FR', countryName: 'France', timezone: 'Europe/Paris', latitude: 48.8566, longitude: 2.3522, population: 2161000 },
      { cityName: 'Milan', citySlug: 'milan', countryCode: 'IT', countryName: 'Italy', timezone: 'Europe/Rome', latitude: 45.4642, longitude: 9.1900, population: 1399860 },
      { cityName: 'Madrid', citySlug: 'madrid', countryCode: 'ES', countryName: 'Spain', timezone: 'Europe/Madrid', latitude: 40.4168, longitude: -3.7038, population: 3223334 },
      { cityName: 'Amsterdam', citySlug: 'amsterdam', countryCode: 'NL', countryName: 'Netherlands', timezone: 'Europe/Amsterdam', latitude: 52.3676, longitude: 4.9041, population: 872680 }
    ];

    for (const city of cities) {
      try {
        // First get the country ID
        const { data: country } = await supabase
          .from('countries')
          .select('id')
          .eq('country_code', city.countryCode)
          .single();

        if (country) {
          const { data, error } = await supabase
            .from('cities')
            .insert({
              city_name: city.cityName,
              city_slug: city.citySlug,
              country_id: country.id,
              country_name: city.countryName,
              country_code: city.countryCode,
              state: city.state,
              timezone: city.timezone,
              latitude: city.latitude,
              longitude: city.longitude,
              population: city.population,
              active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (error) {
            console.error(`Error upserting city ${city.cityName}:`, error);
            this.stats.errors.push(`City ${city.cityName}: ${error.message}`);
          } else {
            this.stats.cities++;
          }
        } else {
          console.error(`Country not found for city ${city.cityName}`);
          this.stats.errors.push(`City ${city.cityName}: Country ${city.countryCode} not found`);
        }
      } catch (error) {
        console.error(`Error processing city ${city.cityName}:`, error);
        this.stats.errors.push(`City ${city.cityName}: ${error.message}`);
      }
    }

    console.log(`✅ Migrated ${this.stats.cities} cities`);
  }

  async migrateBuilders() {
    console.log('🏗️ Migrating builders...');
    
    const builders = [
      {
        company_name: 'Exhibit Solutions Inc',
        slug: 'exhibit-solutions-inc',
        primary_email: 'info@exhibitsolutions.com',
        headquarters_city: 'New York',
        headquarters_country: 'United States',
        headquarters_country_code: 'US',
        company_description: 'Leading exhibition stand builder with 20+ years experience',
        verified: true,
        premium_member: true
      },
      {
        company_name: 'Stand Builders Europe',
        slug: 'stand-builders-europe',
        primary_email: 'contact@standbuilders.eu',
        headquarters_city: 'Berlin',
        headquarters_country: 'Germany',
        headquarters_country_code: 'DE',
        company_description: 'European leader in custom exhibition stands',
        verified: true,
        premium_member: true
      },
      {
        company_name: 'Exhibition Masters',
        slug: 'exhibition-masters',
        primary_email: 'hello@exhibitionmasters.com',
        headquarters_city: 'London',
        headquarters_country: 'United Kingdom',
        headquarters_country_code: 'GB',
        company_description: 'Premium exhibition stand design and construction',
        verified: true,
        premium_member: false
      }
    ];

    for (const builder of builders) {
      try {
        const { data, error } = await supabase
          .from('builder_profiles')
          .upsert({
            company_name: builder.company_name,
            slug: builder.slug,
            primary_email: builder.primary_email,
            headquarters_city: builder.headquarters_city,
            headquarters_country: builder.headquarters_country,
            headquarters_country_code: builder.headquarters_country_code,
            company_description: builder.company_description,
            verified: builder.verified,
            premium_member: builder.premium_member,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'slug' });

        if (error) {
          console.error(`Error upserting builder ${builder.company_name}:`, error);
          this.stats.errors.push(`Builder ${builder.company_name}: ${error.message}`);
        } else {
          this.stats.builders++;
        }
      } catch (error) {
        console.error(`Error processing builder ${builder.company_name}:`, error);
        this.stats.errors.push(`Builder ${builder.company_name}: ${error.message}`);
      }
    }

    console.log(`✅ Migrated ${this.stats.builders} builders`);
  }

  async migrateExhibitions() {
    console.log('🎪 Migrating exhibitions...');
    
    const exhibitions = [
      {
        name: 'CES - Consumer Electronics Show',
        slug: 'ces-consumer-electronics-show',
        city_name: 'Las Vegas',
        country_name: 'United States',
        country_code: 'US',
        industry: 'Technology',
        category: 'Trade Show',
        venue: 'Las Vegas Convention Center',
        start_date: new Date('2024-01-09'),
        end_date: new Date('2024-01-12'),
        active: true,
        featured: true
      },
      {
        name: 'Mobile World Congress',
        slug: 'mobile-world-congress',
        city_name: 'Barcelona',
        country_name: 'Spain',
        country_code: 'ES',
        industry: 'Mobile Technology',
        category: 'Trade Show',
        venue: 'Fira Barcelona',
        start_date: new Date('2024-02-26'),
        end_date: new Date('2024-02-29'),
        active: true,
        featured: true
      },
      {
        name: 'IFA Berlin',
        slug: 'ifa-berlin',
        city_name: 'Berlin',
        country_name: 'Germany',
        country_code: 'DE',
        industry: 'Consumer Electronics',
        category: 'Trade Show',
        venue: 'Messe Berlin',
        start_date: new Date('2024-09-06'),
        end_date: new Date('2024-09-10'),
        active: true,
        featured: true
      }
    ];

    for (const exhibition of exhibitions) {
      try {
        const { data, error } = await supabase
          .from('exhibitions')
          .upsert({
            name: exhibition.name,
            slug: exhibition.slug,
            city_name: exhibition.city_name,
            country_name: exhibition.country_name,
            country_code: exhibition.country_code,
            industry: exhibition.industry,
            category: exhibition.category,
            venue: exhibition.venue,
            start_date: exhibition.start_date.toISOString(),
            end_date: exhibition.end_date.toISOString(),
            active: exhibition.active,
            featured: exhibition.featured,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'slug' });

        if (error) {
          console.error(`Error upserting exhibition ${exhibition.name}:`, error);
          this.stats.errors.push(`Exhibition ${exhibition.name}: ${error.message}`);
        } else {
          this.stats.exhibitions++;
        }
      } catch (error) {
        console.error(`Error processing exhibition ${exhibition.name}:`, error);
        this.stats.errors.push(`Exhibition ${exhibition.name}: ${error.message}`);
      }
    }

    console.log(`✅ Migrated ${this.stats.exhibitions} exhibitions`);
  }

  async migrateSiteSettings() {
    console.log('⚙️ Migrating site settings...');
    
    const settings = [
      {
        key: 'site_name',
        value: 'ExhibitBay',
        description: 'The name of the website',
        category: 'general',
        is_public: true
      },
      {
        key: 'site_description',
        value: 'Find the best exhibition stand builders worldwide',
        description: 'The description of the website',
        category: 'general',
        is_public: true
      },
      {
        key: 'contact_email',
        value: 'info@exhibitbay.com',
        description: 'Main contact email address',
        category: 'contact',
        is_public: true
      },
      {
        key: 'default_currency',
        value: 'USD',
        description: 'Default currency for the platform',
        category: 'general',
        is_public: true
      }
    ];

    for (const setting of settings) {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .upsert({
            key: setting.key,
            value: setting.value,
            description: setting.description,
            category: setting.category,
            is_public: setting.is_public,
            last_modified: new Date().toISOString()
          }, { onConflict: 'key' });

        if (error) {
          console.error(`Error upserting setting ${setting.key}:`, error);
          this.stats.errors.push(`Setting ${setting.key}: ${error.message}`);
        } else {
          this.stats.siteSettings++;
        }
      } catch (error) {
        console.error(`Error processing setting ${setting.key}:`, error);
        this.stats.errors.push(`Setting ${setting.key}: ${error.message}`);
      }
    }

    console.log(`✅ Migrated ${this.stats.siteSettings} site settings`);
  }

  async migrateFileData() {
    console.log('📁 Migrating file data...');
    
    try {
      const dataDir = path.join(process.cwd(), 'data');
      
      if (fs.existsSync(dataDir)) {
        // Migrate page contents
        const pageContentsFile = path.join(dataDir, 'page-contents.json');
        
        if (fs.existsSync(pageContentsFile)) {
          const pageContents = JSON.parse(fs.readFileSync(pageContentsFile, 'utf8'));
          
          for (const [key, content] of Object.entries(pageContents)) {
            try {
              const { data, error } = await supabase
                .from('site_settings')
                .upsert({
                  key: `page_content_${key}`,
                  value: content,
                  description: `Page content for ${key}`,
                  category: 'content',
                  is_public: true,
                  last_modified: new Date().toISOString()
                }, { onConflict: 'key' });

              if (error) {
                console.error(`Error upserting page content ${key}:`, error);
                this.stats.errors.push(`Page content ${key}: ${error.message}`);
              }
            } catch (error) {
              console.error(`Error processing page content ${key}:`, error);
              this.stats.errors.push(`Page content ${key}: ${error.message}`);
            }
          }
        }
        
        console.log('✅ File data migration completed');
      } else {
        console.log('📁 No data directory found, skipping file migration');
      }
    } catch (error) {
      console.error('❌ File migration failed:', error);
      this.stats.errors.push(`File migration failed: ${error.message}`);
    }
  }

  generateReport() {
    console.log('\n📊 Migration Report');
    console.log('==================');
    
    console.log(`\n🌍 Countries: ${this.stats.countries} records`);
    console.log(`🏙️ Cities: ${this.stats.cities} records`);
    console.log(`🏗️ Builders: ${this.stats.builders} records`);
    console.log(`🎪 Exhibitions: ${this.stats.exhibitions} records`);
    console.log(`⚙️ Site Settings: ${this.stats.siteSettings} records`);
    
    if (this.stats.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.stats.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
    console.log('\n✅ Migration completed!');
    console.log('=====================================');
    console.log('Next steps:');
    console.log('1. Update your application to use the new Supabase database');
    console.log('2. Test all functionality with Supabase');
    console.log('3. Remove old database connections when ready');
  }
}

// Run the migration
async function main() {
  const migration = new SimpleMigration();
  await migration.migrate();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SimpleMigration;
