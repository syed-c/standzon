import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Boston | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Boston, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Boston`, `booth builders Boston`, `trade show displays Boston`, `Boston exhibition builders`, `Boston booth design`, `Boston exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Boston`,
      description: `Professional exhibition stand builders in Boston, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Boston`,
      description: `Professional exhibition stand builders in Boston, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/us/boston`,
    },
  };
}

export default async function BostonPage() {
  console.log('🇺🇸 Loading Boston page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="Boston"
        initialBuilders={[]}
        initialContent={{
          id: 'us-boston',
          title: 'Exhibition Stand Builders in Boston',
          metaTitle: 'Boston Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Boston, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Boston is a historic city and major educational hub in Massachusetts, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Boston\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Boston\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Boston exhibition stands', 'Boston trade show builders', 'Boston exhibition builders', 'Boston booth design', 'Boston exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}