import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountryCityPage from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Berlin | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Berlin, Germany. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Berlin`, `booth builders Berlin`, `trade show displays Berlin`, `Berlin exhibition builders`, `Berlin booth design`, `Berlin exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Berlin`,
      description: `Professional exhibition stand builders in Berlin, Germany. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Berlin`,
      description: `Professional exhibition stand builders in Berlin, Germany. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/de/berlin`,
    },
  };
}

export default async function BerlinPage() {
  console.log('🇩🇪 Loading Berlin page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Germany"
        city="Berlin"
        initialBuilders={[]}
        initialContent={{
          id: 'de-berlin',
          title: 'Exhibition Stand Builders in Berlin',
          metaTitle: 'Berlin Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Berlin, Germany. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Berlin is the capital and major trade center of Germany, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Berlin\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Berlin\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Berlin exhibition stands', 'Berlin trade show builders', 'Berlin exhibition builders', 'Berlin booth design', 'Berlin exhibition services', 'Germany trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
