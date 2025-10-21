import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Australia | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Australia. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Australia`, `booth builders Australia`, `trade show displays Australia`, `Australia exhibition builders`, `Australia booth design`, `Australia exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Australia`,
      description: `Professional exhibition stand builders across Australia. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Australia`,
      description: `Professional exhibition stand builders across Australia. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/au`,
    },
  };
}

export default async function AustraliaPage() {
  console.log('🇦🇺 Loading Australia page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Australia"
        initialBuilders={[]}
        initialContent={{
          id: 'au-main',
          title: 'Exhibition Stand Builders in Australia',
          metaTitle: 'Australia Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders across Australia. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Australia is a thriving center for innovation and trade shows in Oceania, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Australia\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Australia\'s premier exhibition stand builders for trade show success across the country.',
          seoKeywords: ['Australia exhibition stands', 'Australia trade show builders', 'Australia exhibition builders', 'Australia booth design', 'Australia exhibition services', 'Oceania trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
