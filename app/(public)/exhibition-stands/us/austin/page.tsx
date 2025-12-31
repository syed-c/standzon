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
    title: `Exhibition Stand Builders in Austin | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Austin, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Austin`, `booth builders Austin`, `trade show displays Austin`, `Austin exhibition builders`, `Austin booth design`, `Austin exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Austin`,
      description: `Professional exhibition stand builders in Austin, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Austin`,
      description: `Professional exhibition stand builders in Austin, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/us/austin`,
    },
  };
}

export default async function AustinPage() {
  console.log('🇺🇸 Loading Austin page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="Austin"
        initialBuilders={[]}
        initialContent={{
          id: 'us-austin',
          title: 'Exhibition Stand Builders in Austin',
          metaTitle: 'Austin Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Austin, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Austin is a vibrant technology and music hub in Texas, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Austin\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Austin\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Austin exhibition stands', 'Austin trade show builders', 'Austin exhibition builders', 'Austin booth design', 'Austin exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}