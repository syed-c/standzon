import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountryCityPage from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Houston | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Houston, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Houston`, `booth builders Houston`, `trade show displays Houston`, `Houston exhibition builders`, `Houston booth design`, `Houston exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Houston`,
      description: `Professional exhibition stand builders in Houston, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Houston`,
      description: `Professional exhibition stand builders in Houston, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/us/houston`,
    },
  };
}

export default async function HoustonPage() {
  console.log('🇺🇸 Loading Houston page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="Houston"
        initialBuilders={[]}
        initialContent={{
          id: 'us-houston',
          title: 'Exhibition Stand Builders in Houston',
          metaTitle: 'Houston Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Houston, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Houston is the energy capital of the USA and a major aerospace hub, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Houston\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Houston\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Houston exhibition stands', 'Houston trade show builders', 'Houston exhibition builders', 'Houston booth design', 'Houston exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}