import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountryCityPage from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Glasgow | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Glasgow, UK. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Glasgow`, `booth builders Glasgow`, `trade show displays Glasgow`, `Glasgow exhibition builders`, `Glasgow booth design`, `Glasgow exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Glasgow`,
      description: `Professional exhibition stand builders in Glasgow, UK. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Glasgow`,
      description: `Professional exhibition stand builders in Glasgow, UK. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/gb/glasgow`,
    },
  };
}

export default async function GlasgowPage() {
  console.log('🇬🇧 Loading Glasgow page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United Kingdom"
        city="Glasgow"
        initialBuilders={[]}
        initialContent={{
          id: 'gb-glasgow',
          title: 'Exhibition Stand Builders in Glasgow',
          metaTitle: 'Glasgow Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Glasgow, UK. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Glasgow is a major cultural and trade center in Scotland, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Glasgow\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Glasgow\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Glasgow exhibition stands', 'Glasgow trade show builders', 'Glasgow exhibition builders', 'Glasgow booth design', 'Glasgow exhibition services', 'UK trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
