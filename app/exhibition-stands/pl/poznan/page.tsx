import { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountryCityPage from '@/components/CountryCityPage';



// ✅ FIX: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Poznan | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Poznan, Poland. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Poznan`, `booth builders Poznan`, `trade show displays Poznan`, `Poznan exhibition builders`, `Poznan booth design`, `Poznan exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Poznan`,
      description: `Professional exhibition stand builders in Poznan, Poland. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Poznan`,
      description: `Professional exhibition stand builders in Poznan, Poland. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/pl/poznan`,
    },
  };
}

export default async function PoznanPage() {
  console.log('🇵🇱 Loading Poznan page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Poland"
        city="Poznan"
        initialBuilders={[]}
        initialContent={{
          id: 'pl-poznan',
          title: 'Exhibition Stand Builders in Poznan',
          metaTitle: 'Poznan Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Poznan, Poland. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Poznan is a major industrial and trade center in Poland, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Poznan\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Poznan\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Poznan exhibition stands', 'Poznan trade show builders', 'Poznan exhibition builders', 'Poznan booth design', 'Poznan exhibition services', 'Poland trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
