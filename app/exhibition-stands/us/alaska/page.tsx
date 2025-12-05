import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Alaska | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Alaska, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Alaska`, `booth builders Alaska`, `trade show displays Alaska`, `Alaska exhibition builders`, `Alaska booth design`, `Alaska exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Alaska`,
      description: `Professional exhibition stand builders in Alaska, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Alaska`,
      description: `Professional exhibition stand builders in Alaska, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/us/alaska`,
    },
  };
}

export default async function AlaskaPage() {
  console.log('🇺🇸 Loading Alaska page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="Alaska"
        initialBuilders={[]}
        initialContent={{
          id: 'us-alaska',
          title: 'Exhibition Stand Builders in Alaska',
          metaTitle: 'Alaska Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Alaska, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Alaska is a unique state known for its natural resources and tourism, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Alaska\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Alaska\'s premier exhibition stand builders for trade show success in the state.',
          seoKeywords: ['Alaska exhibition stands', 'Alaska trade show builders', 'Alaska exhibition builders', 'Alaska booth design', 'Alaska exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}