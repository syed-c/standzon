import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Georgia | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Georgia, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Georgia`, `booth builders Georgia`, `trade show displays Georgia`, `Georgia exhibition builders`, `Georgia booth design`, `Georgia exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Georgia`,
      description: `Professional exhibition stand builders in Georgia, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Georgia`,
      description: `Professional exhibition stand builders in Georgia, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/us/georgia`,
    },
  };
}

export default async function GeorgiaPage() {
  console.log('🇺🇸 Loading Georgia page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="Georgia"
        initialBuilders={[]}
        initialContent={{
          id: 'us-georgia',
          title: 'Exhibition Stand Builders in Georgia',
          metaTitle: 'Georgia Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Georgia, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Georgia is a major logistics and film production hub in the southeastern United States, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Georgia\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Georgia\'s premier exhibition stand builders for trade show success in the state.',
          seoKeywords: ['Georgia exhibition stands', 'Georgia trade show builders', 'Georgia exhibition builders', 'Georgia booth design', 'Georgia exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}