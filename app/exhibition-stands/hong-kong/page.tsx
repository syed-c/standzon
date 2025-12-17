import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountryCityPage from '@/components/CountryCityPage';
import { getServerSupabase } from '@/lib/supabase';



// ✅ FIX: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';// Fetch CMS content for the Hong Kong page
async function getHongKongPageContent() {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log('🔍 Server-side: Fetching CMS data for Hong Kong...');
      
      const result = await sb
        .from('page_contents')
        .select('content')
        .eq('id', 'hong-kong')
        .single();
        
      if (result.error) {
        console.log('❌ Server-side: Supabase error:', result.error);
        return null;
      }
      
      if (result.data?.content) {
        console.log('✅ Server-side: Found CMS data for Hong Kong');
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
    title: `Exhibition Stand Builders in Hong Kong | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Hong Kong. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Hong Kong`, `booth builders Hong Kong`, `trade show displays Hong Kong`, `Hong Kong exhibition builders`, `Hong Kong booth design`, `Hong Kong exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Hong Kong`,
      description: `Professional exhibition stand builders across Hong Kong. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Hong Kong`,
      description: `Professional exhibition stand builders across Hong Kong. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/hong-kong`,
    },
  };
}

export default async function HongKongPage() {
  console.log('🇭🇰 Loading Hong Kong page with modern UI...');
  
  const cmsContent = await getHongKongPageContent();
  
  const defaultContent = {
    id: 'hong-kong-main',
    title: 'Exhibition Stand Builders in Hong Kong',
    metaTitle: 'Hong Kong Exhibition Stand Builders | Trade Show Booth Design',
    metaDescription: 'Leading exhibition stand builders across Hong Kong. Custom trade show displays, booth design, and professional exhibition services.',
    description: 'Hong Kong is a major international business hub and exhibition center, hosting world-class trade shows and exhibitions. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Hong Kong\'s dynamic exhibition landscape.',
    heroContent: 'Partner with Hong Kong\'s premier exhibition stand builders for trade show success across the city.',
    seoKeywords: ['Hong Kong exhibition stands', 'Hong Kong trade show builders', 'Hong Kong exhibition builders', 'Hong Kong booth design', 'Hong Kong exhibition services']
  };
  
  const countryBlock = cmsContent?.sections?.countryPages?.hongKong || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Hong Kong"
        initialBuilders={[]}
        initialContent={mergedContent}
        cmsContent={cmsContent}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
