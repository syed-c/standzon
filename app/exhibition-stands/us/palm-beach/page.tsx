import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountryCityPage from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Palm Beach | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Palm Beach, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Palm Beach`, `booth builders Palm Beach`, `trade show displays Palm Beach`, `Palm Beach exhibition builders`, `Palm Beach booth design`, `Palm Beach exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Palm Beach`,
      description: `Professional exhibition stand builders in Palm Beach, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Palm Beach`,
      description: `Professional exhibition stand builders in Palm Beach, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/us/palm-beach`,
    },
  };
}

export default async function PalmBeachPage() {
  console.log('🇺🇸 Loading Palm Beach page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="Palm Beach"
        initialBuilders={[]}
        initialContent={{
          id: 'us-palm-beach',
          title: 'Exhibition Stand Builders in Palm Beach',
          metaTitle: 'Palm Beach Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Palm Beach, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Palm Beach is a luxury destination and affluent community in Florida, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Palm Beach\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Palm Beach\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Palm Beach exhibition stands', 'Palm Beach trade show builders', 'Palm Beach exhibition builders', 'Palm Beach booth design', 'Palm Beach exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}