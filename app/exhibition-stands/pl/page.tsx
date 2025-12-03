import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';
import { getServerSupabase } from '@/lib/supabase';

// Fetch CMS content for the Poland page
async function getPolandPageContent() {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log('🔍 Server-side: Fetching CMS data for Poland...');
      
      const result = await sb
        .from('page_contents')
        .select('content')
        .eq('id', 'pl')
        .single();
        
      if (result.error) {
        console.log('❌ Server-side: Supabase error:', result.error);
        return null;
      }
      
      if (result.data?.content) {
        console.log('✅ Server-side: Found CMS data for Poland');
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
    title: `Exhibition Stand Builders in Poland | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Poland. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Poland`, `booth builders Poland`, `trade show displays Poland`, `Poland exhibition builders`, `Poland booth design`, `Poland exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Poland`,
      description: `Professional exhibition stand builders across Poland. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Poland`,
      description: `Professional exhibition stand builders across Poland. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/pl`,
    },
  };
}

export default async function PolandPage() {
  console.log('🇵🇱 Loading Poland page with modern UI...');
  
  const cmsContent = await getPolandPageContent();
  
  const defaultContent = {
    id: 'pl-main',
    title: 'Exhibition Stand Builders in Poland',
    metaTitle: 'Poland Exhibition Stand Builders | Trade Show Booth Design',
    metaDescription: 'Leading exhibition stand builders across Poland. Custom trade show displays, booth design, and professional exhibition services.',
    description: 'Poland is a major hub for international trade shows and exhibitions, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Poland\'s dynamic exhibition landscape.',
    heroContent: 'Partner with Poland\'s premier exhibition stand builders for trade show success across the country.',
    seoKeywords: ['Poland exhibition stands', 'Poland trade show builders', 'Poland exhibition builders', 'Poland booth design', 'Poland exhibition services']
  };
  
  const countryBlock = cmsContent?.sections?.countryPages?.pl || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Poland"
        initialBuilders={[]}
        initialContent={mergedContent}
        cmsContent={cmsContent}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}