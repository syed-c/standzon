import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountryCityPage from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Tallahassee | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Tallahassee, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Tallahassee`, `booth builders Tallahassee`, `trade show displays Tallahassee`, `Tallahassee exhibition builders`, `Tallahassee booth design`, `Tallahassee exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Tallahassee`,
      description: `Professional exhibition stand builders in Tallahassee, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Tallahassee`,
      description: `Professional exhibition stand builders in Tallahassee, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/us/tallahassee`,
    },
  };
}

export default async function TallahasseePage() {
  console.log('🇺🇸 Loading Tallahassee page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="Tallahassee"
        initialBuilders={[]}
        initialContent={{
          id: 'us-tallahassee',
          title: 'Exhibition Stand Builders in Tallahassee',
          metaTitle: 'Tallahassee Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Tallahassee, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Tallahassee is the capital of Florida and a major educational hub, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Tallahassee\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Tallahassee\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Tallahassee exhibition stands', 'Tallahassee trade show builders', 'Tallahassee exhibition builders', 'Tallahassee booth design', 'Tallahassee exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}