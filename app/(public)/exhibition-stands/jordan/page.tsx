import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/client/Navigation';
import Footer from '@/components/client/Footer';
import WhatsAppFloat from '@/components/client/WhatsAppFloat';
import CountryCityPage from '@/components/client/CountryCityPage';
import { getServerSupabase } from '@/lib/supabase';



// ✅ FIX: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';// Fetch CMS content for the Jordan page
async function getJordanPageContent() {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log('🔍 Server-side: Fetching CMS data for Jordan...');
      
      const result = await sb
        .from('page_contents')
        .select('content')
        .eq('id', 'jordan')
        .single();
        
      if (result.error) {
        console.log('❌ Server-side: Supabase error:', result.error);
        return null;
      }
      
      if (result.data?.content) {
        console.log('✅ Server-side: Found CMS data for Jordan');
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
    title: `Exhibition Stand Builders in Jordan | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Jordan. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Jordan`, `booth builders Jordan`, `trade show displays Jordan`, `Jordan exhibition builders`, `Jordan booth design`, `Jordan exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Jordan`,
      description: `Professional exhibition stand builders across Jordan. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Jordan`,
      description: `Professional exhibition stand builders across Jordan. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/jordan`,
    },
  };
}

export default async function JordanPage() {
  console.log('🇯🇴 Loading Jordan page with modern UI...');
  
  const cmsContent = await getJordanPageContent();
  
  const defaultContent = {
    id: 'jordan-main',
    title: 'Exhibition Stand Builders in Jordan',
    metaTitle: 'Jordan Exhibition Stand Builders | Trade Show Booth Design',
    metaDescription: 'Leading exhibition stand builders across Jordan. Custom trade show displays, booth design, and professional exhibition services.',
    description: 'Jordan is a thriving center for innovation and trade shows in the Middle East, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Jordan\'s dynamic exhibition landscape.',
    heroContent: 'Partner with Jordan\'s premier exhibition stand builders for trade show success across the country.',
    seoKeywords: ['Jordan exhibition stands', 'Jordan trade show builders', 'Jordan exhibition builders', 'Jordan booth design', 'Jordan exhibition services']
  };
  
  const countryBlock = cmsContent?.sections?.countryPages?.jordan || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Jordan"
        initialBuilders={[]}
        initialContent={mergedContent}
        cmsContent={cmsContent}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}