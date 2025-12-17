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
    title: `Exhibition Stand Builders in Vijfhuizen | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Vijfhuizen, Netherlands. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Vijfhuizen`, `booth builders Vijfhuizen`, `trade show displays Vijfhuizen`, `Vijfhuizen exhibition builders`, `Vijfhuizen booth design`, `Vijfhuizen exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Vijfhuizen`,
      description: `Professional exhibition stand builders in Vijfhuizen, Netherlands. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Vijfhuizen`,
      description: `Professional exhibition stand builders in Vijfhuizen, Netherlands. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/nl/vijfhuizen`,
    },
  };
}

export default async function VijfhuizenPage() {
  console.log('🇳🇱 Loading Vijfhuizen page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Netherlands"
        city="Vijfhuizen"
        initialBuilders={[]}
        initialContent={{
          id: 'nl-vijfhuizen',
          title: 'Exhibition Stand Builders in Vijfhuizen',
          metaTitle: 'Vijfhuizen Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Vijfhuizen, Netherlands. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Vijfhuizen is a growing trade center in Netherlands, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Vijfhuizen\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Vijfhuizen\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Vijfhuizen exhibition stands', 'Vijfhuizen trade show builders', 'Vijfhuizen exhibition builders', 'Vijfhuizen booth design', 'Vijfhuizen exhibition services', 'Netherlands trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}