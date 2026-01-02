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
    title: `Exhibition Stand Builders in San Antonio | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in San Antonio, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands San Antonio`, `booth builders San Antonio`, `trade show displays San Antonio`, `San Antonio exhibition builders`, `San Antonio booth design`, `San Antonio exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in San Antonio`,
      description: `Professional exhibition stand builders in San Antonio, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in San Antonio`,
      description: `Professional exhibition stand builders in San Antonio, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/us/san-antonio`,
    },
  };
}

export default async function SanAntonioPage() {
  console.log('🇺🇸 Loading San Antonio page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="San Antonio"
        initialBuilders={[]}
        initialContent={{
          id: 'us-san-antonio',
          title: 'Exhibition Stand Builders in San Antonio',
          metaTitle: 'San Antonio Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in San Antonio, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'San Antonio is a major tourism and military hub in Texas, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in San Antonio\'s dynamic exhibition landscape.',
          heroContent: 'Partner with San Antonio\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['San Antonio exhibition stands', 'San Antonio trade show builders', 'San Antonio exhibition builders', 'San Antonio booth design', 'San Antonio exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}