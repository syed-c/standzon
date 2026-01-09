import type { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import ServicesPageContent from '@/components/ServicesPageContent';
import { getServerSupabase } from '@/lib/supabase';

export async function generateMetadata(): Promise<Metadata> {
  // Try to fetch CMS content for metadata
  let cmsMetadata = null;
  try {
    const sb = getServerSupabase();
    if (sb) {
      const result = await sb
        .from('page_contents')
        .select('content')
        .eq('id', 'services')
        .single();
        
      if (!result.error && result.data?.content) {
        const content = result.data.content;
        const seo = content.seo || {};
        
        cmsMetadata = {
          title: seo.metaTitle || 'Exhibition Stand Services - Custom Design & Construction | StandsZone',
          description: seo.metaDescription || 'Professional exhibition stand services including custom design, construction, installation, and project management. Get quotes from verified builders worldwide.',
        };
      }
    }
  } catch (error) {
    console.error('❌ Error fetching CMS metadata:', error);
  }
  
  // Use CMS metadata if available, otherwise fall back to default
  const title = cmsMetadata?.title || 'Exhibition Stand Services - Custom Design & Construction | StandsZone';
  const description = cmsMetadata?.description || 'Professional exhibition stand services including custom design, construction, installation, and project management. Get quotes from verified builders worldwide.';
  
  return {
    title,
    description,
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
      images: [{ url: '/og-image.jpg' }],
    },
    alternates: {
      canonical: 'https://standszone.com/services',
    },
  };
}


export default function ServicesPage() {
  return (
    <ServicesPageContent />
  );
}