import { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountryCityPage from '@/components/CountryCityPage';



// ✅ FIX: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Kielce | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Kielce, Poland. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Kielce`, `booth builders Kielce`, `trade show displays Kielce`, `Kielce exhibition builders`, `Kielce booth design`, `Kielce exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Kielce`,
      description: `Professional exhibition stand builders in Kielce, Poland. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Kielce`,
      description: `Professional exhibition stand builders in Kielce, Poland. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/pl/kielce`,
    },
  };
}

export default async function KielcePage() {
  console.log('🇵🇱 Loading Kielce page with modern UI...');
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country="Poland"
        city="Kielce"
        initialBuilders={[]}
        initialContent={{
          id: 'pl-kielce',
          title: 'Exhibition Stand Builders in Kielce',
          metaTitle: 'Kielce Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Kielce, Poland. Custom trade show displays, booth design, and professional exhibition services.',
          description: 'Kielce is a major industrial and trade center in Poland, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Kielce\'s dynamic exhibition landscape.',
          heroContent: 'Partner with Kielce\'s premier exhibition stand builders for trade show success in the city.',
          seoKeywords: ['Kielce exhibition stands', 'Kielce trade show builders', 'Kielce exhibition builders', 'Kielce booth design', 'Kielce exhibition services', 'Poland trade show displays']
        }}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
