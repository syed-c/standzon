import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in San Jose | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in San Jose, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands San Jose`, `booth builders San Jose`, `trade show displays San Jose`, `San Jose exhibition builders`, `San Jose booth design`, `San Jose exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in San Jose`,
      description: `Professional exhibition stand builders in San Jose, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in San Jose`,
      description: `Professional exhibition stand builders in San Jose, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/us/san-jose`,
    },
  };
}

export default async function SanJosePage() {
  console.log('🇺🇸 Loading San Jose page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="San Jose"
        initialBuilders={[]}
        initialContent={{
          id: 'us-san-jose',
          title: 'Exhibition Stand Builders in San Jose',
          metaTitle: 'San Jose Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in San Jose, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'San Jose is a major technology hub in Silicon Valley, California, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in San Jose\'s dynamic exhibition landscape.',
          heroContent: 'Partner with San Jose\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['San Jose exhibition stands', 'San Jose trade show builders', 'San Jose exhibition builders', 'San Jose booth design', 'San Jose exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}