import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountryCityPage from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Warsaw | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Warsaw, Poland. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Warsaw`, `booth builders Warsaw`, `trade show displays Warsaw`, `Warsaw exhibition builders`, `Warsaw booth design`, `Warsaw exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Warsaw`,
      description: `Professional exhibition stand builders in Warsaw, Poland. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Warsaw`,
      description: `Professional exhibition stand builders in Warsaw, Poland. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/pl/warsaw`,
    },
  };
}

export default async function WarsawPage() {
  console.log('🇵🇱 Loading Warsaw page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Poland"
        city="Warsaw"
        initialBuilders={[]}
        initialContent={{
          id: 'pl-warsaw',
          title: 'Exhibition Stand Builders in Warsaw',
          metaTitle: 'Warsaw Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Warsaw, Poland. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Warsaw is the capital and major trade center of Poland, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Warsaw\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Warsaw\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Warsaw exhibition stands', 'Warsaw trade show builders', 'Warsaw exhibition builders', 'Warsaw booth design', 'Warsaw exhibition services', 'Poland trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
