import { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountryCityPage from '@/components/CountryCityPage';
import { getServerSupabase } from '@/lib/supabase';



// ✅ FIX: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';// Fetch CMS content for the New Zealand page
async function getNewZealandPageContent() {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log('🔍 Server-side: Fetching CMS data for New Zealand...');
      
      const result = await sb
        .from('page_contents')
        .select('content')
        .eq('id', 'nz')
        .single();
        
      if (result.error) {
        console.log('❌ Server-side: Supabase error:', result.error);
        return null;
      }
      
      if (result.data?.content) {
        console.log('✅ Server-side: Found CMS data for New Zealand');
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
    title: `Exhibition Stand Builders in New Zealand | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across New Zealand. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands New Zealand`, `booth builders New Zealand`, `trade show displays New Zealand`, `New Zealand exhibition builders`, `New Zealand booth design`, `New Zealand exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in New Zealand`,
      description: `Professional exhibition stand builders across New Zealand. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in New Zealand`,
      description: `Professional exhibition stand builders across New Zealand. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/nz`,
    },
  };
}

export default async function NewZealandPage() {
  console.log('🇳🇿 Loading New Zealand page with modern UI...');
  
  const cmsContent = await getNewZealandPageContent();
  
  const defaultContent = {
    id: 'nz-main',
    title: 'Exhibition Stand Builders in New Zealand',
    metaTitle: 'New Zealand Exhibition Stand Builders | Trade Show Booth Design',
    metaDescription: 'Leading exhibition stand builders across New Zealand. Custom trade show displays, booth design, and professional exhibition services.',
    description: 'New Zealand is a major hub for international trade shows and exhibitions, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in New Zealand\'s dynamic exhibition landscape.',
    heroContent: 'Partner with New Zealand\'s premier exhibition stand builders for trade show success across the country.',
    seoKeywords: ['New Zealand exhibition stands', 'New Zealand trade show builders', 'New Zealand exhibition builders', 'New Zealand booth design', 'New Zealand exhibition services']
  };
  
  const countryBlock = cmsContent?.sections?.countryPages?.nz || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="New Zealand"
        initialBuilders={[]}
        initialContent={mergedContent}
        cmsContent={cmsContent}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}