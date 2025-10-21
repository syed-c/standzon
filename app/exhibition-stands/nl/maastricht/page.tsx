import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Maastricht | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Maastricht, Netherlands. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Maastricht`, `booth builders Maastricht`, `trade show displays Maastricht`, `Maastricht exhibition builders`, `Maastricht booth design`, `Maastricht exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Maastricht`,
      description: `Professional exhibition stand builders in Maastricht, Netherlands. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Maastricht`,
      description: `Professional exhibition stand builders in Maastricht, Netherlands. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/nl/maastricht`,
    },
  };
}

export default async function MaastrichtPage() {
  console.log('🇳🇱 Loading Maastricht page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Netherlands"
        city="Maastricht"
        initialBuilders={[]}
        initialContent={{
          id: 'nl-maastricht',
          title: 'Exhibition Stand Builders in Maastricht',
          metaTitle: 'Maastricht Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Maastricht, Netherlands. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Maastricht is a major cultural and trade center in Netherlands, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Maastricht\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Maastricht\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Maastricht exhibition stands', 'Maastricht trade show builders', 'Maastricht exhibition builders', 'Maastricht booth design', 'Maastricht exhibition services', 'Netherlands trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}