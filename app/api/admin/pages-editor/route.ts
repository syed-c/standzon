import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { storageAPI, PageContent } from '@/lib/data/storage';
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
  { title: 'Builders', path: '/builders', type: 'static' },
  { title: 'Exhibition Stands', path: '/exhibition-stands', type: 'static' },
  { title: 'Custom Booth', path: '/custom-booth', type: 'static' },
  { title: 'About', path: '/about', type: 'static' },
  { title: 'Quote', path: '/quote', type: 'static' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  if (action === 'list') {
    // Combine static pages with known country pages from storage (if any)
    const pages: PageItem[] = [...STATIC_PAGES];
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
    if (parts[0] === 'exhibition-stands') {
      pageId = parts.slice(1).join('-');
    } else if (parts.length === 0) {
      pageId = 'home';
    } else {
      pageId = parts.join('-');
    }
    // Prefer Supabase if configured; if configured, do not fall back silently
    try {
      const sb = getServerSupabase();
      if (sb) {
        const { data, error } = await sb
          .from('page_contents')
          .select('content')
          .eq('id', pageId)
          .single();
        return NextResponse.json(
          { success: !error, data: data?.content || null, error: error?.message },
          { headers: { 'Cache-Control': 'no-store, max-age=0', 'x-cms-source': 'supabase' } }
        );
      }
    } catch {}

    const fileMap = await readAllPageContentsFromFile();
    const content = fileMap[pageId] || storageAPI.getPageContent(pageId);
    return NextResponse.json(
      { success: true, data: content || null },
      { headers: { 'Cache-Control': 'no-store, max-age=0', 'x-cms-source': 'file' } }
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
    if (parts[0] === 'exhibition-stands') {
      pageId = parts.slice(1).join('-');
    } else if (parts.length === 0) {
      pageId = 'home';
    } else {
      pageId = parts.join('-');
    }
    if (!pageId) pageId = 'home';

    // Load existing from storage (if any) and merge minimal SEO/H1
    const existing = storageAPI.getPageContent(pageId);
    const updated: PageContent = existing ? { ...existing } : {
      id: pageId,
      type: 'country',
      location: { name: pageId, slug: pageId },
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
      (updated as any).sections = {
        ...(updated as any).sections,
        ...sections,
      };
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
        const { error } = await sb
          .from('page_contents')
          .upsert({ id: pageId, path, content: updated, updated_at: new Date().toISOString() });
        if (!error) savedToSupabase = true;
        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
      }
    } catch {}

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


