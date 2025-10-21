import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Sweden | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Sweden. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Sweden`, `booth builders Sweden`, `trade show displays Sweden`, `Sweden exhibition builders`, `Sweden booth design`, `Sweden exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Sweden`,
      description: `Professional exhibition stand builders across Sweden. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Sweden`,
      description: `Professional exhibition stand builders across Sweden. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/se`,
    },
  };
}

export default async function SwedenPage() {
  console.log('🇸🇪 Loading Sweden page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Sweden"
        initialBuilders={[]}
        initialContent={{
          id: 'se-main',
          title: 'Exhibition Stand Builders in Sweden',
          metaTitle: 'Sweden Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders across Sweden. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Sweden is a thriving center for innovation and trade shows in Northern Europe, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Sweden\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Sweden\'s premier exhibition stand builders for trade show success across the country.',
          seoKeywords: ['Sweden exhibition stands', 'Sweden trade show builders', 'Sweden exhibition builders', 'Sweden booth design', 'Sweden exhibition services', 'Northern Europe trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
