import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Poland | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Poland. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Poland`, `booth builders Poland`, `trade show displays Poland`, `Poland exhibition builders`, `Poland booth design`, `Poland exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Poland`,
      description: `Professional exhibition stand builders across Poland. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Poland`,
      description: `Professional exhibition stand builders across Poland. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/pl`,
    },
  };
}

export default async function PolandPage() {
  console.log('🇵🇱 Loading Poland page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Poland"
        initialBuilders={[]}
        initialContent={{
          id: 'pl-main',
          title: 'Exhibition Stand Builders in Poland',
          metaTitle: 'Poland Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders across Poland. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Poland is a thriving center for innovation and trade shows in Central Europe, hosting significant events throughout the country. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Poland\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Poland\'s premier exhibition stand builders for trade show success across the country.',
          seoKeywords: ['Poland exhibition stands', 'Poland trade show builders', 'Poland exhibition builders', 'Poland booth design', 'Poland exhibition services', 'Central Europe trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
