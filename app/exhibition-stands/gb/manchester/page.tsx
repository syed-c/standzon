import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountryCityPage from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Manchester | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Manchester, UK. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Manchester`, `booth builders Manchester`, `trade show displays Manchester`, `Manchester exhibition builders`, `Manchester booth design`, `Manchester exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Manchester`,
      description: `Professional exhibition stand builders in Manchester, UK. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Manchester`,
      description: `Professional exhibition stand builders in Manchester, UK. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/gb/manchester`,
    },
  };
}

export default async function ManchesterPage() {
  console.log('🇬🇧 Loading Manchester page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United Kingdom"
        city="Manchester"
        initialBuilders={[]}
        initialContent={{
          id: 'gb-manchester',
          title: 'Exhibition Stand Builders in Manchester',
          metaTitle: 'Manchester Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Manchester, UK. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Manchester is a major industrial and trade center in the United Kingdom, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Manchester\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Manchester\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Manchester exhibition stands', 'Manchester trade show builders', 'Manchester exhibition builders', 'Manchester booth design', 'Manchester exhibition services', 'UK trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
