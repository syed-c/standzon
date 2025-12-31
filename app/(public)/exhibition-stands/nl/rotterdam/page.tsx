import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import CountryCityPage from '@/components/public/CountryCityPage';

// ✅ FIX #1: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Rotterdam | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Rotterdam, Netherlands. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Rotterdam`, `booth builders Rotterdam`, `trade show displays Rotterdam`, `Rotterdam exhibition builders`, `Rotterdam booth design`, `Rotterdam exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Rotterdam`,
      description: `Professional exhibition stand builders in Rotterdam, Netherlands. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Rotterdam`,
      description: `Professional exhibition stand builders in Rotterdam, Netherlands. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/nl/rotterdam`,
    },
  };
}

export default async function RotterdamPage() {
  console.log('🇳🇱 Loading Rotterdam page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Netherlands"
        city="Rotterdam"
        initialBuilders={[]}
        initialContent={{
          id: 'nl-rotterdam',
          title: 'Exhibition Stand Builders in Rotterdam',
          metaTitle: 'Rotterdam Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Rotterdam, Netherlands. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Rotterdam is a major port and trade center in Netherlands, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Rotterdam\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Rotterdam\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Rotterdam exhibition stands', 'Rotterdam trade show builders', 'Rotterdam exhibition builders', 'Rotterdam booth design', 'Rotterdam exhibition services', 'Netherlands trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}