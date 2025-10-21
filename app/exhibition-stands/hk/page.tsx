import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Hong Kong | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Hong Kong. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Hong Kong`, `booth builders Hong Kong`, `trade show displays Hong Kong`, `Hong Kong exhibition builders`, `Hong Kong booth design`, `Hong Kong exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Hong Kong`,
      description: `Professional exhibition stand builders across Hong Kong. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Hong Kong`,
      description: `Professional exhibition stand builders across Hong Kong. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/hk`,
    },
  };
}

export default async function HongKongPage() {
  console.log('🇭🇰 Loading Hong Kong page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Hong Kong"
        initialBuilders={[]}
        initialContent={{
          id: 'hk-main',
          title: 'Exhibition Stand Builders in Hong Kong',
          metaTitle: 'Hong Kong Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders across Hong Kong. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Hong Kong is a thriving center for innovation and trade shows in East Asia, hosting significant events throughout the region. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Hong Kong\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Hong Kong\'s premier exhibition stand builders for trade show success across the region.',
          seoKeywords: ['Hong Kong exhibition stands', 'Hong Kong trade show builders', 'Hong Kong exhibition builders', 'Hong Kong booth design', 'Hong Kong exhibition services', 'East Asia trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
