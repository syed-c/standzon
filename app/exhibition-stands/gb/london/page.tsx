import { Metadata } from 'next';
import CountryCityPage  from '@/components/CountryCityPage';
import { getServerSupabase } from '@/lib/supabase';

// ✅ FIX #1: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  // Try to fetch CMS content for metadata
  let cmsMetadata = null;
  try {
    // Import the Supabase helper function
    const { getServerSupabase } = await import('@/lib/supabase');
    const sb = getServerSupabase();
    
    if (sb) {
      const cityPageId = `united-kingdom-london`;
      
      const result = await sb
        .from('page_contents')
        .select('content')
        .eq('id', cityPageId)
        .single();
        
      if (!result.error && result.data?.content) {
        const content = result.data.content;
        const seo = content.seo || {};
        const hero = content.hero || {};
        
        cmsMetadata = {
          title: seo.metaTitle || hero.title || `Exhibition Stand Builders in London | Professional Trade Show Displays`,
          description: seo.metaDescription || `Find professional exhibition stand builders in London, UK. Custom trade show displays, booth design, and comprehensive exhibition services.`,
          keywords: seo.keywords || [`exhibition stands London`, `booth builders London`, `trade show displays London`, `London exhibition builders`, `London booth design`, `London exhibition stands`],
        };
      }
    }
  } catch (error) {
    console.error('❌ Error fetching CMS metadata:', error);
  }
  
  // Use CMS metadata if available, otherwise fall back to default
  const title = cmsMetadata?.title || `Exhibition Stand Builders in London | Professional Trade Show Displays`;
  const description = cmsMetadata?.description || `Find professional exhibition stand builders in London, UK. Custom trade show displays, booth design, and comprehensive exhibition services.`;
  const keywords = cmsMetadata?.keywords || [`exhibition stands London`, `booth builders London`, `trade show displays London`, `London exhibition builders`, `London booth design`, `London exhibition stands`];
  
  return {
    title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/gb/london`,
    },
  };
}

export default async function LondonPage() {
  console.log('🇬🇧 Loading London page with modern UI...');
  
  return (
    <div className="font-inter">
      <CountryCityPage
        country="United Kingdom"
        city="London"
        initialBuilders={[]}
        initialContent={{
          id: 'gb-london',
          title: 'Exhibition Stand Builders in London',
          metaTitle: 'London Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in London, UK. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'London is the capital and major trade center of the United Kingdom, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in London\'s dynamic exhibition landscape.',
          heroContent: 'Partner with London\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['London exhibition stands', 'London trade show builders', 'London exhibition builders', 'London booth design', 'London exhibition services', 'UK trade show displays']
        }}
      />
    </div>
  );
}
