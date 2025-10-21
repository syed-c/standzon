import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Jordan | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Jordan. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Jordan`, `booth builders Jordan`, `trade show displays Jordan`, `Jordan exhibition builders`, `Jordan booth design`, `Jordan exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Jordan`,
      description: `Professional exhibition stand builders across Jordan. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Jordan`,
      description: `Professional exhibition stand builders across Jordan. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/jordan`,
    },
  };
}

export default async function JordanPage() {
  console.log('🇯🇴 Loading Jordan page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Jordan"
        initialBuilders={[]}
        initialContent={{
          id: 'jordan-main',
          title: 'Exhibition Stand Builders in Jordan',
          metaTitle: 'Jordan Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders across Jordan. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Jordan is an important center for trade shows and exhibitions in the Middle East, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Jordan\'s growing exhibition landscape.',
          heroContent: 'Partner with Jordan\'s premier exhibition stand builders for trade show success across the country.',
          seoKeywords: ['Jordan exhibition stands', 'Jordan trade show builders', 'Jordan exhibition builders', 'Jordan booth design', 'Jordan exhibition services', 'Middle East trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}