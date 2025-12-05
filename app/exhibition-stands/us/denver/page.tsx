import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Denver | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Denver, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Denver`, `booth builders Denver`, `trade show displays Denver`, `Denver exhibition builders`, `Denver booth design`, `Denver exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Denver`,
      description: `Professional exhibition stand builders in Denver, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Denver`,
      description: `Professional exhibition stand builders in Denver, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/us/denver`,
    },
  };
}

export default async function DenverPage() {
  console.log('🇺🇸 Loading Denver page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="Denver"
        initialBuilders={[]}
        initialContent={{
          id: 'us-denver',
          title: 'Exhibition Stand Builders in Denver',
          metaTitle: 'Denver Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Denver, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Denver is the capital of Colorado and a major technology hub, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Denver\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Denver\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Denver exhibition stands', 'Denver trade show builders', 'Denver exhibition builders', 'Denver booth design', 'Denver exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}