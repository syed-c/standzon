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
  // City pages for India
  { title: 'Exhibition Stands in Bangalore, India', path: '/exhibition-stands/india/bangalore', type: 'city' },
  { title: 'Exhibition Stands in Mumbai, India', path: '/exhibition-stands/india/mumbai', type: 'city' },
  { title: 'Exhibition Stands in New Delhi, India', path: '/exhibition-stands/india/new-delhi', type: 'city' },
  { title: 'Exhibition Stands in Hyderabad, India', path: '/exhibition-stands/india/hyderabad', type: 'city' },
  { title: 'Exhibition Stands in Kolkata, India', path: '/exhibition-stands/india/kolkata', type: 'city' },
  { title: 'Exhibition Stands in Ahmedabad, India', path: '/exhibition-stands/india/ahmedabad', type: 'city' },
  { title: 'Spain Exhibition Stands', path: '/exhibition-stands/spain', type: 'country' },
  // City pages for Spain
  { title: 'Exhibition Stands in Madrid, Spain', path: '/exhibition-stands/spain/madrid', type: 'city' },
  { title: 'Exhibition Stands in Barcelona, Spain', path: '/exhibition-stands/spain/barcelona', type: 'city' },
  { title: 'Exhibition Stands in Valencia, Spain', path: '/exhibition-stands/spain/valencia', type: 'city' },
  { title: 'Exhibition Stands in Seville, Spain', path: '/exhibition-stands/spain/seville', type: 'city' },
  { title: 'Exhibition Stands in Bilbao, Spain', path: '/exhibition-stands/spain/bilbao', type: 'city' },
  { title: 'Exhibition Stands in Malaga, Spain', path: '/exhibition-stands/spain/malaga', type: 'city' },
  { title: 'Exhibition Stands in Alicante, Spain', path: '/exhibition-stands/spain/alicante', type: 'city' },
  { title: 'Exhibition Stands in Zaragoza, Spain', path: '/exhibition-stands/spain/zaragoza', type: 'city' },
  { title: 'Exhibition Stands in Valladolid, Spain', path: '/exhibition-stands/spain/valladolid', type: 'city' },
  { title: 'Exhibition Stands in Vigo, Spain', path: '/exhibition-stands/spain/vigo', type: 'city' },
  { title: 'Exhibition Stands in Coruna, Spain', path: '/exhibition-stands/spain/coruna', type: 'city' },
  { title: 'Exhibition Stands in Jaen, Spain', path: '/exhibition-stands/spain/jaen', type: 'city' },
  { title: 'Exhibition Stands in Palma de Mallorca, Spain', path: '/exhibition-stands/spain/palma-de-mallorca', type: 'city' },
  { title: 'Italy Exhibition Stands', path: '/exhibition-stands/italy', type: 'country' },
  { title: 'France Exhibition Stands', path: '/exhibition-stands/france', type: 'country' },
  // City pages for France
  { title: 'Exhibition Stands in Paris, France', path: '/exhibition-stands/france/paris', type: 'city' },
  { title: 'Exhibition Stands in Lyon, France', path: '/exhibition-stands/france/lyon', type: 'city' },
  { title: 'Exhibition Stands in Cannes, France', path: '/exhibition-stands/france/cannes', type: 'city' },
  { title: 'Exhibition Stands in Strasbourg, France', path: '/exhibition-stands/france/strasbourg', type: 'city' },
  { title: 'Netherlands Exhibition Stands', path: '/exhibition-stands/netherlands', type: 'country' },
  // City pages for Netherlands
  { title: 'Exhibition Stands in Amsterdam, Netherlands', path: '/exhibition-stands/netherlands/amsterdam', type: 'city' },
  { title: 'Exhibition Stands in Rotterdam, Netherlands', path: '/exhibition-stands/netherlands/rotterdam', type: 'city' },
  { title: 'Exhibition Stands in Maastricht, Netherlands', path: '/exhibition-stands/netherlands/maastricht', type: 'city' },
  { title: 'Exhibition Stands in Vijfhuizen, Netherlands', path: '/exhibition-stands/netherlands/vijfhuizen', type: 'city' },
  { title: 'Switzerland Exhibition Stands', path: '/exhibition-stands/switzerland', type: 'country' },
  // City pages for Switzerland
  { title: 'Exhibition Stands in Zurich, Switzerland', path: '/exhibition-stands/switzerland/zurich', type: 'city' },
  { title: 'Exhibition Stands in Geneva, Switzerland', path: '/exhibition-stands/switzerland/geneva', type: 'city' },
  { title: 'Exhibition Stands in Basel, Switzerland', path: '/exhibition-stands/switzerland/basel', type: 'city' },
  { title: 'Exhibition Stands in Bern, Switzerland', path: '/exhibition-stands/switzerland/bern', type: 'city' },
  { title: 'Exhibition Stands in Lugano, Switzerland', path: '/exhibition-stands/switzerland/lugano', type: 'city' },
  { title: 'Exhibition Stands in Sirnach, Switzerland', path: '/exhibition-stands/switzerland/sirnach', type: 'city' },
  { title: 'Belgium Exhibition Stands', path: '/exhibition-stands/belgium', type: 'country' },
  // City pages for Belgium
  { title: 'Exhibition Stands in Brussels, Belgium', path: '/exhibition-stands/belgium/brussels', type: 'city' },
  { title: 'Exhibition Stands in Kortrijk, Belgium', path: '/exhibition-stands/belgium/kortrijk', type: 'city' },
  { title: 'Austria Exhibition Stands', path: '/exhibition-stands/austria', type: 'country' },
  // City pages for Austria
  { title: 'Exhibition Stands in Vienna, Austria', path: '/exhibition-stands/austria/vienna', type: 'city' },
  { title: 'Australia Exhibition Stands', path: '/exhibition-stands/australia', type: 'country' },
  // City pages for Australia
  { title: 'Exhibition Stands in Sydney, Australia', path: '/exhibition-stands/australia/sydney', type: 'city' },
  { title: 'Exhibition Stands in Melbourne, Australia', path: '/exhibition-stands/australia/melbourne', type: 'city' },
  { title: 'Exhibition Stands in Brisbane, Australia', path: '/exhibition-stands/australia/brisbane', type: 'city' },
  { title: 'Canada Exhibition Stands', path: '/exhibition-stands/canada', type: 'country' },
  { title: 'South Africa Exhibition Stands', path: '/exhibition-stands/south-africa', type: 'country' },
  { title: 'Singapore Exhibition Stands', path: '/exhibition-stands/singapore', type: 'country' },
  { title: 'Thailand Exhibition Stands', path: '/exhibition-stands/thailand', type: 'country' },
  // City pages for Thailand
  { title: 'Exhibition Stands in Bangkok, Thailand', path: '/exhibition-stands/thailand/bangkok', type: 'city' },
  { title: 'Exhibition Stands in Khon Kaen, Thailand', path: '/exhibition-stands/thailand/khon-kaen', type: 'city' },
  { title: 'Philippines Exhibition Stands', path: '/exhibition-stands/philippines', type: 'country' },
  // City pages for Philippines
  { title: 'Exhibition Stands in Manila, Philippines', path: '/exhibition-stands/philippines/manila', type: 'city' },
  { title: 'Turkey Exhibition Stands', path: '/exhibition-stands/turkey', type: 'country' },
  { title: 'United Arab Emirates Exhibition Stands', path: '/exhibition-stands/united-arab-emirates', type: 'country' },
  { title: 'Saudi Arabia Exhibition Stands', path: '/exhibition-stands/saudi-arabia', type: 'country' },
  { title: 'Qatar Exhibition Stands', path: '/exhibition-stands/qatar', type: 'country' },
  { title: 'Kuwait Exhibition Stands', path: '/exhibition-stands/kuwait', type: 'country' },
  { title: 'Oman Exhibition Stands', path: '/exhibition-stands/oman', type: 'country' },
  { title: 'Exhibition Stands in Sohar, Oman', path: '/exhibition-stands/oman/sohar', type: 'city' },
  { title: 'Bahrain Exhibition Stands', path: '/exhibition-stands/bahrain', type: 'country' },
  { title: 'Egypt Exhibition Stands', path: '/exhibition-stands/egypt', type: 'country' },
  { title: 'Morocco Exhibition Stands', path: '/exhibition-stands/morocco', type: 'country' },
  { title: 'Iran Exhibition Stands', path: '/exhibition-stands/iran', type: 'country' },
  { title: 'Russia Exhibition Stands', path: '/exhibition-stands/russia', type: 'country' },
  { title: 'Indonesia Exhibition Stands', path: '/exhibition-stands/indonesia', type: 'country' },
  { title: 'Malaysia Exhibition Stands', path: '/exhibition-stands/malaysia', type: 'country' },
  { title: 'Israel Exhibition Stands', path: '/exhibition-stands/israel', type: 'country' },
  { title: 'Jordan Exhibition Stands', path: '/exhibition-stands/jordan', type: 'country' },
  { title: 'Lebanon Exhibition Stands', path: '/exhibition-stands/lebanon', type: 'country' },
  { title: 'Iraq Exhibition Stands', path: '/exhibition-stands/iraq', type: 'country' },
  // New countries added
  { title: 'Vietnam Exhibition Stands', path: '/exhibition-stands/vn', type: 'country' },
  { title: 'Sweden Exhibition Stands', path: '/exhibition-stands/se', type: 'country' },
  { title: 'Norway Exhibition Stands', path: '/exhibition-stands/no', type: 'country' },
  { title: 'Denmark Exhibition Stands', path: '/exhibition-stands/dk', type: 'country' },
  { title: 'Finland Exhibition Stands', path: '/exhibition-stands/fi', type: 'country' },
  { title: 'Poland Exhibition Stands', path: '/exhibition-stands/pl', type: 'country' },
  { title: 'Taiwan Exhibition Stands', path: '/exhibition-stands/tw', type: 'country' },
  { title: 'Hong Kong Exhibition Stands', path: '/exhibition-stands/hk', type: 'country' },
  { title: 'New Zealand Exhibition Stands', path: '/exhibition-stands/nz', type: 'country' },
  { title: 'Austria Exhibition Stands', path: '/exhibition-stands/at', type: 'country' },
  // City pages for Germany
  { title: 'Exhibition Stands in Frankfurt, Germany', path: '/exhibition-stands/de/frankfurt', type: 'city' },
  { title: 'Exhibition Stands in Stuttgart, Germany', path: '/exhibition-stands/de/stuttgart', type: 'city' },
  { title: 'Exhibition Stands in Berlin, Germany', path: '/exhibition-stands/de/berlin', type: 'city' },
  { title: 'Exhibition Stands in Cologne, Germany', path: '/exhibition-stands/de/cologne', type: 'city' },
  { title: 'Exhibition Stands in Dortmund, Germany', path: '/exhibition-stands/de/dortmund', type: 'city' },
  { title: 'Exhibition Stands in Nuremberg, Germany', path: '/exhibition-stands/de/nuremberg', type: 'city' },
  { title: 'Exhibition Stands in Hannover, Germany', path: '/exhibition-stands/de/hannover', type: 'city' },
  { title: 'Exhibition Stands in Hamburg, Germany', path: '/exhibition-stands/de/hamburg', type: 'city' },
  { title: 'Exhibition Stands in Essen, Germany', path: '/exhibition-stands/de/essen', type: 'city' },
  { title: 'Exhibition Stands in Dusseldorf, Germany', path: '/exhibition-stands/de/dusseldorf', type: 'city' },
  { title: 'Exhibition Stands in Munich, Germany', path: '/exhibition-stands/de/munich', type: 'city' },
  { title: 'Exhibition Stands in Leipzig, Germany', path: '/exhibition-stands/de/leipzig', type: 'city' },
  // City pages for UK
  { title: 'Exhibition Stands in London, UK', path: '/exhibition-stands/gb/london', type: 'city' },
  { title: 'Exhibition Stands in Birmingham, UK', path: '/exhibition-stands/gb/birmingham', type: 'city' },
  { title: 'Exhibition Stands in Manchester, UK', path: '/exhibition-stands/gb/manchester', type: 'city' },
  { title: 'Exhibition Stands in Glasgow, UK', path: '/exhibition-stands/gb/glasgow', type: 'city' },
  // City pages for Poland
  { title: 'Exhibition Stands in Warsaw, Poland', path: '/exhibition-stands/pl/warsaw', type: 'city' },
  { title: 'Exhibition Stands in Kielce, Poland', path: '/exhibition-stands/pl/kielce', type: 'city' },
  { title: 'Exhibition Stands in Poznan, Poland', path: '/exhibition-stands/pl/poznan', type: 'city' },
  // City pages for Norway
  { title: 'Exhibition Stands in Oslo, Norway', path: '/exhibition-stands/no/oslo', type: 'city' },
  // City pages for Denmark
  { title: 'Exhibition Stands in Copenhagen, Denmark', path: '/exhibition-stands/dk/copenhagen', type: 'city' },
  // City pages for Finland
  { title: 'Exhibition Stands in Helsinki, Finland', path: '/exhibition-stands/fi/helsinki', type: 'city' },
  // City pages for Austria
  { title: 'Exhibition Stands in Vienna, Austria', path: '/exhibition-stands/at/vienna', type: 'city' },
  // City pages for Spain
  { title: 'Exhibition Stands in Madrid, Spain', path: '/exhibition-stands/es/madrid', type: 'city' },
  { title: 'Exhibition Stands in Barcelona, Spain', path: '/exhibition-stands/es/barcelona', type: 'city' },
  { title: 'Exhibition Stands in Valencia, Spain', path: '/exhibition-stands/es/valencia', type: 'city' },
  { title: 'Exhibition Stands in Seville, Spain', path: '/exhibition-stands/es/seville', type: 'city' },
  { title: 'Exhibition Stands in Bilbao, Spain', path: '/exhibition-stands/es/bilbao', type: 'city' },
  { title: 'Exhibition Stands in Malaga, Spain', path: '/exhibition-stands/es/malaga', type: 'city' },
  { title: 'Exhibition Stands in Alicante, Spain', path: '/exhibition-stands/es/alicante', type: 'city' },
  { title: 'Exhibition Stands in Zaragoza, Spain', path: '/exhibition-stands/es/zaragoza', type: 'city' },
  { title: 'Exhibition Stands in Valladolid, Spain', path: '/exhibition-stands/es/valladolid', type: 'city' },
  { title: 'Exhibition Stands in Vigo, Spain', path: '/exhibition-stands/es/vigo', type: 'city' },
  { title: 'Exhibition Stands in Coruna, Spain', path: '/exhibition-stands/es/coruna', type: 'city' },
  { title: 'Exhibition Stands in Jaen, Spain', path: '/exhibition-stands/es/jaen', type: 'city' },
  { title: 'Exhibition Stands in Palma de Mallorca, Spain', path: '/exhibition-stands/es/palma-de-mallorca', type: 'city' },
  // City pages for Switzerland
  { title: 'Exhibition Stands in Zurich, Switzerland', path: '/exhibition-stands/ch/zurich', type: 'city' },
  { title: 'Exhibition Stands in Geneva, Switzerland', path: '/exhibition-stands/ch/geneva', type: 'city' },
  { title: 'Exhibition Stands in Basel, Switzerland', path: '/exhibition-stands/ch/basel', type: 'city' },
  { title: 'Exhibition Stands in Bern, Switzerland', path: '/exhibition-stands/ch/bern', type: 'city' },
  { title: 'Exhibition Stands in Lugano, Switzerland', path: '/exhibition-stands/ch/lugano', type: 'city' },
  { title: 'Exhibition Stands in Sirnach, Switzerland', path: '/exhibition-stands/ch/sirnach', type: 'city' },
  // City pages for Australia
  { title: 'Exhibition Stands in Sydney, Australia', path: '/exhibition-stands/au/sydney', type: 'city' },
  { title: 'Exhibition Stands in Melbourne, Australia', path: '/exhibition-stands/au/melbourne', type: 'city' },
  { title: 'Exhibition Stands in Brisbane, Australia', path: '/exhibition-stands/au/brisbane', type: 'city' },
  // City pages for Taiwan
  { title: 'Exhibition Stands in Taipei, Taiwan', path: '/exhibition-stands/tw/taipei', type: 'city' },
  // City pages for Hong Kong
  { title: 'Exhibition Stands in Hong Kong', path: '/exhibition-stands/hk/hong-kong', type: 'city' },
  // City pages for Philippines
  { title: 'Exhibition Stands in Manila, Philippines', path: '/exhibition-stands/ph/manila', type: 'city' },
  // Additional missing countries
  { title: 'Czech Republic Exhibition Stands', path: '/exhibition-stands/cz', type: 'country' },
  { title: 'Hungary Exhibition Stands', path: '/exhibition-stands/hu', type: 'country' },
  { title: 'Nigeria Exhibition Stands', path: '/exhibition-stands/ng', type: 'country' },
  { title: 'Kenya Exhibition Stands', path: '/exhibition-stands/ke', type: 'country' },
  { title: 'Brazil Exhibition Stands', path: '/exhibition-stands/br', type: 'country' },
  { title: 'Mexico Exhibition Stands', path: '/exhibition-stands/mx', type: 'country' },
  // Missing countries that exist on website but not in CMS
  { title: 'United Arab Emirates Exhibition Stands', path: '/exhibition-stands/uae', type: 'country' },
  { title: 'Japan Exhibition Stands', path: '/exhibition-stands/jp', type: 'country' },
  { title: 'China Exhibition Stands', path: '/exhibition-stands/cn', type: 'country' },
  { title: 'South Korea Exhibition Stands', path: '/exhibition-stands/kr', type: 'country' },
  { title: 'Indonesia Exhibition Stands', path: '/exhibition-stands/id', type: 'country' },
  { title: 'Malaysia Exhibition Stands', path: '/exhibition-stands/my', type: 'country' },
  { title: 'Turkey Exhibition Stands', path: '/exhibition-stands/tr', type: 'country' },
  { title: 'Russia Exhibition Stands', path: '/exhibition-stands/ru', type: 'country' },
  { title: 'Italy Exhibition Stands', path: '/exhibition-stands/it', type: 'country' },
  { title: 'France Exhibition Stands', path: '/exhibition-stands/fr', type: 'country' },
  { title: 'Netherlands Exhibition Stands', path: '/exhibition-stands/nl', type: 'country' },
  { title: 'Belgium Exhibition Stands', path: '/exhibition-stands/be', type: 'country' },
  { title: 'Switzerland Exhibition Stands', path: '/exhibition-stands/ch', type: 'country' },
  { title: 'Sweden Exhibition Stands', path: '/exhibition-stands/se', type: 'country' },
  { title: 'Norway Exhibition Stands', path: '/exhibition-stands/no', type: 'country' },
  { title: 'Denmark Exhibition Stands', path: '/exhibition-stands/dk', type: 'country' },
  { title: 'Finland Exhibition Stands', path: '/exhibition-stands/fi', type: 'country' },
  { title: 'Poland Exhibition Stands', path: '/exhibition-stands/pl', type: 'country' },
  { title: 'Taiwan Exhibition Stands', path: '/exhibition-stands/tw', type: 'country' },
  { title: 'Hong Kong Exhibition Stands', path: '/exhibition-stands/hk', type: 'country' },
  { title: 'New Zealand Exhibition Stands', path: '/exhibition-stands/nz', type: 'country' },
  { title: 'Vietnam Exhibition Stands', path: '/exhibition-stands/vn', type: 'country' },
  { title: 'Austria Exhibition Stands', path: '/exhibition-stands/at', type: 'country' },
  { title: 'Australia Exhibition Stands', path: '/exhibition-stands/au', type: 'country' },
  { title: 'Spain Exhibition Stands', path: '/exhibition-stands/es', type: 'country' },
  { title: 'Israel Exhibition Stands', path: '/exhibition-stands/israel', type: 'country' },
  { title: 'Jordan Exhibition Stands', path: '/exhibition-stands/jordan', type: 'country' },
  { title: 'Lebanon Exhibition Stands', path: '/exhibition-stands/lebanon', type: 'country' },
  { title: 'Iraq Exhibition Stands', path: '/exhibition-stands/iraq', type: 'country' },
  { title: 'Iran Exhibition Stands', path: '/exhibition-stands/iran', type: 'country' },
  { title: 'Egypt Exhibition Stands', path: '/exhibition-stands/egypt', type: 'country' },
  { title: 'Morocco Exhibition Stands', path: '/exhibition-stands/morocco', type: 'country' },
  { title: 'Qatar Exhibition Stands', path: '/exhibition-stands/qatar', type: 'country' },
  { title: 'Kuwait Exhibition Stands', path: '/exhibition-stands/kuwait', type: 'country' },
  { title: 'Bahrain Exhibition Stands', path: '/exhibition-stands/bahrain', type: 'country' },
  { title: 'Oman Exhibition Stands', path: '/exhibition-stands/oman', type: 'country' },
  { title: 'Saudi Arabia Exhibition Stands', path: '/exhibition-stands/saudi-arabia', type: 'country' },
  { title: 'United States Exhibition Stands', path: '/exhibition-stands/us', type: 'country' },
  { title: 'Canada Exhibition Stands', path: '/exhibition-stands/ca', type: 'country' },
  { title: 'South Africa Exhibition Stands', path: '/exhibition-stands/za', type: 'country' },
  { title: 'Singapore Exhibition Stands', path: '/exhibition-stands/sg', type: 'country' },
  { title: 'Thailand Exhibition Stands', path: '/exhibition-stands/th', type: 'country' },
  { title: 'Philippines Exhibition Stands', path: '/exhibition-stands/ph', type: 'country' },
  // City pages for Czech Republic
  { title: 'Exhibition Stands in Prague, Czech Republic', path: '/exhibition-stands/cz/prague', type: 'city' },
  // City pages for Hungary
  { title: 'Exhibition Stands in Budapest, Hungary', path: '/exhibition-stands/hu/budapest', type: 'city' },
  // City pages for Nigeria
  { title: 'Exhibition Stands in Lagos, Nigeria', path: '/exhibition-stands/ng/lagos', type: 'city' },
  // City pages for Kenya
  { title: 'Exhibition Stands in Nairobi, Kenya', path: '/exhibition-stands/ke/nairobi', type: 'city' },
  // City pages for South Africa
  { title: 'Exhibition Stands in Cape Town, South Africa', path: '/exhibition-stands/za/cape-town', type: 'city' },
  { title: 'Exhibition Stands in Johannesburg, South Africa', path: '/exhibition-stands/za/johannesburg', type: 'city' },
  // City pages for Morocco
  { title: 'Exhibition Stands in Casablanca, Morocco', path: '/exhibition-stands/ma/casablanca', type: 'city' },
  // City pages for Brazil
  { title: 'Exhibition Stands in São Paulo, Brazil', path: '/exhibition-stands/br/sao-paulo', type: 'city' },
  { title: 'Exhibition Stands in Rio de Janeiro, Brazil', path: '/exhibition-stands/br/rio-de-janeiro', type: 'city' },
  // City pages for Mexico
  { title: 'Exhibition Stands in Mexico City, Mexico', path: '/exhibition-stands/mx/mexico-city', type: 'city' },
  // Missing city pages that exist on website but not in CMS
  { title: 'Exhibition Stands in Chiba, Japan', path: '/exhibition-stands/jp/chiba', type: 'city' },
  { title: 'Exhibition Stands in Strasbourg, France', path: '/exhibition-stands/fr/strasbourg', type: 'city' },
  { title: 'Exhibition Stands in Maastricht, Netherlands', path: '/exhibition-stands/nl/maastricht', type: 'city' },
  { title: 'Exhibition Stands in Rotterdam, Netherlands', path: '/exhibition-stands/nl/rotterdam', type: 'city' },
  { title: 'Exhibition Stands in Vijfhuizen, Netherlands', path: '/exhibition-stands/nl/vijfhuizen', type: 'city' },
  { title: 'Exhibition Stands in Kortrijk, Belgium', path: '/exhibition-stands/be/kortrijk', type: 'city' },
  { title: 'Exhibition Stands in Khon Kaen, Thailand', path: '/exhibition-stands/th/khon-kaen', type: 'city' },
  { title: 'Exhibition Stands in Warsaw, Poland', path: '/exhibition-stands/pl/warsaw', type: 'city' },
  { title: 'Exhibition Stands in Kielce, Poland', path: '/exhibition-stands/pl/kielce', type: 'city' },
  { title: 'Exhibition Stands in Poznan, Poland', path: '/exhibition-stands/pl/poznan', type: 'city' },
  { title: 'Exhibition Stands in Oslo, Norway', path: '/exhibition-stands/no/oslo', type: 'city' },
  { title: 'Exhibition Stands in Copenhagen, Denmark', path: '/exhibition-stands/dk/copenhagen', type: 'city' },
  { title: 'Exhibition Stands in Helsinki, Finland', path: '/exhibition-stands/fi/helsinki', type: 'city' },
  { title: 'Exhibition Stands in Vienna, Austria', path: '/exhibition-stands/at/vienna', type: 'city' },
  { title: 'Exhibition Stands in Sydney, Australia', path: '/exhibition-stands/au/sydney', type: 'city' },
  { title: 'Exhibition Stands in Melbourne, Australia', path: '/exhibition-stands/au/melbourne', type: 'city' },
  { title: 'Exhibition Stands in Brisbane, Australia', path: '/exhibition-stands/au/brisbane', type: 'city' },
  { title: 'Exhibition Stands in Taipei, Taiwan', path: '/exhibition-stands/tw/taipei', type: 'city' },
  { title: 'Exhibition Stands in Hong Kong', path: '/exhibition-stands/hk/hong-kong', type: 'city' },
  { title: 'Exhibition Stands in Auckland, New Zealand', path: '/exhibition-stands/nz/auckland', type: 'city' },
  { title: 'Exhibition Stands in Ho Chi Minh City, Vietnam', path: '/exhibition-stands/vn/ho-chi-minh-city', type: 'city' },
  { title: 'Exhibition Stands in Stockholm, Sweden', path: '/exhibition-stands/se/stockholm', type: 'city' },
  { title: 'Exhibition Stands in Gothenburg, Sweden', path: '/exhibition-stands/se/gothenburg', type: 'city' },
  { title: 'Exhibition Stands in Madrid, Spain', path: '/exhibition-stands/es/madrid', type: 'city' },
  { title: 'Exhibition Stands in Barcelona, Spain', path: '/exhibition-stands/es/barcelona', type: 'city' },
  { title: 'Exhibition Stands in Valencia, Spain', path: '/exhibition-stands/es/valencia', type: 'city' },
  { title: 'Exhibition Stands in Seville, Spain', path: '/exhibition-stands/es/seville', type: 'city' },
  { title: 'Exhibition Stands in Bilbao, Spain', path: '/exhibition-stands/es/bilbao', type: 'city' },
  { title: 'Exhibition Stands in Malaga, Spain', path: '/exhibition-stands/es/malaga', type: 'city' },
  { title: 'Exhibition Stands in Alicante, Spain', path: '/exhibition-stands/es/alicante', type: 'city' },
  { title: 'Exhibition Stands in Zaragoza, Spain', path: '/exhibition-stands/es/zaragoza', type: 'city' },
  { title: 'Exhibition Stands in Valladolid, Spain', path: '/exhibition-stands/es/valladolid', type: 'city' },
  { title: 'Exhibition Stands in Vigo, Spain', path: '/exhibition-stands/es/vigo', type: 'city' },
  { title: 'Exhibition Stands in Coruna, Spain', path: '/exhibition-stands/es/coruna', type: 'city' },
  { title: 'Exhibition Stands in Jaen, Spain', path: '/exhibition-stands/es/jaen', type: 'city' },
  { title: 'Exhibition Stands in Palma de Mallorca, Spain', path: '/exhibition-stands/es/palma-de-mallorca', type: 'city' },
  { title: 'Exhibition Stands in Zurich, Switzerland', path: '/exhibition-stands/ch/zurich', type: 'city' },
  { title: 'Exhibition Stands in Geneva, Switzerland', path: '/exhibition-stands/ch/geneva', type: 'city' },
  { title: 'Exhibition Stands in Basel, Switzerland', path: '/exhibition-stands/ch/basel', type: 'city' },
  { title: 'Exhibition Stands in Bern, Switzerland', path: '/exhibition-stands/ch/bern', type: 'city' },
  { title: 'Exhibition Stands in Lugano, Switzerland', path: '/exhibition-stands/ch/lugano', type: 'city' },
  { title: 'Exhibition Stands in Sirnach, Switzerland', path: '/exhibition-stands/ch/sirnach', type: 'city' },
  { title: 'Exhibition Stands in Brussels, Belgium', path: '/exhibition-stands/be/brussels', type: 'city' },
  { title: 'Exhibition Stands in Amsterdam, Netherlands', path: '/exhibition-stands/nl/amsterdam', type: 'city' },
  { title: 'Exhibition Stands in Paris, France', path: '/exhibition-stands/fr/paris', type: 'city' },
  { title: 'Exhibition Stands in Lyon, France', path: '/exhibition-stands/fr/lyon', type: 'city' },
  { title: 'Exhibition Stands in Cannes, France', path: '/exhibition-stands/fr/cannes', type: 'city' },
  { title: 'Exhibition Stands in Milan, Italy', path: '/exhibition-stands/it/milan', type: 'city' },
  { title: 'Exhibition Stands in Rome, Italy', path: '/exhibition-stands/it/rome', type: 'city' },
  { title: 'Exhibition Stands in Bologna, Italy', path: '/exhibition-stands/it/bologna', type: 'city' },
  { title: 'Exhibition Stands in Turin, Italy', path: '/exhibition-stands/it/turin', type: 'city' },
  { title: 'Exhibition Stands in Florence, Italy', path: '/exhibition-stands/it/florence', type: 'city' },
  { title: 'Exhibition Stands in Venice, Italy', path: '/exhibition-stands/it/venice', type: 'city' },
  { title: 'Exhibition Stands in Naples, Italy', path: '/exhibition-stands/it/naples', type: 'city' },
  { title: 'Exhibition Stands in Verona, Italy', path: '/exhibition-stands/it/verona', type: 'city' },
  { title: 'Exhibition Stands in Dortmund, Germany', path: '/exhibition-stands/de/dortmund', type: 'city' },
  { title: 'Exhibition Stands in Nuremberg, Germany', path: '/exhibition-stands/de/nuremberg', type: 'city' },
  { title: 'Exhibition Stands in Hannover, Germany', path: '/exhibition-stands/de/hannover', type: 'city' },
  { title: 'Exhibition Stands in Hamburg, Germany', path: '/exhibition-stands/de/hamburg', type: 'city' },
  { title: 'Exhibition Stands in Essen, Germany', path: '/exhibition-stands/de/essen', type: 'city' },
  { title: 'Exhibition Stands in Dusseldorf, Germany', path: '/exhibition-stands/de/dusseldorf', type: 'city' },
  { title: 'Exhibition Stands in Munich, Germany', path: '/exhibition-stands/de/munich', type: 'city' },
  { title: 'Exhibition Stands in Leipzig, Germany', path: '/exhibition-stands/de/leipzig', type: 'city' },
  { title: 'Exhibition Stands in London, UK', path: '/exhibition-stands/gb/london', type: 'city' },
  { title: 'Exhibition Stands in Birmingham, UK', path: '/exhibition-stands/gb/birmingham', type: 'city' },
  { title: 'Exhibition Stands in Manchester, UK', path: '/exhibition-stands/gb/manchester', type: 'city' },
  { title: 'Exhibition Stands in Glasgow, UK', path: '/exhibition-stands/gb/glasgow', type: 'city' },
  { title: 'Exhibition Stands in Edinburgh, UK', path: '/exhibition-stands/gb/edinburgh', type: 'city' },
  { title: 'Exhibition Stands in Leeds, UK', path: '/exhibition-stands/gb/leeds', type: 'city' },
  { title: 'Exhibition Stands in Bristol, UK', path: '/exhibition-stands/gb/bristol', type: 'city' },
  { title: 'Exhibition Stands in Liverpool, UK', path: '/exhibition-stands/gb/liverpool', type: 'city' },
  { title: 'Exhibition Stands in Bangkok, Thailand', path: '/exhibition-stands/th/bangkok', type: 'city' },
  { title: 'Exhibition Stands in Manila, Philippines', path: '/exhibition-stands/ph/manila', type: 'city' },
  { title: 'Exhibition Stands in Jakarta, Indonesia', path: '/exhibition-stands/id/jakarta', type: 'city' },
  { title: 'Exhibition Stands in Bali, Indonesia', path: '/exhibition-stands/id/bali', type: 'city' },
  { title: 'Exhibition Stands in Kuala Lumpur, Malaysia', path: '/exhibition-stands/my/kuala-lumpur', type: 'city' },
  { title: 'Exhibition Stands in Penang, Malaysia', path: '/exhibition-stands/my/penang', type: 'city' },
  { title: 'Exhibition Stands in Singapore', path: '/exhibition-stands/sg/singapore', type: 'city' },
  { title: 'Exhibition Stands in Tokyo, Japan', path: '/exhibition-stands/jp/tokyo', type: 'city' },
  { title: 'Exhibition Stands in Osaka, Japan', path: '/exhibition-stands/jp/osaka', type: 'city' },
  { title: 'Exhibition Stands in Kyoto, Japan', path: '/exhibition-stands/jp/kyoto', type: 'city' },
  { title: 'Exhibition Stands in Yokohama, Japan', path: '/exhibition-stands/jp/yokohama', type: 'city' },
  { title: 'Exhibition Stands in Kobe, Japan', path: '/exhibition-stands/jp/kobe', type: 'city' },
  { title: 'Exhibition Stands in Shanghai, China', path: '/exhibition-stands/cn/shanghai', type: 'city' },
  { title: 'Exhibition Stands in Beijing, China', path: '/exhibition-stands/cn/beijing', type: 'city' },
  { title: 'Exhibition Stands in Guangzhou, China', path: '/exhibition-stands/cn/guangzhou', type: 'city' },
  { title: 'Exhibition Stands in Shenzhen, China', path: '/exhibition-stands/cn/shenzhen', type: 'city' },
  { title: 'Exhibition Stands in Chengdu, China', path: '/exhibition-stands/cn/chengdu', type: 'city' },
  { title: 'Exhibition Stands in Hangzhou, China', path: '/exhibition-stands/cn/hangzhou', type: 'city' },
  { title: 'Exhibition Stands in Nanjing, China', path: '/exhibition-stands/cn/nanjing', type: 'city' },
  { title: 'Exhibition Stands in Tianjin, China', path: '/exhibition-stands/cn/tianjin', type: 'city' },
  { title: 'Exhibition Stands in Xian, China', path: '/exhibition-stands/cn/xian', type: 'city' },
  { title: 'Exhibition Stands in Wuhan, China', path: '/exhibition-stands/cn/wuhan', type: 'city' },
  { title: 'Exhibition Stands in Seoul, South Korea', path: '/exhibition-stands/kr/seoul', type: 'city' },
  { title: 'Exhibition Stands in Busan, South Korea', path: '/exhibition-stands/kr/busan', type: 'city' },
  { title: 'Exhibition Stands in Incheon, South Korea', path: '/exhibition-stands/kr/incheon', type: 'city' },
  { title: 'Exhibition Stands in Daegu, South Korea', path: '/exhibition-stands/kr/daegu', type: 'city' },
  { title: 'Exhibition Stands in Dubai, UAE', path: '/exhibition-stands/uae/dubai', type: 'city' },
  { title: 'Exhibition Stands in Abu Dhabi, UAE', path: '/exhibition-stands/uae/abu-dhabi', type: 'city' },
  { title: 'Exhibition Stands in Sharjah, UAE', path: '/exhibition-stands/uae/sharjah', type: 'city' },
  { title: 'Exhibition Stands in Ras Al Khaimah, UAE', path: '/exhibition-stands/uae/ras-al-khaimah', type: 'city' },
  { title: 'Exhibition Stands in Ajman, UAE', path: '/exhibition-stands/uae/ajman', type: 'city' },
  { title: 'Exhibition Stands in Fujairah, UAE', path: '/exhibition-stands/uae/fujairah', type: 'city' },
  { title: 'Exhibition Stands in Umm Al Quwain, UAE', path: '/exhibition-stands/uae/umm-al-quwain', type: 'city' },
  { title: 'Exhibition Stands in Riyadh, Saudi Arabia', path: '/exhibition-stands/sa/riyadh', type: 'city' },
  { title: 'Exhibition Stands in Jeddah, Saudi Arabia', path: '/exhibition-stands/sa/jeddah', type: 'city' },
  { title: 'Exhibition Stands in Dammam, Saudi Arabia', path: '/exhibition-stands/sa/dammam', type: 'city' },
  { title: 'Exhibition Stands in Khobar, Saudi Arabia', path: '/exhibition-stands/sa/khobar', type: 'city' },
  { title: 'Exhibition Stands in Mecca, Saudi Arabia', path: '/exhibition-stands/sa/mecca', type: 'city' },
  { title: 'Exhibition Stands in Medina, Saudi Arabia', path: '/exhibition-stands/sa/medina', type: 'city' },
  { title: 'Exhibition Stands in Doha, Qatar', path: '/exhibition-stands/qa/doha', type: 'city' },
  { title: 'Exhibition Stands in Al Rayyan, Qatar', path: '/exhibition-stands/qa/al-rayyan', type: 'city' },
  { title: 'Exhibition Stands in Al Wakrah, Qatar', path: '/exhibition-stands/qa/al-wakrah', type: 'city' },
  { title: 'Exhibition Stands in Kuwait City, Kuwait', path: '/exhibition-stands/kw/kuwait-city', type: 'city' },
  { title: 'Exhibition Stands in Al Ahmadi, Kuwait', path: '/exhibition-stands/kw/al-ahmadi', type: 'city' },
  { title: 'Exhibition Stands in Hawalli, Kuwait', path: '/exhibition-stands/kw/hawalli', type: 'city' },
  { title: 'Exhibition Stands in Manama, Bahrain', path: '/exhibition-stands/bh/manama', type: 'city' },
  { title: 'Exhibition Stands in Muscat, Oman', path: '/exhibition-stands/om/muscat', type: 'city' },
  { title: 'Exhibition Stands in Salalah, Oman', path: '/exhibition-stands/om/salalah', type: 'city' },
  { title: 'Exhibition Stands in Sohar, Oman', path: '/exhibition-stands/om/sohar', type: 'city' },
  { title: 'Exhibition Stands in Cairo, Egypt', path: '/exhibition-stands/eg/cairo', type: 'city' },
  { title: 'Exhibition Stands in Alexandria, Egypt', path: '/exhibition-stands/eg/alexandria', type: 'city' },
  { title: 'Exhibition Stands in Sharm El Sheikh, Egypt', path: '/exhibition-stands/eg/sharm-el-sheikh', type: 'city' },
  { title: 'Exhibition Stands in Luxor, Egypt', path: '/exhibition-stands/eg/luxor', type: 'city' },
  { title: 'Exhibition Stands in Casablanca, Morocco', path: '/exhibition-stands/ma/casablanca', type: 'city' },
  { title: 'Exhibition Stands in Marrakech, Morocco', path: '/exhibition-stands/ma/marrakech', type: 'city' },
  { title: 'Exhibition Stands in Rabat, Morocco', path: '/exhibition-stands/ma/rabat', type: 'city' },
  { title: 'Exhibition Stands in Fez, Morocco', path: '/exhibition-stands/ma/fez', type: 'city' },
  { title: 'Exhibition Stands in Tehran, Iran', path: '/exhibition-stands/ir/tehran', type: 'city' },
  { title: 'Exhibition Stands in Isfahan, Iran', path: '/exhibition-stands/ir/isfahan', type: 'city' },
  { title: 'Exhibition Stands in Mashhad, Iran', path: '/exhibition-stands/ir/mashhad', type: 'city' },
  { title: 'Exhibition Stands in Baghdad, Iraq', path: '/exhibition-stands/iq/baghdad', type: 'city' },
  { title: 'Exhibition Stands in Basra, Iraq', path: '/exhibition-stands/iq/basra', type: 'city' },
  { title: 'Exhibition Stands in Erbil, Iraq', path: '/exhibition-stands/iq/erbil', type: 'city' },
  { title: 'Exhibition Stands in Moscow, Russia', path: '/exhibition-stands/ru/moscow', type: 'city' },
  { title: 'Exhibition Stands in St. Petersburg, Russia', path: '/exhibition-stands/ru/st-petersburg', type: 'city' },
  { title: 'Exhibition Stands in Novosibirsk, Russia', path: '/exhibition-stands/ru/novosibirsk', type: 'city' },
  { title: 'Exhibition Stands in Yekaterinburg, Russia', path: '/exhibition-stands/ru/yekaterinburg', type: 'city' },
  { title: 'Exhibition Stands in Istanbul, Turkey', path: '/exhibition-stands/tr/istanbul', type: 'city' },
  { title: 'Exhibition Stands in Ankara, Turkey', path: '/exhibition-stands/tr/ankara', type: 'city' },
  { title: 'Exhibition Stands in Izmir, Turkey', path: '/exhibition-stands/tr/izmir', type: 'city' },
  { title: 'Exhibition Stands in Bursa, Turkey', path: '/exhibition-stands/tr/bursa', type: 'city' },
  { title: 'Exhibition Stands in Antalya, Turkey', path: '/exhibition-stands/tr/antalya', type: 'city' },
  { title: 'Exhibition Stands in Las Vegas, United States', path: '/exhibition-stands/us/las-vegas', type: 'city' },
  { title: 'Exhibition Stands in New York, United States', path: '/exhibition-stands/us/new-york', type: 'city' },
  { title: 'Exhibition Stands in Chicago, United States', path: '/exhibition-stands/us/chicago', type: 'city' },
  { title: 'Exhibition Stands in Miami, United States', path: '/exhibition-stands/us/miami', type: 'city' },
  { title: 'Exhibition Stands in Atlanta, United States', path: '/exhibition-stands/us/atlanta', type: 'city' },
  { title: 'Exhibition Stands in Los Angeles, United States', path: '/exhibition-stands/us/los-angeles', type: 'city' },
  { title: 'Exhibition Stands in Boston, United States', path: '/exhibition-stands/us/boston', type: 'city' },
  { title: 'Exhibition Stands in Detroit, United States', path: '/exhibition-stands/us/detroit', type: 'city' },
  { title: 'Exhibition Stands in Orlando, United States', path: '/exhibition-stands/us/orlando', type: 'city' },
  { title: 'Exhibition Stands in San Francisco, United States', path: '/exhibition-stands/us/san-francisco', type: 'city' },
  { title: 'Exhibition Stands in Dallas, United States', path: '/exhibition-stands/us/dallas', type: 'city' },
  { title: 'Exhibition Stands in Houston, United States', path: '/exhibition-stands/us/houston', type: 'city' },
  { title: 'Exhibition Stands in San Diego, United States', path: '/exhibition-stands/us/san-diego', type: 'city' },
  { title: 'Exhibition Stands in Washington D.C., United States', path: '/exhibition-stands/us/washington-dc', type: 'city' },
  { title: 'Exhibition Stands in Seattle, United States', path: '/exhibition-stands/us/seattle', type: 'city' },
  { title: 'Exhibition Stands in Philadelphia, United States', path: '/exhibition-stands/us/philadelphia', type: 'city' },
  { title: 'Exhibition Stands in Phoenix, United States', path: '/exhibition-stands/us/phoenix', type: 'city' },
  { title: 'Exhibition Stands in Denver, United States', path: '/exhibition-stands/us/denver', type: 'city' },
  { title: 'Exhibition Stands in Toronto, Canada', path: '/exhibition-stands/ca/toronto', type: 'city' },
  { title: 'Exhibition Stands in Vancouver, Canada', path: '/exhibition-stands/ca/vancouver', type: 'city' },
  { title: 'Exhibition Stands in Montreal, Canada', path: '/exhibition-stands/ca/montreal', type: 'city' },
  { title: 'Exhibition Stands in Calgary, Canada', path: '/exhibition-stands/ca/calgary', type: 'city' },
  { title: 'Exhibition Stands in Ottawa, Canada', path: '/exhibition-stands/ca/ottawa', type: 'city' },
  { title: 'Exhibition Stands in Edmonton, Canada', path: '/exhibition-stands/ca/edmonton', type: 'city' },
  { title: 'Exhibition Stands in São Paulo, Brazil', path: '/exhibition-stands/br/sao-paulo', type: 'city' },
  { title: 'Exhibition Stands in Rio de Janeiro, Brazil', path: '/exhibition-stands/br/rio-de-janeiro', type: 'city' },
  { title: 'Exhibition Stands in Brasília, Brazil', path: '/exhibition-stands/br/brasilia', type: 'city' },
  { title: 'Exhibition Stands in Curitiba, Brazil', path: '/exhibition-stands/br/curitiba', type: 'city' },
  { title: 'Exhibition Stands in Belo Horizonte, Brazil', path: '/exhibition-stands/br/belo-horizonte', type: 'city' },
  { title: 'Exhibition Stands in Salvador, Brazil', path: '/exhibition-stands/br/salvador', type: 'city' },
  { title: 'Exhibition Stands in Recife, Brazil', path: '/exhibition-stands/br/recife', type: 'city' },
  { title: 'Exhibition Stands in Porto Alegre, Brazil', path: '/exhibition-stands/br/porto-alegre', type: 'city' },
  { title: 'Exhibition Stands in Mexico City, Mexico', path: '/exhibition-stands/mx/mexico-city', type: 'city' },
  { title: 'Exhibition Stands in Guadalajara, Mexico', path: '/exhibition-stands/mx/guadalajara', type: 'city' },
  { title: 'Exhibition Stands in Monterrey, Mexico', path: '/exhibition-stands/mx/monterrey', type: 'city' },
  { title: 'Exhibition Stands in Cancun, Mexico', path: '/exhibition-stands/mx/cancun', type: 'city' },
  { title: 'Exhibition Stands in Puebla, Mexico', path: '/exhibition-stands/mx/puebla', type: 'city' },
  { title: 'Exhibition Stands in Tijuana, Mexico', path: '/exhibition-stands/mx/tijuana', type: 'city' },
  { title: 'Exhibition Stands in Cape Town, South Africa', path: '/exhibition-stands/za/cape-town', type: 'city' },
  { title: 'Exhibition Stands in Johannesburg, South Africa', path: '/exhibition-stands/za/johannesburg', type: 'city' },
  { title: 'Exhibition Stands in Durban, South Africa', path: '/exhibition-stands/za/durban', type: 'city' },
  { title: 'Exhibition Stands in Pretoria, South Africa', path: '/exhibition-stands/za/pretoria', type: 'city' },
  { title: 'Exhibition Stands in Port Elizabeth, South Africa', path: '/exhibition-stands/za/port-elizabeth', type: 'city' },
  { title: 'Exhibition Stands in Lagos, Nigeria', path: '/exhibition-stands/ng/lagos', type: 'city' },
  { title: 'Exhibition Stands in Abuja, Nigeria', path: '/exhibition-stands/ng/abuja', type: 'city' },
  { title: 'Exhibition Stands in Kano, Nigeria', path: '/exhibition-stands/ng/kano', type: 'city' },
  { title: 'Exhibition Stands in Ibadan, Nigeria', path: '/exhibition-stands/ng/ibadan', type: 'city' },
  { title: 'Exhibition Stands in Nairobi, Kenya', path: '/exhibition-stands/ke/nairobi', type: 'city' },
  { title: 'Exhibition Stands in Mombasa, Kenya', path: '/exhibition-stands/ke/mombasa', type: 'city' },
  { title: 'Exhibition Stands in Kisumu, Kenya', path: '/exhibition-stands/ke/kisumu', type: 'city' },
  { title: 'Exhibition Stands in Nakuru, Kenya', path: '/exhibition-stands/ke/nakuru', type: 'city' },
  { title: 'Exhibition Stands in Tel Aviv, Israel', path: '/exhibition-stands/il/tel-aviv', type: 'city' },
  { title: 'Exhibition Stands in Jerusalem, Israel', path: '/exhibition-stands/il/jerusalem', type: 'city' },
  { title: 'Exhibition Stands in Haifa, Israel', path: '/exhibition-stands/il/haifa', type: 'city' },
  { title: 'Exhibition Stands in Beersheba, Israel', path: '/exhibition-stands/il/beersheba', type: 'city' },
  { title: 'Exhibition Stands in Amman, Jordan', path: '/exhibition-stands/jo/amman', type: 'city' },
  { title: 'Exhibition Stands in Zarqa, Jordan', path: '/exhibition-stands/jo/zarqa', type: 'city' },
  { title: 'Exhibition Stands in Irbid, Jordan', path: '/exhibition-stands/jo/irbid', type: 'city' },
  { title: 'Exhibition Stands in Beirut, Lebanon', path: '/exhibition-stands/lb/beirut', type: 'city' },
  { title: 'Exhibition Stands in Tripoli, Lebanon', path: '/exhibition-stands/lb/tripoli', type: 'city' },
  { title: 'Exhibition Stands in Sidon, Lebanon', path: '/exhibition-stands/lb/sidon', type: 'city' },
  { title: 'Exhibition Stands in Tyre, Lebanon', path: '/exhibition-stands/lb/tyre', type: 'city' },
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
    
    // Handle dynamic country/city pages and home info cards
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
        
        // Check if this is a special country that needs enhanced query strategies
        const isSpecialCountry = ['jordan', 'lebanon', 'israel', 'iraq', 'uae', 'united-arab-emirates', 'saudi-arabia', 'qatar', 'kuwait', 'bahrain', 'oman', 'egypt', 'morocco', 'iran', 'russia', 'indonesia', 'malaysia', 'china', 'japan', 'south-korea', 'brazil', 'mexico', 'canada', 'south-africa', 'singapore', 'thailand', 'philippines', 'turkey', 'czech-republic', 'hungary', 'nigeria', 'kenya', 'de', 'gb', 'fr', 'it', 'es', 'nl', 'be', 'ch', 'se', 'no', 'dk', 'fi', 'pl', 'tw', 'hk', 'nz', 'vn', 'at', 'au', 'cz', 'hu', 'ng', 'ke', 'br', 'mx', 'za', 'sg', 'th', 'ph', 'tr', 'ru', 'id', 'my', 'cn', 'jp', 'kr'].includes(pageId);
        
        let data, error;
        
        if (isSpecialCountry) {
          console.log('🔍 API Debug - Special country detected:', pageId);
          // Try multiple query patterns for special countries
          const result = await sb
            .from('page_contents')
            .select('content')
            .or(`id.eq.${pageId},id.eq.exhibition-stands-${pageId}`)
            .order('updated_at', { ascending: false })
            .limit(1);
            
          if (result.data?.[0]) {
            data = result.data[0];
            error = null;
          } else {
            // Fallback to exact match
            const exactResult = await sb
              .from('page_contents')
              .select('content')
              .eq('id', pageId)
              .single();
              
            data = exactResult.data;
            error = exactResult.error;
          }
        } else {
          // Standard query for other content
          const result = await sb
            .from('page_contents')
            .select('content')
            .eq('id', pageId)
            .single();
            
          data = result.data;
          error = result.error;
        }
        
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
        if (parts[0] === 'exhibition-stands' || path === '/') {
          // For the homepage, just return full content so editors can read sections.countryPages.homeInfoCards
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
              // If countryData has nested countryPages, extract the inner data
              const actualCountryData = (countryData as any)?.countryPages?.[countrySlug] || countryData;
              console.log('🌍 Actual country data for API:', actualCountryData);
              
              return NextResponse.json(
                { 
                  success: true, 
                  data: { 
                    ...data.content,
                    sections: {
                      ...data.content.sections,
                      countryPages: {
                        [countrySlug]: actualCountryData
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
        // Handle country pages with countryPages structure
        const countrySlug = parts[1];
        const prevCountryPages = currentSections.countryPages || {};
        const incomingCountrySections = (sections as any).countryPages && (sections as any).countryPages[countrySlug]
          ? (sections as any).countryPages[countrySlug]
          : sections;
        
        // Prevent double-nesting by extracting inner countryPages if it exists
        const actualIncomingSections = (incomingCountrySections as any)?.countryPages?.[countrySlug] || incomingCountrySections;
        
        (updated as any).sections = {
          ...currentSections,
          countryPages: {
            ...prevCountryPages,
            [countrySlug]: {
              ...(prevCountryPages[countrySlug] || {}),
              ...actualIncomingSections,
            },
          },
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

    // Special handling for Jordan, Lebanon, and Israel to ensure content updates
    const isSpecialCountry = ['jordan', 'lebanon', 'israel'].some(country => 
      pageId === country || pageId.startsWith(`${country}-`)
    );
    
    if (isSpecialCountry) {
      try {
        console.log('🔄 Special country detected in pages-editor, forcing Supabase update for:', pageId);
        const sb = getServerSupabase();
        
        if (sb) {
          // Force a direct update to Supabase with multiple ID formats to ensure it's found
          const { data, error } = await sb
            .from('page_contents')
            .upsert({
              id: pageId,
              path,
              content: updated,
              updated_at: new Date().toISOString()
            }, { onConflict: 'id' });
          
          if (error) {
            console.error('⚠️ Special country Supabase update error:', error);
            
            // Try alternative ID formats as fallback
            const alternativeIds = [
              pageId,
              `country-${pageId}`,
              pageId.replace('exhibition-stands-', '')
            ];
            
            for (const altId of alternativeIds) {
              console.log('🔄 Trying alternative ID format:', altId);
              const { error: altError } = await sb
                .from('page_contents')
                .upsert({
                  id: altId,
                  path,
                  content: updated,
                  updated_at: new Date().toISOString()
                }, { onConflict: 'id' });
                
              if (!altError) {
                console.log('✅ Alternative ID format successful:', altId);
                break;
              }
            }
          } else {
            console.log('✅ Special country direct Supabase update successful for:', pageId);
          }
        }
      } catch (dbError) {
        console.error('❌ Error during special country database update:', dbError);
      }
    }
    
    if (!savedToSupabase) {
      storageAPI.savePageContent(pageId, updated);
      const current = await readAllPageContentsFromFile();
      current[pageId] = updated;
      await writeAllPageContentsToFile(current);
      try { await commitToGitHub('data/page-contents.json', current); } catch {}
    }

    try { 
      // Force revalidation for special countries
      if (isSpecialCountry) {
        console.log('🔄 Forcing path revalidation for special country:', path);
        revalidatePath(path, 'page');
        revalidatePath('/exhibition-stands/[country]', 'page');
        if (pageId.includes('-')) {
          revalidatePath('/exhibition-stands/[country]/[city]', 'page');
        }
      } else {
        revalidatePath(path);
      }
    } catch {}
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


