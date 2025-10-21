import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Birmingham | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Birmingham, UK. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Birmingham`, `booth builders Birmingham`, `trade show displays Birmingham`, `Birmingham exhibition builders`, `Birmingham booth design`, `Birmingham exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Birmingham`,
      description: `Professional exhibition stand builders in Birmingham, UK. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Birmingham`,
      description: `Professional exhibition stand builders in Birmingham, UK. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/gb/birmingham`,
    },
  };
}

export default async function BirminghamPage() {
  console.log('🇬🇧 Loading Birmingham page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United Kingdom"
        city="Birmingham"
        initialBuilders={[]}
        initialContent={{
          id: 'gb-birmingham',
          title: 'Exhibition Stand Builders in Birmingham',
          metaTitle: 'Birmingham Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Birmingham, UK. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Birmingham is a major industrial and trade center in the United Kingdom, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Birmingham\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Birmingham\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Birmingham exhibition stands', 'Birmingham trade show builders', 'Birmingham exhibition builders', 'Birmingham booth design', 'Birmingham exhibition services', 'UK trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
