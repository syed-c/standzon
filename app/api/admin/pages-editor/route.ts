import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { storageAPI, PageContent } from '@/lib/data/storage';
import { GLOBAL_EXHIBITION_DATA } from '@/lib/data/globalCities';
import fs from 'fs';
import path from 'path';
import { getServerSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getDataFilePath() {
  try {
    return path.join(process.cwd(), 'data', 'page-contents.json');
  } catch {
    return 'page-contents.json';
  }
}

async function readAllPageContentsFromFile(): Promise<Record<string, PageContent>> {
  try {
    const filePath = getDataFilePath();
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      return {};
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function writeAllPageContentsToFile(map: Record<string, PageContent>) {
  try {
    const filePath = getDataFilePath();
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(map, null, 2), 'utf-8');
  } catch {}
}

// Persist edited JSON to GitHub so changes survive serverless restarts
async function commitToGitHub(fileRelativePath: string, contentJson: any) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const branch = process.env.GITHUB_REPO_BRANCH || 'main';
  if (!token || !owner || !repo) return; // Silently skip if not configured

  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${fileRelativePath}`;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json',
  } as any;

  let sha: string | undefined;
  try {
    const getRes = await fetch(`${apiBase}?ref=${encodeURIComponent(branch)}`, { headers });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }
  } catch {}

  const message = `chore(cms): update ${fileRelativePath} via admin editor`;
  const contentBase64 = Buffer.from(
    typeof contentJson === 'string' ? contentJson : JSON.stringify(contentJson, null, 2)
  ).toString('base64');

  try {
    await fetch(apiBase, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message,
        content: contentBase64,
        branch,
        sha,
      }),
    });
  } catch {}
}

// Minimal site map; extend as needed
type PageItem = { title: string; path: string; type: 'static' | 'country' | 'city' };
const STATIC_PAGES: PageItem[] = [
  { title: 'Home', path: '/', type: 'static' },
  // Removed from editor: /builders, /exhibition-stands, /quote
  { title: 'Custom Booth', path: '/custom-booth', type: 'static' },
  { title: 'Booth Rental', path: '/booth-rental', type: 'static' },
  { title: '3D Rendering & Concept Development', path: '/3d-rendering-and-concept-development', type: 'static' },
  { title: 'Installation & Dismantle', path: '/trade-show-installation-and-dismantle', type: 'static' },
  { title: 'Project Management', path: '/trade-show-project-management', type: 'static' },
  { title: 'Graphics & Printing', path: '/trade-show-graphics-printing', type: 'static' },
  { title: 'About', path: '/about', type: 'static' },
  // Country pages
  { title: 'China Exhibition Stands', path: '/exhibition-stands/china', type: 'country' },
  { title: 'Germany Exhibition Stands', path: '/exhibition-stands/germany', type: 'country' },
  { title: 'United States Exhibition Stands', path: '/exhibition-stands/united-states', type: 'country' },
  { title: 'United Kingdom Exhibition Stands', path: '/exhibition-stands/united-kingdom', type: 'country' },
  { title: 'India Exhibition Stands', path: '/exhibition-stands/india', type: 'country' },
  { title: 'Spain Exhibition Stands', path: '/exhibition-stands/spain', type: 'country' },
  { title: 'Italy Exhibition Stands', path: '/exhibition-stands/italy', type: 'country' },
  { title: 'France Exhibition Stands', path: '/exhibition-stands/france', type: 'country' },
  { title: 'Netherlands Exhibition Stands', path: '/exhibition-stands/netherlands', type: 'country' },
  { title: 'Switzerland Exhibition Stands', path: '/exhibition-stands/switzerland', type: 'country' },
  { title: 'Belgium Exhibition Stands', path: '/exhibition-stands/belgium', type: 'country' },
  { title: 'Australia Exhibition Stands', path: '/exhibition-stands/australia', type: 'country' },
  { title: 'Canada Exhibition Stands', path: '/exhibition-stands/canada', type: 'country' },
  { title: 'South Africa Exhibition Stands', path: '/exhibition-stands/south-africa', type: 'country' },
  { title: 'Singapore Exhibition Stands', path: '/exhibition-stands/singapore', type: 'country' },
  { title: 'Thailand Exhibition Stands', path: '/exhibition-stands/thailand', type: 'country' },
  { title: 'Turkey Exhibition Stands', path: '/exhibition-stands/turkey', type: 'country' },
  { title: 'United Arab Emirates Exhibition Stands', path: '/exhibition-stands/united-arab-emirates', type: 'country' },
  { title: 'Saudi Arabia Exhibition Stands', path: '/exhibition-stands/saudi-arabia', type: 'country' },
  { title: 'Qatar Exhibition Stands', path: '/exhibition-stands/qatar', type: 'country' },
  { title: 'Kuwait Exhibition Stands', path: '/exhibition-stands/kuwait', type: 'country' },
  { title: 'Oman Exhibition Stands', path: '/exhibition-stands/oman', type: 'country' },
  { title: 'Bahrain Exhibition Stands', path: '/exhibition-stands/bahrain', type: 'country' },
  { title: 'Egypt Exhibition Stands', path: '/exhibition-stands/egypt', type: 'country' },
  { title: 'Morocco Exhibition Stands', path: '/exhibition-stands/morocco', type: 'country' },
  { title: 'Iran Exhibition Stands', path: '/exhibition-stands/iran', type: 'country' },
  { title: 'Russia Exhibition Stands', path: '/exhibition-stands/russia', type: 'country' },
  { title: 'Indonesia Exhibition Stands', path: '/exhibition-stands/indonesia', type: 'country' },
  { title: 'Malaysia Exhibition Stands', path: '/exhibition-stands/malaysia', type: 'country' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  if (action === 'list') {
    // Combine static pages with known country pages from storage (if any)
    const pages: PageItem[] = [...STATIC_PAGES];
    // Include all country pages from global dataset
    try {
      GLOBAL_EXHIBITION_DATA.countries.forEach((c) => {
        pages.push({ title: `${c.name} Exhibition Stands`, path: `/exhibition-stands/${c.slug}`, type: 'country' });
      });
      // Include all city pages from global dataset
      GLOBAL_EXHIBITION_DATA.cities.forEach((city) => {
        const country = GLOBAL_EXHIBITION_DATA.countries.find((c) => c.name === city.country);
        if (country) {
          pages.push({
            title: `Exhibition Stands in ${city.name}, ${country.name}`,
            path: `/exhibition-stands/${country.slug}/${city.slug}`,
            type: 'city'
          });
        }
      });
    } catch {}
    try {
      const all = storageAPI.getAllPageContents();
      all.forEach((pc) => {
        const path = pc.type === 'city'
          ? `/exhibition-stands/${(pc.location.country || '').toLowerCase()}/${pc.location.slug}`
          : `/exhibition-stands/${pc.location.slug}`;
        pages.push({
          title: pc.hero.title || pc.seo.metaTitle || pc.location.name,
          path,
          type: pc.type,
        });
      });
    } catch {}
    // De-duplicate by path
    const seen = new Set<string>();
    const unique = pages.filter(p => (seen.has(p.path) ? false : (seen.add(p.path), true)));
    return NextResponse.json(
      { success: true, data: unique },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
  if (action === 'get-content') {
    const path = searchParams.get('path') || '';
    if (!path) return NextResponse.json({ success: false, error: 'Missing path' }, { status: 400 });
    
    let pageId = '';
    const parts = path.split('/').filter(Boolean);
    
    // Handle dynamic country/city pages
    if (parts[0] === 'exhibition-stands') {
      if (parts.length >= 3) {
        // City page: /exhibition-stands/{country}/{city} -> pageId = country-city
        pageId = `${parts[1]}-${parts[2]}`;
        console.log('🏙️ API Debug - City page detected:', { path, pageId, parts });
      } else if (parts.length >= 2) {
        // Country page: /exhibition-stands/{country} -> pageId = country
        pageId = parts[1];
        console.log('🌍 API Debug - Country page detected:', { path, pageId, parts });
      } else {
        pageId = 'exhibition-stands';
      }
    } else if (parts.length === 0) {
      pageId = 'home';
    } else {
      pageId = parts.join('-');
    }
    
    console.log('🔍 API Debug - Final pageId:', pageId, 'for path:', path);
    
    // Prefer Supabase if configured
    try {
      const sb = getServerSupabase();
      if (sb) {
        console.log('🔍 API Debug - Fetching from Supabase for pageId:', pageId);
        const { data, error } = await sb
          .from('page_contents')
          .select('content')
          .eq('id', pageId)
          .single();
        
        if (error) {
          console.log('❌ Supabase error:', error);
          return NextResponse.json(
            { success: false, data: null, error: error.message },
            { headers: { 'Cache-Control': 'no-store, max-age=0', 'x-cms-source': 'supabase', 'x-sb-present': 'true' } }
          );
        }
        
        console.log('✅ Supabase data retrieved for pageId:', pageId);
        console.log('📊 Content structure:', Object.keys(data?.content || {}));
        console.log('🏳️ Sections:', Object.keys(data?.content?.sections || {}));
        console.log('🏳️ Country pages in retrieved data:', data?.content?.sections?.countryPages);
        
        // Special debug for custom-booth
        if (pageId === 'custom-booth') {
          console.log('🎨 Custom-booth GET debug - pageId:', pageId);
          console.log('🎨 Custom-booth GET debug - sections:', data?.content?.sections);
          console.log('🎨 Custom-booth GET debug - hero:', data?.content?.sections?.hero);
          console.log('🎨 Custom-booth GET debug - whyChooseCustom:', data?.content?.sections?.whyChooseCustom);
          console.log('🎨 Custom-booth GET debug - customDesignServices:', data?.content?.sections?.customDesignServices);
        }
        
        // For country or city pages, ensure we return the correct structure
        if (parts[0] === 'exhibition-stands') {
          if (parts.length >= 3) {
            // For city pages, return the FULL document so CMS has SEO/content and the editor can pick cityPages[key]
            return NextResponse.json(
              { success: true, data: data?.content || null, error: null },
              { headers: { 'Cache-Control': 'no-store, max-age=0', 'x-cms-source': 'supabase', 'x-sb-present': 'true' } }
            );
          } else if (parts.length >= 2) {
            const countrySlug = parts[1];
            const countryData = data?.content?.sections?.countryPages?.[countrySlug];
            console.log('🌍 Country data for', countrySlug, ':', countryData);
            if (countryData) {
              return NextResponse.json(
                { 
                  success: true, 
                  data: { 
                    ...data.content,
                    sections: {
                      ...data.content.sections,
                      countryPages: {
                        [countrySlug]: countryData
                      }
                    }
                  }, 
                  error: null 
                },
                { headers: { 'Cache-Control': 'no-store, max-age=0', 'x-cms-source': 'supabase', 'x-sb-present': 'true' } }
              );
            }
          }
        }
        
        return NextResponse.json(
          { success: true, data: data?.content || null, error: null },
          { headers: { 'Cache-Control': 'no-store, max-age=0', 'x-cms-source': 'supabase', 'x-sb-present': 'true' } }
        );
      }
    } catch (e) {
      console.log('❌ Supabase fetch error:', e);
    }

    const fileMap = await readAllPageContentsFromFile();
    const content = fileMap[pageId] || storageAPI.getPageContent(pageId);
    return NextResponse.json(
      { success: true, data: content || null },
      { headers: { 'Cache-Control': 'no-store, max-age=0', 'x-cms-source': 'file', 'x-sb-present': String(!!getServerSupabase()) } }
    );
  }
  if (action === 'save-content') {
    const pathParam = searchParams.get('path') || '';
    if (!pathParam) return NextResponse.json({ success: false, error: 'Missing path' }, { status: 400 });
    // For GET save-content usage (not ideal), just return latest saved content
    let pageId = '';
    const parts = pathParam.split('/').filter(Boolean);
    if (parts[0] === 'exhibition-stands') pageId = parts.slice(1).join('-');
    else if (parts.length === 0) pageId = 'home';
    else pageId = parts.join('-');
    const fileMap = await readAllPageContentsFromFile();
    const content = fileMap[pageId] || storageAPI.getPageContent(pageId);
    return NextResponse.json(
      { success: true, data: content || null },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
  return NextResponse.json({ success: false, error: 'Unsupported action' }, { status: 400 });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, path, seo, h1, contentHtml, structured, sections, reviews, buttons } = body || {};
    if (action !== 'update' || !path) {
      return NextResponse.json({ success: false, error: 'Missing action or path' }, { status: 400 });
    }

    // Infer pageId from path
    // /exhibition-stands/{country}[/{city}] or static
    let pageId = '';
    const parts = path.split('/').filter(Boolean);
    const isLocation = parts[0] === 'exhibition-stands';
    const isCityPage = isLocation && parts.length >= 3;
    
    if (isLocation) {
      if (isCityPage) {
        // City page id: country-city
        pageId = `${parts[1]}-${parts[2]}`;
        console.log('🏙️ PUT Debug - City page detected:', { path, pageId, parts });
      } else if (parts.length >= 2) {
        // Country page id: country
        pageId = parts[1];
        console.log('🌍 PUT Debug - Country page detected:', { path, pageId, parts });
      } else {
        pageId = 'exhibition-stands';
      }
    } else if (parts.length === 0) {
      pageId = 'home';
    } else {
      pageId = parts.join('-');
    }
    if (!pageId) pageId = 'home';

    // Debug: Log pageId generation
    console.log('🔍 API Debug - Path:', path, 'PageId:', pageId, 'Parts:', parts);
    
    // Special debug for custom-booth
    if (path === '/custom-booth') {
      console.log('🎨 Custom-booth debug - Path:', path, 'PageId:', pageId);
      console.log('🎨 Custom-booth debug - Sections received:', JSON.stringify(sections, null, 2));
    }

    // Load existing from storage (if any) and merge minimal SEO/H1
    const existing = storageAPI.getPageContent(pageId);
    const updated: PageContent = existing ? { ...existing } : {
      id: pageId,
      type: isCityPage ? 'city' : 'country',
      location: isCityPage ? { name: parts[2], country: parts[1], slug: pageId } : { name: parts[1] || pageId, slug: pageId },
      seo: { metaTitle: '', metaDescription: '', keywords: [], canonicalUrl: path },
      hero: { title: '', subtitle: '', description: '', ctaText: 'Get Free Quote' },
      content: { introduction: '', whyChooseSection: '', industryOverview: '', venueInformation: '', builderAdvantages: '', conclusion: '' },
      design: { primaryColor: '#2563eb', accentColor: '#f97316', layout: 'modern', showStats: true, showMap: false },
      lastModified: new Date().toISOString(),
    };

    if (seo) {
      updated.seo.metaTitle = seo.title ?? updated.seo.metaTitle;
      updated.seo.metaDescription = seo.description ?? updated.seo.metaDescription;
      if (Array.isArray(seo.keywords)) updated.seo.keywords = seo.keywords;
    }
    if (typeof h1 === 'string' && h1.length > 0) {
      updated.hero.title = h1;
    }
    if (typeof contentHtml === 'string' && contentHtml.trim().length > 0) {
      // Store into introduction/conclusion to surface on pages; keep raw in extra
      updated.content.introduction = contentHtml;
      (updated.content as any).extra = {
        ...(updated.content as any).extra,
        rawHtml: contentHtml,
        structured: structured ?? (updated.content as any).extra?.structured,
      };
    }

    // Merge section-aware updates (do not overwrite unrelated fields)
    if (sections && typeof sections === 'object') {
      console.log('🔍 API Debug - Sections received:', JSON.stringify(sections, null, 2));
      const currentSections = (updated as any).sections || {};
      if (isCityPage) {
        // Accept either flat sections or sections.cityPages[pageId]
        const cityKey = pageId; // country-city
        const prevCityPages = currentSections.cityPages || {};
        const incomingCitySections = (sections as any).cityPages && (sections as any).cityPages[cityKey]
          ? (sections as any).cityPages[cityKey]
          : sections;
        (updated as any).sections = {
          ...currentSections,
          cityPages: {
            ...prevCityPages,
            [cityKey]: {
              ...(prevCityPages[cityKey] || {}),
              ...incomingCitySections,
            },
          },
        };
      } else if (isLocation) {
        (updated as any).sections = {
          ...currentSections,
          ...sections,
        };
      } else {
        (updated as any).sections = { ...currentSections, ...sections };
      }
      console.log('🔍 API Debug - Updated sections:', JSON.stringify((updated as any).sections, null, 2));
    }

    // Accept top-level reviews/buttons for Home editor schema
    if (Array.isArray(reviews)) {
      // Prefer storing under sections.reviews but also keep a top-level mirror for compatibility
      (updated as any).sections = {
        ...(updated as any).sections,
        reviews: reviews,
      };
      (updated as any).reviews = reviews;
    }
    if (Array.isArray(buttons)) {
      // Store raw array for flexible grouping on client
      (updated as any).buttons = buttons;
      // Additionally map common groups to existing keys if present
      const heroBtns = buttons.filter((b:any)=> (b.section||'').toLowerCase() === 'hero').map((b:any)=>({ text:b.text, href:b.link||b.href }));
      if (heroBtns.length > 0) {
        (updated as any).sections = { ...(updated as any).sections, heroButtons: heroBtns };
      }
      const finalBtns = buttons.filter((b:any)=> (b.section||'').toLowerCase() === 'finalcta').map((b:any)=>({ text:b.text, href:b.link||b.href }));
      if (finalBtns.length > 0) {
        const prevFinal = (updated as any).sections?.finalCta || {};
        (updated as any).sections = { ...(updated as any).sections, finalCta: { ...prevFinal, buttons: finalBtns } };
      }
    }

    // If Supabase configured, upsert there (durable). Else fallback to file+GitHub path
    let savedToSupabase = false;
    try {
      const sb = getServerSupabase();
      if (sb) {
        console.log('💾 Saving to Supabase - pageId:', pageId);
        console.log('💾 Saving to Supabase - content structure:', JSON.stringify(updated, null, 2));
        console.log('💾 Saving to Supabase - sections structure:', JSON.stringify((updated as any).sections, null, 2));
        
        const { error } = await sb
          .from('page_contents')
          .upsert({ id: pageId, path, content: updated, updated_at: new Date().toISOString() });
        
        if (!error) {
          savedToSupabase = true;
          console.log('✅ Successfully saved to Supabase');
        } else {
          console.log('❌ Supabase save error:', error);
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
      }
    } catch (e) {
      console.log('❌ Supabase save exception:', e);
    }

    if (!savedToSupabase) {
      storageAPI.savePageContent(pageId, updated);
      const current = await readAllPageContentsFromFile();
      current[pageId] = updated;
      await writeAllPageContentsToFile(current);
      try { await commitToGitHub('data/page-contents.json', current); } catch {}
    }

    try { revalidatePath(path); } catch {}
    try {
      const evt = new CustomEvent('global-pages:updated', { detail: { pageId } });
      // no-op on server; clients listen on window
    } catch {}

    return NextResponse.json(
      { success: true, data: updated },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Failed to update page' }, { status: 500 });
  }
}


