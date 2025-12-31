import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import CountryCityPage from '@/components/public/CountryCityPage';



// ✅ FIX: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in San Francisco | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in San Francisco, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands San Francisco`, `booth builders San Francisco`, `trade show displays San Francisco`, `San Francisco exhibition builders`, `San Francisco booth design`, `San Francisco exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in San Francisco`,
      description: `Professional exhibition stand builders in San Francisco, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in San Francisco`,
      description: `Professional exhibition stand builders in San Francisco, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/us/san-francisco`,
    },
  };
}

export default async function SanFranciscoPage() {
  console.log('🇺🇸 Loading San Francisco page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="San Francisco"
        initialBuilders={[]}
        initialContent={{
          id: 'us-san-francisco',
          title: 'Exhibition Stand Builders in San Francisco',
          metaTitle: 'San Francisco Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in San Francisco, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'San Francisco is a major technology and finance hub in California, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in San Francisco\'s dynamic exhibition landscape.',
          heroContent: 'Partner with San Francisco\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['San Francisco exhibition stands', 'San Francisco trade show builders', 'San Francisco exhibition builders', 'San Francisco booth design', 'San Francisco exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}