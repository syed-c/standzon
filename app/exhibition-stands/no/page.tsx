import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Norway | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Norway. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Norway`, `booth builders Norway`, `trade show displays Norway`, `Norway exhibition builders`, `Norway booth design`, `Norway exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Norway`,
      description: `Professional exhibition stand builders across Norway. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Norway`,
      description: `Professional exhibition stand builders across Norway. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/no`,
    },
  };
}

export default async function NorwayPage() {
  console.log('🇳🇴 Loading Norway page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Norway"
        initialBuilders={[]}
        initialContent={{
          id: 'no-main',
          title: 'Exhibition Stand Builders in Norway',
          metaTitle: 'Norway Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders across Norway. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Norway is a thriving center for innovation and trade shows in Northern Europe, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Norway\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Norway\'s premier exhibition stand builders for trade show success across the country.',
          seoKeywords: ['Norway exhibition stands', 'Norway trade show builders', 'Norway exhibition builders', 'Norway booth design', 'Norway exhibition services', 'Northern Europe trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
