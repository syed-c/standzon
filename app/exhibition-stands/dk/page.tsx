import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Denmark | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Denmark. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Denmark`, `booth builders Denmark`, `trade show displays Denmark`, `Denmark exhibition builders`, `Denmark booth design`, `Denmark exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Denmark`,
      description: `Professional exhibition stand builders across Denmark. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Denmark`,
      description: `Professional exhibition stand builders across Denmark. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/dk`,
    },
  };
}

export default async function DenmarkPage() {
  console.log('🇩🇰 Loading Denmark page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Denmark"
        initialBuilders={[]}
        initialContent={{
          id: 'dk-main',
          title: 'Exhibition Stand Builders in Denmark',
          metaTitle: 'Denmark Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders across Denmark. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Denmark is a thriving center for innovation and trade shows in Northern Europe, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Denmark\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Denmark\'s premier exhibition stand builders for trade show success across the country.',
          seoKeywords: ['Denmark exhibition stands', 'Denmark trade show builders', 'Denmark exhibition builders', 'Denmark booth design', 'Denmark exhibition services', 'Northern Europe trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
