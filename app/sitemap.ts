import { MetadataRoute } from 'next';
import { db } from '@/lib/supabase/database';
import { getAllSlugs } from '@/lib/blog-data'; // For blog posts if needed, or query DB
import { GLOBAL_EXHIBITION_DATA } from '@/lib/data/globalCities'; // Import as reference or fallback
// Note: We should ideally fetch countries/cities from DB to filter empty ones.

const BASE_URL = 'https://standszone.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const routes: MetadataRoute.Sitemap = [];
    const BASE_URL = 'https://standszone.com';

    // 1. Static Routes
    const staticRoutes = [
        '',
        '/about',
        '/contact',
        '/services',
        '/blog',
        '/builders',
        '/exhibitions',
        '/trade-shows',
        '/quote',
    ];

    staticRoutes.forEach(route => {
        routes.push({
            url: `${BASE_URL}${route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        });
    });

    // 2. Fetch Data for Dynamic Routes
    const [shows, builders, contentPages] = await Promise.all([
        db.getTradeShows(),
        db.getBuilders(),
        db.from('page_contents').select('id')
    ]);

    // Create lookup sets for active content
    const activeLocations = new Set<string>();

    // Add locations from builders
    builders?.forEach((builder: any) => {
        if (builder.country) activeLocations.add(builder.country.toLowerCase());
        if (builder.city) activeLocations.add(builder.city.toLowerCase());
    });

    // Add locations from CMS content (ids are likely slugs)
    contentPages.data?.forEach((page: any) => {
        if (page.id) activeLocations.add(page.id.toLowerCase());
    });

    // 3. Blog Posts
    const blogSlugs = getAllSlugs();
    blogSlugs.forEach(slug => {
        routes.push({
            url: `${BASE_URL}/blog/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        });
    });

    // 4. Trade Shows (Filtered)
    shows?.forEach((show: any) => {
        if (show.slug && show.name && show.city) {
            routes.push({
                url: `${BASE_URL}/trade-shows/${show.slug}`,
                lastModified: new Date(show.updated_at || new Date()),
                changeFrequency: 'weekly',
                priority: 0.8,
            });
        }
    });

    // 5. Country Pages (Strict Filter)
    GLOBAL_EXHIBITION_DATA.countries.forEach((country: any) => {
        const countryName = country.name.toLowerCase();
        const countrySlug = country.slug.toLowerCase();

        // Check if country has builders (by name) or content (by slug)
        // Normalize checks to be safe
        const hasBuilders = activeLocations.has(countryName);
        const hasContent = activeLocations.has(countrySlug);

        if (hasBuilders || hasContent) {
            routes.push({
                url: `${BASE_URL}/exhibition-stands/${country.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            });
        }
    });

    // 6. City Pages (Strict Filter)
    GLOBAL_EXHIBITION_DATA.cities.forEach((city: any) => {
        const cityName = city.name.toLowerCase();
        // City slugs might need construction or exist in data
        // Assuming city.slug exists and is correct relative to country
        // URL format: /exhibition-stands/[country]/[city]

        // Find parent country slug
        const parentCountry = GLOBAL_EXHIBITION_DATA.countries.find(
            (c: any) => c.name === city.country
        );

        if (parentCountry) {
            // Check based on city Name (builders usually store City Name)
            // or check if specific city content exists (by slug? or key?)
            // We'll rely on activeLocations having the city name

            // Construct the ID/Key that might be in activeLocations
            // Builders have 'city' field (Name). CMS might have 'country-city-slug'. 
            // Simplest check: activeLocations.has(cityName) is a strong signal for builders.

            if (activeLocations.has(cityName)) {
                routes.push({
                    url: `${BASE_URL}/exhibition-stands/${parentCountry.slug}/${city.slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.7,
                });
            }
        }
    });

    return routes;
}
