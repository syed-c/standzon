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

// Fetch CMS content for the Germany page
async function getGermanyPageContent() {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log('🔍 Server-side: Fetching CMS data for Germany...');
      
      const result = await sb
        .from('page_contents')
        .select('content')
        .eq('id', 'de')
        .single();
        
      if (result.error) {
        console.log('❌ Server-side: Supabase error:', result.error);
        return null;
      }
      
      if (result.data?.content) {
        console.log('✅ Server-side: Found CMS data for Germany');
        return result.data.content;
      }
    }
  } catch (error) {
    console.error('❌ Server-side: Error fetching CMS data:', error);
  }
  
  return null;
}

export async function generateMetadata(): Promise<Metadata> {
  // Try to fetch CMS content for metadata
  let cmsMetadata = null;
  try {
    const cmsContent = await getGermanyPageContent();
    if (cmsContent) {
      const seo = cmsContent.seo || {};
      const hero = cmsContent.hero || {};
      
      cmsMetadata = {
        title: seo.metaTitle || hero.title || `Exhibition Stand Builders in Germany | Professional Trade Show Displays`,
        description: seo.metaDescription || `Find professional exhibition stand builders across Germany. Custom trade show displays, booth design, and comprehensive exhibition services.`,
        keywords: seo.keywords || [`exhibition stands Germany`, `booth builders Germany`, `trade show displays Germany`, `Germany exhibition builders`, `Germany booth design`, `Germany exhibition stands`],
      };
    }
  } catch (error) {
    console.error('❌ Error fetching CMS metadata:', error);
  }
  
  // Use CMS metadata if available, otherwise fall back to default
  const title = cmsMetadata?.title || `Exhibition Stand Builders in Germany | Professional Trade Show Displays`;
  const description = cmsMetadata?.description || `Find professional exhibition stand builders across Germany. Custom trade show displays, booth design, and comprehensive exhibition services.`;
  const keywords = cmsMetadata?.keywords || [`exhibition stands Germany`, `booth builders Germany`, `trade show displays Germany`, `Germany exhibition builders`, `Germany booth design`, `Germany exhibition stands`];
  
  return {
    title,
    description,
    keywords,
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
      title,
      description,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/de`,
    },
  };
}

export default async function GermanyPage() {
  console.log('🇩🇪 Loading Germany page with modern UI...');
  
  const cmsContent = await getGermanyPageContent();
  
  const defaultContent = {
    id: 'de-main',
    title: 'Exhibition Stand Builders in Germany',
    metaTitle: 'Germany Exhibition Stand Builders | Trade Show Booth Design',
    metaDescription: 'Leading exhibition stand builders across Germany. Custom trade show displays, booth design, and professional exhibition services.',
    description: 'Germany is a major hub for international trade shows and exhibitions, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Germany\'s dynamic exhibition landscape.',
    heroContent: 'Partner with Germany\'s premier exhibition stand builders for trade show success across the country.',
    seoKeywords: ['Germany exhibition stands', 'Germany trade show builders', 'Germany exhibition builders', 'Germany booth design', 'Germany exhibition services']
  };
  
  const countryBlock = cmsContent?.sections?.countryPages?.de || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Germany"
        initialBuilders={[]}
        initialContent={mergedContent}
        cmsContent={cmsContent}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}