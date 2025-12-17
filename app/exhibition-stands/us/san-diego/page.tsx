import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountryCityPage from '@/components/CountryCityPage';



// ✅ FIX: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in San Diego | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in San Diego, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands San Diego`, `booth builders San Diego`, `trade show displays San Diego`, `San Diego exhibition builders`, `San Diego booth design`, `San Diego exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in San Diego`,
      description: `Professional exhibition stand builders in San Diego, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in San Diego`,
      description: `Professional exhibition stand builders in San Diego, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/us/san-diego`,
    },
  };
}

export default async function SanDiegoPage() {
  console.log('🇺🇸 Loading San Diego page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="San Diego"
        initialBuilders={[]}
        initialContent={{
          id: 'us-san-diego',
          title: 'Exhibition Stand Builders in San Diego',
          metaTitle: 'San Diego Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in San Diego, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'San Diego is a major biotechnology and military hub in California, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in San Diego\'s dynamic exhibition landscape.',
          heroContent: 'Partner with San Diego\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['San Diego exhibition stands', 'San Diego trade show builders', 'San Diego exhibition builders', 'San Diego booth design', 'San Diego exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}