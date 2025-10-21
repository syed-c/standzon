import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Stuttgart | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Stuttgart, Germany. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Stuttgart`, `booth builders Stuttgart`, `trade show displays Stuttgart`, `Stuttgart exhibition builders`, `Stuttgart booth design`, `Stuttgart exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Stuttgart`,
      description: `Professional exhibition stand builders in Stuttgart, Germany. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Stuttgart`,
      description: `Professional exhibition stand builders in Stuttgart, Germany. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/de/stuttgart`,
    },
  };
}

export default async function StuttgartPage() {
  console.log('🇩🇪 Loading Stuttgart page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Germany"
        city="Stuttgart"
        initialBuilders={[]}
        initialContent={{
          id: 'de-stuttgart',
          title: 'Exhibition Stand Builders in Stuttgart',
          metaTitle: 'Stuttgart Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Stuttgart, Germany. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Stuttgart is a major industrial and trade center in Germany, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Stuttgart\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Stuttgart\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Stuttgart exhibition stands', 'Stuttgart trade show builders', 'Stuttgart exhibition builders', 'Stuttgart booth design', 'Stuttgart exhibition services', 'Germany trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
