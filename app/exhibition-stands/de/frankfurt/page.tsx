import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Frankfurt | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Frankfurt, Germany. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Frankfurt`, `booth builders Frankfurt`, `trade show displays Frankfurt`, `Frankfurt exhibition builders`, `Frankfurt booth design`, `Frankfurt exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Frankfurt`,
      description: `Professional exhibition stand builders in Frankfurt, Germany. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Frankfurt`,
      description: `Professional exhibition stand builders in Frankfurt, Germany. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/de/frankfurt`,
    },
  };
}

export default async function FrankfurtPage() {
  console.log('🇩🇪 Loading Frankfurt page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Germany"
        city="Frankfurt"
        initialBuilders={[]}
        initialContent={{
          id: 'de-frankfurt',
          title: 'Exhibition Stand Builders in Frankfurt',
          metaTitle: 'Frankfurt Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Frankfurt, Germany. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Frankfurt is a major financial and trade center in Germany, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Frankfurt\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Frankfurt\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Frankfurt exhibition stands', 'Frankfurt trade show builders', 'Frankfurt exhibition builders', 'Frankfurt booth design', 'Frankfurt exhibition services', 'Germany trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
