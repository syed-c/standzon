import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GLOBAL_EXHIBITION_DATA } from "@/lib/data/globalCities";

export const metadata: Metadata = {
  title: "Sitemap | StandsZone",
  description: "Complete sitemap of StandsZone website with all pages organized by category",
  keywords: "sitemap, StandsZone pages, exhibition stand builders, trade show services",
};

export default function SitemapPage() {
  // Group countries by continent using GLOBAL_EXHIBITION_DATA
  const continents: Record<string, Array<{ country: string; countrySlug: string; cities: Array<{ name: string; slug: string }> }>> = {
    "Europe": [],
    "North America": [],
    "Asia": [],
    "Middle East": [],
    "Africa": [],
    "South America": [],
    "Oceania": [],
  };

  // Get all countries and cities from GLOBAL_EXHIBITION_DATA
  const countries = GLOBAL_EXHIBITION_DATA.countries || [];
  const cities = GLOBAL_EXHIBITION_DATA.cities || [];

  console.log(`Processing ${countries.length} countries and ${cities.length} cities`);

  // Group cities by country name (not slug) to match the data structure
  const citiesByCountry: Record<string, Array<{ name: string; slug: string }>> = {};
  const seenCities = new Set<string>();
  
  cities.forEach((city) => {
    const countryName = city.country;
    const cityKey = `${countryName}-${city.slug}`;
    
    // Skip duplicates
    if (seenCities.has(cityKey)) {
      return;
    }
    seenCities.add(cityKey);
    
    if (!citiesByCountry[countryName]) {
      citiesByCountry[countryName] = [];
    }
    citiesByCountry[countryName].push({
      name: city.name,
      slug: city.slug,
    });
  });

  console.log(`Grouped cities by country:`, Object.keys(citiesByCountry).length);

  // Organize countries by continent and remove duplicates
  const seenCountries = new Set<string>();
  countries.forEach((country) => {
    const continent = country.continent || "Other";
    const countryKey = `${continent}-${country.name}`;
    
    // Skip duplicates
    if (seenCountries.has(countryKey)) {
      return;
    }
    seenCountries.add(countryKey);
    
    if (continents[continent]) {
      // Get cities for this country by matching country name
      const countryCities = citiesByCountry[country.name] || [];
      
      // Remove duplicate cities within a country
      const uniqueCities = Array.from(
        new Map(countryCities.map(city => [city.slug, city])).values()
      );
      
      continents[continent].push({
        country: country.name,
        countrySlug: country.slug,
        cities: uniqueCities,
      });
    }
  });

  console.log('Continents with data:', Object.entries(continents).filter(([_, countries]) => countries.length > 0).map(([continent, countries]) => `${continent}: ${countries.length}`));

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">StandsZone Sitemap</h1>
      
      <Tabs defaultValue="pages" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="pages">Website Pages</TabsTrigger>
          <TabsTrigger value="locations">Countries & Cities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pages">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Main Pages */}
            <Card>
              <CardHeader>
                <CardTitle>Main Pages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><Link href="/" className="text-blue-600 hover:underline">Home</Link></div>
                <div><Link href="/about" className="text-blue-600 hover:underline">About</Link></div>
                <div><Link href="/contact" className="text-blue-600 hover:underline">Contact</Link></div>
                <div><Link href="/services" className="text-blue-600 hover:underline">Services</Link></div>
                <div><Link href="/blog" className="text-blue-600 hover:underline">Blog</Link></div>
                <div><Link href="/quote" className="text-blue-600 hover:underline">Get a Quote</Link></div>
              </CardContent>
            </Card>

            {/* Builders */}
            <Card>
              <CardHeader>
                <CardTitle>Builders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><Link href="/builders" className="text-blue-600 hover:underline">All Builders</Link></div>
                <div><Link href="/builder/register" className="text-blue-600 hover:underline">Register as Builder</Link></div>
                <div><Link href="/builder/dashboard" className="text-blue-600 hover:underline">Builder Dashboard</Link></div>
                <div><Link href="/custom-booth" className="text-blue-600 hover:underline">Custom Booth</Link></div>
                <div><Link href="/booth-rental" className="text-blue-600 hover:underline">Booth Rental</Link></div>
              </CardContent>
            </Card>

            {/* Exhibitions */}
            <Card>
              <CardHeader>
                <CardTitle>Exhibitions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><Link href="/exhibitions" className="text-blue-600 hover:underline">All Exhibitions</Link></div>
                <div><Link href="/exhibition-stands" className="text-blue-600 hover:underline">Exhibition Stands</Link></div>
                <div><Link href="/trade-shows" className="text-blue-600 hover:underline">Trade Shows</Link></div>
              </CardContent>
            </Card>

            {/* Authentication */}
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><Link href="/auth/login" className="text-blue-600 hover:underline">Login</Link></div>
                <div><Link href="/auth/register" className="text-blue-600 hover:underline">Register</Link></div>
              </CardContent>
            </Card>

            {/* Legal */}
            <Card>
              <CardHeader>
                <CardTitle>Legal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><Link href="/legal" className="text-blue-600 hover:underline">Legal Information</Link></div>
              </CardContent>
            </Card>

            {/* Admin */}
            <Card>
              <CardHeader>
                <CardTitle>Admin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><Link href="/admin" className="text-blue-600 hover:underline">Admin Dashboard</Link></div>
                <div><Link href="/admin/builders" className="text-blue-600 hover:underline">Manage Builders</Link></div>
                <div><Link href="/admin/leads" className="text-blue-600 hover:underline">Manage Leads</Link></div>
                <div><Link href="/admin/content" className="text-blue-600 hover:underline">Content Management</Link></div>
                <div><Link href="/admin/settings" className="text-blue-600 hover:underline">Settings</Link></div>
              </CardContent>
            </Card>

            {/* Subscription */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><Link href="/subscription" className="text-blue-600 hover:underline">Subscription Plans</Link></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="locations">
          {/* Continent Tabs */}
          <Tabs defaultValue="Europe" className="mb-6">
            <TabsList className="flex flex-wrap mb-4 gap-2">
              {Object.keys(continents).filter(continent => 
                Array.isArray(continents[continent]) && continents[continent].length > 0
              ).map((continent) => (
                <TabsTrigger key={continent} value={continent} className="px-4 py-2">
                  {continent}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* Content for each continent */}
            {Object.entries(continents).filter(([_, countries]) => 
              Array.isArray(countries) && countries.length > 0
            ).map(([continent, continentCountries]) => (
              <TabsContent key={continent} value={continent}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {continentCountries.map(({ country, countrySlug, cities }) => {
                    if (!country || !countrySlug) return null;
                    
                    return (
                      <Card key={`${countrySlug}-${country}`}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <span>{country}</span>
                            <Link 
                              href={`/exhibition-stands/${countrySlug}`}
                              className="text-sm text-blue-600 hover:underline ml-auto"
                            >
                              View Country
                            </Link>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="max-h-60 overflow-y-auto">
                          {Array.isArray(cities) && cities.length > 0 ? (
                            <div className="space-y-1">
                              {cities.map((city) => {
                                if (!city || !city.name || !city.slug) return null;
                                
                                return (
                                  <div key={`${countrySlug}-${city.slug}`}>
                                    <Link 
                                      href={`/exhibition-stands/${countrySlug}/${city.slug}`} 
                                      className="text-blue-600 hover:underline"
                                    >
                                      {city.name}
                                    </Link>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No cities available</p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}