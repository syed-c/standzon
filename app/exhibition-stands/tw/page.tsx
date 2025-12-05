import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';
import { getServerSupabase } from '@/lib/supabase';

// Fetch CMS content for the Taiwan page
async function getTaiwanPageContent() {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log('🔍 Server-side: Fetching CMS data for Taiwan...');
      
      const result = await sb
        .from('page_contents')
        .select('content')
        .eq('id', 'tw')
        .single();
        
      if (result.error) {
        console.log('❌ Server-side: Supabase error:', result.error);
        return null;
      }
      
      if (result.data?.content) {
        console.log('✅ Server-side: Found CMS data for Taiwan');
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
    title: `Exhibition Stand Builders in Taiwan | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Taiwan. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Taiwan`, `booth builders Taiwan`, `trade show displays Taiwan`, `Taiwan exhibition builders`, `Taiwan booth design`, `Taiwan exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Taiwan`,
      description: `Professional exhibition stand builders across Taiwan. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Taiwan`,
      description: `Professional exhibition stand builders across Taiwan. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/tw`,
    },
  };
}

export default async function TaiwanPage() {
  console.log('🇹🇼 Loading Taiwan page with modern UI...');
  
  const cmsContent = await getTaiwanPageContent();
  
  const defaultContent = {
    id: 'tw-main',
    title: 'Exhibition Stand Builders in Taiwan',
    metaTitle: 'Taiwan Exhibition Stand Builders | Trade Show Booth Design',
    metaDescription: 'Leading exhibition stand builders across Taiwan. Custom trade show displays, booth design, and professional exhibition services.',
    description: 'Taiwan is a major hub for international trade shows and exhibitions, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Taiwan\'s dynamic exhibition landscape.',
    heroContent: 'Partner with Taiwan\'s premier exhibition stand builders for trade show success across the country.',
    seoKeywords: ['Taiwan exhibition stands', 'Taiwan trade show builders', 'Taiwan exhibition builders', 'Taiwan booth design', 'Taiwan exhibition services']
  };
  
  const countryBlock = cmsContent?.sections?.countryPages?.tw || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Taiwan"
        initialBuilders={[]}
        initialContent={mergedContent}
        cmsContent={cmsContent}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}