import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountryCityPage from '@/components/CountryCityPage';
import { getServerSupabase } from '@/lib/supabase';

// Fetch CMS content for the Vietnam page
async function getVietnamPageContent() {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log('🔍 Server-side: Fetching CMS data for Vietnam...');
      
      const result = await sb
        .from('page_contents')
        .select('content')
        .eq('id', 'vn')
        .single();
        
      if (result.error) {
        console.log('❌ Server-side: Supabase error:', result.error);
        return null;
      }
      
      if (result.data?.content) {
        console.log('✅ Server-side: Found CMS data for Vietnam');
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
    title: `Exhibition Stand Builders in Vietnam | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Vietnam. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Vietnam`, `booth builders Vietnam`, `trade show displays Vietnam`, `Vietnam exhibition builders`, `Vietnam booth design`, `Vietnam exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Vietnam`,
      description: `Professional exhibition stand builders across Vietnam. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Vietnam`,
      description: `Professional exhibition stand builders across Vietnam. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/vn`,
    },
  };
}

export default async function VietnamPage() {
  console.log('🇻🇳 Loading Vietnam page with modern UI...');
  
  const cmsContent = await getVietnamPageContent();
  
  const defaultContent = {
    id: 'vn-main',
    title: 'Exhibition Stand Builders in Vietnam',
    metaTitle: 'Vietnam Exhibition Stand Builders | Trade Show Booth Design',
    metaDescription: 'Leading exhibition stand builders across Vietnam. Custom trade show displays, booth design, and professional exhibition services.',
    description: 'Vietnam is a major hub for international trade shows and exhibitions, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Vietnam\'s dynamic exhibition landscape.',
    heroContent: 'Partner with Vietnam\'s premier exhibition stand builders for trade show success across the country.',
    seoKeywords: ['Vietnam exhibition stands', 'Vietnam trade show builders', 'Vietnam exhibition builders', 'Vietnam booth design', 'Vietnam exhibition services']
  };
  
  const countryBlock = cmsContent?.sections?.countryPages?.vn || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Vietnam"
        initialBuilders={[]}
        initialContent={mergedContent}
        cmsContent={cmsContent}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}