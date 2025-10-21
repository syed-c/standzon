import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Taiwan | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Taiwan. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Taiwan`, `booth builders Taiwan`, `trade show displays Taiwan`, `Taiwan exhibition builders`, `Taiwan booth design`, `Taiwan exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Taiwan`,
      description: `Professional exhibition stand builders across Taiwan. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Taiwan`,
      description: `Professional exhibition stand builders across Taiwan. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/tw`,
    },
  };
}

export default async function TaiwanPage() {
  console.log('🇹🇼 Loading Taiwan page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Taiwan"
        initialBuilders={[]}
        initialContent={{
          id: 'tw-main',
          title: 'Exhibition Stand Builders in Taiwan',
          metaTitle: 'Taiwan Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders across Taiwan. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Taiwan is a thriving center for innovation and trade shows in East Asia, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Taiwan\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Taiwan\'s premier exhibition stand builders for trade show success across the country.',
          seoKeywords: ['Taiwan exhibition stands', 'Taiwan trade show builders', 'Taiwan exhibition builders', 'Taiwan booth design', 'Taiwan exhibition services', 'East Asia trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
