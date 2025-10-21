import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in India | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across India. Custom trade show displays, booth design, and comprehensive exhibition services in Mumbai, New Delhi, Bangalore, Hyderabad, and more.`,
    keywords: [`exhibition stands India`, `booth builders India`, `trade show displays India`, `Mumbai exhibition builders`, `New Delhi booth design`, `Bangalore exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in India`,
      description: `Professional exhibition stand builders across India. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in India`,
      description: `Professional exhibition stand builders across India. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/india`,
    },
  };
}

export default async function IndiaPage() {
  console.log('🇮🇳 Loading India page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="India"
        initialBuilders={[]}
        initialContent={{
          id: 'india-main',
          title: 'Exhibition Stand Builders in India',
          metaTitle: 'India Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders across India. Custom trade show displays, booth design, and professional exhibition services in Mumbai, New Delhi, Bangalore, Hyderabad, and more.',
          description: 'India is a rapidly growing hub for international trade shows and exhibitions, hosting world-class events in Mumbai, New Delhi, Bangalore, Hyderabad, and other major cities. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in India\'s dynamic exhibition landscape.',
          heroContent: 'Partner with India\'s premier exhibition stand builders for trade show success across the country.',
          seoKeywords: ['India exhibition stands', 'Mumbai trade show builders', 'New Delhi exhibition builders', 'India booth design', 'Bangalore exhibition stands', 'Hyderabad trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}