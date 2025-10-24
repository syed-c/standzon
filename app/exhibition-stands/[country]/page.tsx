import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';
import { getServerSupabase } from '@/lib/supabase';

// Country data mapping
const COUNTRY_DATA = {
  'united-kingdom': { name: 'United Kingdom', flag: '🇬🇧', code: 'GB' },
  'france': { name: 'France', flag: '🇫🇷', code: 'FR' },
  'germany': { name: 'Germany', flag: '🇩🇪', code: 'DE' },
  'italy': { name: 'Italy', flag: '🇮🇹', code: 'IT' },
  'spain': { name: 'Spain', flag: '🇪🇸', code: 'ES' },
  'belgium': { name: 'Belgium', flag: '🇧🇪', code: 'BE' },
  'netherlands': { name: 'Netherlands', flag: '🇳🇱', code: 'NL' },
  'greece': { name: 'Greece', flag: '🇬🇷', code: 'GR' },
  'hungary': { name: 'Hungary', flag: '🇭🇺', code: 'HU' },
  'poland': { name: 'Poland', flag: '🇵🇱', code: 'PL' },
  'romania': { name: 'Romania', flag: '🇷🇴', code: 'RO' },
  'united-states': { name: 'United States', flag: '🇺🇸', code: 'US' },
  'canada': { name: 'Canada', flag: '🇨🇦', code: 'CA' },
  'brazil': { name: 'Brazil', flag: '🇧🇷', code: 'BR' },
  'argentina': { name: 'Argentina', flag: '🇦🇷', code: 'AR' },
  'colombia': { name: 'Colombia', flag: '🇨🇴', code: 'CO' },
  'chile': { name: 'Chile', flag: '🇨🇱', code: 'CL' },
  'peru': { name: 'Peru', flag: '🇵🇪', code: 'PE' },
  'united-arab-emirates': { name: 'United Arab Emirates', flag: '🇦🇪', code: 'AE' },
  'saudi-arabia': { name: 'Saudi Arabia', flag: '🇸🇦', code: 'SA' },
  'oman': { name: 'Oman', flag: '🇴🇲', code: 'OM' },
  'egypt': { name: 'Egypt', flag: '🇪🇬', code: 'EG' },
  'japan': { name: 'Japan', flag: '🇯🇵', code: 'JP' },
  'south-korea': { name: 'South Korea', flag: '🇰🇷', code: 'KR' },
  'turkey': { name: 'Turkey', flag: '🇹🇷', code: 'TR' },
  'singapore': { name: 'Singapore', flag: '🇸🇬', code: 'SG' },
  'china': { name: 'China', flag: '🇨🇳', code: 'CN' },
  'pakistan': { name: 'Pakistan', flag: '🇵🇰', code: 'PK' },
  'bangladesh': { name: 'Bangladesh', flag: '🇧🇩', code: 'BD' },
  'indonesia': { name: 'Indonesia', flag: '🇮🇩', code: 'ID' },
  'malaysia': { name: 'Malaysia', flag: '🇲🇾', code: 'MY' },
  'south-africa': { name: 'South Africa', flag: '🇿🇦', code: 'ZA' },
  'kenya': { name: 'Kenya', flag: '🇰🇪', code: 'KE' },
  'nigeria': { name: 'Nigeria', flag: '🇳🇬', code: 'NG' },
  'morocco': { name: 'Morocco', flag: '🇲🇦', code: 'MA' },
  'vietnam': { name: 'Vietnam', flag: '🇻🇳', code: 'VN' },
  'sweden': { name: 'Sweden', flag: '🇸🇪', code: 'SE' },
  'norway': { name: 'Norway', flag: '🇳🇴', code: 'NO' },
  'denmark': { name: 'Denmark', flag: '🇩🇰', code: 'DK' },
  'finland': { name: 'Finland', flag: '🇫🇮', code: 'FI' },
  'australia': { name: 'Australia', flag: '🇦🇺', code: 'AU' },
  'switzerland': { name: 'Switzerland', flag: '🇨🇭', code: 'CH' },
  'austria': { name: 'Austria', flag: '🇦🇹', code: 'AT' },
  'czech-republic': { name: 'Czech Republic', flag: '🇨🇿', code: 'CZ' },
  'mexico': { name: 'Mexico', flag: '🇲🇽', code: 'MX' },
  'hong-kong': { name: 'Hong Kong', flag: '🇭🇰', code: 'HK' },
  'portugal': { name: 'Portugal', flag: '🇵🇹', code: 'PT' }
};

// Fetch CMS content for the country page
async function getCountryPageContent(countrySlug: string) {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log(`🔍 Server-side: Fetching CMS data for ${countrySlug}...`);
      
        const result = await sb
          .from('page_contents')
          .select('content')
          .eq('id', countrySlug)
          .single();
          
      if (result.error) {
        console.log('❌ Server-side: Supabase error:', result.error);
        return null;
      }
      
      if (result.data?.content) {
        console.log(`✅ Server-side: Found CMS data for ${countrySlug}`);
        return result.data.content;
      }
    }
  } catch (error) {
    console.error('❌ Server-side: Error fetching CMS data:', error);
  }
  
  return null;
}

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const countrySlug = params.country;
  const countryInfo = COUNTRY_DATA[countrySlug as keyof typeof COUNTRY_DATA];
  
  if (!countryInfo) {
    return {
      title: 'Country Not Found',
      description: 'The requested country page was not found.',
    };
  }

  return {
    title: `Exhibition Stand Builders in ${countryInfo.name} | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across ${countryInfo.name}. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands ${countryInfo.name}`, `booth builders ${countryInfo.name}`, `trade show displays ${countryInfo.name}`, `${countryInfo.name} exhibition builders`, `${countryInfo.name} booth design`, `${countryInfo.name} exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in ${countryInfo.name}`,
      description: `Professional exhibition stand builders across ${countryInfo.name}. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in ${countryInfo.name}`,
      description: `Professional exhibition stand builders across ${countryInfo.name}. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/${countrySlug}`,
    },
  };
}

export default async function CountryPage({ params }: { params: { country: string } }) {
  const countrySlug = params.country;
  const countryInfo = COUNTRY_DATA[countrySlug as keyof typeof COUNTRY_DATA];
  
  if (!countryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Country Not Found</h1>
          <p>The requested country page was not found.</p>
        </div>
      </div>
    );
  }

  console.log(`${countryInfo.flag} Loading ${countryInfo.name} page with modern UI...`);
  
  const cmsContent = await getCountryPageContent(countrySlug);
  
  const defaultContent = {
    id: `${countrySlug}-main`,
    title: `Exhibition Stand Builders in ${countryInfo.name}`,
    metaTitle: `${countryInfo.name} Exhibition Stand Builders | Trade Show Booth Design`,
    metaDescription: `Leading exhibition stand builders across ${countryInfo.name}. Custom trade show displays, booth design, and professional exhibition services.`,
    description: `${countryInfo.name} is a significant market for international trade shows and exhibitions. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in ${countryInfo.name}'s dynamic exhibition landscape.`,
    heroContent: `Partner with ${countryInfo.name}'s premier exhibition stand builders for trade show success across the country.`,
    seoKeywords: [`${countryInfo.name} exhibition stands`, `${countryInfo.name} trade show builders`, `${countryInfo.name} exhibition builders`, `${countryInfo.name} booth design`, `${countryInfo.name} exhibition services`]
  };
  
  const countryBlock = cmsContent?.sections?.countryPages?.[countrySlug] || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };

    return (
      <div className="font-inter">
        <Navigation />
        <CountryCityPage
        country={countryInfo.name}
        initialBuilders={[]}
        initialContent={mergedContent}
        cmsContent={cmsContent}
        />
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  }