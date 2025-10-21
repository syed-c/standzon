import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Khon Kaen | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Khon Kaen, Thailand. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Khon Kaen`, `booth builders Khon Kaen`, `trade show displays Khon Kaen`, `Khon Kaen exhibition builders`, `Khon Kaen booth design`, `Khon Kaen exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Khon Kaen`,
      description: `Professional exhibition stand builders in Khon Kaen, Thailand. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Khon Kaen`,
      description: `Professional exhibition stand builders in Khon Kaen, Thailand. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/th/khon-kaen`,
    },
  };
}

export default async function KhonKaenPage() {
  console.log('🇹🇭 Loading Khon Kaen page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Thailand"
        city="Khon Kaen"
        initialBuilders={[]}
        initialContent={{
          id: 'th-khon-kaen',
          title: 'Exhibition Stand Builders in Khon Kaen',
          metaTitle: 'Khon Kaen Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Khon Kaen, Thailand. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Khon Kaen is a major regional trade center in Thailand, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Khon Kaen\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Khon Kaen\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Khon Kaen exhibition stands', 'Khon Kaen trade show builders', 'Khon Kaen exhibition builders', 'Khon Kaen booth design', 'Khon Kaen exhibition services', 'Thailand trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}