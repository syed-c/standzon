import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountryCityPage from '@/components/CountryCityPage';
import { getServerSupabase } from '@/lib/supabase';



// ✅ FIX: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';// Fetch CMS content for the Denmark page
async function getDenmarkPageContent() {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log('🔍 Server-side: Fetching CMS data for Denmark...');
      
      const result = await sb
        .from('page_contents')
        .select('content')
        .eq('id', 'dk')
        .single();
        
      if (result.error) {
        console.log('❌ Server-side: Supabase error:', result.error);
        return null;
      }
      
      if (result.data?.content) {
        console.log('✅ Server-side: Found CMS data for Denmark');
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
    title: `Exhibition Stand Builders in Denmark | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Denmark. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Denmark`, `booth builders Denmark`, `trade show displays Denmark`, `Denmark exhibition builders`, `Denmark booth design`, `Denmark exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Denmark`,
      description: `Professional exhibition stand builders across Denmark. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Denmark`,
      description: `Professional exhibition stand builders across Denmark. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/dk`,
    },
  };
}

export default async function DenmarkPage() {
  console.log('🇩🇰 Loading Denmark page with modern UI...');
  
  const cmsContent = await getDenmarkPageContent();
  
  const defaultContent = {
    id: 'dk-main',
    title: 'Exhibition Stand Builders in Denmark',
    metaTitle: 'Denmark Exhibition Stand Builders | Trade Show Booth Design',
    metaDescription: 'Leading exhibition stand builders across Denmark. Custom trade show displays, booth design, and professional exhibition services.',
    description: 'Denmark is a major hub for international trade shows and exhibitions, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Denmark\'s dynamic exhibition landscape.',
    heroContent: 'Partner with Denmark\'s premier exhibition stand builders for trade show success across the country.',
    seoKeywords: ['Denmark exhibition stands', 'Denmark trade show builders', 'Denmark exhibition builders', 'Denmark booth design', 'Denmark exhibition services']
  };
  
  const countryBlock = cmsContent?.sections?.countryPages?.dk || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Denmark"
        initialBuilders={[]}
        initialContent={mergedContent}
        cmsContent={cmsContent}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}