import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Finland | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Finland. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Finland`, `booth builders Finland`, `trade show displays Finland`, `Finland exhibition builders`, `Finland booth design`, `Finland exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Finland`,
      description: `Professional exhibition stand builders across Finland. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Finland`,
      description: `Professional exhibition stand builders across Finland. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/fi`,
    },
  };
}

export default async function FinlandPage() {
  console.log('🇫🇮 Loading Finland page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Finland"
        initialBuilders={[]}
        initialContent={{
          id: 'fi-main',
          title: 'Exhibition Stand Builders in Finland',
          metaTitle: 'Finland Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders across Finland. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Finland is a thriving center for innovation and trade shows in Northern Europe, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Finland\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Finland\'s premier exhibition stand builders for trade show success across the country.',
          seoKeywords: ['Finland exhibition stands', 'Finland trade show builders', 'Finland exhibition builders', 'Finland booth design', 'Finland exhibition services', 'Northern Europe trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
