import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Switzerland | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Switzerland. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Switzerland`, `booth builders Switzerland`, `trade show displays Switzerland`, `Switzerland exhibition builders`, `Switzerland booth design`, `Switzerland exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Switzerland`,
      description: `Professional exhibition stand builders across Switzerland. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Switzerland`,
      description: `Professional exhibition stand builders across Switzerland. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/ch`,
    },
  };
}

export default async function SwitzerlandPage() {
  console.log('🇨🇭 Loading Switzerland page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Switzerland"
        initialBuilders={[]}
        initialContent={{
          id: 'ch-main',
          title: 'Exhibition Stand Builders in Switzerland',
          metaTitle: 'Switzerland Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders across Switzerland. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Switzerland is a thriving center for innovation and trade shows in Central Europe, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Switzerland\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Switzerland\'s premier exhibition stand builders for trade show success across the country.',
          seoKeywords: ['Switzerland exhibition stands', 'Switzerland trade show builders', 'Switzerland exhibition builders', 'Switzerland booth design', 'Switzerland exhibition services', 'Central Europe trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
