import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import CountryCityPage from '@/components/public/CountryCityPage';



// ✅ FIX: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Louisville | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Louisville, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Louisville`, `booth builders Louisville`, `trade show displays Louisville`, `Louisville exhibition builders`, `Louisville booth design`, `Louisville exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Louisville`,
      description: `Professional exhibition stand builders in Louisville, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Louisville`,
      description: `Professional exhibition stand builders in Louisville, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/us/louisville`,
    },
  };
}

export default async function LouisvillePage() {
  console.log('🇺🇸 Loading Louisville page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="Louisville"
        initialBuilders={[]}
        initialContent={{
          id: 'us-louisville',
          title: 'Exhibition Stand Builders in Louisville',
          metaTitle: 'Louisville Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Louisville, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Louisville is a major manufacturing and logistics hub in Kentucky, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Louisville\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Louisville\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Louisville exhibition stands', 'Louisville trade show builders', 'Louisville exhibition builders', 'Louisville booth design', 'Louisville exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}