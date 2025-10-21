import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in United Kingdom | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across United Kingdom. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands United Kingdom`, `booth builders United Kingdom`, `trade show displays United Kingdom`, `United Kingdom exhibition builders`, `United Kingdom booth design`, `United Kingdom exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in United Kingdom`,
      description: `Professional exhibition stand builders across United Kingdom. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in United Kingdom`,
      description: `Professional exhibition stand builders across United Kingdom. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/gb`,
    },
  };
}

export default async function UnitedKingdomPage() {
  console.log('🇬🇧 Loading United Kingdom page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United Kingdom"
        initialBuilders={[]}
        initialContent={{
          id: 'gb-main',
          title: 'Exhibition Stand Builders in United Kingdom',
          metaTitle: 'United Kingdom Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders across United Kingdom. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'United Kingdom is a thriving center for innovation and trade shows in the Europe, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in United Kingdom\'s dynamic exhibition landscape.',
          heroContent: 'Partner with United Kingdom\'s premier exhibition stand builders for trade show success across the country.',
          seoKeywords: ['United Kingdom exhibition stands', 'United Kingdom trade show builders', 'United Kingdom exhibition builders', 'United Kingdom booth design', 'United Kingdom exhibition services', 'Europe trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}