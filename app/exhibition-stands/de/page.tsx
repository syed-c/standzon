import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';
import { getServerSupabase } from '@/lib/supabase';

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
  return {
    title: `Exhibition Stand Builders in Germany | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Germany. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Germany`, `booth builders Germany`, `trade show displays Germany`, `Germany exhibition builders`, `Germany booth design`, `Germany exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Germany`,
      description: `Professional exhibition stand builders across Germany. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Germany`,
      description: `Professional exhibition stand builders across Germany. Custom trade show displays and booth design services.`,
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