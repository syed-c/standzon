import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/client/Navigation';
import Footer from '@/components/client/Footer';
import WhatsAppFloat from '@/components/client/WhatsAppFloat';
import CountryCityPage from '@/components/client/CountryCityPage';



// ✅ FIX: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Pittsburgh | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Pittsburgh, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Pittsburgh`, `booth builders Pittsburgh`, `trade show displays Pittsburgh`, `Pittsburgh exhibition builders`, `Pittsburgh booth design`, `Pittsburgh exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Pittsburgh`,
      description: `Professional exhibition stand builders in Pittsburgh, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Pittsburgh`,
      description: `Professional exhibition stand builders in Pittsburgh, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/us/pittsburgh`,
    },
  };
}

export default async function PittsburghPage() {
  console.log('🇺🇸 Loading Pittsburgh page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="Pittsburgh"
        initialBuilders={[]}
        initialContent={{
          id: 'us-pittsburgh',
          title: 'Exhibition Stand Builders in Pittsburgh',
          metaTitle: 'Pittsburgh Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Pittsburgh, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Pittsburgh is a major technology and healthcare hub in Pennsylvania, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Pittsburgh\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Pittsburgh\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Pittsburgh exhibition stands', 'Pittsburgh trade show builders', 'Pittsburgh exhibition builders', 'Pittsburgh booth design', 'Pittsburgh exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}