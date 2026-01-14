import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase/database';

// Define the base URL for the site
const BASE_URL = 'https://standszone.com';

/**
 * Generate XML sitemap for trade shows
 * @param tradeShows List of trade shows from database
 */
function generateTradeShowsSitemapXml(tradeShows: any[]): string {
    // Start with XML declaration and opening urlset tag
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add each trade show to the sitemap
    tradeShows.forEach(show => {
        // Determine last modified date, fallback to current if not present
        const lastMod = show.updated_at || show.created_at || new Date().toISOString();
        const formattedLastMod = new Date(lastMod).toISOString().split('T')[0];

        xml += `  <url>
    <loc>${BASE_URL}/trade-shows/${show.slug}</loc>
    <lastmod>${formattedLastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    // Close urlset tag
    xml += '</urlset>';

    return xml;
}

// GET handler for the trade shows sitemap
export async function GET() {
    try {
        console.log('Generating dynamic trade shows sitemap...');

        // Fetch all trade shows from the database
        const tradeShows = await db.getTradeShows();

        if (!tradeShows || tradeShows.length === 0) {
            console.warn('No trade shows found for sitemap');
        } else {
            console.log(`Adding ${tradeShows.length} trade shows to sitemap`);
        }

        const sitemapXml = generateTradeShowsSitemapXml(tradeShows || []);

        return new NextResponse(sitemapXml, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
            },
        });
    } catch (error) {
        console.error('Error generating trade shows sitemap:', error);

        // Return a minimal valid sitemap in case of error
        const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

        return new NextResponse(fallbackXml, {
            headers: {
                'Content-Type': 'application/xml',
            },
            status: 500,
        });
    }
}
