import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Kortrijk | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Kortrijk, Belgium. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Kortrijk`, `booth builders Kortrijk`, `trade show displays Kortrijk`, `Kortrijk exhibition builders`, `Kortrijk booth design`, `Kortrijk exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Kortrijk`,
      description: `Professional exhibition stand builders in Kortrijk, Belgium. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Kortrijk`,
      description: `Professional exhibition stand builders in Kortrijk, Belgium. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/be/kortrijk`,
    },
  };
}

export default async function KortrijkPage() {
  console.log('🇧🇪 Loading Kortrijk page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Belgium"
        city="Kortrijk"
        initialBuilders={[]}
        initialContent={{
          id: 'be-kortrijk',
          title: 'Exhibition Stand Builders in Kortrijk',
          metaTitle: 'Kortrijk Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Kortrijk, Belgium. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Kortrijk is a major industrial and trade center in Belgium, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Kortrijk\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Kortrijk\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Kortrijk exhibition stands', 'Kortrijk trade show builders', 'Kortrijk exhibition builders', 'Kortrijk booth design', 'Kortrijk exhibition services', 'Belgium trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}