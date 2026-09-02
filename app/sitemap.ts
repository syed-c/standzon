import { MetadataRoute } from 'next';
import { db } from '@/lib/supabase/database';
import { getAllSlugs } from '@/lib/blog-data';
import { GLOBAL_EXHIBITION_DATA } from '@/lib/data/globalCities';
import { getServerSupabase } from '@/lib/supabase';
import {
  getCountryBySlug as getGlobalCountryBySlug,
  getCityBySlug as getGlobalCityBySlug,
} from '@/lib/data/globalExhibitionDatabase';
import {
  getCountryBySlug as getComprehensiveCountryBySlug,
  getCityBySlug as getComprehensiveCityBySlug,
} from '@/lib/data/comprehensiveLocationData';

const BASE_URL = 'https://standszone.com';

// Generate at request time so the CMS / trade-show lookups run with full runtime
// credentials (build-time env may not have Supabase configured, which would bake
// an near-empty sitemap). Crawlers hit this rarely, so the couple of queries are
// cheap.
export const dynamic = 'force-dynamic';

/**
 * Sitemap generator.
 *
 * Location URLs are driven by the CMS (`page_contents` rows) and cross-checked
 * against the same slug validators the pages use, so the sitemap only advertises
 * URLs that actually return 200 — no more soft-404s from listing every slug in a
 * static file. `lastModified` uses the real `updated_at` so crawlers get an
 * honest change signal instead of "everything changed on every deploy".
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];

  // 1. Static routes
  const staticRoutes = [
    '', '/about', '/contact', '/services', '/blog', '/builders',
    '/exhibitions', '/trade-shows', '/quote', '/exhibition-stands',
    '/custom-booth', '/booth-rental',
    '/trade-show-graphics-printing', '/trade-show-installation-and-dismantle',
    '/trade-show-project-management', '/3d-rendering-and-concept-development',
  ];
  staticRoutes.forEach((route) => {
    routes.push({
      url: `${BASE_URL}${route}`,
      changeFrequency: 'weekly',
      priority: route === '' ? 1.0 : 0.8,
    });
  });

  // 2. Blog posts
  getAllSlugs().forEach((slug) => {
    routes.push({ url: `${BASE_URL}/blog/${slug}`, changeFrequency: 'monthly', priority: 0.6 });
  });

  // 3. Trade shows
  try {
    const shows = await db.getTradeShows();
    (shows || []).forEach((show: any) => {
      if (show?.slug) {
        routes.push({
          url: `${BASE_URL}/trade-shows/${show.slug}`,
          lastModified: new Date(show.updated_at || show.created_at || Date.now()),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    });
  } catch (error) {
    console.error('❌ sitemap: trade shows fetch failed:', error);
  }

  // 4. Location pages — only those backed by a CMS row AND a slug that passes the
  //    same validators the page components use (so no 404 ever lands in here).
  const knownCountrySlugs = new Set<string>(
    GLOBAL_EXHIBITION_DATA.countries.map((c: any) => c.slug),
  );

  const isValidCountry = (slug: string) =>
    knownCountrySlugs.has(slug) ||
    !!getGlobalCountryBySlug(slug) ||
    !!getComprehensiveCountryBySlug(slug);

  const isValidCity = (countrySlug: string, citySlug: string) =>
    !!getGlobalCityBySlug(countrySlug, citySlug) ||
    !!getComprehensiveCityBySlug(countrySlug, citySlug);

  // Split a `page_contents.id` (e.g. "united-states-new-york") into
  // [countrySlug, citySlug?] by trying every hyphen boundary and keeping the
  // first split where BOTH halves validate.
  const splitLocationId = (id: string): [string, string | null] | null => {
    if (isValidCountry(id)) return [id, null];
    const parts = id.split('-');
    for (let i = parts.length - 1; i >= 1; i--) {
      const cs = parts.slice(0, i).join('-');
      const ci = parts.slice(i).join('-');
      if (isValidCountry(cs) && isValidCity(cs, ci)) return [cs, ci];
    }
    return null;
  };

  try {
    const sb = getServerSupabase();
    if (sb) {
      const { data: pages, error } = await sb
        .from('page_contents')
        .select('id, updated_at');
      if (error) throw error;

      for (const row of pages || []) {
        const parsed = splitLocationId(String(row.id));
        if (!parsed) continue; // static page (about, home, custom-booth, …) — handled elsewhere
        const [countrySlug, citySlug] = parsed;
        const lastModified = new Date(row.updated_at || Date.now());

        if (!citySlug) {
          routes.push({
            url: `${BASE_URL}/exhibition-stands/${countrySlug}`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        } else if (isValidCity(countrySlug, citySlug)) {
          routes.push({
            url: `${BASE_URL}/exhibition-stands/${countrySlug}/${citySlug}`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.6,
          });
        }
      }
    }
  } catch (error) {
    console.error('❌ sitemap: page_contents fetch failed:', error);
  }

  console.log(`✅ Sitemap generated with ${routes.length} URLs`);
  return routes;
}
