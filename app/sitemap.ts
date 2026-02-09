import { MetadataRoute } from 'next';
import { db } from '@/lib/supabase/database';
import { getAllSlugs } from '@/lib/blog-data';
import { GLOBAL_EXHIBITION_DATA } from '@/lib/data/globalCities';

const BASE_URL = 'https://standszone.com';

/**
 * Optimized sitemap generator for faster builds
 * Minimal validation to prevent build timeouts
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const routes: MetadataRoute.Sitemap = [];
    
    // 1. Static Routes (always include)
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
            priority: route === '' ? 1.0 : 0.8,
        });
    });

    // 2. Blog Posts
    const blogSlugs = getAllSlugs();
    blogSlugs.forEach(slug => {
        routes.push({
            url: `${BASE_URL}/blog/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        });
    });

    // 3. Trade Shows (basic inclusion without extensive validation)
    try {
        const shows = await db.getTradeShows();
        shows?.forEach((show: any) => {
            if (show.slug) {
                routes.push({
                    url: `${BASE_URL}/trade-shows/${show.slug}`,
                    lastModified: new Date(show.updated_at || new Date()),
                    changeFrequency: 'weekly',
                    priority: 0.8,
                });
            }
        });
    } catch (error) {
        console.error('❌ Error fetching trade shows for sitemap:', error);
    }

    // 4. Country Pages (basic inclusion)
    GLOBAL_EXHIBITION_DATA.countries.forEach((country: any) => {
        routes.push({
            url: `${BASE_URL}/exhibition-stands/${country.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        });
    });

    // 5. City Pages (basic inclusion)
    GLOBAL_EXHIBITION_DATA.cities.forEach((city: any) => {
        const parentCountry = GLOBAL_EXHIBITION_DATA.countries.find(
            (c: any) => c.name === city.country
        );
        
        if (parentCountry) {
            routes.push({
                url: `${BASE_URL}/exhibition-stands/${parentCountry.slug}/${city.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        }
    });

    console.log(`✅ Sitemap generated with ${routes.length} URLs`);
    return routes;
}