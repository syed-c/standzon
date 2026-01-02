import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/client/Navigation';
import Footer from '@/components/client/Footer';
import WhatsAppFloat from '@/components/client/WhatsAppFloat';
import CountryCityPage from '@/components/client/CountryCityPage';
import { getServerSupabase } from '@/lib/supabase';

// ✅ FIX #1: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';

// Fetch CMS content for the Spain page
async function getSpainPageContent() {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log('🔍 Server-side: Fetching CMS data for Spain...');
      
      const result = await sb
        .from('page_contents')
        .select('content')
        .eq('id', 'es')
        .single();
        
      if (result.error) {
        console.log('❌ Server-side: Supabase error:', result.error);
        return null;
      }
      
      if (result.data?.content) {
        console.log('✅ Server-side: Found CMS data for Spain');
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
    title: `Exhibition Stand Builders in Spain | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Spain. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Spain`, `booth builders Spain`, `trade show displays Spain`, `Spain exhibition builders`, `Spain booth design`, `Spain exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Spain`,
      description: `Professional exhibition stand builders across Spain. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Spain`,
      description: `Professional exhibition stand builders across Spain. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/es`,
    },
  };
}

export default async function SpainPage() {
  console.log('🇪🇸 Loading Spain page with modern UI...');
  
  const cmsContent = await getSpainPageContent();
  
  const defaultContent = {
    id: 'es-main',
    title: 'Exhibition Stand Builders in Spain',
    metaTitle: 'Spain Exhibition Stand Builders | Trade Show Booth Design',
    metaDescription: 'Leading exhibition stand builders across Spain. Custom trade show displays, booth design, and professional exhibition services.',
    description: 'Spain is a major hub for international trade shows and exhibitions, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Spain\'s dynamic exhibition landscape.',
    heroContent: 'Partner with Spain\'s premier exhibition stand builders for trade show success across the country.',
    seoKeywords: ['Spain exhibition stands', 'Spain trade show builders', 'Spain exhibition builders', 'Spain booth design', 'Spain exhibition services']
  };
  
  const countryBlock = cmsContent?.sections?.countryPages?.es || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Spain"
        initialBuilders={[]}
        initialContent={mergedContent}
        cmsContent={cmsContent}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}