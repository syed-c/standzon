import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import CountryCityPage from '@/components/public/CountryCityPage';
import { getServerSupabase } from '@/lib/supabase';

// ✅ FIX #1: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';

// Fetch CMS content for the Austria page
async function getAustriaPageContent() {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log('🔍 Server-side: Fetching CMS data for Austria...');
      
      const result = await sb
        .from('page_contents')
        .select('content')
        .eq('id', 'at')
        .single();
        
      if (result.error) {
        console.log('❌ Server-side: Supabase error:', result.error);
        return null;
      }
      
      if (result.data?.content) {
        console.log('✅ Server-side: Found CMS data for Austria');
        return result.data.content;
      }
    }
  } catch (error) {
    console.error('❌ Server-side: Error fetching CMS data:', error);
  }
  
  return null;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Austria | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Austria. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Austria`, `booth builders Austria`, `trade show displays Austria`, `Austria exhibition builders`, `Austria booth design`, `Austria exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Austria`,
      description: `Professional exhibition stand builders across Austria. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Austria`,
      description: `Professional exhibition stand builders across Austria. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/at`,
    },
  };
}

export default async function AustriaPage() {
  console.log('🇦🇹 Loading Austria page with modern UI...');
  
  const cmsContent = await getAustriaPageContent();
  
  const defaultContent = {
    id: 'at-main',
    title: 'Exhibition Stand Builders in Austria',
    metaTitle: 'Austria Exhibition Stand Builders | Trade Show Booth Design',
    metaDescription: 'Leading exhibition stand builders across Austria. Custom trade show displays, booth design, and professional exhibition services.',
    description: 'Austria is a major hub for international trade shows and exhibitions, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Austria\'s dynamic exhibition landscape.',
    heroContent: 'Partner with Austria\'s premier exhibition stand builders for trade show success across the country.',
    seoKeywords: ['Austria exhibition stands', 'Austria trade show builders', 'Austria exhibition builders', 'Austria booth design', 'Austria exhibition services']
  };
  
  const countryBlock = cmsContent?.sections?.countryPages?.at || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Austria"
        initialBuilders={[]}
        initialContent={mergedContent}
        cmsContent={cmsContent}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}