import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/client/Navigation';
import Footer from '@/components/client/Footer';
import WhatsAppFloat from '@/components/client/WhatsAppFloat';
import CountryCityPage from '@/components/client/CountryCityPage';



// ✅ FIX: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Long Beach | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Long Beach, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Long Beach`, `booth builders Long Beach`, `trade show displays Long Beach`, `Long Beach exhibition builders`, `Long Beach booth design`, `Long Beach exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Long Beach`,
      description: `Professional exhibition stand builders in Long Beach, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Long Beach`,
      description: `Professional exhibition stand builders in Long Beach, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/us/long-beach`,
    },
  };
}

export default async function LongBeachPage() {
  console.log('🇺🇸 Loading Long Beach page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="Long Beach"
        initialBuilders={[]}
        initialContent={{
          id: 'us-long-beach',
          title: 'Exhibition Stand Builders in Long Beach',
          metaTitle: 'Long Beach Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Long Beach, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Long Beach is a major port city in California, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Long Beach\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Long Beach\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Long Beach exhibition stands', 'Long Beach trade show builders', 'Long Beach exhibition builders', 'Long Beach booth design', 'Long Beach exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}