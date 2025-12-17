import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountryCityPage from '@/components/CountryCityPage';
import { getServerSupabase } from '@/lib/supabase';



// ✅ FIX: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';// Fetch CMS content for the Israel page
async function getIsraelPageContent() {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log('🔍 Server-side: Fetching CMS data for Israel...');
      
      const result = await sb
        .from('page_contents')
        .select('content')
        .eq('id', 'israel')
        .single();
        
      if (result.error) {
        console.log('❌ Server-side: Supabase error:', result.error);
        return null;
      }
      
      if (result.data?.content) {
        console.log('✅ Server-side: Found CMS data for Israel');
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
    title: `Exhibition Stand Builders in Israel | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Israel. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Israel`, `booth builders Israel`, `trade show displays Israel`, `Israel exhibition builders`, `Israel booth design`, `Israel exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Israel`,
      description: `Professional exhibition stand builders across Israel. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Israel`,
      description: `Professional exhibition stand builders across Israel. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/israel`,
    },
  };
}

export default async function IsraelPage() {
  console.log('🇮🇱 Loading Israel page with modern UI...');
  
  const cmsContent = await getIsraelPageContent();
  
  const defaultContent = {
    id: 'israel-main',
    title: 'Exhibition Stand Builders in Israel',
    metaTitle: 'Israel Exhibition Stand Builders | Trade Show Booth Design',
    metaDescription: 'Leading exhibition stand builders across Israel. Custom trade show displays, booth design, and professional exhibition services.',
    description: 'Israel is a thriving center for innovation and trade shows in the Middle East, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Israel\'s dynamic exhibition landscape.',
    heroContent: 'Partner with Israel\'s premier exhibition stand builders for trade show success across the country.',
    seoKeywords: ['Israel exhibition stands', 'Israel trade show builders', 'Israel exhibition builders', 'Israel booth design', 'Israel exhibition services']
  };
  
  const countryBlock = cmsContent?.sections?.countryPages?.israel || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Israel"
        initialBuilders={[]}
        initialContent={mergedContent}
        cmsContent={cmsContent}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}