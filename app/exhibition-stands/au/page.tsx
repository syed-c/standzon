import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';
import { getServerSupabase } from '@/lib/supabase';

// Fetch CMS content for the Australia page
async function getAustraliaPageContent() {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log('🔍 Server-side: Fetching CMS data for Australia...');
      
      const result = await sb
        .from('page_contents')
        .select('content')
        .eq('id', 'au')
        .single();
        
      if (result.error) {
        console.log('❌ Server-side: Supabase error:', result.error);
        return null;
      }
      
      if (result.data?.content) {
        console.log('✅ Server-side: Found CMS data for Australia');
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
    title: `Exhibition Stand Builders in Australia | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Australia. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Australia`, `booth builders Australia`, `trade show displays Australia`, `Australia exhibition builders`, `Australia booth design`, `Australia exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Australia`,
      description: `Professional exhibition stand builders across Australia. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Australia`,
      description: `Professional exhibition stand builders across Australia. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/au`,
    },
  };
}

export default async function AustraliaPage() {
  console.log('🇦🇺 Loading Australia page with modern UI...');
  
  const cmsContent = await getAustraliaPageContent();
  
  const defaultContent = {
    id: 'au-main',
    title: 'Exhibition Stand Builders in Australia',
    metaTitle: 'Australia Exhibition Stand Builders | Trade Show Booth Design',
    metaDescription: 'Leading exhibition stand builders across Australia. Custom trade show displays, booth design, and professional exhibition services.',
    description: 'Australia is a major hub for international trade shows and exhibitions, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Australia\'s dynamic exhibition landscape.',
    heroContent: 'Partner with Australia\'s premier exhibition stand builders for trade show success across the country.',
    seoKeywords: ['Australia exhibition stands', 'Australia trade show builders', 'Australia exhibition builders', 'Australia booth design', 'Australia exhibition services']
  };
  
  const countryBlock = cmsContent?.sections?.countryPages?.au || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Australia"
        initialBuilders={[]}
        initialContent={mergedContent}
        cmsContent={cmsContent}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}