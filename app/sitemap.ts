import { MetadataRoute } from 'next';
import { db } from '@/lib/supabase/database';
import { getAllSlugs } from '@/lib/blog-data';
import { GLOBAL_EXHIBITION_DATA } from '@/lib/data/globalCities';
import { getFilteredBuilders } from '@/lib/supabase/builders';

const BASE_URL = 'https://standszone.com';

/**
 * Enhanced sitemap generator with strict content validation
 * Only includes pages that have real, meaningful content
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

    // 2. Fetch all data for validation
    console.log('🔍 Generating sitemap with content validation...');
    
    try {
        const [shows, contentPages] = await Promise.all([
            db.getTradeShows(),
            db.from('page_contents').select('id, content')
        ]);

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

        // 4. Trade Shows (Strict Filter - only include shows with complete data)
        shows?.forEach((show: any) => {
            // Only include trade shows with essential data
            if (show.slug && show.title && show.location_city && show.start_date) {
                routes.push({
                    url: `${BASE_URL}/trade-shows/${show.slug}`,
                    lastModified: new Date(show.updated_at || new Date()),
                    changeFrequency: 'weekly',
                    priority: 0.8,
                });
            } else {
                console.log(`⚠️ Skipping incomplete trade show: ${show.slug || 'unknown'}`);
            }
        });

        // 5. Country Pages (Strict Content Validation)
        for (const country of GLOBAL_EXHIBITION_DATA.countries) {
            try {
                // Check if country has real builders
                const builderResult = await getFilteredBuilders({
                    country: country.name,
                    page: 1,
                    itemsPerPage: 1
                });
                
                const hasBuilders = builderResult.total > 0;
                
                // Check if country has CMS content
                const hasCmsContent = contentPages.data?.some(
                    (page: any) => page.id === country.slug && page.content
                ) || false;
                
                // Only include countries with either builders or meaningful CMS content
                if (hasBuilders || hasCmsContent) {
                    routes.push({
                        url: `${BASE_URL}/exhibition-stands/${country.slug}`,
                        lastModified: new Date(),
                        changeFrequency: 'weekly',
                        priority: 0.8,
                    });
                    console.log(`✅ Including country page: ${country.name} (${country.slug}) - Builders: ${builderResult.total}, CMS: ${hasCmsContent}`);
                } else {
                    console.log(`⚠️ Skipping country page: ${country.name} (${country.slug}) - No builders or content`);
                }
            } catch (error) {
                console.error(`❌ Error validating country ${country.name}:`, error);
            }
        }

        // 6. City Pages (Strict Content Validation)
        for (const city of GLOBAL_EXHIBITION_DATA.cities) {
            try {
                // Find parent country
                const parentCountry = GLOBAL_EXHIBITION_DATA.countries.find(
                    (c: any) => c.name === city.country
                );
                
                if (!parentCountry) {
                    console.log(`⚠️ Skipping city ${city.name} - parent country not found`);
                    continue;
                }
                
                // Check if city has real builders
                const builderResult = await getFilteredBuilders({
                    country: city.country,
                    city: city.name,
                    page: 1,
                    itemsPerPage: 1
                });
                
                const hasBuilders = builderResult.total > 0;
                
                // Check if city has CMS content
                const cityPageId = `${parentCountry.slug}-${city.slug}`;
                const hasCmsContent = contentPages.data?.some(
                    (page: any) => page.id === cityPageId && page.content
                ) || false;
                
                // Only include cities with either builders or meaningful CMS content
                if (hasBuilders || hasCmsContent) {
                    routes.push({
                        url: `${BASE_URL}/exhibition-stands/${parentCountry.slug}/${city.slug}`,
                        lastModified: new Date(),
                        changeFrequency: 'weekly',
                        priority: 0.7,
                    });
                    console.log(`✅ Including city page: ${city.name}, ${city.country} - Builders: ${builderResult.total}, CMS: ${hasCmsContent}`);
                } else {
                    console.log(`⚠️ Skipping city page: ${city.name}, ${city.country} - No builders or content`);
                }
            } catch (error) {
                console.error(`❌ Error validating city ${city.name}:`, error);
            }
        }

    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
        // Fallback to basic static routes only
        return routes;
    }

    console.log(`✅ Sitemap generated with ${routes.length} valid URLs`);
    return routes;
}