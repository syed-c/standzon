import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountryCityPage from '@/components/CountryCityPage';
import { getServerSupabase } from '@/lib/supabase';



// ✅ FIX: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';// Fetch CMS content for the Finland page
async function getFinlandPageContent() {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log('🔍 Server-side: Fetching CMS data for Finland...');
      
      const result = await sb
        .from('page_contents')
        .select('content')
        .eq('id', 'fi')
        .single();
        
      if (result.error) {
        console.log('❌ Server-side: Supabase error:', result.error);
        return null;
      }
      
      if (result.data?.content) {
        console.log('✅ Server-side: Found CMS data for Finland');
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
    title: `Exhibition Stand Builders in Finland | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Finland. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Finland`, `booth builders Finland`, `trade show displays Finland`, `Finland exhibition builders`, `Finland booth design`, `Finland exhibition stands`],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: `Exhibition Stand Builders in Finland`,
      description: `Professional exhibition stand builders across Finland. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Finland`,
      description: `Professional exhibition stand builders across Finland. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/fi`,
    },
  };
}

export default async function FinlandPage() {
  console.log('🇫🇮 Loading Finland page with modern UI...');
  
  const cmsContent = await getFinlandPageContent();
  
  const defaultContent = {
    id: 'fi-main',
    title: 'Exhibition Stand Builders in Finland',
    metaTitle: 'Finland Exhibition Stand Builders | Trade Show Booth Design',
    metaDescription: 'Leading exhibition stand builders across Finland. Custom trade show displays, booth design, and professional exhibition services.',
    description: 'Finland is a major hub for international trade shows and exhibitions, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Finland\'s dynamic exhibition landscape.',
    heroContent: 'Partner with Finland\'s premier exhibition stand builders for trade show success across the country.',
    seoKeywords: ['Finland exhibition stands', 'Finland trade show builders', 'Finland exhibition builders', 'Finland booth design', 'Finland exhibition services']
  };
  
  const countryBlock = cmsContent?.sections?.countryPages?.fi || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Finland"
        initialBuilders={[]}
        initialContent={mergedContent}
        cmsContent={cmsContent}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}