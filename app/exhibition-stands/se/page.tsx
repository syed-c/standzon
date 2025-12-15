import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountryCityPage from '@/components/CountryCityPage';
import { getServerSupabase } from '@/lib/supabase';

// Fetch CMS content for the Sweden page
async function getSwedenPageContent() {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log('🔍 Server-side: Fetching CMS data for Sweden...');
      
      const result = await sb
        .from('page_contents')
        .select('content')
        .eq('id', 'se')
        .single();
        
      if (result.error) {
        console.log('❌ Server-side: Supabase error:', result.error);
        return null;
      }
      
      if (result.data?.content) {
        console.log('✅ Server-side: Found CMS data for Sweden');
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
    title: `Exhibition Stand Builders in Sweden | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Sweden. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Sweden`, `booth builders Sweden`, `trade show displays Sweden`, `Sweden exhibition builders`, `Sweden booth design`, `Sweden exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Sweden`,
      description: `Professional exhibition stand builders across Sweden. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Sweden`,
      description: `Professional exhibition stand builders across Sweden. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/se`,
    },
  };
}

export default async function SwedenPage() {
  console.log('🇸🇪 Loading Sweden page with modern UI...');
  
  const cmsContent = await getSwedenPageContent();
  
  const defaultContent = {
    id: 'se-main',
    title: 'Exhibition Stand Builders in Sweden',
    metaTitle: 'Sweden Exhibition Stand Builders | Trade Show Booth Design',
    metaDescription: 'Leading exhibition stand builders across Sweden. Custom trade show displays, booth design, and professional exhibition services.',
    description: 'Sweden is a major hub for international trade shows and exhibitions, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Sweden\'s dynamic exhibition landscape.',
    heroContent: 'Partner with Sweden\'s premier exhibition stand builders for trade show success across the country.',
    seoKeywords: ['Sweden exhibition stands', 'Sweden trade show builders', 'Sweden exhibition builders', 'Sweden booth design', 'Sweden exhibition services']
  };
  
  const countryBlock = cmsContent?.sections?.countryPages?.se || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Sweden"
        initialBuilders={[]}
        initialContent={mergedContent}
        cmsContent={cmsContent}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}