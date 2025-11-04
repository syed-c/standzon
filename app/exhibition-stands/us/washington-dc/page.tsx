import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Washington DC | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Washington DC, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Washington DC`, `booth builders Washington DC`, `trade show displays Washington DC`, `Washington DC exhibition builders`, `Washington DC booth design`, `Washington DC exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Washington DC`,
      description: `Professional exhibition stand builders in Washington DC, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Washington DC`,
      description: `Professional exhibition stand builders in Washington DC, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/us/washington-dc`,
    },
  };
}

export default async function WashingtonDCPage() {
  console.log('🇺🇸 Loading Washington DC page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="Washington DC"
        initialBuilders={[]}
        initialContent={{
          id: 'us-washington-dc',
          title: 'Exhibition Stand Builders in Washington DC',
          metaTitle: 'Washington DC Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Washington DC, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Washington DC is the capital of the USA and a major political hub, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Washington DC\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Washington DC\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Washington DC exhibition stands', 'Washington DC trade show builders', 'Washington DC exhibition builders', 'Washington DC booth design', 'Washington DC exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}