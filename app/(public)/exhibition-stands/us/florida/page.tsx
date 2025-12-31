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
    title: `Exhibition Stand Builders in Florida | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Florida, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Florida`, `booth builders Florida`, `trade show displays Florida`, `Florida exhibition builders`, `Florida booth design`, `Florida exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Florida`,
      description: `Professional exhibition stand builders in Florida, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Florida`,
      description: `Professional exhibition stand builders in Florida, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/us/florida`,
    },
  };
}

export default async function FloridaPage() {
  console.log('🇺🇸 Loading Florida page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="United States"
        city="Florida"
        initialBuilders={[]}
        initialContent={{
          id: 'us-florida',
          title: 'Exhibition Stand Builders in Florida',
          metaTitle: 'Florida Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Florida, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Florida is a major tourist destination and business hub in the southeastern United States, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Florida\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Florida\'s premier exhibition stand builders for trade show success in the state.',
          seoKeywords: ['Florida exhibition stands', 'Florida trade show builders', 'Florida exhibition builders', 'Florida booth design', 'Florida exhibition services', 'USA trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}