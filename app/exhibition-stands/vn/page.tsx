import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Vietnam | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Vietnam. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Vietnam`, `booth builders Vietnam`, `trade show displays Vietnam`, `Vietnam exhibition builders`, `Vietnam booth design`, `Vietnam exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Vietnam`,
      description: `Professional exhibition stand builders across Vietnam. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Vietnam`,
      description: `Professional exhibition stand builders across Vietnam. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/vn`,
    },
  };
}

export default async function VietnamPage() {
  console.log('🇻🇳 Loading Vietnam page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Vietnam"
        initialBuilders={[]}
        initialContent={{
          id: 'vn-main',
          title: 'Exhibition Stand Builders in Vietnam',
          metaTitle: 'Vietnam Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders across Vietnam. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Vietnam is a thriving center for innovation and trade shows in Southeast Asia, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Vietnam\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Vietnam\'s premier exhibition stand builders for trade show success across the country.',
          seoKeywords: ['Vietnam exhibition stands', 'Vietnam trade show builders', 'Vietnam exhibition builders', 'Vietnam booth design', 'Vietnam exhibition services', 'Southeast Asia trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
