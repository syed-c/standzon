import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';
import { getServerSupabase } from '@/lib/supabase';

// Fetch CMS content for the Lebanon page
async function getLebanonPageContent() {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log('🔍 Server-side: Fetching CMS data for Lebanon...');
      
      const result = await sb
        .from('page_contents')
        .select('content')
        .eq('id', 'lebanon')
        .single();
        
      if (result.error) {
        console.log('❌ Server-side: Supabase error:', result.error);
        return null;
      }
      
      if (result.data?.content) {
        console.log('✅ Server-side: Found CMS data for Lebanon');
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
    title: `Exhibition Stand Builders in Lebanon | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Lebanon. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Lebanon`, `booth builders Lebanon`, `trade show displays Lebanon`, `Lebanon exhibition builders`, `Lebanon booth design`, `Lebanon exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Lebanon`,
      description: `Professional exhibition stand builders across Lebanon. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Lebanon`,
      description: `Professional exhibition stand builders across Lebanon. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/lebanon`,
    },
  };
}

export default async function LebanonPage() {
  console.log('🇱🇧 Loading Lebanon page with modern UI...');
  
  const cmsContent = await getLebanonPageContent();
  
  const defaultContent = {
    id: 'lebanon-main',
    title: 'Exhibition Stand Builders in Lebanon',
    metaTitle: 'Lebanon Exhibition Stand Builders | Trade Show Booth Design',
    metaDescription: 'Leading exhibition stand builders across Lebanon. Custom trade show displays, booth design, and professional exhibition services.',
    description: 'Lebanon is a thriving center for innovation and trade shows in the Middle East, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Lebanon\'s dynamic exhibition landscape.',
    heroContent: 'Partner with Lebanon\'s premier exhibition stand builders for trade show success across the country.',
    seoKeywords: ['Lebanon exhibition stands', 'Lebanon trade show builders', 'Lebanon exhibition builders', 'Lebanon booth design', 'Lebanon exhibition services']
  };
  
  const countryBlock = cmsContent?.sections?.countryPages?.lebanon || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Lebanon"
        initialBuilders={[]}
        initialContent={mergedContent}
        cmsContent={cmsContent}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}