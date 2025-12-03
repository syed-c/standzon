import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';
import { getServerSupabase } from '@/lib/supabase';

// Fetch CMS content for the Norway page
async function getNorwayPageContent() {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log('🔍 Server-side: Fetching CMS data for Norway...');
      
      const result = await sb
        .from('page_contents')
        .select('content')
        .eq('id', 'no')
        .single();
        
      if (result.error) {
        console.log('❌ Server-side: Supabase error:', result.error);
        return null;
      }
      
      if (result.data?.content) {
        console.log('✅ Server-side: Found CMS data for Norway');
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
    title: `Exhibition Stand Builders in Norway | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Norway. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Norway`, `booth builders Norway`, `trade show displays Norway`, `Norway exhibition builders`, `Norway booth design`, `Norway exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Norway`,
      description: `Professional exhibition stand builders across Norway. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Norway`,
      description: `Professional exhibition stand builders across Norway. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/no`,
    },
  };
}

export default async function NorwayPage() {
  console.log('🇳🇴 Loading Norway page with modern UI...');
  
  const cmsContent = await getNorwayPageContent();
  
  const defaultContent = {
    id: 'no-main',
    title: 'Exhibition Stand Builders in Norway',
    metaTitle: 'Norway Exhibition Stand Builders | Trade Show Booth Design',
    metaDescription: 'Leading exhibition stand builders across Norway. Custom trade show displays, booth design, and professional exhibition services.',
    description: 'Norway is a major hub for international trade shows and exhibitions, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Norway\'s dynamic exhibition landscape.',
    heroContent: 'Partner with Norway\'s premier exhibition stand builders for trade show success across the country.',
    seoKeywords: ['Norway exhibition stands', 'Norway trade show builders', 'Norway exhibition builders', 'Norway booth design', 'Norway exhibition services']
  };
  
  const countryBlock = cmsContent?.sections?.countryPages?.no || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Norway"
        initialBuilders={[]}
        initialContent={mergedContent}
        cmsContent={cmsContent}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}