import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Spain | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Spain. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Spain`, `booth builders Spain`, `trade show displays Spain`, `Spain exhibition builders`, `Spain booth design`, `Spain exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Spain`,
      description: `Professional exhibition stand builders across Spain. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Spain`,
      description: `Professional exhibition stand builders across Spain. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/es`,
    },
  };
}

export default async function SpainPage() {
  console.log('🇪🇸 Loading Spain page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Spain"
        initialBuilders={[]}
        initialContent={{
          id: 'es-main',
          title: 'Exhibition Stand Builders in Spain',
          metaTitle: 'Spain Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders across Spain. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Spain is a thriving center for innovation and trade shows in Southern Europe, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Spain\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Spain\'s premier exhibition stand builders for trade show success across the country.',
          seoKeywords: ['Spain exhibition stands', 'Spain trade show builders', 'Spain exhibition builders', 'Spain booth design', 'Spain exhibition services', 'Southern Europe trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
